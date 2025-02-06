import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

function extractTextFragment(url) {
  try {
    const urlObject = new URL(url);
    const hashParts = urlObject.hash.split(':~:');
    if (hashParts.length > 1) {
      const textParts = hashParts[1].split('&');
      for (const part of textParts) {
        if (part.startsWith('text=')) {
          return decodeURIComponent(part.substring(5));
        }
      }
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }
  return '';
}

async function extractTitle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000  // 5 seconds timeout
    });
    const $ = cheerio.load(response.data);
    return $('title').text() || '';
  } catch (error) {
    console.error('Error fetching title:', error.message);
    return '';
  }
}

async function extractImage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000  // 5 seconds timeout
    });
    const $ = cheerio.load(response.data);
    
    // Try to find Open Graph image first
    let imageUrl = $('meta[property="og:image"]').attr('content');
    
    // If no OG image, try Twitter image
    if (!imageUrl) {
      imageUrl = $('meta[name="twitter:image"]').attr('content');
    }
    
    // If no social media images, try first large image or favicon
    if (!imageUrl) {
      imageUrl = $('img[src*="logo"]').attr('src') ||
                $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href');
    }
    
    // If relative URL, make it absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      const urlObject = new URL(url);
      imageUrl = `${urlObject.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    return imageUrl || '';
  } catch (error) {
    console.error('Error fetching image:', error.message);
    return '';
  }
}

function isFacebookRequest(req) {
  return req.headers['user-agent'] && req.headers['user-agent'].includes('facebook');
}

app.get('/', async (req, res) => {
  const url = req.query.url
  
  if (!url) {
    return res.status(404).send('URL not found');
  }

  const fragment = extractTextFragment(url);
  const extractedTitle = await extractTitle(url);
  const title = isFacebookRequest(req) ? `${extractedTitle}: \"${fragment}\"` : extractedTitle;
  const imageUrl = await extractImage(url);
  
  res.render('index', {
    title: title || 'Page not found',
    description: fragment || 'Page not found',
    url: url,
    imageUrl: imageUrl || 'https://picsum.photos/200/300',
    themeColor: '#FFFFFF',
    redirectUrl: url,
    redirectDelay: 1
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 