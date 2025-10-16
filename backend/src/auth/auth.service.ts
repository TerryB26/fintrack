import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private db: DbService) {}

  async login(email: string, password: string) {
    const result = await this.db.query(
      'SELECT id, uuid, username, email, password_hash, first_name, last_name FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, uuid: user.uuid, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        }
      }
    };
  }

  async getCurrentUser(userId: number) {
    const result = await this.db.query(
      'SELECT id, uuid, username, email, first_name, last_name, created_at FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('User not found');
    }

    const user = result.rows[0];
    return {
      success: true,
      data: {
        id: user.id,
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
      }
    };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
