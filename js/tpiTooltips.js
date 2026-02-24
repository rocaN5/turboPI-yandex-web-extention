const tpi_tooltip_i_icon = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0V0z"></path>
    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
</svg>
`;

function initTooltips() {
    // Проверяем наличие контейнера для тултипов на странице
    const tooltipContainer = document.querySelector('div.tpi-tooltip-by-sheva_r6');
    if (!tooltipContainer) {
        console.warn('Контейнер .tpi-tooltip-by-sheva_r6 не найден. Тултипы не будут работать.');
        return;
    }

    // Создаем элемент-обертку для тултипа, если его еще нет
    let tooltipWrapper = document.querySelector('.tpi-tooltip-wrapper');
    if (!tooltipWrapper) {
        tooltipWrapper = document.createElement('div');
        tooltipWrapper.className = 'tpi-tooltip-wrapper';
        tooltipWrapper.style.display = 'none';
        tooltipWrapper.style.position = 'fixed';
        tooltipWrapper.style.zIndex = '99999999999';
        tooltipContainer.appendChild(tooltipWrapper);
    }

    // Переменные для хранения состояния
    let activeTooltipElement = null;
    let showTimer = null;
    let lastMousePosition = { x: 0, y: 0 };
    let isMouseOverTooltip = false;
    let currentTargetElement = null;

    // Функция для отслеживания позиции мыши
    function trackMousePosition(event) {
        lastMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        
        // Если тултип активен, обновляем его позицию
        if (activeTooltipElement && tooltipWrapper.style.display !== 'none') {
            positionTooltipNearMouse();
        }
    }

    // Функция для позиционирования тултипа рядом с мышью
    function positionTooltipNearMouse() {
        // Показываем тултип для получения размеров
        const wasVisible = tooltipWrapper.style.display === 'flex';
        
        if (!wasVisible) {
            tooltipWrapper.style.display = 'flex';
            tooltipWrapper.style.opacity = '0';
            tooltipWrapper.style.transform = 'scale(1)';
            tooltipWrapper.style.filter = 'none';
        }
        
        // Получаем реальные размеры
        const tooltipRect = tooltipWrapper.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Отступ от курсора
        const offsetX = 15;
        const offsetY = 15;
        
        // Начальная позиция - справа снизу от мыши
        let left = lastMousePosition.x + offsetX;
        let top = lastMousePosition.y + offsetY;
        
        // Корректировка если выходит за границы
        if (left + tooltipRect.width > viewportWidth) {
            left = Math.max(0, lastMousePosition.x - tooltipRect.width - offsetX);
        }
        
        if (top + tooltipRect.height > viewportHeight) {
            top = Math.max(0, lastMousePosition.y - tooltipRect.height - offsetY);
        }
        
        // Финальная проверка границ
        left = Math.min(Math.max(0, left), viewportWidth - tooltipRect.width);
        top = Math.min(Math.max(0, top), viewportHeight - tooltipRect.height);
        
        // Устанавливаем позицию
        tooltipWrapper.style.left = left + 'px';
        tooltipWrapper.style.top = top + 'px';
        
        // Показываем с анимацией появления
        if (!wasVisible) {
            // Запускаем анимацию появления
            tooltipWrapper.style.animation = 'tooltip-popup 300ms ease-in-out';
            tooltipWrapper.style.opacity = '1';
            
            // Убираем анимацию после завершения
            setTimeout(() => {
                if (tooltipWrapper.style.display === 'flex') {
                    tooltipWrapper.style.animation = '';
                }
            }, 300);
        }
    }

    // Функция для показа тултипа
    function showTooltip(element) {
        // Если это другой элемент, скрываем текущий тултип сразу
        if (activeTooltipElement && activeTooltipElement !== element) {
            tooltipWrapper.style.display = 'none';
            activeTooltipElement = null;
        }

        // Запоминаем элемент
        activeTooltipElement = element;
        currentTargetElement = element;
        
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
        if (isMouseOverTooltip) {
            return;
        }
        
        // Проверяем, не наведена ли мышь на целевой элемент
        if (currentTargetElement) {
            const hoveredElement = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
            if (hoveredElement === currentTargetElement || currentTargetElement.contains(hoveredElement)) {
                return;
            }
        }
        
        // Скрываем тултип
        tooltipWrapper.style.display = 'none';
        tooltipWrapper.style.animation = '';
        activeTooltipElement = null;
        currentTargetElement = null;
    }

    // Обработчик mouseenter для элементов с атрибутом
    function handleMouseEnter(event) {
        const element = event.currentTarget;
        
        // Очищаем предыдущий таймер
        if (showTimer) {
            clearTimeout(showTimer);
        }
        
        // Запоминаем текущий элемент
        currentTargetElement = element;
        
        // Устанавливаем новый таймер показа
        showTimer = setTimeout(() => {
            // Проверяем, что мышь всё ещё на этом элементе
            const hoveredElement = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
            if (hoveredElement === element || element.contains(hoveredElement)) {
                showTooltip(element);
            }
            showTimer = null;
        }, 150);
    }

    // Обработчик mouseleave для элементов с атрибутом
    function handleMouseLeave(event) {
        // Очищаем таймер показа
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
        
        // Если мышь ушла с элемента, проверяем не на тултипе ли она
        setTimeout(() => {
            if (!isMouseOverTooltip) {
                hideTooltip();
            }
        }, 10);
    }

    // Обработчики для самого тултипа
    tooltipWrapper.addEventListener('mouseenter', () => {
        isMouseOverTooltip = true;
    });

    tooltipWrapper.addEventListener('mouseleave', () => {
        isMouseOverTooltip = false;
        
        // Проверяем, не наведена ли мышь на целевой элемент
        setTimeout(() => {
            if (!isMouseOverTooltip) {
                hideTooltip();
            }
        }, 10);
    });

    // Обработчик движения мыши
    document.body.addEventListener('mousemove', (event) => {
        trackMousePosition(event);
        
        // Если нет активного тултипа, ничего не делаем
        if (!activeTooltipElement) return;
        
        // Проверяем, где находится мышь
        const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
        const isOnTarget = hoveredElement === activeTooltipElement || activeTooltipElement.contains(hoveredElement);
        const isOnTooltip = hoveredElement === tooltipWrapper || tooltipWrapper.contains(hoveredElement);
        
        // Если мышь не на целевом элементе и не на тултипе, скрываем
        if (!isOnTarget && !isOnTooltip) {
            hideTooltip();
        }
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

    // Добавляем обработчики для существующих элементов
    attachHandlers();

    // Создаем MutationObserver для отслеживания новых элементов
    const observer = new MutationObserver((mutations) => {
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

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tpi-tooltip-data']
    });

    // Возвращаем API
    return {
        hideTooltip: () => {
            tooltipWrapper.style.display = 'none';
            activeTooltipElement = null;
            currentTargetElement = null;
        },
        refresh: attachHandlers
    };
}