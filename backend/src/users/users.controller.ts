import { Controller, Get, Put, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('verify/video')
  @ApiOperation({ summary: 'Verify user identity with video and face recognition' })
  async verifyVideo(@Request() req, @Body() body: { videoUrl: string }) {
    return this.usersService.verifyVideo(req.user.id, body.videoUrl);
  }

  @Post('verify/liveness')
  @ApiOperation({ summary: 'Check liveness detection in video' })
  async checkLiveness(@Request() req, @Body() body: { videoUrl: string }) {
    return this.usersService.checkLiveness(req.user.id, body.videoUrl);
  }
}

