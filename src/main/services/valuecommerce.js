const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const CHROME_PATH = '/Applications/Chromium.app/Contents/MacOS/Chromium'

const {VAL_ID, VAL_PW} = require('./config')

async function login (page) {
  await page.goto('https://aff.valuecommerce.ne.jp/')
  await page.type('#login_form_emailAddress', VAL_ID)
  await page.type('#login_form_encryptedPasswd', VAL_PW)
  await page.click('body > div.container > div.row.login_btn_bsp > div > form > div:nth-child(5) > div > button')
}

async function scraping (body) {
  const $ = cheerio.load(body)
  const result = $('.searchec_list').map((index, table) => {
    const elem = $(table).find('table').find('tr').find('td').find('h4')
    const commission = $(table).find('.adlist-col-commission')
    return {
      title: $(elem).text().trim(),
      commission: commission.eq(index + 1).text().trim(),
      site: 'valuecommerce'
    }
  })
  console.dir(result.get())
  return result.get()
}

async function valuecommerce (keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH
  })
  const page = await browser.newPage()

  await login(page)
  console.log('start wait')
  await page.waitFor(3000)
  console.log('end wait')
  await page.type('input.search-query', keyword)
  await page.click('.icon-search-top')
  await page.waitFor('.searchec_list', {timeout: 60000})

  const body = await page.evaluate(() => {
    return document.body.innerHTML
  })

  const result = await scraping(body)
  console.dir(result)

  await browser.close()
  return result
}

export default valuecommerce
