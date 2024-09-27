import { HttpStatus } from '@nestjs/common';

export class ResponseDto {
  status: boolean;
  statusCode: number;
  message: string;
  data: any;
  timestamp: string;

  constructor(partial: Partial<ResponseDto>) {
    this.status = partial.status ?? true;
    this.statusCode = partial.statusCode ?? HttpStatus.OK;
    this.message = partial.message ?? 'Operación exitosa';
    this.data = partial.data ?? null;
    this.timestamp = new Date().toISOString();
  }
}
