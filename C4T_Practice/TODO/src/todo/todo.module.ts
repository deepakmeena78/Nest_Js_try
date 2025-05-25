import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/auth/role.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
    PrismaModule,
  ],
  providers: [TodoService, RolesGuard],
  controllers: [TodoController],
})
export class TodoModule {}        
