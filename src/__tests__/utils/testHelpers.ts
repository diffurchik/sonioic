import { UserScheduleType } from '../../types';

export const createMockUserSchedule = (
  overrides: Partial<UserScheduleType> = {}
): UserScheduleType => ({
  id: 1,
  userId: 123,
  send_quote: true,
  schedule: '09:00',
  ...overrides,
});

export const createMockStoicPhrase = (overrides: any = {}) => ({
  id: 1,
  content: 'Test phrase',
  author: 'Test Author',
  ruTranslation: 'Тест фраза',
  ...overrides,
});

export const createMockError = (message: string = 'Test error') =>
  new Error(message);

export const mockConsoleError = () => {
  return jest.spyOn(console, 'error').mockImplementation(() => {});
};

export const createMockPrismaClient = () => ({
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
