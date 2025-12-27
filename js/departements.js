document.addEventListener('DOMContentLoaded', () => {

  let departments = JSON.parse(localStorage.getItem('departments')) || [];

  const form = document.getElementById('deptForm');
  const list = document.getElementById('deptList');

  function renderDepartments() {
    list.innerHTML = '';
    departments.forEach((dept, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${dept.name}
        <button onclick="deleteDept(${index})">❌</button>
      `;
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    departments.push({ name: deptName.value });
    localStorage.setItem('departments', JSON.stringify(departments));
    renderDepartments();
    form.reset();
  });

  window.deleteDept = index => {
    departments.splice(index, 1);
    localStorage.setItem('departments', JSON.stringify(departments));
    renderDepartments();
  };

  renderDepartments();
});
