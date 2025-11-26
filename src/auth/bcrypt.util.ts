import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async hash(password: string): Promise<string> {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }

  async compare(oldPassword: string, newPassword: string): Promise<boolean> {
    return await bcrypt.compare(oldPassword, newPassword);
  }
}
