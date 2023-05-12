import { Page } from "@playwright/test";
import { clickElement } from "../../helpers/actions";

export const locators = {
	ACSA_CARS_GOALS: 'text=ACSA/CARS+ Goals',
	AU_SP_LAN_GOALS: 'text=AuSpLan Goals',
	BASICS_GOALS: 'text=BASICS Goals',
	CSHA_GOALS: 'text=CSHA Goals',
	ROPED_GOALS: 'text=ROPES Goals',
	SEACO_GOALS: 'text=SEACO Goals',
	SEACO_REVISED_GOALS: 'text=SEACO Revised CAPA Blueprint Goals',
	EARLY_INTENSIVE_GOALS: 'text=Early Intensive Autism Interventions Goals',
	ENGLISH_LANGUAGE_ARTS_GOALS: 'text=English Language Arts for Common Core',
	MATH_FOR_COMMON_GOALS: 'text=Math for Common Core',
	SECONDARY_TRANSITION_GOALS: 'text=Secondary Transition Goals',
	STATEWIDE_TEACHER_GOALS: 'text=Statewide Teacher Generated Goals',
	TEACHER_GENERATED_GOALS: 'text=Teacher Generated Goals',







	RETURN_TO_GOAL_LIBRARIES: 'text=Return to Goal Libraries'

};

export const verifyAcsaCarsGoals = async (page: Page) => {
  await page.locator('#subject').selectOption('Speech');
  await page.getByRole('row', { name: 'Phonemic Awareness K K.1.9 Blend vowel consonant sounds orally to make words or syllables. Articulation Goals Essential Goals' }).getByRole('link', { name: 'Articulation Goals' }).isVisible();
  await page.getByText('1. By (Date of Marking Period), within a structured setting, (Name) will correct').isVisible();


}

export const verifyAuSpLanGoals = async (page: Page) => {
  await page.locator('#subject').selectOption('Auditory');
  await page.locator('#topic').selectOption('Level 1 Awareness');
  await page.getByRole('cell', { name: '1.1 Awareness of Voicing' }).isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

  //next goal
  await clickElement(page, locators.BASICS_GOALS);
  await page.locator('#levels').selectOption('1');
  await page.locator('#domains').selectOption('Community Domain');
  await page.getByRole('cell', { name: '(C 1.3.2) Using a level ___ prompt, the student will travel to and from school safely on the bus with ___ % accuracy as measured by teacher-charted observation/data in ___ out of ___ trials.' }).isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

  //next goal
  await clickElement(page, locators.CSHA_GOALS);
  await page.getByRole('combobox', { name: 'Subject:' }).selectOption('FLUENCY');
  await page.getByRole('combobox', { name: 'Grades:' }).selectOption('1');
  await page.locator('#tbody').isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

  //next goal
  await clickElement(page, locators.ROPED_GOALS);
  await page.locator('select').selectOption('Evaluation Skills                                             ');
  await page.getByText('(Name) will increase his/her ability to see how a new situation is like one he/s').isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

   //next goal
   await clickElement(page, locators.SEACO_GOALS);
   await page.locator('#subject').selectOption('English/Language Arts Content Standards');
   await page.locator('#standard').selectOption('ELA Standard 01 CAPA Levels 2-3');
   await page.getByRole('cell', { name: 'FPI-1.1 Student will recognize pictures for specific activities' }).isVisible();
   await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

    //next goal
  await clickElement(page, locators.SEACO_REVISED_GOALS);
  await page.locator('#coreArea').selectOption('English-Language Arts');
  await page.locator('#capaLevel').selectOption('1');
  await page.locator('#strand').selectOption('Reading');
  await page.locator('#tbody').isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

   //next goal
   await clickElement(page, locators.EARLY_INTENSIVE_GOALS);
   await page.locator('select').selectOption('1');
   await page.locator('#tbody').isVisible();
   await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

    //next goal
  await clickElement(page, locators.ENGLISH_LANGUAGE_ARTS_GOALS);
  await page.locator('#subject').selectOption('Informational Text');
  await page.locator('#topic').selectOption('Key Ideas and Details');
  await page.getByRole('cell', { name: 'RI.K.1 With prompting and support, ask and answer questions about key details in a text.' }).isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

   //next goal
   await clickElement(page, locators.MATH_FOR_COMMON_GOALS);
   await page.locator('#subject').selectOption('Algebra I');
   await page.locator('#topic').selectOption('Seeing Structure in Expressions');
   await page.locator('#grades').selectOption('9');
   await page.getByRole('cell', { name: 'A.SSE.1 Interpret expressions that represent a quantity in terms of its context.' }).first().isVisible();
   await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

    //next goal
  await clickElement(page, locators.SECONDARY_TRANSITION_GOALS);
  await page.locator('#area').selectOption('Career Preparation');
  await page.locator('#topic').selectOption('During last year in school');
  await page.locator('#tbody').isVisible();
  await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

   //next goal
   await clickElement(page, locators.STATEWIDE_TEACHER_GOALS);
   await page.locator('#subject').selectOption('5');
   await page.getByRole('combobox', { name: 'Topics:' }).selectOption('29');
   await page.getByRole('combobox', { name: 'Grades:' }).selectOption('1');
   await page.locator('#tbody').isVisible();
   await clickElement(page, locators.RETURN_TO_GOAL_LIBRARIES);

    //next goal
  await page.locator('text=Teacher Generated Goals').nth(1).click();
  await page.locator('#category').selectOption('1462');
  await page.locator('#tbody').isVisible();





   
}


  


