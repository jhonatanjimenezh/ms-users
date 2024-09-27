import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/infrastructure/controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../../../src/infrastructure/dtos/request/token.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockTokenDto: TokenDto = {
    token: 'valid-token',
  };

  const decodedToken = {
    email: 'test@example.com',
    sessionId: 'session-uuid-1234',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Debe estar definido', () => {
    expect(authController).toBeDefined();
  });

  describe('validateToken', () => {
    it('Debe validar correctamente un token', async () => {
      mockJwtService.verify.mockReturnValue(decodedToken);

      const result = await authController.validateToken(mockTokenDto);

      expect(jwtService.verify).toHaveBeenCalledWith(mockTokenDto.token);
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Token válido',
          data: { decoded: decodedToken },
          statusCode: 200,
        }),
      );
    });

    it('Debe lanzar UnauthorizedException si el token es inválido', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      await expect(authController.validateToken(mockTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(jwtService.verify).toHaveBeenCalledWith(mockTokenDto.token);
    });
  });
});
