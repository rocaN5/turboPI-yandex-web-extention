const tpi_tooltip_i_icon = `
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" d="M0 0h24v24H0V0z"></path>
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
    </svg>
`,
tpi_tooltip_ticket_author = `
    <svg class="tpi-tooltip-icon-size-14" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
    </svg>
`,
tpi_tooltip_ticket_status = `
    <svg class="tpi-tooltip-icon-size-14" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z"/>
    </svg>
`,
tpi_tooltip_ticket_theme = `
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="9 17 4 12 9 7"/>
        <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
    </svg>
`,
tpi_tooltip_ticket_problem = `
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
`,
tpi_tooltip_ticket_cargoType = `
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
        <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"/>
    </svg>
`,
tpi_tooltip_ticket_description = `
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
        <path d="M8 12h.01"></path>
        <path d="M12 12h.01"></path>
        <path d="M16 12h.01"></path>
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

    // Функция для форматирования текста тултипа с поддержкой типов
    function formatTooltipContent(element, text) {
        const tooltipType = element.getAttribute('tpi-tooltip-type');
        
        if (tooltipType === 'sortable-ticket') {
            const lines = text.split('\n');
            let blocksHtml = '';
            let currentKey = '';
            let currentTitle = '';
            let currentData = '';
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim()) continue;
                
                const iconMatch = line.match(/^tooltip-icon-([^:]+):(.*)$/);
                const titleMatch = line.match(/^tooltip-title-([^:]+):(.*)$/);
                const dataMatch = line.match(/^tooltip-data-([^:]+):(.*)$/);
                
                if (iconMatch) {
                    // Сохраняем предыдущий блок
                    if (currentKey) {
                        blocksHtml += buildBlock(currentKey, currentTitle, currentData);
                    }
                    currentKey = iconMatch[1].trim();
                    currentTitle = '';
                    currentData = '';
                } else if (titleMatch && currentKey) {
                    currentTitle = titleMatch[2].trim();
                } else if (dataMatch && currentKey) {
                    let dataValue = dataMatch[2].trim();
                    // Для description собираем весь текст до следующего iconMatch
                    if (currentKey === 'description') {
                        let j = i + 1;
                        while (j < lines.length && !lines[j].match(/^tooltip-/)) {
                            if (lines[j].trim()) {
                                dataValue += '\n' + lines[j].trim();
                            }
                            j++;
                        }
                        i = j - 1;
                    }
                    currentData = dataValue;
                }
            }
            
            // Сохраняем последний блок
            if (currentKey) {
                blocksHtml += buildBlock(currentKey, currentTitle, currentData);
            }
            
            return `<div class="tpi-tooltip-content tpi-tooltip-ticket-content">${blocksHtml}</div>`;
        }
        
        return `<icon class="tpi-tooltip-default-icon">${tpi_tooltip_i_icon}</icon><p>${text}</p>`;
    }

    // Строит блок с нужной структурой
    function buildBlock(key, title, data) {
        const iconSvg = getIconSvg(key);
        // Для description сохраняем переносы строк
        let dataHtml = escapeHtml(data);
        if (key === 'description') {
            dataHtml = dataHtml.replace(/\n/g, '<br>');
        }
        
        return `
            <div class="tpi-tooltip-block" data-block-key="${key}">
                <div class="tpi-tooltip-block-header">
                    <icon class="tpi-tooltip-block-icon">${iconSvg}</icon>
                    <div class="tpi-tooltip-block-title">${escapeHtml(title)}</div>
                </div>
                <div class="tpi-tooltip-block-data">${dataHtml}</div>
            </div>
        `;
    }

    // Вспомогательная функция для получения иконки по ключу
    function getIconSvg(key) {
        if (key === 'author') return tpi_tooltip_ticket_author;
        if (key === 'status') return tpi_tooltip_ticket_status;
        if (key === 'theme') return tpi_tooltip_ticket_theme;
        if (key === 'problem') return tpi_tooltip_ticket_problem;
        if (key === 'cargoType') return tpi_tooltip_ticket_cargoType;
        if (key === 'description') return tpi_tooltip_ticket_description;
        return '';
    }

    // Вспомогательная функция для экранирования HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
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
        
        // Копируем атрибут типа с целевого элемента на обертку
        const tooltipType = element.getAttribute('tpi-tooltip-type');
        if (tooltipType) {
            tooltipWrapper.setAttribute('tpi-tooltip-type', tooltipType);
        } else {
            tooltipWrapper.removeAttribute('tpi-tooltip-type');
        }
        
        // Получаем текст из атрибута
        const tooltipText = element.getAttribute('tpi-tooltip-data');
        
        // Формируем HTML содержимого с учетом типа
        tooltipWrapper.innerHTML = formatTooltipContent(element, tooltipText);
        
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
        
        // Удаляем атрибут типа при скрытии
        tooltipWrapper.removeAttribute('tpi-tooltip-type');
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
            tooltipWrapper.removeAttribute('tpi-tooltip-type');
        },
        refresh: attachHandlers,
        forceReinit: () => {
            tooltip_ATTEMPTS = 0;
            tooltipState.initialized = false;
            setTimeout(initTooltips, 100);
        }
    };
}