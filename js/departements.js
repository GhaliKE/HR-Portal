document.addEventListener('DOMContentLoaded', () => {

  let departments = JSON.parse(localStorage.getItem('departments')) || [];

  const form = document.getElementById('deptForm');
  const list = document.getElementById('deptList');

  function refreshDashboardSafely() {
    if (typeof window.refreshDashboard === 'function') {
      window.refreshDashboard();
    }
  }

  function renderDepartments() {
    list.innerHTML = '';
    if (departments.length === 0) {
      list.innerHTML = '<li style="text-align: center; color: var(--muted);">Aucun département</li>';
      return;
    }
    departments.forEach((dept, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${dept.name}</strong>
          ${dept.description ? `<p style="margin-top: 6px; color: var(--muted); font-size: 13px;">${dept.description}</p>` : ''}
        </div>
        <button class="delete-btn" onclick="deleteDept(${index})" title="Supprimer"><i class='bx bx-trash'></i></button>
      `;
      list.appendChild(li);
    });
    updateDeptCount();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const newDept = {
      name: deptName.value.trim(),
      description: deptDesc.value.trim()
    };
    
    if (departments.some(d => d.name.toLowerCase() === newDept.name.toLowerCase())) {
      alert('Ce département existe déjà !');
      return;
    }

    departments.push(newDept);
    localStorage.setItem('departments', JSON.stringify(departments));
    renderDepartments();
    form.reset();
    updateEmployeeDeptDropdown();
    refreshDashboardSafely();
  });

  window.deleteDept = index => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le département "${departments[index].name}" ?`)) {
      departments.splice(index, 1);
      localStorage.setItem('departments', JSON.stringify(departments));
      renderDepartments();
      updateEmployeeDeptDropdown();
      refreshDashboardSafely();
    }
  };

  function updateDeptCount() {
    document.getElementById('kpiDepts').textContent = departments.length;
  }

  function updateEmployeeDeptDropdown() {
    const deptSelect = document.getElementById('department');
    if (deptSelect) {
      deptSelect.innerHTML = '<option value="">Sélectionner un département</option>';
      departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.name;
        option.textContent = dept.name;
        deptSelect.appendChild(option);
      });
    }
  }

  renderDepartments();
  refreshDashboardSafely();
});

