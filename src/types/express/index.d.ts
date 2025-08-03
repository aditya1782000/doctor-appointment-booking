import { UserRole } from "../../users/entities/user.entity";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Express.Request {
  user: Express.User;
}
