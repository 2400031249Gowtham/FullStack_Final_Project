import { useUsers, useLogin } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { GraduationCap, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { data: users, isLoading } = useUsers();
  const login = useLogin();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading portal...</div>;

  const admins = users?.filter(u => u.role === 'admin') || [];
  const students = users?.filter(u => u.role === 'student') || [];

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-4xl px-4 grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left branding */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-white shadow-xl rounded-3xl mb-4">
            <GraduationCap className="w-16 h-16 text-primary" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Campus<span className="text-primary">Connect</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto md:mx-0">
            Your all-in-one portal for extracurricular activities, sports, and events.
          </p>
        </div>

        {/* Right login selector */}
        <Card className="glass-panel p-8 rounded-3xl border-0 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">Demo Login</h2>
            <p className="text-sm text-muted-foreground">Select a role to preview the platform</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Administrator
              </h3>
              <div className="grid gap-2">
                {admins.map(admin => (
                  <Button 
                    key={admin.id}
                    variant="outline" 
                    className="h-14 justify-start px-6 text-base font-semibold hover-elevate border-primary/20 hover:border-primary hover:bg-primary/5"
                    onClick={() => login.mutate(admin.id)}
                    disabled={login.isPending}
                  >
                    Login as {admin.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Student
              </h3>
              <div className="grid gap-2">
                {students.map(student => (
                  <Button 
                    key={student.id}
                    variant="outline" 
                    className="h-14 justify-start px-6 text-base font-semibold hover-elevate border-accent/20 hover:border-accent hover:bg-accent/5"
                    onClick={() => login.mutate(student.id)}
                    disabled={login.isPending}
                  >
                    Login as {student.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
