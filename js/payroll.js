class PayrollManager {
  constructor() {
    this.payrollData = JSON.parse(localStorage.getItem('payroll')) || [];
    this.init();
  }
  init() {
    this.populateMonthSelect();
    this.updatePayrollSummary();
    this.renderPayrollList();
  }
  populateMonthSelect() {
    const select = document.getElementById('payrollMonth');
    if (!select) return;
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const currentMonth = new Date().getMonth();
    select.innerHTML = months.map((month, index) => 
      `<option value="${index}" ${index === currentMonth ? 'selected' : ''}>${month} ${new Date().getFullYear()}</option>`
    ).join('');
  }
  generatePayroll() {
    const monthSelect = document.getElementById('payrollMonth');
    if (!monthSelect) return;
    const selectedMonth = parseInt(monthSelect.value);
    const year = new Date().getFullYear();
    const monthKey = `${year}-${selectedMonth.toString().padStart(2, '0')}`;
    if (window.hrPortal && window.hrPortal.employees) {
      this.payrollData = this.payrollData.filter(record => record.monthKey !== monthKey);
      window.hrPortal.employees.forEach(employee => {
        const baseSalary = employee.salaire;
        const bonus = this.calculateBonus(baseSalary);
        const deductions = this.calculateDeductions(baseSalary);
        const netSalary = baseSalary + bonus - deductions;
        this.payrollData.push({
          id: Date.now() + Math.random(),
          employeeId: employee.id,
          employeeName: `${employee.prenom} ${employee.nom}`,
          monthKey: monthKey,
          month: selectedMonth,
          year: year,
          baseSalary: baseSalary,
          bonus: bonus,
          deductions: deductions,
          netSalary: netSalary,
          generatedAt: new Date().toISOString()
        });
      });
      this.savePayrollData();
      this.updatePayrollSummary();
      this.renderPayrollList();
      if (window.hrPortal) {
        window.hrPortal.showNotification('Paie générée avec succès!', 'success');
      }
    }
  }
  calculateBonus(baseSalary) {
    const bonusPercentage = Math.random() * 0.1 + 0.05; 
    return Math.round(baseSalary * bonusPercentage);
  }
  calculateDeductions(baseSalary) {
    const taxRate = 0.15; 
    const socialSecurityRate = 0.05; 
    return Math.round(baseSalary * (taxRate + socialSecurityRate));
  }
  updatePayrollSummary() {
    const monthSelect = document.getElementById('payrollMonth');
    if (!monthSelect) return;
    const selectedMonth = parseInt(monthSelect.value);
    const year = new Date().getFullYear();
    const monthKey = `${year}-${selectedMonth.toString().padStart(2, '0')}`;
    const monthRecords = this.payrollData.filter(record => record.monthKey === monthKey);
    const totalPayroll = monthRecords.reduce((sum, record) => sum + record.netSalary, 0);
    const payslipCount = monthRecords.length;
    const totalElement = document.getElementById('totalPayroll');
    const countElement = document.getElementById('payslipCount');
    if (totalElement) totalElement.textContent = `${totalPayroll.toLocaleString()} MAD`;
    if (countElement) countElement.textContent = payslipCount;
  }
  renderPayrollList() {
    const monthSelect = document.getElementById('payrollMonth');
    if (!monthSelect) return;
    const selectedMonth = parseInt(monthSelect.value);
    const year = new Date().getFullYear();
    const monthKey = `${year}-${selectedMonth.toString().padStart(2, '0')}`;
    const monthRecords = this.payrollData.filter(record => record.monthKey === monthKey);
    const tbody = document.getElementById('payrollList');
    if (!tbody) return;
    tbody.innerHTML = monthRecords.map(record => `
      <tr>
        <td>${record.employeeName}</td>
        <td>${record.baseSalary.toLocaleString()} MAD</td>
        <td>${record.bonus.toLocaleString()} MAD</td>
        <td>${record.deductions.toLocaleString()} MAD</td>
        <td><strong>${record.netSalary.toLocaleString()} MAD</strong></td>
        <td>
          <button onclick="generatePayslip(${record.id})" class="btn-sm btn-primary">
            <i class='bx bx-receipt'></i> Fiche
          </button>
          <button onclick="sendPayslip(${record.id})" class="btn-sm btn-success">
            <i class='bx bx-send'></i> Envoyer
          </button>
        </td>
      </tr>
    `).join('');
  }
  savePayrollData() {
    localStorage.setItem('payroll', JSON.stringify(this.payrollData));
  }
}
function generatePayroll() {
  if (window.payrollManager) {
    window.payrollManager.generatePayroll();
  }
}
function generatePayslip(recordId) {
  const record = window.payrollManager?.payrollData.find(r => r.id === recordId);
  if (record && window.hrPortal) {
    window.hrPortal.showNotification(`Fiche de paie générée pour ${record.employeeName}`, 'success');
  }
}
function sendPayslip(recordId) {
  const record = window.payrollManager?.payrollData.find(r => r.id === recordId);
  if (record && window.hrPortal) {
    window.hrPortal.showNotification(`Fiche de paie envoyée à ${record.employeeName}`, 'success');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  window.payrollManager = new PayrollManager();
});