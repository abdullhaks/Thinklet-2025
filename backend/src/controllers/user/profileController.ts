import { updateProfileImageService } from "../../services/user/profileService";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

type MulterFiles = {
  [fieldname: string]: MulterFile[];
};

export const updateProfileImageController = async (req:any, res:any) => {
    try {
        if (!req.body.userId || !req.files || !req.files['profile'] || req.files['profile'].length === 0) {
            return res.status(400).json({ message: "No profile image uploaded", code: "NO_FILE" });
        }
        const profileImage =  (req.files as MulterFiles)
        ?.profile?.[0];


     
      const profile =  profileImage
          ? {
              buffer: profileImage.buffer,
              originalname: profileImage.originalname,
              mimetype: profileImage.mimetype,
            }
          : undefined
      const userId = req.body.userId;

      const response = await updateProfileImageService (userId,profile);
       
    return res.status(200).json({ message: "Profile image updated successfully",userData: response.userData });
    } catch (error) {
        console.error("Error in updating profile image:", error);
        return res.status(500).json({ message: "Internal server error", code: "SERVER_ERROR" });
    }   
};