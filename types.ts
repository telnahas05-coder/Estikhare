export enum IstikharaResultType {
  GOOD = 'GOOD',
  BAD = 'BAD',
  MODERATE = 'MODERATE',
}

export interface IstikharaResponse {
  surahName: string;
  verseNumber: number;
  arabicText: string;
  persianTranslation: string;
  resultType: IstikharaResultType;
  interpretation: string; // The specific advice based on user input
  briefResult: string; // e.g., "خوب است", "بد است", "میانه است - با احتیاط"
}

export type ViewState = 'LANDING' | 'INTENTION' | 'LOADING' | 'RESULT';