import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export type AppSliceStateType = {
  tenantHost: string;
};

const initialState: AppSliceStateType = {
  tenantHost: ""
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTenantHost(state, action) {
      state.tenantHost = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload[AppSlice.name]
      };
    });
  }
});
export const { setTenantHost } = AppSlice.actions;
export default AppSlice.reducer;
