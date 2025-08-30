// Mock Prisma client for testing
const mockPrismaClient = {
  stoicPhrase: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  userSetting: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  sharedSettings: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Export mock for use in tests
export { mockPrismaClient };

// Global test timeout
jest.setTimeout(10000);
