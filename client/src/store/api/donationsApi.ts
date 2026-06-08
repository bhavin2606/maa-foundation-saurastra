import { baseApi } from "./baseApi";

export interface Donation {
  id: string;
  amount: number;
  quantity: number;
  itemLabel?: string;
  donorName: string;
  donorEmail: string;
  phone?: string;
  message?: string;
  paymentMethod?: string;
  screenshotUrl?: string;
  reelId?: string;
  campaignId?: string;
  paymentStatus: string;
  adminApproved?: boolean;
  adminApprovedAt?: string;
  receiptUrl?: string;
  createdAt: string;
}

export const donationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDonations: builder.query<Donation[], void>({
      query: () => "/donations",
      providesTags: ["Donations"],
    }),
    createDonation: builder.mutation<Donation, Partial<Donation>>({
      query: (body) => ({
        url: "/donations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations", "Campaigns"],
    }),
    createRazorpayOrder: builder.mutation<any, { amount: number; name: string; email: string }>({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyRazorpayPayment: builder.mutation<Donation, any>({
      query: (body) => ({
        url: "/payment/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations", "Campaigns"],
    }),
    createManualPayment: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/payment/manual",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations", "Campaigns"],
    }),
    adminCreateDonation: builder.mutation<any, { donorName: string; donorEmail: string; phone?: string; amount: string | number; campaignId?: string; itemLabel?: string; message?: string }>({
      query: (body) => ({
        url: "/donations/admin-create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations", "Campaigns"],
    }),
  }),
});

export const { 
  useGetDonationsQuery, 
  useCreateDonationMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateManualPaymentMutation,
  useAdminCreateDonationMutation
} = donationsApi;
