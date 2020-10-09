const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const credentials = require('../credentials.json');

(async function() {
  try {
    // read documentation below for available options
    const options = {
      companyId: CompanyTypes.leumi, 
      startDate: new Date('2020-09-10'),
      combineInstallments: false,
      showBrowser: false 
    };

    const scraper = createScraper(options);
    const scrapeResult = await scraper.scrape(credentials);

    if (scrapeResult.success) {
      scrapeResult.accounts.forEach((account) => {
        console.log(`found ${account.txns.length} transactions for account number ${account.accountNumber}`);
      });
    }
    else {
      throw new Error(scrapeResult.errorType);
    }
  } catch(e) {
    console.error(`scraping failed for the following reason: ${e.message}`);
  }
})();