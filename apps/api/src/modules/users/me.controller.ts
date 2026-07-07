import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

@ApiTags('profile')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile details' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user profile details' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  async updateProfile(@Request() req, @Body() updateMeDto: UpdateMeDto) {
    const user = await this.usersService.update(req.user.sub, updateMeDto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  }
}
