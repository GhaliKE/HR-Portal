document.addEventListener('DOMContentLoaded', () => {

  const employees = JSON.parse(localStorage.getItem('employees')) || [];

  // KPI 1 : total employés
  document.getElementById('kpiEmployees').textContent = employees.length;

  // KPI 2 : salaire moyen
  let avgSalary = 0;
  if (employees.length > 0) {
    const total = employees.reduce((sum, emp) => sum + Number(emp.salaire), 0);
    avgSalary = Math.round(total / employees.length);
  }
  document.getElementById('kpiSalary').textContent = avgSalary + " MAD";

  // Chart.js : salaires par employé
  const ctx = document.getElementById('salaryChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: employees.map(e => e.nom),
      datasets: [{
        label: 'Salaire',
        data: employees.map(e => e.salaire)
      }]
    }
  });

  // API RandomUser
  fetch('https://randomuser.me/api/?results=10')
    .then(res => res.json())
    .then(data => {
      document.getElementById('kpiApi').textContent = data.results.length;
    })
    .catch(err => console.error(err));

});
