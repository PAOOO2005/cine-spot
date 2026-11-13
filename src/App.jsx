import { useState, useEffect } from 'react';
import { peliculasData } from './peliculasData';
import './App.css';

function App() {
  const [peliculas] = useState(peliculasData);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todas');
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);

  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('cine_favoritos');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('cine_favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (id, e) => {
    e.stopPropagation();
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const generosUnicos = ['Todos', ...new Set(peliculas.map(p => p.genero))];

  const peliculasFiltradas = peliculas.filter(p => {
    const coincideTitulo = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'Todas' || p.tipo === filtroTipo;
    const coincideGenero = filtroGenero === 'Todos' || p.genero === filtroGenero;
    const coincideFavorito = !soloFavoritos || favoritos.includes(p.id);
    return coincideTitulo && coincideTipo && coincideGenero && coincideFavorito;
  });

  return (
    <div className="cine-container">
      <header className="cine-header">
        <h1>CineSpot 🌸</h1>
        <div className="header-controls">
          <input 
            type="text" 
            placeholder="Buscar películas o series..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button 
            className={`fav-tab-btn ${soloFavoritos ? 'active' : ''}`}
            onClick={() => setSoloFavoritos(!soloFavoritos)}
          >
            ⭐ Mis Favoritos ({favoritos.length})
          </button>
        </div>
      </header>

      {/* Filtros por Tipo */}
      <div className="filters-row">
        <span className="filter-label">Tipo:</span>
        <button onClick={() => setFiltroTipo('Todas')} className={filtroTipo === 'Todas' ? 'active' : ''}>Todas</button>
        <button onClick={() => setFiltroTipo('Película')} className={filtroTipo === 'Película' ? 'active' : ''}>Películas</button>
        <button onClick={() => setFiltroTipo('Serie')} className={filtroTipo === 'Serie' ? 'active' : ''}>Series</button>
      </div>

      {/* Filtros por Género */}
      <div className="filters-row genres-row">
        <span className="filter-label">Género:</span>
        {generosUnicos.map(gen => (
          <button 
            key={gen} 
            onClick={() => setFiltroGenero(gen)} 
            className={filtroGenero === gen ? 'active' : ''}
          >
            {gen}
          </button>
        ))}
      </div>

      {/* Catálogo de tarjetas */}
      <div className="grid-peliculas">
        {peliculasFiltradas.length > 0 ? (
          peliculasFiltradas.map(p => {
            const esFav = favoritos.includes(p.id);
            return (
              <div key={p.id} className="card" onClick={() => setPeliculaSeleccionada(p)}>
                <div className="card-img-container">
                  <img src={p.imagen} alt={p.titulo} className="card-img" />
                  <button 
                    className={`fav-btn ${esFav ? 'is-fav' : ''}`}
                    onClick={(e) => toggleFavorito(p.id, e)}
                    title={esFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {esFav ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="card-info">
                  <h3>{p.titulo}</h3>
                  <p className="card-genero">{p.genero} • <span>{p.tipo}</span></p>
                  <p className="card-sinopsis">{p.sinopsisCorta}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-results">No se encontraron películas o series con esos filtros.</p>
        )}
      </div>

      {/* Vista Detallada (Modal con sinopsis completa y botón de trailer) */}
      {peliculaSeleccionada && (
        <div className="modal-overlay" onClick={() => setPeliculaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setPeliculaSeleccionada(null)}>✕</button>
            <div className="modal-body">
              <img src={peliculaSeleccionada.imagen} alt={peliculaSeleccionada.titulo} className="modal-img" />
              <div className="modal-details">
                <h2>{peliculaSeleccionada.titulo}</h2>
                <p className="modal-meta">
                  <span>📅 {peliculaSeleccionada.año}</span> | 
                  <span> 🎬 {peliculaSeleccionada.tipo}</span> | 
                  <span> 🏷️ {peliculaSeleccionada.genero}</span>
                </p>
                {peliculaSeleccionada.duracion && <p><strong>Duración:</strong> {peliculaSeleccionada.duracion}</p>}
                {peliculaSeleccionada.temporadas && <p><strong>Temporadas:</strong> {peliculaSeleccionada.temporadas}</p>}
                
                <h3>Resumen:</h3>
                <p className="modal-sinopsis-text">{peliculaSeleccionada.sinopsisDetallada}</p>
                
                <div className="modal-actions">
                  <button 
                    className="modal-fav-btn"
                    onClick={(e) => toggleFavorito(peliculaSeleccionada.id, e)}
                  >
                    {favoritos.includes(peliculaSeleccionada.id) ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos'}
                  </button>

                  {peliculaSeleccionada.trailer && (
                    <a 
                      href={peliculaSeleccionada.trailer} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="trailer-btn"
                    >
                      ▶ Ver Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;