"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPrismaClient = void 0;
// Mock Prisma client for testing
const mockPrismaClient = {
    stoicPhrase: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
    userSetting: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
    },
};
exports.mockPrismaClient = mockPrismaClient;
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrismaClient),
}));
// Global test timeout
jest.setTimeout(10000);
