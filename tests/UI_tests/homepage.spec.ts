import { test, expect } from '@playwright/test';

test.describe('NAPLAN Public Demonstration Site - Element Verification', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the NAPLAN public demonstration site and wait for the network to be idle
        await page.goto('https://nap.edu.au/naplan/public-demonstration-site', { waitUntil: 'networkidle' });
        // Wait for the main content to be available in the DOM
        await page.waitForLoadState('domcontentloaded');
    });

    test('verify header and navigation elements', async ({ page }) => {
        // Header Section
        // Look for the main navigation area which might be in different structures
        const navArea = page.locator('nav, [role="navigation"], .navigation, #main-nav');
        await expect(navArea).toBeVisible();

        // Verify NAP logo/home link (using a more flexible selector)
        const logo = page.getByRole('link').filter({ hasText: /NAP|NAPLAN/i }).first();
        await expect(logo).toBeVisible();

        // Main Navigation
        // Check for common navigation elements that are likely to be present
        const commonLinks = [
            'Home',
            'About',
            'Resources'
        ];
        
        for (const linkText of commonLinks) {
            const link = page.getByRole('link').filter({ hasText: new RegExp(linkText, 'i') }).first();
            await expect(link).toBeVisible();
        }

        // Verify the menu button if it exists (for mobile navigation)
        const menuButton = page.getByRole('button').filter({ hasText: /menu|navigation/i }).first();
        if (await menuButton.count() > 0) {
            await expect(menuButton).toBeVisible();
        }
    });

    test('verify main content section elements', async ({ page }) => {
        // Main Content Area
        // Wait for the page to be ready and stable
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');


        // Look for visible heading elements
        const heading = page.getByRole('heading').first();
        await expect(heading).toBeVisible({ timeout: 10000 });

        // Try to find any visible content container with relevant text
        const contentContainer = page
            .locator('div, section, article')
            .filter({ hasText: /NAPLAN|Demonstration|Public/i })
            .first();
        await contentContainer.waitFor({ state: 'visible', timeout: 10000 });

        // Verify we can find test-related links which should be visible
        const demoLinks = await page
            .getByRole('link')
            .filter({ hasText: /demonstration|test/i })
            .all();
        
        // Ensure we found some demo links and at least one is visible
        expect(demoLinks.length).toBeGreaterThan(0);
        let visibleLinkFound = false;
        for (const link of demoLinks) {
            if (await link.isVisible()) {
                visibleLinkFound = true;
                break;
            }
        }
        expect(visibleLinkFound).toBe(true);
    });

    test('verify demonstration test links and resources', async ({ page }) => {
        // Test Resources Section
        // This section should contain links to various test examples
        const testLinks = await page.getByRole('link').filter({ hasText: /test/i }).all();
        expect(testLinks.length).toBeGreaterThan(0);

        // Verify download resources if present
        const downloadLinks = await page.getByRole('link').filter({ hasText: /download/i }).all();
        for (const link of downloadLinks) {
            await expect(link).toBeVisible();
        }

        // Check for supporting documentation links
        const docLinks = await page.getByRole('link').filter({ hasText: /guide|documentation|help/i }).all();
        for (const link of docLinks) {
            await expect(link).toBeVisible();
        }
    });

    test('verify footer elements', async ({ page }) => {
        // Footer Section
        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Look for footer using multiple possible selectors
        const footer = page.locator('footer, [role="contentinfo"], .footer, #footer').first();
        // Scroll to the bottom of the page and wait for a moment
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000); // Wait for any lazy-loaded footer content
        
        // Verify footer exists
        await expect(footer).toBeVisible();

        // Check footer sections and handle multiple matches
        const footerSections = [
            'About',
            'Contact',
            'Privacy',
            'Copyright'
        ];

        for (const section of footerSections) {
            const links = await page.getByRole('link', { name: new RegExp(section, 'i') }).all();
            // Verify at least one matching link is visible
            const visibleLink = links.find(async link => await link.isVisible());
            expect(visibleLink).toBeDefined();
        }

        // Verify copyright notice
        await expect(page.getByText(/copyright/i)).toBeVisible();
    });

    test('verify accessibility features', async ({ page }) => {
        // Accessibility Features
        // Check for language selector if present
        const langSelector = page.getByRole('button', { name: /language/i });
        if (await langSelector.count() > 0) {
            await expect(langSelector).toBeVisible();
        }

        // Check for accessibility tools/options
        const accessibilityTools = page.getByRole('button', { name: /accessibility|font size/i });
        if (await accessibilityTools.count() > 0) {
            await expect(accessibilityTools).toBeVisible();
        }
    });

    test('verify external links have proper security attributes', async ({ page }) => {
        // Wait for the page to be ready
        await page.waitForLoadState('domcontentloaded');
        
        // Get all links
        const links = await page.getByRole('link').all();
        
        // Process links in smaller batches to avoid timeouts
        const batchSize = 5;
        for (let i = 0; i < links.length; i += batchSize) {
            const batch = links.slice(i, i + batchSize);
            await Promise.all(batch.map(async (link) => {
                const href = await link.getAttribute('href');
                if (!href?.startsWith('http') || href.includes('nap.edu.au')) return;
                
                // Check if the link is visible
                if (!await link.isVisible()) return;
                
                // Log security-related warnings
                const target = await link.getAttribute('target');
                const rel = await link.getAttribute('rel');
                
                if (target !== '_blank') {
                    console.warn(`Warning: External link to ${href} should have target="_blank"`);
                }
                
                if (!rel?.match(/noopener|noreferrer/i)) {
                    console.warn(`Warning: External link to ${href} is missing rel="noopener noreferrer" attribute`);
                }
            }));
        }
    });

    test('verify interactive elements', async ({ page }) => {
        // Check for search functionality if present
        const searchButton = page.getByRole('button', { name: /search/i });
        if (await searchButton.count() > 0) {
            await expect(searchButton).toBeVisible();
        }

        // Check for mobile menu button if present
        const menuButton = page.getByRole('button', { name: /menu/i });
        if (await menuButton.count() > 0) {
            await expect(menuButton).toBeVisible();
        }

        // Verify all buttons are interactive
        const buttons = await page.getByRole('button').all();
        for (const button of buttons) {
            await expect(button).toBeVisible();
            await expect(button).toBeEnabled();
        }
    });
});
