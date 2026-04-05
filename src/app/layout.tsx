import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import MuiThemeProvider from "@/lib/MuiThemeProvider";
import { AuthProvider } from "@/lib/auth";
import { LocaleProvider } from "@/lib/locale";
import { DevInspector } from "@/components/dev/DevInspector"; // ⚠️ PRD: ลบบรรทัดนี้

export const metadata: Metadata = {
  title: "Jigsaw Admin (JAS)",
  description: "Jigsaw Admin System — admin.jigsawx.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <MuiThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
                <DevInspector /> {/* ⚠️ PRD: ลบบรรทัดนี้ */}
              </ToastProvider>
            </AuthProvider>
          </LocaleProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
