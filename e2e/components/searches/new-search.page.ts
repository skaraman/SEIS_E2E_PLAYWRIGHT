import { Page } from "@playwright/test";
import {  verifyFileDownload } from "../../helpers/verify";
import { waitForPageReady } from "../../helpers/layout";

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
  await page.getByRole("link", { name: "Student report (Add columns to show)" }).click();
  await page.getByRole("option", { name: "Mental Health service report (Only students with Mental Health services will show up)" }).click();
  await page.getByRole("button", { name: "OK" }).click();
};

export const printBulkIep = async (page: Page, language: string = "English") => {
  await page.getByRole('link', { name: 'Print', exact: true }).click()
  await page.getByRole("option", { name: "Bulk Print IEP Forms" }).click()
  await page.getByRole("button", { name: "Go" }).click()
  //await page.locator('form:has-text("Please Note: Only 100 student records can be printed at a time. Use the Return t")').getByRole('link').click();
  await page.locator('#s2id_formID').click()
  await waitForPageReady(page)
  await page.waitForTimeout(1000)
  await page.getByRole('option', { name: 'Referral', exact: true }).click()
  await page.getByLabel(language).check()
  await page.getByRole("button", { name: "Submit Print Job" }).click()
  await page.getByText("Processing print request in Print Queue.").click()
  await page.getByRole("button", { name: "1 pending" }).click()
  await page.getByRole("button", { name: "Close" }).click()
  await verifyFileDownload(page)
}

export const printBulkProgressReports = async (page: Page) => {
  await page.getByRole("link", { name: "Print", exact: true }).click()
  await page.getByRole("option", { name: "Bulk Print Progress Reports" }).click()
  await page.getByRole("button", { name: "Go" }).click()
  await page.getByRole("button", { name: "Submit Print Job" }).click()
  await page.getByText("Processing print request in Print Queue.").click()
  await page.getByRole("button", { name: "pending" }).click()
  await page.getByRole("button", { name: "Close" }).click()
  await verifyFileDownload(page)
};

export const printBulkIfspForms = async (page: Page) => {
  await page.getByRole("link", { name: "Print", exact: true }).click();
  await page.getByRole("option", { name: "Bulk Print IFSP Forms" }).click();
  await page.getByRole("button", { name: "Go" }).click();
  await page.locator('form:has-text("Please Note: Only 100 student records can be printed at a time. Use the Return t")').getByRole('link').click();
  await page.getByRole('option', { name: 'Services', exact: true }).click();
  await page.getByRole("button", { name: "Submit Print Job" }).click();
  await page.getByText("Processing print request in Print Queue.").click();
  await page.getByRole("button", { name: "pending" }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await verifyFileDownload(page);
};

export const filterOptionsAndCriteria = async (page: Page) => {
  await page.locator('.ui-sortable-handle').last().click();
  await page.getByRole('option', { name: 'Age', exact: true }).click();
  await page.getByRole('option', { name: 'Grade Level' }).click();
  await page.keyboard.press('Tab')
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByText('Search Columns Saved.').isVisible();
  await page.locator('button:has-text("Add")').click();
  await page.locator('.row > .col-xs-1').first().click();
  await page.getByRole('link', { name: '-----Select One-----' }).click();
  await page.getByRole('option', { name: 'Age', exact: true }).click();
  await page.locator('input[name="number"]').click();
  await page.locator('input[name="number"]').fill('7');
  await page.getByRole('button', { name: 'Search', exact: true }).first().click()
};

export const downloadResults = async (page: Page) => {
  await page.locator(".select2-choice").getByRole('link', { name: 'Print' }).click()
  await page.getByRole('option', { name: 'Download Data' }).click()
  page.getByRole('button', { name: 'Go' }).click()
  await verifyFileDownload(page)
};

export const printResults = async (page: Page) => {
  await page.getByRole('button', { name: 'Print' }).click();
  await page.locator('div[role="dialog"]:has-text("Print Options Print forms in English Spanish Orientation Portrait Landscape Auto")').getByRole('button', { name: 'Print' }).click();
  await page.getByText('Processing print request in Print Queue.').click();
  await verifyFileDownload(page)
};
