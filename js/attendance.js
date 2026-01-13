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
    if (window.hrPortal && window.hrPortal.employees) {
      window.hrPortal.employees.forEach(employee => {
        const existingRecord = this.attendanceData.find(
          record => record.employeeId === employee.id && record.date === date
        );
        if (!existingRecord) {
          const isPresent = Math.random() > 0.1; 
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
    const baseTime = 8 * 60; 
    const variation = Math.random() * 120 - 30; 
    const totalMinutes = baseTime + variation;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  generateDepartureTime() {
    const baseTime = 17 * 60; 
    const variation = Math.random() * 60; 
    const totalMinutes = baseTime + variation;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  determineStatus(arrivalTime) {
    if (!arrivalTime) return 'Absent';
    const [hours, minutes] = arrivalTime.split(':').map(Number);
    const arrivalMinutes = hours * 60 + minutes;
    const standardStart = 8 * 60 + 30; 
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

let attendanceChartInstance = null;

function renderAttendanceChart() {
  const ctx = document.getElementById('attendanceChart');
  if (!ctx) return;

  if (attendanceChartInstance) {
    attendanceChartInstance.destroy();
  }

  const attendanceData = JSON.parse(localStorage.getItem('attendance')) || [];
  const last7Days = getLast7Days();
  
  const dailyStats = last7Days.map(date => {
    const dayRecords = attendanceData.filter(r => r.date === date);
    return {
      date: formatDate(date),
      present: dayRecords.filter(r => r.isPresent).length,
      absent: dayRecords.filter(r => !r.isPresent).length,
      late: dayRecords.filter(r => r.status === 'En retard' || r.status === 'Très en retard').length
    };
  });

  attendanceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dailyStats.map(d => d.date),
      datasets: [
        {
          label: 'Présents',
          data: dailyStats.map(d => d.present),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Absents',
          data: dailyStats.map(d => d.absent),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'En retard',
          data: dailyStats.map(d => d.late),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: 'rgb(245, 158, 11)',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#cbd5e1',
            font: { size: 12 },
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(71, 85, 105, 0.3)' }
        },
        x: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(71, 85, 105, 0.3)' }
        }
      }
    }
  });
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()] + ' ' + date.getDate();
}

function refreshChart(chartId) {
  if (chartId === 'attendanceChart') {
    renderAttendanceChart();
  } else if (chartId === 'salaryChart' || chartId === 'deptChart' || chartId === 'evolutionChart' || chartId === 'postChart') {
    if (typeof window.refreshDashboard === 'function') {
      window.refreshDashboard();
    }
  } else if (chartId === 'staffEvolutionChart') {
    if (typeof renderStaffEvolutionChart === 'function') {
      renderStaffEvolutionChart();
    } else if (typeof window.refreshDashboard === 'function') {
      window.refreshDashboard();
    }
  }
}

function exportChart(chartId) {
  const canvas = document.getElementById(chartId);
  if (!canvas) {
    console.error('Chart canvas not found:', chartId);
    return;
  }
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${chartId}-${new Date().toISOString().split('T')[0]}.png`;
  link.click();
}

document.addEventListener('DOMContentLoaded', () => {
  window.attendanceManager = new AttendanceManager();
  renderAttendanceChart();
});