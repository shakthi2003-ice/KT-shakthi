import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  pageId: string | null;
  title: string;
  groupedBlocks: JSX.Element[];
  toc: {
    title: string;
    url: string;
    items: { title: string; url: string }[];
  }[];
}

const initialState: PageState = {
  pageId: null,
  title: "",
  groupedBlocks: [],
  toc: [],
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPageData: (
      state,
      action: PayloadAction<{
        pageId: string;
        title: string;
        groupedBlocks: JSX.Element[];
        toc: PageState["toc"];
      }>
    ) => {
      state.pageId = action.payload.pageId;
      state.title = action.payload.title;
      state.groupedBlocks = action.payload.groupedBlocks;
      state.toc = action.payload.toc;
    },
  },
});

export const { setPageData } = pageSlice.actions;
export default pageSlice.reducer;
