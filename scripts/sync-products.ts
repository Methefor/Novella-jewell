import { config } from 'dotenv';
import { resolve } from 'path';

// Manually load .env.local from project root
config({ path: resolve(process.cwd(), '.env.local') });

import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

interface SheetRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  material: string;
  description: string;
  isNew: boolean;
  isBestSeller: boolean;
  stock: number;
  rating?: number;
  reviewCount?: number;
  defaultVariant: string;
  variants: string;
}

// Türkçe karakterleri temizle
function sanitizeCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

async function syncProducts() {
  console.log('🔄 Syncing products from Google Sheets...');
  console.log('📂 Working directory:', process.cwd());
  console.log(
    '📄 Looking for .env.local at:',
    resolve(process.cwd(), '.env.local')
  );

  // Check environment variables
  if (!process.env.GOOGLE_SHEETS_SHEET_ID) {
    console.error(
      '❌ Available env vars:',
      Object.keys(process.env).filter((k) => k.includes('GOOGLE'))
    );
    throw new Error('❌ GOOGLE_SHEETS_SHEET_ID is not set in .env.local');
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in .env.local');
  }
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('❌ GOOGLE_PRIVATE_KEY is not set in .env.local');
  }

  console.log('✅ Environment variables loaded');
  console.log('📋 Sheet ID:', process.env.GOOGLE_SHEETS_SHEET_ID);

  // Google Sheets Auth
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;

  try {
    console.log('📡 Connecting to Google Sheets...');

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A2:N1000',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('⚠️  No data found in sheet');
      return;
    }

    console.log(`📊 Found ${rows.length} rows in sheet`);

    const products = rows
      .filter((row) => row[0])
      .map((row, index) => {
        try {
          let variants = [];
          const variantId = row[12] || `var-${row[0]}`;

          // Try to parse variants from column N (index 13)
          if (row[13]) {
            try {
              const cleanedJson = row[13]
                .trim()
                .replace(/'/g, '"')
                .replace(/\s+/g, ' ');
              variants = JSON.parse(cleanedJson);
              console.log(`✅ Row ${index + 2}: Parsed variants successfully`);
            } catch (e) {
              console.warn(
                `⚠️  Row ${index + 2}: Invalid variants JSON, creating default`
              );
              const categoryLower = sanitizeCategory(row[3]);
              variants = [
                {
                  id: variantId,
                  color: 'altin',
                  stock: parseInt(row[10]) || 0,
                  images: [
                    `/products/${categoryLower}/${categoryLower}-${row[0]}.jpg`,
                  ],
                },
              ];
            }
          } else {
            const categoryLower = sanitizeCategory(row[3]);
            variants = [
              {
                id: variantId,
                color: 'altin',
                stock: parseInt(row[10]) || 0,
                images: [
                  `/products/${categoryLower}/${categoryLower}-${row[0]}.jpg`,
                ],
              },
            ];
          }

          return {
            id: row[0],
            name: row[1],
            slug: row[2],
            category: row[3],
            price: parseFloat(row[4]) || 0,
            originalPrice: row[5] ? parseFloat(row[5]) : undefined,
            material: row[6] || '',
            description: row[7] || '',
            isNew: row[8]?.toUpperCase() === 'TRUE',
            isBestSeller: row[9]?.toUpperCase() === 'TRUE',
            stock: parseInt(row[10]) || 0,
            rating: row[11] ? parseFloat(row[11]) : undefined,
            reviewCount: row[12] ? parseInt(row[12]) : undefined,
            defaultVariant: variantId,
            variants: variants,
            features: [],
          };
        } catch (error) {
          console.error(`❌ Error processing row ${index + 2}:`, error);
          return null;
        }
      })
      .filter((p) => p !== null);

    if (products.length === 0) {
      console.log('❌ No valid products found');
      return;
    }

    const outputPath = path.join(process.cwd(), 'src/data/products.json');
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

    console.log(`✅ Successfully synced ${products.length} products`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log('\n📦 Sample product:');
    console.log(JSON.stringify(products[0], null, 2));
  } catch (error) {
    console.error('❌ Error syncing products:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

syncProducts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
