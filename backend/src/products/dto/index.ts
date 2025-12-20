import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCondition } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @ApiProperty()
  @IsEnum(ProductCondition)
  condition: ProductCondition;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  specifications?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ptaVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ptaStatus?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

