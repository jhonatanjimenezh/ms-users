import { ValidateOTPDto } from '../../infrastructure/dtos/request/validate-otp.dto';
import { OTPDomain } from '../entities/otp.domain';
import { OTP } from '../../infrastructure/schemas/otp.schema';

export class OTPMapper {
  static fromDtoToDomain(
    validateOTPDto: ValidateOTPDto,
    userUuid: string,
  ): OTPDomain {
    return new OTPDomain(
      validateOTPDto.identifier,
      validateOTPDto.otp,
      userUuid,
    );
  }

  static fromSchemaToDomain(otp: OTP): OTPDomain {
    return new OTPDomain(otp.uuid, otp.otp, otp.user_uuid, otp.isUsed);
  }

  static fromDomainToSchema(domain: OTPDomain): OTP {
    return new OTP({
      uuid: domain.identifier,
      otp: domain.otp,
      user_uuid: domain.user_uuid,
    });
  }
}
