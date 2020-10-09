const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const credentials = require('../credentials.json');
const _ = require('lodash');

(async function () {
  try {
    // read documentation below for available options
    const options = {
      companyId: CompanyTypes.leumi,
      startDate: new Date('2020-10-01'),
      combineInstallments: false,
      showBrowser: false
    };

    const scraper = createScraper(options);
    const scrapeResult = await scraper.scrape(credentials);

    if (!scrapeResult.success) {
      throw new Error(scrapeResult.errorType);
    }

    const account = scrapeResult.accounts[0];
    const { income, expenses } = _.groupBy(account.txns, (stmnt) =>
      stmnt.chargedAmount > 0 ? 'income' : 'expenses'
    );

    const totalIncome = _.sumBy(income, 'chargedAmount');
    const totalExpenses = _.sumBy(expenses, 'chargedAmount');
    const cashflow = totalExpenses + totalIncome;

    console.log(JSON.stringify({
      income,
      expenses,
      totalIncome,
      totalExpenses,
      cashflow
    }, null, 2));
  } catch (e) {
    console.error(`scraping failed for the following reason: ${e.message}`);
  }
})();
