
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6 md:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
