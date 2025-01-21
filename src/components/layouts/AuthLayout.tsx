import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout = ({ children, className }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-budget-gray flex items-center justify-center p-4 font-bricolage">
      <main className={cn("w-full max-w-md", className)}>{children}</main>
    </div>
  );
};