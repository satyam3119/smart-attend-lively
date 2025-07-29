import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Timer, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface QRSessionProps {
  classId: string;
  className: string;
}

interface QRSessionData {
  id: string;
  session_code: string;
  expires_at: string;
  is_active: boolean;
}

export function QRSession({ classId, className }: QRSessionProps) {
  const [session, setSession] = useState<QRSessionData | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const generateSession = async () => {
    setLoading(true);
    try {
      // Deactivate any existing sessions for this class
      await supabase
        .from('qr_sessions')
        .update({ is_active: false })
        .eq('class_id', classId)
        .eq('is_active', true);

      // Create new session (expires in 10 minutes)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const sessionCode = Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('qr_sessions')
        .insert({
          class_id: classId,
          session_code: sessionCode,
          expires_at: expiresAt.toISOString(),
          teacher_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setSession(data);
      
      // Generate QR code
      const qrData = JSON.stringify({
        sessionId: data.id,
        sessionCode: sessionCode,
        classId: classId,
        className: className
      });
      
      const qrCodeURL = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataURL(qrCodeURL);
      toast.success('QR session started successfully!');
    } catch (error) {
      console.error('Error generating QR session:', error);
      toast.error('Failed to generate QR session');
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!session) return;
    
    try {
      await supabase
        .from('qr_sessions')
        .update({ is_active: false })
        .eq('id', session.id);
      
      setSession(null);
      setQrCodeDataURL('');
      toast.success('QR session ended');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session');
    }
  };

  // Timer effect
  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(session.expires_at).getTime();
      const remaining = Math.max(0, expiry - now);
      
      setTimeLeft(remaining);
      
      if (remaining === 0 && session.is_active) {
        endSession();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!session ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Generate a QR code for students to scan and mark their attendance
            </p>
            <Button onClick={generateSession} disabled={loading}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className="text-sm">Time remaining:</span>
                <Badge variant={timeLeft < 60000 ? "destructive" : "default"}>
                  {formatTime(timeLeft)}
                </Badge>
              </div>
              <Button variant="destructive" size="sm" onClick={endSession}>
                End Session
              </Button>
            </div>

            {qrCodeDataURL && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <img 
                    src={qrCodeDataURL} 
                    alt="QR Code for attendance" 
                    className="max-w-full h-auto"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Session Code: <code className="bg-muted px-2 py-1 rounded">{session.session_code}</code>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Students can scan this QR code to mark attendance
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}