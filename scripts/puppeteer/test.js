
'use strict';

const puppeteer = require('puppeteer');
const users = require('./users.json');
(async() => {
const browser = await puppeteer.launch({
    headless: false,
    args: ['--lang=ja', '--no-sandbox', '--disabled-setuid-sandbox'] // デフォルトでは言語設定が英語なので日本語に変更
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.resourceType() === 'image')
      request.abort();
    else
      request.continue();
  });

  const wait = async (time) => {
    return new Promise((res) => {
      setTimeout(() => {
        res()
      }, time)
    })
  }
  const test = async (user) => {
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.ec-headerNav__item:nth-child(3) a');
    await page.click('.ec-headerNav__item:nth-child(3) a');
    await page.waitForSelector('#login_email');
    await page.type('#login_email', user.email);
    await page.type('#login_pass', 'password');
    await page.click('#login_email');
    await wait(10000);
    await page.click('[type="submit"]');
    await page.waitForSelector('.ec-headerNav__item:nth-child(3) a');
    await page.click('.ec-headerNav__item:nth-child(3) a');
    await page.waitForSelector('#classcategory_id1');
    await page.select('#classcategory_id1', 1);
    await wait(1000);
    await page.select('#classcategory_id2', 1);
    await page.click('.ec-blockBtn--action')
    await wait(500);
    await page.click('.ec-inlineBtn--action')
    await wait(500);
    await page.click('.ec-blockBtn--action')
    await wait(500);
    await page.click('.ec-blockBtn--action')
    await wait(500);
    await page.click('.ec-blockBtn--action')
  }
  await test(users[1])
  await browser.close();
})();
