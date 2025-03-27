import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { HelpModule } from './help/help.module';

@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost:27017/nestapp'),
     UserModule,
     HelpModule, // Replace with your MongoDB URL
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
