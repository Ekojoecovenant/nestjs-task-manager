/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
// import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() signinDto: { email: string; password: string }) {
    return this.authService.signIn(signinDto.email, signinDto.password);
  }

  @Public()
  @Post('signup')
  signup(@Body() signupDto: { name: string; email: string; password: string }) {
    return this.authService.signup(
      signupDto.name,
      signupDto.email,
      signupDto.password,
    );
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
