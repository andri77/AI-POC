import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Asahi Website', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('should navigate to the Our Brands page', async ({ page }) => {
        await homePage.enterAgeGate('January', '1990');
        await expect(homePage.heroBanner).toBeVisible();
        await homePage.ourBrandsLink.click();
        await expect(page).toHaveURL('https://www.asahibeverages.com/our-brands');
    });
});
