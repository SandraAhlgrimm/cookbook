import { test, expect } from '@playwright/test';

test.describe('Recipe Generator App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check for the title
    await expect(page.locator('.title')).toContainText('Recipe Generator');
    
    // Check for the subtitle with AI model
    await expect(page.locator('.subtitle')).toBeVisible();
    
    // Check for the form elements
    await expect(page.locator('#instructions')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Generate');
  });

  test('should generate a recipe with valid input', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the instructions field
    await page.fill('#instructions', 'chocolate cake');
    
    // Click the Generate button
    await page.click('button[type="submit"]');
    
    // Wait for the recipe to be generated (this may take a while with LLM)
    // Increase timeout since AI generation can be slow (60 seconds)
    await expect(page.locator('.content')).toBeVisible({ timeout: 60000 });
    
    // Check if recipe title is visible
    await expect(page.locator('.text h2')).toBeVisible();
    
    // Check if recipe description is visible
    await expect(page.locator('.text p')).toBeVisible();
    
    // Check if ingredients section exists
    await expect(page.locator('.text h4').filter({ hasText: 'Ingredients' })).toBeVisible();
    
    // Check if steps section exists
    await expect(page.locator('.text h4').filter({ hasText: 'Steps' })).toBeVisible();
    
    // Check if there are some list items (ingredients or steps)
    const ingredients = page.locator('.text ul li');
    await expect(ingredients.first()).toBeVisible();
  });

  test('should display the AI model name', async ({ page }) => {
    await page.goto('/');
    
    // Check that the model name is displayed (qwen2:1.5b based on application.properties)
    const subtitle = page.locator('.subtitle');
    await expect(subtitle).toContainText('powered by');
    
    // The model name should be present
    await expect(subtitle).toContainText('qwen2:1.5b');
  });

  test('should be able to generate multiple recipes', async ({ page }) => {
    await page.goto('/');
    
    // First recipe
    await page.fill('#instructions', 'pasta');
    await page.click('button[type="submit"]');
    await expect(page.locator('.content')).toBeVisible({ timeout: 60000 });
    
    // Get the first recipe title
    const firstTitle = await page.locator('.text h2').textContent();
    
    // Second recipe
    await page.fill('#instructions', 'salad');
    await page.click('button[type="submit"]');
    await expect(page.locator('.content')).toBeVisible({ timeout: 60000 });
    
    // Get the second recipe title
    const secondTitle = await page.locator('.text h2').textContent();
    
    // Titles should be different (with high probability)
    expect(firstTitle).not.toBe(secondTitle);
  });

  test('should have proper CSS styling', async ({ page }) => {
    await page.goto('/');
    
    // Check that CSS is loaded
    const wrapper = page.locator('.wrapper');
    await expect(wrapper).toBeVisible();
    
    // Check form exists
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});
