import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<user>) {}

  async ankit(req) {
    return await this.userModel.insertOne(req.body);
  }

  async mohan(req) {
    console.log('-=--=req.param', req.params.id);
    console.log('-=--=req.queyr', req.query);

    return await this.userModel.insertOne(req.body);
  }
}


// let age: number = 72681;