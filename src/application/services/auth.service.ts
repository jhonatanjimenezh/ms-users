import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(email: string): Promise<string> {
    const sessionId = uuidv4();
    const payload = { email, sessionId };

    return this.jwtService.sign(payload);
  }
}
