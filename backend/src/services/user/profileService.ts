import { uploadFileToS3 } from "../../helpers/uploadS3";
import Category from "../../models/category";
import User from "../../models/user";
import { HttpStatusCode } from "../../utils/enum";

interface IProfile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}



export const updateProfileImageService = async (userId: string, profile: IProfile | undefined): Promise<any> => {

 

        let profileUrl: string | undefined = undefined;
        if (profile) {
              const uploadResult = await uploadFileToS3(
                profile.buffer,
                profile.originalname,
                'thinklet_profiles',
                profile.mimetype
              );
              if (!uploadResult?.fileUrl) {
                throw {
                  status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                  message: 'Failed to upload profile',
                  code: 'profile_UPLOAD_FAILED',
                };
              }
              profileUrl = uploadResult.fileUrl;
            };

            if(profileUrl){

            const updatedData = await User.findByIdAndUpdate(userId, { profile: profileUrl }, { new: true });
            if (!updatedData) {
                throw {
                    status: HttpStatusCode.NOT_FOUND,
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                };

            }

            let { password, ...rest } = updatedData.toObject();

            let preferences = await Promise.all(
                rest.preferences.map(async (prefId) => {
                  let prefData = await Category.findOne({ _id: prefId });
                  return { _id: prefData?._id, name: prefData?.name };
                })
              );
            
              let newUser = {
                _id: rest._id,
                firstName: rest.firstName,
                lastName: rest.lastName,
                phone: rest.phone,
                email: rest.email,
                profile: rest.profile || "",
                preferences: preferences,
              }

            return { userData: newUser};
       
        }else{
            throw {
                status: HttpStatusCode.BAD_REQUEST,
                message: 'No profile image provided',
                code: 'NO_PROFILE_IMAGE'
            };
        }

    }
    
