import { User } from '../User';

declare global {
    namespace Express {
      interface Request {
        user: User | null,
        token: string | null,
   }
 }
}