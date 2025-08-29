import { UserSetting } from '../../db/userSetting';
import { mockPrismaClient } from '../setup';
import { createMockUserSchedule } from '../utils/testHelpers';

describe('UserSetting', () => {
  let userSetting: UserSetting;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    userSetting = new UserSetting();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  describe('getUserSchedule', () => {
    it('should return user schedule when it exists', async () => {
      const mockSchedule = createMockUserSchedule({ userId: 123, schedule: '10:00' });

      mockPrismaClient.userSetting.findUnique.mockResolvedValue(mockSchedule);

      const result = await userSetting.getUserSchedule(123);

      expect(mockPrismaClient.userSetting.findUnique).toHaveBeenCalledWith({
        where: { userId: 123 },
      });
      expect(result).toEqual(mockSchedule);
    });

    it('should return null when user schedule does not exist', async () => {
      mockPrismaClient.userSetting.findUnique.mockResolvedValue(null);

      const result = await userSetting.getUserSchedule(999);

      expect(mockPrismaClient.userSetting.findUnique).toHaveBeenCalledWith({
        where: { userId: 999 },
      });
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.userSetting.findUnique.mockRejectedValue(mockError);

      const result = await userSetting.getUserSchedule(123);

      expect(mockPrismaClient.userSetting.findUnique).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith('Error getting user schedule:', mockError);
      expect(result).toBeNull();
    });
  });

  describe('getAllUserSchedules', () => {
    it('should return all user schedules with send_quote true', async () => {
      const mockSchedules = [
        createMockUserSchedule({ userId: 123, send_quote: true }),
        createMockUserSchedule({ userId: 456, send_quote: true }),
      ];

      mockPrismaClient.userSetting.findMany.mockResolvedValue(mockSchedules);

      const result = await userSetting.getAllUserSchedules();

      expect(mockPrismaClient.userSetting.findMany).toHaveBeenCalledWith({
        where: { send_quote: true },
      });
      expect(result).toEqual(mockSchedules);
    });

    it('should return undefined when no schedules found', async () => {
      mockPrismaClient.userSetting.findMany.mockResolvedValue(null);

      const result = await userSetting.getAllUserSchedules();

      expect(mockPrismaClient.userSetting.findMany).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.userSetting.findMany.mockRejectedValue(mockError);

      const result = await userSetting.getAllUserSchedules();

      expect(mockPrismaClient.userSetting.findMany).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith('Error getting all user schedules:', mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('createUserSchedule', () => {
    it('should create user schedule with default values', async () => {
      const mockResult = createMockUserSchedule({
        userId: 123,
        schedule: '09:00',
        send_quote: false,
      });

      mockPrismaClient.userSetting.create.mockResolvedValue(mockResult);

      const result = await userSetting.createUserSchedule(123, {});

      expect(mockPrismaClient.userSetting.create).toHaveBeenCalledWith({
        data: { userId: 123, schedule: '09:00', send_quote: false },
      });
      expect(result).toEqual(mockResult);
    });

    it('should create user schedule with custom values', async () => {
      const mockResult = createMockUserSchedule({
        userId: 123,
        schedule: '15:30',
        send_quote: true,
      });

      mockPrismaClient.userSetting.create.mockResolvedValue(mockResult);

      const result = await userSetting.createUserSchedule(123, {
        schedule: '15:30',
        sendQuote: true,
      });

      expect(mockPrismaClient.userSetting.create).toHaveBeenCalledWith({
        data: { userId: 123, schedule: '15:30', send_quote: true },
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.userSetting.create.mockRejectedValue(mockError);

      const result = await userSetting.createUserSchedule(123, {});

      expect(mockPrismaClient.userSetting.create).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith('Error creating user schedule:', mockError);
      expect(result).toBeUndefined();
    });

    it('should handle null result from database', async () => {
      mockPrismaClient.userSetting.create.mockResolvedValue(null);

      const result = await userSetting.createUserSchedule(123, {});

      expect(mockPrismaClient.userSetting.create).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('updateUserSchedule', () => {
    it('should update user schedule successfully', async () => {
      const mockResult = createMockUserSchedule({
        userId: 123,
        schedule: '14:00',
        send_quote: true,
      });

      mockPrismaClient.userSetting.update.mockResolvedValue(mockResult);

      const result = await userSetting.updateUserSchedule(123, {
        schedule: '14:00',
        send_quote: true,
      });

      expect(mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
        where: { userId: 123 },
        data: { schedule: '14:00', send_quote: true },
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.userSetting.update.mockRejectedValue(mockError);

      const result = await userSetting.updateUserSchedule(123, { schedule: '16:00' });

      expect(mockPrismaClient.userSetting.update).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith('Error updating user schedule:', mockError);
      expect(result).toBeUndefined();
    });

    it('should handle null result from database', async () => {
      mockPrismaClient.userSetting.update.mockResolvedValue(null);

      const result = await userSetting.updateUserSchedule(123, { schedule: '16:00' });

      expect(mockPrismaClient.userSetting.update).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
