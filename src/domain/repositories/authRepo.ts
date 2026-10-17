import { HydratedDocument } from "mongoose";
import UserEntity from "../entities/userEntity";

interface AuthRepo {
    signup(userData : UserEntity) : Promise<void>
    verify(email:string,otp:string) : Promise<{
         user: UserEntity;
                token: string;
    }>;
    login(email:string, password: string): Promise<{
            user: UserEntity;
            token: string;
        }>;
    forgetPassword(email:string): Promise<void>;
    verifyResetCode(email: string, resetCode: string): Promise<void>
    resetPassword(email: string, newPassword: string) : Promise<void>
    logout(token: string): Promise<void>
    changePassword(user:HydratedDocument<UserEntity>,newPassword:string):Promise<UserEntity|null>
    // getAllUsers(query:any): Promise<UserEntity[]>;
    // getUserById(id:string):Promise<UserEntity>;
    // deleteUser(id:string):Promise<UserEntity>;
}
export default AuthRepo;