import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions";
import { waitForPageReady } from "../../helpers/layout";

export const locators = {
  BULK_ACTIONS: "#bulkActions",
  USER_LEVEL: "select2-chosen-20",
  STATUS: "#select2-chosen-21",
  PROVIDER_TYPES: "#select2-chosen-23",
  PERMISSIONS: "#select2-chosen-25",
  DISTRICTS: "#select2-chosen-27"

}

function generateRandom() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxyyxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}


export const AddNewUser = async (page: Page) => {
  const userName = `Testing${generateRandom()}`
  await clickElement(page, page.getByRole('button', { name: ' Add a New User' }))
  await clickElement(page, "[ng-model='vm.user.FirstName']");
  await page.locator("[ng-model='vm.user.FirstName']").fill('firstNamePlaywright');
  await clickElement(page, "[ng-model='vm.user.LastName']");
  await page.locator("[ng-model='vm.user.LastName']").fill('lastNamePlaywright');
  await clickElement(page, '#Username');
  await page.locator('#Username').fill(userName);
  await clickElement(page, '#password');
  await page.locator('#password').fill('Seis2017!');
  await page.locator('#password').press('Tab');
  await page.locator('#passwordConfirmation').fill('Seis2017!');
  await clickElement(page, 'div:nth-child(4) > div:nth-child(2) > .form-control');
  await page.locator('div:nth-child(4) > div:nth-child(2) > .form-control').fill('engineer');
  await clickElement(page, 'div:nth-child(4) > div:nth-child(4) > .form-control');
  await page.locator('div:nth-child(4) > div:nth-child(4) > .form-control').fill('132456');
  await clickElement(page, 'input[name="Phone"]');
  await page.locator('input[name="Phone"]').fill('9167564356');
  await clickElement(page, '[placeholder="999-999-9999"]');
  await page.getByPlaceholder('999-999-9999').fill('915-234-5467');
  await clickElement(page, 'input[type="email"]');
  await page.locator('input[type="email"]').fill('testing@sjcoe.net');

  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'District', exact: true }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'District Program Manager' }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Demo District' }));
  await clickElement(page, page.getByLabel('No'));
  await clickElement(page, page.getByRole('row', { name: 'Permission Description' }).locator('input[type="checkbox"]'));
  await clickElement(page, page.getByRole('button', { name: 'Save' }));
  return userName
}

export const DeleteNewUser = async (page: Page, userName: string) => {
  // Enhanced waiting for page readiness
  await waitForPageReady(page);
  
  // Wait for search input to be available with retry
  let searchInput;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      searchInput = page.locator('label:has-text("Search:") >> input');
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      break;
    } catch {
      if (attempt === 2) throw new Error('Search input not found after retries');
      await page.waitForTimeout(2000);
    }
  }
  
  await searchInput.fill(userName);
  await waitForPageReady(page);
  
  // Wait for user record to appear with enhanced checking
  const userCell = page.locator(`td[title*="${userName}"]`);
  await userCell.waitFor({ state: 'visible', timeout: 15000 });
  
  // Click delete with retry logic
  const deleteButton = page.locator("[title='Delete']");
  await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
  await clickElement(page, "[title='Delete']");
  
  // Handle confirmation modal with enhanced waiting
  const confirmModal = page.locator('.modal-dialog >> button:has-text("OK")');
  await confirmModal.waitFor({ state: 'visible', timeout: 10000 });
  await clickElement(page, '.modal-dialog >> button:has-text("OK")');
  
  // Wait for success message with timeout
  try {
    await clickElement(page, page.getByText('User deleted successfully'));
  } catch {
    // Check if message appears as text only
    await page.waitForSelector('text=User deleted successfully');
  }
}

export const RestoreUser = async (page: Page, userName: string) => {
  await waitForPageReady(page);
  
  // Switch to Deleted status with enhanced waiting
  await clickElement(page, page.getByRole('link', { name: 'Active' }));
  await clickElement(page, page.getByRole('option', { name: 'Deleted' }));
  await clickElement(page, page.getByRole('button', { name: 'Find' }));

  // Enhanced waiting for loading to complete
  await page.waitForSelector('h3:has-text("Loading")', { state: 'hidden', timeout: 20000 });
  await waitForPageReady(page);
  
  // Search for deleted user with retry logic
  let searchInput;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      searchInput = page.locator('label:has-text("Search:") >> input');
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      break;
    } catch {
      if (attempt === 2) throw new Error('Search input not found after retries');
      await page.waitForTimeout(2000);
    }
  }
  
  await searchInput.fill(userName);
  await waitForPageReady(page);
  
  // Wait for deleted user record to appear
  const userCell = page.locator(`td[title*="${userName}"]`);
  await userCell.waitFor({ state: 'visible', timeout: 15000 });
  
  // Restore user
  await clickElement(page, "[title='Restore']");
  
  // Wait for success message
  try {
    await clickElement(page, page.getByText('User restored successfully'));
  } catch {
    await page.waitForSelector('text=User restored successfully', { timeout: 5000 });
  }
  
  await waitForPageReady(page);
  
  // Switch back to Active status
  await clickElement(page, page.getByRole('link', { name: 'Deleted' }));
  await clickElement(page, page.getByRole('option', { name: 'Active' }));
  await clickElement(page, page.getByRole('button', { name: 'Find' }));
  await page.waitForSelector('h3:has-text("Loading")', { state: 'hidden', timeout: 20000 });
  await waitForPageReady(page);
  
  // Search for restored user and delete again
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      searchInput = page.locator('label:has-text("Search:") >> input');
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      break;
    } catch {
      if (attempt === 2) throw new Error('Search input not found after retries');
      await page.waitForTimeout(2000);
    }
  }
  
  await searchInput.fill(userName);
  await waitForPageReady(page);
  
  const restoredUserCell = page.locator(`td[title*="${userName}"]`);
  await restoredUserCell.waitFor({ state: 'visible', timeout: 15000 });
  
  await clickElement(page, "[title='Delete']");
  await clickElement(page, page.getByRole('button', { name: 'OK' }));

  try {
    await clickElement(page, page.getByText('User deleted successfully'));
  } catch {
    await page.waitForSelector('text=User deleted successfully', { timeout: 5000 });
  }
}


