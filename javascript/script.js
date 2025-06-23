window.addEventListener('load', () => {
  document.querySelector('.container1').classList.add('visible')
  document.querySelector('.about').classList.add('visible')
});

const slides = document.querySelectorAll('.offer__slide');
let slideIndex = 0;

function showSlides() {
  slides.forEach(slide => slide.style.display = 'none');

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = 'block';
}


showSlides();


setInterval(showSlides, 3000)

const upElements = document.querySelectorAll('.slide-on-scroll-up');

const observer1 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.1
});

upElements.forEach(el => observer1.observe(el));

class Catalog {
  constructor(src, title, descr, discount, sale, parentSelector) {
    this.src = src
    this.title = title
    this.descr = descr
    this.discount = discount
    this.sale = sale
    this.parent = document.querySelector(parentSelector)
    this.formatToUSD()
  }

  formatToUSD() {
    this.discount = this.discount.toLocaleString("en-US", { style: "currency", currency: "USD" })
    this.sale = this.sale.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }

  render() {
    const element = document.createElement("div")
    element.classList.add('cotalig')
    element.innerHTML = `
    <img src="${this.src}">
    <div>
    <h3>${this.title}</h3>
    <p>${this.descr}</p>
    <p><del>${this.discount}</del> <span class="primary-text">${this.sale}</span></p>
    </div>
    `

    this.parent.append(element)
  }
}

const flowers = [
  {
    src: "./img/rasm14.jpg",
    title: " Atirgul (Rosa)",
    descr: "Tavsifi: Eng mashhur va sevgi ramzi bo‘lgan gul. Turli ranglarda (qizil, oq, sariq, pushti) mavjud",
    discount: 55,
    sale: 20,
  },
  {
    src: "./img/rasm10.jpg",
    title: "Lola (Tulip)",
    descr: "Bahorda ochiladigan rang-barang, yelkan shaklida barglarga ega gul.",
    discount: 75,
    sale: 25,
  },
  {
    src: "./img/rasm7.jpg",
    title: " Naychagul (Lily)",
    descr: "Katta va xushbo‘y gul. Asosan oq, sariq, pushti ranglarda bo‘ladi.",
    discount: 25,
    sale: 15,
  },
  {
    src: "./img/rasm6.jpg",
    title: "Orkideya (Orchid)",
    descr: "Egzotik ko‘rinishdagi murakkab shaklli gul. Juda nafis.",
    discount: 45,
    sale: 18,
  },
  {
    src: "./img/rasm5.jpg",
    title: "Nastarin (Jasmine)",
    descr: "Kichik oq yoki sariq gullar. Juda kuchli va yoqimli iforga ega.",
    discount: 75,
    sale: 25,
  },
  {
    src: "./img/rasm17.jpg",
    title: "Rayhon gul (Lavender)",
    descr: "Mayda binafsha gullar to‘plami. Xushbo‘y va tinchlantiruvchi ta'sirga ega.",
    discount: 25,
    sale: 25,
  }
]
flowers.forEach(flower => {
  const { src, descr, discount, sale, title } = flower
  new Catalog(src, title, descr, discount, sale, ".catalog").render()
})

const deadline = '2025-06-30'

function getTimeRemining(endtime) {
  let days, houres, minutes, secondes
  const time = Date.parse(endtime) - Date.parse(new Date())

  if (time <= 0) {
    days = 0
    houres = 0
    minutes = 0
    secondes = 0
  } else {
    days = Math.floor(time / (1000 * 60 * 60 * 24))
    houres = Math.floor((time / (1000 * 60 * 60)) % 24)
    minutes = Math.floor((time / (1000 * 60)) % 60)
    secondes = Math.floor((time / 1000) % 60)
  }
  return {
    totelTime: time,
    days,
    houres,
    minutes,
    secondes
  }
}

function furmatNumber(number) {
  if (number >= 0 && number < 10) {
    return `0${number}`
  } else {
    return number
  }
}

function setClock(selector, endtime) {
  const timer = document.querySelector(selector),
    days = timer.querySelector('#days'),
    houres = timer.querySelector('#hours'),
    minutes = timer.querySelector('#minutes'),
    secondes = timer.querySelector('#seconds'),
    timeInterval = setInterval(updateClock, 1000)

  updateClock()
  function updateClock() {
    const time = getTimeRemining(endtime)

    days.textContent = furmatNumber(time.days)
    houres.textContent = furmatNumber(time.houres)
    minutes.textContent = furmatNumber(time.minutes)
    secondes.textContent = furmatNumber(time.secondes)

    if (time.totelTime <= 0) {
      clearInterval(timeInterval)
    }
  }
}
setClock('.timer', deadline)

// telegtam botga contactni ulash

const form = document.querySelector('form'),
  telegramTokenBot = "7677562356:AAE9y_2TCRs79Vj6fEmO4vzjWRcCx1q6XM0",
  chatId = '6221497201'


const message = {
  loading: 'Loading...',
  success: 'thanks for contacting with us',
  failure: 'Something went wrong',
}

form.addEventListener('submit', event => {
  event.preventDefault()

  const loader = document.createElement('div')
  loader.classList.add('loader')
  loader.style.width = '25px'
  loader.style.height = '25px'
  loader.style.marginTop = '20px'
  form.append(loader)

  const formData = new FormData(form)

  const obj = {}
  formData.forEach((value, key) => {
    obj[key] = value
  })

  fetch(`https://api.telegram.org/bot${telegramTokenBot}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: ` Name:${obj.name}, Phone: ${obj.phone}`,
    }),
  })
    .then(() => {
      showStatusMessage(message.success)
      form.reset()
    })
    .catch(() => {
      showStatusMessage(message.failure)
        .finally(() => form.value.remove())
    })
})
// telegram
function showStatusMessage(message) {
  const statusModal = document.createElement('div')
  statusModal.classList.add('modal__dialog')
  statusModal.innerHTML = `<div class="modal__title">${message}</div>`
  document.querySelector('.modal').append(statusModal)

  setTimeout(() => {
    statusModal.remove()
  }, 4000)
}

function showSidebar() {
  const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'flex'
  sidebar.addEventListener('click', event=>{
    if(event.target.classList.contains('btn')){
      setTimeout(() => {
        sidebar.style.display='none'
      }, 300);
    }
  })
  document.body.classList.add('noscroll')
}
function hideSidebar() {
  const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'none'
  document.body.classList.remove('noscroll')
}
