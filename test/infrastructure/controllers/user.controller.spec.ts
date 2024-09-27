import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/infrastructure/controllers/user.controller';
import { UserService } from '../../../src/application/services/user.service';
import { CreateUserDto } from '../../../src/infrastructure/dtos/request/create-user.dto';
import { UserCreatedException } from '../../../src/common/exceptions/user-created.exception';
import { UserAlreadyExistsException } from '../../../src/common/exceptions/user-already-exists.exception';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    registerUser: jest.fn(),
  };

  const mockCreateUserDto: CreateUserDto = {
    document: '1234567890',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
  };

  const mockUserResponse = {
    uuid: 'user-uuid-123',
    document: '1234567890',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
    token: 'jwt-token-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('Debe estar definido', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('Debe registrar un nuevo usuario exitosamente', async () => {
      mockUserService.registerUser.mockResolvedValue(mockUserResponse);

      const result = await userController.register(mockCreateUserDto);

      expect(userService.registerUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'El usuario fue creado correctamente',
          data: mockUserResponse,
          statusCode: HttpStatus.CREATED,
        }),
      );
    });

    it('Debe lanzar UserCreatedException si ocurre un error en la creación', async () => {
      mockUserService.registerUser.mockRejectedValue(
        new Error('Error inesperado'),
      );

      await expect(userController.register(mockCreateUserDto)).rejects.toThrow(
        UserCreatedException,
      );

      expect(userService.registerUser).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('Debe lanzar UserAlreadyExistsException si el usuario ya existe', async () => {
      mockUserService.registerUser.mockRejectedValue(
        new UserAlreadyExistsException('El usuario ya está registrado'),
      );

      await expect(userController.register(mockCreateUserDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );

      expect(userService.registerUser).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });
});
