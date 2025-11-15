(function(){
  const faqDatabase = {
    reservas: {
      title: 'Cómo hacer una reserva',
      content: 'Puedes reservar a través de nuestro buscador en la página principal. Selecciona origen, destino, fechas y pasajeros. Luego elige tu paquete favorito y completa el checkout con tus datos.'
    },
    cancelaciones: {
      title: 'Política de cancelaciones',
      content: 'Las cancelaciones realizadas con 7 días de anticipación reciben 100% de reembolso. Con 3-7 días, 50%. Menos de 3 días, sin reembolso. Algunos paquetes especiales pueden tener políticas diferentes.'
    },
    pagos: {
      title: 'Métodos de pago',
      content: 'Aceptamos tarjetas de crédito (Visa, Mastercard), transferencia bancaria. Todos tus pagos están protegidos con encriptación .'
    },
    documentos: {
      title: 'Documentos requeridos',
      content: 'Necesitarás pasaporte válido para viajes internacionales. Algunos destinos requieren visa. Te enviaremos un checklist completo 30 días antes de tu viaje con toda la información necesaria.'
    },
    seguros: {
      title: 'Seguros de viaje',
      content: 'Ofrecemos seguros de viaje que cubren cancelación, asistencia médica, pérdida de equipaje y más. Puedes contratar opcionalmente durante la reserva con un descuento especial.'
    },
    contacto: {
      title: 'Contactar con soporte',
      content: 'Puedes contactarnos vía correo a info@cosmostravel.com, por teléfono al +503 2420-0346 O +503 7229-7467, o visitando nuestra página de Contacto. Atendemos de lunes a viernes 9am-6pm.'
    }
  };

  function initChatbot(){
    const chatWidget = document.getElementById('chatbot-widget');
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatClose = document.getElementById('chatbot-close');
    const chatMessages = document.getElementById('chatbot-messages');
    const faqButtons = document.querySelectorAll('.faq-btn');

    if (!chatWidget || !chatToggle || !chatClose || !chatMessages) return;

    chatToggle.addEventListener('click', () => {
      chatWidget.classList.toggle('active');
      if (chatWidget.classList.contains('active')) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });

    chatClose.addEventListener('click', () => {
      chatWidget.classList.remove('active');
    });

    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const faqKey = btn.getAttribute('data-faq');
        const faq = faqDatabase[faqKey];
        if (!faq) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'chatbot-message user-message';
        userMsg.innerHTML = `<p>${btn.textContent}</p>`;
        chatMessages.appendChild(userMsg);

        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.className = 'chatbot-message bot-message';
          botMsg.innerHTML = `<p><strong>${faq.title}</strong><br>${faq.content}</p>`;
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
