"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharedSettingsTable_1 = require("../../db/sharedSettingsTable");
const setup_1 = require("../setup");
describe.skip('SharedSettings', () => {
    let sharedSettings;
    beforeEach(() => {
        sharedSettings = new sharedSettingsTable_1.SharedSettingsTable();
        jest.clearAllMocks();
    });
    describe('addUserPhrase', () => {
        it('should create a phrase with all required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCreatedPhrase = {
                id: 1,
                content: 'Test phrase',
                author: 'Test Author',
                ruTranslation: 'Тест фраза',
            };
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);
            const result = yield sharedSettings.addUserPhrase('Test phrase', 'Test Author', '123', 'Тест фраза');
            expect(setup_1.mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
                data: {
                    content: 'Test phrase',
                    author: 'Test Author',
                    ruTranslation: 'Тест фраза',
                },
            });
            expect(result).toEqual(mockCreatedPhrase);
        }));
        it('should create a phrase without translation when optional', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCreatedPhrase = {
                id: 1,
                content: 'Test phrase',
                author: 'Test Author',
                ruTranslation: null,
            };
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);
            const result = yield sharedSettings.addUserPhrase('Test phrase', 'Test Author', '123');
            expect(setup_1.mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
                data: {
                    content: 'Test phrase',
                    author: 'Test Author',
                    ruTranslation: undefined,
                },
            });
            expect(result).toEqual(mockCreatedPhrase);
        }));
        it('should create a phrase with empty string translation', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCreatedPhrase = {
                id: 1,
                content: 'Test phrase',
                author: 'Test Author',
                ruTranslation: '',
            };
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);
            const result = yield sharedSettings.addUserPhrase('Test phrase', 'Test Author', '123', '');
            expect(setup_1.mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
                data: {
                    content: 'Test phrase',
                    author: 'Test Author',
                    ruTranslation: '',
                },
            });
            expect(result).toEqual(mockCreatedPhrase);
        }));
        it('should return undefined when database error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Database connection failed');
            setup_1.mockPrismaClient.stoicPhrase.create.mockRejectedValue(mockError);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const result = yield sharedSettings.addUserPhrase('Test phrase', 'Test Author', '123');
            expect(result).toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith('Error adding user phrase:', mockError);
            consoleSpy.mockRestore();
        }));
        it('should handle special characters in phrase content', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCreatedPhrase = {
                id: 1,
                content: 'Special chars: !@#$%^&*()',
                author: 'Special Author',
                ruTranslation: 'Спец символы: !@#$%^&*()',
            };
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);
            const result = yield sharedSettings.addUserPhrase('Special chars: !@#$%^&*()', 'Special Author', '123', 'Спец символы: !@#$%^&*()');
            expect(setup_1.mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
                data: {
                    content: 'Special chars: !@#$%^&*()',
                    author: 'Special Author',
                    ruTranslation: 'Спец символы: !@#$%^&*()',
                },
            });
            expect(result).toEqual(mockCreatedPhrase);
        }));
        it('should handle long phrases and author names', () => __awaiter(void 0, void 0, void 0, function* () {
            const longPhrase = 'A'.repeat(1000);
            const longAuthor = 'B'.repeat(100);
            const longTranslation = 'C'.repeat(500);
            const mockCreatedPhrase = {
                id: 1,
                content: longPhrase,
                author: longAuthor,
                ruTranslation: longTranslation,
            };
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);
            const result = yield sharedSettings.addUserPhrase(longPhrase, longAuthor, '123', longTranslation);
            expect(setup_1.mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
                data: {
                    content: longPhrase,
                    author: longAuthor,
                    ruTranslation: longTranslation,
                },
            });
            expect(result).toEqual(mockCreatedPhrase);
        }));
    });
});
