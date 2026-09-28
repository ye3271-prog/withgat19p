import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// AI Food Designer image generation endpoint
app.post('/api/generate-dish', async (req, res) => {
  try {
    const { prompt, menuName, cookingMethod, ingredient } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        message: 'No GEMINI_API_KEY found. Using client-side photorealistic studio renderer.',
        imageUrl: null,
      });
    }

    const ai = new GoogleGenAI();

    try {
      // Call Imagen 3 via @google/genai
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
      });

      const generatedImage = response.generatedImages?.[0]?.image?.imageBytes;
      if (generatedImage) {
        return res.json({
          success: true,
          imageUrl: `data:image/jpeg;base64,${generatedImage}`,
          source: 'imagen-3.0-generate-002',
        });
      }
    } catch (genError: any) {
      console.warn('Imagen generation call failed, falling back:', genError?.message);
    }

    return res.json({
      success: false,
      message: 'Image generation fallback activated',
      imageUrl: null,
    });
  } catch (error: any) {
    console.error('API /api/generate-dish error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🍳 「오늘 뭐 해먹지? : 조리법 레시피 연구소」 running on http://localhost:${PORT}`);
  });
}

startServer();
