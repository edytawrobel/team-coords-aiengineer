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

export const exportToPDF = (sessions: Session[], team: TeamMember[], attendance: Attendance[]) => {
  const content = document.createElement('div');
  content.style.padding = '20px';
  content.style.fontFamily = 'Arial, sans-serif';

  // Add title
  const title = document.createElement('h1');
  title.textContent = 'Conference Schedule';
  title.style.marginBottom = '20px';
  content.appendChild(title);

  // Group sessions by day
  const days = [1, 2, 3];
  days.forEach(day => {
    const dayTitle = document.createElement('h2');
    dayTitle.textContent = `Day ${day} (June ${day + 2})`;
    dayTitle.style.marginTop = '20px';
    dayTitle.style.marginBottom = '10px';
    content.appendChild(dayTitle);

    const daySessions = sessions
      .filter(s => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    daySessions.forEach(session => {
      const attendees = getMembersAttendingSession(session.id, attendance, team);
      
      const sessionDiv = document.createElement('div');
      sessionDiv.style.marginBottom = '15px';
      sessionDiv.style.padding = '10px';
      sessionDiv.style.border = '1px solid #eee';
      sessionDiv.style.borderRadius = '4px';

      sessionDiv.innerHTML = `
        <div style="font-weight: bold">${session.startTime} - ${session.endTime}</div>
        <div style="font-size: 16px; margin: 5px 0">${session.title}</div>
        <div style="color: #666">
          ${session.track} • ${session.room}<br>
          Speaker: ${session.speaker.name} (${session.speaker.company})
        </div>
        <div style="margin-top: 5px; font-style: italic">
          Team members attending: ${attendees.map(m => m.name).join(', ') || 'None'}
        </div>
      `;

      content.appendChild(sessionDiv);
    });
  });

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Conference Schedule</title>
        </head>
        <body>
          ${content.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};