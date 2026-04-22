const boxesContainer = document.getElementById('boxes')
const btn = document.getElementById('btn')

btn.addEventListener('click', () => {
  boxesContainer.classList.toggle('big')
  
  const boxes = document.querySelectorAll('.box')
  boxes.forEach((box, index) => {
    const row = Math.floor(index / 4)
    const col = index % 4
    const delay = (row + col) * 0.05
    box.style.transitionDelay = `${delay}s`
  })
})

function createBoxes() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const box = document.createElement('div')
      box.classList.add('box')
      box.style.backgroundPosition = `${-j * 125}px ${-i * 125}px`
      boxesContainer.appendChild(box)
    }
  }
}

createBoxes()
