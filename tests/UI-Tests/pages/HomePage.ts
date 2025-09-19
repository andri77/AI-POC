import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly ageGateMonth: Locator;
    readonly ageGateYear: Locator;
    readonly ageGateEnter: Locator;
    readonly heroBanner: Locator;
    readonly ourBrandsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ageGateMonth = page.locator('#ageGateMonth');
        this.ageGateYear = page.locator('#ageGateYear');
        this.ageGateEnter = page.locator('#ageGateEnter');
        this.heroBanner = page.locator('.hero-banner');
        this.ourBrandsLink = page.locator('a[href="/our-brands"]');
    }

    async goto() {
        await this.page.goto('https://www.asahibeverages.com/?ref=asahi');
    }

    async enterAgeGate(month: string, year: string) {
        await this.ageGateMonth.selectOption({ label: month });
        await this.ageGateYear.selectOption({ label: year });
        await this.ageGateEnter.click();
    }
}
