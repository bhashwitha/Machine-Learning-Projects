import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createMocks } from 'node-mocks-http';
import prisma from '../../lib/prisma';
import { apiHandler } from '../../pages/api';

describe('Appointment API Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should schedule a new appointment', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        patientId: 'test-patient-id',
        doctorId: 'test-doctor-id',
        date: '2024-03-01T10:00:00Z',
        type: 'in-person',
      },
    });

    await apiHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('id');
    expect(data.type).toBe('in-person');
  });

  // Add more test cases...
}); 