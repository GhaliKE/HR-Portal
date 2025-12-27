document.addEventListener('DOMContentLoaded', () => {

  let employees = JSON.parse(localStorage.getItem('employees')) || [];
  let editIndex = null;

  const form = document.getElementById('employeeForm');
  const list = document.getElementById('employeeList');
  const search = document.getElementById('search');

  function renderEmployees(data = employees) {
    list.innerHTML = '';
    data.forEach((emp, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp.nom}</td>
        <td>${emp.prenom}</td>
        <td>${emp.email}</td>
        <td>${emp.poste}</td>
        <td>${emp.salaire}</td>
        <td>
          <button onclick="editEmployee(${index})">✏️</button>
          <button onclick="deleteEmployee(${index})">🗑️</button>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const employee = {
      id: Date.now(),
      nom: nom.value,
      prenom: prenom.value,
      email: email.value,
      poste: poste.value,
      salaire: salaire.value
    };

    if (editIndex !== null) {
      employees[editIndex] = employee;
      editIndex = null;
    } else {
      employees.push(employee);
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    form.reset();
  });

  window.editEmployee = index => {
    const emp = employees[index];
    nom.value = emp.nom;
    prenom.value = emp.prenom;
    email.value = emp.email;
    poste.value = emp.poste;
    salaire.value = emp.salaire;
    editIndex = index;
  };

  window.deleteEmployee = index => {
    if (confirm("Supprimer cet employé ?")) {
      employees.splice(index, 1);
      localStorage.setItem('employees', JSON.stringify(employees));
      renderEmployees();
    }
  };

  search.addEventListener('input', () => {
    const value = search.value.toLowerCase();
    const filtered = employees.filter(emp =>
      emp.nom.toLowerCase().includes(value) ||
      emp.prenom.toLowerCase().includes(value) ||
      emp.poste.toLowerCase().includes(value)
    );
    renderEmployees(filtered);
  });

  window.sortByName = () => {
    employees.sort((a, b) => a.nom.localeCompare(b.nom));
    renderEmployees();
  };

  window.sortBySalary = () => {
    employees.sort((a, b) => a.salaire - b.salaire);
    renderEmployees();
  };

  renderEmployees();
});

