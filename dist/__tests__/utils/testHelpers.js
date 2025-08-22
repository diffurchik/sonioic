"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaClient = exports.mockConsoleError = exports.createMockError = exports.createMockStoicPhrase = exports.createMockUserSchedule = void 0;
const createMockUserSchedule = (overrides = {}) => (Object.assign({ id: 1, userId: 123, send_quote: true, schedule: '09:00' }, overrides));
exports.createMockUserSchedule = createMockUserSchedule;
const createMockStoicPhrase = (overrides = {}) => (Object.assign({ id: 1, content: 'Test phrase', author: 'Test Author', ruTranslation: 'Тест фраза' }, overrides));
exports.createMockStoicPhrase = createMockStoicPhrase;
const createMockError = (message = 'Test error') => new Error(message);
exports.createMockError = createMockError;
const mockConsoleError = () => {
    return jest.spyOn(console, 'error').mockImplementation(() => { });
};
exports.mockConsoleError = mockConsoleError;
const createMockPrismaClient = () => ({
    stoicPhrase: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
    userSetting: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
    },
});
exports.createMockPrismaClient = createMockPrismaClient;
