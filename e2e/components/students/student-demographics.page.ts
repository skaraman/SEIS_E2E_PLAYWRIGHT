

import { Page, expect } from "@playwright/test";
import { studentIepsPage } from ".";
import { clickElement, enterTextField, openWindow } from "../../helpers/actions";


export const locators = {
	QUICK_LINKS: "button:has-text('Quick Links')",
	FUTURE_IEP: "[title='Future IEP']",
	CURRENT_IEP: "[title='Current IEP']",
	HISTORICAL_IEPS: "[title='Historical IEPs']",
	PROGRESS_REPORTS: "[title='Progress Reports']",
	STUDENT_IEPS: "[title='Student IEPs']",
	EMAIL_TEAM: "[title='Email Team']",
	DOC_LIBRARY: "[title='Doc Library']",
	ATTACHMENTS: "[title='Attachments']",
	CALPADS_TRANSACTIONS: "[alt='CALPADS Transactions']",
	Q_L: "#studentQuickLinks>button",
	SSID_INPUT: "[id='CsisID']"

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
	export const fillOutSSID = async (page: Page)  => {
		const ssid = `${generateNumbers(10)}`;

		await enterTextField(page, locators.SSID_INPUT, ssid);
		
	
		return ssid;
};

	export const fillOutGeneratedSSID = async (page: Page, ssid: string)  => {
		await enterTextField(page, studentIepsPage.locators.SSID_FILTER, ssid)


};



export const clickReturnToIeps = async (page: Page): Promise<void> => {
	await page.locator('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' }).click();
}

function generateRandom() {
	throw new Error("Function not implemented.");
}
