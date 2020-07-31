const { exec } = require('child_process')
const puppeteer = require('puppeteer')
const libxmljs = require('libxmljs')
const axios = require('axios')
const fs = require('fs')

const errMsg = '\n\n= = = = = = = = = = = = \nThis program runs on Node.js. Please install the latest version of node and run npm install.\n= = = = = = = = = = = = \n'
const link = 'https://www.wsl.waseda.jp/syllabus/JAA101.php'
const dept = '212004'
const term = '1'
const dir = './src'
let counter = 1

async function main () {
  console.log('Start getting keys.')
  const browser = await check()
  if (browser) {
    const page = await browser.newPage()
    const spring = await go(page, term)
    const fall = await go(page, term + 1)
    const keys = spring.concat(fall)
    await browser.close()
    console.log('Done. Moving on to the next task.')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    try {
      for (const key of keys) {
        await getData(key, keys.length)
      }
      console.log('All done. Running the perl code.')
    } catch {
      console.log('Access limit reached. Moving on.')
    }
    exec('perl main.pl', (error) => { if (error) return console.log(`error: ${error.message}`) })
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

async function go (page, term) {
  // accessing the top page -> searching
  await page.goto(link, { waitUntil: 'domcontentloaded' })
  await page.select('select[name="p_gakubu"]', dept)
  await page.waitFor(2000)
  await page.select('select[name="p_gakki"]', term)
  await page.click('input[name="btnSubmit"]')
  await page.waitFor(2000)
  const keys = await getKeys(page)
  console.log(`Got ${keys.length} keys for term ${term}`)
  return keys
}

async function getKeys (page) {
  // extracting data
  // eslint-disable-next-line
  await page.evaluate(() => func_showchg('JAA103SubCon', '500')) // showing 500 results
  await page.waitFor(2000)
  const aa = await page.$$eval('td > a', li => li.map(x => x.getAttribute('onclick')))
  const keys = aa.map(x => x.split('\'')[3])
  return keys
}

async function getData (key, len) {
  const url = `https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=en`
  const path = `${dir}/${key}.txt`
  const xml = await axios.get(url)
  const xmlDoc = libxmljs.parseHtml(xml.data)
  const co = xmlDoc.get('//th[text()="Course Outline"]/following-sibling::td')
  const text = co.text()
  const lines = text.replace(/\n/g, '')
  fs.writeFile(path, lines, (err) => {
    if (err) console.log(err)
  })
  console.log(`Processing... ${counter} / ${len}`)
  counter += 1
}

main()
