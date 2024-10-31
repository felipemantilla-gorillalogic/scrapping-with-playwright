# n8n-pinecone-pwrc

## Description
This project is a web scraper built using TypeScript, Express, and Playwright. It allows users to scrape content from a specified Google site after logging in with Google credentials. The scraped data includes the main content, links, images, and metadata from the site.

## Features
- Scrapes content from a specified Google site.
- Logs in using Google credentials stored in environment variables.
- Extracts main content, links, images, and metadata.
- Saves the scraped data in a JSON file.
- Provides an API endpoint to trigger the scraping process.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd n8n-pinecone-pwrc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google credentials:
   ```plaintext
   GOOGLE_EMAIL=your_email@gmail.com
   GOOGLE_PASSWORD=your_password
   SITE_URL=https://www.example.com
   PORT=3000
   ```

## Usage

To start the development server, run:
```bash
npm run dev
```

To build the project, run:
```bash
npm run build
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. Make sure to follow the coding standards and include tests for any new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
