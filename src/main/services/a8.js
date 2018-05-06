const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'

const {A8_ID, A8_PW} = require('./config')

async function login (page) {
  await page.goto('https://a8.net')
  await page.type('#asLoginId', A8_ID)
  await page.waitFor(1000)
  await page.type('#headerLeft > form > ul > li.passInput > input[type="password"]', A8_PW)
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
