// js/detail.js

// 1. "Base de datos" de ofertas.
// ¡He añadido una lista de "includes" para cada uno!
const dealData = {
    'grecia': {
        title: 'Islas Griegas',
        meta: '7 Días / 6 Noches', // Este es el nuevo subtítulo
        price: '$899',
        image: 'Images/grecia.jpg',
        description: 'Descubre la cuna de la civilización con este increíble viaje a las Islas Griegas. Disfruta del sol, las playas de agua cristalina y la historia milenaria de lugares como Santorini y Mykonos. Este paquete incluye vuelos redondos, alojamiento de 6 noches en hoteles de 4 estrellas con desayuno incluido y traslados entre islas.',
        includes: ['Vuelo redondo internacional', 'Alojamiento 6 noches en Hotel 4★', 'Desayunos diarios', 'Traslados entre islas (ferry)', 'Seguro de viaje básico']
    },
    'dubai': {
        title: 'Dubái de Lujo',
        meta: '5 Días / 4 Noches',
        price: '$1099',
        image: 'Images/dubai.jpg',
        description: 'Vive el lujo y la modernidad en Dubái. Este paquete incluye un city tour para conocer el Burj Khalifa, un emocionante safari por las dunas del desierto con cena-espectáculo y 4 noches de alojamiento en un hotel de 5 estrellas. Una experiencia inolvidable.',
        includes: ['Vuelo redondo internacional', 'Alojamiento 4 noches en Hotel 5★', 'City tour con guía en español', 'Safari en el desierto 4x4', 'Cena-espectáculo en el desierto']
    },
    'peru': {
        title: 'Aventura en Perú',
        meta: '6 Días / 5 Noches',
        price: '$799',
        image: 'Images/peru.jpg',
        description: 'Embárcate en una aventura inolvidable al corazón del Imperio Inca. Visitarás la histórica ciudad de Cusco, el Valle Sagrado y te maravillarás con la majestuosidad de Machu Picchu. Incluye todos los traslados, entradas y guías locales expertos.',
        includes: ['Vuelos internos (Lima-Cusco)', 'Alojamiento 5 noches', 'Visita a Machu Picchu', 'Entrada al Valle Sagrado', 'Guías locales expertos', 'Todos los traslados']
    },
    'paris': {
        title: 'París Romántico',
        meta: '4 Días / 3 Noches',
        price: '$699',
        image: 'Images/paris.jpg',
        description: 'Pasea por las orillas del Sena, sube a la Torre Eiffel y disfruta de la gastronomía parisina. Ideal para escapadas románticas y viajes culturales.',
        includes: ['Vuelo ida y vuelta', 'Alojamiento 3 noches en Hotel 4★', 'Desayuno diario', 'City tour por la ciudad', 'Seguro de viaje básico']
    },
    'rio': {
        title: 'Río de Janeiro: Sol y Carnaval',
        meta: '5 Días / 4 Noches',
        price: '$749',
        image: 'Images/rio3.jpg',
        description: 'Playas icónicas como Copacabana e Ipanema, subida al Cristo Redentor y vida nocturna vibrante. Disfruta de ritmos, playas y cultura brasileña.',
        includes: ['Vuelo ida y vuelta', 'Alojamiento 4 noches', 'Traslados aeropuerto-hotel', 'Visita al Cristo Redentor', 'Asistencia en destino']
    }
    ,
    'roma': {
        title: 'Roma Histórica',
        meta: '4 Días / 3 Noches',
        price: '$679',
        image: 'Images/rome.jpg',
        description: 'Pasea por el Coliseo, el Foro Romano y la Fontana di Trevi. Una escapada cargada de historia, gastronomía y arte.',
        includes: ['Vuelo ida y vuelta', 'Alojamiento 3 noches en hotel céntrico', 'Desayuno diario', 'Entrada al Coliseo (salta fila)', 'Guía local en español']
    },
    'tokio': {
        title: 'Tokio Moderno',
        meta: '6 Días / 5 Noches',
        price: '$1299',
        image: 'Images/tokio.jpg',
        description: 'Sumérgete en la mezcla única de tradición y futurismo: templos, gastronomía excepcional y barrios vibrantes como Shibuya y Akihabara.',
        includes: ['Vuelo internacional', 'Alojamiento 5 noches', 'Japan Rail Pass (regional)', 'City tour con guía', 'Traslados aeropuerto-hotel']
    },
    'bali': {
        title: 'Bali Esencial',
        meta: '5 Días / 4 Noches',
        price: '$749',
        image: 'Images/bali.jpg',
        description: 'Playas, templos y paisajes tropicales. Perfecto para relajarse, practicar surf y explorar la cultura balinesa.',
        includes: ['Vuelo ida y vuelta', 'Alojamiento 4 noches', 'Traslado aeropuerto-hotel', 'Tour de templos y arrozales', 'Desayuno diario']
    },
    'argentina': {
        title: 'Argentina: Patagonia y Buenos Aires',
        meta: '8 Días / 7 Noches',
        price: '$999',
        image: 'Images/argentina.jpg',
        description: 'Desde la vibrante capital hasta los paisajes de la Patagonia: cascadas, glaciares y cultura gaucha.',
        includes: ['Vuelo internacional', 'Alojamiento 7 noches', 'Traslados internos', 'Excursión al glaciar', 'Desayuno diario']
    },
    'china': {
        title: 'China Clásica',
        meta: '7 Días / 6 Noches',
        price: '$1199',
        image: 'Images/china.jpg',
        description: 'Visita la Gran Muralla, la Ciudad Prohibida y descubre la historia milenaria china con guías expertos.',
        includes: ['Vuelo internacional', 'Alojamiento 6 noches', 'Desayunos', 'Entradas a monumentos', 'Guía en español']
    },
    'francia': {
        title: 'Francia Esencial',
        meta: '7 Días / 6 Noches',
        price: '$1049',
        image: 'Images/francia.jpg',
        description: 'Un recorrido perfecto para conocer París y los principales paisajes franceses. Combina ciudad, castillos y viñedos en un solo viaje.',
        includes: ['Vuelo ida y vuelta', '3 noches en París', '3 noches en región de Loira o Burdeos', 'Desayuno diario', 'City tour por París', 'Excursión a castillos o viñedos']
    },
    'australia': {
        title: 'Australia: Costa y Ciudades',
        meta: '9 Días / 8 Noches',
        price: '$1799',
        image: 'Images/sydney.jpg',
        description: 'Descubre Sídney, sus playas y su icónica ópera, combinado con escapadas a parques naturales y costa australiana.',
        includes: ['Vuelo internacional', 'Alojamiento 8 noches', 'Traslados aeropuerto-hotel', 'City tour por Sídney', 'Excursión a Blue Mountains o costa cercana']
    },
    'seattle': {
        title: 'Seattle Urbano y Natural',
        meta: '5 Días / 4 Noches',
        price: '$899',
        image: 'Images/seattle.jpg',
        description: 'Explora la ciudad de Seattle: su famoso mercado Pike Place, la Space Needle y los paisajes verdes que la rodean.',
        includes: ['Vuelo ida y vuelta', 'Alojamiento 4 noches', 'City tour por Seattle', 'Entrada a la Space Needle', 'Visita a mercados y barrios históricos']
    },
    'niagara': {
        title: 'Niágara y Grandes Lagos',
        meta: '4 Días / 3 Noches',
        price: '$649',
        image: 'Images/niagara.jpg',
        description: 'Vive de cerca la fuerza de las Cataratas del Niágara y disfruta de paseos en barco, miradores y pueblos cercanos.',
        includes: ['Traslados desde ciudad base (Toronto o Nueva York)', 'Alojamiento 3 noches', 'Paseo en barco por las cataratas (en temporada)', 'Entradas a miradores', 'Guía en español']
    },
    'korea': {
        title: 'Corea del Sur Tecnológica y Tradicional',
        meta: '7 Días / 6 Noches',
        price: '$1299',
        image: 'Images/korea.jpg',
        description: 'Conoce Seúl, sus barrios futuristas y palacios históricos, además de probar la gastronomía coreana y el K-culture.',
        includes: ['Vuelo internacional', 'Alojamiento 6 noches', 'City tour por Seúl', 'Visita a palacios reales', 'Excursión a zona tecnológica (Gangnam o similares)']
    },
    'rusia': {
        title: 'Rusia Imperial',
        meta: '8 Días / 7 Noches',
        price: '$1399',
        image: 'Images/rusia.jpg',
        description: 'Recorre Moscú y San Petersburgo, sus palacios, catedrales y avenidas cargadas de historia y arquitectura monumental.',
        includes: ['Vuelo internacional', 'Alojamiento 7 noches', 'Tren entre Moscú y San Petersburgo', 'Visitas guiadas a principales palacios y catedrales', 'Desayuno diario']
    },
    'madagascar': {
        title: 'Madagascar Salvaje',
        meta: '10 Días / 9 Noches',
        price: '$1899',
        image: 'Images/madagascar.jpg',
        description: 'Un viaje de aventura por la naturaleza única de Madagascar: baobabs, playas vírgenes y fauna endémica.',
        includes: ['Vuelo internacional', 'Alojamiento 9 noches', 'Traslados internos', 'Safaris fotográficos', 'Visita a reservas naturales y playas']
    },
    'suecia': {
        title: 'Suecia Nórdica',
        meta: '6 Días / 5 Noches',
        price: '$1199',
        image: 'Images/suecia.jpg',
        description: 'Descubre Estocolmo y el encanto nórdico: archipiélagos, diseño escandinavo y, en temporada, auroras boreales.',
        includes: ['Vuelo internacional', 'Alojamiento 5 noches', 'Paseo en barco por el archipiélago', 'City tour por Estocolmo', 'Seguro de viaje básico']
    }
    // Puedes seguir agregando nuevas ofertas usando la misma estructura si añades más destinos
};


