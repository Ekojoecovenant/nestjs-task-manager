import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from './bcrypt.util';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role?: Role;
    };
  }> {
    const user = await this.userService.findEmail(email);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPassword = await this.bcrypt.compare(pass, user?.password);
    if (!isPassword) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async signup(
    name?: string,
    email?: string,
    password?: string,
    role?: Role,
  ): Promise<{
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      role?: Role;
    };
  }> {
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email and password are required!');
    }

    const hashedPassword: Promise<string> = this.bcrypt.hash(password);

    const newUser = await this.userService.create({
      name,
      email,
      password: await hashedPassword,
      role: role ? role : Role.User,
    });
    return {
      message: 'User Account created successfully',
      user: newUser,
    };
  }
}
