// Attendance Management
class AttendanceManager {
  constructor() {
    this.attendanceData = JSON.parse(localStorage.getItem('attendance')) || [];
    this.init();
  }

  init() {
    this.setCurrentDate();
    this.updateAttendanceSummary();
    this.renderAttendanceList();
  }

  setCurrentDate() {
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  markAttendance() {
    const date = document.getElementById('attendanceDate').value;
    if (!date) {
      alert('Veuillez sélectionner une date');
      return;
    }

    // Generate mock attendance data for all employees
    if (window.hrPortal && window.hrPortal.employees) {
      window.hrPortal.employees.forEach(employee => {
        const existingRecord = this.attendanceData.find(
          record => record.employeeId === employee.id && record.date === date
        );

        if (!existingRecord) {
          const isPresent = Math.random() > 0.1; // 90% attendance rate
          const arrivalTime = isPresent ? this.generateArrivalTime() : null;
          const departureTime = isPresent ? this.generateDepartureTime() : null;
          const status = this.determineStatus(arrivalTime);

          this.attendanceData.push({
            id: Date.now() + Math.random(),
            employeeId: employee.id,
            employeeName: `${employee.prenom} ${employee.nom}`,
            department: employee.department,
            date: date,
            arrivalTime: arrivalTime,
            departureTime: departureTime,
            status: status,
            isPresent: isPresent
          });
        }
      });

      this.saveAttendanceData();
      this.updateAttendanceSummary();
      this.renderAttendanceList();
      
      if (window.hrPortal) {
        window.hrPortal.showNotification('Présences mises à jour!', 'success');
      }
    }
  }

  generateArrivalTime() {
    const baseTime = 8 * 60; // 8:00 AM in minutes
    const variation = Math.random() * 120 - 30; // -30 to +90 minutes
    const totalMinutes = baseTime + variation;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  generateDepartureTime() {
    const baseTime = 17 * 60; // 5:00 PM in minutes
    const variation = Math.random() * 60; // 0 to +60 minutes
    const totalMinutes = baseTime + variation;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  determineStatus(arrivalTime) {
    if (!arrivalTime) return 'Absent';
    
    const [hours, minutes] = arrivalTime.split(':').map(Number);
    const arrivalMinutes = hours * 60 + minutes;
    const standardStart = 8 * 60 + 30; // 8:30 AM

    if (arrivalMinutes <= standardStart) return 'Présent';
    if (arrivalMinutes <= standardStart + 30) return 'En retard';
    return 'Très en retard';
  }

  updateAttendanceSummary() {
    const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().split('T')[0];
    const todayRecords = this.attendanceData.filter(record => record.date === date);
    
    const presentCount = todayRecords.filter(record => record.isPresent).length;
    const absentCount = todayRecords.filter(record => !record.isPresent).length;
    const lateCount = todayRecords.filter(record => 
      record.status === 'En retard' || record.status === 'Très en retard'
    ).length;

    const presentElement = document.getElementById('presentCount');
    const absentElement = document.getElementById('absentCount');
    const lateElement = document.getElementById('lateCount');

    if (presentElement) presentElement.textContent = presentCount;
    if (absentElement) absentElement.textContent = absentCount;
    if (lateElement) lateElement.textContent = lateCount;
  }

  renderAttendanceList() {
    const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().split('T')[0];
    const todayRecords = this.attendanceData.filter(record => record.date === date);
    const tbody = document.getElementById('attendanceList');
    
    if (!tbody) return;

    tbody.innerHTML = todayRecords.map(record => `
      <tr>
        <td>${record.employeeName}</td>
        <td>${record.department}</td>
        <td>${record.arrivalTime || '-'}</td>
        <td>${record.departureTime || '-'}</td>
        <td>
          <span class="status-badge ${record.status.toLowerCase().replace(' ', '-')}">
            ${record.status}
          </span>
        </td>
        <td>
          <button onclick="editAttendance(${record.id})" class="btn-sm btn-primary">
            <i class='bx bx-edit'></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  saveAttendanceData() {
    localStorage.setItem('attendance', JSON.stringify(this.attendanceData));
  }
}

// Global functions
function markAttendance() {
  if (window.attendanceManager) {
    window.attendanceManager.markAttendance();
  }
}

function editAttendance(recordId) {
  if (window.hrPortal) {
    window.hrPortal.showNotification('Fonction d\'édition en cours de développement', 'info');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.attendanceManager = new AttendanceManager();
});
