import { Page } from "@playwright/test"
import { clickElement } from "../../helpers/actions"
import { waitForPageReady } from "../../helpers/layout"
import { verifyFileDownload } from "../../helpers/verify"

export const locators = {
  DELETE_BTN: "[title='Delete']",
  PRINT_BTN: "[title='Print']",
  ADD_DRDP: "text=Add DRDP",
  //DRDP INSTRUMENT PAGE
  IFSP: "text=Individualized Family Service Plan (IFSP)",
  DATE_COMPLETED: "drdpDate"
}

export const clickReturnToIeps = async (page: Page): Promise<void> => {
  await clickElement(page, page.locator('#sticky-bar').getByRole('button', { name: 'Return to Student IEPs' }))
}

export const deleteUnaffirmedDrdp = async (page: Page): Promise<void> => {
  await clickElement(page, page.getByRole('button', { name: 'OK' }))
  await clickElement(page, page.locator("[title='Edit']"))
}

export const addDrdp = async (page: Page): Promise<void> => {
  await waitForPageReady(page)
  var isVisible = await page.locator("[title='Delete']").first().isVisible();
  if (isVisible) {
    await clickElement(page, page.locator("[title='Delete']").first())
    await clickElement(page, page.getByRole('button', { name: 'Yes' }))
    await waitForPageReady(page)
  }
  await clickElement(page, locators.ADD_DRDP)
  await waitForPageReady(page)
  await clickElement(page, page.locator('#drdpDate'))
  await clickElement(page, page.locator('.old.day').nth(0))
  await clickElement(page, page.locator('text=Individualized Family Service Plan (IFSP)'))
  await clickElement(page, page.getByLabel('Transitional Kindergarten'))
  await clickElement(page, page.getByRole('radio', { name: 'Other (Specify below)' }))
  await clickElement(page, page.locator('input[name="roleOfAssessorOther"]'))
  await page.locator('input[name="roleOfAssessorOther"]').fill('tester')
  await clickElement(page, page.locator('#AssistanceCompleting').getByText('Yes'))
  await clickElement(page, page.locator('#collaborators').getByText('Other (Specify below)'))
  await clickElement(page, page.locator('input[name="collaboratorsOtherText"]'))
  await page.locator('input[name="collaboratorsOtherText"]').fill('neighbor')
  await page.locator('#rat1_1').check()
  await page.locator('#rat2_3').check()
  await page.locator('#rat3_2').check()
  await page.locator('#rat4_2').check()
  await page.locator('#rat5_2').check()
  await page.locator('#rat8_6').check()
  await page.locator('#rat9_3').check()
  await page.locator('#rat10_2').check()
  await page.locator('#rat11_3').check()
  await page.locator('#rat12_5').check()
  await page.locator('#rat13_6').check()
  await clickElement(page, page.locator('#rat14 > td:nth-child(4) > .innerTable > tbody > tr > td').first())
  await page.locator('#rat15_3').check()
  await page.locator('#rat16_5').check()
  await page.locator('#rat17_6').check()
  await page.locator('#rat27_6').check()
  await page.locator('#rat28_5').check()
  await page.locator('#rat29_3').check()
  await page.locator('#rat34_5').check()
  await page.locator('#rat35_6').check()
  await clickElement(page, page.locator('#rat37 > td:nth-child(4) > .innerTable > tbody > tr > td:nth-child(3)'))
  await clickElement(page, page.locator('#rat38 > td:nth-child(4) > .innerTable > tbody > tr > td').first())
  await page.locator('#rat39_4').check()
  await page.locator('#rat40_3').check()
  await page.locator('#rat41_4').check()
  await page.locator('#rat42_5').check()
  await clickElement(page, page.locator('#rat43 > td:nth-child(5) > .innerTable > tbody > tr > td').first())
  await page.locator('#rat44_5').check()
  await page.locator('#rat45_6').check()
  await page.getByRole('row', { name: 'PD-HLTH2 Gross Locomotor Movement Skills' }).locator('input[type="checkbox"]').check()
  await page.getByRole('row', { name: 'PD-HLTH3 Gross Motor Manipulative Skills' }).locator('input[type="checkbox"]').check()
  await page.getByRole('row', { name: 'PD-HLTH4 Fine Motor Manipulative Skills' }).locator('input[type="checkbox"]').check()
  await page.getByRole('row', { name: 'PD-HLTH5 Safety' }).locator('input[type="checkbox"]').check()
  await clickElement(page, page.locator("text= Save Form").nth(0))
  await page.getByText('DRDP saved.').isVisible()
  //await page.waitForTimeout(5000)
  await clickElement(page, page.locator("text=Return To List").nth(0))
  await clickElement(page, page.locator(".seis-icon-print").nth(0))
  await clickElement(page, page.locator('button.btn-primary:text("Print")'))
  await page.getByText('Processing print request in Print Queue.').isVisible()
  //await page.waitForTimeout(120000) // Waiting for the file to be generated and download to start
  await verifyFileDownload(page)
}
