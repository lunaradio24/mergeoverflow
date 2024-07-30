import { SetMetadata } from '@nestjs/common';
import { Role } from '../../auth/types/role.type';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
