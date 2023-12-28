import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { CommonService } from '../common/common.service';
import { EValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly commonService: CommonService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    try {
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      return user;
    } catch (error: unknown) {
      this.commonService.handleDBExceptions(error);
    }
  }

  async searchUsers(user: User): Promise<User[]> {
    return await this.userModel.find({
      _id: { $ne: user._id },
      role: EValidRoles.USER_ROLE,
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username }, 'password active')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }
}
