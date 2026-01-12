class SettingsManager {
  constructor() {
    this.settings = JSON.parse(localStorage.getItem('hrSettings')) || this.getDefaultSettings();
    this.init();
  }
  getDefaultSettings() {
    return {
      theme: 'dark',
      language: 'fr',
      emailNotifications: true,
      pushNotifications: true,
      autoBackup: true,
      dataRetention: 365 
    };
  }
  init() {
    this.loadSettings();
    this.initEventListeners();
  }
  loadSettings() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.value = this.settings.theme;
    }
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      languageSelect.value = this.settings.language;
    }
    const emailNotifications = document.getElementById('emailNotifications');
    if (emailNotifications) {
      emailNotifications.checked = this.settings.emailNotifications;
    }
    const pushNotifications = document.getElementById('pushNotifications');
    if (pushNotifications) {
      pushNotifications.checked = this.settings.pushNotifications;
    }
  }
  initEventListeners() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
    }
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
    }
    const emailNotifications = document.getElementById('emailNotifications');
    if (emailNotifications) {
      emailNotifications.addEventListener('change', (e) => {
        this.settings.emailNotifications = e.target.checked;
        this.saveSettings();
      });
    }
    const pushNotifications = document.getElementById('pushNotifications');
    if (pushNotifications) {
      pushNotifications.addEventListener('change', (e) => {
        this.settings.pushNotifications = e.target.checked;
        this.saveSettings();
      });
    }
  }
  changeTheme(theme) {
    this.settings.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.saveSettings();
    if (window.hrPortal) {
      window.hrPortal.theme = theme;
      window.hrPortal.showNotification(`Thème changé vers ${theme === 'dark' ? 'sombre' : 'clair'}`, 'success');
    }
  }
  changeLanguage(language) {
    this.settings.language = language;
    this.saveSettings();
    if (window.hrPortal) {
      window.hrPortal.showNotification('Langue mise à jour (redémarrage requis)', 'info');
    }
  }
  saveSettings() {
    localStorage.setItem('hrSettings', JSON.stringify(this.settings));
  }
  exportAllData() {
    const data = {
      employees: JSON.parse(localStorage.getItem('employees')) || [],
      departments: JSON.parse(localStorage.getItem('departments')) || [],
      attendance: JSON.parse(localStorage.getItem('attendance')) || [],
      payroll: JSON.parse(localStorage.getItem('payroll')) || [],
      settings: this.settings,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-portal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.hrPortal) {
      window.hrPortal.showNotification('Sauvegarde complète exportée!', 'success');
    }
  }
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.employees) localStorage.setItem('employees', JSON.stringify(data.employees));
          if (data.departments) localStorage.setItem('departments', JSON.stringify(data.departments));
          if (data.attendance) localStorage.setItem('attendance', JSON.stringify(data.attendance));
          if (data.payroll) localStorage.setItem('payroll', JSON.stringify(data.payroll));
          if (data.settings) {
            this.settings = data.settings;
            this.saveSettings();
          }
          if (window.hrPortal) {
            window.hrPortal.showNotification('Données importées avec succès! Rechargement...', 'success');
            setTimeout(() => location.reload(), 2000);
          }
        } catch (error) {
          if (window.hrPortal) {
            window.hrPortal.showNotification('Erreur lors de l\'importation des données', 'error');
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  clearAllData() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
      localStorage.removeItem('employees');
      localStorage.removeItem('departments');
      localStorage.removeItem('attendance');
      localStorage.removeItem('payroll');
      localStorage.removeItem('hrSettings');
      if (window.hrPortal) {
        window.hrPortal.showNotification('Toutes les données ont été effacées! Rechargement...', 'warning');
        setTimeout(() => location.reload(), 2000);
      }
    }
  }
}
function changeTheme(theme) {
  if (window.settingsManager) {
    window.settingsManager.changeTheme(theme);
  }
}
function exportAllData() {
  if (window.settingsManager) {
    window.settingsManager.exportAllData();
  }
}
function importData() {
  if (window.settingsManager) {
    window.settingsManager.importData();
  }
}
function clearAllData() {
  if (window.settingsManager) {
    window.settingsManager.clearAllData();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  window.settingsManager = new SettingsManager();
});