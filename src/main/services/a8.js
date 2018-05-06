const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const keytar = require('keytar')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'
const SERVICE_NAME = 'com.meganii.apps.affi-search.a8'

async function login (page) {
  const secret = await keytar.findCredentials(SERVICE_NAME)
  await page.goto('https://a8.net')
  await page.type('#asLoginId', secret[0].account)
  await page.waitFor(1000)
  await page.type('#headerLeft > form > ul > li.passInput > input[type="password"]', secret[0].password)
  await page.click('#headerLeft > form > ul > li.lgnBtn > input[type="image"]')
}

async function scraping (body) {
  const $ = cheerio.load(body)
  const result = $('.programSearch_details').map((index, table) => {
    const elem = $(table).find('tr').find('td')
    return {
      title: elem.eq(1).text().trim(),
      commision: elem.eq(3).text().trim(),
      site: 'a8'
    }
  })
  console.dir(result.get())
  return result.get()
}

async function a8 (keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH
  })
  const page = await browser.newPage()

  await login(page)

  await page.waitForSelector('#headerSearchKeyword')
  await page.type('#headerSearchKeyword', keyword)
  await page.click('#headSearch > form > input.searchBtn')
  await page.waitFor('#new_mainArea2clm', {timeout: 60000})

  const body = await page.evaluate(() => document.body.innerHTML)
  const result = await scraping(body)

  await browser.close()
  return result
}

export default a8
