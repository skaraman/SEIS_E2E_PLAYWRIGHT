import { Page, expect } from "@playwright/test";
import { verify, actions } from "../../helpers";
import { clickElement, enterTextField } from "../../helpers/actions";


export const locators = {
  DELIVER_ASSESSMENT_ICN: "//*[@title='Deliver Assessment']",
  ADD_ASSESSMENT_BTN: "text=Add Assessment",
  ASSESSMENT_DATE: "#AssessmentDate",
  DELIVERY_GROUP_RADIO: "Delivery614",
  DISTRICT_TO_BILL_DROPDOWN: "#District",
  ASSESSMENTS_TABLE: ".table"
};


//Edit Assessment Page
export const fillOutEditAssessmentFields = async (page: Page): Promise<void> => {

 // await page.fill(locators.ASSESSMENT_DATE, "11/07/2022");
 await page.locator('#AssessmentDate').click();
  await page.locator('.today').nth(0).click();
await page.locator("#assessmentType2").selectOption("string:1");
  await page.getByText('Group').first().click();
  await page.getByRole('link', { name: '--Select One--' }).click();
  await page.getByRole('option', { name: 'Bauxbatons' }).click();
  await page.getByRole('link', { name: '----Select One----' }).click();
  await page.getByRole('option', { name: 'Materials provided for home use' }).click();
  await page.getByRole('link', { name: 'Deer Park Elementary' }).click();
  await page.getByRole('option', { name: 'Another School Elementary' }).click();
  await page.getByPlaceholder('Comments').fill('Testing Assessment page');
  await page.getByRole('button', { name: 'Save' }).click();

}

export const fillOutAddTcmFields = async (page: Page): Promise<void> => {
  await page.locator('#TcmDate').click();
  await page.locator('.old.day').nth(0).click();
  await page.getByRole('link', { name: '---Select One---' }).click();
  await page.getByRole('option', { name: 'Developing Plan' }).click();
  await page.getByRole('link', { name: '--Select One--' }).click();
  await page.getByRole('option', { name: 'Bauxbatons' }).click();
  await page.getByRole('link', { name: '----Select One----' }).click();
  await page.getByRole('option', { name: 'Supported student on digital accommodations' }).click();
  await page.getByRole('link', { name: 'Supported student on digital accommodations' }).click();
  await page.locator('#select2-drop-mask').click();
  await page.getByRole('link', { name: 'Supported student on digital accommodations' }).click();
  await page.getByRole('option', { name: 'Service provided via Google Hangout' }).click();
  await page.locator('#TCMMinutes').click();
  await page.locator('#TCMMinutes').fill('40');
  await page.getByRole('link', { name: '---Select One---' }).click();
  await page.getByRole('option', { name: 'Objectives' }).click();
  await page.getByPlaceholder('Comments').click();
  await page.getByPlaceholder('Comments').fill('this is a test!');
  await page.locator('input[type="checkbox"]').check();
  await page.locator('#Name').click();
  await page.locator('#Name').fill('Tester');
  await page.getByRole('button', { name: 'Save' }).click();
 /*  await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button', { name: ' this is a test!' }).click(); */
  await page.waitForTimeout(5000)
  await page.locator("[id='deleteTcm']").last().click();
  await page.getByRole('button', { name: 'Delete Assessment' }).click();

}
