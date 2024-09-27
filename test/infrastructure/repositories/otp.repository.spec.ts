import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OTPRepository } from '../../../src/infrastructure/repositories/otp.repository';
import { OTP } from '../../../src/infrastructure/schemas/otp.schema';
import { OTPDomain } from '../../../src/domain/entities/otp.domain';
import { OTPMapper } from '../../../src/domain/mappers/otp.mapper';

const mockOTPModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
};

describe('OTPRepository', () => {
  let otpRepository: OTPRepository;
  let otpModel: typeof mockOTPModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OTPRepository,
        {
          provide: getModelToken(OTP.name),
          useValue: mockOTPModel,
        },
      ],
    }).compile();

    otpRepository = module.get<OTPRepository>(OTPRepository);
    otpModel = module.get<typeof mockOTPModel>(getModelToken(OTP.name));
  });

  it('Debe crear un OTP correctamente', async () => {
    const otpDomain = new OTPDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '123456',
      'user-uuid-example',
    );

    const savedOTP = {
      ...otpDomain,
      _id: 'some-id',
    };

    otpModel.create.mockResolvedValue(savedOTP);

    jest.spyOn(OTPMapper, 'fromSchemaToDomain').mockReturnValue(otpDomain);

    const result = await otpRepository.createOTP(otpDomain);

    expect(otpModel.create).toHaveBeenCalledWith(otpDomain);

    expect(OTPMapper.fromSchemaToDomain).toHaveBeenCalledWith(savedOTP);

    expect(result).toEqual(otpDomain);
  });

  it('Debe encontrar un OTP disponible', async () => {
    const otpDomain = new OTPDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '123456',
      'user-uuid-example',
    );

    otpModel.findOne.mockResolvedValue(otpDomain);
    jest.spyOn(OTPMapper, 'fromSchemaToDomain').mockReturnValue(otpDomain);

    const result = await otpRepository.findOTPAvailable(otpDomain);

    expect(otpModel.findOne).toHaveBeenCalledWith({
      uuid: otpDomain.identifier,
      otp: otpDomain.otp,
      user_uuid: otpDomain.user_uuid,
      isUsed: false,
    });
    expect(result).toEqual(otpDomain);
  });

  it('Debe marcar un OTP como usado', async () => {
    const otpDomain = new OTPDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '123456',
      'user-uuid-example',
    );

    otpModel.updateOne.mockResolvedValue({ n: 1, nModified: 1, ok: 1 });

    await otpRepository.markOTPAsUsed(otpDomain);

    expect(otpModel.updateOne).toHaveBeenCalledWith(
      {
        uuid: otpDomain.identifier,
        otp: otpDomain.otp,
        user_uuid: otpDomain.user_uuid,
        isUsed: false,
      },
      { isUsed: true },
    );
  });

  it('Debe deshabilitar todos los OTP de un usuario', async () => {
    const otpDomain = new OTPDomain(
      '123e4567-e89b-12d3-a456-426614174000',
      '123456',
      'user-uuid-example',
    );

    otpModel.updateOne.mockResolvedValue({ n: 1, nModified: 1, ok: 1 });

    await otpRepository.disabledOTP(otpDomain);

    expect(otpModel.updateOne).toHaveBeenCalledWith(
      { user_uuid: otpDomain.user_uuid },
      { isUsed: true },
    );
  });
});
