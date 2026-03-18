import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create form data
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', buffer, { filename: 'image.jpg' });

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    const resultBase64 = Buffer.from(response.data).toString('base64');
    
    res.status(200).json({
      image: `data:image/png;base64,${resultBase64}`,
    });
  } catch (error: any) {
    console.error('Remove.bg error:', error.message);
    if (error.response) {
      const errorText = Buffer.from(error.response.data).toString('utf-8');
      console.error('Error response:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return res.status(500).json({ 
          error: 'Failed to remove background',
          details: errorJson.errors?.[0]?.title || errorJson.message || 'Unknown error'
        });
      } catch {
        return res.status(500).json({ 
          error: 'Failed to remove background',
          details: errorText
        });
      }
    }
    res.status(500).json({ 
      error: 'Failed to remove background',
      details: error.message
    });
  }
}
