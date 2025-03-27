import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Change if using a remote DB
      port: 3100,
      username: 'postgres',
      password: 'Ankit@123',
      database: 'crud_1',
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Use only in development
    }),
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
