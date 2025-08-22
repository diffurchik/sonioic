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
const stoicPhraseTable_1 = require("../../db/stoicPhraseTable");
const setup_1 = require("../setup");
describe.skip('StoicPhrase', () => {
    let stoicPhrase;
    beforeEach(() => {
        stoicPhrase = new stoicPhraseTable_1.StoicPhraseTable();
        jest.clearAllMocks();
    });
    describe('getRandomQuote', () => {
        it('should return a random quote when phrases exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPhrases = [
                { id: 1, content: 'Test phrase 1', author: 'Author 1', ruTranslation: 'Тест фраза 1' },
                { id: 2, content: 'Test phrase 2', author: 'Author 2', ruTranslation: 'Тест фраза 2' },
                { id: 3, content: 'Test phrase 3', author: 'Author 3', ruTranslation: 'Тест фраза 3' },
            ];
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(mockPhrases);
            const result = yield stoicPhrase.getRandomQuote();
            expect(setup_1.mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledWith();
            expect(result).toBeDefined();
            expect(mockPhrases).toContain(result);
        }));
        it('should return null when no phrases exist', () => __awaiter(void 0, void 0, void 0, function* () {
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockResolvedValue([]);
            const result = yield stoicPhrase.getRandomQuote();
            expect(setup_1.mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledWith();
            expect(result).toBeNull();
        }));
        it('should return null when database error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Database connection failed');
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockRejectedValue(mockError);
            // Mock console.error to avoid noise in tests
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const result = yield stoicPhrase.getRandomQuote();
            expect(setup_1.mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledWith();
            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('Error getting a random phrase:', mockError);
            consoleSpy.mockRestore();
        }));
        it('should return a single quote when only one phrase exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPhrases = [
                { id: 1, content: 'Single phrase', author: 'Author 1', ruTranslation: 'Одна фраза' },
            ];
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(mockPhrases);
            const result = yield stoicPhrase.getRandomQuote();
            expect(result).toEqual(mockPhrases[0]);
        }));
    });
});
