import { create } from 'zustand';
import { FortuneData } from '../types/type';

interface ModalData {
  rank: number;
  sign: string;
  content: string;
  luckyColor?: string;
  luckyItem?: string;
}

interface FortuneStore {
  fortunes: FortuneData[];
  mySign: string | null;
  isLoading: boolean;

  isModalOpen: boolean;
  modalData: ModalData | null;

  setFortunes: (fortunes: FortuneData[]) => void;
  setMySign: (sign: string | null) => void;
  setIsLoading: (loading: boolean) => void;

  openModal: (data: ModalData) => void;
  closeModal: () => void;

  getSortedFortunes: () => FortuneData[];
}

export const useFortuneStore = create<FortuneStore>((set, get) => ({
  fortunes: [],
  mySign: null,
  isLoading: false,
  isModalOpen: false,
  modalData: null,

  setFortunes: (fortunes) => set({ fortunes }),
  setMySign: (sign) => set({ mySign: sign }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  openModal: (data) => set({ isModalOpen: true, modalData: data }),
  closeModal: () => set({ isModalOpen: false, modalData: null }),

  getSortedFortunes: () => {
    const { fortunes, mySign } = get();

    if (!fortunes.length || !mySign) return fortunes;

    const myIndex = fortunes.findIndex(f => f.sign === mySign);
    if (myIndex === -1) return fortunes;

    const newArr = [...fortunes];
    const [myFortune] = newArr.splice(myIndex, 1);
    newArr.unshift(myFortune);

    return newArr;
  }
}));
