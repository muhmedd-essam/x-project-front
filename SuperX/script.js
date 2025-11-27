const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameOver = document.querySelector('.game_over');

let time = 0;
const timeDisplay = document.createElement('div'); // لإنشاء عنصر لعرض الوقت
timeDisplay.className = 'time-display';
document.body.appendChild(timeDisplay); // إضافته لصفحة اللعبة

const jump = () => {
  mario.classList.add('jump');

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 500);
};

const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
  const cloudsPosition = +window.getComputedStyle(clouds).left.replace('px', '');

  // الشرط عند الاصطدام
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    clouds.style.animation = 'none';
    clouds.style.left = `${cloudsPosition}px`;

    mario.src = "images/game-over.png";
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOver.textContent = `Game Over`;
    const timeMessage = document.createElement('div'); // لعرض الوقت النهائي
    timeMessage.textContent = `Time Survived: ${time} seconds`;
    gameOver.appendChild(timeMessage);

    clearInterval(loop);
    clearInterval(timer); // وقف التايمر
  }
}, 10);

// مؤقت لحساب وقت اللعب
const timer = setInterval(() => {
  time++;
  timeDisplay.textContent = `Time: ${time} seconds`; // تحديث عرض الوقت
}, 1000);

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump); // إضافة دعم للمس
