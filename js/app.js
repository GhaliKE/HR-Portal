function showSection(id) {
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  let title = id.charAt(0).toUpperCase() + id.slice(1);
  if (id === 'dashboard') title = 'Dashboard';
  else if (id === 'employees') title = 'Gestion des Employés';
  else if (id === 'departments') title = 'Gestion des Départements';
  else if (id === 'reports') title = 'Rapports et Statistiques';
  document.getElementById("pageTitle").innerText = title;
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.sidebar nav a[onclick="showSection('${id}')"]`);
  if (link) link.classList.add('active');
  window.scrollTo(0, 0);
}
document.addEventListener('DOMContentLoaded', () => {
  showSection('dashboard');
});