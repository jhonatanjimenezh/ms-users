import { Test, TestingModule } from '@nestjs/testing';
import { OTPService } from '../../../src/application/services/otp.service';
import { OTPRepository } from '../../../src/infrastructure/repositories/otp.repository';
import { UserRepository } from '../../../src/infrastructure/repositories/user.repository';
import { OTPValidateException } from '../../../src/common/exceptions/otp-validate.exception';
import { UserAuthException } from '../../../src/common/exceptions/user-auth.exception';
import { OTPDomain } from '../../../src/domain/entities/otp.domain';
import { ValidateOTPDto } from '../../../src/infrastructure/dtos/request/validate-otp.dto';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-1234'),
}));

jest.mock('../../../src/common/utils/otp.util', () => ({
  generateOTP: jest.fn(() => '123456'),
}));

describe('OTPService', () => {
  let otpService: OTPService;
  let otpRepository: OTPRepository;
  let userRepository: UserRepository;

  const mockOTPRepository = {
    createOTP: jest.fn(),
    findOTPAvailable: jest.fn(),
    markOTPAsUsed: jest.fn(),
    disabledOTP: jest.fn(),
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
  };

  const userSession = { email: 'test@example.com' };
  const mockUser = { uuid: 'user-uuid-1234', email: 'test@example.com' };
  const mockOTPDomain = new OTPDomain(
    'uuid-1234',
    '123456',
    mockUser.uuid,
    false,
  );
  const validateOTPDto: ValidateOTPDto = {
    identifier: 'uuid-1234',
    otp: '123456',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OTPService,
        {
          provide: OTPRepository,
          useValue: mockOTPRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    otpService = module.get<OTPService>(OTPService);
    otpRepository = module.get<OTPRepository>(OTPRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('Debe estar definido', () => {
    expect(otpService).toBeDefined();
  });

  describe('generateOTP', () => {
    it('Debe generar un OTP para el usuario de la sesión', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockOTPRepository.createOTP.mockResolvedValue(mockOTPDomain);

      const result = await otpService.generateOTP(userSession);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        userSession.email,
      );
      expect(otpRepository.disabledOTP).toHaveBeenCalledWith(
        expect.any(OTPDomain),
      );
      expect(otpRepository.createOTP).toHaveBeenCalledWith(
        expect.any(OTPDomain),
      );
      expect(result).toEqual(mockOTPDomain);
    });

    it('Debe lanzar UserAuthException si no se encuentra el usuario', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(otpService.generateOTP(userSession)).rejects.toThrow(
        UserAuthException,
      );

      expect(otpRepository.createOTP).not.toHaveBeenCalled();
    });
  });

  describe('validateOTP', () => {
    it('Debe validar correctamente un OTP', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockOTPRepository.findOTPAvailable.mockResolvedValue(mockOTPDomain);

      const result = await otpService.validateOTP(validateOTPDto, userSession);

      expect(otpRepository.findOTPAvailable).toHaveBeenCalledWith(
        expect.any(OTPDomain),
      );
      expect(otpRepository.markOTPAsUsed).toHaveBeenCalledWith(mockOTPDomain);
      expect(result).toBe(true);
    });

    it('Debe lanzar OTPValidateException si el OTP no es válido', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockOTPRepository.findOTPAvailable.mockResolvedValue(null);

      await expect(
        otpService.validateOTP(validateOTPDto, userSession),
      ).rejects.toThrow(OTPValidateException);

      expect(otpRepository.markOTPAsUsed).not.toHaveBeenCalled();
    });

    it('Debe lanzar UserAuthException si no se encuentra el usuario en la sesión', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        otpService.validateOTP(validateOTPDto, userSession),
      ).rejects.toThrow(UserAuthException);

      expect(otpRepository.findOTPAvailable).not.toHaveBeenCalled();
      expect(otpRepository.markOTPAsUsed).not.toHaveBeenCalled();
    });
  });
});
