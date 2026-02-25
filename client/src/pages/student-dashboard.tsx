import { useActivities } from "@/hooks/use-activities";
import { useRegistrations, useCreateRegistration, useDeleteRegistration } from "@/hooks/use-registrations";
import { useCurrentUser } from "@/hooks/use-auth";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Palette, MapPin, Calendar, Check, AlertCircle } from "lucide-react";

export default function StudentDashboard() {
  const { data: user } = useCurrentUser();
  const { data: activities, isLoading: loadingActs } = useActivities();
  const { data: registrations, isLoading: loadingRegs } = useRegistrations();
  
  const register = useCreateRegistration();
  const unregister = useDeleteRegistration();

  if (loadingActs || loadingRegs || !user) {
    return <div className="py-12 text-center text-muted-foreground">Loading your portal...</div>;
  }

  // Derived state
  const myRegs = registrations?.filter(r => r.userId === user.id) || [];
  const myRegMap = new Map(myRegs.map(r => [r.activityId, r]));
  
  const upcomingActs = activities?.filter(a => new Date(a.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  
  const myUpcoming = upcomingActs.filter(a => {
    const reg = myRegMap.get(a.id);
    return reg && reg.status !== 'cancelled';
  });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'sport': return <Trophy className="w-5 h-5 text-accent" />;
      case 'club': return <Palette className="w-5 h-5 text-primary" />;
      default: return <MapPin className="w-5 h-5 text-orange-500" />;
    }
  };

  const handleRegister = (actId: number) => {
    register.mutate({ userId: user.id, activityId: actId, status: "registered" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">You have <strong className="text-primary">{myUpcoming.length}</strong> upcoming activities.</p>
        </div>
      </div>

      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="discover" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Discover</TabsTrigger>
          <TabsTrigger value="my-schedule" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">My Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingActs.map(act => {
              const reg = myRegMap.get(act.id);
              const isRegistered = !!reg && reg.status !== 'cancelled';
              
              return (
                <Card key={act.id} className="overflow-hidden flex flex-col hover-elevate border-border/50 shadow-sm relative group">
                  {isRegistered && (
                    <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
                      <Check className="w-3 h-3 mr-1" /> Registered
                    </div>
                  )}
                  
                  <div className="p-6 flex-1">
                    <Badge variant="secondary" className="capitalize px-3 py-1 flex items-center w-fit gap-1.5 font-semibold mb-4 bg-secondary text-secondary-foreground">
                      {getCategoryIcon(act.category)}
                      {act.category}
                    </Badge>
                    
                    <h3 className="font-display text-xl font-bold mb-2 line-clamp-1">{act.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">{act.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-muted/50 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                      {format(new Date(act.date), "MMM d, yyyy • h:mm a")}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t bg-muted/10 mt-auto">
                    {isRegistered ? (
                      <Button 
                        variant="outline" 
                        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        onClick={() => unregister.mutate(reg.id)}
                        disabled={unregister.isPending}
                      >
                        Cancel Registration
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:-translate-y-0.5 transition-transform"
                        onClick={() => handleRegister(act.id)}
                        disabled={register.isPending}
                      >
                        Register Now
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
            
            {upcomingActs.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No upcoming activities to discover.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="my-schedule" className="space-y-6 focus-visible:outline-none">
           {myUpcoming.length > 0 ? (
             <div className="grid gap-4">
               {myUpcoming.map(act => {
                 const reg = myRegMap.get(act.id)!;
                 return (
                   <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border bg-card hover:border-primary/30 transition-colors shadow-sm gap-4">
                     <div className="flex items-start gap-4">
                       <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                         {getCategoryIcon(act.category)}
                       </div>
                       <div>
                         <h3 className="font-display font-bold text-lg">{act.name}</h3>
                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                           <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(act.date), "EEEE, MMMM d")}</span>
                           <span className="flex items-center gap-1 opacity-70"><Check className="w-3.5 h-3.5" /> Status: <span className="capitalize text-foreground font-medium">{reg.status}</span></span>
                         </div>
                       </div>
                     </div>
                     <Button 
                        variant="ghost" 
                        className="text-destructive hover:bg-destructive/10 sm:w-auto w-full"
                        onClick={() => unregister.mutate(reg.id)}
                      >
                        Cancel
                      </Button>
                   </div>
                 );
               })}
             </div>
           ) : (
             <div className="py-16 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold">Your schedule is empty</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">Browse the discover tab to find clubs, sports, and events to join.</p>
             </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
