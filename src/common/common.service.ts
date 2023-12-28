import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class CommonService {
  private readonly logger = new Logger('CommonService');

  handleDBExceptions(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
