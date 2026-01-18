const tpi_i_ab_copy_DOM_data = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.6 2.001H7.4a1.402 1.402 0 0 0-1.4 1.4v2.602H3.401a1.401 1.401 0 0 0-1.4 1.4v13.2a1.402 1.402 0 0 0 1.4 1.4h13.2a1.4 1.4 0 0 0 1.4-1.4V18h2.6a1.401 1.401 0 0 0 1.4-1.4V3.4a1.402 1.402 0 0 0-1.4-1.4ZM16 20.003H4v-12h12v12ZM20 16h-1.999V7.402a1.401 1.401 0 0 0-1.4-1.4h-8.6v-2h12v12Z" fill="#000"></path>
    <path d="M9 17.994h2v-3h3v-2h-3v-3H9v3H6v2h3v3Z" fill="#000"></path>
</svg>
`,
tpi_i_ab_print_sortable_id = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5ZM5 5H7V7H5V5Z"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17 3C15.8954 3 15 3.89543 15 5V7C15 8.10457 15.8954 9 17 9H19C20.1046 9 21 8.10457 21 7V5C21 3.89543 20.1046 3 19 3H17ZM17 5H19V7H17V5Z"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 17C3 15.8954 3.89543 15 5 15H7C8.10457 15 9 15.8954 9 17V19C9 20.1046 8.10457 21 7 21H5C3.89543 21 3 20.1046 3 19V17ZM7 17H5V19H7V17Z"></path>
    <path d="M13 3H11V11H3V13H13V3Z"></path>
    <path d="M15 11V17H17V13H21V11H15Z"></path>
    <path d="M11 15V21H13V15H11Z"></path>
    <path d="M15 21V19H19V15H21V21H15Z"></path>
</svg>
`,
tpi_i_ab_person = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
</svg>
`,
tpi_i_ab_calendar = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect>
    <circle cx="296" cy="232" r="24"></circle>
    <circle cx="376" cy="232" r="24"></circle>
    <circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle>
    <circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle>
    <circle cx="296" cy="392" r="24"></circle>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path>
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path>
</svg>
`,
tpi_i_ab_clock = `
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
`

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
                <div class="tpi-ab--info-card-author-wrapper">
                    <div class="tpi-ab--info-card-author-name">
                        <i class="tpi-ab--info-card-author-icon">${tpi_i_ab_person}</i>
                        <p>R.TSD</p>
                    </div>
                    <div class="tpi-ab--info-card-created-date">
                        <div class="tpi-ab--info-card-created-date-container">
                            <i class="tpi-ab--info-card-created-date-icon">${tpi_i_ab_calendar}</i>
                            <p>18/01/26</p>
                        </div>
                        <div class="tpi-ab--info-card-created-date-container">
                            <i class="tpi-ab--info-card-created-date-icon">${tpi_i_ab_clock}</i>
                            <p>16:53:22</p>
                        </div>
                    </div>
                </div>
                <div class="tpi-ab--info-card-photo-wrapper">
                    <div class="tpi-ab--info-card-photo"></div>
                </div>
                <div class="tpi-ab--info-card-description-wrapper">

                    <div class="tpi-ab--info-card-container-wrapper">
                        <div class="tpi-ab--info-card-container-title">
                            <p>Номер аномалии:</p>
                        </div>
                        <div class="tpi-ab--info-card-anomaly-data-container">
                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables/1946105265" target="_blank" class="tpi-ab-index-id">FA254273B14029585DEE</a>
                            <button class="tpi-ab--infp-card-button tpi-ab-index-id__copy">${tpi_i_ab_copy_DOM_data}</button>
                            <button class="tpi-ab--infp-card-button tpi-ab-index-id__print">${tpi_i_ab_print_sortable_id}</button>
                        </div>
                    </div>
                    
                    <div class="tpi-ab--info-card-container-wrapper">
                        <div class="tpi-ab--info-card-container-title">
                            <p>Идентификаторы</p>
                        </div>
                        <div class="tpi-ab--info-card-anomaly-data-container tpi-ab--info-card-column-data">
                            <div class="tpi-ab--info-card-identificator-container">
                                <p>058866888412</p>
                                <button class="tpi-ab--infp-card-button tpi-ab-index-id__copy">${tpi_i_ab_copy_DOM_data}</button>
                            </div>
                            <div class="tpi-ab--info-card-identificator-container">
                                <p>YP01132700135</p>
                                <button class="tpi-ab--infp-card-button tpi-ab-index-id__copy">${tpi_i_ab_copy_DOM_data}</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tpi-ab--info-card-container-wrapper">
                        <div class="tpi-ab--info-card-container-title">
                            <p>Описание товара</p>
                        </div>
                        <div class="tpi-ab--info-card-anomaly-data-container">
                            <div class="tpi-ab--info-card-description-container">
                                <p class="tpi-ab--info-card-description">МИКРОВОЛНОВАЯ ПЕЧЬ 20 Л CMW207M02B COMFEE</p>
                            </div>
                        </div>
                    </div>

                </div>
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