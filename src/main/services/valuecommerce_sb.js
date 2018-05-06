const puppeteer = require('puppeteer')
// const cheerio = require('cheerio')
const {VAL_ID, VAL_PW} = require('./config')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'

async function login (page) {
  await page.goto('https://www.value-point.jp/user/login/', {waitUntil: 'domcontentloaded'})
  await page.type('#login_email', VAL_ID)
  await page.type('#login_password', VAL_PW)
  await page.click('input[type="image"].rover')
}

async function valuecommerceSb (keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH
  })
  const page = await browser.newPage()

  await login(page)
  await page.waitForSelector('#home_keyword')
  await page.type('#home_keyword', keyword)
  const button = await page.$('#indexSearch > input.rover')
  if (!button) {
    await browser.close()
    return []
  }
  await button.click()
  await page.waitFor(5000)
  const result = await page.evaluate(() => {
    return Array.prototype.map.call(document.querySelectorAll('#results > .list'), (item, index) => {
      return {
        title: item.querySelector('.txt-frame a').innerText,
        href: item.querySelector('.txt-frame a').href,
        price: item.querySelector('.img-frame > .ico-point').innerText,
        site: 'valuecommerce'
      }
    })
  })

  console.log(result)

  // const result = await scraping(body)
  await browser.close()
  return result
}

export default valuecommerceSb
