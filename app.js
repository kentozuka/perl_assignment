const puppeteer = require('puppeteer')
const fs = require('fs')

const errMsg = '\n\n= = = = = = = = = = = = \nThis program runs on Node.js. Please install the latest version of node and run npm install.\n= = = = = = = = = = = = \n'
const link = 'https://www.wsl.waseda.jp/syllabus/JAA101.php'
const dept = '212004'
const term = '1'
let counter = 1

async function main () {
  console.log('Start getting keys.')
  const browser = await check()
  if (browser) {
    const page = await browser.newPage()
    // accessing the top page -> searching
    await page.goto(link, { waitUntil: 'domcontentloaded' })
    await page.select('select[name="p_gakubu"]', dept)
    await page.waitFor(2000)
    await page.select('select[name="p_gakki"]', term)
    await page.click('input[name="btnSubmit"]')
    await page.waitFor(2000)
    // extracting data
    // eslint-disable-next-line
    await page.evaluate(() => func_showchg('JAA103SubCon', '500')) // showing 500 results
    await page.waitFor(2000)
    const aa = await page.$$eval('td > a', li => li.map(x => x.getAttribute('onclick')))
    const keys = aa.map(x => x.split('\'')[3])
    console.log('Done. Moving on to the next task.')
    for (const key of keys) {
      await getData(browser, key, keys.length)
    }
    console.log('All done. Run perl main.pl now.')
  }
}

async function check () {
  try {
    const browser = await puppeteer.launch()
    return browser
  } catch {
    return console.log(errMsg)
  }
}

async function getData (browser, key, len) {
  const url = `https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=en`
  const path = `./src/${key}.txt`
  const page = await browser.newPage(key)
  await page.goto(url)
  await page.waitFor(2000)
  const [data] = await page.$x('//th[text()="Course Outline"]/following-sibling::td')
  const text = await (await data.getProperty('innerText')).jsonValue()
  const lines = text.replace(/\n/g, '')
  fs.writeFile(path, lines, (err) => {
    if (err) console.log(err)
  })
  console.log(`Processing... ${counter} / ${len}`)
  counter += 1
  await page.close()
}

main()
