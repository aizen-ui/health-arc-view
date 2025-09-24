import { PatientTimeline } from '@/components/PatientTimeline';
import { mockTimelineData } from '@/data/mockTimelineData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <PatientTimeline entries={mockTimelineData} patientName="John Doe" />
    </div>
  );
};

export default Index;
