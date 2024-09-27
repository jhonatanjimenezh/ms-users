import { OTPDomain } from '../../domain/entities/otp.domain';

export interface IOTPRepository {
  createOTP(otpDomain: OTPDomain): Promise<OTPDomain>;
  findOTPAvailable(otpDomain: OTPDomain): Promise<OTPDomain>;
  markOTPAsUsed(otpDomain: OTPDomain): Promise<void>;
  disabledOTP(otpDomain: OTPDomain): Promise<void>;
}
