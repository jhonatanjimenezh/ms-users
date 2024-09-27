import { UserDomain } from '../../../domain/entities/user.domain';

export class UserDto {
  uuid: string;
  document: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  otp: string;

  constructor(partial: Partial<UserDomain>) {
    this.uuid = partial.uuid;
    this.document = partial.document;
    this.name = partial.name;
    this.email = partial.email;
    this.phone = partial.phone;
  }
}
