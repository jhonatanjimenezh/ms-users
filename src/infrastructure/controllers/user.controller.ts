import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { ResponseDto } from '../dtos/response/response.dto';
import { UserCreatedException } from '../../common/exceptions/user-created.exception';
import { UserAlreadyExistsException } from '../../common/exceptions/user-already-exists.exception';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const user = await this.userService.registerUser(createUserDto);
      return new ResponseDto({
        message: 'El usuario fue creado correctamente',
        data: user,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw error;
      }
      throw new UserCreatedException(
        `Error en la creación del usuario: ${error.message}`,
      );
    }
  }
}
