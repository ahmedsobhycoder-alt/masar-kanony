import UserEntity from "../entities/userEntity";
import UserRepo from "../repositories/userRepo";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export class UserUseCases {
    private readonly userRepo: UserRepo;

    constructor({ userRepo }: { userRepo: UserRepo }) {
        this.userRepo = userRepo;
    }

    getUsers = async (query: Record<string, any> = {}): Promise<{ data: UserEntity[]; pagination?: QueryPagination }> =>
        this.userRepo.getUsers(query);

    getUserById = async (id: string): Promise<UserEntity | null> =>
        this.userRepo.getUserById(id);

    deleteUserById = async (id: string): Promise<UserEntity | null> =>
        this.userRepo.deleteUserById(id);

    countDocuments = async (): Promise<number> =>
        this.userRepo.countDocuments();
}

export default UserUseCases;
