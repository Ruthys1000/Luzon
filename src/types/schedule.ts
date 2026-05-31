export interface SlotData {
  time: string;
  lesson_number?: number;
  topic: string;
  activity_type: string;
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
  start_time: string;
  end_time: string;
  content_type?: "topic" | "course" | "my_content";
  course_url?: string;
  my_content_description?: string;
  include_team_sessions?: string;
  zoom_sessions?: string;
  previous_days?: string;
  constraints?: string;
  material_links?: string;
  refinement_qa?: { question: string; answer: string }[];
}
