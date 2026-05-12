// ============================================
// THEME SYSTEM
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ============================================
// SMOOTH SCROLLING FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.about-card, .project-card, .skill-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ============================================
// MODAL GALLERY FOR PROJECTS
// ============================================

const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalImageCaption');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

// Project gallery data
const projectGalleries = {
    'bookmark': [
        {
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=700&fit=crop',
            caption: 'Bookmark Design - Giao diện chính'
        },
        {
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=700&fit=crop',
            caption: 'Bookmark Design - Chi tiết chức năng'
        },
        {
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=700&fit=crop',
            caption: 'Bookmark Design - Prototype'
        }
    ],
    '3d-model': [
        {
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=700&fit=crop',
            caption: '3D Model Design - Khái niệm ban đầu'
        },
        {
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=700&fit=crop',
            caption: '3D Model Design - Mô hình 3D'
        },
        {
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=700&fit=crop',
            caption: '3D Model Design - Giao diện cuối cùng'
        }
    ]
};

let currentGallery = '';
let currentImageIndex = 0;

// Open gallery modal
document.querySelectorAll('.btn-view-project').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const project = this.getAttribute('data-project');
        openGallery(project, 0);
    });
});

function openGallery(project, index) {
    currentGallery = project;
    currentImageIndex = index;
    
    if (projectGalleries[project]) {
        showImage(index);
        modal.classList.add('active');
    }
}

function showImage(index) {
    const gallery = projectGalleries[currentGallery];
    if (!gallery) return;
    
    // Wrap around
    if (index >= gallery.length) {
        currentImageIndex = 0;
    } else if (index < 0) {
        currentImageIndex = gallery.length - 1;
    } else {
        currentImageIndex = index;
    }
    
    const imageData = gallery[currentImageIndex];
    modalImage.src = imageData.image;
    modalCaption.textContent = imageData.caption;
}

// Close modal
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('active');
}

// Navigation in modal
modalPrev.addEventListener('click', () => {
    showImage(currentImageIndex - 1);
});

modalNext.addEventListener('click', () => {
    showImage(currentImageIndex + 1);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        showImage(currentImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
        showImage(currentImageIndex + 1);
    } else if (e.key === 'Escape') {
        closeModal();
    }
});

// ============================================
// SKILL PROGRESS ANIMATION ON SCROLL
// ============================================

const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger the animation by ensuring the width is set
            const currentWidth = entry.target.style.width;
            entry.target.style.width = '0%';
            
            // Force reflow to restart animation
            void entry.target.offsetWidth;
            
            entry.target.style.width = currentWidth;
            skillObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
});

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHT
// ============================================

const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const fromTop = window.scrollY;
    
    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;
        
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (fromTop >= sectionTop && fromTop < sectionBottom) {
            link.style.color = 'var(--color-primary)';
            // Make underline persistent for active link
            link.classList.add('active');
        } else {
            link.style.color = 'var(--color-dark)';
            link.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// PROJECT IMAGE CLICK SUPPORT
// ============================================

document.querySelectorAll('.project-image').forEach(img => {
    img.addEventListener('click', function() {
        const project = this.getAttribute('data-project');
        openGallery(project, 0);
    });
});

// ============================================
// SCROLL TO TOP FUNCTIONALITY
// ============================================

const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.textContent = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

// Add styles for scroll to top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: var(--shadow-lg);
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .scroll-to-top:hover {
        background-color: var(--color-accent);
        transform: translateY(-5px);
    }
    
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 20px;
        }
    }
`;
document.head.appendChild(style);
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.5s ease-out';
});

// ============================================
// PRELOAD IMAGES
// ============================================

function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=700&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=700&fit=crop'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Preload images after page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}
