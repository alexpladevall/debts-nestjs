import { Controller, Get } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { Auth, GetUser } from '../auth/decorators';
import { EValidRoles } from '../auth/enums/valid-roles.enum';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('searchusers')
  @Auth(EValidRoles.USER_ROLE)
  async searchUsers(@GetUser() user: User): Promise<User[]> {
    return await this.usersService.searchUsers(user);
  }
}
