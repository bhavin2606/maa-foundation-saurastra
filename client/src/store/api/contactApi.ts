import { baseApi } from "./baseApi";

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
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
  }),
});

export const { useGetMessagesQuery, useSubmitMessageMutation } = contactApi;
