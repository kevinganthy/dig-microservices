import { User } from "../models/user";
import { IUserService } from "../types/user";

export class UserService implements IUserService {
  async findOneByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }
}