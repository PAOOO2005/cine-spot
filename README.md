# CineLux - Explorador de Películas y Series

Aplicación web desarrollada en **React** y **Vite** para la gestión, búsqueda, filtrado y visualización de un catálogo de películas y series, con un diseño personalizado en tonos rosas y persistencia de favoritos.

## Tecnología Seleccionada
- **React**: Biblioteca de JavaScript para la construcción de interfaces de usuario interactivas basadas en componentes.
- **Vite**: Herramienta de compilación rápida y entorno de desarrollo local.
- **CSS3**: Estilos personalizados con paleta de colores en tonos rosa pastel/frambuesa.
- **LocalStorage**: API del navegador para guardar y persistir las películas y series marcadas como favoritas.

---

## ⚙️ Procedimiento de Instalación y Ejecución

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/PAOOO2005/cine-spot.git
Entrar a la carpeta del proyecto:

Bash
cd cine-spot
Instalar las dependencias:

Bash
npm install
Ejecutar el servidor de desarrollo local:

Bash
npm run dev
Abre el enlace que aparece en tu terminal (por lo regular http://localhost:5173/) en tu navegador web.

Explicación de los Componentes y Funcionalidades
src/peliculasData.js: Archivo de datos centralizado que almacena el catálogo completo de películas y series, incluyendo títulos, tipos, géneros, años, duraciones/temporadas, sinopsis, rutas de imágenes locales y enlaces a los trailers de YouTube.

src/App.jsx: Componente principal que integra la lógica de la interfaz:

Buscador en tiempo real.

Filtros por tipo y género.

Sistema de favoritos sincronizado con LocalStorage.

Vista detallada mediante un modal interactivo con sinopsis completa y botón de acceso al trailer.

src/App.css: Hoja de estilos encargada de dar la identidad visual en tonos rosas y un diseño responsivo en cuadrícula.
