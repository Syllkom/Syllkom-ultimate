document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher()
    initRainEffect()
    enhanceAnimations()
    
    
    function initThemeSwitcher() {
        const themeSwitcher = document.createElement('div')
        themeSwitcher.className = 'theme-switcher'
        themeSwitcher.innerHTML = '<i class="fas fa-palette"></i>'
        
        const themeOptions = document.createElement('div')
        themeOptions.className = 'theme-options'
        
        const themes = [
            { name: 'night', icon: 'theme-icon-night', text: 'Noche', faIcon: 'fa-moon' },
            { name: 'day', icon: 'theme-icon-day', text: 'Día', faIcon: 'fa-sun' },
            { name: 'gray', icon: 'theme-icon-gray', text: 'Gris', faIcon: 'fa-adjust' },
            { name: 'rain', icon: 'theme-icon-rain', text: 'Lluvia', faIcon: 'fa-cloud-rain' }
        ]
        
        themes.forEach(theme => {
            const option = document.createElement('div')
            option.className = `theme-option ${theme.name === 'night' ? 'active' : ''}`
            option.dataset.theme = theme.name
            option.innerHTML = `
                <div class="theme-option-icon ${theme.icon}"></div>
                <span class="theme-option-text">${theme.text}</span>
                <i class="fas ${theme.faIcon}" style="margin-left: auto"></i>
            `
            themeOptions.appendChild(option)
            
            option.addEventListener('click', function() {
                setTheme(theme.name)
                
                document.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.remove('active')
                })
                option.classList.add('active')
            })
        })
        
        themeSwitcher.addEventListener('click', function() {
            themeOptions.classList.toggle('active')
        })
        
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.theme-switcher') && 
                !event.target.closest('.theme-options')) {
                themeOptions.classList.remove('active')
            }
        })
        
        document.body.appendChild(themeOptions)
        document.body.appendChild(themeSwitcher)
        
        const savedTheme = localStorage.getItem('portfolio-theme')
        if (savedTheme) {
            setTheme(savedTheme)
            document.querySelectorAll('.theme-option').forEach(opt => {
                if (opt.dataset.theme === savedTheme) {
                    opt.classList.add('active')
                } else {
                    opt.classList.remove('active')
                }
            })
        }
    }
    
    function setTheme(themeName) {
        document.body.classList.remove('theme-night', 'theme-day', 'theme-gray', 'theme-rain')
        
        if (themeName !== 'night') {
            document.body.classList.add(`theme-${themeName}`)
        }
        
        localStorage.setItem('portfolio-theme', themeName)
    }
    
    function initRainEffect() {
        const rainContainer = document.createElement('div')
        rainContainer.className = 'rain-container'
        document.body.appendChild(rainContainer)
        
        createRainDrops(100)
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (document.body.classList.contains('theme-rain')) {
                        if (rainContainer.children.length < 100) {
                            createRainDrops(100 - rainContainer.children.length)
                        }
                    }
                }
            })
        })
        
        observer.observe(document.body, { attributes: true })
        
        function createRainDrops(amount) {
            for (let i = 0; i < amount; i++) {
                setTimeout(() => {
                    const drop = document.createElement('div')
                    drop.className = 'rain-drop'
                    
                    const size = Math.random() * 3 + 1
                    const posX = Math.random() * 100
                    const duration = Math.random() * 1 + 0.5
                    const delay = Math.random() * 2
                    
                    drop.style.height = `${Math.random() * 30 + 10}px`
                    drop.style.left = `${posX}%`
                    drop.style.width = `${size}px`
                    drop.style.animationDuration = `${duration}s`
                    drop.style.animationDelay = `${delay}s`
                    
                    rainContainer.appendChild(drop)
                    
                    drop.addEventListener('animationiteration', () => {
                        drop.style.left = `${Math.random() * 100}%`
                        drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`
                    })
                }, i * 20)
            }
        }
    }
})