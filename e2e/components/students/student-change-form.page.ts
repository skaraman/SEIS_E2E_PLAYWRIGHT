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

  await clickElement(page, page.getByRole('option', { name: 'Abby, Downtown' }))
  await clickElement(page, page.getByLabel('Comments'))
  await clickElement(page, page.getByRole('link', { name: 'Select One' }))
  await clickElement(page, page.getByRole('option', { name: 'Change of Address' }))
  //  if (!(await generatePackageButton.isVisible())) {
  await page.getByLabel('Comments').isVisible()
  await page.getByLabel('Comments').fill('This is a test for requesting change of address for student.')
  await clickElement(page, page.getByRole('button', { name: 'Submit Request' }))
  await page.getByText('Your request has been submitted. You can check the status of the request on your').isVisible()
  //Navigates to SELPA role to accept request
  await page.goto('/login')
  await loginSelpaRole(page)
  await clickElement(page, page.locator("[id='StudentAddressChanges']"))
  await clickElement(page, page.getByRole('gridcell', { name: 'Requested: activate to sort column descending' }).first())
  await clickElement(page, page.locator("[title='Completed']").first())
  await enterTextField(page, studentChangeFormPage.locators.COMMENT, "This update is completed.")
  await clickElement(page, page.getByRole('button', { name: 'Save' }))
  await page.getByText('Change request completed').isVisible()
  await clickElement(page, page.getByRole('gridcell', { name: 'Requested: activate to sort column descending' }).first())
  await clickElement(page, locators.DELETE_ICN)
  await clickElement(page, page.getByRole('button', { name: 'OK' }))
  await page.goto('/login')
  await loginTeacherRole(page)
  await clickElement(page, page.locator("[id='StudentAddressChangesTeacher']"))
  await clickElement(page, page.getByRole('gridcell', { name: 'Requested: activate to sort column descending' }).first())
  await clickElement(page, locators.DELETE_ICN)
  await clickElement(page, page.getByRole('button', { name: 'OK' }))
}