export type PhraseRow = {
  ruTranslation: string;
  id: number;
  content: string;
  author: string;
};

export type SharedRow = {
  userId: number;
  isShared: boolean;
  id: number;
  phraseId: number;
  showUserName: boolean;
};
