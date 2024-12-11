import { DashboardNav } from "@/app/Components/DashboardNav";
import { UserNav } from "@/app/Components/user-nav";
import { ThemeToggle } from "@/app/Components/ThemeToggle";
import { ThemeProvider } from "@/app/Components/ThemeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
    <div className="min-h-screen flex">
      <DashboardNav />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
    </ThemeProvider>
    </>
  );
}