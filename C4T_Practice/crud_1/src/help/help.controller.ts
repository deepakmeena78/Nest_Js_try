import { Controller, Get } from '@nestjs/common';
import { HelpService } from './help.service';
import { Test } from '@nestjs/testing';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get()
  async Test() {
    return 'ANKIT 🤷‍♂️';
  }
}
