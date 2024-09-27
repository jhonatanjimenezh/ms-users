import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../infrastructure/dtos/request/create-user.dto';
import { User } from '../../infrastructure/schemas/user.schema';
import { UserDto } from '../../infrastructure/dtos/response/user.dto';
import { UserDomain } from '../entities/user.domain';

export class UserMapper {
  static fromDtoToDomain(createUserDto: CreateUserDto): UserDomain {
    return new UserDomain(
      uuidv4(),
      createUserDto.document,
      createUserDto.name,
      createUserDto.email,
      createUserDto.phone,
    );
  }

  static fromModelToDomain(user: User): UserDomain {
    return new UserDomain(
      user.uuid,
      user.document,
      user.name,
      user.email,
      user.phone,
    );
  }

  static fromDomainToDto(userDomain: UserDomain): UserDto {
    return new UserDto({
      uuid: userDomain.uuid,
      document: userDomain.document,
      name: userDomain.name,
      email: userDomain.email,
      phone: userDomain.phone,
    });
  }
}
