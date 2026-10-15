import UserEntity from "../entities/userEntity";
import listType from "../../shared/constants/types";
import { HydratedDocument } from "mongoose";

export interface UserRepo {
    getUsers(query?: Record<string, any>): Promise<listType<UserEntity>>;
    getUserById(id: string): Promise<UserEntity | null>;
    deleteUserById(id: string): Promise<UserEntity | null>;
    updateUser(user:HydratedDocument<UserEntity>,body: Record<string, any>): Promise<UserEntity|null>;
    verifyEmailChange(user:HydratedDocument<UserEntity>,otp: string): Promise<UserEntity|null>;
}

export default UserRepo;
