import { Page } from '@playwright/test'
import { verify, actions } from '../../helpers'

const {
  verifyIfPageUrlIsCorrect,
  verifyIfElementIsVisible,
  verifyIfElementTextContentIsCorrect,
} = verify
const { getTextContent, clickElement } = actions

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
  await clickElement(page, page.locator('#ClaimsDate'));
  await clickElement(page, page.getByRole('cell', { name: '12' }));
  await page.locator('#ClaimsDate').press('Tab')
  await clickElement(page, page.locator('#s2id_attendanceCode').getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Unexcused Absence' }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Referred to community resources/agency' }));
  await clickElement(page, page.getByRole('link', { name: 'Select One' }));
  await clickElement(page, page.getByRole('option', { name: 'Bauxbatons' }));
  await clickElement(page, page.locator('#ClaimableMinutes'));
  await page.locator('#ClaimableMinutes').click({ clickCount: 3 })
  await page.locator('#ClaimableMinutes').fill('50');
  await clickElement(page, page.getByPlaceholder('Comments'));
  await page.getByPlaceholder('Comments').fill('This is a Test!');
  await clickElement(page, page.getByRole('button', { name: 'Save', exact: true }));
  await clickElement(page, page.locator("[title='Comment']").last());
  await page.getByRole('button', { name: ' This is a Test!' }).isVisible();
  await clickElement(page, page.locator("[title='Delete']").last());
  await clickElement(page, page.getByRole('button', { name: 'Delete Claim' }));
}
