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

app.get('/', async (req, res) => {
  const fragment = req.query.url ? extractTextFragment(req.query.url) : '';
  const urlTitle = req.query.url ? await extractTitle(req.query.url) : '';
  res.render('index', {
    title: urlTitle || 'Page not found',
    description: fragment || 'Page not found',
    url: req.query.url,
    imageUrl: 'https://picsum.photos/200/300',
    themeColor: '#FFFFFF',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 