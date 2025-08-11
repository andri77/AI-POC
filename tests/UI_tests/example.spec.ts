import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://nap.edu.au/naplan/public-demonstration-site');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("NAP - Public demonstration site");
});

test('get started link', async ({ page }) => {
  await page.goto('https://nap.edu.au/naplan/public-demonstration-site');

  // Click the About link.
  await page.getByRole('link', { name: 'About' }).click();

  // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  await expect(page).toHaveTitle("NAP - About");
});
