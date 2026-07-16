import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const cuidPattern = /^c[a-z0-9]{8,}$/i;

@Injectable()
export class CuidValidationPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException('ID is required');
    }

    if (!cuidPattern.test(value)) {
      throw new BadRequestException('ID must be a valid CUID');
    }

    return value;
  }
}
