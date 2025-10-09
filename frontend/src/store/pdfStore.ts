import { create } from 'zustand';
import { getPDFs, uploadPDF } from '@/api/pdfService';

export interface PDF {
  _id: string;
  name: string;
  path: string;
  pdfVectorId:string
  createdAt: string;
}

interface PDFStore {
  pdfs: PDF[];
  selectedPDF: PDF | null;
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  fetchPDFs: (page?: number, limit?: number) => Promise<void>;
  selectPDF: (pdf: PDF | null) => void;
  addPDF: (file: File) => Promise<void>;
}

export const usePDFStore = create<PDFStore>((set, get) => ({
  pdfs: [],
  selectedPDF: null,
  page: 1,
  limit: 6,
  total: 0,
  loading: false,

  fetchPDFs: async (page = get().page, limit = get().limit) => {
    set({ loading: true });
    try {
      const res: any = await getPDFs(page, limit);
      set({
        pdfs: res.data || [],
        total: res.pagination?.totalItems || 0,
        page: res.pagination?.page || page,
        limit: res.pagination?.limit || limit,
      });
    } catch (err) {
      console.error('Failed to fetch PDFs:', err);
      set({ pdfs: [], total: 0 });
    } finally {
      set({ loading: false });
    }
  },

  selectPDF: (pdf) => set({ selectedPDF: pdf }),

  addPDF: async (file: File) => {
    set({ loading: true });
    try {
      await uploadPDF(file);
      await get().fetchPDFs(1, get().limit);
    } catch (err) {
      console.error('Failed to upload PDF:', err);
    } finally {
      set({ loading: false });
    }
  },
}));
