import { baseApi } from "./baseApi";

export interface Donation {
  id: string;
  amount: number;
  quantity: number;
  itemLabel?: string;
  donorName: string;
  donorEmail: string;
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
      invalidatesTags: ["Donations", "Campaigns"], // Invalidate campaigns to refresh 'raised' amount
    }),
  }),
});

export const { useGetDonationsQuery, useCreateDonationMutation } = donationsApi;
