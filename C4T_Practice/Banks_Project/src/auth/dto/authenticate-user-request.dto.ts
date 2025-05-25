import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AuthenticateUserRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dialCode: string;

  @ApiProperty()
  @IsPhoneNumber(undefined, {
    message:
      'The mobile number you entered is invalid, please provide a valid mobile number',
  })
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  mobileVerificationCode: string;
}
