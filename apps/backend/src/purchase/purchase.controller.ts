import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import {
  PurchaseRequest,
  PurchaseResponse,
  UserCornTotal,
} from '@packages/shared';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
  private readonly logger = new Logger(PurchaseController.name);

  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'Purchase corn' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          example: 'user123',
          description: 'User ID for the purchase',
        },
      },
      required: ['userId'],
    },
  })
  async purchaseCorn(
    @Body() request: PurchaseRequest,
  ): Promise<PurchaseResponse> {
    this.logger.log(`POST /purchase - User: ${request.userId}`);
    const result = await this.purchaseService.purchaseCorn(request);

    if ('error' in result) {
      this.logger.warn(
        `Purchase rejected for user ${request.userId}: Rate limit exceeded`,
      );
      throw new HttpException(result, HttpStatus.TOO_MANY_REQUESTS);
    }

    this.logger.log(`Purchase successful for user ${request.userId}`);
    return result;
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user corn total' })
  async getUserCornTotal(
    @Param('userId') userId: string,
  ): Promise<UserCornTotal> {
    this.logger.log(`GET /purchase/${userId} - Fetching corn total`);
    return this.purchaseService.getUserCornTotal(userId);
  }
}
