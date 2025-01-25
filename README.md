# Webpage Title Extractor

A web service that converts URLs with text fragments into a Discord embed URL.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/discord-fragment-embed.git
   cd discord-fragment-embed
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Chrome Extension

The project includes a Chrome extension for easy access:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` directory from this project

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`

## Tech Stack

- Node.js
- Express.js
- EJS templating
- Chrome Extensions API
- Cheerio for HTML parsing
- Axios for HTTP requests

## License

MIT License - See [LICENSE](LICENSE) for details