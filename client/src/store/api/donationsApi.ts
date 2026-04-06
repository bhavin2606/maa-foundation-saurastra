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
  status: string;
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
    createRazorpayOrder: builder.mutation<any, { amount: number }>({
      query: (body) => ({
        url: "/donations/create-order",
        method: "POST",
        body,
      }),
    }),
    verifyRazorpayPayment: builder.mutation<Donation, any>({
      query: (body) => ({
        url: "/donations/verify-payment",
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
  useVerifyRazorpayPaymentMutation
} = donationsApi;
