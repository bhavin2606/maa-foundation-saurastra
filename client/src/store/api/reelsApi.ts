import { baseApi } from "./baseApi";

export interface Reel {
  id: string;
  organizer: string;
  avatarUrl: string;
  reelUrl: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  itemLabel: string;
  itemPrice: number;
  likes: string;
  comments: string;
  category: string;
}

export const reelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReels: builder.query<Reel[], void>({
      query: () => "/reels",
      providesTags: ["Reels"],
    }),
    createReel: builder.mutation<Reel, Partial<Reel>>({
      query: (body) => ({
        url: "/reels",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reels"],
    }),
    updateReel: builder.mutation<Reel, { id: string; data: Partial<Reel> }>({
      query: ({ id, data }) => ({
        url: `/reels/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reels"],
    }),
    deleteReel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reels"],
    }),
  }),
});

export const {
  useGetReelsQuery,
  useCreateReelMutation,
  useUpdateReelMutation,
  useDeleteReelMutation,
} = reelsApi;
