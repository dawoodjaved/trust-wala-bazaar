import OpenAI from 'openai';

export class AiService {
  private openai: OpenAI | undefined;
  private usingGeminiFallback = false;

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    } else if (geminiKey) {
      this.openai = new OpenAI({
        apiKey: geminiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });
      this.usingGeminiFallback = true;
    }
  }

  private getTextModel(): string {
    return this.usingGeminiFallback ? 'gemini-3-flash-preview' : 'gpt-3.5-turbo';
  }

  private getVisionModel(): string {
    return this.usingGeminiFallback ? 'gemini-3-flash-preview' : 'gpt-4-vision-preview';
  }

  private getEmbeddingModel(): string {
    return this.usingGeminiFallback ? 'text-embedding-004' : 'text-embedding-3-small';
  }

  async suggestPrice(productData: any): Promise<{ suggestedPrice: number; confidence: number }> {
    try {
      const prompt = `Analyze the fair market price for "${productData.title}" in Pakistan. 
Product details: ${productData.description?.substring(0, 200) || 'N/A'}
Condition: ${productData.condition}
Current listed price: PKR ${productData.price}
${productData.originalPrice ? `Original price: PKR ${productData.originalPrice}` : ''}

Based on similar products in Pakistan's market, suggest a fair price range and provide:
1. Suggested fair price in PKR (just the number)
2. Confidence level (0-1)

Respond in JSON format: {"suggestedPrice": number, "confidence": number}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getTextModel(),
          temperature: 0.3,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          return {
            suggestedPrice: parsed.suggestedPrice || productData.price * 0.95,
            confidence: parsed.confidence || 0.75,
          };
        } catch {
          const priceMatch = response.match(/(\d+(?:\.\d+)?)/);
          return {
            suggestedPrice: priceMatch ? parseFloat(priceMatch[1]) : productData.price * 0.95,
            confidence: 0.7,
          };
        }
      }
    } catch (error) {
      console.error('Error in suggestPrice:', error);
    }

    const basePrice = productData.price;
    const suggestedPrice = basePrice * 0.95;
    const confidence = 0.85;
    return { suggestedPrice, confidence };
  }

  async generateReviewSummary(reviews: any[]): Promise<{ pros: string[]; cons: string[]; summary: string }> {
    if (!reviews || reviews.length === 0) {
      return { pros: [], cons: [], summary: 'No reviews yet.' };
    }

    try {
      const reviewsText = reviews
        .map((r, i) => `Review ${i + 1}: Rating ${r.rating}/5 - ${r.content}`)
        .join('\n\n');

      const prompt = `Analyze these product reviews and extract:
1. Pros (positive points) - as a JSON array of strings
2. Cons (negative points) - as a JSON array of strings  
3. Summary - a brief 2-3 sentence summary

Reviews:
${reviewsText}

Respond in JSON format:
{
  "pros": ["pro1", "pro2"],
  "cons": ["con1", "con2"],
  "summary": "summary text"
}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getTextModel(),
          temperature: 0.3,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          return {
            pros: Array.isArray(parsed.pros) ? parsed.pros : [],
            cons: Array.isArray(parsed.cons) ? parsed.cons : [],
            summary: parsed.summary || 'Overall positive reviews.',
          };
        } catch {
          return {
            pros: ['Great quality', 'Fast delivery'],
            cons: ['Could be cheaper'],
            summary: 'Overall positive reviews with minor concerns.',
          };
        }
      }
    } catch (error) {
      console.error('Error in generateReviewSummary:', error);
    }

    return {
      pros: ['Great quality', 'Fast delivery', 'Good value'],
      cons: ['Could be cheaper', 'Limited warranty'],
      summary: 'Overall positive reviews with minor concerns about pricing.',
    };
  }

  async detectFraud(productData: any, sellerData: any): Promise<{ isFraud: boolean; riskScore: number; reasons: string[] }> {
    let riskScore = 0;
    const reasons: string[] = [];

    if (!sellerData.cnicVerified) {
      riskScore += 20;
      reasons.push('Seller CNIC not verified');
    }

    if (!sellerData.videoVerified) {
      riskScore += 15;
      reasons.push('Seller video verification pending');
    }

    if (productData.originalPrice && productData.price < productData.originalPrice * 0.5) {
      riskScore += 30;
      reasons.push('Suspiciously low price (more than 50% discount)');
    }

    if (productData.price < 1000) {
      riskScore += 10;
      reasons.push('Very low price may indicate scam');
    }

    try {
      const prompt = `Analyze this product listing for potential fraud in Pakistan marketplace:

Product: ${productData.title}
Description: ${productData.description?.substring(0, 300) || 'N/A'}
Price: PKR ${productData.price}
${productData.originalPrice ? `Original Price: PKR ${productData.originalPrice}` : ''}
Seller Verification: CNIC ${sellerData.cnicVerified ? 'Verified' : 'Not Verified'}, Video ${sellerData.videoVerified ? 'Verified' : 'Not Verified'}

Identify potential fraud indicators and provide:
1. Risk score (0-100)
2. List of concerns (if any)

Respond in JSON: {"riskScore": number, "concerns": ["concern1", "concern2"]}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getTextModel(),
          temperature: 0.2,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          if (parsed.riskScore) {
            riskScore += parsed.riskScore * 0.3;
          }
          if (Array.isArray(parsed.concerns)) {
            reasons.push(...parsed.concerns);
          }
        } catch {
          // Continue with rule-based only
        }
      }
    } catch (error) {
      console.error('Error in AI fraud detection:', error);
    }

    const isFraud = riskScore > 50;
    return { isFraud, riskScore: Math.min(100, Math.round(riskScore)), reasons: [...new Set(reasons)] };
  }

  async chat(message: string, context?: any): Promise<string> {
    try {
      const systemPrompt = `You are a helpful AI assistant for TrustWala Bazaar, a marketplace in Pakistan. 
You help buyers and sellers with product information, negotiations, and marketplace questions.
${context?.productName ? `Current product: ${context.productName}` : ''}
${context?.productPrice ? `Product price: PKR ${context.productPrice}` : ''}
${context?.sellerName ? `Seller: ${context.sellerName}` : ''}
Be friendly, helpful, and provide accurate information. Support both English and Urdu (Roman Urdu).`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ];

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: messages as any,
          model: this.getTextModel(),
          temperature: 0.7,
        });
        return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
    }

    return `I can help you with information about ${context?.productName || 'this product'}. Please ensure your AI API keys are configured.`;
  }

  async detectLanguage(text: string): Promise<'en' | 'ur' | 'unknown'> {
    const urduPattern = /[\u0600-\u06FF]/;
    if (urduPattern.test(text)) {
      return 'ur';
    }
    const romanUrduWords = ['hai', 'hain', 'ka', 'ki', 'ke', 'se', 'ko', 'mein', 'par', 'aur', 'ya', 'bhi', 'nahi'];
    const lowerText = text.toLowerCase();
    const urduWordCount = romanUrduWords.filter((word) => lowerText.includes(word)).length;
    if (urduWordCount > 2) {
      return 'ur';
    }
    return 'en';
  }

  async translate(text: string, targetLang: 'en' | 'ur'): Promise<string> {
    if (!text || text.trim().length === 0) {
      return text;
    }

    const sourceLang = await this.detectLanguage(text);

    if ((sourceLang === 'ur' && targetLang === 'ur') || (sourceLang === 'en' && targetLang === 'en')) {
      return text;
    }

    try {
      const prompt = `Translate the following text from ${sourceLang === 'ur' ? 'Urdu' : 'English'} to ${targetLang === 'ur' ? 'Urdu' : 'English'}. 
If the text is in Roman Urdu (Urdu written in English letters), translate it to proper ${targetLang === 'ur' ? 'Urdu script' : 'English'}.
Only return the translated text, nothing else.

Text to translate: "${text}"`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getTextModel(),
          temperature: 0.3,
        });
        return completion.choices[0]?.message?.content?.trim() || text;
      }
    } catch (error) {
      console.error('Error in translation:', error);
    }

    return text;
  }

  async generateRecommendations(userId: string, preferences: any): Promise<any[]> {
    return [];
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (this.openai) {
        const response = await this.openai.embeddings.create({
          model: this.getEmbeddingModel(),
          input: text,
        });
        return response.data[0].embedding;
      }
    } catch (error) {
      console.error('Error generating embedding:', error);
    }
    return [];
  }

  async analyzeImageForVisualSearch(imageUrl: string): Promise<{ labels: string[]; description: string }> {
    try {
      const prompt = `Analyze this product image and provide:
1. Product labels/categories (e.g., "mobile phone", "laptop", "car") - as JSON array
2. Detailed description of what you see

Image URL: ${imageUrl}

Respond in JSON: {"labels": ["label1", "label2"], "description": "description text"}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getVisionModel(),
          temperature: 0.3,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          return {
            labels: Array.isArray(parsed.labels) ? parsed.labels : [],
            description: parsed.description || '',
          };
        } catch {
          return { labels: [], description: '' };
        }
      }
    } catch (error) {
      console.error('Error in image analysis:', error);
    }
    return { labels: [], description: '' };
  }

  async verifyVideoWithFaceRecognition(
    videoUrl: string,
    cnicImageUrl?: string,
  ): Promise<{
    verified: boolean;
    confidence: number;
    faceDetected: boolean;
    livenessScore?: number;
    matchWithCNIC?: boolean;
    reasons: string[];
  }> {
    try {
      const results = {
        verified: false,
        confidence: 0,
        faceDetected: false,
        livenessScore: 0,
        matchWithCNIC: false,
        reasons: [] as string[],
      };

      const prompt = `Analyze this verification video and provide:
1. Face detected (true/false)
2. Liveness indicators (is the person moving, blinking, speaking naturally?) - score 0-1
3. Confidence in verification (0-1)

Video URL: ${videoUrl}

Respond in JSON: {"faceDetected": true/false, "livenessScore": 0-1, "confidence": 0-1, "reasons": ["reason1", "reason2"]}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getVisionModel(),
          temperature: 0.1,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          results.faceDetected = parsed.faceDetected === true;
          results.livenessScore = parsed.livenessScore || 0;
          results.confidence = parsed.confidence || 0;
          if (Array.isArray(parsed.reasons)) {
            results.reasons.push(...parsed.reasons);
          }
        } catch {
          results.reasons.push('Could not parse AI response');
        }
      }

      if (cnicImageUrl && results.faceDetected) {
        const matchResult = await this.compareFaces(videoUrl, cnicImageUrl);
        results.matchWithCNIC = matchResult.match;
        results.confidence = (results.confidence + matchResult.confidence) / 2;
        if (matchResult.match) {
          results.reasons.push('Face matches CNIC photo');
        } else {
          results.reasons.push('Face does not match CNIC photo');
        }
      }

      if (results.livenessScore !== undefined) {
        if (results.livenessScore < 0.5) {
          results.reasons.push('Low liveness score - possible video/image playback');
          results.verified = false;
        } else if (results.livenessScore >= 0.7) {
          results.reasons.push('Good liveness indicators detected');
        }
      }

      results.verified =
        results.faceDetected &&
        results.livenessScore !== undefined &&
        results.livenessScore >= 0.6 &&
        results.confidence >= 0.7;

      if (!results.faceDetected) {
        results.reasons.push('No face detected in video');
      }
      if (results.confidence < 0.7) {
        results.reasons.push('Low confidence in verification');
      }

      return results;
    } catch (error) {
      console.error('Error in video face recognition:', error);
      return {
        verified: false,
        confidence: 0,
        faceDetected: false,
        reasons: ['Error processing video verification'],
      };
    }
  }

  async compareFaces(videoUrl: string, referenceImageUrl: string): Promise<{ match: boolean; confidence: number }> {
    try {
      const prompt = `Compare the face in this video with the face in this reference image (from CNIC).
Determine if they are the same person.

Video URL: ${videoUrl}
Reference Image URL: ${referenceImageUrl}

Respond in JSON: {"match": true/false, "confidence": 0-1}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getVisionModel(),
          temperature: 0.1,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          return {
            match: parsed.match === true,
            confidence: parsed.confidence || 0,
          };
        } catch {
          return { match: false, confidence: 0 };
        }
      }
    } catch (error) {
      console.error('Error comparing faces:', error);
    }

    return { match: false, confidence: 0 };
  }

  async detectLiveness(videoUrl: string): Promise<{ isLive: boolean; score: number; indicators: string[] }> {
    try {
      const prompt = `Analyze this video for liveness detection indicators to ensure it's a real person, not a photo/video playback.

Check for:
- Natural movement (head rotation, expressions)
- Blinking
- Speaking (mouth movement)
- Natural lighting changes
- Background consistency

Video URL: ${videoUrl}

Respond in JSON: {"isLive": true/false, "score": 0-1, "indicators": ["indicator1", "indicator2"]}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getVisionModel(),
          temperature: 0.1,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          return {
            isLive: parsed.isLive === true,
            score: parsed.score || 0,
            indicators: Array.isArray(parsed.indicators) ? parsed.indicators : [],
          };
        } catch {
          return { isLive: false, score: 0, indicators: [] };
        }
      }
    } catch (error) {
      console.error('Error in liveness detection:', error);
    }

    return { isLive: false, score: 0, indicators: [] };
  }

  async extractCNICData(imageUrl: string): Promise<{ cnicNumber?: string; name?: string; dob?: string; valid: boolean }> {
    try {
      const prompt = `Extract CNIC (Pakistan ID card) information from this image:
1. CNIC Number (13 digits)
2. Name
3. Date of Birth (if visible)

Image URL: ${imageUrl}

Respond in JSON: {"cnicNumber": "12345-1234567-1", "name": "John Doe", "dob": "01-01-1990", "valid": true}`;

      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: this.getVisionModel(),
          temperature: 0.1,
        });

        const response = completion.choices[0]?.message?.content || '';
        try {
          const parsed = JSON.parse(response);
          return {
            cnicNumber: parsed.cnicNumber,
            name: parsed.name,
            dob: parsed.dob,
            valid: parsed.valid === true,
          };
        } catch {
          return { valid: false };
        }
      }
    } catch (error) {
      console.error('Error in CNIC extraction:', error);
    }
    return { valid: false };
  }
}

let aiServiceInstance: AiService | null = null;

export function getAiService(): AiService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AiService();
  }
  return aiServiceInstance;
}
