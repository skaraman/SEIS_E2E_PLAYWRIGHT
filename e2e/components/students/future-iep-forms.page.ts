import { Page } from "@playwright/test"
import { clickElement, enterTextField } from "../../helpers/actions"
import { eSignService, iepService } from "../../data"
import { commonFlows } from "../../helpers"
import { loginSelpaRole } from "../../helpers/common-flows"
import { studentsMenuDropDown } from "../navigation-bar"
import { studentIepsPage } from "."
import { selectEligibility } from "./student-ieps.page"
import { waitForPageReady } from "../../helpers/layout"
import { verifyFileDownload } from "../../helpers/verify"

export const locators = {
  QUICK_LINKS: "button span:has-text('Quick Links')",
  TABLE: ".table",
  COMMENTS: ".comments>a",
  ADD_COMMENT: "text=Add Comment",
  TEXT_AREA: "textArea",
  SAVE_BTN: "#saveBtn",
  RETURN_TO_STUDENT_IEPS_BTN: "('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' })",
  PREVIEW_FORM: "[title='Preview Form']",
  EDIT_FORM: "[title='Edit Form']",
  PRINT_SELECTED: "[data-action='future']",
  //E-SIGNATURE
  PASSWORD: "[id='password']",
  SUBMIT: "[type='submit']",
  SIGNATURE_SUBMIT: "[id='submit']",

  /* 	IEP GOAL POGRESS SUMMARY PAGE
  //a[contains(text(),'Affirm Progress Report')] */
}

export const clickReturnToIeps = async (page: Page): Promise<void> => {
  await page.locator("#sticky-bar").getByRole("button", { name: "Return to Student IEPs" }).click()
}

export const printAllForms = async (page: Page): Promise<void> => {
  await waitForPageReady(page)
  await page.locator('#checkAllFirst').first().check()
  await clickElement(page, locators.PRINT_SELECTED)
  await page.getByLabel('NReco').check()
  await clickElement(page, '.modal-content button.btn-primary')
  //await page.waitForTimeout(100000) // Waiting for the file to be generated and download to start
  await verifyFileDownload(page)
}

export const generateEsignaturePreMeeting = async (page: Page): Promise<void> => {
  await page.locator("tr:nth-child(10) > td").first().click()

  const generatePackageButton = page.getByRole("button", {
    name: "Generate E-Signature Package",
  });

  // if (await page.locator('button:has-text("View Current IEP")').isVisible()) {
  //   await page.locator('button:has-text("Cancel")').click()

  // }

  if (!(await generatePackageButton.isVisible())) {
    // Cancel if generate button is not visible
    await page.getByRole('button', { name: 'View E-Signed Document' }).click()
    await page.locator('input[name="cancelreason"]').click()
    await page.locator('input[name="cancelreason"]').fill("testing")
    await page.getByRole('button', { name: 'Void' }).click()
    await clickElement(page, "Request successfully cancelled.", 0, 'text')
  }

  // Generate new e-sign package
  await generatePackageButton.click()
  await page.getByRole("button", { name: "Pre-Meeting Form" }).click()
  await page.getByRole("heading", { name: "Success" }).isVisible()
  await page.getByText("Congratulations, the forms validation has passed!").isVisible()
  await page.getByRole("button", { name: "Continue" }).click()
  await page.getByLabel("Signer Full Name:").click()
  await page.getByLabel("Signer Full Name:").fill("Testing")
  await page.getByLabel("Title/Relationship to Student:").click()
  await page.getByLabel("Title/Relationship to Student:").fill("Tester")
  await page.getByLabel("Email:").click()
  await page.getByLabel("Email:").fill("skaraman@sjcoe.net")
  await page.getByPlaceholder("999-999-9999").click()
  await page.getByPlaceholder("999-999-9999").fill("913-345-3454")
  await page.locator("[title='Save Signer']").click()
  await page.getByText("Signer already exists.").isVisible()
  await enterTextField(page, locators.PASSWORD, "Test")
  await page.getByLabel("Include Spanish copy of forms").check()
  await page.getByLabel("Automatically Number Pages, ex: Page 1 of 14").check()
  await page.getByLabel("I acknowledge all documentation and signer information is correct.").check()
  await page.getByRole("button", { name: "Send E-Signature Package" }).click()
  await page.getByText("This field doesn't match pattern required").isVisible()
  await enterTextField(page, locators.PASSWORD, "Test123!")
  await page.getByRole("button", { name: "Send E-Signature Package" }).click()
  await page.getByText("Signer information has been entered, please Save Signer to add recipient or remove").isVisible()
  await page.locator(".close > .fa").click()
  await page.getByRole("button", { name: "Yes" }).click()
  await page.locator("[title='Save Signer']").click()
  await page.getByRole("button", { name: "Send E-Signature Package" }).click()
  await page.getByRole("button", { name: "OK" }).click()

  /* 	await page.getByText('Generating E-Signature Package E-Signature Info').isVisible();
  await page.getByText('Congratulations! The E-Signature Package is processing. An email and text notifi').isVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Cancel E-Signature Package' }).click();
  await page.locator('input[name="cancelreason"]').click();
  await page.locator('input[name="cancelreason"]').fill('testing');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByText('Request successfully cancelled.').click(); */
};

