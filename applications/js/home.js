// nav

const toggleBtn = document.querySelector(".toggle-btn");
const toggleBtnIcon = document.querySelector(".toggle-btn i");
const dropdown = document.querySelector(".dropdown");

toggleBtn.onclick = function () {
  dropdown.classList.toggle("open");
  const isOpen = dropdown.classList.contains("open");
  toggleBtnIcon.classList = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
};



// end-nav

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".button-next",
    prevEl: ".button-prev",
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    "@1.50": {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  },
});

var swiper = new Swiper(".mySwiper2", {
  effect: "fade",
  speed: 600,
  loop: true,
  parallax: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});



    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value,
            phone: document.querySelector('#phone').value,
            faculty: document.querySelector('#faculty').value,
            college: document.querySelector('#collage').value, 
            level: document.querySelector('#level').value,
            strengths: document.querySelector('#strengths').value, 
            weaknesses: document.querySelector('#weaknesses').value,
            committee: document.querySelector('#weakness-options').value,
        };

        try {
           
            const response = await axios.post('http://your-laravel-app-url/api/applications', data);
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    });

