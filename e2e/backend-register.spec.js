import { test, expect } from '@playwright/test';

test('Backend: Register user successfully', async ({ request }) => {
  const response = await request.post('/api/register', {
    data: {
      name: 'TestUser',
      email: 'testuser@example.com',
      password: 'Password@123',
      password_confirmation: 'Password@123'
    }
  });


  expect(response.status()).toBe(201);

  const responseBody = await response.json();
  
  // Check that the response body contains the correct data
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user.email).toBe('testuser@example.com');
  
});
