import bcrypt from "bcryptjs";
import {
  userLoginRequestDto,
  userSignupRequestDto,
} from "../../../dto/userDto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt";
import { HttpStatusCode } from "../../../utils/enum";
import IAuthService from "../../interfaces/user/IAuthService";
import { inject, injectable } from "inversify";
import IUserRepository from "../../../repositories/interfaces/IUserRepository";
import ICategoryRepository from "../../../repositories/interfaces/IcategoryRepository";
import { isValidObjectId } from "mongoose";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {}

 async signupUser(userData: userSignupRequestDto): Promise<any> {
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    confirmPassword,
    preferences,
  } = userData;

  const errors: string[] = [];

  // === 1. Required Fields ===
  if (!firstName?.trim()) errors.push('First name is required');
  if (!lastName?.trim()) errors.push('Last name is required');
  if (!phone?.trim()) errors.push('Phone number is required');
  if (!email?.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!confirmPassword) errors.push('Confirm password is required');
  if (!preferences || preferences.length === 0)
    errors.push('Preferences are required');

  if (errors.length > 0) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: errors.join(', '),
      code: 'MISSING_FIELDS',
    };
  }

  // === 2. Field Length & Format Validation ===

  // First Name
  const trimmedFirstName = firstName.trim();
  if (trimmedFirstName.length < 2)
    errors.push('First name must be at least 2 characters');
  if (trimmedFirstName.length > 50)
    errors.push('First name must be less than 50 characters');
  if (/[^a-zA-Z'-\s]/.test(trimmedFirstName))
    errors.push('First name contains invalid characters');

  // Last Name
  const trimmedLastName = lastName.trim();
  if (trimmedLastName.length < 2)
    errors.push('Last name must be at least 2 characters');
  if (trimmedLastName.length > 50)
    errors.push('Last name must be less than 50 characters');

  // Phone: Indian number validation
  const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
  const cleanPhone = phone.trim();
  if (!phoneRegex.test(cleanPhone))
    errors.push('Enter a valid 10-digit Indian phone number');

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(trimmedEmail))
    errors.push('Enter a valid email');
  if (trimmedEmail.length > 100)
    errors.push('Email must be less than 100 characters');

  // Password
  if (password.length < 8)
    errors.push('Password must be at least 8 characters');
  if (password.length > 128)
    errors.push('Password must be less than 128 characters');

  // Confirm Password
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  // Preferences
  if (preferences.length !== 3) {
    errors.push('Select exactly 3 preferences');
  } else {
    // Validate each preference ID
    for (const prefId of preferences) {
      if (!isValidObjectId(prefId)) {
        errors.push(`Invalid preference ID: ${prefId}`);
      }
    }
  }

  if (errors.length > 0) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: errors.join(', '),
      code: 'VALIDATION_ERROR',
    };
  }

  // === 3. Check for existing user ===
  const existingUser = await this._userRepository.findOne({
    email: trimmedEmail,
  });

  if (existingUser) {
    throw {
      status: HttpStatusCode.CONFLICT,
      message: 'This email is already registered',
      code: 'USER_EXISTS',
    };
  }

  // === 4. Validate Preference Categories Exist ===
  const validCategories = await this._categoryRepository.findAll({
    _id: { $in: preferences },
  });

  if (validCategories.length !== 3) {
    throw {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'One or more selected preferences are invalid',
      code: 'INVALID_PREFERENCE',
    };
  }

  // === 5. Hash Password ===
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // === 6. Create User ===
  const newUser = {
    ...userData,
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    phone: cleanPhone,
    email: trimmedEmail,
    password: hashedPassword,
    preferences,
  };

  const response = await this._userRepository.create(newUser);

  // === 7. Prepare Response ===
  const { password: _, ...userWithoutPassword } = response.toObject();

  const accessToken = generateAccessToken({
    id: response._id.toString(),
    role: 'user',
  });
  const refreshToken = generateRefreshToken({
    id: response._id.toString(),
    role: 'user',
  });

  const preferencesWithNames = await Promise.all(
    preferences.map(async (prefId: string) => {
      const cat = validCategories.find((c) => c._id.toString() === prefId);
      return { _id: cat?._id, name: cat?.name };
    }),
  );

  const userResponse = {
    _id: userWithoutPassword._id,
    firstName: userWithoutPassword.firstName,
    lastName: userWithoutPassword.lastName,
    phone: userWithoutPassword.phone,
    email: userWithoutPassword.email,
    profile: userWithoutPassword.profile || '',
    preferences: preferencesWithNames,
  };

  return {
    message: 'Signup successful',
    user: userResponse,
    accessToken,
    refreshToken,
  };
}

  async loginUser(userData: userLoginRequestDto): Promise<any> {
    console.log("user data from service....", userData);

    if (!userData.emailOrPhone || !userData.password) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Please provide all required fields",
        code: "MISSING_FIELDS",
      };
    }

    let existingUser = await this._userRepository.findOne({
      email: userData.emailOrPhone,
    });
    if (!existingUser) {
      existingUser = await this._userRepository.findOne({
        phone: userData.emailOrPhone,
      });
      if (!existingUser) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        };
      }
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      };
    }

    const accessToken = generateAccessToken({
      id: existingUser._id.toString(),
      role: "user",
    });
    const refreshToken = generateRefreshToken({
      id: existingUser._id.toString(),
      role: "user",
    });

    const { password, ...rest } = existingUser.toJSON();

    let preferences = await Promise.all(
      rest.preferences.map(async (prefId: string) => {
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
    };

    return {
      message: "Login successful",
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async getAccessToken(refreshToken: string): Promise<any> {
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
}
