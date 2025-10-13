const panels = Array.from(document.querySelectorAll('.panel'))

if (panels.length === 0) {

}

let currentIndex = panels.findIndex(p => p.classList.contains('active'))
if (currentIndex === -1) currentIndex = 0

function removeActiveClasses() {
    panels.forEach(panel => panel.classList.remove('active'))
}

function showPanel(index) {
    removeActiveClasses()
    panels[index].classList.add('active')
    currentIndex = index
}

panels.forEach((panel, idx) => {
    panel.addEventListener('click', () => {
        showPanel(idx)
    })
})

// Auto-advance: change panel every 1000ms (1 second)
const AUTO_INTERVAL = 3000
let autoTimer = setInterval(() => {
    const next = (currentIndex + 1) % panels.length
    showPanel(next)
}, AUTO_INTERVAL)

// Optional: pause auto-advance while the user hovers any panel
panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => clearInterval(autoTimer))
    panel.addEventListener('mouseleave', () => {
        // restart timer
        clearInterval(autoTimer)
        autoTimer = setInterval(() => {
            const next = (currentIndex + 1) % panels.length
            showPanel(next)
        }, AUTO_INTERVAL)
    })
})