import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { PurchaseRequest, PurchaseResponse } from '@packages/shared';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
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
    const result = await this.purchaseService.purchaseCorn(request);

    if ('error' in result) {
      throw new HttpException(result, HttpStatus.TOO_MANY_REQUESTS);
    }

    return result;
  }
}
