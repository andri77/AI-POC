import { test, expect } from '@playwright/test';

test.describe('Checkly Navigation Tests', () => {
  test('should navigate to webinars page', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('https://www.checklyhq.com/');
    // Click on Resources button (using role selector for better accessibility)
    await page.getByRole('button', { name: 'Resources' }).first().click();
    
    // Click on Webinars link
    await page.getByRole('link', { name: 'Webinars' }).click();
    
    // Validate the URL
    await expect(page).toHaveURL('https://www.checklyhq.com/webinars/');
  });
});