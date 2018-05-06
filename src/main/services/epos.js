const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'

async function scraping (body) {
  const $ = cheerio.load(body)
  const result = $('.column').map((index, item) => {
    return {
      title: $(item).find('.title').eq(0).text().trim(),
      price: $(item).find('.right').eq(0).text().trim(),
      site: 'epos'
    }
  })
  console.dir(result.get())
  return result.get()
}

async function epos (keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH
  })
  const page = await browser.newPage()
  await page.goto(`https://tamaru.eposcard.co.jp/search/3/power/?q=${keyword}`, {waitUntil: 'domcontentloaded'})

  const body = await page.evaluate(() => {
    return document.body.innerHTML
  })
  const result = await scraping(body)
  await browser.close()
  return result
}

export default epos
