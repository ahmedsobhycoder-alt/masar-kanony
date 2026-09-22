import UserEntity from "../../../domain/entities/userEntity";
import UserRepo from "../../../domain/repositories/userRepo";
import UserModel from "../models/userModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";

class UserRepoImpl implements UserRepo {
    async countDocuments(): Promise<number> {
        return await UserModel.find().clone().countDocuments();
    }

    async getUsers(query: Record<string, any> = {}): Promise<{ data: UserEntity[]; pagination?: QueryPagination }> {
        const queryBuilder = new QueryBuilder<UserEntity>(UserModel.find().select("-password"), query)
            .filter();

        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();

        queryBuilder
            .paginate(totalDocuments)
            .sort()
            .limitFields();

        const users = await queryBuilder.mongooseQuery.lean();

        return {
            data: users as UserEntity[],
            pagination: queryBuilder.pagination,
        };
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findById(id).select("-password").lean();
        return user ? (user as UserEntity) : null;
    }

    async deleteUserById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findByIdAndDelete(id).select("-password");
        return user ? (user.toJSON() as UserEntity) : null;
    }
}

const userRepoImpl = new UserRepoImpl();
export default userRepoImpl;
export { UserRepoImpl };
