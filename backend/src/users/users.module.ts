import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/auth.service';
import { DbService } from '../db.service';

@Module({
  controllers: [UsersController],
  providers: [AuthService, DbService],
})
export class UsersModule {}