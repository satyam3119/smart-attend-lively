import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock, MapPin, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QRSession } from "@/components/QRSession";

interface Class {
  id: string;
  name: string;
  subject: string | null;
  room: string | null;
  schedule_days: string[] | null;
  schedule_time: string | null;
  created_at: string;
}

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    room: "",
    schedule_days: [] as string[],
    schedule_time: ""
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("classes")
        .insert({
          teacher_id: user.id,
          name: formData.name,
          subject: formData.subject || null,
          room: formData.room || null,
          schedule_days: formData.schedule_days.length > 0 ? formData.schedule_days : null,
          schedule_time: formData.schedule_time || null
        });

      if (error) throw error;

      toast.success("Class created successfully");
      setShowForm(false);
      setFormData({ name: "", subject: "", room: "", schedule_days: [], schedule_time: "" });
      fetchClasses();
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Failed to create class");
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter(d => d !== day)
        : [...prev.schedule_days, day]
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and schedules</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Class</CardTitle>
            <CardDescription>Add a new class to your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Class Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.schedule_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule_time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Schedule Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {days.map(day => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.schedule_days.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day)}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Class</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/classes/${classItem.id}`)}>
            <CardHeader>
              <CardTitle>{classItem.name}</CardTitle>
              {classItem.subject && (
                <CardDescription>{classItem.subject}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classItem.room && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {classItem.room}
                  </div>
                )}
                {classItem.schedule_time && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {classItem.schedule_time}
                  </div>
                )}
                {classItem.schedule_days && classItem.schedule_days.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {classItem.schedule_days.map(day => (
                      <Badge key={day} variant="secondary" className="text-xs">
                        {day.slice(0, 3)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Sessions
          </h3>
          <div className="grid gap-4">
            {classes.map((cls) => (
              <QRSession 
                key={cls.id} 
                classId={cls.id} 
                className={cls.name}
              />
            ))}
          </div>
        </div>
      )}

      {classes.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No classes yet</h3>
            <p className="text-muted-foreground mb-4">Create your first class to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}