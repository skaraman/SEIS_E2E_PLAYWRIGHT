import { test } from "../../../base"
import { loginDistrictRole, logOut } from "../../../helpers/common-flows"
import { providersPage, providersDashboardPage, providersAssessmentTcmPage } from "../../../components/service-tracker"
import { verify, actions } from "./../../../helpers"
import { serviceTrackerMenuDropDownComponent } from "../../../components/navigation-bar"
import { clickElement } from "../../../helpers/actions"
import { selectDates } from "../../../components/service-tracker/service-tracker-providers-rosters.page"
import { verifyTableHeaderColumns, verifyFileDownload } from "../../../helpers/verify"
import { fillOutEditAssessmentFields,  } from "../../../components/service-tracker/service-tracker-providers-assessmentTCM.page"
const { verifyIfElementIsVisible } = verify
const { locators } = serviceTrackerMenuDropDownComponent

test.describe("District > Service Tracker Page Load Tests", () => {
  test.beforeEach(async ({ page, users }) => {
    await actions.goToUrl(page, "/login")
    await loginDistrictRole(page)
  })

  test.afterEach(async ({ page }) => {
    await logOut(page)
  })

  test("service tracker dashboard print roster @HD-Test", async ({ page }) => {
    await actions.goToUrl(page, "/servicetracker/admin/providers")
    await page.waitForSelector(providersPage.locators.FIND_BTN)
    await verifyIfElementIsVisible(page, providersPage.locators.FIND_BTN)
    await clickElement(page, providersPage.locators.VIEW_SERVICE_TRACKER_ICON)
    await clickElement(page, providersDashboardPage.locators.ROSTERS_BTN)
    await selectDates(page)
    await verifyFileDownload(page)
  })

  test("service tracker provider dashboard add assessmentTCM @HD-Test", async ({ page }) => {
    await actions.goToUrl(page, "/servicetracker/admin/providers")
    await clickElement(page, providersPage.locators.VIEW_SERVICE_TRACKER_ICON)
    await clickElement(page, providersDashboardPage.locators.ASSESSMENT_TCM_BTN)
    await clickElement(page, providersAssessmentTcmPage.locators.DELIVER_ASSESSMENT_ICN)
    await clickElement(page, providersAssessmentTcmPage.locators.ADD_ASSESSMENT_BTN)
    await fillOutEditAssessmentFields(page)
    await page.waitForSelector(providersAssessmentTcmPage.locators.ASSESSMENTS_TABLE)
    await verifyTableHeaderColumns(page, ['Date Added', 'Provider Name', 'School of Attendance', 'Date'])
  })
})
