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

export default interface IProfileService {
  updateProfileImageService(
    userId: string,
    profile: IProfile | undefined
  ): Promise<any>;
  updateProfileService(profileData: IProfileData): Promise<any>;
  changePasswordService(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<any>;
}
