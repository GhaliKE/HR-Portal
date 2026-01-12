function initializeSampleData() {
  if (localStorage.getItem('employees')) {
    console.log('Data already exists. Skipping sample data.');
    return;
  }
  const departments = [
    { name: "Informatique", description: "Département IT - Développement et Infrastructure" },
    { name: "Ressources Humaines", description: "Gestion du personnel et recrutement" },
    { name: "Ventes", description: "Équipe commerciale et relation clients" },
    { name: "Design", description: "Design UX/UI et créatif" },
    { name: "Finance", description: "Comptabilité et gestion financière" }
  ];
  const employees = [
    {
      id: 1704268800000,
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@company.com",
      poste: "Développeur Senior",
      salaire: 48000,
      department: "Informatique"
    },
    {
      id: 1704268800001,
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@company.com",
      poste: "Developer Frontend",
      salaire: 36000,
      department: "Informatique"
    },
    {
      id: 1704268800002,
      nom: "Bernard",
      prenom: "Paul",
      email: "paul.bernard@company.com",
      poste: "Designer UX/UI",
      salaire: 34000,
      department: "Design"
    },
    {
      id: 1704268800003,
      nom: "Thomas",
      prenom: "Sophie",
      email: "sophie.thomas@company.com",
      poste: "Responsable RH",
      salaire: 42000,
      department: "Ressources Humaines"
    },
    {
      id: 1704268800004,
      nom: "Garcia",
      prenom: "Carlos",
      email: "carlos.garcia@company.com",
      poste: "Chef de Projet",
      salaire: 45000,
      department: "Informatique"
    },
    {
      id: 1704268800005,
      nom: "Rodriguez",
      prenom: "Lucia",
      email: "lucia.rodriguez@company.com",
      poste: "Directrice Ventes",
      salaire: 52000,
      department: "Ventes"
    },
    {
      id: 1704268800006,
      nom: "Dupuis",
      prenom: "Laurent",
      email: "laurent.dupuis@company.com",
      poste: "Commercial",
      salaire: 32000,
      department: "Ventes"
    },
    {
      id: 1704268800007,
      nom: "Moreau",
      prenom: "Anne",
      email: "anne.moreau@company.com",
      poste: "Comptable",
      salaire: 30000,
      department: "Finance"
    },
    {
      id: 1704268800008,
      nom: "Lefevre",
      prenom: "Michel",
      email: "michel.lefevre@company.com",
      poste: "Administrateur Système",
      salaire: 38000,
      department: "Informatique"
    },
    {
      id: 1704268800009,
      nom: "Simon",
      prenom: "Claire",
      email: "claire.simon@company.com",
      poste: "Designer Graphique",
      salaire: 32000,
      department: "Design"
    }
  ];
  localStorage.setItem('departments', JSON.stringify(departments));
  localStorage.setItem('employees', JSON.stringify(employees));
  console.log('✅ Sample data initialized!');
  console.log(`   - ${departments.length} departments created`);
  console.log(`   - ${employees.length} employees created`);
}
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('employees')) {
    console.log('Initializing sample data...');
    initializeSampleData();
    location.reload(); 
  }
});