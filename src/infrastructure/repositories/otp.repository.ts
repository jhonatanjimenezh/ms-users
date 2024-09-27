import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP } from '../schemas/otp.schema';
import { IOTPRepository } from 'src/application/interfaces/otp.repository.interface';
import { OTPDomain } from '../../domain/entities/otp.domain';
import { OTPMapper } from '../../domain/mappers/otp.mapper';

@Injectable()
export class OTPRepository implements IOTPRepository {
  constructor(@InjectModel(OTP.name) private otpModel: Model<OTP>) {}

  async createOTP(otpDomain: OTPDomain): Promise<OTPDomain> {
    const createdOTP = await this.otpModel.create(otpDomain);
    return OTPMapper.fromSchemaToDomain(createdOTP);
  }

  async findOTPAvailable(otpDomain: OTPDomain): Promise<OTPDomain> {
    const otp = await this.otpModel.findOne({
      uuid: otpDomain.identifier,
      otp: otpDomain.otp,
      user_uuid: otpDomain.user_uuid,
      isUsed: false,
    });

    return otp ? OTPMapper.fromSchemaToDomain(otp) : null;
  }

  async markOTPAsUsed(otpDomain: OTPDomain): Promise<void> {
    await this.otpModel.updateOne(
      {
        uuid: otpDomain.identifier,
        otp: otpDomain.otp,
        user_uuid: otpDomain.user_uuid,
        isUsed: false,
      },
      { isUsed: true },
    );
  }

  async disabledOTP(otpDomain: OTPDomain): Promise<void> {
    await this.otpModel.updateOne(
      {
        user_uuid: otpDomain.user_uuid,
      },
      { isUsed: true },
    );
  }
}
