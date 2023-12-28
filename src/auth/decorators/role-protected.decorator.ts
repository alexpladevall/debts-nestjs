import { SetMetadata } from '@nestjs/common';
import { EValidRoles } from '../enums/valid-roles.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: EValidRoles[]) =>
  SetMetadata(META_ROLES, args);
