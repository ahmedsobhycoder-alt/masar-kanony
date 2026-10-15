import UserEntity from "../entities/userEntity";
import UserRepo from "../repositories/userRepo";
import listType from "../../shared/constants/types";
import { HydratedDocument } from "mongoose";

export class UserUseCases {
    private readonly userRepo: UserRepo;

    constructor({ userRepo }: { userRepo: UserRepo }) {
        this.userRepo = userRepo;
    }

    getUsers = async (query: Record<string, any> = {}): Promise<listType<UserEntity>> =>
        this.userRepo.getUsers(query);

    getUserById = async (id: string): Promise<UserEntity | null> =>
        this.userRepo.getUserById(id);

    deleteUserById = async (id: string): Promise<UserEntity | null> =>
        this.userRepo.deleteUserById(id);
    updateUser = async (user: HydratedDocument<UserEntity>, body: Record<string, any>): Promise<UserEntity | null> =>

        this.userRepo.updateUser(user, body);
    verifyEmailChange = (user: HydratedDocument<UserEntity>, otp: string): Promise<UserEntity | null> => this.userRepo.verifyEmailChange(user, otp);
}

export default UserUseCases;
