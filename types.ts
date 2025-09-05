export enum Pillar {
  MayaBhedan = 'MAYA_BHEDAN',
  ShaktiUpchar = 'SHAKTI_UPCHAR',
  DivyaChakshu = 'DIVYA_CHAKSHU',
  DharmaNetwork = 'DHARMA_NETWORK',
  KarmaYudhBhumi = 'KARMA_YUDHBHUMI',
  GyanKosh = 'GYAN_KOSH',
}

export interface MayaBhedanResponse {
  verdict: 'Truth' | 'Illusion' | 'Unclear';
  discourse: string;
  metaphor: string;
}

export interface ShaktiUpcharResponse {
  sentiment: 'Wrathful' | 'Disturbed' | 'Calm';
  resolutionPath: string;
  message: string;
}

export interface DivyaChakshuResponse {
    proclamation: string;
    description: string;
}

export interface KarmaRecord {
    score: number;
    timestamp: number;
}
