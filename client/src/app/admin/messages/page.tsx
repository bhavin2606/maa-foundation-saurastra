"use client";

import { useGetMessagesQuery, useUpdateStatusMutation, useDeleteMessageMutation } from "@/store/api/contactApi";
import { 
  CheckCircle2, 
  Clock, 
  Mail, 
  Trash2, 
  User, 
  Calendar, 
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Phone
} from "lucide-react";
import { useState } from "react";

const statusConfig = {
  PENDING: { 
    color: "bg-amber-50 text-amber-600 border-amber-100", 
    icon: Clock,
    label: "Pending"
  },
  RESOLVED: { 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    icon: CheckCircle2,
    label: "Resolved"
  },
  REJECTED: { 
    color: "bg-red-50 text-red-600 border-red-100", 
    icon: AlertCircle,
    label: "Rejected"
  },
};

export default function AdminMessagesPage() {
  const { data: messages = [], isLoading } = useGetMessagesQuery();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ 
        id, 
        status, 
        replyMessage: status === 'RESOLVED' ? replyMessage : undefined 
      }).unwrap();
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
        if (status === 'RESOLVED') {
          setReplyMessage("");
          alert("Resolved and email sent successfully!");
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to process request.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id).unwrap();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter">Messages</h1>
          <p className="text-muted font-medium">Manage and respond to public inquiries.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 rounded-2xl border border-slate-100 bg-white pl-12 pr-6 py-3 text-sm outline-none transition-all focus:border-primary focus:shadow-glow"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white text-muted transition-all hover:bg-surface hover:text-secondary shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Messages List */}
        <div className={`w-full lg:w-1/3 flex-col gap-4 overflow-y-auto lg:pr-4 scrollbar-hide ${selectedMessage ? "hidden lg:flex" : "flex"}`}>
          {filteredMessages.map((msg) => {
            const status = (msg.status || "PENDING") as keyof typeof statusConfig;
            const config = statusConfig[status];
            const isSelected = selectedMessage?.id === msg.id;

            return (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  setReplyMessage(""); // reset reply message when switching
                }}
                className={`group relative text-left p-6 rounded-[32px] border transition-all duration-300 ${
                  isSelected 
                    ? "bg-secondary border-secondary shadow-premium translate-x-2" 
                    : "bg-white border-slate-100 hover:border-primary/30 hover:bg-surface"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-white/10 text-white" : "bg-primary/10 text-primary"}`}>
                    <Mail size={16} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${isSelected ? "bg-white/10 text-white border-white/20" : config.color}`}>
                    {config.label}
                  </span>
                </div>
                <h3 className={`text-sm font-black tracking-tight mb-1 truncate ${isSelected ? "text-white" : "text-secondary"}`}>
                  {msg.subject}
                </h3>
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isSelected ? "text-white/60" : "text-muted"}`}>
                  {msg.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-medium ${isSelected ? "text-white/40" : "text-muted"}`}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <ChevronRight size={14} className={isSelected ? "text-white" : "text-muted group-hover:translate-x-1 transition-transform"} />
                </div>
              </button>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted h-full opacity-50">
              <MessageSquare size={48} className="mb-4 stroke-[1px]" />
              <p className="text-sm font-black uppercase tracking-widest">No messages found</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className={`w-full lg:flex-1 relative ${!selectedMessage ? "hidden lg:block" : "block"}`}>
          {selectedMessage ? (
            <div className="h-full rounded-[48px] bg-white border border-slate-100 p-12 flex flex-col shadow-premium overflow-y-auto">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setSelectedMessage(null)} 
                    className="lg:hidden p-2 -ml-2 text-muted hover:text-secondary bg-surface rounded-xl"
                  >
                     <ChevronLeft size={24} />
                  </button>
                  <div className="h-20 w-20 rounded-[28px] bg-secondary hidden sm:flex items-center justify-center text-white text-2xl font-black italic">
                    {selectedMessage.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-secondary tracking-tighter mb-1 uppercase tracking-tight leading-none bg-gradient-to-r from-secondary to-muted bg-clip-text text-transparent">
                      {selectedMessage.name}
                    </h2>
                    <div className="flex gap-4">
                      <p className="text-sm font-bold text-primary flex items-center gap-2">
                         <Mail size={14} /> {selectedMessage.email}
                      </p>
                      {selectedMessage.phone && (
                        <p className="text-sm font-bold text-primary flex items-center gap-2">
                           <Phone size={14} /> {selectedMessage.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="h-14 w-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <div className="p-8 rounded-[32px] bg-surface/50 border border-slate-50">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                      <Calendar size={12} /> Received Date
                    </p>
                    <p className="text-lg font-black text-secondary tracking-tight">
                      {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <div className="p-8 rounded-[32px] bg-surface/50 border border-slate-50">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                       Processing Status
                    </p>
                    <div className="flex gap-2">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => handleStatusUpdate(selectedMessage.id, key)}
                          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                            selectedMessage.status === key 
                              ? config.color 
                              : "bg-white text-muted border-slate-100 hover:border-primary/30"
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                    <MessageSquare size={12} /> Subject: <span className="text-secondary opacity-100">{selectedMessage.subject}</span>
                  </p>
                  <div className="p-10 rounded-[40px] glass-morphism border-slate-100 bg-white shadow-premium">
                    <p className="text-lg font-medium text-secondary leading-relaxed whitespace-pre-wrap italic">
                      "{selectedMessage.message}"
                    </p>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  {selectedMessage.status !== "RESOLVED" && (
                    <>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                         Reply to User (Sent via Email)
                      </p>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type a custom reply message to send to the user when resolving..."
                        className="w-full rounded-3xl border border-slate-100 bg-surface px-6 py-5 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow resize-none"
                        rows={4}
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted font-medium">A default resolution email will be sent if left empty.</p>
                        <button 
                          onClick={() => handleStatusUpdate(selectedMessage.id, "RESOLVED")}
                          className="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.15em] text-sm shadow-premium hover:bg-emerald-600 transition-all hover:-translate-y-1"
                        >
                          Resolve & Send
                          <Mail size={18} />
                        </button>
                      </div>
                    </>
                  )}
                  {selectedMessage.status === "RESOLVED" && (
                     <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4 text-emerald-700">
                      <CheckCircle2 size={24} className="shrink-0" />
                      <div>
                        <p className="font-black uppercase tracking-wider text-xs">Resolved & Emailed</p>
                        <p className="text-sm font-medium opacity-80">This inquiry has been resolved and the user has been notified.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-[48px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-20 text-muted opacity-40">
              <div className="h-24 w-24 rounded-[32px] bg-slate-50 flex items-center justify-center mb-6">
                <Mail size={48} className="stroke-[1px]" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest text-secondary mb-2">No Message Selected</h2>
              <p className="text-sm font-medium">Select an inquiry from the list to view its details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
