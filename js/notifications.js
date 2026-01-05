function addToastContainer(){
    if(!document.getElementById("tpiNotification_toastContainer")){
        const tpi_toastContainer = document.createElement("div")
        tpi_toastContainer.className = "tpi-notification_container"
        tpi_toastContainer.id = "tpiNotification_toastContainer"
        document.querySelector("body").appendChild(tpi_toastContainer)
    }
}

// Иконки для уведомлений (SVG)
const tpiNotification_toastIcons = {
    success: `
            <svg class="tpi-notification_toast-icon" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
            </svg>
            `,
    error: `
            <svg class="tpi-notification_toast-icon" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
            </svg>
            `,
    warning: `
            <svg class="tpi-notification_toast-icon" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
            </svg>
            `,
    info: `
            <svg class="tpi-notification_toast-icon" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
            </svg>
            `,
    version: `
            <svg class="tpi-notification_toast-icon" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                <path d="M19 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                <path d="M19 8v5a5 5 0 0 1 -5 5h-3l3 -3m0 6l-3 -3"></path>
                <path d="M5 16v-5a5 5 0 0 1 5 -5h3l-3 -3m0 6l3 -3"></path>
            </svg>
    `,
    tpiInject: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <defs>
                    <style>
                    .turboNotificationIcon {
                        stroke: currentColor;
                        stroke-miterlimit: 10;
                        stroke-width: 1.4px;
                    }
                    </style>
                </defs>
                <path class="turboNotificationIcon" d="m22.97,12.07c-.03,5.96-4.86,10.64-10.9,10.66-5.37.02-10.9-4.73-10.53-11.44C1.83,5.98,6.69,1.21,12.28,1.27c5.91.06,10.71,4.92,10.68,10.8Zm-.47-.24c.19-5.13-4.5-10.31-10.26-10.25C6.45,1.65,1.86,6.22,1.9,12.37c.03,4.23,4.27,9.86,10.31,9.86,5.92,0,10.62-5.4,10.29-10.4Z"></path>
                <path class="turboNotificationIcon" d="m9.82,18.46c-3.94-.32,1.79-5.27-.22-5.99-7.09.43,3.31-8.22,5.71-8.07,2.03,1.65-2.8,5.43-.2,5.72,6.6.17-3.4,6.83-5.29,8.34Zm5.47-8.29c-3.86,1.39,1.26-3.95-.06-5.44-1.94.29-9.67,5.76-7.14,7.4,5.12-.67.22,3.06,1.04,5.77,2.13-.79,11.34-6.68,6.16-7.74Z"></path>
            </svg>
    `
};

const tpiNotification_closeIcon = `<svg class="tpi-notification_close-icon" viewBox="0 0 384 512" fill="currentColor">
    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
</svg>`;

class tpiNotification_ParticleSystem {
    constructor(container, color) {
        this.container = container;
        this.color = color;
        this.particles = [];
        this.particleCount = 20;
        this.maxSize = 6;
        this.minSize = 1;
        this.animationId = null;
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'tpi-notification_particles-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        this.container.appendChild(this.canvas);
        this.resize();
        
        // Создаем частицы
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
        
        this.animate();
        
        // Обработчик изменения размера
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Обновляем границы для существующих частиц
        this.particles.forEach(particle => {
            particle.width = this.width;
            particle.height = this.height;
        });
    }
    
    createParticle() {
        const size = this.minSize + Math.random() * (this.maxSize - this.minSize);
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.5;
        const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        
        // Добавляем немного прозрачности для лучшего визуального эффекта
        const alpha = 0.3 + Math.random() * 0.7;
        
        this.particles.push({
            x, y,
            size,
            velocity,
            alpha,
            width: this.width,
            height: this.height
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(particle => {
            // Обновляем позицию
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            // Отскок от границ
            if (particle.x < 0 || particle.x > particle.width) particle.velocity.x *= -1;
            if (particle.y < 0 || particle.y > particle.height) particle.velocity.y *= -1;
            
            // Рисуем частицу
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.canvas) {
            this.canvas.remove();
        }
        this.particles = [];
    }
}

class tpiNotification_ToastManager {
    constructor() {
        this.container = document.getElementById('tpiNotification_toastContainer');
        this.toasts = [];
        this.gap = 12;
        this.isHovered = false;
        
        this.container.addEventListener('mouseenter', () => this.pauseAllTimers());
        this.container.addEventListener('mouseleave', () => this.resumeAllTimers());
    }
    
    show(message, type = 'info', description = '') {
        const toast = this.createToast(message, type, description);
        this.container.appendChild(toast);
        
        const color = getComputedStyle(toast).color;
        const particleSystem = new tpiNotification_ParticleSystem(toast, color);
        
        const gradientOverlay = document.createElement('div');
        gradientOverlay.className = 'tpi-notification_gradient-overlay';
        toast.appendChild(gradientOverlay);
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'tpi-notification_close-btn';
        closeBtn.innerHTML = tpiNotification_closeIcon;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideIntense(toast);
        });
        toast.appendChild(closeBtn);
        
        const toastData = {
            element: toast,
            particleSystem,
            timer: null,
            startTime: Date.now(),
            remainingTime: 7000,
            isPaused: false
        };
        
        this.toasts.push(toastData);
        this.startTimer(toastData);
        
        this.updateMargins();
        
        setTimeout(() => {
            toast.classList.add('tpi-notification_toast--show');
        }, 10);
    }
    
    createToast(message, type, description) {
        const toast = document.createElement('div');
        toast.className = `tpi-notification_toast tpi-notification_toast--${type}`;
        
        const icon = tpiNotification_toastIcons[type] || tpiNotification_toastIcons.info;
        
        toast.innerHTML = `
            <div class="tpi-notification_toast-content">
                <div class="tpi-notification_toast-title">
                    ${icon}
                    <span>${message}</span>
                </div>
                ${description ? `<div class="tpi-notification_toast-description">${description}</div>` : ''}
            </div>
        `;
        
        return toast;
    }
    
    startTimer(toastData) {
        toastData.timer = setTimeout(() => {
            this.hide(toastData.element);
        }, toastData.remainingTime);
        
        toastData.startTime = Date.now();
        toastData.isPaused = false;
    }
    
    pauseAllTimers() {
        if (this.isHovered) return;
        this.isHovered = true;
        
        this.toasts.forEach(toastData => {
            if (!toastData.isPaused) {
                clearTimeout(toastData.timer);
                const elapsed = Date.now() - toastData.startTime;
                toastData.remainingTime -= elapsed;
                toastData.isPaused = true;
            }
        });
    }
    
    resumeAllTimers() {
        if (!this.isHovered) return;
        this.isHovered = false;
        
        this.toasts.forEach(toastData => {
            if (toastData.isPaused && toastData.remainingTime > 0) {
                this.startTimer(toastData);
            }
        });
    }
    
    hide(toast) {
        const toastData = this.toasts.find(t => t.element === toast);
        if (!toastData || !toast.classList.contains('tpi-notification_toast--show')) return;
        
        clearTimeout(toastData.timer);
        toast.classList.remove('tpi-notification_toast--show');
        toast.classList.add('tpi-notification_toast--hide');
        
        setTimeout(() => {
            toastData.particleSystem.destroy();
            toast.remove();
            this.toasts = this.toasts.filter(t => t !== toastData);
            this.updateMargins();
        }, 200);
    }

    hideIntense(toast) {
        const toastData = this.toasts.find(t => t.element === toast);
        if (!toastData || !toast.classList.contains('tpi-notification_toast--show')) return;
        
        clearTimeout(toastData.timer);
        toast.classList.remove('tpi-notification_toast--show');
        toast.classList.add('tpi-notification_toast--hide');
        
        setTimeout(() => {
            toastData.particleSystem.destroy();
            toast.remove();
            this.toasts = this.toasts.filter(t => t !== toastData);
            this.updateMargins();
        }, 25);
    }
    
    updateMargins() {
        this.toasts.forEach((toastData, index) => {
            if (index < this.toasts.length - 1) {
                toastData.element.style.marginBottom = `${this.gap}px`;
            } else {
                toastData.element.style.marginBottom = '0';
            }
        });
    }
}
        
// Экспорт функционала
window.tpiNotification = {
    show: function(message, type = 'info', description = '') {
        const manager = new tpiNotification_ToastManager();
        manager.show(message, type, description);
    },
    
    showSuccess: function(message, description = '') {
        this.show(message, 'success', description);
    },
    
    showVersion: function(message, description = '') {
        this.show(message, 'version', description);
    },
    
    showError: function(message, description = '') {
        this.show(message, 'error', description);
    },
    
    showWarning: function(message, description = '') {
        this.show(message, 'warning', description);
    },
    
    showInfo: function(message, description = '') {
        this.show(message, 'info', description);
    },
    
    showtpiInject: function(message, description = '') {
        this.show(message, 'tpiInject', description);
    }
};

// Добавляем контейнер при загрузке
addToastContainer();