import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { TokenRateLimit } from '../common/token-rate-limit/token-rate-limit.decorator';
import { TokenRateLimitGuard } from '../common/token-rate-limit/token-rate-limit.guard';

@ApiTags('ai')
@Controller('ai')
@UseGuards(TokenRateLimitGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @TokenRateLimit({ bucket: 'ai-chat', limit: 12, ttlSec: 60 })
  @ApiOperation({ summary: 'AI chat assistant' })
  async chat(@Body() body: { message: string; context?: any }) {
    const response = await this.aiService.chat(body.message, body.context);
    return { response };
  }

  @Post('translate')
  @TokenRateLimit({ bucket: 'ai-translate', limit: 20, ttlSec: 60 })
  @ApiOperation({ summary: 'Translate text' })
  async translate(@Body() body: { text: string; targetLang: 'en' | 'ur' }) {
    const translated = await this.aiService.translate(body.text, body.targetLang);
    return { translated };
  }

  @Post('detect-language')
  @ApiOperation({ summary: 'Detect language' })
  async detectLanguage(@Body() body: { text: string }) {
    const language = await this.aiService.detectLanguage(body.text);
    return { language };
  }

  @Post('cnic-extract')
  @TokenRateLimit({ bucket: 'ai-vision', limit: 5, ttlSec: 60 })
  @ApiOperation({ summary: 'Extract CNIC data from image' })
  async extractCNIC(@Body() body: { imageUrl: string }) {
    const data = await this.aiService.extractCNICData(body.imageUrl);
    return data;
  }

  @Post('verify-video')
  @TokenRateLimit({ bucket: 'ai-vision', limit: 5, ttlSec: 60 })
  @ApiOperation({ summary: 'Verify video with face recognition and liveness detection' })
  async verifyVideo(@Body() body: { videoUrl: string; cnicImageUrl?: string }) {
    const result = await this.aiService.verifyVideoWithFaceRecognition(
      body.videoUrl,
      body.cnicImageUrl,
    );
    return result;
  }

  @Post('compare-faces')
  @TokenRateLimit({ bucket: 'ai-vision', limit: 5, ttlSec: 60 })
  @ApiOperation({ summary: 'Compare faces between video and reference image' })
  async compareFaces(@Body() body: { videoUrl: string; referenceImageUrl: string }) {
    const result = await this.aiService.compareFaces(body.videoUrl, body.referenceImageUrl);
    return result;
  }

  @Post('detect-liveness')
  @TokenRateLimit({ bucket: 'ai-vision', limit: 5, ttlSec: 60 })
  @ApiOperation({ summary: 'Detect liveness in video' })
  async detectLiveness(@Body() body: { videoUrl: string }) {
    const result = await this.aiService.detectLiveness(body.videoUrl);
    return result;
  }

  @Post('detect-fraud')
  @TokenRateLimit({ bucket: 'ai-fraud', limit: 10, ttlSec: 60 })
  @ApiOperation({ summary: 'Run rule-based (+ optional LLM) fraud checks on a listing' })
  async detectFraud(
    @Body() body: { product: any; seller: any },
  ) {
    return this.aiService.detectFraud(body.product || {}, body.seller || {});
  }
}
