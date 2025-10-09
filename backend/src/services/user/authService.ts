import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userLoginRequestDto, userSignupRequestDto } from '../../dto/userDto';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { getSignedImageURL } from '../../helpers/uploadS3';

export const signupUser =   async (userData: userSignupRequestDto): Promise<any> =>{
    console.log("user data from service....", userData);

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.phone || 
      !userData.preferences.length
    ) {
      throw new Error("Please provide all required fields");
    }

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const existingUser = await User.findOne({email:userData.email});

    console.log("Existing user: ", existingUser);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const response = await User.create(userData);


    return {
      message: "Signup successful",
      user: response, 
    };
  }

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
  }