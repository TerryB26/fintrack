import { Controller, Get, Post, Body, Query, Req, UnauthorizedException } from '@nestjs/common';
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
    @Body() body: { fromAccountId: number; toAccountId: number; amount: number; exchangeRate: number; description?: string },
  ) {
    const userId = this.getUserIdFromToken(request);
    return this.transactionsService.exchange(
      userId,
      body.fromAccountId,
      body.toAccountId,
      body.amount,
      body.exchangeRate,
      body.description,
    );
  }
}

