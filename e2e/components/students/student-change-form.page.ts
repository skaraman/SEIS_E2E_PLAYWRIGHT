import { Page } from "@playwright/test";
import { studentChangeFormPage } from ".";
import { clickElement, enterTextField } from "../../helpers/actions";
import { loginSelpaRole, loginTeacherRole } from '../../helpers/common-flows'

export const locators = {
	SELECT_STUDENT: "#s2id_Student",
	COMMENT: "[id='Message']",
	DELETE_ICN: "[title='Remove Notice']"
}

export const requestChangeAddress = async (page: Page) => {

  await page.getByRole('option', { name: 'Abby, Downtown' }).click()
  await page.getByLabel('Comments').click()
  await page.getByRole('link', { name: '----Select One----' }).click()
  await page.getByRole('option', { name: 'Change of Address' }).click()
  //  if (!(await generatePackageButton.isVisible())) {
  await page.getByLabel('Comments').isVisible()
  await page.getByLabel('Comments').fill('This is a test for requesting change of address for student.')
  await page.getByRole('button', { name: 'Submit Request' }).click()
  await page.getByText('Your request has been submitted. You can check the status of the request on your').isVisible()
  //Navigates to SELPA role to accept request
  await page.goto('/login')
  await loginSelpaRole(page)
  await page.locator("[id='StudentAddressChanges']").click()
  await page.getByRole('gridcell', { name: 'Requested: activate to sort column descending' }).first().click()
  await page.locator("[title='Completed']").first().click()
  await enterTextField(page, studentChangeFormPage.locators.COMMENT, "This update is completed.")
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByText('Change request completed').isVisible()
  await page.getByRole('gridcell', { name: 'Requested: activate to sort column descending' }).first().click()
  await clickElement(page, locators.DELETE_ICN)
  await page.getByRole('button', { name: 'OK' }).click()
  await page.goto('/login')
  await loginTeacherRole(page)
  await page.locator("[id='StudentAddressChangesTeacher']").click()
  await page.getByRole('gridcell', { name: 'Requested: activate to sort column descending' }).first().click()
  await clickElement(page, locators.DELETE_ICN)
  await page.getByRole('button', { name: 'OK' }).click()
}