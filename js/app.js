function showSection(id) {
  // Remove active class from all sections
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
  });
  
  // Add active class to selected section
  document.getElementById(id).classList.add('active');

  // Update page title with proper formatting
  let title = id.charAt(0).toUpperCase() + id.slice(1);
  if (id === 'dashboard') title = 'Dashboard';
  else if (id === 'employees') title = 'Gestion des Employés';
  else if (id === 'departments') title = 'Gestion des Départements';
  else if (id === 'reports') title = 'Rapports et Statistiques';
  
  document.getElementById("pageTitle").innerText = title;

  // Update active nav link
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.sidebar nav a[onclick="showSection('${id}')"]`);
  if (link) link.classList.add('active');

  // Scroll to top
  window.scrollTo(0, 0);
}

// Initialize with dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  showSection('dashboard');
});


