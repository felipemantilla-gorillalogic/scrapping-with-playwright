import express, { Express, Request, Response } from "express";
import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Credenciales (deberían estar en variables de entorno)
const EMAIL = process.env.GOOGLE_EMAIL;
const PASSWORD = process.env.GOOGLE_PASSWORD;
const SITE_URL = process.env.SITE_URL;

if (!EMAIL || !PASSWORD || !SITE_URL) {
  throw new Error("Credenciales de Google no configuradas");
}

app.use(express.json());

async function scrapGoogleSite() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    const page = await context.newPage();

    // Ir a la página de login de Google
    await page.goto(SITE_URL!);

    // Ingresar email
    await page.fill('input[type="email"]', EMAIL!);
    await page.click('button:has-text("Next")');

    // Esperar y ingresar contraseña
    await page.waitForSelector('input[type="password"]');
    await page.fill('input[type="password"]', PASSWORD!);
    await page.click('button:has-text("Next")');

    // Esperar a que se complete la autenticación y navegar al sitio
    await page.waitForLoadState("networkidle");
    await page.goto(SITE_URL!);

    // Esperar a que el contenido del sitio cargue
    await page.waitForLoadState("domcontentloaded");

    // detente aqui
    // Pausa para inspección visual
    await page.pause();

    // Esperar a que el contenido principal esté visible
    // Esperar a que el contenedor principal sea visible
    await page.waitForSelector('div[role="main"]');

    // Objeto para almacenar toda la información
    let siteData: any = {
      mainContent: "",
      pages: [],
      links: [],
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalPages: 0
      }
    };

    // Mejorar la extracción del contenido principal
    siteData.mainContent = await page.evaluate(() => {
      const main = document.querySelector('div[role="main"]');
      const content = {
        text: main ? main.textContent?.trim() : "",
        html: main ? main.innerHTML : "",
        images: Array.from(main?.querySelectorAll('img') || []).map(img => ({
          src: img.src,
          alt: img.alt,
          title: img.title
        }))
      };
      return content;
    });

    // Mejorar la extracción de enlaces
    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll("a"));
      return allLinks.map((link) => ({
        text: link.textContent?.trim() || "",
        href: link.href,
        isInternal: link.href.includes(window.location.hostname),
        attributes: {
          id: link.id,
          class: link.className,
          rel: link.rel
        }
      }));
    });
    siteData.links = links;

    // Procesar páginas internas con mejor manejo de errores
    const processedUrls = new Set();
    for (const link of links) {
      if (link.isInternal && !processedUrls.has(link.href)) {
        try {
          processedUrls.add(link.href);
          
          await page.goto(link.href, { waitUntil: 'networkidle' });
          await page.waitForSelector('div[role="main"]', { timeout: 10000 });

          const pageContent = await page.evaluate(() => {
            const main = document.querySelector('div[role="main"]');
            const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
            const images = Array.from(document.querySelectorAll('img'));
            const paragraphs = Array.from(document.querySelectorAll('p'));

            return {
              title: document.title,
              url: window.location.href,
              mainContent: {
                text: main ? main.textContent?.trim() : "",
                html: main ? main.innerHTML : ""
              },
              headers: headers.map((h) => ({
                level: h.tagName,
                text: h.textContent?.trim(),
                id: h.id
              })),
              images: images.map(img => ({
                src: img.src,
                alt: img.alt,
                title: img.title
              })),
              paragraphs: paragraphs.map(p => p.textContent?.trim()),
              metadata: {
                description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
                keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content')
              }
            };
          });

          siteData.pages.push({
            url: link.href,
            content: pageContent,
            scrapedAt: new Date().toISOString()
          });

          // Esperar un poco entre páginas para no sobrecargar el servidor
          await page.waitForTimeout(1000);
        } catch (error) {
          console.error(`Error al procesar página ${link.href}:`, error);
          siteData.pages.push({
            url: link.href,
            error: error instanceof Error ? error.message : String(error),
            scrapedAt: new Date().toISOString()
          });
        }
      }
    }

    // Actualizar metadata
    siteData.metadata.totalPages = siteData.pages.length;

    // Volver a la página principal
    await page.goto(SITE_URL!);
    await page.waitForLoadState("domcontentloaded");

    await page.pause();
    // Guardar el estado de la sesión
    await context.storageState({ path: "auth.json" });

    // Guardar los datos del sitio en un archivo JSON
    const fs = require("fs");
    fs.writeFileSync(
      `site-data-${new Date().toISOString()}.json`,
      JSON.stringify(siteData, null, 2)
    );
    console.log(
      `Datos del sitio guardados en site-data-${new Date().toISOString()}.json`
    );

    await browser.close();
    return siteData;
  } catch (error) {
    console.error("Error durante el scraping:", error);
    await browser.close();
    throw error;
  }
}

// Ruta para obtener el contenido del sitio
app.get("/scrape", async (req: Request, res: Response) => {
  try {
    const content = await scrapGoogleSite();
    res.json({ success: true, data: content });
  } catch (error) {
    console.error("Error al obtener el contenido:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener el contenido",
    });
  }
});

app.listen(port, () => {
  console.log(`⚡️[servidor]: Servidor corriendo en http://localhost:${port}`);
});
