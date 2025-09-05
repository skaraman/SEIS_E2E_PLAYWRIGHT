import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions";

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
  await clickElement(page, page.locator('#AssessmentDate'));
  // Wait for calendar to be visible before selecting date
  await page.waitForSelector('td.day.old', { state: 'visible', timeout: 5000 })
  await clickElement(page, page.locator('td.day.old').first());
  await page.locator("#assessmentType2").selectOption("string:1")
  // Wait for group radio button to be available
  await page.waitForSelector('text=Group', { state: 'visible', timeout: 5000 })
  await clickElement(page, page.getByText('Group').first());
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Materials provided for home use' }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Bauxbatons' }));

  await clickElement(page, page.locator('[id="s2id_AttendanceSchool"]'));
  await clickElement(page, page.getByRole('option', { name: 'Another School Elementary' }));
  await clickElement(page, page.getByPlaceholder('Comments'));
  await page.getByPlaceholder('Comments').fill('Testing Assessment page');
  await clickElement(page, page.getByRole('button', { name: 'Save' }));

}

export const fillOutAddTcmFields = async (page: Page): Promise<void> => {
  await clickElement(page, page.locator('#TcmDate'));
  await clickElement(page, page.locator('.old.day').nth(0));

  await clickElement(page, page.getByRole('link', { name: 'Select One'}));
  await clickElement(page, page.getByRole('option', { name: 'Developing Plan' }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Objectives' }));

  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Bauxbatons' }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Supported student on digital accommodations' }));
  await clickElement(page, page.getByRole('link', { name: 'Supported student on digital accommodations' }));
  await clickElement(page, page.locator('#select2-drop-mask'));
  await clickElement(page, page.getByRole('link', { name: 'Supported student on digital accommodations' }));
  await clickElement(page, page.getByRole('option', { name: 'Service provided via Google Hangout' }));
  await clickElement(page, page.locator('#TCMMinutes'));
  await page.locator('#TCMMinutes').fill('40')

  await clickElement(page, page.getByPlaceholder('Comments'));
  await page.getByPlaceholder('Comments').fill('this is a test!')
  await page.locator('input[type="checkbox"]').check()
  await clickElement(page, page.locator('#Name'));
  await page.locator('#Name').fill('Tester')
  await clickElement(page, page.getByRole('button', { name: 'Save' }));
  await clickElement(page, page.locator("[id='deleteTcm']").last());
  await clickElement(page, page.getByRole('button', { name: 'Delete Assessment' }));

}
