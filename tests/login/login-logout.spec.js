import {test} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { testBase, expect, CommonUI } from '../../utilities/docuport-ui-utilities';
import { appInfo } from '../../utilities/beta-data-reader';


test ('Test 1 - Login with hard coded values without POM', {tag: '@test1'}, async ({page}) => {
    await page.goto('https://beta.docuport.app/login');
    await page.locator("//label[text()='Username or email']").fill("b1g2_client@gmail.com");
    await page.locator("//label[text()='Password']").fill("Group2");
    await page.locator("//button[@type='submit']").click(); 
    await page.locator("//span[text()=' Continue ']").click(); 
    await expect(page.locator("//div[@class='v-avatar primary']")).toBeVisible();
    //await page.waitForTimeout(3000);
})


test ('Test 2 - Login with hard coded values with POM', {tag: '@test2'}, async ({page}) => {
    // Create a login page object to be able to use members (variables, methods) of that page
    const loginPage = new LoginPage(page); 
    const homePage = new HomePage(page);

    await page.goto('https://beta.docuport.app/login');
    await loginPage.enterUsername("b1g2_client@gmail.com"); 
    await loginPage.enterPassword("Group2");
    await loginPage.clickLoginButton(); 
    await homePage.clickContinueButton(); 
    await expect(homePage.profileIconButton).toBeVisible(); 
    //await page.waitForTimeout(4000);

})


test ('Test 3 - Login with hard coded values with POM with single login method ', {tag: '@test3'}, async ({page}) => {   
    // Create a login page object to be able to use members (variables, methods) of that page
    const loginPage = new LoginPage(page); 
    const homePage = new HomePage(page);

    await page.goto('https://beta.docuport.app/login');
    await loginPage.login("b1g2_client@gmail.com", "Group2"); 
    await homePage.clickContinueButton(); 
    await expect(homePage.profileIconButton).toBeVisible(); 
    //await page.waitForTimeout(4000);

})


// Storing data in JS object - works with KEY and VALUE
const credentials = {
    // KEY:   "VALUE"
    username: "b1g2_client@gmail.com",
    password: "Group2"
}

test ('Test 4 - Login with data from a JS Object ', {tag: '@test4'}, async ({page}) => {   
    // Create a login page object to be able to use members (variables, methods) of that page
    const loginPage = new LoginPage(page); 
    const homePage = new HomePage(page);

    await page.goto('https://beta.docuport.app/login');
    await loginPage.login(credentials.username, credentials.password); 
    await homePage.clickContinueButton(); 
    await expect(homePage.profileIconButton).toBeVisible(); 
    //await page.waitForTimeout(4000);

})


test ('Test 5 - Login as given user type', {tag: '@test5'}, async ({page}) => {   
    // Create a login page object to be able to use members (variables, methods) of that page
    const loginPage = new LoginPage(page); 
    const homePage = new HomePage(page);

    //await page.goto('https://beta.docuport.app/login');
    await loginPage.navigateToLoginPage(); 

    //await loginPage.login(credentials.username, credentials.password); 
    loginPage.loginAs("employee");
    //await homePage.clickContinueButton(); 
    await expect(homePage.profileIconButton).toBeVisible(); 
    await page.waitForTimeout(2000);
    await homePage.validatePageFor("employee");
})


// In terms of ROLE: what is my test data - Advisor, Client, Supervisor, Employee
test ('Test 6 - Login as any given user type', {tag: '@test6'}, async ({page}) => {   
    // Create a login page object to be able to use members (variables, methods) of that page
    const loginPage = new LoginPage(page); 
    const homePage = new HomePage(page);

    //await page.goto('https://beta.docuport.app/login');
    await loginPage.navigateToLoginPage(); 

    //await loginPage.login(credentials.username, credentials.password); 
    await loginPage.loginAs("Manager");
    await homePage.clickContinueButton(); 
    await expect(homePage.profileIconButton).toBeVisible(); 
    await page.waitForTimeout(2000);
})



// The default "test" from plawright will ONLY open BROWSER
//test ('Test 7 - Login as any given user type', {tag: '@test7'}, async ({page}) => {   
//    await page.waitForTimeout(2000);
//})

// The "testBase" we customized for our applicatin is using default "test" from playwrihgt and built our cust step on top of it. 
testBase ('Test 7 - Client left menut validation', {tag: '@test7'}, async ({page}) => {   
    const homePage = new HomePage(page);
    const role = "employee"

    await CommonUI.loginAs(page, role);
    const actualUiMenuItems = await homePage.getLeftMenuItems();  // comes from actual UI
    const expectedMenuItems = CommonUI.getLeftMenuFor(role);  // comes from tst data     
    console.log(actualUiMenuItems);
    console.log(expectedMenuItems);
    expect(actualUiMenuItems).toEqual(expectedMenuItems); 
    await CommonUI.logout(page); 

})


for (const eachRol of appInfo.roles) {

    testBase (`Test 8 - Each Role ${eachRol} left menu validation`, {tag: '@test8'}, async ({page}) => {   
        const homePage = new HomePage(page);
        //const role = "employee"

        await CommonUI.loginAs(page, eachRol);
        const actualUiMenuItems = await homePage.getLeftMenuItems();    // comes from actual UI
        const expectedMenuItems = CommonUI.getLeftMenuFor(eachRol);     // comes from tst data     
        //console.log(actualUiMenuItems);
        //console.log(expectedMenuItems);
        expect(actualUiMenuItems).toEqual(expectedMenuItems); 
        await CommonUI.logout(page); 
    })

}














