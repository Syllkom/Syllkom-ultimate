document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code from your script.js) ...
    const navLinks = document.querySelectorAll('.main-nav .nav-link')
    const menuToggle = document.querySelector('.menu-toggle')
    const mainNav = document.querySelector('.main-nav')
    const currentYearSpan = document.getElementById('current-year')
    const sections = document.querySelectorAll('section[id]')
    const siteHeader = document.querySelector('.site-header')

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear()
    }

    function getHeaderHeight() {
        return siteHeader ? siteHeader.offsetHeight : 0
    }

    function setActiveLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active')
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active')
            }
        })
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault()
            const sectionId = this.getAttribute('href').substring(1)
            const targetSection = document.getElementById(sectionId)

            if (targetSection) {
                const headerHeight = getHeaderHeight()
                if (siteHeader.classList.contains('header-hidden-on-scroll')) {
                     siteHeader.classList.remove('header-hidden-on-scroll')
                     setTimeout(() => {
                        window.scrollTo({
                            top: targetSection.offsetTop - headerHeight,
                            behavior: 'smooth'
                        })
                     }, 50)
                } else {
                    window.scrollTo({
                        top: targetSection.offsetTop - headerHeight,
                        behavior: 'smooth'
                    })
                }
                setActiveLink(sectionId)

                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active')
                    menuToggle.classList.remove('active')
                    menuToggle.setAttribute('aria-expanded', 'false')
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
                }
            }
        })
    })

    const internalNavTriggers = document.querySelectorAll('.nav-trigger')
    internalNavTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault()
            const sectionId = trigger.getAttribute('href').substring(1) || trigger.dataset.section
            const targetSectionElement = document.getElementById(sectionId)
            if (targetSectionElement) {
                const headerHeight = getHeaderHeight()
                if (siteHeader.classList.contains('header-hidden-on-scroll')) {
                     siteHeader.classList.remove('header-hidden-on-scroll')
                     setTimeout(() => {
                        window.scrollTo({
                            top: targetSectionElement.offsetTop - headerHeight,
                            behavior: 'smooth'
                        })
                     }, 50)
                } else {
                    window.scrollTo({
                        top: targetSectionElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    })
                }
                setActiveLink(sectionId)
            }
        })
    })

    function onScroll() {
        const headerHeight = getHeaderHeight()
        let currentSectionId = ''

        const scrollPosition = window.scrollY + headerHeight + 50

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                currentSectionId = section.getAttribute('id')
            }
        })

        if (!currentSectionId && sections.length > 0 && window.scrollY < sections[0].offsetTop - headerHeight) {
            currentSectionId = sections[0].getAttribute('id')
        } else if (!currentSectionId && window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id')
            }
        }

        if (currentSectionId) {
            setActiveLink(currentSectionId)
        } else {
            navLinks.forEach(link => link.classList.remove('active'))
        }
    }

    window.addEventListener('scroll', onScroll)

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active')
            menuToggle.classList.toggle('active')
            const isExpanded = mainNav.classList.contains('active')
            menuToggle.setAttribute('aria-expanded', isExpanded)
            if (isExpanded) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>'
                if (siteHeader && siteHeader.classList.contains('header-hidden-on-scroll')) {
                    siteHeader.classList.remove('header-hidden-on-scroll')
                }
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
            }
        })
    }

    function attachProjectFilters() {
        const filterButtons = document.querySelectorAll('#proyectos .filter-btn')
        const projectCards = document.querySelectorAll('#proyectos .project-card')

        if (!filterButtons.length || !projectCards.length) return

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'))
                button.classList.add('active')
                const filter = button.dataset.filter
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'flex'
                    } else {
                        card.style.display = 'none'
                    }
                })
            })
        })
    }
    attachProjectFilters()

    function handleInitialLoadOrPopState() {
        const hash = window.location.hash.substring(1)
        const sectionToLoad = hash || (sections.length > 0 ? sections[0].getAttribute('id') : null)

        if (sectionToLoad) {
            const targetSection = document.getElementById(sectionToLoad)
            if (targetSection) {
                setActiveLink(sectionToLoad)
                setTimeout(onScroll, 50)
                if (hash && siteHeader && siteHeader.classList.contains('header-hidden-on-scroll')) {
                }
            }
        } else {
            if (sections.length > 0) setActiveLink(sections[0].getAttribute('id'))
            else navLinks.forEach(link => link.classList.remove('active'))
            onScroll()
        }
    }

    window.addEventListener('popstate', handleInitialLoadOrPopState)
    handleInitialLoadOrPopState()
    setTimeout(onScroll, 100)

    let lastScrollY = window.scrollY

    function isMobileView() {
        return menuToggle && getComputedStyle(menuToggle).display !== 'none'
    }

    function handleMobileNavScroll() {
        if (!siteHeader) return

        if (!isMobileView()) {
            siteHeader.classList.remove('header-hidden-on-scroll')
            return
        }

        const currentScrollY = window.scrollY
        const headerHeight = siteHeader.offsetHeight

        if (mainNav.classList.contains('active')) {
            siteHeader.classList.remove('header-hidden-on-scroll')
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY
            return
        }

        if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
            siteHeader.classList.add('header-hidden-on-scroll')
        } else if (currentScrollY < lastScrollY || currentScrollY <= 0) {
            siteHeader.classList.remove('header-hidden-on-scroll')
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY
    }

    window.addEventListener('scroll', handleMobileNavScroll, { passive: true })
    window.addEventListener('resize', () => {
        lastScrollY = window.scrollY
        handleMobileNavScroll()
    })
    
    const contactForm = document.getElementById('contact-form')
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault()
            
            const name = document.getElementById('name').value.trim()
            const email = document.getElementById('email').value.trim()
            const subject = document.getElementById('subject').value.trim()
            const message = document.getElementById('message').value.trim()
            
            const whatsappMessage = `Hola, soy *${name}.*\n- Asunto: ${subject}\n- Email: ${email}\n*Mensaje:* ${message}`
            
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            const whatsappLink = `https://wa.me/573113825327?text=${encodedMessage}`;
            window.open(whatsappLink, '_blank')
        })
    }
})