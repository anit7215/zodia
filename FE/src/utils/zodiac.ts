export const getZodiacDateRange = (sign: string): string => {
  const dateMap: { [key: string]: string } = {
    "양자리": "3/21 ~ 4/19",
    "황소자리": "4/20 ~ 5/20",
    "쌍둥이자리": "5/21 ~ 6/21",
    "게자리": "6/22 ~ 7/22",
    "사자자리": "7/23 ~ 8/22",
    "처녀자리": "8/23 ~ 9/22",
    "천칭자리": "9/23 ~ 10/23",
    "전갈자리": "10/24 ~ 11/22",
    "사수자리": "11/23 ~ 12/21",
    "염소자리": "12/22 ~ 1/19",
    "물병자리": "1/20 ~ 2/18",
    "물고기자리": "2/19 ~ 3/20"
  };
  return dateMap[sign] || "";
};

export const getZodiacSign = (month: number, day: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "쌍둥이자리";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "게자리";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "처녀자리";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "천칭자리";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "전갈자리";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "사수자리";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "염소자리";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리";
  return "물고기자리";
};

export const getRankColor = (rank: number, isMySign: boolean, isHovered: boolean): string => {
  if (isMySign) return '#ff0055';
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return '#cd7f32';
  if (isHovered) return 'skyblue';
  return 'white';
};

export const calculateSpherePosition = (
  index: number,
  totalCount: number,
  radius: number,
  isMySign: boolean
): [number, number, number] => {
  const angle = (index / totalCount) * Math.PI * 2 + (Math.PI / 2);
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);

  if (isMySign) {
    return [0, 2, radius - 2];
  }

  return [x, 0, z];
};
