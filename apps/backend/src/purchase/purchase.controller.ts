import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { PurchaseService } from './purchase.service';
import { RateLimiterService } from '../rate-limiter/rate-limiter.service';
import {
  PurchaseRequest,
  PurchaseResponse,
  UserCornTotal,
} from '@packages/shared';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

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
    @Req() req: Request,
  ): Promise<PurchaseResponse> {
    const result = await this.purchaseService.purchaseCorn(request);

    const machineId = this.getClientIdentifier(req);

    await this.rateLimiterService.recordSuccessfulRequest(
      request.userId,
      machineId,
    );

    return result;
  }

  private getClientIdentifier(req: Request): string {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    const userAgent = req.get('User-Agent') || 'unknown';

    return `${ip}:${userAgent}`;
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user corn total' })
  async getUserCornTotal(
    @Param('userId') userId: string,
  ): Promise<UserCornTotal> {
    return this.purchaseService.getUserCornTotal(userId);
  }
}
