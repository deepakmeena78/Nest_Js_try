// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { TodoService } from './todo/todo.service';
// import { TodoController } from './todo/todo.controller';
// import { TodoModule } from './todo/todo.module';
// import { PrismaModule } from 'prisma/prisma.module';
// import { PrismaService } from 'prisma/prisma.service';

// @Module({
//   imports: [UserModule, TodoModule, PrismaModule],
//   controllers: [AppController, TodoController],
//   providers: [AppService, TodoService, PrismaService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TodoService } from './todo/todo.service';
import { TodoController } from './todo/todo.controller';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { TestController } from './filters';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your secret key
      signOptions: { expiresIn: '60m' }, // JWT expiry time
    }),
    UserModule,
    TodoModule,
    PrismaModule,
  ],
  controllers: [AppController, TodoController, TestController],
  providers: [AppService, TodoService, PrismaService],
})
export class AppModule {}
