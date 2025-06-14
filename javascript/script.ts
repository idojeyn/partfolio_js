window.addEventListener('load', () => {
  (document.querySelector('.container1') as HTMLElement).classList.add('visible');
  (document.querySelector('.about') as HTMLElement).classList.add('visible');
});

const slides: NodeListOf<HTMLElement> = document.querySelectorAll('.offer__slide');
let slideIndex: number = 0;

function showSlides(): void {
  slides.forEach(slide => slide.style.display = 'none');
  slideIndex = (slideIndex + 1) > slides.length ? 1 : slideIndex + 1;
  slides[slideIndex - 1].style.display = 'block';
}

showSlides();
setInterval(showSlides, 3000);

// IntersectionObserver
const upElements = document.querySelectorAll('.slide-on-scroll-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

upElements.forEach(el => observer.observe(el));

class Catalog {
  src: string;
  title: string;
  descr: string;
  discount: number;
  sale: number;
  parent: HTMLElement;

  constructor(src: string, title: string, descr: string, discount: number, sale: number, parentSelector: string) {
    this.src = src;
    this.title = title;
    this.descr = descr;
    this.discount = discount;
    this.sale = sale;
    this.parent = document.querySelector(parentSelector)!;
  }

  render(): void {
    const el = document.createElement("div");
    el.classList.add("cotalig");
    el.innerHTML = `
      <img src="${this.src}" />
      <h3>${this.title}</h3>
      <p>${this.descr}</p>
      <p><del>$${this.discount}</del> <span class="primary-text">$${this.sale}</span></p>
    `;
    this.parent.append(el);
  }
}

const flowers = [
  { src: "img1.jpg", title: "Tulip", descr: "Beautiful tulip", discount: 15, sale: 10 },
  { src: "img2.jpg", title: "Rose", descr: "Red rose", discount: 20, sale: 14 },
];

flowers.forEach(flower => {
  const { src, title, descr, discount, sale } = flower;
  new Catalog(src, title, descr, discount, sale, '.catalog').render();
});

// Timer
const deadline = '2025-06-30';

function getTimeRemaining(endtime: string) {
  const t = Date.parse(endtime) - Date.parse(new Date().toString());
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((t / (1000 * 60)) % 60);
  const seconds = Math.floor((t / 1000) % 60);
  return { totalTime: t, days, hours, minutes, seconds };
}

function formatNumber(n: number): string {
  return n < 10 ? `0${n}` : n.toString();
}

function setClock(selector: string, endtime: string): void {
  const timer = document.querySelector(selector)!;
  const days = timer.querySelector('#days')!;
  const hours = timer.querySelector('#hours')!;
  const minutes = timer.querySelector('#minutes')!;
  const seconds = timer.querySelector('#seconds')!;
  const timeInterval = setInterval(updateClock, 1000);

  function updateClock() {
    const t = getTimeRemaining(endtime);
    days.textContent = formatNumber(t.days);
    hours.textContent = formatNumber(t.hours);
    minutes.textContent = formatNumber(t.minutes);
    seconds.textContent = formatNumber(t.seconds);

    if (t.totalTime <= 0) {
      clearInterval(timeInterval);
    }
  }

  updateClock();
}

setClock('.timer', deadline);

// Telegram forma
const form = document.querySelector('form');
const telegramTokenBot = "BOT_TOKEN_HERE";
const chatId = "CHAT_ID_HERE";

const message = {
  loading: 'Loading...',
  success: 'Thanks for contacting us',
  failure: 'Something went wrong'
};

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const loader = document.createElement('div');
  loader.className = 'loader';
  form.append(loader);

  const formData = new FormData(form);
  const data: { [key: string]: string } = {};
  formData.forEach((v, k) => data[k] = v.toString());

  fetch(`https://api.telegram.org/bot${telegramTokenBot}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Name: ${data.name}, Phone: ${data.phone}`
    })
  }).then(() => {
    showStatusMessage(message.success);
    form.reset();
    loader.remove();
  }).catch(() => {
    showStatusMessage(message.failure);
    loader.remove();
  });
});

function showStatusMessage(msg: string) {
  const el = document.createElement('div');
  el.className = 'modal__dialog';
  el.textContent = msg;
  document.querySelector('.modal')?.append(el);
  setTimeout(() => el.remove(), 4000);
}
