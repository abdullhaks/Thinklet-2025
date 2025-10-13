import User from '../../models/user';
import Category from '../../models/category';
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

  const {password,...rest} = response;


    const accessToken = generateAccessToken({
      id: response._id.toString(),
      role: "user",
    });
    const refreshToken = generateRefreshToken({
      id: response._id.toString(),
      role: "user",
    });

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

  

  return {
    message: "Signup successful",
    user: newUser,
    accessToken,
    refreshToken
  };
};



export const loginUser = async (userData: userLoginRequestDto): Promise<any> => {
  console.log('user data from service....', userData);

  if (!userData.emailOrPhone || !userData.password) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'Please provide all required fields',
      code: 'MISSING_FIELDS',
    };
  }

  let existingUser = await User.findOne({ email: userData.emailOrPhone });
  if (!existingUser) {
    existingUser = await User.findOne({ phone: userData.emailOrPhone });
    if (!existingUser) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      };
    }
  }

  const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);
  if (!isPasswordValid) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    };
  }

  const accessToken = generateAccessToken({
    id: existingUser._id.toString(),
    role: 'user',
  });
  const refreshToken = generateRefreshToken({
    id: existingUser._id.toString(),
    role: 'user',
  });


  const { password, ...rest } = existingUser.toJSON();

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

  return {
    message: 'Login successful',
    user: newUser,
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