# Drive Scanner and Site Scraper

The idea of this repository is to provide some useful tools for interacting with the content of PWRC. Some of these have been used during the creation of the bot agent available in the backend of the AI service.

The information from PWRC is mainly found in two sources:

- PWRC Google Site
- PWRC Google Drive

The intention is to create some tools that allow access to these two sources with the goal of transforming the data into the necessary format to include it in the new site within PMS SPA. Therefore, we have created the following tools:

## Site Scraper

Using Playwright, we log in with Google with the intention of obtaining as much information as possible directly from the Google site for PWRC. This script extracts the information and stores it in a JSON file for later use.

### Using it 

- Set environment variables:

  ```bash
  PORT=3000
  GOOGLE_EMAIL=your.email@example.com
  GOOGLE_PASSWORD=your_password_here
  SITE_URL=https://sites.google.com/purepm.co/pureway/pwrc?authuser=1&pli=1
  ```

- Run the server:

  ```bash
  npm run dev:scrapper
  ```

- Start the process:

  ```bash
  curl http://localhost:3000/scrape
  ```

- Check the results in the generated file: `site-data-[timestamp].json`


## Drive Scanner

Drive Scanner is an Express server that manages the registration of PWRC files in Google Drive. The scanning process is executed using n8n, an open-source tool that allows us to create workflows and automate actions. It receives an initial drive ID and from that, it searches for folders, shortcuts, and files, which are sent via HTTP to the server to be finally stored in a JSON file for later use.

### Using it

1. Start n8n:
   ```bash
   npx n8n
   ```

2. Access n8n interface:
   - Go to http://localhost:5678/
   - Create an account 
   - Create a new workflow

3. Import workflow:
   - Copy the content from `/workflows/drive-scanner.json`
   - Create a new workflow in n8n interface
   - Paste the copied content

### Google Drive API Setup

1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" type
   - Add the n8n redirect URI from node settings
5. Copy credentials:
   - Client ID
   - Client Secret
6. Configure n8n:
   - Open Google Drive node settings
   - Enter Client ID and Client Secret
   - Complete OAuth flow

### Running the Scanner

1. Start the server:
   ```bash
   npm run dev:drive-scanner
   ```

2. Execute workflow:
   - Open n8n interface
   - Locate imported workflow
   - Click "Execute Workflow"

3. View results:
   - Check `drive-scanner.json` file
   - Contains complete Drive structure

**Note:** Delete `drive-scanner.json` before re-running to ensure complete scan. Existing file may cause incomplete results.