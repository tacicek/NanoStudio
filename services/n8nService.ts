import { GeneratedImage } from '../types';

export const processImageWithN8n = async (
  prompt: string,
  base64Image?: string,
  mimeType: string = 'image/png'
): Promise<GeneratedImage> => {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL is not configured');
    }

    const cleanBase64 = base64Image?.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const payload = { 
      image: cleanBase64 || '',
      prompt 
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`N8N request failed: ${response.statusText}`);
    }

    const result = await response.json();
    const resultImageUrl = result.images?.[0]?.url || result.data?.images?.[0]?.url;
    
    if (!resultImageUrl) {
      throw new Error('No image URL in response');
    }

    const imgResponse = await fetch(resultImageUrl);
    const blob = await imgResponse.blob();
    const base64Result = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split('base64,')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return {
      data: base64Result,
      mimeType: 'image/jpeg',
    };
  } catch (error: any) {
    console.error('N8N Service Error:', error);
    throw new Error(error.message || 'Failed to process image with N8N');
  }
};
