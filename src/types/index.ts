export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: Speaker;
  track: string;
  room: string;
  day: number; // 1, 2, or 3 for June 3-5
  startTime: string;
  endTime: string;
  date: string;
  isCustom?: boolean;
  createdBy?: string; // ID of the team member who created the manual session
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
  company: string;
  title: string;
  image: string;
}

export interface Attendance {
  sessionId: string;
  memberId: string;
}

export type Day = 1 | 2 | 3;

export interface AppState {
  team: TeamMember[];
  sessions: Session[];
  attendance: Attendance[];
}