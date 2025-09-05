import { Page } from "@playwright/test";
import {  verifyFileDownload } from "../../helpers/verify";
import { waitForPageReady } from "../../helpers/layout";
import { clickElement } from "../../helpers/actions";

export const locators = {
  ADD_CRITERIA_BTN: "text=addCriteria",
  SEARCH_TOOLS: "#searchTools",
  COLUMN_OPTIONS_BTN: "text=Column Options",
  TYPE_OF_REPORT_OPTIONS: "select2-chosen-15",
  TABLE: ".table",
  CHECK_ALL: "[title='Check/ Uncheck all']",
  CHECK_ONE: "tbody input[type='checkbox']",
  CANCEL_BTN: ".btn-default",
  SELECT_IFSP_FORMS: "select2-chosen-344",
};

export const selectTypeOfReport = async (page: Page) => {
  await clickElement(page, page.getByRole("link", { name: "Student report (Add columns to show)" }));
  await clickElement(page, page.getByRole("option", { name: "Mental Health service report (Only students with Mental Health services will show up)" }));
  await clickElement(page, page.getByRole("button", { name: "OK" }));
};

export const printBulkIep = async (page: Page, language: string = "English") => {
  await clickElement(page, page.getByRole('link', { name: 'Print', exact: true }));
  await clickElement(page, page.getByRole("option", { name: "Bulk Print IEP Forms" }));
  await clickElement(page, page.getByRole("button", { name: "Go" }));

  // Wait for form to load completely
  await page.waitForSelector('#s2id_formID', { state: 'visible' });
  await clickElement(page, page.locator('#s2id_formID'));
  await waitForPageReady(page);
  await clickElement(page, page.getByRole('option', { name: 'Referral', exact: true }));

  // Ensure language option is available and selected
  const languageOption = page.getByLabel(language);
  await languageOption.waitFor({ state: 'visible', timeout: 10000 });
  await languageOption.check();

  await clickElement(page, page.getByRole("button", { name: "Submit Print Job" }));

  // Enhanced waiting for print job processing
  await page.waitForTimeout(3000); // Allow initial processing
  
  // Look for print queue button with retry logic
  let printQueueFound = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const pendingButton = page.getByRole("button", { name: "1 pending" }).or(
        page.getByRole("button", { name: "pending" })
      );
      await pendingButton.waitFor({ state: 'visible', timeout: 5000 });
      await clickElement(page, pendingButton);
      printQueueFound = true;
      break;
    } catch {
      await page.waitForTimeout(2000);
    }
  }
  
  if (!printQueueFound) {
    console.warn('Print queue button not found, continuing...');
  }
  
  // Close dialog
  try {
    await clickElement(page, page.getByRole("button", { name: "Close" }));
  } catch {
    // Continue if close button not found
  }
  
  await verifyFileDownload(page)
}

export const printBulkProgressReports = async (page: Page) => {
  await clickElement(page, page.getByRole("link", { name: "Print", exact: true }));
  await clickElement(page, page.getByRole("option", { name: "Bulk Print Progress Reports" }));
  await clickElement(page, page.getByRole("button", { name: "Go" }));
  await clickElement(page, page.getByRole("button", { name: "Submit Print Job" }));

  // Enhanced waiting for print job processing
  await page.waitForTimeout(3000); // Allow initial processing
  
  // Look for print queue button with retry logic
  let printQueueFound = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const pendingButton = page.getByRole("button", { name: "pending" }).or(
        page.getByRole("button", { name: "1 pending" })
      );
      await pendingButton.waitFor({ state: 'visible', timeout: 5000 });
      await clickElement(page, pendingButton);
      printQueueFound = true;
      break;
    } catch {
      await page.waitForTimeout(2000);
    }
  }
  
  if (!printQueueFound) {
    console.warn('Print queue button not found, continuing...');
  }
  
  // Close dialog
  try {
    await clickElement(page, page.getByRole("button", { name: "Close" }));
  } catch {
    // Continue if close button not found
  }
  
  await verifyFileDownload(page)
};

export const printBulkIfspForms = async (page: Page) => {
  await clickElement(page, page.getByRole("link", { name: "Print", exact: true }));
  await clickElement(page, page.getByRole("option", { name: "Bulk Print IFSP Forms" }));
  await clickElement(page, page.getByRole("button", { name: "Go" }));

  // Wait for form to load and select option
  await page.waitForTimeout(2000);
  await clickElement(page, page.locator('form:has-text("Please Note: Only 100 student records can be printed at a time. Use the Return t")').getByRole('link'));
  await clickElement(page, page.getByRole('option', { name: 'Services', exact: true }));
  await clickElement(page, page.getByRole("button", { name: "Submit Print Job" }));
  
  // Enhanced waiting for print processing notification
  try {
    await clickElement(page, page.getByText("Processing print request in Print Queue."));
  } catch {
    console.warn('Processing notification not found, continuing...');
  }
  
  // Enhanced waiting for print job processing
  await page.waitForTimeout(3000); // Allow initial processing
  
  // Look for print queue button with retry logic
  let printQueueFound = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const pendingButton = page.getByRole("button", { name: "pending" }).or(
        page.getByRole("button", { name: "1 pending" })
      );
      await pendingButton.waitFor({ state: 'visible', timeout: 5000 });
      await clickElement(page, pendingButton);
      printQueueFound = true;
      break;
    } catch {
      await page.waitForTimeout(2000);
    }
  }
  
  if (!printQueueFound) {
    console.warn('Print queue button not found, continuing...');
  }
  
  // Close dialog
  try {
    await clickElement(page, page.getByRole("button", { name: "Close" }));
  } catch {
    // Continue if close button not found
  }
  
  await verifyFileDownload(page);
};

export const filterOptionsAndCriteria = async (page: Page) => {
  await clickElement(page, page.locator('.ui-sortable-handle').last());
  await clickElement(page, page.getByRole('option', { name: 'Age', exact: true }));
  await clickElement(page, page.getByRole('option', { name: 'Grade Level' }));
  await page.keyboard.press('Tab')
  await clickElement(page, page.getByRole('button', { name: 'OK' }));
  await page.getByText('Search Columns Saved.').isVisible();
  await clickElement(page, page.locator('button:has-text("Add")'));
  await clickElement(page, page.locator('.row > .col-xs-1').first());
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Age', exact: true }));
  await clickElement(page, page.locator('input[name="number"]'));
  await page.locator('input[name="number"]').fill('7');
  await clickElement(page, page.getByRole('button', { name: 'Search', exact: true }).first());
};

export const downloadResults = async (page: Page) => {
  await clickElement(page, page.getByRole('link', { name: 'Print', exact: true }));
  await clickElement(page, page.getByRole('option', { name: 'Download Data' }));
  await clickElement(page, page.getByRole('button', { name: 'Go' }));
  await verifyFileDownload(page);
};

export const printResults = async (page: Page) => {
  await clickElement(page, page.getByRole('button', { name: 'Print' }));
  await clickElement(page, page.locator('div[role="dialog"]:has-text("Print Options Print forms in English Spanish Orientation Portrait Landscape Auto")').getByRole('button', { name: 'Print' }));
  await clickElement(page, page.getByText('Processing print request in Print Queue.'));
  await verifyFileDownload(page);
};
