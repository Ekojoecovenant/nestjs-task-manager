import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { Bcrypt } from './bcrypt.util';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: `${60 * 5}s` },
    }),
  ],
  providers: [AuthService, Bcrypt],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
