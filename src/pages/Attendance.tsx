import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  student_id: string | null;
}

interface Class {
  id: string;
  name: string;
}

interface AttendanceRecord {
  student_id: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export default function Attendance() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("id, name, student_id")
        .eq("class_id", selectedClass)
        .order("name");

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("student_id, status, notes")
        .eq("class_id", selectedClass)
        .eq("date", selectedDate);

      if (error) throw error;

      const attendanceMap: Record<string, AttendanceRecord> = {};
      data?.forEach(record => {
        attendanceMap[record.student_id] = {
          student_id: record.student_id,
          status: record.status as any,
          notes: record.notes || ""
        };
      });

      setAttendance(attendanceMap);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance");
    }
  };

  const updateAttendance = (studentId: string, status: AttendanceRecord["status"]) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        student_id: studentId,
        status,
        notes: prev[studentId]?.notes || ""
      }
    }));
  };

  const updateNotes = (studentId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        student_id: studentId,
        status: prev[studentId]?.status || "absent",
        notes
      }
    }));
  };

  const saveAttendance = async () => {
    if (!selectedClass || !selectedDate) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete existing attendance for this class and date
      await supabase
        .from("attendance")
        .delete()
        .eq("class_id", selectedClass)
        .eq("date", selectedDate);

      // Insert new attendance records
      const records = Object.values(attendance).map(record => ({
        student_id: record.student_id,
        class_id: selectedClass,
        teacher_id: user.id,
        date: selectedDate,
        status: record.status,
        notes: record.notes || null
      }));

      if (records.length > 0) {
        const { error } = await supabase
          .from("attendance")
          .insert(records);

        if (error) throw error;
      }

      toast.success("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "excused":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-8 h-8" />
        <div>
          <h1 className="text-3xl font-bold">Take Attendance</h1>
          <p className="text-muted-foreground">Mark student attendance for your classes</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Class and Date</CardTitle>
          <CardDescription>Choose the class and date to take attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Student Attendance</CardTitle>
                <CardDescription>
                  {students.length} students • {selectedDate}
                </CardDescription>
              </div>
              <Button onClick={saveAttendance} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const record = attendance[student.id];
                  const status = record?.status || "absent";
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.student_id || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(["present", "absent", "late", "excused"] as const).map((statusOption) => (
                            <Button
                              key={statusOption}
                              variant={status === statusOption ? "default" : "outline"}
                              size="sm"
                              className={`
                                ${status === statusOption ? getStatusColor(statusOption) : ""}
                                capitalize
                              `}
                              onClick={() => updateAttendance(student.id, statusOption)}
                            >
                              {getStatusIcon(statusOption)}
                              <span className="ml-1">{statusOption}</span>
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Add notes..."
                          value={record?.notes || ""}
                          onChange={(e) => updateNotes(student.id, e.target.value)}
                          className="w-48"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedClass && students.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No students in this class</h3>
            <p className="text-muted-foreground">Add students to this class to take attendance</p>
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a class to begin</h3>
            <p className="text-muted-foreground">Choose a class and date to take attendance</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}