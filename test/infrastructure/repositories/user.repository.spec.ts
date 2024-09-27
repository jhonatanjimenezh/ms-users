import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserRepository } from '../../../src/infrastructure/repositories/user.repository';
import { User } from '../../../src/infrastructure/schemas/user.schema';
import { UserDomain } from '../../../src/domain/entities/user.domain';
import { UserMapper } from '../../../src/domain/mappers/user.mapper';

const mockUserModel = {
  create: jest.fn(),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn(), // Mock de exec()
  }),
};

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: typeof mockUserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<typeof mockUserModel>(getModelToken(User.name));
  });

  it('Debe crear un usuario correctamente', async () => {
    const userDomain = new UserDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '987654321',
      'John Doe',
      'john.doe@example.com',
      '5551234567',
    );

    const savedUser = {
      ...userDomain,
      _id: 'some-id',
    };

    userModel.create.mockResolvedValue(savedUser);
    jest.spyOn(UserMapper, 'fromModelToDomain').mockReturnValue(userDomain);

    const result = await userRepository.create(userDomain);

    expect(userModel.create).toHaveBeenCalledWith(userDomain);
    expect(UserMapper.fromModelToDomain).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(userDomain);
  });

  it('Debe encontrar un usuario por documento', async () => {
    const userDomain = new UserDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '987654321',
      'John Doe',
      'john.doe@example.com',
      '5551234567',
    );

    userModel.findOne().exec.mockResolvedValue(userDomain);
    jest.spyOn(UserMapper, 'fromModelToDomain').mockReturnValue(userDomain);

    const result = await userRepository.findByDocument('987654321');

    expect(userModel.findOne).toHaveBeenCalledWith({ document: '987654321' });
    expect(UserMapper.fromModelToDomain).toHaveBeenCalledWith(userDomain);
    expect(result).toEqual(userDomain);
  });

  it('Debe encontrar un usuario por correo electrónico', async () => {
    const userDomain = new UserDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '987654321',
      'John Doe',
      'john.doe@example.com',
      '5551234567',
    );

    userModel.findOne().exec.mockResolvedValue(userDomain);
    jest.spyOn(UserMapper, 'fromModelToDomain').mockReturnValue(userDomain);

    const result = await userRepository.findByEmail('john.doe@example.com');

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'john.doe@example.com',
    });
    expect(UserMapper.fromModelToDomain).toHaveBeenCalledWith(userDomain);
    expect(result).toEqual(userDomain);
  });
});
