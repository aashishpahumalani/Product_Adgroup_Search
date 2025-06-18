import fs from 'fs';
import { parse } from 'csv-parse';

async function parseCSV(filePath) {
  try {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, skip_empty_lines: true, bom: true }))
        .on('data', (row) => {

          // Data validation: check required fields
          if (!row['Spend(USD)'] || !row['Sales(USD)'] || !row.Clicks || !row.Impressions) return;
          
          // Convert to numbers, handle missing values
          row.spend = parseFloat(row['Spend(USD)']) || 0;
          row.sales = parseFloat(row['Sales(USD)']) || 0;
          row.clicks = parseInt(row.Clicks) || 0;
          row.impressions = parseInt(row.Impressions) || 0;
          results.push(row);
        })
        .on('end', () => {
          console.log(`result: ${JSON.stringify(results)}`);
          resolve(results);
        })
        .on('error', (error) => {
          console.log('Error reading CSV file:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.log('Error parsing CSV file:', error);
  }
}

export default parseCSV;
