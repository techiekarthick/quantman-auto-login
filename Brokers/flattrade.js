const { delay, screen, QUANTMAN_SIGN_IN_URL } = require('./helper');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const doLoginFlattrade = async (username, password, pin) => {
  var driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();
  console.log('Browser initialized');

  driver.manage().setTimeouts({ implicit: 3000, pageLoad: 300000, script: 30000 })

  await driver.get(QUANTMAN_SIGN_IN_URL);
  console.log('Login Page opened');
  await delay(500);

  (await driver.findElement(By.id('flattrade-user-auth'))).click()

  await delay(1000);
  (await driver.findElement(By.id('flattrade-client-id'))).sendKeys(username);

  (await driver.findElement(By.id('btn-flattrade'))).click();
  console.log(`step 1 completed `);
  await delay(2000);

  let staleElement = true;
  while (staleElement) {
    try {
      (await driver.findElement(By.xpath("//input[@type = 'text']"))).sendKeys(username);
      staleElement = false;
    } catch (error) {
      console.log(error)
      staleElement = true;
    }
  }

  if (await driver.findElement(By.xpath("//input[@type = 'text']"))) {
    console.log('Found text')
  } else {
    console.log('Not Found text')
  }

  console.log(`step 2 username completed `);
  await delay(1000);
  (await driver.findElement(By.id('pwd'))).sendKeys(password);
  console.log(`step 3 password completed `);

  if (await driver.findElement(By.id('pwd'))) {
    console.log('found password')
  } else {
    console.log('Not found password')
  }

  await delay(1000);

  (await driver.findElement(By.id('pan'))).sendKeys(pin);
  console.log(`step 4 pin completed`);
  if (await driver.findElement(By.id('pan'))) {
    console.log('found pan')
  } else {
    console.log('Not found pan')
  }

  await delay(2000);

  (await driver.findElement(By.id('sbmt'))).click();
  if (await driver.findElement(By.id('sbmt'))) {
    console.log('found sbmt')
  } else {
    console.log('Not found sbmt')
  }
  console.log(`step 5 submit completed `);

  await driver.wait(until.titleIs('Quantman'), 5000);
  console.log(`step 6 Quantman title completed `);

  await driver.quit();
};


const doLogin = async (args) => {
  const { username, password, pin } = args;

  await doLoginFlattrade(username, password, pin)
    .then(() => {
      console.log('successfully completed')
    })
    .catch((e) => {
      console.log('exiting with error ', e);
    });
};

module.exports = {
  doLogin
};