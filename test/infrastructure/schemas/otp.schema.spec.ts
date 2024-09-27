import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { OTP, OTPSchema } from '../../../src/infrastructure/schemas/otp.schema';
import { Model, Connection } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('OTP Schema', () => {
  let otpModel: Model<OTP>;
  let mongod: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    if (connection) await connection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
      ],
    }).compile();

    otpModel = module.get<Model<OTP>>(getModelToken(OTP.name));
    connection = module.get<Connection>(getConnectionToken());
  });

  afterEach(async () => {
    const collections = await connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });

  it('Debe crear un OTP con todos los campos requeridos', async () => {
    const otpData = {
      otp: '123456',
      user_uuid: 'user-uuid-example',
      isUsed: false,
    };
    const otp = new otpModel(otpData);
    const savedOTP = await otp.save();

    expect(savedOTP.uuid).toBeDefined();
    expect(savedOTP.otp).toEqual(otpData.otp);
    expect(savedOTP.user_uuid).toEqual(otpData.user_uuid);
    expect(savedOTP.isUsed).toEqual(otpData.isUsed);
  });

  it('Debe generar un UUID automáticamente si no se proporciona', async () => {
    const otpData = {
      otp: '654321',
      user_uuid: 'user-uuid-example',
    };
    const otp = new otpModel(otpData);
    const savedOTP = await otp.save();

    expect(savedOTP.uuid).toBeDefined();
  });

  it('Debe establecer el valor predeterminado de "isUsed" a false', async () => {
    const otpData = {
      otp: '789012',
      user_uuid: 'user-uuid-example',
    };
    const otp = new otpModel(otpData);
    const savedOTP = await otp.save();

    expect(savedOTP.isUsed).toEqual(false);
  });
});
