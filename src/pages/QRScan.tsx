import { QRScanner } from '@/components/QRScanner';

export default function QRScan() {
  const handleAttendanceMarked = () => {
    // Refresh or update attendance data
    console.log('Attendance marked via QR scan');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Scan QR Code</h1>
        <QRScanner onAttendanceMarked={handleAttendanceMarked} />
      </div>
    </div>
  );
}