import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/application/services/auth.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-1234'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Debe estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('generateJwt', () => {
    it('Debe generar un JWT con el email y sessionId correctos', async () => {
      const email = 'test@example.com';
      const token = 'jwt-token-123';
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.generateJwt(email);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email,
        sessionId: 'uuid-1234',
      });

      expect(result).toBe(token);
    });
  });
});
