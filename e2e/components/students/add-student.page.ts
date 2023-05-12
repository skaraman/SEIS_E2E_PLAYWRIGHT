import { Page } from "@playwright/test";
import { enterTextDateField, enterTextField } from "../../helpers/actions";
import { createPastDate, createTodaysDate, momentEnum } from "../../helpers/utilities";

export const locators = {
  LAST_NAME_INPUT: "[id='LastName']",
  CHECK_LN: "CheckLast",
  FIRST_NAME_INPUT: "[id='FirstName']",
  CHECK_FN: "CheckFirst",
  SSID: "[id='CsisID']",
  BIRTH_DATE: "[id='Birthdate']",
  DISTRICT_ID: "[id='AdditionalStudentID']",
  EDIT_STUDENT: "text= Edit Student",
  DATE_ENROLLED_IN_LEA: '[id="DistrictEnrollmentDate"]',
  CONTINUE_BTN: 'button[text="Continue"]'

};


const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


const numbers = "0123456789";

function generateNumbers(length) {
  let result = "";
  const numbersLength = numbers.length;
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbersLength));
  }

  return result;
}


export const addNewStudent = async (page: Page) => {
  const lastName = `lastName${generateString(5)}`;
  const firstName = `firstName${generateString(5)}`;

  await enterTextDateField(page, locators.BIRTH_DATE, await createPastDate(momentEnum.year, 10))
  await enterTextDateField(page, locators.DATE_ENROLLED_IN_LEA, await createPastDate(momentEnum.year, 5))

  await enterTextField(page, locators.LAST_NAME_INPUT, lastName);
  await enterTextField(page, locators.FIRST_NAME_INPUT, firstName);
  await enterTextField(page, locators.SSID, generateNumbers(10));
  await page.locator("#s2id_Suffix > .select2-choice").click();
  await page.getByRole("option", { name: "JR - Junior" }).click();
  await page.getByRole("link", { name: "--- Select One ---" }).click();
  await page.getByRole("option", { name: "Male" }).click();

  await enterTextField(page, locators.DISTRICT_ID, generateNumbers(15));
  await page.locator("#s2id_ServiceDistrictID").getByRole("link", { name: "----Select One----" }).click();
  await page.getByRole("option", { name: "Bauxbatons" }).click();
  await page.getByRole("link", { name: "----Select One----" }).nth(2).click();
  await page.getByRole("option", { name: "Best School ever Elementary" }).click();
  await page.locator("#s2id_ResidenceSchool").getByRole("link", { name: "----Select One----" }).click();
  await page.getByRole("option", { name: "Best School ever Elementary" }).click();
  await page.getByRole("link", { name: "----Select One----" }).nth(1).click();
  await page.getByRole("option", { name: "Best School ever Elementary" }).click();
  await page.getByRole("link", { name: "----Select One----" }).click();
  await page.getByRole("option", { name: "Bauxbatons Provider - Assistive Technology Specialist" }).click();
  await page.getByRole("button", { name: "Add Student" }).click();


  return [lastName, firstName];
};

export const requestTransfer = async (page: Page, lastName: string, firstName: string) => {
  await page.locator("#CheckLast").check();
  await page.locator("#CheckFirst").check();
  await enterTextField(page, locators.LAST_NAME_INPUT, lastName);
  await enterTextField(page, locators.FIRST_NAME_INPUT, firstName);
  await page.getByRole("button", { name: "Search for Student Records" }).click();
  await page.locator("[data-action='transfer']").click();
  await page.locator('#s2id_To .select2-chosen').click()
  await page.getByRole("option", { name: "Demo District" }).click();
  await enterTextDateField(page, locators.DATE_ENROLLED_IN_LEA, await createPastDate(momentEnum.year, 5))
  await page.locator('#s2id_CDSCode .select2-chosen').click();
  await page.getByRole("option", { name: "Bayside High 2" }).click();
  await page.locator('#s2id_CaseManagerID .select2-chosen').click();
  await page.getByRole("option", { name: "Bauxbatons Provider - Assistive Technology Specialist" }).click();
  await page.getByLabel("Transfer Comment").click();
  await page.getByLabel("Transfer Comment").fill("testing transfer");
  await page.getByRole("button", { name: "Request Transfer" }).click();
  await page.getByRole("button", { name: "Complete Transfer" }).isVisible();
 


};


