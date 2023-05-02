
'use strict';

const puppeteer = require('puppeteer');
const users = require('./users.json');
(async() => {
const browser = await puppeteer.launch({
    headless: true,
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
  await page.goto('http://localhost:8000/admin');
  await page.waitForSelector('#login_id');
  await page.type('#login_id', 'admin');
  await page.type('#password', 'password');
  await page.click('[type="submit"]');
  await page.waitForSelector('[href="#nav-customer"]');
  await page.click('[href="#nav-customer"]');
  const createUser = async (user)=> {
    console.log(`User: ${user.email} Password: password`)
    await new Promise((res)=>{setTimeout(()=>{res()}, 1000)})
    await page.click('#nav-customer li:nth-child(2)');
    await page.waitForSelector('#admin_customer_name_name01');
    await page.type('#admin_customer_name_name01', user.name.split(' ')[0]);
    await page.type('#admin_customer_name_name02', user.name.split(' ')[1]);
    await page.type('#admin_customer_kana_kana01', user.kana.split(' ')[0]);
    await page.type('#admin_customer_kana_kana02', user.kana.split(' ')[1]);
    await page.type('#admin_customer_postal_code', '134-0081');
    await new Promise((res)=>{setTimeout(()=>{res()}, 1000)})
    await page.type('#admin_customer_address_addr02', 'test');
    await page.type('#admin_customer_email', user.email);
    await page.type('#admin_customer_phone_number', '1234567890');
    await page.type('#admin_customer_password_first', 'password');
    await page.type('#admin_customer_password_second', 'password');
    await page.click('#admin_customer_sex_1');
    await page.click('#admin_customer_status');
    await page.select('#admin_customer_status', '2');
    await page.click('.btn');
    await new Promise((res)=>{setTimeout(()=>{res()}, 5000)})
  }
  for (const user of users) {
    await createUser(user)
  }
  await browser.close();
})();
