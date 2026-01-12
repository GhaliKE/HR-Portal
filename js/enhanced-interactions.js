function toggleEmployeeForm() {
  const form = document.getElementById('employeeForm');
  const button = document.querySelector('.toggle-btn');
  if (form.style.display === 'none' || !form.style.display) {
    form.style.display = 'block';
    form.style.animation = 'slideDown 0.3s ease';
    button.innerHTML = '<i class="bx bx-chevron-up"></i>';
  } else {
    form.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      form.style.display = 'none';
    }, 300);
    button.innerHTML = '<i class="bx bx-chevron-down"></i>';
  }
}
function resetEmployeeForm() {
  const form = document.getElementById('employeeForm');
  if (form) {
    form.reset();
    const resetBtn = event.target;
    const originalText = resetBtn.innerHTML;
    resetBtn.innerHTML = '<i class="bx bx-check"></i> Réinitialisé';
    resetBtn.classList.add('animate-bounce');
    setTimeout(() => {
      resetBtn.innerHTML = originalText;
      resetBtn.classList.remove('animate-bounce');
    }, 1500);
  }
}
function toggleFilters() {
  const panel = document.getElementById('filtersPanel');
  const button = event.target;
  if (panel) {
    panel.classList.toggle('show');
    if (panel.classList.contains('show')) {
      button.innerHTML = '<i class="bx bx-filter-alt"></i> Masquer Filtres';
      button.classList.add('active');
    } else {
      button.innerHTML = '<i class="bx bx-filter"></i> Filtres';
      button.classList.remove('active');
    }
  }
}
function applyFilters() {
  if (window.hrPortal) {
    const filters = {
      department: document.getElementById('filterDepartment')?.value || '',
      status: document.getElementById('filterStatus')?.value || '',
      salaryMin: parseFloat(document.getElementById('filterSalaryMin')?.value) || 0,
      salaryMax: parseFloat(document.getElementById('filterSalaryMax')?.value) || Infinity
    };
    window.hrPortal.filters = filters;
    window.hrPortal.currentPage = 1;
    renderFilteredEmployees(filters);
    window.hrPortal.showNotification('Filtres appliqués', 'success');
  }
}
function clearFilters() {
  document.getElementById('filterDepartment').value = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterSalaryMin').value = '';
  document.getElementById('filterSalaryMax').value = '';
  if (window.hrPortal) {
    window.hrPortal.filters = {};
    window.hrPortal.currentPage = 1;
    renderFilteredEmployees({});
    window.hrPortal.showNotification('Filtres effacés', 'info');
  }
}
function renderFilteredEmployees(filters) {
  if (!window.hrPortal) return;
  let filteredEmployees = window.hrPortal.employees.filter(emp => {
    const matchesDept = !filters.department || emp.department === filters.department;
    const matchesStatus = !filters.status || emp.statut === filters.status;
    const matchesSalaryMin = emp.salaire >= filters.salaryMin;
    const matchesSalaryMax = emp.salaire <= filters.salaryMax;
    return matchesDept && matchesStatus && matchesSalaryMin && matchesSalaryMax;
  });
  renderEmployeeTable(filteredEmployees);
  updatePagination(filteredEmployees.length);
}
function renderEmployeeTable(employees) {
  const tbody = document.getElementById('employeeList');
  if (!tbody) return;
  const startIndex = (window.hrPortal.currentPage - 1) * window.hrPortal.itemsPerPage;
  const endIndex = startIndex + window.hrPortal.itemsPerPage;
  const pageEmployees = employees.slice(startIndex, endIndex);
  tbody.innerHTML = pageEmployees.map(emp => `
    <tr data-employee-id="${emp.id}">
      <td>
        <input type="checkbox" class="employee-checkbox" value="${emp.id}" onchange="updateBulkActions()">
      </td>
      <td>
        <img src="https:
             alt="${emp.prenom} ${emp.nom}" class="employee-photo">
      </td>
      <td><strong>${emp.prenom} ${emp.nom}</strong></td>
      <td>${emp.email}</td>
      <td>${emp.poste}</td>
      <td>${emp.department}</td>
      <td><strong>${emp.salaire.toLocaleString()} Dh</strong></td>
      <td>
        <span class="status-badge ${emp.statut?.toLowerCase() || 'actif'}">
          ${emp.statut || 'Actif'}
        </span>
      </td>
      <td>${emp.dateEmbauche || 'N/A'}</td>
      <td>
        <div class="action-buttons">
          <button onclick="viewEmployee(${emp.id})" class="btn-sm btn-primary" title="Voir détails">
            <i class="bx bx-eye"></i>
          </button>
          <button onclick="editEmployee(${emp.id})" class="btn-sm btn-secondary" title="Modifier">
            <i class="bx bx-edit"></i>
          </button>
          <button onclick="deleteEmployee(${emp.id})" class="btn-sm btn-danger" title="Supprimer">
            <i class="bx bx-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}
function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / window.hrPortal.itemsPerPage);
  const pageInfo = document.getElementById('pageInfo');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (pageInfo) {
    pageInfo.textContent = `Page ${window.hrPortal.currentPage} sur ${totalPages}`;
  }
  if (prevBtn) {
    prevBtn.disabled = window.hrPortal.currentPage <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = window.hrPortal.currentPage >= totalPages;
  }
}
function previousPage() {
  if (window.hrPortal && window.hrPortal.currentPage > 1) {
    window.hrPortal.currentPage--;
    applyFilters();
  }
}
function nextPage() {
  const totalItems = getFilteredEmployees().length;
  const totalPages = Math.ceil(totalItems / window.hrPortal.itemsPerPage);
  if (window.hrPortal && window.hrPortal.currentPage < totalPages) {
    window.hrPortal.currentPage++;
    applyFilters();
  }
}
function getFilteredEmployees() {
  if (!window.hrPortal) return [];
  const filters = window.hrPortal.filters || {};
  return window.hrPortal.employees.filter(emp => {
    const matchesDept = !filters.department || emp.department === filters.department;
    const matchesStatus = !filters.status || emp.statut === filters.status;
    const matchesSalaryMin = emp.salaire >= (filters.salaryMin || 0);
    const matchesSalaryMax = emp.salaire <= (filters.salaryMax || Infinity);
    return matchesDept && matchesStatus && matchesSalaryMin && matchesSalaryMax;
  });
}
function toggleSelectAll() {
  const selectAll = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.employee-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAll.checked;
  });
  updateBulkActions();
}
function updateBulkActions() {
  const checkboxes = document.querySelectorAll('.employee-checkbox:checked');
  const bulkActions = document.getElementById('bulkActions');
  const selectedCount = document.getElementById('selectedCount');
  if (checkboxes.length > 0) {
    bulkActions.style.display = 'block';
    selectedCount.textContent = `${checkboxes.length} employé(s) sélectionné(s)`;
  } else {
    bulkActions.style.display = 'none';
  }
}
function bulkDelete() {
  const checkboxes = document.querySelectorAll('.employee-checkbox:checked');
  const employeeIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${employeeIds.length} employé(s) ?`)) {
    if (window.hrPortal) {
      window.hrPortal.employees = window.hrPortal.employees.filter(emp => !employeeIds.includes(emp.id));
      window.hrPortal.saveData();
      applyFilters();
      updateBulkActions();
      window.hrPortal.showNotification(`${employeeIds.length} employé(s) supprimé(s)`, 'success');
    }
  }
}
function bulkExport() {
  const checkboxes = document.querySelectorAll('.employee-checkbox:checked');
  const employeeIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
  if (window.hrPortal) {
    const selectedEmployees = window.hrPortal.employees.filter(emp => employeeIds.includes(emp.id));
    const data = JSON.stringify(selectedEmployees, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-selection-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.hrPortal.showNotification(`${employeeIds.length} employé(s) exporté(s)`, 'success');
  }
}
function bulkUpdateStatus() {
  const checkboxes = document.querySelectorAll('.employee-checkbox:checked');
  const employeeIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
  const newStatus = prompt('Nouveau statut (Actif/Inactif/Congé):');
  if (newStatus && ['Actif', 'Inactif', 'Congé'].includes(newStatus)) {
    if (window.hrPortal) {
      window.hrPortal.employees.forEach(emp => {
        if (employeeIds.includes(emp.id)) {
          emp.statut = newStatus;
        }
      });
      window.hrPortal.saveData();
      applyFilters();
      updateBulkActions();
      window.hrPortal.showNotification(`Statut mis à jour pour ${employeeIds.length} employé(s)`, 'success');
    }
  }
}
function viewEmployee(id) {
  const employee = window.hrPortal?.employees.find(emp => emp.id === id);
  if (employee) {
    const modal = document.getElementById('employeeModal');
    const modalBody = document.getElementById('employeeModalBody');
    modalBody.innerHTML = `
      <div class="employee-details">
        <div class="employee-header">
          <img src="https:
               alt="${employee.prenom} ${employee.nom}" class="employee-photo-large">
          <div>
            <h3>${employee.prenom} ${employee.nom}</h3>
            <p>${employee.poste}</p>
            <span class="status-badge ${employee.statut?.toLowerCase() || 'actif'}">
              ${employee.statut || 'Actif'}
            </span>
          </div>
        </div>
        <div class="employee-info-grid">
          <div class="info-item">
            <label>Email</label>
            <span>${employee.email}</span>
          </div>
          <div class="info-item">
            <label>Téléphone</label>
            <span>${employee.telephone || 'N/A'}</span>
          </div>
          <div class="info-item">
            <label>Département</label>
            <span>${employee.department}</span>
          </div>
          <div class="info-item">
            <label>Salaire</label>
            <span><strong>${employee.salaire.toLocaleString()} Dh</strong></span>
          </div>
          <div class="info-item">
            <label>Date d'embauche</label>
            <span>${employee.dateEmbauche || 'N/A'}</span>
          </div>
          <div class="info-item">
            <label>Type de contrat</label>
            <span>${employee.typeContrat || 'CDI'}</span>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('show');
  }
}
function editEmployee(id) {
  if (window.hrPortal) {
    window.hrPortal.showNotification('Fonction d\'édition en cours de développement', 'info');
  }
}
function deleteEmployee(id) {
  const employee = window.hrPortal?.employees.find(emp => emp.id === id);
  if (employee && confirm(`Êtes-vous sûr de vouloir supprimer ${employee.prenom} ${employee.nom} ?`)) {
    if (window.hrPortal) {
      window.hrPortal.employees = window.hrPortal.employees.filter(emp => emp.id !== id);
      window.hrPortal.saveData();
      applyFilters();
      window.hrPortal.showNotification(`${employee.prenom} ${employee.nom} supprimé`, 'success');
    }
  }
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}
function sortByName() {
  if (window.hrPortal) {
    window.hrPortal.employees.sort((a, b) => {
      const nameA = `${a.prenom} ${a.nom}`.toLowerCase();
      const nameB = `${b.prenom} ${b.nom}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    window.hrPortal.saveData();
    applyFilters();
    window.hrPortal.showNotification('Trié par nom', 'info');
  }
}
function sortBySalary() {
  if (window.hrPortal) {
    window.hrPortal.employees.sort((a, b) => b.salaire - a.salaire);
    window.hrPortal.saveData();
    applyFilters();
    window.hrPortal.showNotification('Trié par salaire', 'info');
  }
}
function sortByDate() {
  if (window.hrPortal) {
    window.hrPortal.employees.sort((a, b) => {
      const dateA = new Date(a.dateEmbauche || '1970-01-01');
      const dateB = new Date(b.dateEmbauche || '1970-01-01');
      return dateB - dateA;
    });
    window.hrPortal.saveData();
    applyFilters();
    window.hrPortal.showNotification('Trié par date d\'embauche', 'info');
  }
}
function exportEmployees() {
  if (window.hrPortal) {
    const data = JSON.stringify(window.hrPortal.employees, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.hrPortal.showNotification('Liste des employés exportée', 'success');
  }
}
function printEmployees() {
  window.print();
}
document.addEventListener('DOMContentLoaded', () => {
  const filtersPanel = document.getElementById('filtersPanel');
  if (filtersPanel) {
    filtersPanel.style.display = 'none';
  }
  const employeeForm = document.getElementById('employeeForm');
  if (employeeForm) {
    employeeForm.style.display = 'none';
  }
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
});