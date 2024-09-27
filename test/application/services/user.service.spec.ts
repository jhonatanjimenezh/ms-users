import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/application/services/user.service';
import { UserRepository } from '../../../src/infrastructure/repositories/user.repository';
import { AuthService } from '../../../src/application/services/auth.service';
import { UserAlreadyExistsException } from '../../../src/common/exceptions/user-already-exists.exception';
import { CreateUserDto } from '../../../src/infrastructure/dtos/request/create-user.dto';
import { UserDomain } from '../../../src/domain/entities/user.domain';
import { UserMapper } from '../../../src/domain/mappers/user.mapper';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-1234'),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let authService: AuthService;

  const mockUserRepository = {
    create: jest.fn(),
    findByDocument: jest.fn(),
  };

  const mockAuthService = {
    generateJwt: jest.fn(),
  };

  const mockCreateUserDto: CreateUserDto = {
    document: '1234567890',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
  };

  const mockUserDomain: UserDomain = new UserDomain(
    'uuid-1234',
    '1234567890',
    'John Doe',
    'john.doe@example.com',
    '5551234567',
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    authService = module.get<AuthService>(AuthService);
  });

  it('Debe estar definido', () => {
    expect(userService).toBeDefined();
  });

  describe('registerUser', () => {
    it('Debe registrar un nuevo usuario exitosamente', async () => {
      mockUserRepository.findByDocument.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUserDomain);
      mockAuthService.generateJwt.mockResolvedValue('jwt-token-123');

      const result = await userService.registerUser(mockCreateUserDto);

      expect(userRepository.findByDocument).toHaveBeenCalledWith(
        mockCreateUserDto.document,
      );
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          document: mockCreateUserDto.document,
          name: mockCreateUserDto.name,
          email: mockCreateUserDto.email,
          phone: mockCreateUserDto.phone,
        }),
      );
      expect(authService.generateJwt).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );

      expect(result).toEqual({
        ...UserMapper.fromDomainToDto(mockUserDomain),
        token: 'jwt-token-123',
      });
    });

    it('Debe lanzar una excepción si el usuario ya existe', async () => {
      mockUserRepository.findByDocument.mockResolvedValue(mockUserDomain);

      await expect(userService.registerUser(mockCreateUserDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );

      expect(userRepository.create).not.toHaveBeenCalled();
      expect(authService.generateJwt).not.toHaveBeenCalled();
    });
  });

  describe('findByDocument', () => {
    it('Debe encontrar un usuario por documento', async () => {
      mockUserRepository.findByDocument.mockResolvedValue(mockUserDomain);

      const result = await userService.findByDocument(
        mockCreateUserDto.document,
      );

      expect(userRepository.findByDocument).toHaveBeenCalledWith(
        mockCreateUserDto.document,
      );
      expect(result).toEqual(mockUserDomain);
    });
  });
});
