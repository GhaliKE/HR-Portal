function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.getElementById("pageTitle").innerText =
    id.charAt(0).toUpperCase() + id.slice(1);

  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  event.target.closest('a').classList.add('active');
}

showSection('dashboard');

