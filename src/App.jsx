import { useState } from 'react';
import { peliculasData } from './peliculasData';
import './App.css';

function App() {
  const [peliculas] = useState(peliculasData);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todas');

  // Filtrar por título y por tipo (Película / Serie)
  const peliculasFiltradas = peliculas.filter(p => {
    const coincideTitulo = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'Todas' || p.tipo === filtroTipo;
    return coincideTitulo && coincideTipo;
  });

  return (
    <div className="cine-container">
      <header className="cine-header">
        <h1>CineSpot</h1>
        <input 
          type="text" 
          placeholder="Buscar películas o series..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </header>

      {/* Botones de filtro */}
      <div className="filters">
        <button onClick={() => setFiltroTipo('Todas')} className={filtroTipo === 'Todas' ? 'active' : ''}>Todas</button>
        <button onClick={() => setFiltroTipo('Película')} className={filtroTipo === 'Película' ? 'active' : ''}>Películas</button>
        <button onClick={() => setFiltroTipo('Serie')} className={filtroTipo === 'Serie' ? 'active' : ''}>Series</button>
      </div>

      {/* Catálogo de tarjetas */}
      <div className="grid-peliculas">
        {peliculasFiltradas.length > 0 ? (
          peliculasFiltradas.map(p => (
            <div key={p.id} className="card">
              <img src={p.imagen} alt={p.titulo} className="card-img" />
              <div className="card-info">
                <h3>{p.titulo}</h3>
                <p className="card-genero">{p.genero} • <span>{p.tipo}</span></p>
                <p className="card-sinopsis">{p.sinopsis}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

export default App;
