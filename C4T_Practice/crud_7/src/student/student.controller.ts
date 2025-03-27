import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from 'src/dto/create.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('/create')
  async create(@Body() data: CreateStudentDto) {
    return this.studentService.createStudent(data);
  }

  @Get('/get')
  async getStudents() {
    return this.studentService.getstudentdata();
  }

  @Post('/update')
  async update(
    @Body() data: { id: number; name: string; email: string; password: string },
  ) {
    return this.studentService.updateUser(data);
  }

  @Post('/delete/:id')
  async deleteStudent(@Param('id') id: number) {
    return this.studentService.deleteStudent(Number(id));
  }
}
