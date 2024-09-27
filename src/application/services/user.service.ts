import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserAlreadyExistsException } from '../../common/exceptions/user-already-exists.exception';
import { CreateUserDto } from '../../infrastructure/dtos/request/create-user.dto';
import { UserMapper } from '../../domain/mappers/user.mapper';
import { UserDto } from '../../infrastructure/dtos/response/user.dto';
import { AuthService } from './auth.service';
import { UserDomain } from '../../domain/entities/user.domain';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const userDomain = UserMapper.fromDtoToDomain(createUserDto);
    const existingUser = await this.findByDocument(userDomain.document);

    if (existingUser) {
      throw new UserAlreadyExistsException(
        `El usuario con documento ${userDomain.document} ya está registrado`,
      );
    }

    const userSave = await this.userRepository.create(userDomain);
    const userDto = UserMapper.fromDomainToDto(userSave);
    userDto.token = await this.authService.generateJwt(userDto.email);

    return userDto;
  }

  async findByDocument(document: string): Promise<UserDomain> {
    return await this.userRepository.findByDocument(document);
  }
}
