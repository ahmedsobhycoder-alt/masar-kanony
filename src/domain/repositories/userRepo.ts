import UserEntity from "../entities/userEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

export interface UserRepo {
    getUsers(query?: Record<string, any>): Promise<{ data: UserEntity[]; pagination?: QueryPagination }>;
    getUserById(id: string): Promise<UserEntity | null>;
    deleteUserById(id: string): Promise<UserEntity | null>;
    countDocuments(): Promise<number>;
}

export default UserRepo;
