import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUserRepository } from '../../application/interfaces/user.repository.interface';
import { UserDomain } from '../../domain/entities/user.domain';
import { User } from '../schemas/user.schema';
import { UserMapper } from '../../domain/mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: UserDomain): Promise<UserDomain> {
    const userModel = await this.userModel.create(user);
    return UserMapper.fromModelToDomain(userModel);
  }

  async findByDocument(document: string): Promise<UserDomain | null> {
    const userModel = await this.userModel.findOne({ document }).exec();
    return userModel ? UserMapper.fromModelToDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<UserDomain | null> {
    const userModel = await this.userModel.findOne({ email }).exec();
    return userModel ? UserMapper.fromModelToDomain(userModel) : null;
  }
}
