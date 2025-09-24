import React from 'react';
import { 
  Activity, 
  Heart, 
  Scissors, 
  Pill, 
  FileText, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// FHIR Healthcare Information Types
export type HIType = 
  | 'observation'
  | 'condition' 
  | 'procedure'
  | 'medication'
  | 'diagnostic'
  | 'encounter'
  | 'allergy';

export interface TimelineEntry {
  id: string;
  type: HIType;
  date: string;
  title: string;
  description: string;
  practitioner: string;
  institution: string;
  status?: 'active' | 'completed' | 'cancelled' | 'in-progress';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

const hiTypeConfig = {
  observation: {
    icon: Activity,
    label: 'Observation',
    color: 'observation',
    bgColor: 'bg-observation-light',
    borderColor: 'border-observation',
  },
  condition: {
    icon: Heart,
    label: 'Condition',
    color: 'condition',
    bgColor: 'bg-condition-light',
    borderColor: 'border-condition',
  },
  procedure: {
    icon: Scissors,
    label: 'Procedure',
    color: 'procedure',
    bgColor: 'bg-procedure-light',
    borderColor: 'border-procedure',
  },
  medication: {
    icon: Pill,
    label: 'Medication',
    color: 'medication',
    bgColor: 'bg-medication-light',
    borderColor: 'border-medication',
  },
  diagnostic: {
    icon: FileText,
    label: 'Diagnostic Report',
    color: 'diagnostic',
    bgColor: 'bg-diagnostic-light',
    borderColor: 'border-diagnostic',
  },
  encounter: {
    icon: Calendar,
    label: 'Encounter',
    color: 'encounter',
    bgColor: 'bg-encounter-light',
    borderColor: 'border-encounter',
  },
  allergy: {
    icon: AlertTriangle,
    label: 'Allergy/Intolerance',
    color: 'allergy',
    bgColor: 'bg-allergy-light',
    borderColor: 'border-allergy',
  },
};

const statusColors = {
  active: 'bg-medication text-white',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
  'in-progress': 'bg-primary text-primary-foreground',
};

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-procedure text-white',
  high: 'bg-condition text-white',
  urgent: 'bg-allergy text-white',
};

interface TimelineItemProps {
  entry: TimelineEntry;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ entry, isLast }) => {
  const config = hiTypeConfig[entry.type];
  const Icon = config.icon;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const formattedDate = formatDate(entry.date);

  return (
    <div className="relative flex items-start space-x-4 pb-8">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-timeline-line"></div>
      )}
      
      {/* Date Column */}
      <div className="flex-shrink-0 w-16 text-right">
        <div className="text-sm font-semibold text-foreground">{formattedDate.day}</div>
        <div className="text-xs text-muted-foreground">{formattedDate.month}</div>
        <div className="text-xs text-muted-foreground">{formattedDate.year}</div>
      </div>
      
      {/* Timeline Dot */}
      <div className={`flex-shrink-0 w-3 h-3 rounded-full border-2 ${config.borderColor} bg-timeline-dot mt-1`}></div>
      
      {/* Content */}
      <div className="flex-grow min-w-0">
        <Card className={`${config.bgColor} border-l-4 ${config.borderColor}`}>
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon className={`h-4 w-4 text-${config.color}`} />
                <Badge variant="outline" className={`text-${config.color} border-${config.color}`}>
                  {config.label}
                </Badge>
                {entry.status && (
                  <Badge className={statusColors[entry.status]}>
                    {entry.status.replace('-', ' ')}
                  </Badge>
                )}
                {entry.priority && (
                  <Badge className={priorityColors[entry.priority]}>
                    {entry.priority}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formattedDate.time}
              </div>
            </div>
            
            {/* Title and Description */}
            <h3 className="font-medium text-foreground mb-1">{entry.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
            
            {/* Practitioner Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Dr. {entry.practitioner}</span>
              <span>{entry.institution}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface PatientTimelineProps {
  entries: TimelineEntry[];
  patientName?: string;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ 
  entries, 
  patientName = "John Doe" 
}) => {
  // Sort entries by date (most recent first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalEntries = sortedEntries.length;
  const typeDistribution = sortedEntries.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + 1;
    return acc;
  }, {} as Record<HIType, number>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Patient Timeline - {patientName}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>{totalEntries} total entries</span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
        
        {/* Type Summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(typeDistribution).map(([type, count]) => {
            const config = hiTypeConfig[type as HIType];
            return (
              <Badge 
                key={type} 
                variant="outline" 
                className={`text-${config.color} border-${config.color}`}
              >
                {config.label}: {count}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sortedEntries.map((entry, index) => (
          <TimelineItem 
            key={entry.id} 
            entry={entry} 
            isLast={index === sortedEntries.length - 1}
          />
        ))}
      </div>
    </div>
  );
};