import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'AI chat assistant' })
  async chat(@Body() body: { message: string; context?: any }) {
    const response = await this.aiService.chat(body.message, body.context);
    return { response };
  }

  @Post('translate')
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
  @ApiOperation({ summary: 'Extract CNIC data from image' })
  async extractCNIC(@Body() body: { imageUrl: string }) {
    const data = await this.aiService.extractCNICData(body.imageUrl);
    return data;
  }

  @Post('verify-video')
  @ApiOperation({ summary: 'Verify video with face recognition and liveness detection' })
  async verifyVideo(@Body() body: { videoUrl: string; cnicImageUrl?: string }) {
    const result = await this.aiService.verifyVideoWithFaceRecognition(
      body.videoUrl,
      body.cnicImageUrl,
    );
    return result;
  }

  @Post('compare-faces')
  @ApiOperation({ summary: 'Compare faces between video and reference image' })
  async compareFaces(@Body() body: { videoUrl: string; referenceImageUrl: string }) {
    const result = await this.aiService.compareFaces(body.videoUrl, body.referenceImageUrl);
    return result;
  }

  @Post('detect-liveness')
  @ApiOperation({ summary: 'Detect liveness in video' })
  async detectLiveness(@Body() body: { videoUrl: string }) {
    const result = await this.aiService.detectLiveness(body.videoUrl);
    return result;
  }
}
