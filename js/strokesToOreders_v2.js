function init_strokesToOreders_v2(){
    switchFloatingTextareaPin()
    grabAndDrag_floatingWindow()
    changeStatusVisibility()
    changeFloatingWindowSize();
    settingsOverflowControl();
    settingsClickListeners();
    // copyTableRows();
}

function changeStatusVisibility(){
    const toggleButton = document.querySelector('.tpi-sto--odrder-status-switch-visibility')
    const stateHolder = document.querySelector('.tpi-sto--odrder-searh-data-wrapper')
    toggleButton.addEventListener('click', ()=>{
        const stateAttribute = stateHolder.getAttribute('tpi-sto-current-state')
        if(stateAttribute === 'visible'){
            stateHolder.setAttribute('tpi-sto-current-state', 'hidden')
        }else if(stateAttribute === 'hidden'){
            stateHolder.setAttribute('tpi-sto-current-state', 'visible')
        } else{
            alert('❌ wrong attribute error')
        }
    })
}

function grabAndDrag_floatingWindow(){
    const floatingWrapper = document.querySelector('.tpi-sto--floating-search-wrapper');
    const container = document.querySelector('.tpi-sto--custom-fulPage');
    const sectionBlock = document.querySelector('.tpi-sto--section-block');

    if (floatingWrapper && container && sectionBlock) {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;
        
        // Переменные для отслеживания позиции при скролле
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollAnimationFrame = null;
        
        // Функция для проверки возможности перетаскивания
        function canDrag() {
            const currentState = sectionBlock.getAttribute('tpi-sto-current-state');
            return currentState === 'floating';
        }
        
        // Убираем возможные transition у floatingWrapper
        floatingWrapper.style.transition = 'none';
        
        // Функция для проверки, можно ли начать перетаскивание с этого элемента
        function canStartDrag(element) {
            // Если перетаскивание отключено по состоянию - не начинаем
            if (!canDrag()) return false;
            
            // Если клик был на запрещенных элементах - не начинаем перетаскивание
            if (element.closest('button') || 
                element.closest('textarea') || 
                element.closest('.tpi-sto--odrder-searh-data-container')) {
                return false;
            }
            
            // Проверяем, что клик был по целевому элементу или его дочерним элементам (кроме запрещенных)
            return element.closest('.tpi-sto--floating-search-wrapper') === floatingWrapper ||
                element.closest('.tpi-sto--section-wrapper-title.tpi-sto--floating-wrapper-title');
        }
        
        // Функция для блокировки выделения и событий
        function disableSelection() {
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.cursor = 'grabbing';
            
        }
        
        // Функция для восстановления выделения и событий
        function enableSelection() {
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.cursor = '';
        }
        
        // Функция для проверки границ с учетом видимой области
        function checkBoundaries() {
            const containerRect = container.getBoundingClientRect();
            const wrapperRect = floatingWrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Вычисляем границы перемещения внутри контейнера
            const maxX = containerRect.width - wrapperRect.width - 5;
            const maxY = containerRect.height - wrapperRect.height - 5;
            
            // Получаем текущие позиции
            let currentX = parseInt(floatingWrapper.style.left) || 0;
            let currentY = parseInt(floatingWrapper.style.top) || 0;
            
            // Ограничиваем в пределах контейнера с отступом 5px
            currentX = Math.max(5, Math.min(currentX, maxX));
            currentY = Math.max(5, Math.min(currentY, maxY));
            
            // Дополнительная проверка для видимой области (если контейнер больше viewport)
            if (containerRect.height > viewportHeight) {
                // Преобразуем абсолютные координаты в координаты относительно viewport
                const wrapperAbsoluteTop = currentY + containerRect.top;
                const wrapperBottom = wrapperAbsoluteTop + wrapperRect.height;
                
                // Максимальная позиция снизу с отступом 75px
                const maxVisibleBottom = viewportHeight - 15;
                
                // Если блок выходит за нижнюю границу viewport, корректируем
                if (wrapperBottom > maxVisibleBottom) {
                    const correction = wrapperBottom - maxVisibleBottom;
                    currentY = Math.max(5, currentY - correction);
                }
                
                // Также проверяем верхнюю границу
                const minVisibleTop = 5; // Минимальный отступ сверху
                if (wrapperAbsoluteTop < minVisibleTop) {
                    const correction = minVisibleTop - wrapperAbsoluteTop;
                    currentY = Math.min(maxY, currentY + correction);
                }
            }
            
            // Применяем скорректированную позицию
            floatingWrapper.style.left = currentX + 'px';
            floatingWrapper.style.top = currentY + 'px';
        }
        
        // Обработчик скролла с throttling
        window.addEventListener('scroll', (e) => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDiff = currentScrollTop - lastScrollTop;

            if (isDragging) {
                // При перетаскивании корректируем начальную позицию и обновляем позицию окна
                initialTop += scrollDiff;
                // Также обновляем фактическую позицию окна
                floatingWrapper.style.top = (parseInt(floatingWrapper.style.top) + scrollDiff) + 'px';
            } else {
                // Если не перетаскиваем — просто сдвигаем окно вместе со скроллом
                if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
                scrollAnimationFrame = requestAnimationFrame(() => {
                    const currentTop = parseInt(floatingWrapper.style.top) || 0;
                    floatingWrapper.style.top = (currentTop + scrollDiff) + 'px';
                    checkBoundaries();
                });
            }

            lastScrollTop = currentScrollTop;
        }, { passive: true });
        
        document.addEventListener('mousedown', function(e) {
            // Проверяем, можно ли начать перетаскивание с этого элемента
            if (!canStartDrag(e.target)) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            // Сохраняем начальную позицию блока в абсолютных координатах (относительно документа)
            const computedStyle = getComputedStyle(floatingWrapper);
            initialLeft = parseInt(computedStyle.left) || 0;
            initialTop = parseInt(computedStyle.top) || 0;
            
            // Сохраняем текущую позицию скролла
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Добавляем класс для стилей перетаскивания
            floatingWrapper.classList.add('tpi-sto--floating-search-wrapper-grabbing');
            
            // Блокируем выделение и события, меняем курсор, делаем все инертным
            disableSelection();
            
            function onMouseMove(e) {
                if (!isDragging) return;
                
                // Используем requestAnimationFrame для плавности перетаскивания
                if (scrollAnimationFrame) {
                    cancelAnimationFrame(scrollAnimationFrame);
                }
                
                scrollAnimationFrame = requestAnimationFrame(() => {
                    // Вычисляем смещение
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    // Новая позиция в абсолютных координатах
                    let newX = initialLeft + deltaX;
                    let newY = initialTop + deltaY;
                    
                    // Применяем новую позицию
                    floatingWrapper.style.left = newX + 'px';
                    floatingWrapper.style.top = newY + 'px';
                    
                    // Проверяем границы в реальном времени
                    checkBoundaries();
                });
            }
            
            function onMouseUp() {
                isDragging = false;
                
                // Убираем класс перетаскивания
                floatingWrapper.classList.remove('tpi-sto--floating-search-wrapper-grabbing');
                
                // Восстанавливаем выделение, события и курсор
                enableSelection();
                
                // Финальная проверка границ
                checkBoundaries();
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // Инициализация начальной проверки границ
        checkBoundaries();
        
        // Также проверяем границы при изменении размера окна
        window.addEventListener('resize', checkBoundaries);
    }
}

function switchFloatingTextareaPin(){
    const mainSection = document.querySelector('.tpi-sto--section-block')
    const pinSwitcher = document.querySelector('.tpi-sto--switch-pin-floating-window-switch')
    const floatingWindow = document.querySelector('.tpi-sto--floating-search-wrapper')
    const switchButton = document.querySelector('.tpi-sto--switch-size-window-switch')
    const otherSection = document.querySelector('.tpi-sto--main-section-wrapper')
    pinSwitcher.addEventListener('click', ()=>{
        const attributeData = mainSection.getAttribute('tpi-sto-current-state')
        if(attributeData === 'floating'){
            mainSection.setAttribute('tpi-sto-current-state', 'default')
            pinSwitcher.innerHTML = `${tpiIcon__unPin}`
            otherSection.classList.add('tpi-sto--floating-animatedZindex')
            switchButton.style.display = 'none'
            setTimeout(() => {
                otherSection.classList.remove('tpi-sto--floating-animatedZindex')
            }, 310);
        }else{
            mainSection.setAttribute('tpi-sto-current-state', 'floating')
            pinSwitcher.innerHTML = `${tpiIcon__pin}`
            switchButton.style.display = 'flex'
            setTimeout(() => {
                switchButton.style.animation = 'tpiFloatingWindowSize-switch 300ms ease-in-out'
            }, 1);
        }
    })
}

function changeFloatingWindowSize() {
    const floatingWrapper = document.querySelector('.tpi-sto--floating-search-wrapper');
    const switchButton = document.querySelector('.tpi-sto--switch-size-window-switch');
    let hoverTimeout;
    let mouseOnFloatingWindow = false;
    let isAnimating = false; // 🔹 защита от обрывов
    let queuedState = null; // 🔹 если пришло новое действие — запомним и выполним после

    switchButton.addEventListener('click', () => {
        const state = switchButton.getAttribute('tpi-sto-current-state');
        if (state === 'marked') {
            switchButton.setAttribute('tpi-sto-current-state', 'unmarked');
            switchButton.innerHTML = `${tpiIcon__decrease}`;
            if (!mouseOnFloatingWindow) requestAnimation('default');
        } else {
            switchButton.setAttribute('tpi-sto-current-state', 'marked');
            switchButton.innerHTML = `${tpiIcon__increase}`;
            floatingWrapper.setAttribute('tpi-sto-current-state', 'minimized');
            if (!mouseOnFloatingWindow) requestAnimation('minimized');
        }
    });

    floatingWrapper.addEventListener('mouseenter', () => {
        mouseOnFloatingWindow = true;
        clearTimeout(hoverTimeout);
        const state = switchButton.getAttribute('tpi-sto-current-state');
        if (state === 'marked') hoverTimeout = setTimeout(() => requestAnimation('default'), 100);
    });

    floatingWrapper.addEventListener('mouseleave', () => {
        mouseOnFloatingWindow = false;
        clearTimeout(hoverTimeout);
        const state = switchButton.getAttribute('tpi-sto-current-state');
        if (state === 'marked') hoverTimeout = setTimeout(() => requestAnimation('minimized'), 200);
    });

    // === безопасный запуск анимации ===
    function requestAnimation(target) {
        if (isAnimating) {
            queuedState = target;
            return;
        }
        if (target === 'minimized') animateFloatingWindow_minimized();
        if (target === 'default') animateFloatingWindow_default();
    }

    function animateFloatingWindow_minimized() {
        isAnimating = true;
        floatingWrapper.setAttribute('tpi-sto-animate-state', 'animate');
        setTimeout(() => {
            floatingWrapper.setAttribute('tpi-sto-animate-state', 'hidden');
            endAnimation();
        }, 300);
    }

    function animateFloatingWindow_default() {
        isAnimating = true;
        floatingWrapper.setAttribute('tpi-sto-animate-state', 'animate');
        setTimeout(() => {
            floatingWrapper.setAttribute('tpi-sto-animate-state', 'animate-reversed');
            setTimeout(() => {
                floatingWrapper.setAttribute('tpi-sto-animate-state', 'default');
                endAnimation();
            }, 300);
        }, 10);
    }

    function endAnimation() {
        isAnimating = false;
        if (queuedState) {
            const next = queuedState;
            queuedState = null;
            requestAnimation(next); // 🔁 выполняем отложенную анимацию
        }
    }
}

function settingsOverflowControl(){
    const settingsContainer = document.querySelector(".tpi-sto-settings-container");
    const settingsArrowLeft = document.querySelector('.tpi-sto--settings-arrow[tpi-sto-settings-move="left"]');
    const settingsArrowRight = document.querySelector('.tpi-sto--settings-arrow[tpi-sto-settings-move="right"]');

    function updateArrowsVisibility() {
        const maxScroll = settingsContainer.scrollWidth - settingsContainer.clientWidth;

        settingsArrowLeft.hidden = settingsContainer.scrollLeft <= 2;

        settingsArrowRight.hidden = settingsContainer.scrollLeft >= maxScroll - 2;
    }

    // движение
    settingsArrowLeft.addEventListener("click", () => {
        settingsContainer.scrollLeft -= 180;
    });
    settingsArrowRight.addEventListener("click", () => {
        settingsContainer.scrollLeft += 180;
    });

    // обновление после движения
    settingsContainer.addEventListener("scroll", updateArrowsVisibility);
    window.addEventListener('resize', updateArrowsVisibility)
    // обновление при загрузке
    updateArrowsVisibility();
}

function settingsClickListeners(){
    const sto_settingsWrapper = document.querySelector('.tpi-sto--section-wrapper.tpi-sto--search-settings-wrapper')
    const sto_visibilitySwitcher = document.querySelector('.tpi-sto--settings-toggle')
    const sto_pinSwitcher = document.querySelector('.tpi-sto--settings-switch-pin-sticky')
    const tpi_settings_option_1 = document.getElementById('tpi-sto--settings-option-1')
    // const tpi_settings_option_2 = document.getElementById('tpi-sto--settings-option-2')
    const tpi_settings_option_3 = document.getElementById('tpi-sto--settings-option-3')
    const tpi_settings_option_4 = document.getElementById('tpi-sto--settings-option-4')
    const tpi_settings_option_5 = document.getElementById('tpi-sto--settings-option-5')
    const tpi_settings_option_6 = document.getElementById('tpi-sto--settings-option-6')
    const tpi_settings_option_7 = document.getElementById('tpi-sto--settings-option-7')

    sto_settingsWrapper.addEventListener('click', (event) => {
        if (sto_visibilitySwitcher.contains(event.target)) {
            const sto_settings_rawAttribute = sto_visibilitySwitcher.getAttribute('tpi-sto-current-state')
            if(sto_settings_rawAttribute == 'visible'){
                sto_visibilitySwitcher.setAttribute('tpi-sto-current-state', 'hidden')
            }else{
                sto_visibilitySwitcher.setAttribute('tpi-sto-current-state', 'visible')
            }
        }else if(sto_pinSwitcher.contains(event.target)) {
            const sto_settings_rawAttribute = sto_pinSwitcher.getAttribute('tpi-sto-current-state')
            if(sto_settings_rawAttribute == 'marked'){
                sto_pinSwitcher.setAttribute('tpi-sto-current-state', 'unmarked')
                sto_pinSwitcher.innerHTML = tpiIcon__unPin
            }else{
                sto_pinSwitcher.setAttribute('tpi-sto-current-state', 'marked')
                sto_pinSwitcher.innerHTML = tpiIcon__pin
            }
        }else if(tpi_settings_option_1.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-stop-extended-status-animation')
            
            if(tpi_settings_option_1.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-stop-extended-status-animation')
            }else if(!tpi_settings_option_1.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-stop-extended-status-animation', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_1.checked){
                    tpi_sto__tbody.removeAttribute('tpi-stop-extended-status-animation')
                }else{
                    tpi_sto__tbody.setAttribute('tpi-stop-extended-status-animation', '')
                }
            }
        }
        // else if(tpi_settings_option_2.contains(event.target)) {
        //     const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper');
        //     const tpi_sto__thead = document.querySelector('.tpi-sto--table-thead-wrapper');
        //     const isCurrentlyHidden = tpi_sto__tbody.hasAttribute('tpi-hidden-return-barcode');
            
            // if(tpi_settings_option_2.checked){
            //     // Показать колонку
            //     tpi_sto__tbody.removeAttribute('tpi-hidden-return-barcode');
            //     tpi_sto__thead.removeAttribute('tpi-hidden-return-barcode');
                
            //     // Показать все ячейки
            //     document.querySelectorAll('[tpi-sto-tbody-return-sortable]').forEach(cell => {
            //         cell.style.display = '';
            //     });
            // } else {
            //     // Скрыть колонку
            //     tpi_sto__tbody.setAttribute('tpi-hidden-return-barcode', '');
            //     tpi_sto__thead.setAttribute('tpi-hidden-return-barcode', '');
                
            //     setTimeout(() => {
            //         if(!tpi_settings_option_2.checked){
            //             document.querySelectorAll('[tpi-sto-tbody-return-sortable]').forEach(cell => {
            //                 cell.style.display = 'none';
            //             });
            //         }
            //     }, 750);
            // }
        // }
        else if(tpi_settings_option_3.contains(event.target)) {
            const tpi_sto__contentSection = document.querySelector('.tpi-sto--content-section')
            const sto_option_rawAttribute = tpi_sto__contentSection.hasAttribute('tpi-hide-liquid-glass-effect')
            
            if(tpi_settings_option_3.checked && sto_option_rawAttribute){
                tpi_sto__contentSection.removeAttribute('tpi-hide-liquid-glass-effect')
            }else if(!tpi_settings_option_3.checked && sto_option_rawAttribute){
                tpi_sto__contentSection.setAttribute('tpi-hide-liquid-glass-effect', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_3.checked){
                    tpi_sto__contentSection.removeAttribute('tpi-hide-liquid-glass-effect')
                }else{
                    tpi_sto__contentSection.setAttribute('tpi-hide-liquid-glass-effect', '')
                }
            }
        }else if(tpi_settings_option_4.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-hide-extra-icons')
            
            if(tpi_settings_option_4.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-hide-extra-icons')
            }else if(!tpi_settings_option_4.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-hide-extra-icons', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_4.checked){
                    tpi_sto__tbody.removeAttribute('tpi-hide-extra-icons')
                }else{
                    tpi_sto__tbody.setAttribute('tpi-hide-extra-icons', '')
                }
            }
        }else if(tpi_settings_option_5.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-extra-grid')
            
            if(tpi_settings_option_5.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-extra-grid', '')
            }else if(!tpi_settings_option_5.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-extra-grid')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_5.checked){
                    tpi_sto__tbody.setAttribute('tpi-extra-grid', '')
                }else{
                    tpi_sto__tbody.removeAttribute('tpi-extra-grid')
                }
            }
        }else if(tpi_settings_option_6.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-hide-extra-option-buttons')
            
            if(tpi_settings_option_6.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-hide-extra-option-buttons', '')
            }else if(!tpi_settings_option_6.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-hide-extra-option-buttons')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_6.checked){
                    tpi_sto__tbody.setAttribute('tpi-hide-extra-option-buttons', '')
                }else{
                    tpi_sto__tbody.removeAttribute('tpi-hide-extra-option-buttons')
                }
            }
        }else if(tpi_settings_option_7.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-hide-null-cells')
            
            if(tpi_settings_option_7.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-hide-null-cells')
            }else if(!tpi_settings_option_7.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-hide-null-cells', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_7.checked){
                    tpi_sto__tbody.removeAttribute('tpi-hide-null-cells')
                }else{
                    tpi_sto__tbody.setAttribute('tpi-hide-null-cells', '')
                }
            }
        }
    });
}

//! ADMIN temp STUFF
function copyTableRows() {
    const trElements = document.querySelectorAll('tr.tpi-sto--table-tbody');
    
    trElements.forEach(originalTr => {
        for (let i = 0; i < 15; i++) {
            const clonedTr = originalTr.cloneNode(true);
            originalTr.parentNode.insertBefore(clonedTr, originalTr.nextSibling);
        }
    });
}
//! ADMIN temp STUFF