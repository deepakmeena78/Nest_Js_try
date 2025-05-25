import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateUser } from './dto/signIn.dto';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('/create')
  async create(@Body() data: CreateUser) {
    return this.studentService.createStudent(data);
  }

  @Get('/get')
  async findAll() {
    return this.studentService.getStudents();
  }

  @Post('/update/:id')
  async update(
    @Param('id') id: string,
    @Body()
    data: CreateUser,
  ) {
    return this.studentService.updateStudent(parseInt(id), data);
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.studentService.deleteStudent(parseInt(id));
  }
}
