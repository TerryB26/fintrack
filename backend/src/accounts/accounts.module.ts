import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AuthModule } from '../auth/auth.module';
import { DbService } from '../db.service';

@Module({
  imports: [AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService, DbService],
})
export class AccountsModule {}
