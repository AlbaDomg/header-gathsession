/* ==========================================================================
   GATHSESSION DYNAMIC INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEntranceAnimations();
  initNavigationTracker();
  initMouseParallax();
  initActionModal();
});

/**
 * 1. ENTRANCE ANIMATIONS (Graceful Page Fade-in & Scale)
 * Animaciones escalonadas para una presentación premium de la landing page.
 */
function initEntranceAnimations() {
  const elementsToAnimate = [
    { selector: '.logo-wrapper', delay: 100, class: 'slide-down' },
    { selector: '.nav-list > li', delay: 200, class: 'slide-down', stagger: 80 },
    { selector: '#main-headline', delay: 300, class: 'slide-up' },
    { selector: '#main-subheadline', delay: 450, class: 'slide-up' },
    { selector: '.hero-action-buttons', delay: 550, class: 'slide-up' },
    { selector: '.bg-curve-line', delay: 200, class: 'fade-in' },
    { selector: '.portrait-capsule, .portrait-circle', delay: 500, class: 'pop-in', stagger: 120 }
  ];

  // Aplicar estilos iniciales de animación en CSS dinámicamente
  const style = document.createElement('style');
  style.textContent = `
    .logo-wrapper, .nav-list > li, #main-headline, #main-subheadline, 
    .hero-action-buttons, .bg-curve-line, 
    .portrait-capsule, .portrait-circle {
      opacity: 0;
      will-change: transform, opacity;
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .slide-down-init { transform: translateY(-20px); }
    .slide-up-init { transform: translateY(30px); }
    .fade-in-init { opacity: 0; }
    .pop-in-init { transform: scale(0.9) translateY(20px); }
    
    .animate-active {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);

  // Inicializar clases de animación
  elementsToAnimate.forEach(group => {
    const nodes = document.querySelectorAll(group.selector);
    
    nodes.forEach((node, index) => {
      // Asignar clase de estado inicial
      if (group.class === 'slide-down') node.classList.add('slide-down-init');
      if (group.class === 'slide-up') node.classList.add('slide-up-init');
      if (group.class === 'fade-in') node.classList.add('fade-in-init');
      if (group.class === 'pop-in') node.classList.add('pop-in-init');

      // Calcular retraso escalonado
      const nodeDelay = group.delay + (group.stagger ? index * group.stagger : 0);

      // Activar animación
      setTimeout(() => {
        node.classList.add('animate-active');
      }, nodeDelay);
    });
  });
}

/**
 * 2. NAVIGATION FLOATING TRACKER (Smooth slide under links)
 * El indicador rosa se desliza suavemente siguiendo el cursor en la navegación.
 */
function initNavigationTracker() {
  const navList = document.querySelector('.nav-list');
  const navItems = document.querySelectorAll('.nav-link');
  const indicator = document.getElementById('nav-line-indicator');
  
  if (!navList || !indicator) return;

  let activeItem = document.querySelector('.nav-link.active');

  // Función para re-posicionar el indicador sobre un enlace específico
  const positionIndicator = (link) => {
    const itemRect = link.getBoundingClientRect();
    const listRect = navList.getBoundingClientRect();
    
    // Calcular el offset izquierdo relativo al contenedor .nav-list
    const offsetLeft = itemRect.left - listRect.left + (itemRect.width / 2) - 7.5; // 7.5px es mitad de la anchura del nav_line (15px)
    
    // Aplicar transición suave de desplazamiento
    indicator.style.transition = 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    indicator.style.left = `${offsetLeft}px`;
  };

  // Posicionamiento inicial en carga
  if (activeItem) {
    // Pequeño timeout para permitir que el layout se calcule correctamente
    setTimeout(() => positionIndicator(activeItem), 150);
  }

  // Event Listeners para cada enlace
  navItems.forEach(item => {
    // Al pasar el cursor, mover el indicador temporalmente
    item.addEventListener('mouseenter', () => {
      positionIndicator(item);
    });

    // Al hacer click, establecer el enlace como activo permanente
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(link => link.classList.remove('active'));
      item.classList.add('active');
      activeItem = item;
      positionIndicator(item);
    });
  });

  // Al salir del menú de navegación, volver al elemento activo original
  navList.addEventListener('mouseleave', () => {
    if (activeItem) {
      positionIndicator(activeItem);
    }
  });

  // Reajustar si la ventana cambia de tamaño (responsivo)
  window.addEventListener('resize', () => {
    if (activeItem) {
      positionIndicator(activeItem);
    }
  });
}

/**
 * 3. MOUSE PARALLAX EFFECT FOR CURVED LINES
 * Las líneas del fondo reaccionan de manera ultra-sutil al movimiento del mouse.
 */
function initMouseParallax() {
  const visualColumn = document.getElementById('visual-collage');
  const curveOne = document.querySelector('.curve-one');
  const curveTwo = document.querySelector('.curve-two');

  if (!visualColumn || !curveOne || !curveTwo) return;

  document.addEventListener('mousemove', (e) => {
    // Obtener la posición del mouse normalizada de -1 a 1
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;

    // Desplazar las curvas ligeramente en direcciones opuestas
    const moveX1 = mouseX * 25;
    const moveY1 = mouseY * 25;
    
    const moveX2 = mouseX * -15;
    const moveY2 = mouseY * -15;

    // Aplicar el transform suavemente
    curveOne.style.transform = `translate3d(${moveX1}px, ${moveY1}px, 0)`;
    curveTwo.style.transform = `translate3d(${moveX2}px, ${moveY2}px, 0)`;
  });
}

/**
 * 4. PREMIUM ACTION NOTIFICATION MODAL
 * Añade una notificación tipo "Toast" en cristal esmerilado cuando haces click en Get Started.
 */
function initActionModal() {
  const btnGetStarted = document.getElementById('btn-get-started');
  
  if (!btnGetStarted) return;

  btnGetStarted.addEventListener('click', () => {
    // Evitar acumulaciones creando solo una notificación a la vez
    if (document.getElementById('premium-toast')) return;

    // Crear la notificación flotante premium (glassmorphism + rosa)
    const toast = document.createElement('div');
    toast.id = 'premium-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-indicator"></div>
        <div class="toast-text">
          <h4>¡Bienvenido a GathSession!</h4>
          <p>Preparando tu espacio de coworking digital...</p>
        </div>
      </div>
    `;

    // Estilos dinámicos para la notificación flotante
    const style = document.createElement('style');
    style.id = 'premium-toast-styles';
    style.textContent = `
      #premium-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        background: rgba(30, 32, 38, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.2rem 1.6rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        color: #ffffff;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 350px;
      }
      
      #premium-toast.active {
        transform: translateY(0);
        opacity: 1;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .toast-indicator {
        width: 10px;
        height: 10px;
        background-color: #e63970;
        border-radius: 50%;
        box-shadow: 0 0 10px #e63970, 0 0 20px #e63970;
        animation: pulse 1.5s infinite alternate;
      }
      
      .toast-text h4 {
        font-family: 'Outfit', sans-serif;
        font-size: 0.98rem;
        font-weight: 600;
        margin-bottom: 0.2rem;
      }
      
      .toast-text p {
        font-family: 'Outfit', sans-serif;
        font-size: 0.85rem;
        color: #8c8f9f;
        font-weight: 300;
      }
      
      @keyframes pulse {
        from { transform: scale(0.9); opacity: 0.6; }
        to { transform: scale(1.2); opacity: 1; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Activar aparición con animación
    setTimeout(() => {
      toast.classList.add('active');
    }, 50);

    // Auto-eliminar la notificación después de 4 segundos con animación de salida
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
        style.remove();
      }, 500);
    }, 4000);
  });
}
