import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  // Directly send user to summary page as default view
  redirect('/factory/dashboard/summary');
}