export const validateEsignaturePage = async (page: Page, testInfo, request): Promise<void> => {
  const pageUrl = await page.url()
  const trimmed = pageUrl.substring(pageUrl.indexOf(".org"))
  const studentId = trimmed?.match(/\d+/)[0]

  const token = await commonFlows.getTokenSelpaRole(
    request,
    testInfo.project.use.config.apiBaseUrl,
    testInfo.project.use.config.env
  )

  const response = await eSignService.getSignatureUrl(
    token,
    testInfo.project.use.config.apiBaseUrl,
    request,
    Number(studentId)
  )

  const eSignUrl = Object.values(response[0])[0]
  await page.goto(eSignUrl)

  // Add tests for e-sign
  await enterTextField(page, locators.PASSWORD, "Test123!")
  await page.waitForTimeout(3000)
  await clickElement(page, locators.SUBMIT)
  await page.getByLabel("Yes").check()
  await page.getByText("A selection is required.").isVisible()
  await page.getByRole("button", { name: "Clear" }).isVisible()

  await page.locator("#signature-pad").click({ position: { x: 339, y: 64 } })
  await page.getByRole("button", { name: "Submit Signature" }).click()
  await page.getByRole("heading", { name: "Signature Complete" }).isVisible()

  //Navigates back to seis page to view the signed e-sign
  await page.goto("/login")
  await loginSelpaRole(page)
  await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
  await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
  await page.waitForSelector(studentIepsPage.locators.TABLE)
  await selectEligibility(page)
  await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
  /*   await page.waitForLoadState('networkidle')
  
    if (
      await page.locator('button:has-text("View Current IEP")').isVisible()
    ){
      await page.locator('button:has-text("Cancel")').click()
  
    } */
  await waitForPageReady(page)
  //await page.waitForTimeout(10000)
  await page.getByRole("button", { name: "View E-Signed Document" }).click()
  await page.getByRole("button", { name: "Add Attachment" }).click()
}

export const generateEsignatureCompleted = async (page: Page, testInfo, request): Promise<void> => {
  // Get the token
  const token = await commonFlows.getTokenSelpaRole(
    request,
    testInfo.project.use.config.apiBaseUrl,
    testInfo.project.use.config.env
  )

  let studentId = 0
  const students: any[] = await iepService.getIepSearch(
    token,
    testInfo.project.use.config.apiBaseUrl,
    request
  )

  for (let i = 0; i < students.length - 1; i++) {
    const student = students[i]
    const errorsA = await iepService.getCasemisTableA(
      token,
      testInfo.project.use.config.apiBaseUrl,
      request,
      student.StudentID
    )

    const errorsB = await iepService.getCasemisTableB(
      token,
      testInfo.project.use.config.apiBaseUrl,
      request,
      student.StudentID
    )

    if (!isErrorFound(errorsA) && !isErrorFound(errorsB)) {
      studentId = student.StudentID;
      break
    }
  }
  // Filter search results
  await enterTextField(page, studentIepsPage.locators.SEIS_ID, `${studentId}`)
  await page.getByRole('button', { name: 'Find' }).click()
  await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)

  // if (
  //   await page.locator('button:has-text("View Current IEP")').isVisible() || await page.locator('button:has-text("Go to E-Signature")').isVisible()
  // ) {
  //   await page.locator('button:has-text("Cancel")').first().click()
  // }
  await waitForPageReady(page);

  // Create completed signature for student
  await page.locator("tr:nth-child(10) > td").first().click()

  const generatePackageButton = page.getByRole("button", {
    name: "Generate E-Signature Package",
  })

  if (!(await generatePackageButton.isVisible())) {
    // Cancel if generate button is not visible
    await page.getByRole("button", { name: "Cancel E-Signature Package" }).click()
    await page.locator('input[name="cancelreason"]').click()
    await page.locator('input[name="cancelreason"]').fill("testing")
    await page.getByRole("button", { name: "OK" }).click()
    await page.getByText("Request successfully cancelled.").click()
  }

  // Generate new e-sign package
  await generatePackageButton.click()
  await page.getByRole("button", { name: "Completed Meeting" }).click()
  await page.getByRole("heading", { name: "Success" }).isVisible()
  await page.getByText("Congratulations, the forms validation has passed!").isVisible()
  await page.getByRole("button", { name: "Continue" }).click()
  await page.getByLabel("Signer Full Name:").click()
  await page.getByLabel("Signer Full Name:").fill("Testing")
  await page.getByLabel("Title/Relationship to Student:").click()
  await page.getByLabel("Title/Relationship to Student:").fill("Tester")
  await page.getByLabel("Email:").click()
  await page.getByLabel("Email:").fill("skaraman@sjcoe.net")
  await page.getByPlaceholder("999-999-9999").click()
  await page.getByPlaceholder("999-999-9999").fill("913-345-3454")
  await page.locator("[title='Save Signer']").click()
  await page.getByText("Signer already exists.").isVisible()
  await enterTextField(page, locators.PASSWORD, "Test")
  await page.getByLabel("Include Spanish copy of forms").check()
  await page.getByLabel("Automatically Number Pages, ex: Page 1 of 14").check()
  await page.getByLabel("I acknowledge all documentation and signer information is correct.").check();
  await page.getByRole("button", { name: "Send E-Signature Package" }).click()
  await page.getByText("This field doesn't match pattern required").isVisible()
  await enterTextField(page, locators.PASSWORD, "Test123!")
  await page.getByRole("button", { name: "Send E-Signature Package" }).click()
  await page.getByText("Signer information has been entered, please Save Signer to add recipient or remove").isVisible()
  await page.locator(".close > .fa").click()
  await page.getByRole("button", { name: "Yes" }).click()
  await page.locator("[title='Save Signer']").click()
  await page.getByRole("button", { name: "Send E-Signature Package" }).click()
  await page.getByRole("button", { name: "OK" }).click()
  // Get the signature url
  const response = await eSignService.getSignatureUrl(
    token,
    testInfo.project.use.config.apiBaseUrl,
    request,
    Number(studentId)
  )
  const eSignUrl = Object.values(response[0])[0]
  await page.goto(eSignUrl)
  await enterTextField(page, locators.PASSWORD, "Test123!")
