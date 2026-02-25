import { useState } from "react";
import { format } from "date-fns";
import { useActivities, useDeleteActivity } from "@/hooks/use-activities";
import { useRegistrations, useUpdateRegistrationStatus } from "@/hooks/use-registrations";
import { useUsers } from "@/hooks/use-auth";
import { ActivityForm } from "@/components/activity-form";
import { type Activity } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Edit, Trash2, Users, Calendar, Trophy, Palette, 
  MapPin, CheckCircle2, XCircle, Clock
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { data: activities, isLoading: loadingActs } = useActivities();
  const { data: registrations } = useRegistrations();
  const { data: users } = useUsers();
  const deleteActivity = useDeleteActivity();
  const updateStatus = useUpdateRegistrationStatus();

  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  // State for view registrations modal
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);

  if (loadingActs) return <div className="py-12 text-center text-muted-foreground">Loading activities...</div>;

  const handleEdit = (act: Activity) => {
    setEditingActivity(act);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingActivity(null);
    setFormOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'sport': return <Trophy className="w-5 h-5 text-accent" />;
      case 'club': return <Palette className="w-5 h-5 text-primary" />;
      default: return <MapPin className="w-5 h-5 text-orange-500" />;
    }
  };

  const getRegistrationsForActivity = (actId: number) => {
    if (!registrations || !users) return [];
    return registrations
      .filter(r => r.activityId === actId)
      .map(r => ({
        ...r,
        user: users.find(u => u.id === r.userId)
      }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Activity Management</h1>
          <p className="text-muted-foreground mt-1">Create and oversee all campus extracurriculars.</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-white hover-elevate shadow-md shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Create Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activities?.map(act => {
          const actRegs = getRegistrationsForActivity(act.id);
          
          return (
            <Card key={act.id} className="overflow-hidden flex flex-col hover-elevate border-border/50 shadow-sm">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="capitalize px-3 py-1 flex items-center gap-1.5 font-semibold">
                    {getCategoryIcon(act.category)}
                    {act.category}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(act)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => {
                      if (confirm("Are you sure you want to delete this?")) deleteActivity.mutate(act.id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-display text-xl font-bold mb-2 line-clamp-1" title={act.name}>{act.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">{act.description}</p>
                
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-secondary/30 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                  {format(new Date(act.date), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-bold text-foreground">{actRegs.length}</span> registered
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewingActivity(act)}>
                  View Roster
                </Button>
              </div>
            </Card>
          );
        })}
        
        {activities?.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-2xl">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold">No Activities Yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating the first activity.</p>
            <Button onClick={handleCreate} variant="outline">Create Activity</Button>
          </div>
        )}
      </div>

      <ActivityForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        initialData={editingActivity} 
      />

      {/* Roster Modal */}
      <Dialog open={!!viewingActivity} onOpenChange={(open) => !open && setViewingActivity(null)}>
        <DialogContent className="sm:max-w-[600px] bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {viewingActivity?.name} Roster
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {viewingActivity && getRegistrationsForActivity(viewingActivity.id).length > 0 ? (
              <div className="space-y-3">
                {getRegistrationsForActivity(viewingActivity.id).map(reg => (
                  <div key={reg.id} className="flex items-center justify-between p-3 rounded-xl border bg-background hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {reg.user?.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{reg.user?.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          {reg.status === 'registered' && <Clock className="w-3 h-3 text-orange-500" />}
                          {reg.status === 'attended' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                          {reg.status === 'cancelled' && <XCircle className="w-3 h-3 text-red-500" />}
                          <span className="capitalize">{reg.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" variant={reg.status === 'attended' ? 'default' : 'outline'}
                        className={reg.status === 'attended' ? 'bg-green-500 hover:bg-green-600' : ''}
                        onClick={() => updateStatus.mutate({ id: reg.id, status: 'attended' })}
                        disabled={updateStatus.isPending}
                      >
                        Mark Attended
                      </Button>
                      <Button 
                        size="sm" variant={reg.status === 'cancelled' ? 'destructive' : 'outline'}
                        onClick={() => updateStatus.mutate({ id: reg.id, status: 'cancelled' })}
                        disabled={updateStatus.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No students registered yet.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
