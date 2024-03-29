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
  productSearchResultLimit: {
    [key in ProductNum]: number;
  };
  selectedProductId: {
    [key in ProductNum]: string;
  };
  selectedProductForComparison: {
    [key in ProductNum]: ProductSearchData | null;
  };
  searchResultCollapsed: {
    [key in ProductNum]: boolean;
  };
  setProductName: (num: ProductNum, name: string) => void;
  setProductSearchResult: (
    num: ProductNum,
    result: ProductSearchData[]
  ) => void;
  addProductSearchResultLimit: (num: ProductNum) => void;
  setSelectedProductId: (num: ProductNum, productId: string) => void;
  setSelectedProductForComparison: (
    num: ProductNum,
    productId: string | null
  ) => void;
  toggleSearchResultCollapsed: (num: ProductNum) => void;
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
    productSearchResultLimit: {
      "1": 5,
      "2": 5,
    },
    selectedProductId: {
      "1": "",
      "2": "",
    },
    selectedProductForComparison: {
      "1": null,
      "2": null,
    },
    searchResultCollapsed: {
      "1": false,
      "2": false,
    },
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
        productSearchResultLimit: {
          ...state.productSearchResultLimit,
          [num]: 5,
        },
      })),
    addProductSearchResultLimit: (num) =>
      set((state) => ({
        productSearchResultLimit: {
          ...state.productSearchResultLimit,
          [num]: state.productSearchResultLimit[num] + 5,
        },
      })),
    setSelectedProductId: (num, productId) =>
      set((state) => ({
        selectedProductId: {
          ...state.selectedProductId,
          [num]: productId,
        },
      })),
    setSelectedProductForComparison: (num, productId) =>
      set((state) => ({
        selectedProductForComparison: {
          ...state.selectedProductForComparison,
          [num]:
            productId === null
              ? null
              : state.productSearchResult[num].find(
                  (product) => product.asin === productId
                ) || null,
        },
      })),
    toggleSearchResultCollapsed: (num) =>
      set((state) => ({
        searchResultCollapsed: {
          ...state.searchResultCollapsed,
          [num]: !state.searchResultCollapsed[num],
        },
      })),
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
