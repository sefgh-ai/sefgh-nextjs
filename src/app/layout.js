import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SettingsModal from "@/components/SettingsModal";
import PageWrapper from "@/components/PageWrapper";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: '--font-mono',
  weight: ['400', '600'],
  display: 'swap',
  preload: false
});

export const metadata = {
  title: "SEFGH - AI-Powered GitHub Repository Search",
  description: "Discover hidden GitHub gems with SEFGH's intelligent search. Go beyond keywords with natural language queries and find projects that truly match your needs.",
  keywords: "GitHub search tool, GitHub project discovery, smart GitHub search, find GitHub projects, GitHub repository search engine, discover GitHub gems, open source project finder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased dark`} style={{ fontFamily: 'var(--font-inter)' }}>
        <Script src="/obelisk.min.js" strategy="afterInteractive" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <AuthProvider>
            <SettingsProvider>
              <LanguageProvider>
                <PageWrapper>
                  {children}
                </PageWrapper>
                <SettingsModal />
                <Toaster 
                  position="top-right" 
                  closeButton
                  expand={false}
                  duration={4000}
                  toastOptions={{
                    classNames: {
                      toast: 'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                      description: 'group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400',
                      actionButton: 'group-[.toast]:bg-slate-900 dark:group-[.toast]:bg-slate-50 group-[.toast]:text-slate-50 dark:group-[.toast]:text-slate-900',
                      cancelButton: 'group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-800 group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400',
                      closeButton: 'group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-800 group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400 group-[.toast]:border-slate-200 dark:group-[.toast]:border-slate-700',
                      success: 'group toast-success group-[.toaster]:bg-emerald-50 dark:group-[.toaster]:bg-emerald-950 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:text-emerald-50 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:border-emerald-800',
                      error: 'group toast-error group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950 group-[.toaster]:text-red-900 dark:group-[.toaster]:text-red-50 group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800',
                      warning: 'group toast-warning group-[.toaster]:bg-yellow-50 dark:group-[.toaster]:bg-yellow-950 group-[.toaster]:text-yellow-900 dark:group-[.toaster]:text-yellow-50 group-[.toaster]:border-yellow-200 dark:group-[.toaster]:border-yellow-800',
                      info: 'group toast-info group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950 group-[.toaster]:text-blue-900 dark:group-[.toaster]:text-blue-50 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800',
                      loading: 'group toast-loading group-[.toaster]:bg-slate-50 dark:group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-slate-50 group-[.toaster]:border-slate-200 dark:group-[.toaster]:border-slate-700',
                    },
                  }}
                />
              </LanguageProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
