import { Controller, Post, Get, Body, Param } from '@nestjs/common';
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
    return await this.purchaseService.purchaseCorn(request);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user corn total' })
  async getUserCornTotal(
    @Param('userId') userId: string,
  ): Promise<UserCornTotal> {
    return this.purchaseService.getUserCornTotal(userId);
  }
}
