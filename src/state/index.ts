import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ErrorAlert, ProductNum, ProductSearchData } from "~/types";
import { v4 as uuidv4 } from "uuid";

interface HomeState {
  productName: {
    [key in ProductNum]: string;
  };
  productSearchResult: {
    [key in ProductNum]: ProductSearchData[];
  };
  selectedProductId: {
    [key in ProductNum]: string;
  };
  searchResultCollapsed: {
    [key in ProductNum]: boolean;
  };
  comparisonResult: string;
  setProductName: (num: ProductNum, name: string) => void;
  setProductSearchResult: (
    num: ProductNum,
    result: ProductSearchData[]
  ) => void;
  setSelectedProductId: (num: ProductNum, productId: string) => void;
  toggleSearchResultCollapsed: (num: ProductNum) => void;
  setComparisonResult: (result: string) => void;
  // Error alerts
  errorAlerts: ErrorAlert[];
  addErrorAlert: (message: string) => void;
  clearErrorAlert: (id: string) => void;
}

export const useHomeStore = create<HomeState>()(
  devtools((set, get) => ({
    productName: {
      "1": "",
      "2": "",
    },
    productSearchResult: {
      "1": [],
      "2": [],
    },
    selectedProductId: {
      "1": "",
      "2": "",
    },
    searchResultCollapsed: {
      "1": false,
      "2": false,
    },
    comparisonResult: "",
    setProductName: (num, name) =>
      set((state) => ({
        productName: {
          ...state.productName,
          [num]: name,
        },
      })),
    setProductSearchResult: (num, result) =>
      set((state) => ({
        productSearchResult: {
          ...state.productSearchResult,
          [num]: result,
        },
      })),
    setSelectedProductId: (num, productId) =>
      set((state) => ({
        selectedProductId: {
          ...state.selectedProductId,
          [num]: productId,
        },
      })),
    toggleSearchResultCollapsed: (num) =>
      set((state) => ({
        searchResultCollapsed: {
          ...state.searchResultCollapsed,
          [num]: !state.searchResultCollapsed[num],
        },
      })),
    setComparisonResult: (result) => set(() => ({ comparisonResult: result })),
    errorAlerts: [],
    addErrorAlert: (message: string) => {
      const id = uuidv4();
      const errorAlert = { id, message };
      set((state) => ({ errorAlerts: [...state.errorAlerts, errorAlert] }));

      setTimeout(() => {
        get().clearErrorAlert(id);
      }, 3000);
    },
    clearErrorAlert: (id: string) =>
      set((state) => ({
        errorAlerts: state.errorAlerts.filter((alert) => alert.id !== id),
      })),
  }))
);
