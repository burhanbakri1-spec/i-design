import AdminShell from '@/components/admin/AdminShell';
import { AdminFeedbackProvider } from '@/components/admin/AdminFeedback';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminFeedbackProvider>
      <AdminShell>{children}</AdminShell>
    </AdminFeedbackProvider>
  );
}