// 2. Función que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', () => {

    // 3. Lee el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const dealId = params.get('id');

    // 4. Busca la información
    const data = dealData[dealId];

    // 5. Rellena la página
    if (data) {
        // Actualiza el título de la pestaña del navegador
        document.title = data.title + " | NEW TRAVEL"; 

        // Rellena el Hero
        // Cargamos la imagen primero para evitar parpadeos y luego activamos la animación CSS
        const heroEl = document.getElementById('detail-hero');
        const placeholder = 'https://via.placeholder.com/1600x900?text=Imagen';
        if (heroEl) {
            heroEl.classList.remove('loaded');
            const imgPre = new Image();
            imgPre.src = data.image || placeholder;
            imgPre.onload = () => {
                heroEl.style.backgroundImage = `url(${data.image})`;
                // pequeña demora para permitir transiciones
                setTimeout(()=> heroEl.classList.add('loaded'), 60);
            };
            imgPre.onerror = () => {
                heroEl.style.backgroundImage = `url(${placeholder})`;
                heroEl.classList.add('loaded');
            };
        }

        document.getElementById('detail-title').textContent = data.title;
        document.getElementById('detail-meta').textContent = data.meta;
        
        // Rellena la info de la página
        document.getElementById('detail-description').textContent = data.description;
        document.getElementById('detail-price').textContent = data.price;
        
        // Rellena la lista de "includes" de manera accesible y robusta
        const includesList = document.getElementById('detail-includes');
        if (includesList) {
            includesList.innerHTML = ''; // Limpia la lista

            // Si no hay includes definidos, mostramos un mensaje alternativo
            if (!Array.isArray(data.includes) || data.includes.length === 0) {
                const li = document.createElement('li');
                li.className = 'mb-2';
                li.textContent = 'No se especificaron servicios incluidos para esta oferta.';
                includesList.appendChild(li);
            } else {
                data.includes.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'mb-2 d-flex align-items-start'; // espaciado y alineado

                    // Icono (Font Awesome) — marcado como decorativo para lectores de pantalla
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-check text-warning me-2';
                    icon.setAttribute('aria-hidden', 'true');

                    const spanText = document.createElement('span');
                    spanText.textContent = item;

                    li.appendChild(icon);
                    li.appendChild(spanText);
                    includesList.appendChild(li);
                });
            }
        }

    } else {
        // Manejo de error si no se encuentra el ID
        document.getElementById('detail-title').textContent = 'Oferta no encontrada';
        document.getElementById('detail-description').textContent = 'Lo sentimos, la oferta que buscas no existe o ha expirado. Por favor, vuelve a la página de promociones.';
    }
}
) 
;