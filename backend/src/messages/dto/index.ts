import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  offerPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  offerExpiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalLanguage?: string;
}

