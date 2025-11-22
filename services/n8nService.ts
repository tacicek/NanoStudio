import { GeneratedImage } from '../types';

const uploadImageToImgur = async (base64Image: string): Promise<string> => {
  const cleanBase64 = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': 'Client-ID 4d4b8c0d3c3c8f4',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: cleanBase64 }),
  });

  const data = await response.json();
  if (!data.success) throw new Error('Image upload failed');
  return data.data.link;
};

const downloadImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split('base64,')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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

    let imageUrl = '';
    if (base64Image) {
      imageUrl = await uploadImageToImgur(base64Image);
    }

    const payload = { query: imageUrl, prompt };

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

    const base64Result = await downloadImageAsBase64(resultImageUrl);

    return {
      data: base64Result,
      mimeType: 'image/jpeg',
    };
  } catch (error: any) {
    console.error('N8N Service Error:', error);
    throw new Error(error.message || 'Failed to process image with N8N');
  }
};
