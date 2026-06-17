// this is the layout.js which is used for the redirecting the user to the dashboard/summery of the factory


import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  redirect('/factory/dashboard/summary');
}