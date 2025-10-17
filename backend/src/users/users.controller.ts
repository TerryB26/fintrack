import { Controller, Get, Query, Req, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { DbService } from '../db.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private db: DbService,
  ) {}

  private getUserIdFromToken(request: Request): number {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const decoded: any = this.authService.verifyToken(token);
    return decoded.userId;
  }

  @Get('search')
  async searchUsers(@Req() request: Request, @Query('q') query: string) {
    console.log('🔍 Search users called with query:', query);
    const currentUserId = this.getUserIdFromToken(request);
    console.log('👤 Current user ID:', currentUserId);

    let result;
    if (!query || query.trim().length === 0) {
      console.log('📋 Returning all users');
      result = await this.db.query(
        `SELECT id, uuid, username, email, first_name, last_name
         FROM users
         WHERE id != $1
         AND is_active = true
         ORDER BY first_name, last_name
         LIMIT 50`,
        [currentUserId]
      );
    } else {
      console.log('🔍 Searching with query:', query.trim());
      result = await this.db.query(
        `SELECT id, uuid, username, email, first_name, last_name
         FROM users
         WHERE (username ILIKE $1 OR email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1)
         AND id != $2
         AND is_active = true
         LIMIT 10`,
        [`%${query.trim()}%`, currentUserId]
      );
    }

    console.log('📊 Search results:', result.rows);
    return {
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        username: row.username,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
      }))
    };
  }

  @Get(':userId/accounts')
  async getUserAccounts(@Req() request: Request, @Param('userId') userId: string) {
    console.log('🏦 Get user accounts called for userId:', userId);
    const currentUserId = this.getUserIdFromToken(request);
    console.log('👤 Current user ID:', currentUserId);

    const result = await this.db.query(
      `SELECT id, uuid, account_name, currency, balance, account_type, is_locked
       FROM accounts
       WHERE user_id = $1 AND is_locked = false
       ORDER BY account_name`,
      [parseInt(userId)]
    );

    console.log('📊 User accounts results:', result.rows);
    return {
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        accountName: row.account_name,
        currency: row.currency,
        balance: parseFloat(row.balance),
        accountType: row.account_type,
        isLocked: row.is_locked,
      }))
    };
  }
}