
'use strict';

const puppeteer = require('puppeteer');
const users = require('./users.json');
const HOST = process.env.HOST || 'localhost'
const URL = `http://${HOST}:8000`;

(async() => {
const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--lang=ja', '--no-sandbox', '--disabled-setuid-sandbox']  // デフォルトでは言語設定が英語なので日本語に変更
  });
  const page = await browser.newPage();
  let haveError = 'new';
  page.on('dialog', async dialog => {
    haveError = true;
    dialog.accept(); // OK
  });
  const wait = async (time) => {
    return new Promise((res) => {
      setTimeout(() => {
        res()
      }, time)
    })
  }
  const clear = async (page, selector) => {
    await page.evaluate(selector => {
      document.querySelector(selector).value = "";
    }, selector);
  };
  const test = async (user) => {
    await page.goto(URL);
    await page.waitForSelector('.ec-headerNav__item:nth-child(3) a');
    await page.click('.ec-headerNav__item:nth-child(3) a');
    await page.waitForSelector('#login_email');
    await clear(page,'#login_email');
    await page.type('#login_email', user.email);
    await clear(page,'#login_pass');
    await page.type('#login_pass', 'password');
    await wait(1000);
    await page.click('.ec-login [type="submit"]');
    await wait(1000);
    await page.waitForSelector('.ec-newItemRole__listItem:nth-child(2) a');
    await page.click('.ec-newItemRole__listItem:nth-child(2) a');
    await wait(3000);
    await page.waitForSelector('#classcategory_id1');
    await page.select('#classcategory_id1', "1");
    await wait(1000);
    await page.waitForSelector('#classcategory_id2');
    await page.select('#classcategory_id2', "4");
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    if (haveError) {
      haveError = false;
      return;
    }
    await page.waitForSelector('.ec-inlineBtn--action', {visible: true})
    await wait(500);
    await page.click('.ec-inlineBtn--action')
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    await page.goto(URL);
    await page.waitForSelector('.ec-newItemRole__listItem:nth-child(3) a');
    await page.click('.ec-newItemRole__listItem:nth-child(3) a');
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
    await wait(500);
    await page.waitForSelector('.ec-layoutRole__main .ec-blockBtn--action')
    await page.click('.ec-layoutRole__main .ec-blockBtn--action')
  }
  for (let i = 0; i < 1000; i++) {
    try {
      await test(users[i % users.length])
    } catch (e) {
      // Do nothing
    } finally {
      await wait(500);
      await page.waitForSelector('.ec-headerNav__item:nth-child(3) a');
      await page.click('.ec-headerNav__item:nth-child(3) a');
    }
  }
  await browser.close();
})();
