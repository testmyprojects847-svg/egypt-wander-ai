import { useEffect } from 'react';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { LuxuryFooter } from '@/components/home/LuxuryFooter';
import { useComplaints, type Complaint } from '@/hooks/useComplaints';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Mail, Phone, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

function ComplaintCard({ complaint, onMarkRead, onDelete }: { 
  complaint: Complaint;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className={`bg-black border ${complaint.is_read ? 'border-primary/30' : 'border-primary'} transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]`}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-primary font-semibold">{complaint.name}</h3>
              <p className="text-primary/60 text-sm">
                {format(new Date(complaint.created_at), 'MMM dd, yyyy - HH:mm')}
              </p>
            </div>
          </div>
          {!complaint.is_read && (
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/40">
              New
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-primary/80">
            <Mail className="w-4 h-4" />
            <span>{complaint.email}</span>
          </div>
          {complaint.phone && (
            <div className="flex items-center gap-2 text-primary/80">
              <Phone className="w-4 h-4" />
              <span>{complaint.phone}</span>
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-primary/90 bg-primary/5 rounded-lg p-3 border border-primary/20 mb-4">
          {complaint.message}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {!complaint.is_read && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkRead(complaint.id)}
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Read
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(complaint.id)}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const AdminComplaintsPage = () => {
  const { complaints, isLoading, markAsRead, deleteComplaint, unreadCount } = useComplaints();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <AdminNavbar />

      <main className="flex-1 px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl text-primary tracking-wide">
                Complaints
              </h1>
              <p className="text-primary/60 mt-1">
                {complaints.length} total • {unreadCount} unread
              </p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-primary/5 border border-primary/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-primary/60 text-lg">No complaints yet</h3>
              <p className="text-primary/40 text-sm mt-1">
                Complaints submitted via the API will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onMarkRead={(id) => markAsRead.mutate(id)}
                  onDelete={(id) => deleteComplaint.mutate(id)}
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
