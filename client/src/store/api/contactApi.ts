import { baseApi } from "./baseApi";

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status?: string;
  createdAt: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<ContactQuery[], void>({
      query: () => "/contact",
      providesTags: ["Contact"],
    }),
    submitMessage: builder.mutation<ContactQuery, Partial<ContactQuery>>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    updateStatus: builder.mutation<ContactQuery, { id: string; status: string; replyMessage?: string }>({
      query: ({ id, ...body }) => ({
        url: `/contact/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const { 
  useGetMessagesQuery, 
  useSubmitMessageMutation,
  useUpdateStatusMutation,
  useDeleteMessageMutation,
} = contactApi;
