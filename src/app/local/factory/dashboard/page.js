import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  redirect('/local/factory/dashboard/summary');
}