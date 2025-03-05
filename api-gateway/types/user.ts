import { User } from "../models/user";

export interface IUserService {
    findOneByEmail(email: string): Promise<User | null>;
}
