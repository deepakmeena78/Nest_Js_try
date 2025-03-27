import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { help } from './HelpSchema/help';

@Injectable()
export class HelpService {
  constructor(@InjectModel('Help') private tellu: Model<help>) {}

  async create(req) {
    await this.tellu.insertOne(req.body);
  }
}
