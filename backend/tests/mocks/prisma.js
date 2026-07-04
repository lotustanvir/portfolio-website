import { jest } from "@jest/globals";

const createMockDelegate = () => ({
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
});

const mockPrisma = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $on: jest.fn(),
  $transaction: jest.fn((fn) => fn(mockPrisma)),
  project: createMockDelegate(),
  skill: createMockDelegate(),
  experience: createMockDelegate(),
  education: createMockDelegate(),
  certificate: createMockDelegate(),
  certificateTechnology: createMockDelegate(),
  message: createMockDelegate(),
  visitor: createMockDelegate(),
  testimonial: createMockDelegate(),
  technology: createMockDelegate(),
  projectTechnology: createMockDelegate(),
  experienceTechnology: createMockDelegate(),
  blog: createMockDelegate(),
  subscriber: createMockDelegate(),
  resume: createMockDelegate(),
  socialLink: createMockDelegate(),
  websiteSetting: createMockDelegate(),
  admin: createMockDelegate(),
};

export default mockPrisma;
