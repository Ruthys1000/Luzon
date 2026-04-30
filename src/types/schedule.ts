export interface SlotData {
  time: string;
  lesson_number?: number;
  topic: string;
  activity_type: string;
  equipment?: string;
  instructor_notes: string;
}

export interface SupplementaryItem {
  title: string;
  description: string;
}

export interface DayData {
  day: string;
  slots: SlotData[];
  supplementary: {
    video: SupplementaryItem;
    article: SupplementaryItem;
    activity: SupplementaryItem;
  };
}

export interface ScheduleResult {
  rationale: string;
  days: DayData[];
  whatsapp_message: string;
  questions: string[];
}

export interface ScheduleInput {
  goals: string;
  days: number;
  start_time: string;
  end_time: string;
  include_team_sessions?: string;
  zoom_morning?: string;
  zoom_end?: string;
  constraints?: string;
  notes?: string;
  material_links?: string;
}
