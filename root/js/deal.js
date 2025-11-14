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
    }
    // ... Agrega aquí tus otras ofertas con la misma estructura
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
        // Esta es la línea clave para el fondo dinámico
        document.getElementById('detail-hero').style.backgroundImage = `url(${data.image})`;
        document.getElementById('detail-title').textContent = data.title;
        document.getElementById('detail-meta').textContent = data.meta;
        
        // Rellena la info de la página
        document.getElementById('detail-description').textContent = data.description;
        document.getElementById('detail-price').textContent = data.price;
        
        // Rellena la lista de "includes"
        const includesList = document.getElementById('detail-includes');
        includesList.innerHTML = ''; // Limpia la lista
        
        data.includes.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('mb-2'); // Añade clase de Bootstrap para espaciado
            
            // Usamos Font Awesome (ya lo tienes cargado)
            li.innerHTML = `<span class="fa-li"><i class="fa-solid fa-check text-warning"></i></span>${item}`;
            
            includesList.appendChild(li);
        });

    } else {
        // Manejo de error si no se encuentra el ID
        document.getElementById('detail-title').textContent = 'Oferta no encontrada';
        document.getElementById('detail-description').textContent = 'Lo sentimos, la oferta que buscas no existe o ha expirado. Por favor, vuelve a la página de promociones.';
    }
}
) 
;