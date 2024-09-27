import { Injectable } from '@nestjs/common';
import { OTPValidateException } from '../../common/exceptions/otp-validate.exception';
import { UserAuthException } from '../../common/exceptions/user-auth.exception';
import { generateOTP } from '../../common/utils/otp.util';
import { OTPDomain } from '../../domain/entities/otp.domain';
import { OTPMapper } from '../../domain/mappers/otp.mapper';
import { ValidateOTPDto } from '../../infrastructure/dtos/request/validate-otp.dto';
import { OTPRepository } from '../../infrastructure/repositories/otp.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OTPService {
  constructor(
    private readonly otpRepository: OTPRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async generateOTP(userSession: any): Promise<OTPDomain> {
    const uuid = uuidv4();
    const otp = generateOTP();
    const userUuid = await this.getUserSession(userSession);
    const otpDomain = new OTPDomain(uuid, otp, userUuid, false);

    await this.otpRepository.disabledOTP(otpDomain);
    return this.otpRepository.createOTP(otpDomain);
  }

  async validateOTP(
    validateOTPDto: ValidateOTPDto,
    userSession: any,
  ): Promise<boolean> {
    const userUuid = await this.getUserSession(userSession);
    const optDomain = OTPMapper.fromDtoToDomain(validateOTPDto, userUuid);
    const otpResponse = await this.otpRepository.findOTPAvailable(optDomain);
    if (!otpResponse) {
      throw new OTPValidateException(
        'Los datos de verificación del opt no son validos',
      );
    }

    otpResponse.useOTP();
    await this.otpRepository.markOTPAsUsed(otpResponse);

    return true;
  }

  async getUserSession(userSession: any): Promise<string> {
    if (userSession.email) {
      const user = await this.userRepository.findByEmail(userSession.email);
      if (!user) {
        throw new UserAuthException();
      }
      return user.uuid;
    }
    throw new UserAuthException();
  }
}
