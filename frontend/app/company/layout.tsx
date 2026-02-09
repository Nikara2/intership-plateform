import CompanyHeader from '@/components/CompanyHeader';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <CompanyHeader />
      {children}
    </div>
  );
}
