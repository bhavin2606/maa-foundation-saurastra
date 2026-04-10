import { baseApi } from "./baseApi";
import { Donation } from "./donationsApi";

export const adminPaymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManualPayments: builder.query<Donation[], void>({
      query: () => "/admin/manual-payments",
      providesTags: ["Donations"],
    }),
    approveManualPayment: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/manual-payments/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Donations", "Campaigns"],
    }),
    rejectManualPayment: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/manual-payments/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Donations", "Campaigns"],
    }),
  }),
});

export const {
  useGetManualPaymentsQuery,
  useApproveManualPaymentMutation,
  useRejectManualPaymentMutation,
} = adminPaymentsApi;