//  await page.waitForTimeout(3000)
  await clickElement(page, locators.SUBMIT)
  await page.getByLabel('I agree to all parts of this document.').check()
  await page.getByRole('button', { name: 'Submit Signature' }).click()
  await page.getByText('Signature is required').isVisible()
  await page.locator('#signature-pad').click({ position: { x: 241, y: 74 } })
  await page.getByRole("button", { name: "Submit Signature" }).click()
  await page.getByRole("heading", { name: "Signature Complete" }).isVisible()
  //Navigates back to seis page to view the signed e-sign
  await page.goto("/login")
  await loginSelpaRole(page)
  await clickElement(page, studentsMenuDropDown.locators.STUDENTS, 0, 'text')
  await clickElement(page, studentsMenuDropDown.locators.STUDENT_IEPS, 0, 'text')
  await enterTextField(page, studentIepsPage.locators.SEIS_ID, `${studentId}`)
  await page.getByRole('button', { name: 'Find' }).click()
  //await page.waitForTimeout(30000)
  await clickElement(page, studentIepsPage.locators.FUTURE_IEPS)
  await waitForPageReady(page)
  await page.pause()
  await page.getByRole("button", { name: "View E-Signed Document" }).click()
  await page.locator('form:has-text("To View the Electronic Signature document, click the download link below. The e-")').getByRole('button', { name: 'Affirm' }).click()
  await page.getByLabel('Meeting Date').check()
  await page.getByLabel('Meeting Type').check()
  await page.getByLabel('Plan Type').check()
  await page.getByLabel('Yes').check()
  await page.getByLabel('Affirm Remarks').click()
  await page.getByLabel('Affirm Remarks').fill('testing')
  await page.getByLabel('Projected Next Annual Plan Review Date').check()
  await page.getByLabel('Last Reevaluation Date').check()
  await page.getByLabel('Projected Next Reevaluation Date').check()
  await page.getByRole('button', { name: 'Continue Affirm' }).click()
  if (await page.getByText('Alert - Meeting Date').isVisible()) {
    await page.locator('button:has-text("Continue")').last().click()
  }

//  await page.waitForTimeout(4000)
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.locator("tr:nth-child(10) > td").first().click()
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('button', { name: 'Affirm' }).click()
  await page.getByText('Please wait for process to complete').isVisible()
  await page.getByRole('heading', { name: 'Affirm Completed' }).isVisible()
  await page.getByRole('button', { name: 'OK' }).click()
}

const isErrorFound = (errors) => {
  let value = false
  if (errors?.length == 0) return value
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].ErrorType == "Error") {
      value = true;
      break
    }
  }
  return value
}