import { useEffect, useState } from 'react';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { useComplaints, type Complaint } from '@/hooks/useComplaints';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Mail, Phone, X, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

function ComplaintCard({ complaint, onSendSolution, onDelete, isSending }: { 
  complaint: Complaint;
  onSendSolution: (id: string, solution: string) => void;
  onDelete: (id: string) => void;
  isSending: boolean;
}) {
  const [solution, setSolution] = useState('');
  const isNew = complaint.status === 'new';

  const handleSend = () => {
    if (solution.trim()) {
      onSendSolution(complaint.id, solution.trim());
      setSolution('');
    }
  };

  return (
    <div className="relative bg-[#0d0d0d] border border-primary/40 rounded-lg p-4 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all">
      {/* Delete Icon */}
      <button
        onClick={() => onDelete(complaint.id)}
        className="absolute top-2 right-2 text-red-400/70 hover:text-red-400 transition-colors"
        title="Delete complaint"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Status Badge */}
      <Badge 
        className={`absolute top-2 left-2 text-xs font-bold uppercase tracking-wide ${
          isNew 
            ? 'bg-red-500/90 text-white border-0' 
            : 'bg-green-600/90 text-white border-0'
        }`}
      >
        {isNew ? 'NEW' : 'RESOLVED'}
      </Badge>

      {/* Content */}
      <div className="mt-6 space-y-2">
        {/* Name */}
        <h3 className="text-primary font-semibold text-sm">
          Name: <span className="text-primary/90">{complaint.name}</span>
        </h3>

        {/* Email */}
        <div className="flex items-center gap-1.5 text-xs text-primary/70">
          <Mail className="w-3 h-3" />
          <span>{complaint.email}</span>
        </div>

        {/* Phone */}
        {complaint.phone && (
          <div className="flex items-center gap-1.5 text-xs text-primary/70">
            <Phone className="w-3 h-3" />
            <span>{complaint.phone}</span>
          </div>
        )}

        {/* Message */}
        <div className="mt-3 p-3 bg-black/50 border border-primary/20 rounded-md">
          <p className="text-primary/90 text-sm leading-relaxed">{complaint.message}</p>
        </div>

        {/* Solution Response (if resolved) */}
        {complaint.solution_message && (
          <div className="mt-2 p-3 bg-green-900/20 border border-green-600/30 rounded-md">
            <p className="text-green-400/90 text-sm italic">{complaint.solution_message}</p>
          </div>
        )}

        {/* Solution Input */}
        <div className="mt-3 space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Type the solution..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="bg-black/50 border-primary/30 text-primary text-sm placeholder:text-primary/40 resize-none pr-10 min-h-[60px]"
              rows={2}
            />
            <div className="absolute bottom-2 right-2 text-primary/30">
              <span className="text-lg">𓂀</span>
            </div>
          </div>
          <Button
            onClick={handleSend}
            disabled={!solution.trim() || isSending}
            className="w-full bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            SEND SOLUTION
          </Button>
        </div>

        {/* Date */}
        <p className="text-primary/40 text-xs text-right mt-2">
          {format(new Date(complaint.created_at), 'MMM dd, yyyy - HH:mm')}
        </p>
      </div>
    </div>
  );
}

const AdminComplaintsPage = () => {
  const { complaints, isLoading, sendSolution, deleteComplaint, newCount } = useComplaints();
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSendSolution = async (id: string, solution: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    setSendingId(id);
    await sendSolution.mutateAsync({
      id,
      name: complaint.name,
      email: complaint.email,
      phone: complaint.phone,
      solution_message: solution,
    });
    setSendingId(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AdminNavbar />

      <main className="flex-1 px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl text-primary tracking-wide">
                Support Tickets
              </h1>
              <p className="text-primary/60 mt-1">
                {complaints.length} total • {newCount} new
              </p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-primary/5 border border-primary/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-primary/60 text-lg">No support tickets yet</h3>
              <p className="text-primary/40 text-sm mt-1">
                Support tickets submitted via the API will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onSendSolution={handleSendSolution}
                  onDelete={(id) => deleteComplaint.mutate(id)}
                  isSending={sendingId === complaint.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default AdminComplaintsPage;
