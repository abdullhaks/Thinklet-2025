import { userLoginRequestDto, userSignupRequestDto } from "../../../dto/userDto";




export default interface IAuthService {
signupUser(userData: userSignupRequestDto): Promise<any>
loginUser(userData: userLoginRequestDto): Promise<any>
getAccessToken(refreshToken: string): Promise<any>




}