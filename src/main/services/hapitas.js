const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'

async function scraping (body) {
  const $ = cheerio.load(body)
  const result = $('#inner_list .article_inner').map((index, item) => {
    return {
      title: $(item).find('.item_label').eq(0).text().trim(),
      price: $(item).find('.item_points').eq(0).text().trim().replace(/\n|\s/, ''),
      site: 'hapitas'
    }
  })
  console.dir(result.get())
  return result.get()
}

async function hapitas (keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH
  })
  const page = await browser.newPage()
  await page.goto('https://hapitas.jp/auth/signin/', {waitUntil: 'domcontentloaded'})
  await page.type('#freeword', keyword)
  await page.click('#search')
  await page.waitForNavigation({waitUntil: 'domcontentloaded'})

  const body = await page.evaluate(() => {
    return document.body.innerHTML
  })
  const result = await scraping(body)
  await browser.close()
  return result
}

export default hapitas
