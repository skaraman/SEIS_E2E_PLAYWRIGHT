import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions";



export const locators = {
	BULK_ACTIONS: "#bulkActions",
	USER_LEVEL: "select2-chosen-20",
	STATUS: "#select2-chosen-21",
	PROVIDER_TYPES: "#select2-chosen-23",
	PERMISSIONS: "#select2-chosen-25",
	DISTRICTS: "#select2-chosen-27"


}
/* function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
	  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
  } */

  function generateRandom() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxyyxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


export const AddNewUser = async (page: Page)  => {
	const userName = `Testing${generateRandom()}`
	await page.getByRole('button', { name: ' Add a New User' }).click();
	await page.locator("[ng-model='vm.user.FirstName']").click();
	await page.locator("[ng-model='vm.user.FirstName']").fill('firstNamePlaywright');
	await page.locator("[ng-model='vm.user.LastName']").click();
	await page.locator("[ng-model='vm.user.LastName']").fill('lastNamePlaywright');
	await page.locator('#Username').click();
	await page.locator('#Username').fill(userName);
	await page.locator('#password').click();
	await page.locator('#password').fill('Seis2017!');
	await page.locator('#password').press('Tab');
	await page.locator('#passwordConfirmation').fill('Seis2017!');
	await page.locator('div:nth-child(4) > div:nth-child(2) > .form-control').click();
	await page.locator('div:nth-child(4) > div:nth-child(2) > .form-control').fill('engineer');
	await page.locator('div:nth-child(4) > div:nth-child(4) > .form-control').click();
	await page.locator('div:nth-child(4) > div:nth-child(4) > .form-control').fill('132456');
	await page.locator('input[name="Phone"]').click();
	await page.locator('input[name="Phone"]').fill('9167564356');
	await page.getByPlaceholder('999-999-9999').click();
	await page.getByPlaceholder('999-999-9999').fill('915-234-5467');
	await page.locator('input[type="email"]').click();
	await page.locator('input[type="email"]').fill('testing@sjcoe.net');
	await page.getByRole('link', { name: '----Select One----' }).click();
	await page.getByRole('option', { name: 'District' }).click();
	await page.getByRole('link', { name: '-- Select One --' }).click();
	await page.getByRole('option', { name: 'District' }).click();
	await page.getByRole('link', { name: '-----Select One-----' }).click();
	await page.getByRole('option', { name: 'Demo District' }).click();
	await page.getByLabel('No').check();
	await page.getByRole('row', { name: 'Permission Description' }).locator('input[type="checkbox"]').check();
	await page.getByRole('button', { name: 'Save' }).click();

return userName
  }

  export const DeleteNewUser = async (page: Page, userName:string) => {
	await page.getByLabel('Search:').click();
	await page.getByLabel('Search:').fill(userName);
	//await page.waitForSelector('tbody');

	await page.waitForSelector("[title='lastNamePlaywright']");
	await clickElement(page, "[title='Delete']");
	await page.getByRole('button', { name: 'OK' }).click();
	await page.getByText('User deleted successfully').click();

  }

  export const RestoreUser = async (page: Page, userName:string) => {
	await page.getByRole('link', { name: 'Active' }).click();
	await page.getByRole('option', { name: 'Deleted' }).click();
	await page.getByRole('button', { name: 'Find' }).click();
	await page.waitForSelector('tbody');
	await page.getByLabel('Search:').click();
	await page.getByLabel('Search:').fill(userName);
	await clickElement(page, "[title='Restore']");
	await page.getByText('User restored successfully').click();
	await page.getByRole('link', { name: 'Deleted' }).click();
	await page.getByRole('option', { name: 'Active' }).click();
	await page.getByRole('button', { name: 'Find' }).click();
	await page.waitForSelector('tbody');
	await page.getByLabel('Search:').click();
	await page.getByLabel('Search:').fill(userName);
	await clickElement(page, "[title='Delete']");
	await page.getByRole('button', { name: 'OK' }).click();
	await page.getByText('User deleted successfully').click();



  }


