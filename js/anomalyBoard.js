function anomalyBoard() {
    if (window.location.href.includes('logistics.market.yandex.ru/sorting-center/21972131/anomaly-form')) {
        const targetDiv = document.querySelector('div[data-tid-prop="66fcbac9 cb97fdce d276ac8a ee6163ae 741ecff9"]');
        
        if (targetDiv) {
            // Добавляем класс родителю
            if (targetDiv.parentNode) {
                targetDiv.parentNode.classList.add('tpi-ab--container');
            }
            
            // Проверяем, не существует ли уже wrapper
            const existingWrapper = document.querySelector('.tpi-ab--wrapper');
            if (existingWrapper) {
                existingWrapper.remove(); // Удаляем старый, чтобы создать новый
            }
            
            // Создаем новый элемент
            const newElement = document.createElement('div');
            newElement.className = 'tpi-ab--wrapper';
            newElement.innerHTML = `
            <div class="tpi-ab--info-card">
                <div class="tpi-ab--info-card-author-wrapper"></div>
                <div class="tpi-ab--info-card-photo-wrapper">
                    <div class="tpi-ab--info-card-photo"></div>
                </div>
                <div class="tpi-ab--info-card-description-wrapper"></div>
            </div>
            `;
            
            // Копируем ширину и высоту из targetDiv
            const targetRect = targetDiv.getBoundingClientRect();
            newElement.style.width = targetRect.width + 'px';
            newElement.style.height = targetRect.height + 'px';
            
            // Вставляем после targetDiv
            targetDiv.parentNode.insertBefore(newElement, targetDiv.nextSibling);
            
            console.log('Элемент добавлен с размерами: ' + targetRect.width + 'x' + targetRect.height);
        } else {
            console.log('Целевой div не найден');
        }
    } else {
        console.log('Страница не находится на нужной ссылке');
    }
}

anomalyBoard();