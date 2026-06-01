const gate   = document.getElementById('sound-gate');
const audio  = document.getElementById('audio');
const player = document.getElementById('player');
const plBtn  = document.getElementById('pl-btn');
const icoPause = document.getElementById('ico-pause');
const icoPlay  = document.getElementById('ico-play');

function startAudio() {
  audio.volume = 0.45;
  audio.play().catch(() => {});
  gate.classList.add('hide');
  setTimeout(() => { gate.style.display = 'none'; }, 550);
  player.classList.remove('hidden');
  document.removeEventListener('click', startAudio, true);
}

gate.addEventListener('click', startAudio);
document.addEventListener('click', startAudio, true);

plBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (audio.paused) {
    audio.play();
    icoPause.classList.remove('hidden');
    icoPlay.classList.add('hidden');
  } else {
    audio.pause();
    icoPause.classList.add('hidden');
    icoPlay.classList.remove('hidden');
  }
});

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
});
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
  }
});

const revealEls = document.querySelectorAll('.feat-col, .tut-card, .faq-item, .vip-price-card, .about-block, .dev-block, .form-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 4) * 60}ms`;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const fSubmit   = document.getElementById('f-submit');
const fResponse = document.getElementById('form-response');
fSubmit.addEventListener('click', async () => {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-msg').value.trim();

  fResponse.className = 'form-response';
  fResponse.textContent = '';

  if (!name || !email || !message) {
    fResponse.textContent = '⚠ Please fill in all fields.';
    fResponse.classList.add('err');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fResponse.textContent = '⚠ Please enter a valid email.';
    fResponse.classList.add('err');
    return;
  }

  fSubmit.disabled = true;
  fSubmit.textContent = 'Sending...';

  try {
    const res  = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if (data.success) {
      fResponse.textContent = '✓ ' + data.message;
      fResponse.classList.add('ok');
      document.getElementById('f-name').value = '';
      document.getElementById('f-email').value = '';
      document.getElementById('f-msg').value = '';
    } else {
      fResponse.textContent = '⚠ ' + (data.message || 'Something went wrong.');
      fResponse.classList.add('err');
    }
  } catch {
    fResponse.textContent = '⚠ Could not connect to server. Please try again.';
    fResponse.classList.add('err');
  }

  fSubmit.disabled = false;
  fSubmit.textContent = 'Send Message';
});