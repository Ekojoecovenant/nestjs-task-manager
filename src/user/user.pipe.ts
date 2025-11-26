import {
  BadRequestException,
  Injectable,
  ParseIntPipe,
  ParseIntPipeOptions,
} from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe extends ParseIntPipe {
  constructor(
    message: string = 'Validation failed (numeric string is expected)',
  ) {
    const options: ParseIntPipeOptions = {
      exceptionFactory: () => {
        return new BadRequestException(message);
      },
    };
    super(options);
  }
}
