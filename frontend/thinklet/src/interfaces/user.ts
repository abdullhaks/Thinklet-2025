export interface IPreference{
  _id:string;
  name:string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  profile?: string;
  preferences: IPreference[]; 
};


