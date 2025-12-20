import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  escrowEnabled?: boolean;
}

