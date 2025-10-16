import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Controller('accounts')
export class AccountsController {
  constructor(
    private accountsService: AccountsService,
    private authService: AuthService,
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
  async getAccounts(@Req() request: Request) {
    const userId = this.getUserIdFromToken(request);
    return this.accountsService.getAccounts(userId);
  }

  @Get(':id/balance')
  async getAccountBalance(@Req() request: Request, @Param('id') id: string) {
    const userId = this.getUserIdFromToken(request);
    return this.accountsService.getAccountBalance(userId, parseInt(id));
  }
}
