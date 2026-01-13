const dashboardState = {
  salaryChart: null,
  deptChart: null,
  postChart: null,
  evolutionChart: null,
  staffEvolutionChart: null
};
function getStoredData() {
  const employees = JSON.parse(localStorage.getItem('employees')) || [];
  const departments = JSON.parse(localStorage.getItem('departments')) || [];
  return { employees, departments };
}
function buildStats() {
  const { employees, departments } = getStoredData();
  let totalSalary = 0;
  let maxSalary = 0;
  let minSalary = employees.length ? Infinity : 0;
  const posts = new Set();
  employees.forEach(emp => {
    const salary = Number(emp.salaire) || 0;
    totalSalary += salary;
    maxSalary = Math.max(maxSalary, salary);
    minSalary = Math.min(minSalary, salary);
    posts.add(emp.poste);
  });
  const avgSalary = employees.length ? Math.round(totalSalary / employees.length) : 0;
  const salaryLabels = employees.map(e => `${e.prenom} ${e.nom}`);
  const salaryValues = employees.map(e => Number(e.salaire) || 0);
  const deptCounts = employees.reduce((acc, emp) => {
    const key = emp.department || 'Non assigné';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const postTotals = {};
  const postCounts = {};
  employees.forEach(emp => {
    const post = emp.poste || 'Poste';
    postTotals[post] = (postTotals[post] || 0) + (Number(emp.salaire) || 0);
    postCounts[post] = (postCounts[post] || 0) + 1;
  });
  const postLabels = Object.keys(postTotals);
  const postAverages = postLabels.map(label => {
    return postCounts[label] ? Math.round(postTotals[label] / postCounts[label]) : 0;
  });
  return {
    employees,
    departments,
    kpi: {
      employees: employees.length,
      departments: departments.length,
      posts: posts.size,
      avgSalary,
      totalSalary,
      maxSalary,
      minSalary: minSalary === Infinity ? 0 : minSalary
    },
    charts: {
      salaryLabels,
      salaryValues,
      deptLabels: Object.keys(deptCounts),
      deptValues: Object.values(deptCounts),
      postLabels,
      postAverages
    }
  };
}
function renderKPIs(kpi) {
  document.getElementById('kpiEmployees').textContent = kpi.employees;
  document.getElementById('kpiSalary').textContent = `${kpi.avgSalary.toLocaleString()} MAD`;
  document.getElementById('kpiPosts').textContent = kpi.posts;
  document.getElementById('kpiDepts').textContent = kpi.departments;
  document.getElementById('reportMaxSalary').textContent = `${kpi.maxSalary.toLocaleString()} MAD`;
  document.getElementById('reportMinSalary').textContent = `${kpi.minSalary.toLocaleString()} MAD`;
  document.getElementById('reportTotalSalary').textContent = `${kpi.totalSalary.toLocaleString()} MAD`;
}
function destroyChart(chartRef) {
  if (chartRef) {
    chartRef.destroy();
  }
}
function renderSalaryChart({ salaryLabels, salaryValues }) {
  const ctx = document.getElementById('salaryChart');
  if (!ctx) return;
  destroyChart(dashboardState.salaryChart);
  if (salaryValues.length === 0) {
    dashboardState.salaryChart = null;
    return;
  }
  dashboardState.salaryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: salaryLabels,
      datasets: [{
        label: 'Salaire (MAD)',
        data: salaryValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#cbd5e1', font: { size: 12 } }
        }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(71, 85, 105, 0.3)' } },
        x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(71, 85, 105, 0.3)' } }
      }
    }
  });
}
function renderDeptChart({ deptLabels, deptValues }) {
  const ctx = document.getElementById('deptChart');
  if (!ctx) return;
  destroyChart(dashboardState.deptChart);
  if (deptValues.length === 0) {
    dashboardState.deptChart = null;
    return;
  }
  dashboardState.deptChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: deptLabels,
      datasets: [{
        data: deptValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#cbd5e1', font: { size: 12 }, padding: 15 }
        }
      }
    }
  });
}
function renderPostChart({ postLabels, postAverages }) {
  const ctx = document.getElementById('postChart');
  if (!ctx) return;
  destroyChart(dashboardState.postChart);
  if (postAverages.length === 0) {
    dashboardState.postChart = null;
    return;
  }
  dashboardState.postChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: postLabels,
      datasets: [{
        label: 'Salaire moyen par poste (MAD)',
        data: postAverages,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(139, 92, 246, 1)'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#cbd5e1', font: { size: 12 } }
        }
      },
      scales: {
        x: { beginAtZero: true, ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(71, 85, 105, 0.3)' } },
        y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(71, 85, 105, 0.3)' } }
      }
    }
  });
}

function renderEvolutionChart() {
  const ctx = document.getElementById('evolutionChart');
  if (!ctx) return;
  destroyChart(dashboardState.evolutionChart);

  const employees = JSON.parse(localStorage.getItem('employees')) || [];
  const last30Days = getLast30Days();
  
  const dailyCounts = last30Days.map(date => {
    return employees.filter(emp => {
      if (!emp.dateEmbauche) return false;
      return emp.dateEmbauche <= date;
    }).length;
  });

  dashboardState.evolutionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last30Days.map(d => formatEvolutionDate(d)),
      datasets: [{
        label: 'Nombre d\'employés',
        data: dailyCounts,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
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

function getLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function formatEvolutionDate(dateString) {
  const date = new Date(dateString);
  return (date.getDate()) + ' ' + ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][date.getMonth()];
}

function renderStaffEvolutionChart() {
  const ctx = document.getElementById('staffEvolutionChart');
  if (!ctx) return;
  destroyChart(dashboardState.staffEvolutionChart);

  const employees = JSON.parse(localStorage.getItem('employees')) || [];
  const last30Days = getLast30Days();
  
  const dailyCounts = last30Days.map(date => {
    return employees.filter(emp => {
      if (!emp.dateEmbauche) return false;
      return emp.dateEmbauche <= date;
    }).length;
  });

  dashboardState.staffEvolutionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last30Days.map(d => formatEvolutionDate(d)),
      datasets: [{
        label: 'Évolution des effectifs',
        data: dailyCounts,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
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
          ticks: { color: '#cbd5e1', stepSize: 1 },
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

function renderDashboard() {
  const { kpi, charts } = buildStats();
  renderKPIs(kpi);
  renderSalaryChart(charts);
  renderDeptChart(charts);
  renderPostChart(charts);
  renderEvolutionChart();
  renderStaffEvolutionChart();
}
window.refreshDashboard = () => {
  renderDashboard();
};
document.addEventListener('DOMContentLoaded', () => {
  refreshDashboard();
});