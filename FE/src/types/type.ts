export interface FortuneData {
  rank: number;
  sign: string;
  content_jp: string;
  content_kr: string;
  lucky_color: string;
  lucky_item: string;
}

export interface ZodiacSphereProps {
  position: [number, number, number];
  rank: number;
  sign: string;
  content: string;
  isMySign: boolean;
  scale?: number;
  luckyColor?: string;
  luckyItem?: string;
}

export interface UserSettingsProps {
  onSave: (dateString: string) => void;
}