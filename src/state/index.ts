import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ProductNum, ProductSearchData } from "~/types";

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
}

export const useHomeStore = create<HomeState>()(
  devtools((set) => ({
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
  }))
);
