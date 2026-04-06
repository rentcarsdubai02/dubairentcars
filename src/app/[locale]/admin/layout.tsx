import AdminSidebar from "@/components/shared/admin-sidebar"
import { setRequestLocale } from 'next-intl/server'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-screen pt-32 pb-24 bg-background relative">
      {/* Sidebar background glow */}
      <div className="absolute top-0 left-0 w-[30%] h-[100%] bg-primary/5 blur-[150px] -z-10 pointer-events-none" />
      
      {/* Sidebar Component handles its own mobile/desktop state */}
      <div className="shrink-0 z-[100]">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile quick-nav overlay (could be added later if needed) */}
        
        <div className="container px-6 mx-auto relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
