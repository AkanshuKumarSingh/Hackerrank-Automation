const puppeteer = require("puppeteer");
let url = "https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login/"
let page;

// to install puppeteer : npm i puppeteer

async function fn() {
    // to open the browser
    try {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
        });

       // to get the current pages of browser  
        let pagesArr = await browser.pages();
        page = pagesArr[0];
        await page.goto(url);
        await page.type("#input-1", "Email", { delay: 100 });
        await page.type("#input-2", "Password", { delay: 100 });
        
        //login
        await waitClickNavigate(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
        await waitClickNavigate("[title='Interview Preparation Kit'] a");
        await waitClickNavigate("[data-attr1='warmup']");
        await page.waitForSelector(".js-track-click.challenge-list-item", { visible: true })

        let hrefArr = await page.evaluate(function () {
            let allBtns = document.querySelectorAll(".js-track-click.challenge-list-item");
            let hrefArr = [];
            for (let i = 0; i < allBtns.length; i++) {
                let href = allBtns[i].getAttribute("href");   
                hrefArr.push(href);
            }
            return hrefArr;
        })

        for (let i = 0; i < hrefArr.length; i++) {
            let link = "https://www.hackerrank.com" + hrefArr[i];
            await submitCode(link);
        }

        // await waitClickNavigate(".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled");
        // await page.waitForSelector("[data-attr2='Editorial']", { visible: true });
        

        // await page.click("[data-attr2='Editorial']");
        // await handleLockBtn(".ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled");
        // code = await page.evaluate(function () {
        //     return document.querySelector(
        //         ".challenge-editorial-block.editorial-setter-code pre"
        //     ).innerText;
        // });
        // language = await page.evaluate(function () {
        //     return document.querySelector(
        //         ".challenge-editorial-block.editorial-setter-code h3"
        //     ).innerText;
        // });
        // await page.click("[data-attr2='Problem']");
        // await pasteCode();

    } catch (err) {
        console.log(err);
    }
}

async function waitClickNavigate(selector) {
    try {
        console.log("Before");
        //to wait for selector
        await page.waitForSelector(selector, { visible: true })
        // to wait for going to next page
        // promise all gives promise which resolves when 
        // all promise inside it resoved
        await Promise.all([page.waitForNavigation(), page.click(selector)])
        console.log("After");
    } catch(err) {
        console.log(err);
    }
}

async function handleLockBtn(selector) {
    try {
        await page.waitForSelector(selector, { visible: true })
        await page.click(selector);

    } catch (err) {
        console.log("button was already clicked");
    }
}

async function pasteCode(code,language) {
    try {
        await page.waitForSelector("[type='checkbox']",{visible : true})
        await page.click("[type='checkbox']");
        await page.waitForSelector("#input-1");
        await page.type("#input-1", code);
        await page.keyboard.down("Control");
        await page.keyboard.press("A");
        await page.keyboard.press("X");
        await page.keyboard.up("Control");
        await page.click(".css-1hwfws3");
        await page.type(".css-1hwfws3", language);
        await page.keyboard.press("Enter");
        await page.keyboard.down("Control");
        await page.click(".monaco-editor.no-user-select.vs");
        await page.keyboard.press("A");
        await page.keyboard.press("V");
        await page.keyboard.up("Control");
        await page.click(
            ".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled"
        );
        await page.waitForSelector(".ui-card.submission-congratulations.ui-layer-2",{visible:true})
    } catch {
        console.log(err);
    }
}

async function submitCode(link) {
    // await waitClickNavigate(".challenge-submit-btn");
    await page.goto(link);
    await page.waitForSelector("[data-attr2='Editorial']", { visible: true });
    await page.click("[data-attr2='Editorial']");

    await handleLockBtn(".editorial-content-locked .ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled");
    
    await page.waitForSelector(".challenge-editorial-block.editorial-setter-code pre", { visible: true });
    let code = await page.evaluate(function () {
        return document.querySelector(".challenge-editorial-block.editorial-setter-code pre").innerText;
    });
    console.log(code);
    await page.waitForSelector(".challenge-editorial-block.editorial-setter-code h3", { visible: true });
    let language = await page.evaluate(function () {
        return document.querySelector(".challenge-editorial-block.editorial-setter-code h3").innerText;
    });
    console.log(language);
    // console.log("line number 30");
    await page.waitForSelector('[data-attr2="Problem"]', { visible: true });
    await page.click('[data-attr2="Problem"]');
    await pasteCode(code, language)
}

fn();