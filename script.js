/* ==========================================================================
   ARIZ LOGÍSTICA E ESTRATÉGIA - JAVASCRIPT INTERACTION LOGIC
   Handles mobile menu, smooth modal interaction, contact flow, and header scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
});

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileNav.hidden = isExpanded;
    });
  }
}

function closeMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggleBtn && mobileNav) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  }
}

// Modal Contact Flow
function openContactModal(origemContexto) {
  const modal = document.getElementById('contact-modal');
  const origemInput = document.getElementById('form-origem');
  const modalTitle = document.getElementById('modal-title');

  if (origemInput && origemContexto) {
    origemInput.value = origemContexto;
  }

  if (modalTitle && origemContexto) {
    if (origemContexto.startsWith('Solução:')) {
      modalTitle.textContent = `Diagnóstico: ${origemContexto.replace('Solução: ', '')}`;
    } else {
      modalTitle.textContent = 'Solicitar diagnóstico operacional';
    }
  }

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking on backdrop
document.addEventListener('click', (event) => {
  const modal = document.getElementById('contact-modal');
  if (modal && event.target === modal) {
    closeContactModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeContactModal();
    closeMobileMenu();
  }
});

// Form Submission handling - Sends triagem data to WhatsApp
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const nome = formData.get('nome') || '';
  const email = formData.get('email') || '';
  const empresa = formData.get('empresa') || '';
  const origem = formData.get('origem') || '';
  const contexto = formData.get('empresa_contexto') || '';
  
  const desafios = formData.getAll('desafios').join(', ');
  const areas = formData.getAll('areas').join(', ');
  const processos = formData.get('processos') || '';
  const expectativas = formData.get('expectativas') || '';

  let message = `*SOLICITAÇÃO DE DIAGNÓSTICO OPERACIONAL*\n\n`;
  if (origem) message += `*Origem:* ${origem}\n`;
  if (nome) message += `*Nome:* ${nome}\n`;
  if (email) message += `*E-mail:* ${email}\n`;
  if (empresa) message += `*Empresa:* ${empresa}\n\n`;
  if (contexto) message += `*Sobre a empresa:* ${contexto}\n`;
  if (desafios) message += `*Principais desafios:* ${desafios}\n`;
  if (areas) message += `*Áreas de apoio:* ${areas}\n`;
  if (processos) message += `*Funcionamento dos processos:* ${processos}\n`;
  if (expectativas) message += `*Expectativas:* ${expectativas}\n`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=556581721997&text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');

  form.reset();
  closeContactModal();
}

// Limite de dois desafios na triagem.
document.addEventListener('change', (event) => {
  if (!event.target.matches('input[name="desafios"]')) return;
  const selected = document.querySelectorAll('input[name="desafios"]:checked');
  if (selected.length > 2) {
    event.target.checked = false;
    event.target.setCustomValidity('Escolha no máximo 2 opções.');
    event.target.reportValidity();
    event.target.setCustomValidity('');
  }
});
