import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  sellerId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pros?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cons?: string[];
}

