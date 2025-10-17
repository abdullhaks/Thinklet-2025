import { inject, injectable } from "inversify";
import IProfileController from "../../interfaces/user/IProfileController";
import IProfileService from "../../../services/interfaces/user/IProfileService";

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

@injectable()
export default class ProfileController implements IProfileController {

    constructor (
        @inject("IProfileService") private _profileService : IProfileService
    ){}







async updateProfileImageController(req:any, res:any): Promise<void> {
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

      const response = await this._profileService.updateProfileImageService (userId,profile);
       
    return res.status(200).json({ message: "Profile image updated successfully",userData: response.userData });
    } catch (error) {
        console.error("Error in updating profile image:", error);
        return res.status(500).json({ message: "Internal server error", code: "SERVER_ERROR" });
    }   
};


async updateProfileController(req: any, res: any): Promise<void> {
    try {
        const { userId, firstName, lastName, email, phone, preferences } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required", code: "NO_USER_ID" });
        }

        const profileData = {
            userId,
            firstName,
            lastName,
            email,
            phone,
            preferences: preferences,
        };

        const response = await this._profileService.updateProfileService(profileData);
        return res.status(200).json({ message: "Profile updated successfully", userData: response.userData });
    } catch (error: any) {
        console.error("Error in updating profile:", error);
        return res.status(error.status || 500).json({
            message: error.message || "Internal server error",
            code: error.code || "SERVER_ERROR",
        });
    }
};


}