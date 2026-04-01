const tpi_tooltip_i_icon = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0V0z"></path>
    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
</svg>
`;

let tooltip_ATTEMPTS = 0;
let tooltip_MAXATTEMPTS = 10;
let tooltipState = {
    initialized: false,
    wrapper: null,
    activeTooltipElement: null,
    showTimer: null,
    lastMousePosition: { x: 0, y: 0 },
    isMouseOverTooltip: false,
    currentTargetElement: null,
    containerObserver: null,
    mutationObserver: null
};

function initTooltips() {
    // Сначала создаем контейнер (всегда при вызове)
    let tooltipContainer = document.querySelector('div.tpi-tooltip-by-sheva_r6');
    
    if (!tooltipContainer) {
        tooltipContainer = document.createElement('div');
        tooltipContainer.className = 'tpi-tooltip-by-sheva_r6';
        document.body.appendChild(tooltipContainer);
    }
    
    // Проверяем существование контейнера (на случай если его удалили)
    if (!document.querySelector('div.tpi-tooltip-by-sheva_r6')) {
        if (tooltip_ATTEMPTS < tooltip_MAXATTEMPTS) {
            tooltip_ATTEMPTS++;
            
            // Создаем контейнер заново
            const newContainer = document.createElement('div');
            newContainer.className = 'tpi-tooltip-by-sheva_r6';
            document.body.appendChild(newContainer);
            
            // Пытаемся инициализировать снова через 2 секунды
            setTimeout(() => {
                tooltipState.initialized = false;
                initTooltips();
            }, 2000);
            return;
        } else {
            tooltip_ATTEMPTS = 0;
            return;
        }
    }
    
    // Контейнер существует, продолжаем инициализацию
    tooltip_ATTEMPTS = 0;
    
    // Получаем актуальную ссылку на контейнер
    tooltipContainer = document.querySelector('div.tpi-tooltip-by-sheva_r6');

    // Очищаем предыдущее состояние если нужно
    if (tooltipState.initialized) {
        // Удаляем старую обертку если есть
        if (tooltipState.wrapper && tooltipState.wrapper.parentNode) {
            tooltipState.wrapper.parentNode.removeChild(tooltipState.wrapper);
        }
        // Очищаем таймеры
        if (tooltipState.showTimer) {
            clearTimeout(tooltipState.showTimer);
        }
        // Отключаем старые наблюдатели
        if (tooltipState.containerObserver) {
            tooltipState.containerObserver.disconnect();
        }
        if (tooltipState.mutationObserver) {
            tooltipState.mutationObserver.disconnect();
        }
    }

    // Создаем новую обертку для тултипа
    let tooltipWrapper = document.querySelector('.tpi-tooltip-wrapper');
    if (tooltipWrapper) {
        // Если обертка существует, но в другом контейнере, перемещаем или удаляем
        if (tooltipWrapper.parentNode !== tooltipContainer) {
            tooltipWrapper.parentNode.removeChild(tooltipWrapper);
            tooltipWrapper = null;
        }
    }
    
    if (!tooltipWrapper) {
        tooltipWrapper = document.createElement('div');
        tooltipWrapper.className = 'tpi-tooltip-wrapper';
        tooltipWrapper.style.display = 'none';
        tooltipWrapper.style.position = 'fixed';
        tooltipWrapper.style.zIndex = '99999999999';
        // Без встроенных стилей - они должны быть в CSS
        tooltipContainer.appendChild(tooltipWrapper);
    }

    // Сохраняем состояние
    tooltipState.wrapper = tooltipWrapper;
    tooltipState.initialized = true;
    tooltipState.activeTooltipElement = null;
    tooltipState.currentTargetElement = null;
    tooltipState.isMouseOverTooltip = false;

    // Функция для отслеживания позиции мыши
    function trackMousePosition(event) {
        tooltipState.lastMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        
        // Если тултип активен, обновляем его позицию
        if (tooltipState.activeTooltipElement && tooltipWrapper.style.display !== 'none') {
            positionTooltipNearMouse();
        }
    }

    // Функция для позиционирования тултипа рядом с мышью
    function positionTooltipNearMouse() {

        const wasVisible = tooltipWrapper.style.display !== 'none';

        if (!wasVisible) {
            tooltipWrapper.style.display = 'flex';
            tooltipWrapper.style.opacity = '0';
            tooltipWrapper.style.visibility = 'hidden';
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const offsetX = 20;
        const offsetY = 20;

        let left;
        let top;

        // если курсор близко к правому краю — показываем слева
        if (tooltipState.lastMousePosition.x > viewportWidth - 280) {
            left = tooltipState.lastMousePosition.x - 250;
            tooltipWrapper.setAttribute('tpi-tolltip-position-x', 'from-right')
        } else {
            left = tooltipState.lastMousePosition.x + offsetX;
            tooltipWrapper.setAttribute('tpi-tolltip-position-x', 'from-left')
        }

        // если курсор близко к нижнему краю — показываем сверху
        if (tooltipState.lastMousePosition.y > viewportHeight - 100) {
            top = tooltipState.lastMousePosition.y - 80;
            tooltipWrapper.setAttribute('tpi-tolltip-position-y', 'from-bottom')
        } else {
            top = tooltipState.lastMousePosition.y + offsetY;
            tooltipWrapper.setAttribute('tpi-tolltip-position-y', 'from-top')
        }

        tooltipWrapper.style.left = left + 'px';
        tooltipWrapper.style.top = top + 'px';

        const rect = tooltipWrapper.getBoundingClientRect();

        // если вылез справа → переносим налево
        if (rect.right > viewportWidth) {
            left = tooltipState.lastMousePosition.x - rect.width - offsetX;
        }

        // если вылез снизу → переносим вверх
        if (rect.bottom > viewportHeight) {
            top = tooltipState.lastMousePosition.y - rect.height - offsetY;
        }

        tooltipWrapper.style.left = left + 'px';
        tooltipWrapper.style.top = top + 'px';

        if (!wasVisible) {
            tooltipWrapper.style.opacity = '1';
            tooltipWrapper.style.visibility = 'visible';
        }
    }

    // Функция для показа тултипа
    function showTooltip(element) {
        // Если это другой элемент, скрываем текущий тултип сразу
        if (tooltipState.activeTooltipElement && tooltipState.activeTooltipElement !== element) {
            tooltipWrapper.style.display = 'none';
            tooltipState.activeTooltipElement = null;
        }

        // Запоминаем элемент
        tooltipState.activeTooltipElement = element;
        tooltipState.currentTargetElement = element;
        
        // Получаем текст из атрибута
        const tooltipText = element.getAttribute('tpi-tooltip-data');
        
        // Формируем HTML содержимого
        tooltipWrapper.innerHTML = `<i>${tpi_tooltip_i_icon}</i><p>${tooltipText}</p><span>@sheva_r6</span>`;
        
        // Позиционируем
        positionTooltipNearMouse();
    }

    // Функция для скрытия тултипа
    function hideTooltip() {
        // Проверяем, не наведена ли мышь на тултип
        if (tooltipState.isMouseOverTooltip) {
            return;
        }
        
        // Проверяем, не наведена ли мышь на целевой элемент
        if (tooltipState.currentTargetElement) {
            const hoveredElement = document.elementFromPoint(tooltipState.lastMousePosition.x, tooltipState.lastMousePosition.y);
            if (hoveredElement === tooltipState.currentTargetElement || tooltipState.currentTargetElement.contains(hoveredElement)) {
                return;
            }
        }
        
        // Скрываем тултип
        tooltipWrapper.style.display = 'none';
        tooltipWrapper.style.visibility = 'visible'; // Сбрасываем visibility
        tooltipState.activeTooltipElement = null;
        tooltipState.currentTargetElement = null;
    }

    // Обработчик mouseenter для элементов с атрибутом
    function handleMouseEnter(event) {
        const element = event.currentTarget;
        
        // Очищаем предыдущий таймер
        if (tooltipState.showTimer) {
            clearTimeout(tooltipState.showTimer);
        }
        
        // Запоминаем текущий элемент
        tooltipState.currentTargetElement = element;
        
        // Устанавливаем новый таймер показа
        tooltipState.showTimer = setTimeout(() => {
            // Проверяем, что мышь всё ещё на этом элементе
            const hoveredElement = document.elementFromPoint(tooltipState.lastMousePosition.x, tooltipState.lastMousePosition.y);
            if (hoveredElement === element || element.contains(hoveredElement)) {
                showTooltip(element);
            }
            tooltipState.showTimer = null;
        }, 150);
    }

    // Обработчик mouseleave для элементов с атрибутом
    function handleMouseLeave() {
        // Очищаем таймер показа
        if (tooltipState.showTimer) {
            clearTimeout(tooltipState.showTimer);
            tooltipState.showTimer = null;
        }
        
        // Если мышь ушла с элемента, проверяем не на тултипе ли она
        setTimeout(() => {
            if (!tooltipState.isMouseOverTooltip) {
                hideTooltip();
            }
        }, 50);
    }

    // Обработчики для самого тултипа
    tooltipWrapper.addEventListener('mouseenter', () => {
        tooltipState.isMouseOverTooltip = true;
    });

    tooltipWrapper.addEventListener('mouseleave', () => {
        tooltipState.isMouseOverTooltip = false;
        
        // Проверяем, не наведена ли мышь на целевой элемент
        setTimeout(() => {
            if (!tooltipState.isMouseOverTooltip) {
                hideTooltip();
            }
        }, 50);
    });

    // Функция для добавления обработчиков на элементы
    function attachHandlers() {
        const elements = document.querySelectorAll('[tpi-tooltip-data]');
        
        elements.forEach(element => {
            // Удаляем старые обработчики и добавляем новые
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    // Добавляем обработчик движения мыши (только один раз)
    if (!window._tooltipMouseListenerAdded) {
        document.body.addEventListener('mousemove', (event) => {
            trackMousePosition(event);
            
            // Если нет активного тултипа, ничего не делаем
            if (!tooltipState.activeTooltipElement) return;
            
            // Проверяем, где находится мышь
            const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
            const isOnTarget = hoveredElement === tooltipState.activeTooltipElement || tooltipState.activeTooltipElement.contains(hoveredElement);
            const isOnTooltip = hoveredElement === tooltipWrapper || tooltipWrapper.contains(hoveredElement);
            
            // Если мышь не на целевом элементе и не на тултипе, скрываем
            if (!isOnTarget && !isOnTooltip) {
                hideTooltip();
            }
        });
        window._tooltipMouseListenerAdded = true;
    }

    // Добавляем обработчики для существующих элементов
    attachHandlers();

    // Создаем MutationObserver для отслеживания новых элементов
    if (tooltipState.mutationObserver) {
        tooltipState.mutationObserver.disconnect();
    }
    
    tooltipState.mutationObserver = new MutationObserver((mutations) => {
        let shouldAttach = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.hasAttribute && node.hasAttribute('tpi-tooltip-data')) {
                            shouldAttach = true;
                        }
                        if (node.querySelectorAll) {
                            const children = node.querySelectorAll('[tpi-tooltip-data]');
                            if (children.length > 0) {
                                shouldAttach = true;
                            }
                        }
                    }
                });
            }
            
            if (mutation.type === 'attributes' && mutation.attributeName === 'tpi-tooltip-data') {
                shouldAttach = true;
            }
        });
        
        if (shouldAttach) {
            attachHandlers();
        }
    });

    tooltipState.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tpi-tooltip-data']
    });

    // Добавляем наблюдение за удалением контейнера
    if (tooltipState.containerObserver) {
        tooltipState.containerObserver.disconnect();
    }
    
    tooltipState.containerObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.removedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('tpi-tooltip-by-sheva_r6')) {
                    tooltip_ATTEMPTS = 0;
                    tooltipState.initialized = false;
                    setTimeout(initTooltips, 500);
                }
            });
        });
    });

    tooltipState.containerObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Возвращаем API
    return {
        hideTooltip: () => {
            tooltipWrapper.style.display = 'none';
            tooltipState.activeTooltipElement = null;
            tooltipState.currentTargetElement = null;
        },
        refresh: attachHandlers,
        forceReinit: () => {
            tooltip_ATTEMPTS = 0;
            tooltipState.initialized = false;
            setTimeout(initTooltips, 100);
        }
    };
}