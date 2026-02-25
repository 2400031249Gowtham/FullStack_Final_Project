import { useState, useEffect } from "react";
import { type Activity, type InsertActivity } from "@shared/schema";
import { useCreateActivity, useUpdateActivity } from "@/hooks/use-activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Activity | null;
}

export function ActivityForm({ isOpen, onClose, initialData }: ActivityFormProps) {
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  
  const [formData, setFormData] = useState<Partial<InsertActivity>>({
    name: "",
    description: "",
    date: "",
    category: "event"
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        date: initialData.date.split('T')[0], // simplify for date input
        category: initialData.category,
      });
    } else {
      setFormData({ name: "", description: "", date: "", category: "event" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format date properly for storage
    const submissionData = {
      ...formData,
      date: new Date(formData.date as string).toISOString()
    } as InsertActivity;

    if (initialData) {
      updateActivity.mutate({ id: initialData.id, updates: submissionData }, {
        onSuccess: () => onClose()
      });
    } else {
      createActivity.mutate(submissionData, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = createActivity.isPending || updateActivity.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-card rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialData ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input 
              id="name" 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Chess Club Meeting"
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val) => setFormData({...formData, category: val})}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                required
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              required
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="What will happen at this activity?"
              className="min-h-[100px] bg-background"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover-elevate">
              {isPending ? "Saving..." : "Save Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
