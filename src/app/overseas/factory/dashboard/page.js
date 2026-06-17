import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  redirect('/overseas/factory/dashboard/summary');
}