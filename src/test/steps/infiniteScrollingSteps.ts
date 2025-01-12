import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from "@playwright/test";
import { chromium, Browser, Page, BrowserContext } from 'playwright';


setDefaultTimeout(60 * 1000 * 2)

let page: Page;
let context: BrowserContext;


Given('the user navigates to the dashboard home page', async function () {
  const browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();

  try {
    await page.goto('http://marvel-dashboard-seven.vercel.app/characters', { waitUntil: 'networkidle' });
    await page.waitForSelector('.character-item', { timeout: 80000 });
  } catch (error) {
    console.error('Error loading the page or waiting for selector:', error);
  }
});

Then('a list of Marvel characters is displayed automatically without requiring additional user action', async function () {
  const characterRows = page.locator('tr.border-b');
  const count = await characterRows.count();
  expect(count).toBeGreaterThan(0); // Ensure that characters are displayed
});

Then('each character has the following details:', async function (dataTable) {
  const fields = dataTable.hashes().map((row: { Field: string; }) => row.Field);
  const characterRows = page.locator('tr.border-b');

  const count = await characterRows.count();
  for (let i = 0; i < count; i++) {
    const characterRow = characterRows.nth(i);

    if (fields.includes('Thumbnail image')) {
      const thumbnail = characterRow.locator('td img');
      expect(await thumbnail.isVisible()).toBe(true); // Ensure the thumbnail is visible
    }

    if (fields.includes('Name')) {
      const name = characterRow.locator('td:nth-child(2)');
      const nameText = await name.textContent();
      expect(nameText).toBeTruthy(); // Ensure the name is not empty
    }

    if (fields.includes('Short description')) {
      const description = characterRow.locator('td:nth-child(3)');
      const descriptionText = await description.textContent();
      expect(descriptionText).toBeTruthy(); // Ensure the description is not empty (if available)
    }

    if (fields.includes('Number of comics')) {
      const comics = characterRow.locator('td:nth-child(5)');
      const comicsText = await comics.textContent();
      expect(comicsText).toBeTruthy(); // Ensure the number of comics is not empty
    }

    if (fields.includes('Published date')) {
      const publishedDate = characterRow.locator('td:nth-child(6)');
      const publishedDateText = await publishedDate.textContent();
      expect(publishedDateText).toBeTruthy(); // Ensure the published date is not empty
    }
  }
});


// Scenario: Infinite Scrolling
Given('the characters are displayed on the dashboard home page', async function () {
  const characterItems = page.locator('tr.border-b');
  const count = await characterItems.count();
  expect(count).toBeGreaterThan(0); // Expect the number of items to be greater than 0
});

When('the user scrolls down the list', async function () {
  await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
});

Then('additional characters are loaded dynamically', async function () {
  const characterItems = page.locator('tr.border-b');
  const initialCharacterCount = await characterItems.count();
  await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));  // Scroll down again
  const newCharacterCount = await characterItems.count();
  expect(newCharacterCount).toBeGreaterThan(initialCharacterCount);  // Verify more characters are loaded
});

// Scenario: Search Characters by Name

When('the user enters a search term in the search bar', async function () {
  await page.fill('#keyword-input', 'Spider-Man');
  await page.keyboard.press('Enter');
});

Then('the list updates to display characters matching the search term', async function () {
  // Locate all rows of the characters
  const characterRows = page.locator('tr.border-b');
  // Within each row, locate the second column (which contains the Name) and get all their text contents
  const characterNameTexts = await characterRows.locator('td:nth-child(2)').allTextContents();
  // Check if the list of character names includes "Spider-Man"
  expect(characterNameTexts).toContain('Spider-Man');
});

// Scenario: No Characters Found for Search Term

When('the user performs a search', async function () {
  await page.fill('#keyword-input', 'fghjgkjhdfgfhfk');
  await page.keyboard.press('Enter');
});

Then('no characters match the user’s search term', async function () {
  const characterItems = page.locator('tr.border-b');
  const count = await characterItems.count();
  expect(count).toBeLessThanOrEqual(0);
});

Then('a message is displayed: "No characters found."', async function () {
  const noCharactersMessage = page.locator('.infinite-scroll-component div', {
    hasText: 'No characters found'
  });
  const isVisible = await noCharactersMessage.isVisible();
  expect(isVisible).toBe(true); 
});

// Scenario: View Detailed Information for a Character

When('the user clicks on a character', async function () {
  const characterLink = page.locator('tr.border-b').first();  // click the first row
  await characterLink.click();
  // Wait for the character name to appear (indicating that the page has loaded)
  const characterNameLocator = this.page.locator('h1.text-xl.font-bold');
  await characterNameLocator.waitFor({ state: 'visible' });  // Wait until the character name is visible
});

Then('detailed information about the character is shown', async function () {
  const detailCharactersMessage = page.locator('h1.text-xl.font-bold');
  const isVisible = await detailCharactersMessage.isVisible();
  expect(isVisible).toBe(true); // Ensure the element is visible
});


