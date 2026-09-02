const API_KEY = 'DEMO_KEY'; // Sustituir por tu llave real de GlobalGiving si cuentas con una
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (!query) return;

  resultsContainer.innerHTML = '<p>Cargando organizaciones...</p>';

  try {
    const url = `https://api.globalgiving.org/api/public/services/search/projects?api_key=${API_KEY}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    const data = await response.json();
    const projects = data.search?.response?.projects?.project;

    // Normalizar si viene un solo proyecto o un arreglo
    const projectList = Array.isArray(projects) ? projects : (projects ? [projects] : []);
    
    renderCards(projectList);

  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = '<p>Error al obtener resultados. Por favor intenta de nuevo.</p>';
  }
});

function renderCards(projects) {
  resultsContainer.innerHTML = '';

  if (projects.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron organizaciones para esta búsqueda.</p>';
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'card';

    const logoUrl = project.imageLink || 'https://via.placeholder.com/100?text=Logo';
    const title = project.title || 'Organización Benéfica';
    const country = project.country || 'No especificado';
    const projectUrl = project.projectLink || '#';

    card.innerHTML = `
      <a href="${projectUrl}" target="_blank" rel="noopener noreferrer">
        <img src="${logoUrl}" alt="Logo de ${title}">
      </a>
      <h3>${title}</h3>
      <p><strong>ID:</strong> ${project.id}</p>
      <p><strong>País:</strong> ${country}</p>
      <a href="${projectUrl}" target="_blank" rel="noopener noreferrer">Ver sitio web</a>
    `;

    resultsContainer.appendChild(card);
  });
}