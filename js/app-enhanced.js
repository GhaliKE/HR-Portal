class HRPortal {
  constructor() {
    this.currentSection = 'dashboard';
    this.theme = localStorage.getItem('theme') || 'dark';
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    this.departments = JSON.parse(localStorage.getItem('departments')) || [];
    this.notifications = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filters = {};
    this.init();
  }
  init() {
    this.initTheme();
    this.initEventListeners();
    this.loadSampleData();
    this.hideLoadingScreen();
    this.updateDashboard();
    this.showNotification('Bienvenue dans le portail RH!', 'success');
  }
  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.theme === 'dark' ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
    }
  }
  initEventListeners() {
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
    }
    const employeeForm = document.getElementById('employeeForm');
    if (employeeForm) {
      employeeForm.addEventListener('submit', (e) => this.handleEmployeeSubmit(e));
    }
    const deptForm = document.getElementById('deptForm');
    if (deptForm) {
      deptForm.addEventListener('submit', (e) => this.handleDepartmentSubmit(e));
    }
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleEmployeeSearch(e.target.value));
    }
    this.initFilters();
  }
  initFilters() {
    const filterInputs = ['filterDepartment', 'filterStatus', 'filterSalaryMin', 'filterSalaryMax'];
    filterInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => this.applyFilters());
      }
    });
  }
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }
  showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 18px;">&times;</button>
      </div>
    `;
    container.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);
  }
  handleGlobalSearch(query) {
    if (!query.trim()) return;
    const results = [];
    this.employees.forEach(emp => {
      if (emp.nom.toLowerCase().includes(query.toLowerCase()) ||
          emp.prenom.toLowerCase().includes(query.toLowerCase()) ||
          emp.email.toLowerCase().includes(query.toLowerCase()) ||
          emp.poste.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'employee', data: emp });
      }
    });
    this.departments.forEach(dept => {
      if (dept.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'department', data: dept });
      }
    });
    this.showSearchResults(results);
  }
  showSearchResults(results) {
    console.log('Search results:', results);
  }
  updateDashboard() {
    this.updateKPIs();
    this.updateEmployeeCount();
  }
  updateKPIs() {
    const totalEmployees = this.employees.length;
    const avgSalary = totalEmployees > 0 ? 
      Math.round(this.employees.reduce((sum, emp) => sum + emp.salaire, 0) / totalEmployees) : 0;
    const uniquePositions = [...new Set(this.employees.map(emp => emp.poste))].length;
    const totalDepartments = this.departments.length;
    const kpiEmployees = document.getElementById('kpiEmployees');
    const kpiSalary = document.getElementById('kpiSalary');
    const kpiPosts = document.getElementById('kpiPosts');
    const kpiDepts = document.getElementById('kpiDepts');
    const kpiPresent = document.getElementById('kpiPresent');
    const kpiAbsent = document.getElementById('kpiAbsent');
    if (kpiEmployees) kpiEmployees.textContent = totalEmployees;
    if (kpiSalary) kpiSalary.textContent = `${avgSalary.toLocaleString()} MAD`;
    if (kpiPosts) kpiPosts.textContent = uniquePositions;
    if (kpiDepts) kpiDepts.textContent = totalDepartments;
    if (kpiPresent) kpiPresent.textContent = Math.floor(totalEmployees * 0.95);
    if (kpiAbsent) kpiAbsent.textContent = Math.floor(totalEmployees * 0.05);
  }
  updateEmployeeCount() {
    const badge = document.getElementById('employeeCount');
    const totalElement = document.getElementById('totalEmployees');
    if (badge) badge.textContent = this.employees.length;
    if (totalElement) totalElement.textContent = this.employees.length;
  }
  loadSampleData() {
    if (this.employees.length === 0 && typeof sampleEmployees !== 'undefined') {
      this.employees = [...sampleEmployees];
    }
    if (this.departments.length === 0 && typeof sampleDepartments !== 'undefined') {
      this.departments = [...sampleDepartments];
    }
    this.saveData();
  }
  saveData() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    localStorage.setItem('departments', JSON.stringify(this.departments));
  }
}
function showSection(sectionName) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.classList.remove('active');
  });
  if (event && event.target) {
    event.target.classList.add('active');
  }
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    const titles = {
      dashboard: 'Dashboard',
      employees: 'Gestion des Employés',
      departments: 'Départements',
      attendance: 'Présences',
      payroll: 'Paie',
      reports: 'Rapports',
      settings: 'Paramètres'
    };
    pageTitle.textContent = titles[sectionName] || sectionName;
  }
  if (window.hrPortal) {
    window.hrPortal.currentSection = sectionName;
  }
}
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
  }
  if (window.hrPortal) {
    window.hrPortal.theme = newTheme;
    window.hrPortal.showNotification(`Thème changé vers ${newTheme === 'dark' ? 'sombre' : 'clair'}`, 'info');
  }
}
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.main');
  if (sidebar && main) {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
  }
}
function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}
function clearAllNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
  if (window.hrPortal) {
    window.hrPortal.showNotification('Toutes les notifications ont été effacées', 'info');
  }
}
function exportAllData() {
  if (window.hrPortal) {
    const data = {
      employees: window.hrPortal.employees,
      departments: window.hrPortal.departments,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.hrPortal.showNotification('Données exportées avec succès!', 'success');
  }
}
function refreshActivities() {
  if (window.hrPortal) {
    window.hrPortal.showNotification('Activités actualisées', 'info');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  window.hrPortal = new HRPortal();
  showSection('dashboard');
});