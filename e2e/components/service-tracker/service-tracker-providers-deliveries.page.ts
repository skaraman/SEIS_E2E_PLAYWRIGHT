import { Page } from '@playwright/test'
import { verify, actions } from '../../helpers'

const {
	verifyIfPageUrlIsCorrect,
	verifyIfElementIsVisible,
	verifyIfElementTextContentIsCorrect,
} = verify
const { getTextContent } = actions

export const locators = {
	HEADER_H1: "//h1[contains(text(),'Deliveries')]",
	DELIVERIES_TABLE_WRAPPER: '#Deliveries_wrapper',
	ACTION_COLUMN_LBL: '#iepid',
	NAME_COLUMN_LBL: '#Name',
	SERVICE_COLUMN_LBL: '#Service',
	DELIVERY_COLUMN_LBL: '#Delivery',
	START_DATE_COLUMN_LBL: '#StartDate',
	END_DATE_COLUMN_LBL: '#EndDate',
	SESSIONS_COLUMN_LBL: "[id='#Sessions/Frequency']",
	TOTAL_MINUTES_COLUMN_LBL: "[id='#TotalMinutes(min/year)']",
	TOTAL_DELIVERED_COLUMN_LBL: '#TotalDelivered',
	BULK_DELIVERY_BTN: "//button[contains(text(),'Bulk Delivery')]",
}


// FOR TEACHER ROLE
export const addNewDelivery = async (page: Page) => {

await page.locator('#ClaimsDate').click();
  await page.getByRole('cell', { name: '12' }).click();
  await page.locator('#ClaimsDate').press('Tab');
  await page.locator('#s2id_attendanceCode').getByRole('link', { name: '--Select One--' }).click();
  await page.getByRole('option', { name: 'Unexcused Absence' }).click();
  await page.getByRole('link', { name: '--Select One--' }).click();
  await page.getByRole('option', { name: 'Bauxbatons' }).click();
  await page.getByRole('link', { name: '----Select One----' }).click();
  await page.getByRole('option', { name: 'Referred to community resources/agency' }).click();
  await page.locator('#ClaimableMinutes').click();
  await page.locator('#ClaimableMinutes').click({
    clickCount: 3
  });
  await page.locator('#ClaimableMinutes').fill('50');
  await page.getByPlaceholder('Comments').click();
  await page.getByPlaceholder('Comments').fill('This is a Test!');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator("[title='Comment']").first().click();
  await page.getByRole('button', { name: ' This is a Test!' }).isVisible();
  await page.locator("[title='Delete']").click()
  await page.getByRole('button', { name: 'Delete Claim' }).click();


}
