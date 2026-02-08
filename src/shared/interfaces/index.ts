export interface Note {
  attackTime: number;
  note: number;
  duration: number;
  isSelected?: boolean;
  isActive?: boolean;
}

export interface IndexedNote extends Note {
  index: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface MelodyArray {
  B6: boolean[];
  'A#6': boolean[];
  A6: boolean[];
  'G#6': boolean[];
  G6: boolean[];
  'F#6': boolean[];
  F6: boolean[];
  E6: boolean[];
  'D#6': boolean[];
  D6: boolean[];
  'C#6': boolean[];
  C6: boolean[];
  B5: boolean[];
  'A#5': boolean[];
  A5: boolean[];
  'G#5': boolean[];
  G5: boolean[];
  'F#5': boolean[];
  F5: boolean[];
  E5: boolean[];
  'D#5': boolean[];
  D5: boolean[];
  'C#5': boolean[];
  C5: boolean[];
  B4: boolean[];
  'A#4': boolean[];
  A4: boolean[];
  'G#4': boolean[];
  G4: boolean[];
  'F#4': boolean[];
  F4: boolean[];
  E4: boolean[];
  'D#4': boolean[];
  D4: boolean[];
  'C#4': boolean[];
  C4: boolean[];
  B3: boolean[];
  'A#3': boolean[];
  A3: boolean[];
  'G#3': boolean[];
  G3: boolean[];
  'F#3': boolean[];
  F3: boolean[];
  E3: boolean[];
  'D#3': boolean[];
  D3: boolean[];
  'C#3': boolean[];
  C3: boolean[];
  B2: boolean[];
  'A#2': boolean[];
  A2: boolean[];
  'G#2': boolean[];
  G2: boolean[];
  'F#2': boolean[];
  F2: boolean[];
  E2: boolean[];
  'D#2': boolean[];
  D2: boolean[];
  'C#2': boolean[];
  C2: boolean[];
  B1: boolean[];
  'A#1': boolean[];
  A1: boolean[];
  'G#1': boolean[];
  G1: boolean[];
  'F#1': boolean[];
  F1: boolean[];
  E1: boolean[];
  'D#1': boolean[];
  D1: boolean[];
  'C#1': boolean[];
  C1: boolean[];
}
