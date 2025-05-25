import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { UserTask } from './dto/create.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('todo')
export class TodoController {
  constructor(private todoServise: TodoService) {}

  @Post('/create-task')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async Createtask(@Body() data: UserTask) {
    return this.todoServise.createtask(data);
  }

  @Get('/get-task')
  async getTask() {
    return this.todoServise.gettask();
  }

  @Post('/update-task/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async UpdateTask(@Param('id') id: string, @Body() data: UserTask) {
    return this.todoServise.updatetask(parseInt(id, 10), data);
  }

  @Delete('/delete-task/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async Deletetask(@Param('id') id: string) {
    return this.todoServise.deletetask(parseInt(id, 10));
  }
}
