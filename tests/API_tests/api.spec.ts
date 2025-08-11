import { test, expect } from '@playwright/test'

test("api get response", async ({ request }) => {

   const response = await request.get('https://alehouse.rocks/api/beers.json')

   const respBody = JSON.parse(await response.text())

   console.log(respBody[0])

   // Adjust assertions based on actual API response structure
   expect(respBody).toBeDefined();
   // Add further assertions here based on the actual keys in respBody
   // For example, if respBody is an array of beers:
   expect(Array.isArray(respBody)).toBe(true);

   // Only run these assertions if respBody has a 'data' property that is an array
  //  if (respBody.data && Array.isArray(respBody.data) && respBody.data.length > 0) {
      expect(respBody[0].title).toBe("Mad Goose"); // Adjust based on actual expected title
      expect(respBody[0].rating).toBe("7"); // Adjust based on actual expected rating
  //  }
})