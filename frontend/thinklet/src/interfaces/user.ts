export interface userResponseDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: string[];
  profile?:string
}