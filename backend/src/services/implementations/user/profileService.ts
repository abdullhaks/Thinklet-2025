import { inject, injectable } from "inversify";
import { uploadFileToS3 } from "../../../helpers/uploadS3";
import { HttpStatusCode } from "../../../utils/enum";
import IProfileService from "../../interfaces/user/IProfileService";
import IUserRepository from "../../../repositories/interfaces/IUserRepository";
import ICategoryRepository from "../../../repositories/interfaces/IcategoryRepository";
import bcrypt from 'bcryptjs';

interface IProfile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface IProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: string[];
}

@injectable()
export default class ProfileService implements IProfileService {
  
  constructor(
    @inject("IUserRepository") private _userRepository : IUserRepository,
    @inject("ICategoryRepository") private _categoryRepository : ICategoryRepository
  ){}



async updateProfileImageService(userId: string, profile: IProfile | undefined): Promise<any> {

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

            
            const updatedData = await this._userRepository.update(userId,{ profile: profileUrl })
            if (!updatedData) {
                throw {
                    status: HttpStatusCode.NOT_FOUND,
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                };

            }

            let { password, ...rest } = updatedData.toObject();

            let preferences = await Promise.all(
                rest.preferences.map(async (prefId:string) => {
                  
                  let prefData = await this._categoryRepository.findOne({ _id: prefId });
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
    


async updateProfileService(profileData: IProfileData): Promise<any> {
    const { userId, firstName, lastName, email, phone, preferences } = profileData;

    

    const updatedData = await this._userRepository.update(userId,{
            firstName,
            lastName,
            email,
            phone,
            preferences,
        });


    if (!updatedData) {
        throw {
            status: HttpStatusCode.NOT_FOUND,
            message: 'User not found',
            code: 'USER_NOT_FOUND',
        };
    }

    let { password, ...rest } = updatedData.toObject();

            let newPreferences = await Promise.all(
                rest.preferences.map(async (prefId:string) => {
                  let prefData = await this._categoryRepository.findOne({ _id: prefId });
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
        preferences: newPreferences,
    };

    return { userData: newUser };
};


async changePasswordService(userId: string, oldPassword: string, newPassword: string, confirmPassword: string): Promise<any> {
  
    const user = await this._userRepository.findOne({ _id: userId });
    if (!user) {
        throw {
            status: HttpStatusCode.NOT_FOUND,
            message: 'User not found',
            code: 'USER_NOT_FOUND',
        };
    }

    const isOldPasswordValid =  await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
        throw {
            status: HttpStatusCode.UNAUTHORIZED,
            message: 'Old password is incorrect',
            code: 'INVALID_OLD_PASSWORD',
        };
    }


    if (newPassword !== confirmPassword) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Passwords do not match",
      code: "PASSWORD_MISMATCH"
    };
  };


    const salt = await bcrypt.genSalt(10);
    let hashedPass = await bcrypt.hash(newPassword, salt);

    await this._userRepository.update(userId, { password: hashedPass });

    return { message: "Password changed successfully" };



}





}