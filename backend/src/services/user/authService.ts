import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userLoginRequestDto, userSignupRequestDto } from '../../dto/userDto';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { getSignedImageURL } from '../../helpers/uploadS3';
import { HttpStatusCode } from '../../utils/enum';


export const signupUser = async (userData: userSignupRequestDto): Promise<any> => {
  console.log("user data from service....", userData);

  if (!userData.email || !userData.password || !userData.confirmPassword || !userData.firstName || !userData.lastName || !userData.phone || !userData.preferences.length) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Please provide all required fields",
      code: "MISSING_FIELDS"
    };
  }

  if (userData.password !== userData.confirmPassword) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Passwords do not match",
      code: "PASSWORD_MISMATCH"
    };
  }

  const existingUser = await User.findOne({ email: userData.email });
  console.log("Existing user: ", existingUser);
  if (existingUser) {
    throw {
      status: HttpStatusCode.CONFLICT,
      message: "User already exists",
      code: "USER_EXISTS"
    };
  }

  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  const response = await User.create(userData);


    const accessToken = generateAccessToken({
      id: response._id.toString(),
      role: "user",
    });
    const refreshToken = generateRefreshToken({
      id: response._id.toString(),
      role: "user",
    });


  

  return {
    message: "Signup successful",
    user: response,
    accessToken,
    refreshToken
  };
};



export  const loginUser =   async (userData: userLoginRequestDto): Promise<any>=> {
    console.log("user data from service....", userData);

    if (!userData.emailOrPhone || !userData.password) {
      throw new Error("Please provide all required fields");
    }

    let existingUser = await User.findOne({email:userData.emailOrPhone});
    console.log("Existing user: ", existingUser);

    if (!existingUser) {
     existingUser = await User.findOne({phone:userData.emailOrPhone});

     if (!existingUser) {
      console.log("Invalid credentials");

      throw new Error("Invalid credentials");
    }
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }


    const accessToken = generateAccessToken({
      id: existingUser._id.toString(),
      role: "user",
    });
    const refreshToken = generateRefreshToken({
      id: existingUser._id.toString(),
      role: "user",
    });

    if (existingUser.profile) {
      existingUser.profile = await getSignedImageURL(existingUser.profile);
    }

    // const userDTO = await UserMapper.toUserResponseDTO(existingUser);

    console.log("existingUser........", existingUser);
    return {
      message: "Login successful",
      user: existingUser,
      accessToken,
      refreshToken,
    };
  };


  export const getAccessToken = async (refreshToken: string): Promise<any> => {
    // console.log("Refresh token from service: ", refreshToken);
    if (!refreshToken) {
      throw new Error("refresh token not found");
    }

    const verified = verifyRefreshToken(refreshToken);

    // console.log("is verified from refresh token auth service...",verified);

    if (!verified) {
      throw new Error("Invalid refresh token");
    }

    // console.log("verified is ", verified);
    const accessToken = generateAccessToken({
      id: verified.id,
      role: verified.role,
    });

    // console.log("new access token is ...............",accessToken);

    return { accessToken };
  }