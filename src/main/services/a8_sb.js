const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'

const {A8_ID, A8_PW} = require('./config')

async function login (page) {
  await page.goto('https://pub.a8.net/a8v2/as/sb/indexLogin.jsp', { waitUntil: 'domcontentloaded' })
  await page.type('#asid', A8_ID)
  await page.type('#passwd', A8_PW)
  await page.click('#loginBoxArea > p.loginBtn > a')
}

async function scraping (body) {
  const $ = cheerio.load(body)
  const result = $('#programArea .pg01').map((index, item) => {
    return {
      title: $(item).find('.pgName').text().trim(),
      url: '',
      price: $(item).find('.price.reformline').text(),
      site: 'a8Sb'
    }
  })
  console.dir(result.get())
  return result.get()
}

async function a8Sb (keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH
  })
  const page = await browser.newPage()

  await login(page)
  // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  await page.waitFor(3000)
  await page.waitForSelector('#searchTxt')
  await page.type('#searchTxt', keyword)
  await page.click('#searchBox > div.btnSearchArea.clearfix > div:nth-child(1) > input')
  await page.waitForNavigation({ waitUntil: 'load' })

  const body = await page.evaluate(() => {
    return document.body.innerHTML
  })

  const result = await scraping(body)
  console.dir(result)
  await browser.close()
  return result
}

export default a8Sb
