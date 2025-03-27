import { Controller, Post, Get, Body } from '@nestjs/common';
import { StudentService } from './help.service';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post("/create")
  async create(@Body() data: { name: string; email: string; password: string }) {
    return this.studentService.createStudent(data);
  }

  @Get("/get")
  async findAll() {
    return this.studentService.getStudents();
  }
}
