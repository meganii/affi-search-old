const puppeteer = require('puppeteer')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'
const keytar = require('keytar')
const SERVICE_NAME = 'com.meganii.apps.affi-search.valuecommerce'

async function login (page) {
  const secret = await keytar.findCredentials(SERVICE_NAME)
  await page.goto('https://www.value-point.jp/user/login/', {waitUntil: 'domcontentloaded'})
  await page.type('#login_email', secret[0].account)
  await page.type('#login_password', secret[0].password)
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
