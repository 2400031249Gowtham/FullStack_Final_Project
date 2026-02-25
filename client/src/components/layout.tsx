import { ReactNode } from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { LogOut, GraduationCap, User as UserIcon, Calendar, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Layout({ children }: { children: ReactNode }) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-xl">
            <GraduationCap className="h-8 w-8" />
            <span>Campus<span className="text-foreground">Connect</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role} Portal</span>
            </div>
            
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => logout.mutate()}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Subtle Side Navigation */}
          <aside className="w-full md:w-64 shrink-0 space-y-2">
            <div className="p-4 rounded-2xl bg-card border shadow-sm flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Navigation</h3>
              
              <Button variant="secondary" className="justify-start gap-3 w-full">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              
              {user.role === 'admin' ? (
                <Button variant="ghost" className="justify-start gap-3 w-full opacity-50 cursor-not-allowed" title="Coming Soon">
                  <UserIcon className="h-4 w-4" />
                  Directory
                </Button>
              ) : (
                <Button variant="ghost" className="justify-start gap-3 w-full opacity-50 cursor-not-allowed" title="Coming Soon">
                  <Calendar className="h-4 w-4" />
                  My Calendar
                </Button>
              )}
            </div>

            {/* Fun little decorative card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg mt-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://pixabay.com/get/g1152b77b75effacb4f880cbc00c47fb75616a81ae79c1cea4fb5d9a28e9482ffbf7dae133301e5508eaea8920e08d4937869646ce47102faf21a9b15bd0c4812_1280.jpg')] opacity-10 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
              <h3 className="font-display font-bold text-lg mb-1 relative z-10">Stay Active!</h3>
              <p className="text-sm opacity-90 relative z-10">Students in 2+ clubs report 40% higher satisfaction.</p>
            </div>
          </aside>

          {/* Page Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
