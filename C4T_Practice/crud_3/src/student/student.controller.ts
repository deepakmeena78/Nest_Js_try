import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('/create')
  async create(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return this.studentService.createStudent(data);
  }
  
  @Get('/get')
  async findAll() {
    return this.studentService.getStudents();
  }

  @Post('/update')
  async update(
    @Body() data: { id: number; name: string; email: string; password: string },
  ) {
    return this.studentService.updateStudent(data);
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: number) {
    return this.studentService.deleteStudent(Number(id));
  }
}
