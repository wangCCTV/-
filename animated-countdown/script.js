const settings = document.querySelector('.settings')
const counter = document.querySelector('.counter')
const finalMessage = document.querySelector('.final')
const replay = document.querySelector('#replay')
const startBtn = document.querySelector('#start-btn')
const countdownTimeInput = document.querySelector('#countdown-time')
const animationStyleSelect = document.querySelector('#animation-style')
const numsContainer = document.querySelector('#nums-container')
const particlesContainer = document.querySelector('#particles')

let currentAnimationStyle = 'rotate'
let animationEndEvents = []

const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63', '#00bcd4']

function createParticles() {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.classList.add('particle')
    particle.style.left = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 15 + 's'
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's'
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    particlesContainer.appendChild(particle)
  }
}

function createCelebrationParticles() {
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const particle = document.createElement('div')
      particle.classList.add('celebration-particle')
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = '50%'
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      particle.style.animationDuration = (Math.random() * 2 + 1) + 's'
      particlesContainer.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 3000)
    }, i * 20)
  }
}

function generateNumbers(count) {
  numsContainer.innerHTML = ''
  for (let i = count; i >= 0; i--) {
    const span = document.createElement('span')
    span.textContent = i
    numsContainer.appendChild(span)
  }
}

function resetDOM() {
  counter.classList.remove('hide')
  finalMessage.classList.remove('show')
  settings.classList.remove('hide')
  
  animationEndEvents.forEach(handler => handler.remove())
  animationEndEvents = []
}

function runAnimation(style) {
  const nums = document.querySelectorAll('.nums span')
  if (nums.length === 0) return

  nums[0].classList.add('in', style)

  nums.forEach((num, idx) => {
    const nextToLast = nums.length - 1
    
    const handler = (e) => {
      const animInName = `goIn${style.charAt(0).toUpperCase() + style.slice(1)}`
      const animOutName = `goOut${style.charAt(0).toUpperCase() + style.slice(1)}`
      
      if (e.animationName === animInName && idx !== nextToLast) {
        num.classList.remove('in')
        num.classList.add('out')
      } else if (e.animationName === animOutName && num.nextElementSibling) {
        num.nextElementSibling.classList.add('in', style)
      } else {
        counter.classList.add('hide')
        finalMessage.classList.add('show')
        createCelebrationParticles()
      }
    }
    
    num.addEventListener('animationend', handler)
    animationEndEvents.push({ remove: () => num.removeEventListener('animationend', handler) })
  })
}

function startCountdown() {
  const time = parseInt(countdownTimeInput.value) || 3
  const style = animationStyleSelect.value
  
  if (time < 1 || time > 60) {
    alert('请输入1-60之间的数字')
    return
  }

  currentAnimationStyle = style
  settings.classList.add('hide')
  counter.classList.remove('hide')
  
  generateNumbers(time)
  runAnimation(style)
}

startBtn.addEventListener('click', startCountdown)

replay.addEventListener('click', () => {
  resetDOM()
})

countdownTimeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    startCountdown()
  }
})

createParticles()
