import {
  BadRequestException,
  Injectable,
  ParseIntPipe,
  ParseIntPipeOptions,
} from '@nestjs/common';

@Injectable()
// export class TaskPipe implements PipeTransform {
//   transform(value: any, metadata: ArgumentMetadata) {
//     return value;
//   }
// }
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
