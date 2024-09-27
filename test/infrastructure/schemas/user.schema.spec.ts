import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../../src/infrastructure/schemas/user.schema';
import { Model, Connection } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('User Schema', () => {
  let userModel: Model<User>;
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
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    connection = module.get<Connection>(getConnectionToken());
  });

  afterEach(async () => {
    const collections = await connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });

  it('Debe crear un usuario con todos los campos requeridos', async () => {
    const userData = {
      document: '1234567890',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '5551234567',
    };
    const user = new userModel(userData);
    const savedUser = await user.save();

    expect(savedUser.uuid).toBeDefined();
    expect(savedUser.document).toEqual(userData.document);
    expect(savedUser.name).toEqual(userData.name);
    expect(savedUser.email).toEqual(userData.email);
    expect(savedUser.phone).toEqual(userData.phone);
  });

  it('Debe generar un UUID automáticamente si no se proporciona', async () => {
    const userData = {
      document: '9876543210',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '5557654321',
    };
    const user = new userModel(userData);
    const savedUser = await user.save();

    expect(savedUser.uuid).toBeDefined();
  });

  it('Debe fallar si se intenta crear un usuario con un "document" duplicado', async () => {
    const userData1 = {
      document: '1234567890',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '5551234567',
    };

    const userData2 = {
      document: '1234567890',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '5557654321',
    };

    await new userModel(userData1).save();

    await expect(new userModel(userData2).save()).rejects.toThrow();
  });

  it('Debe fallar si se intenta crear un usuario con un "email" faltante', async () => {
    const userData = {
      document: '1112223334',
      name: 'Missing Email',
      phone: '5553332221',
    };

    const user = new userModel(userData);

    await expect(user.save()).rejects.toThrow();
  });
});
