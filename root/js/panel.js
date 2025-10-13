const panels = Array.from(document.querySelectorAll('.panel'))

if (panels.length === 0) {
    // nothing to do
}

let currentIndex = panels.findIndex(p => p.classList.contains('active'))
if (currentIndex === -1) currentIndex = 0

const AUTO_INTERVAL = 3000
let autoTimer = null

function removeActiveClasses() {
    panels.forEach(panel => panel.classList.remove('active'))
}

function showPanel(index) {
    if (index < 0) index = panels.length - 1
    if (index >= panels.length) index = 0
    removeActiveClasses()
    panels[index].classList.add('active')
    currentIndex = index
}

function showNext() {
    showPanel((currentIndex + 1) % panels.length)
}

function showPrev() {
    showPanel((currentIndex - 1 + panels.length) % panels.length)
}

function startAuto() {
    stopAuto()
    autoTimer = setInterval(showNext, AUTO_INTERVAL)
}

function stopAuto() {
    if (autoTimer) {
        clearInterval(autoTimer)
        autoTimer = null
    }
}

// click behavior (desktop/tap)
panels.forEach((panel, idx) => {
    panel.addEventListener('click', () => {
        showPanel(idx)
    })
})

// Start autoplay
startAuto()

// Pause on hover (desktop)
panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => stopAuto())
    panel.addEventListener('mouseleave', () => startAuto())
})

// Touch / swipe support for mobile
panels.forEach(panel => {
    let touchStartX = 0
    let touchStartY = 0
    let touchMoved = false

    panel.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return
        const t = e.touches[0]
        touchStartX = t.clientX
        touchStartY = t.clientY
        touchMoved = false
        stopAuto()
    }, { passive: true })

    panel.addEventListener('touchmove', (e) => {
        if (!e.touches || e.touches.length === 0) return
        const t = e.touches[0]
        const dx = t.clientX - touchStartX
        const dy = t.clientY - touchStartY
        // if horizontal move is greater than vertical, prevent accidental vertical scroll
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
            touchMoved = true
            // preventDefault would block scrolling; keep passive true but don't call preventDefault here
        }
    }, { passive: true })

    panel.addEventListener('touchend', (e) => {
        // On touchend decide swipe direction
        if (!touchMoved) {
            // small tap — do nothing, click handler will handle it
            startAuto()
            return
        }
        // Use changedTouches to compute final position
        const t = e.changedTouches && e.changedTouches[0]
        if (!t) { startAuto(); return }
        const dx = t.clientX - touchStartX
        const dy = t.clientY - touchStartY
        // threshold and ensure mostly horizontal
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) {
                // swipe left -> next
                showNext()
            } else {
                // swipe right -> prev
                showPrev()
            }
        }
        startAuto()
    }, { passive: true })

    // pointer fallback (for some browsers/devices)
    let pointerStartX = 0
    panel.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return // handled by touch events
        pointerStartX = e.clientX
        stopAuto()
        panel.setPointerCapture && panel.setPointerCapture(e.pointerId)
    })
    panel.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') return
        const dx = e.clientX - pointerStartX
        if (Math.abs(dx) > 40) {
            if (dx < 0) showNext(); else showPrev()
        }
        startAuto()
    })
})