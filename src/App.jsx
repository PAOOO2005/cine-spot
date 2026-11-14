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
  const [trailerActivo, setTrailerActivo] = useState(null);

  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('cinelux_favoritos');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('cinelux_favoritos', JSON.stringify(favoritos));
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
      {/* Botón de Mis Favoritos en la orilla derecha arriba */}
      <div className="top-fav-container">
        <button 
          className={`fav-corner-btn ${soloFavoritos ? 'active' : ''}`}
          onClick={() => setSoloFavoritos(!soloFavoritos)}
        >
          Mis Favoritos {favoritos.length}
        </button>
      </div>

      {/* Cabecera: Título y Buscador */}
      <header className="cine-header">
        <h1 className="logo-title">CineLux</h1>
        <div className="search-container-large">
          <input 
            type="text" 
            placeholder="Buscar películas, series y más..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input-transparent"
          />
        </div>
      </header>

      {/* Tres botones principales (Todas, Películas, Series) grandes y centrados */}
      <div className="main-filters-centered">
        <button onClick={() => setFiltroTipo('Todas')} className={`main-filter-btn ${filtroTipo === 'Todas' ? 'active' : ''}`}>Todas</button>
        <button onClick={() => setFiltroTipo('Película')} className={`main-filter-btn ${filtroTipo === 'Película' ? 'active' : ''}`}>Películas</button>
        <button onClick={() => setFiltroTipo('Serie')} className={`main-filter-btn ${filtroTipo === 'Serie' ? 'active' : ''}`}>Series</button>
      </div>

      {/* Botones de Género abajo */}
      <div className="filters-row genres-row">
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
                  <div className="img-fade-overlay"></div>
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

      {/* Vista Detallada (Modal de Información) */}
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
                
                <h3>Resumen / Sinopsis:</h3>
                <p className="modal-sinopsis-text">{peliculaSeleccionada.sinopsisDetallada}</p>
                
                <div className="modal-actions">
                  <button 
                    className="modal-fav-btn"
                    onClick={(e) => toggleFavorito(peliculaSeleccionada.id, e)}
                  >
                    {favoritos.includes(peliculaSeleccionada.id) ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos'}
                  </button>

                  {peliculaSeleccionada.trailer && (
                    <button 
                      className="trailer-btn"
                      onClick={() => setTrailerActivo(peliculaSeleccionada)}
                    >
                      ▶ Ver Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Reproducir el Trailer Internamente */}
      {trailerActivo && (
        <div className="modal-overlay trailer-overlay" onClick={() => setTrailerActivo(null)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setTrailerActivo(null)}>✕</button>
            <h3>Trailer: {trailerActivo.titulo}</h3>
            <div className="video-container">
              <iframe 
                src={`${trailerActivo.trailer}?autoplay=1`} 
                title={`Trailer de ${trailerActivo.titulo}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;