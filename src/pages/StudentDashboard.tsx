import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Calendar, BarChart3, LogOut, User, GraduationCap, Clock, CheckCircle, XCircle } from "lucide-react";
import { QRScanner } from "@/components/QRScanner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const StudentDashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile and student data
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (profileData?.role !== 'student') {
              navigate('/auth');
              return;
            }
            
            setProfile(profileData);

            // Fetch student record
            const { data: studentData } = await supabase
              .from('students')
              .select('*, classes(name, subject)')
              .eq('email', session.user.email)
              .single();
            
            setStudent(studentData);

            if (studentData) {
              // Fetch classes for this student
              const { data: classesData } = await supabase
                .from('classes')
                .select('*')
                .eq('id', studentData.class_id);
              
              setClasses(classesData || []);

              // Fetch attendance records
              const { data: attendanceData } = await supabase
                .from('attendance')
                .select('*, classes(name, subject)')
                .eq('student_id', studentData.id)
                .order('date', { ascending: false })
                .limit(10);
              
              setAttendance(attendanceData || []);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          navigate('/student-auth');
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user profile and student data
        setTimeout(async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileData?.role !== 'student') {
            navigate('/auth');
            return;
          }
          
          setProfile(profileData);

          // Fetch student record
          const { data: studentData } = await supabase
            .from('students')
            .select('*, classes(name, subject)')
            .eq('email', session.user.email)
            .single();
          
          setStudent(studentData);

          if (studentData) {
            // Fetch classes for this student
            const { data: classesData } = await supabase
              .from('classes')
              .select('*')
              .eq('id', studentData.class_id);
            
            setClasses(classesData || []);

            // Fetch attendance records
            const { data: attendanceData } = await supabase
              .from('attendance')
              .select('*, classes(name, subject)')
              .eq('student_id', studentData.id)
              .order('date', { ascending: false })
              .limit(10);
            
            setAttendance(attendanceData || []);
          }
        }, 0);
      } else {
        navigate('/student-auth');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAttendanceMarked = () => {
    toast({
      title: "Attendance Marked!",
      description: "Your attendance has been successfully recorded.",
    });
    setShowQRScanner(false);
    // Refresh attendance data
    window.location.reload();
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SmartAttend</h1>
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {profile?.full_name || user.email}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {student?.name || profile?.full_name || 'Student'}!
          </h2>
          <p className="text-lg text-muted-foreground">
            {student?.student_id && `Student ID: ${student.student_id}`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* QR Scanner */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                  <QrCode className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>
                    Scan QR code to mark your attendance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full btn-hero"
                onClick={() => setShowQRScanner(!showQRScanner)}
              >
                {showQRScanner ? 'Hide Scanner' : 'Scan QR Code'}
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Rate */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-secondary to-accent rounded-lg">
                  <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle>Attendance Rate</CardTitle>
                  <CardDescription>
                    Your overall attendance percentage
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {calculateAttendancePercentage()}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {attendance.length} total records
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Class */}
          {classes.length > 0 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-accent to-primary rounded-lg">
                    <Calendar className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle>Current Class</CardTitle>
                    <CardDescription>
                      Your enrolled class information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">{classes[0]?.name}</p>
                  <p className="text-sm text-muted-foreground">{classes[0]?.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    Room: {classes[0]?.room || 'TBA'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* QR Scanner Component */}
        {showQRScanner && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle>QR Code Scanner</CardTitle>
              <CardDescription>
                Position the QR code within the camera view to mark your attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner onAttendanceMarked={handleAttendanceMarked} />
            </CardContent>
          </Card>
        )}

        {/* Recent Attendance */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>
              Your latest attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No attendance records found yet.
              </p>
            ) : (
              <div className="space-y-3">
                {attendance.map((record) => (
                  <div 
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
                  >
                    <div className="flex items-center space-x-3">
                      {record.status === 'present' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {record.classes?.name || 'Unknown Class'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.classes?.subject}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium capitalize">
                        {record.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;