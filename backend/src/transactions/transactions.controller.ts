import { Controller, Get, Post, Body, Query, Req, UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly authService: AuthService,
  ) {}

  private getUserIdFromToken(request: Request): number {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const decoded: any = this.authService.verifyToken(token);
    return decoded.userId;
  }

  @Get()
  async getAllTransactions(
    @Req() request: Request,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.transactionsService.getTransactions(
      userId,
      type,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Post('transfer')
  async createTransfer(
    @Req() request: Request,
    @Body() body: { fromAccountId: number; toAccountId: number; amount: number; description?: string },
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.transactionsService.transfer(
      userId,
      body.fromAccountId,
      body.toAccountId,
      body.amount,
      body.description,
    );
  }

  @Post('exchange')
  async createExchange(
    @Req() request: Request,
    @Body() body: { fromAccountId: number; toAccountId: number; sourceAmount: number; targetAmount: number; exchangeRate: number; description?: string },
  ) {
    const userId = this.getUserIdFromToken(request);
    // Log incoming body for debugging (will appear in server logs)
    console.log('Incoming exchange request body:', body);

    // Coerce numeric fields to numbers (in case they arrive as strings)
    const sourceAmount = Number(body.sourceAmount);
    const exchangeRate = Number(body.exchangeRate);
    const targetAmount = Number(body.targetAmount);

    if (!Number.isFinite(sourceAmount) || sourceAmount <= 0) {
      throw new BadRequestException('Invalid sourceAmount: must be a positive number');
    }
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      throw new BadRequestException('Invalid exchangeRate: must be a positive number');
    }
    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      throw new BadRequestException('Invalid targetAmount: must be a positive number');
    }

    return this.transactionsService.exchange(
      userId,
      Number(body.fromAccountId),
      Number(body.toAccountId),
      sourceAmount,
      exchangeRate,
      targetAmount,
      body.description,
    );
  }
}

