import { AuthForm } from "@/components/shared/auth-form"
import { setRequestLocale } from "next-intl/server"

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 relative z-10 opacity-0 animate-[fade-in_0.8s_ease-out_forwards]">
        <AuthForm type="signup" />
      </div>
    </div>
  )
}
