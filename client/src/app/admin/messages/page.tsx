"use client";

import { useGetMessagesQuery } from "@/store/api/contactApi";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig = {
  PENDING: { color: "bg-amber-100 text-amber-600", icon: Clock },
  RESOLVED: { color: "bg-emerald-100 text-emerald-600", icon: CheckCircle },
  REJECTED: { color: "bg-red-100 text-red-600", icon: XCircle },
};

export default function AdminQueriesPage() {
  const { data: messages = [], isLoading } = useGetMessagesQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Contact Queries</h1>
        <p className="text-sm text-muted">Manage questions and queries from visitors.</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">Query</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((q: any) => {
              const status = (q.status || "PENDING") as keyof typeof statusConfig;
              const config = statusConfig[status];
              return (
                <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-secondary">{q.name}</p>
                    <p className="text-xs text-muted">{q.email}</p>
                  </td>
                  <td className="max-w-xs px-6 py-4 text-sm text-muted truncate">{q.message}</td>
                  <td className="px-6 py-4 text-sm text-muted">{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
                      <config.icon size={12} /> {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20">
                      Respond
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
