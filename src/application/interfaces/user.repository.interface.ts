import { UserDomain } from '../../domain/entities/user.domain';

export interface IUserRepository {
  create(user: UserDomain): Promise<UserDomain>;
  findByDocument(document: string): Promise<UserDomain | null>;
  findByEmail(email: string): Promise<UserDomain | null>;
}
