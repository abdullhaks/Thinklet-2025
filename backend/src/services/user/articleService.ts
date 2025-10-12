import Article from '../../models/article';
import Interaction from '../../models/interaction';
import Category from '../../models/category';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { getSignedImageURL, uploadFileToS3 } from '../../helpers/uploadS3';
import { HttpStatusCode } from '../../utils/enum';
import { ArticleResponseDTO, IArticleData } from '../../dto/articleDto';
import { IPreference } from '../../dto/userDto';


interface IThumbnail {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}

interface aggregationResult   {

  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  author:{
    _id: string;
    firstName: string;
    lastName: string;
    profile?: string;
  };
  category: {
    _id: string;
    name: string;
  }


}



export const getArticleResponse = async (articleId: string, userId: string) => {
  // Step 1: Fetch article with populated references
  const article = await Article.findById(articleId)
    .populate('author', 'firstName lastName profile _id')
    .populate('category', 'name _id')
    .lean();

  if (!article) throw new Error('Article not found');
  const typedArticle: aggregationResult = JSON.parse( JSON.stringify(article) ); 

  // Step 2: Aggregate likes/dislikes count
  const [likesCount, dislikesCount] = await Promise.all([
    Interaction.countDocuments({ article: articleId, like: true }),
    Interaction.countDocuments({ article: articleId, dislike: true }),
  ]);

  // Step 3: Get user’s own interaction
  const userInteraction = await Interaction.findOne({
    article: articleId,
    user: userId,
  }).lean();

  const response: ArticleResponseDTO = {
    _id: typedArticle._id.toString(),
    title: typedArticle.title,
    description: typedArticle.description,
    thumbnail: typedArticle.thumbnail,
    tags: typedArticle.tags || [],
    category: {
      _id: typedArticle.category._id.toString(),
      name: typedArticle.category.name,
    },
    author: {
      _id: typedArticle.author._id.toString(),
      firstName: typedArticle.author.firstName,
      lastName: typedArticle.author.lastName,
      profile: typedArticle.author.profile,
    },
    likesCount,
    dislikesCount,
    userInteraction: {
      liked: userInteraction?.like || false,
      disliked: userInteraction?.dislike || false,
      blocked: userInteraction?.block || false,
    },
    createdAt: typedArticle.createdAt,
    updatedAt: typedArticle.updatedAt,
  };


  return response;
};




export const articleCreate = async (articleData:Partial<IArticleData>,thumbnail:IThumbnail|undefined): Promise<any> => {
  console.log("user data from service....", articleData);

  if (!articleData.title || !articleData.description || !articleData.category || !articleData.author ) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Please provide all required fields",
      code: "MISSING_FIELDS"
    };
  }

  const categoryExists = await Category.findById(articleData.category);
if (!categoryExists) {
  throw {
    status: HttpStatusCode.BAD_REQUEST,
    message: "Invalid category",
    code: "INVALID_CATEGORY"
  };
}

  let thumUrl = 'https://myhealth-app-storage.s3.ap-south-1.amazonaws.com/thinklet_thumbnails/download+(3).jfif'


  if (thumbnail) {
    let urls = await uploadFileToS3(
      thumbnail.buffer,
      thumbnail.originalname,
      "thinklet_thumbnails",
      thumbnail.mimetype
    );
if (urls) {
  thumUrl = urls.fileUrl;
}
let newArticle = {
    title: articleData.title,
    description: articleData.description,
    thumbnail: thumUrl,
    tags: articleData.tags,
    category: articleData.category,
    author: articleData.author
};


    let response =  await Article.create(newArticle);

    console.log("article created..",response);

  return {
    message: "article posted successfuly",
    article: response

  };
};

}

export const getPreferenceArticlesService = async (
  preferences: IPreference[],
  limit: number,
  articleSet: number,
  userId: string
): Promise<{ articles: ArticleResponseDTO[] }> => {
  try {
    if (!preferences || preferences.length === 0) {
      return { articles: [] };
    }

    const preferenceIds = preferences.map((pref) => pref._id);

    // Calculate skip for pagination
    const skip = (articleSet - 1) * limit;

    // Fetch articles matching preferences (via category or tags)
    const articles = await Article.find({
      $or: [
        { category: { $in: preferenceIds } },
        { tags: { $in: preferences.map((pref) => pref.name) } },
      ],
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Map articles to ArticleResponseDTO using getArticleResponse
    const formattedArticles = await Promise.all(
      articles.map(async (article) => {
        return await getArticleResponse(article._id.toString(), userId);
      })
    );

    return { articles: formattedArticles };
  } catch (error: any) {
    throw {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch preference articles',
      code: 'FETCH_ARTICLES_ERROR',
    };
  }
};