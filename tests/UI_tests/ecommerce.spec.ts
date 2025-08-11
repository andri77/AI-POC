import { test, expect } from '@playwright/test';

test('ecommerce adventure', async ({ page }) => {
  await page.goto('https://www.journeytoautomation.org/practice/ecommerce');
  await page.getByRole('button', { name: 'Electronics' }).click();
  await page.getByRole('img', { name: 'Smart Fitness Watch' }).click();
  await page.locator('div').filter({ hasText: /^\$149\.99 Add to Cart$/ }).getByRole('button').click();
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('img', { name: 'Professional Camera' }).click();
  await page.locator('div').filter({ hasText: /^\$899\.99 Add to Cart$/ }).getByRole('button').click();
  await page.locator('div').filter({ hasText: /^\$149\.99 Add to Cart$/ }).getByRole('button').click();
  await page.locator('div').filter({ hasText: /^\$199\.99 Add to Cart$/ }).getByRole('button').click();
  await page.getByRole('button', { name: '3' }).click();
// Verify the cart total
  await expect(page).toHaveTitle("JourneyToAutomation");
});
