import { Test, TestingModule } from '@nestjs/testing';
import { OTPController } from '../../../src/infrastructure/controllers/otp.controller';
import { OTPService } from '../../../src/application/services/otp.service';
import { JwtAuthGuard } from '../../../src/infrastructure/guards/jwt-auth.guard';
import { ValidateOTPDto } from '../../../src/infrastructure/dtos/request/validate-otp.dto';
import { OTPValidateException } from '../../../src/common/exceptions/otp-validate.exception';

describe('OTPController', () => {
  let otpController: OTPController;
  let otpService: OTPService;

  const mockOTPService = {
    generateOTP: jest.fn(),
    validateOTP: jest.fn(),
  };

  const mockRequest = {
    user: { email: 'test@example.com' },
  };

  const mockOTPDomain = {
    identifier: 'otp-identifier',
    otp: '123456',
    user_uuid: 'user-uuid-1234',
    isUsed: false,
  };

  const mockValidateOTPDto: ValidateOTPDto = {
    identifier: 'otp-identifier',
    otp: '123456',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OTPController],
      providers: [
        {
          provide: OTPService,
          useValue: mockOTPService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    otpController = module.get<OTPController>(OTPController);
    otpService = module.get<OTPService>(OTPService);
  });

  it('Debe estar definido', () => {
    expect(otpController).toBeDefined();
  });

  describe('generateOTP', () => {
    it('Debe generar un OTP exitosamente', async () => {
      mockOTPService.generateOTP.mockResolvedValue(mockOTPDomain);

      const result = await otpController.generateOTP(mockRequest);

      expect(otpService.generateOTP).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'OTP generado correctamente',
          data: mockOTPDomain,
          statusCode: 201,
        }),
      );
    });
  });

  describe('validateOTP', () => {
    it('Debe validar un OTP correctamente', async () => {
      mockOTPService.validateOTP.mockResolvedValue(true);

      const result = await otpController.validateOTP(
        mockRequest,
        mockValidateOTPDto,
      );

      expect(otpService.validateOTP).toHaveBeenCalledWith(
        mockValidateOTPDto,
        mockRequest.user,
      );
      expect(result).toEqual(
        expect.objectContaining({
          message: 'OTP validado correctamente',
          data: { isValid: true },
          statusCode: 200,
        }),
      );
    });

    it('Debe lanzar OTPValidateException si el OTP es inválido', async () => {
      mockOTPService.validateOTP.mockRejectedValue(
        new OTPValidateException('El OTP no es válido'),
      );

      await expect(
        otpController.validateOTP(mockRequest, mockValidateOTPDto),
      ).rejects.toThrow(OTPValidateException);

      expect(otpService.validateOTP).toHaveBeenCalledWith(
        mockValidateOTPDto,
        mockRequest.user,
      );
    });
  });
});
