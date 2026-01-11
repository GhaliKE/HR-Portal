document.addEventListener('DOMContentLoaded', () => {

  let employees = JSON.parse(localStorage.getItem('employees')) || [];
  let editIndex = null;

  const form = document.getElementById('employeeForm');
  const list = document.getElementById('employeeList');
  const search = document.getElementById('search');
  const deptSelect = document.getElementById('department');
  const importBtn = document.getElementById('importRandomBtn');

  function refreshDashboardSafely() {
    if (typeof window.refreshDashboard === 'function') {
      window.refreshDashboard();
    }
  }

  // Update department dropdown
  function updateDeptDropdown() {
    const departments = JSON.parse(localStorage.getItem('departments')) || [];
    deptSelect.innerHTML = '<option value="">Sélectionner un département</option>';
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept.name;
      option.textContent = dept.name;
      deptSelect.appendChild(option);
    });
  }

  function renderEmployees(data = employees) {
    list.innerHTML = '';
    if (data.length === 0) {
      list.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--muted);">Aucun employé trouvé</td></tr>';
      return;
    }
    data.forEach((emp, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp.nom}</td>
        <td>${emp.prenom}</td>
        <td>${emp.email}</td>
        <td>${emp.poste}</td>
        <td>${emp.department || '-'}</td>
        <td><strong>${emp.salaire.toLocaleString()} MAD</strong></td>
        <td>
          <div class="action-buttons">
            <button class="edit-btn" onclick="editEmployee(${index})"><i class='bx bx-edit'></i></button>
            <button class="delete-btn" onclick="deleteEmployee(${index})"><i class='bx bx-trash'></i></button>
          </div>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const employee = {
      id: Date.now(),
      nom: nom.value.trim(),
      prenom: prenom.value.trim(),
      email: email.value.trim(),
      poste: poste.value.trim(),
      salaire: Number(salaire.value),
      department: department.value
    };

    if (editIndex !== null) {
      employees[editIndex] = employee;
      editIndex = null;
      form.style.backgroundColor = '';
    } else {
      employees.push(employee);
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    form.reset();
    refreshDashboardSafely();
  });

  window.editEmployee = index => {
    const emp = employees[index];
    nom.value = emp.nom;
    prenom.value = emp.prenom;
    email.value = emp.email;
    poste.value = emp.poste;
    salaire.value = emp.salaire;
    department.value = emp.department || '';
    editIndex = index;
    form.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
    nom.focus();
  };

  window.deleteEmployee = index => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      employees.splice(index, 1);
      localStorage.setItem('employees', JSON.stringify(employees));
      renderEmployees();
      refreshDashboardSafely();
    }
  };

  search.addEventListener('input', () => {
    const value = search.value.toLowerCase();
    const filtered = employees.filter(emp =>
      emp.nom.toLowerCase().includes(value) ||
      emp.prenom.toLowerCase().includes(value) ||
      emp.poste.toLowerCase().includes(value) ||
      emp.email.toLowerCase().includes(value)
    );
    renderEmployees(filtered);
  });

  window.sortByName = () => {
    employees.sort((a, b) => a.nom.localeCompare(b.nom));
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    refreshDashboardSafely();
  };

  window.sortBySalary = () => {
    employees.sort((a, b) => b.salaire - a.salaire);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    refreshDashboardSafely();
  };

  window.exportEmployees = () => {
    if (employees.length === 0) {
      alert('Aucun employé à exporter');
      return;
    }
    const csv = 'Nom,Prénom,Email,Poste,Département,Salaire\n' +
      employees.map(e => `"${e.nom}","${e.prenom}","${e.email}","${e.poste}","${e.department || ''}",${e.salaire}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
  };

  async function importRandomEmployees(count = 5) {
    if (!importBtn) return;

    importBtn.disabled = true;
    const originalText = importBtn.innerHTML;
    importBtn.innerHTML = "<i class='bx bx-loader bx-spin'></i> Importation...";

    try {
      const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=fr,us,gb&inc=name,email,login`);
      if (!response.ok) {
        throw new Error('Échec de la récupération des profils');
      }

      const data = await response.json();
      const availableDepts = JSON.parse(localStorage.getItem('departments')) || [];
      const postes = ['Analyste', 'Chef de projet', 'Développeur', 'Designer', 'Commercial'];

      const imported = data.results.map(user => {
        const dept = availableDepts.length === 0 ? '' : availableDepts[Math.floor(Math.random() * availableDepts.length)].name;
        const poste = postes[Math.floor(Math.random() * postes.length)];
        const salaire = Math.floor(24000 + Math.random() * 26000);

        return {
          id: Date.now() + Math.floor(Math.random() * 10000),
          nom: user.name.last,
          prenom: user.name.first,
          email: user.email,
          poste,
          salaire,
          department: dept
        };
      });

      employees = [...employees, ...imported];
      localStorage.setItem('employees', JSON.stringify(employees));
      renderEmployees();
      refreshDashboardSafely();
    } catch (error) {
      console.error(error);
      alert('Impossible d\'importer des profils pour le moment.');
    } finally {
      importBtn.disabled = false;
      importBtn.innerHTML = originalText;
    }
  }

  if (importBtn) {
    importBtn.addEventListener('click', () => importRandomEmployees(5));
  }

  updateDeptDropdown();
  renderEmployees();
  refreshDashboardSafely();
});


