import { UserRole } from '../../generated/prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  tokenVersion: number;
}
