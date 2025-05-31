import { utils, writeFile } from 'xlsx';
import { Session, TeamMember, Attendance } from '../types';
import { getMembersAttendingSession } from './helpers';

export const exportToExcel = (sessions: Session[], team: TeamMember[], attendance: Attendance[]) => {
  const data = sessions
    .sort((a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime))
    .map(session => {
      const attendees = getMembersAttendingSession(session.id, attendance, team);
      return {
        'Day': `Day ${session.day} (June ${session.day + 2})`,
        'Time': `${session.startTime} - ${session.endTime}`,
        'Title': session.title,
        'Track': session.track,
        'Room': session.room,
        'Speaker': `${session.speaker.name} (${session.speaker.company})`,
        'Team Members Attending': attendees.map(m => m.name).join(', ') || 'None'
      };
    });

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Schedule');
  writeFile(wb, 'conference-schedule.xlsx');
};