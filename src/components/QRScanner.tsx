import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onAttendanceMarked?: () => void;
}

interface QRData {
  sessionId: string;
  sessionCode: string;
  classId: string;
  className: string;
}

export function QRScanner({ onAttendanceMarked }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setError('');
      setSuccess('');
      setScanResult('');

      const scanner = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
      setIsScanning(true);
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError('Failed to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = async (data: string) => {
    try {
      setScanResult(data);
      stopScanning();

      // Parse QR data
      const qrData: QRData = JSON.parse(data);
      
      // Verify session is valid and active
      const { data: session, error: sessionError } = await supabase
        .from('qr_sessions')
        .select('*')
        .eq('id', qrData.sessionId)
        .eq('session_code', qrData.sessionCode)
        .eq('is_active', true)
        .single();

      if (sessionError || !session) {
        setError('Invalid or expired QR code');
        return;
      }

      // Check if session is still valid (not expired)
      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      
      if (now > expiresAt) {
        setError('QR code session has expired');
        return;
      }

      // For now, we'll just show success - in a real app, you'd need student authentication
      // or a way to identify which student is scanning
      setSuccess(`Successfully scanned QR code for ${qrData.className}`);
      toast.success('QR code scanned successfully!');
      
      // In a full implementation, you would:
      // 1. Get the current student's ID (from auth or selection)
      // 2. Create an attendance record
      // 3. Mark the student as present
      
      onAttendanceMarked?.();
      
    } catch (err) {
      console.error('Error processing scan result:', err);
      setError('Invalid QR code format');
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {!isScanning ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Scan a QR code to mark your attendance
              </p>
              <Button onClick={startScanning}>
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <video
                ref={videoRef}
                className="w-full max-w-sm mx-auto rounded-lg bg-black"
                style={{ aspectRatio: '1' }}
              />
              <Button variant="outline" onClick={stopScanning}>
                Stop Scanning
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {scanResult && !error && !success && (
          <div className="text-center">
            <Badge variant="outline">
              Scan Result: {scanResult.substring(0, 50)}...
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}