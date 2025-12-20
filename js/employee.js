document.addEventListener('DOMContentLoaded', function () {

  let employees = JSON.parse(localStorage.getItem('employees')) || [];

  const form = document.getElementById('employeeForm');
  const list = document.getElementById('employeeList');

  function renderEmployees() {
    list.innerHTML = '';

    employees.forEach(emp => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${emp.nom}</td>
        <td>${emp.prenom}</td>
        <td>${emp.email}</td>
        <td>${emp.poste}</td>
        <td>${emp.salaire}</td>
      `;

      list.appendChild(row);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const employee = {
      id: Date.now(),
      nom: document.getElementById('nom').value,
      prenom: document.getElementById('prenom').value,
      email: document.getElementById('email').value,
      poste: document.getElementById('poste').value,
      salaire: document.getElementById('salaire').value
    };

    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));

    renderEmployees();
    form.reset();
  });

  // 👇 IMPORTANT : afficher les données sauvegardées au chargement
  renderEmployees();
});