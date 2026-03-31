import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api" }),
  tagTypes: ["Reels", "Campaigns", "Donations", "Contact", "Dashboard"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = baseApi;
