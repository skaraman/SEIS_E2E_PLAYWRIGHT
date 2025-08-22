import { Page } from "@playwright/test";
import { actions, api } from "../../helpers";
import { locators as headerLocators } from "../header/seis-header";
import { waitForPageReady } from "../../helpers/layout";

const { enterTextField, clickElement } = actions;

export type RequestTokenPayload = {
	userName: string,
	baseApiUrl: string,
	env: string
} 

const pw: string = "Seis2017!";

export const locators = {
  USER_NAME_INPUT: "#username",
  PASSWORD_INPUT: "#password",
  SUBMIT_BTN: '[type="submit"]',
};

export const loginAs = async (page: Page, userName: string): Promise<void> => {
  await enterTextField(page, locators.USER_NAME_INPUT, userName);
  await enterTextField(page, locators.PASSWORD_INPUT, pw);
  await clickElement(page, locators.SUBMIT_BTN);
  await waitForPageReady(page);
  await page.waitForSelector(headerLocators.LOG_OUT, {
    state: "visible",
  });
};

export const generateAccessToken = async (request, { baseApiUrl, env, userName }: RequestTokenPayload): Promise<string> => {
  return api.getToken(request, baseApiUrl, {
    env: env,
    userName: userName,
    password: pw,
  });
};
