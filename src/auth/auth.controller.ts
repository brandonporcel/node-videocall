import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Auth } from './decorators/auth.decorator';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from '@common/decorators/get-user.decorator';
import { TransformUserInterceptor } from './interceptors/user.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @Auth()
  @UseInterceptors(TransformUserInterceptor)
  me(@GetUser() user: User) {
    return user;
  }

  @Post('log')
  log(@Body() d: { message: string }) {
    console.log('log ', JSON.stringify(d.message));
    return d;
  }

  @Post('logout')
  @Auth()
  logout(@GetUser() user: User) {
    return this.authService.logout(user);
  }
}
