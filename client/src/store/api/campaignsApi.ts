import { baseApi } from "./baseApi";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  category: string;
  organizer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const campaignsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<Campaign[], void>({
      query: () => "/campaigns",
      providesTags: ["Campaigns"],
    }),
    getCampaignById: builder.query<Campaign, string>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: "Campaigns", id }],
    }),
    createCampaign: builder.mutation<Campaign, Partial<Campaign> | FormData>({
      query: (body) => ({
        url: "/campaigns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Campaigns"],
    }),
    updateCampaign: builder.mutation<Campaign, { id: string; data: Partial<Campaign> | FormData }>({
      query: ({ id, data }) => ({
        url: `/campaigns/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Campaigns"],
    }),
    deleteCampaign: builder.mutation<void, string>({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignsApi;
