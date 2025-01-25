import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { apiHandler } from '../../pages/api';
import prisma from '../../lib/prisma';
import { createMocks } from 'node-mocks-http';

describe('Patient API Integration Tests', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new patient', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contactNumber: '+1234567890',
      },
    });

    await apiHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.name).toBe('John Doe');
  });

  it('should retrieve patient details', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'test-patient-id' },
    });

    await apiHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('id');
  });

  // Add more test cases...
}); 