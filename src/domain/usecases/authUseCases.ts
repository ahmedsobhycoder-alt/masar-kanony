import UserEntity from "../entities/userEntity";
import UserRepo from "../repositories/authRepo";

export class AuthUseCases {
    private readonly userRepo: UserRepo;

    constructor({ userRepo }: { userRepo: UserRepo }) {
        this.userRepo = userRepo;
    }

    signup = async (userData: UserEntity): Promise<void> =>
        this.userRepo.signup(userData);

    verify = async (email:string,code: string): Promise<{ user: UserEntity; token: string }> =>
        this.userRepo.verify(email,code);

    login = async (email: string, password: string): Promise<{
            user: UserEntity;
            token: string;
        }> =>
        this.userRepo.login(email, password);

    forgetPassword = async (email: string): Promise<void> =>
        this.userRepo.forgetPassword(email);
    verifyResetCode = async (email: string, resetCode: string) =>
        this.userRepo.verifyResetCode(email, resetCode);
    resetPassword = async (email: string, newPassword: string) => this.userRepo.resetPassword(email, newPassword);
    logout = async (token: string): Promise<void> => this.userRepo.logout(token);

    // getAllUsers = async (query: Record<string, any> = {}): Promise<UserEntity[]> =>
    //     this.userRepo.getAllUsers(query);

    // getUserById = async (id: string): Promise<UserEntity> =>
    //     this.userRepo.getUserById(id);

    // deleteUser = async (id: string): Promise<UserEntity> =>
    //     this.userRepo.deleteUser(id);
}

export default AuthUseCases;
