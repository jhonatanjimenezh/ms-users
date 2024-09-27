export class OTPDomain {
  constructor(
    public readonly identifier: string,
    public readonly otp: string,
    public readonly user_uuid?: string,
    public isUsed?: boolean,
  ) {}

  useOTP() {
    if (this.isUsed) {
      throw new Error('OTP ya ha sido utilizado.');
    }
    this.isUsed = true;
  }
}
