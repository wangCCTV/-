const settingsPanel = document.getElementById('settings-panel');
const countdownDisplay = document.getElementById('countdown-display');
const countdownFinished = document.getElementById('countdown-finished');

const hoursInput = document.getElementById('countdown-hours');
const minutesInput = document.getElementById('countdown-minutes');
const secondsInput = document.getElementById('countdown-seconds');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');

const hoursClock = document.getElementById('hours-clock');
const minutesClock = document.getElementById('minutes-clock');
const secondsClock = document.getElementById('seconds-clock');

let countdownTimer = null;
let isPaused = false;
let remainingTime = 0;
let totalSeconds = 0;

function padZero(num) {
  return num.toString().padStart(2, '0');
}

function parseTime() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: padZero(hours),
    minutes: padZero(minutes),
    seconds: padZero(seconds)
  };
}

function createFlipCard(value) {
  const card = document.createElement('div');
  card.className = 'flip-card';
  card.innerHTML = `
    <div class="flip-card-top">${value}</div>
    <div class="flip-card-bottom">${value}</div>
  `;
  return card;
}

function initializeClock(clockElement, value) {
  clockElement.innerHTML = '';
  const card = createFlipCard(value);
  card.dataset.currentValue = value;
  clockElement.appendChild(card);
}

function updateClock(clockElement, newValue) {
  const currentCard = clockElement.querySelector('.flip-card');
  
  if (!currentCard) {
    initializeClock(clockElement, newValue);
    return;
  }

  const currentValue = currentCard.dataset.currentValue;
  
  if (newValue === currentValue) {
    return;
  }

  const newCard = createFlipCard(newValue);
  newCard.dataset.currentValue = newValue;
  newCard.style.zIndex = '1';
  
  currentCard.style.zIndex = '2';
  currentCard.classList.add('flipping');
  currentCard.classList.add('flip-out');

  clockElement.insertBefore(newCard, currentCard);

  setTimeout(() => {
    if (currentCard.parentNode) {
      currentCard.remove();
    }
    newCard.classList.remove('flip-in');
  }, 650);
}

function updateDisplay(time) {
  const { hours, minutes, seconds } = formatTime(time);

  updateClock(hoursClock, hours);
  updateClock(minutesClock, minutes);
  updateClock(secondsClock, seconds);
}

function startCountdown() {
  totalSeconds = parseTime();
  
  if (totalSeconds <= 0) {
    alert('请设置有效的倒计时时间');
    return;
  }

  remainingTime = totalSeconds;
  isPaused = false;

  const { hours, minutes, seconds } = formatTime(remainingTime);
  initializeClock(hoursClock, hours);
  initializeClock(minutesClock, minutes);
  initializeClock(secondsClock, seconds);

  settingsPanel.style.display = 'none';
  countdownFinished.style.display = 'none';
  countdownDisplay.style.display = 'flex';

  pauseBtn.textContent = '暂停';

  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  countdownTimer = setInterval(() => {
    if (!isPaused) {
      if (remainingTime <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        showFinished();
        return;
      }
      remainingTime--;
      updateDisplay(remainingTime);
    }
  }, 1000);
}

function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '继续' : '暂停';
}

function resetCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  
  remainingTime = totalSeconds;
  isPaused = false;
  pauseBtn.textContent = '暂停';
  
  const { hours, minutes, seconds } = formatTime(remainingTime);
  initializeClock(hoursClock, hours);
  initializeClock(minutesClock, minutes);
  initializeClock(secondsClock, seconds);
}

function showFinished() {
  countdownDisplay.style.display = 'none';
  countdownFinished.style.display = 'flex';
  
  playSound();
}

function playSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  } catch (e) {
    console.log('音频播放失败:', e);
  }
}

function restart() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  
  countdownFinished.style.display = 'none';
  countdownDisplay.style.display = 'none';
  settingsPanel.style.display = 'flex';
}

startBtn.addEventListener('click', startCountdown);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetCountdown);
restartBtn.addEventListener('click', restart);

[hoursInput, minutesInput, secondsInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      startCountdown();
    }
  });
});
