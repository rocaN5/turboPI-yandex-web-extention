let totalTasks = 0;
let completedTasks = 0;
let currentBatch = 0;
let totalBatches = 0;
let currentTaskName = '';
let nextTaskName = '';
let progressAnimationInterval = null;
let currentAnimatedPercentage = 0;
let targetPercentage = 0;
let firebaseListenerInitialized = false;
let currentPage = 1;
let pageSize = 20;
let totalLotPacks = 0;


const printLOTPACKButtonSVG = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"></path><path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path>
</svg>
`
const deleteLOTPACKButtonSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16">
        <path fill="currentColor" d="M5.386 6h1.806l.219 7H5.886zm3.206 7 .218-7h1.814l-.5 7z"></path>
        <path fill="currentColor" fill-rule="evenodd" d="M7.837.014h.303c.71-.001 1.333-.002 1.881.22a3 3 0 0 1 1.257.962c.36.47.522 1.072.707 1.758l.012.046H15v2l-.96.48-.585 5.922c-.177 1.787-.265 2.68-.72 3.326a3 3 0 0 1-.975.883C11.073 16 10.175 16 8.38 16h-.76c-1.795 0-2.693 0-3.38-.39a3 3 0 0 1-.974-.882c-.456-.646-.544-1.54-.72-3.326L1.96 5.48 1 5V3h2.98l.012-.046c.185-.686.347-1.287.706-1.758A3 3 0 0 1 5.955.235C6.503.012 7.126.013 7.837.015M3.922 5l.614 6.205c.092.93.15 1.494.23 1.911.036.194.07.308.095.376.022.06.037.08.04.084.085.12.196.221.324.294a.3.3 0 0 0 .088.031c.07.018.187.04.383.059.423.038.99.04 1.925.04h.758c.935 0 1.502-.002 1.925-.04.196-.018.313-.04.383-.059.062-.016.083-.028.088-.03a1 1 0 0 0 .325-.295c.002-.004.017-.024.039-.084a2.4 2.4 0 0 0 .096-.376c.08-.417.138-.981.23-1.91L12.077 5zm5.766-2.592c.063.084.116.2.232.592H6.057c.115-.393.168-.508.232-.592a1 1 0 0 1 .419-.32c.137-.056.327-.074 1.28-.074s1.144.018 1.28.074a1 1 0 0 1 .42.32" clip-rule="evenodd"></path>
    </svg>
`

function checkiIs__onQuickLotsPage() {
    'use strict';

    // Функция проверки URL
    function isQuickLotsPage(url) {
        const base = 'https://logistics.market.yandex.ru/sorting-center/21972131/sortables';
        if (!url.startsWith(base)) return false;
        
        const params = new URLSearchParams(url.split('?')[1] || '');
        return params.get('turboPI-Quick-Lots') === 'true' 
    }

    // Функция добавления блока (и отключения наблюдателя)
    function addTurboBlock() {
        if (document.querySelector('.tpi-ql--wrapper')) return;

        document.title = "Быстрые лоты"

        const overlay = document.createElement('div');
        overlay.className = 'tpi-ql--wrapper';

        overlay.innerHTML = 
        `
        <div class="tpi-ql--modal-window" current-state="hidden">
            <div class="tpi-ql--modal-window-wrapper">
                <div class="tpi-ql--modal-window-wrapper-title">
                    <h1>null</h1>
                    <button class="tpi-ql--modal-window-exit">
                        <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
                <div class="tpi-ql--modal-window-wrapper-devider"></div>
                <div class="tpi-ql--modal-window-wrapper-table-wrapper">

                </div>
            </div>
        </div>
        <div class="tpi-ql--wrapper-title">Быстрые лоты
            <div class="tpi-ql-firebase-storage-data">
                <div class="tpi-ql-firebase-storage-data-item">
                    <p>Использованно 0% хранилища</p>
                </div>
                <div class="tpi-ql-firebase-storage-data-item">
                    <p>Память: 0MB/1GB</p>
                </div>
                <div class="tpi-ql-firebase-storage-data-item">
                    <p>Дедлайн хранилища: ∞</p>
                </div>
            </div>
        </div>
        <div class="tpi-ql--filters-panel">
            <div class="tpi-ql--filters-wrapper">
                <div class="tpi-ql--filters-wrapper-title">
                    <p>Фильтры</p>
                </div>
                <div class="tpi-ql--filters-items-wrapper">
                    <div class="tpi-ql--filters-item">
                        <label for="tpi-ql-firebase--search-pack-id" class="tpi-ql-firebase--search-label">
                            <div class="tpi-ql-firebase--search-icon">
                                <svg color="#666666" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m16.563 16.458 4.223 5.372-1.572 1.236-4.21-5.356a8.5 8.5 0 1 1 1.56-1.253ZM10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"></path>
                                </svg>
                            </div>
                            <div class="tpi-ql-firebase--search-label-title">
                                Номер пачки
                            </div>
                            <input type="text" id="tpi-ql-firebase--search-pack-id" placeholder="Введите номер пачки">
                        </label>
                    </div>
                    <div class="tpi-ql--filters-item">
                        <label for="tpi-ql-firebase--search-lot-in-pack" class="tpi-ql-firebase--search-label">
                            <div class="tpi-ql-firebase--search-icon">
                                <svg color="#666666" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m16.563 16.458 4.223 5.372-1.572 1.236-4.21-5.356a8.5 8.5 0 1 1 1.56-1.253ZM10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"></path>
                                </svg>
                            </div>
                            <div class="tpi-ql-firebase--search-label-title">
                                Номер лота в пачке
                            </div>
                            <input type="text" id="tpi-ql-firebase--search-lot-in-pack" placeholder="Введите номер лота">
                        </label>
                    </div>
                    <div class="tpi-ql--filters-item">
                        <label for="tpi-ql-firebase--search-shipping-warehouse" class="tpi-ql-firebase--search-label tpi-ql-firebase--search-label-list">
                            <div class="tpi-ql-firebase--search-label-title">
                                Склад получателя
                            </div>
                            <input type="text" id="tpi-ql-firebase--search-shipping-warehouse" placeholder="Введите название склада">
                            <div class="tpi-ql-firebase--search-icon">
                                <svg color="#666666" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.084 7 21.5 8.427 12 18 2.5 8.427 3.916 7 12 15.147 20.084 7Z"></path>
                                </svg>
                            </div>
                        </label>
                    </div>
                    <div class="tpi-ql--filters-item">
                        <label for="tpi-ql-firebase--search-shipping-type" class="tpi-ql-firebase--search-label tpi-ql-firebase--search-label-list">
                            <div class="tpi-ql-firebase--search-label-title">
                                Тип отгрузки
                            </div>
                            <input type="text" id="tpi-ql-firebase--search-shipping-type" placeholder="Введите тип отгрузки">
                            <div class="tpi-ql-firebase--search-icon">
                                <svg color="#666666" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.084 7 21.5 8.427 12 18 2.5 8.427 3.916 7 12 15.147 20.084 7Z"></path>
                                </svg>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="tpi-ql--controls-panel" current-state="default">
            <div class="tpi-ql--controls-wrapper" current-state="default">
                <div class="tpi-ql--controls-wrapper-title">
                    <p>Добавить пачку лотов</p>
                </div>
                <div class="tpi-ql--controls-items-wrapper">
                    <div class="tpi-ql--controls-item">
                        <button class="tpi-ql--create-lot-option" lot-type="forward" lot-cell-name="3 - LIPETSK" tpi-ql-cell-id="15152">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                            </svg>
                            <p>СЦ Липецк</p>
                        </button>
                        <label for="tpi-ql--option-input-1" class="tpi-ql--lots-amount">
                            <input id="tpi-ql--option-input-1" type="number" max="50" min="10" value="10">
                        </label>
                    </div>
                    <div class="tpi-ql--controls-item">
                        <button class="tpi-ql--create-lot-option" lot-type="forward" lot-cell-name="2 - KURSK" tpi-ql-cell-id="15156">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                            </svg>
                            <p>СЦ Курск</p>
                        </button>
                        <label for="tpi-ql--option-input-2" class="tpi-ql--lots-amount">
                            <input id="tpi-ql--option-input-2" type="number" max="50" min="10" value="10">
                        </label>
                    </div>
                    <div class="tpi-ql--controls-item">
                        <button class="tpi-ql--create-lot-option" lot-type="forward" lot-cell-name="1 - BELGOROD" tpi-ql-cell-id="15156">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                            </svg>
                            <p>СЦ Белгород</p>
                        </button>
                        <label for="tpi-ql--option-input-3" class="tpi-ql--lots-amount">
                            <input id="tpi-ql--option-input-3" type="number" max="50" min="10" value="10">
                        </label>
                    </div>
                    <!--<div class="tpi-ql--controls-item">
                        <button class="tpi-ql--create-lot-option" lot-type="forward" lot-cell-name="DIMAN-tpi-TESTS" tpi-ql-cell-id="26797431">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
                            </svg>
                            <p>Тесты</p>
                        </button>
                        <label for="tpi-ql--option-input-4" class="tpi-ql--lots-amount">
                            <input id="tpi-ql--option-input-4" type="number" max="50" min="0" value="1">
                        </label>
                    </div>
                    <div class="tpi-ql--controls-item">
                        <button class="tpi-ql--ADMIN--delete-lots">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" aria-hidden="true" viewBox="0 0 16 16">
                                <path fill="currentColor" d="M5.386 6h1.806l.219 7H5.886zm3.206 7 .218-7h1.814l-.5 7z"></path>
                                <path fill="currentColor" fill-rule="evenodd" d="M7.837.014h.303c.71-.001 1.333-.002 1.881.22a3 3 0 0 1 1.257.962c.36.47.522 1.072.707 1.758l.012.046H15v2l-.96.48-.585 5.922c-.177 1.787-.265 2.68-.72 3.326a3 3 0 0 1-.975.883C11.073 16 10.175 16 8.38 16h-.76c-1.795 0-2.693 0-3.38-.39a3 3 0 0 1-.974-.882c-.456-.646-.544-1.54-.72-3.326L1.96 5.48 1 5V3h2.98l.012-.046c.185-.686.347-1.287.706-1.758A3 3 0 0 1 5.955.235C6.503.012 7.126.013 7.837.015M3.922 5l.614 6.205c.092.93.15 1.494.23 1.911.036.194.07.308.095.376.022.06.037.08.04.084.085.12.196.221.324.294a.3.3 0 0 0 .088.031c.07.018.187.04.383.059.423.038.99.04 1.925.04h.758c.935 0 1.502-.002 1.925-.04.196-.018.313-.04.383-.059.062-.016.083-.028.088-.03a1 1 0 0 0 .325-.295c.002-.004.017-.024.039-.084a2.4 2.4 0 0 0 .096-.376c.08-.417.138-.981.23-1.91L12.077 5zm5.766-2.592c.063.084.116.2.232.592H6.057c.115-.393.168-.508.232-.592a1 1 0 0 1 .419-.32c.137-.056.327-.074 1.28-.074s1.144.018 1.28.074a1 1 0 0 1 .42.32" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>-->
                </div>
                
                <div class="tpi-ql--contol-pannel-loader">
                    <div class="tpi-ql--loader"></div>
                </div>
            </div>
            <div class="tpi-ql--status-wrapper">
                <div class="tpi-ql--status-wrapper-title">
                    <p>Прогресс создания пачки лотов</p>
                </div>
                <div class="tpi-ql--status-progress-wrapper">
                    <div class="tpi-ql--status-progress">
                        <div class="tpi-ql--status-progress-item">
                            <p>0%</p>
                            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="40" fill="none" stroke-width="10" style="stroke: #cccccc;"></circle>
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#fc0" stroke-width="10" stroke-dasharray="251.2" transform="rotate(-90 50 50)" stroke-dashoffset="251.2"></circle>
                            </svg>
                            <div class="tpi-ql--status-progress-item-finished">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="tpi-ql--status-progress-description-wrapper">
                            <div class="tpi-ql--status-progress-description">
                                <p current-state="shown">Ожидание инициализации статуса</p>
                                <p current-state="next">Вызов запроса</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tpi-ql--table-wrapper">
            <table>
                <thead class="tpi-ql--table--thead">
                    <tr>
                        <th>
                            <div>Номер пачки</div>
                        </th>
                        <th>
                            <div>Тип пачки</div>
                        </th>
                        <th>
                            <div>Статический статус</div>
                        </th>
                        <th>
                            <div>Количество лотов</div>
                        </th>
                        <th>
                            <div>Куда</div>
                        </th>
                        <th>
                            <div>Напрпавление группировки</div>
                        </th>
                        <th>
                            <div>Дата создания</div>
                        </th>
                        <th>
                            <div>Дата удаления</div>
                        </th>
                        <th>
                            <div>Дата печати</div>
                        </th>
                        <th>
                            <div>Печать пачки</div>
                        </th>
                        <th>
                            <div>Удаление пачки</div>
                        </th>
                    </tr>
                </thead>
                <tbody class="tpi-ql--table--tbody">
                    <tr class="tpi-ql--table--tbody-preloader">
                        <td colspan="11">
                            <div>
                                <span></span>
                                <p>Загрузка данных из базы данных TURBOpi</p>
                            </div>
                        <td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="tpi-ql--table-controls-wrapper">
            <div class="tpi-ql--table-controls-block">
                <div class="tpi-ql--table-controls-item">
                    <h1>Количество строк в таблице</h1>
                    <div class="tpi-ql--table-tr-amount-sellection">
                        <button class="tpi-ql--table-tr-amount" tpi-list-size="10" current-state="default">10</button>
                        <button class="tpi-ql--table-tr-amount" tpi-list-size="20" current-state="selected">20</button>
                        <button class="tpi-ql--table-tr-amount" tpi-list-size="30" current-state="default">30</button>
                        <button class="tpi-ql--table-tr-amount" tpi-list-size="50" current-state="default">50</button>
                        <button class="tpi-ql--table-tr-amount" tpi-list-size="100" current-state="default">100</button>
                        <button class="tpi-ql--table-tr-amount" tpi-list-size="200" current-state="default">200</button>
                    </div>
                </div>
            </div>
            <div class="tpi-ql--table-controls-block">
                <div class="tpi-ql--table-controls-item">
                    <h1>Страница</h1>
                    <div class="tpi-ql--table-tr-page-sellection">
                        <button class="tpi-ql--table-page-sellection" tpi-ql-page-control="prevPage" disabled>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
                            </svg>
                        </button>
                        <p class="tpi-ql--table-current-page">1</p>
                        <button class="tpi-ql--table-page-sellection" tpi-ql-page-control="nextPage">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="tpi-ql--delete-lotpack-wrapper" current-state="hidden">
            <div class="tpi-ql--delete-lotpack-block">
                <div class="tpi-ql--delete-lotpack-title">
                    <p>Пачка ${"test"}</p>
                </div>
                <button class="tpi-ql--delete-lotpack-button">
                    Удалить пачку лотов
                </button>
                <button class="tpi-ql--delete-lotpack-close">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.44 12 21 19.56 19.56 21 12 13.44 4.44 21 3 19.56 10.56 12 3 4.44 4.44 3 12 10.56 19.56 3 21 4.44 13.44 12Z" fill="#000"></path>
                    </svg>
                </button>
            </div>
        </div>
        `

        const appID = document.getElementById("app")
        const headerTitle = document.querySelector(".p-layout__header-wrapper")
        appID.style.display = "none"
        headerTitle.style.display = "none"

        document.querySelector(".p-layout__content").appendChild(overlay);
        
        callTurboPI__once();
        addTurboPiTitle()
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        
        setTimeout(() => {
            handleTableSizeButtons();
            handlePaginationButtons();
            
            if (!firebaseListenerInitialized) {
                initializeFirebaseRealtimeListener();
                updateTableWithFirebaseData();
            }
        }, 100);

        //~ Обработка ввода количества лотов (только двухзначные числа, 10–50, с перезаписью)
        document.querySelectorAll('.tpi-ql--lots-amount input').forEach(input => {
            // При фокусе очищаем поле
            input.addEventListener('focus', () => {
                input.value = '';
            });

            // При вводе ограничиваем цифрами и перезаписываем при третьей цифре
            input.addEventListener('input', () => {
                // Убираем всё кроме цифр
                input.value = input.value.replace(/\D/g, '');

                // Если больше 2 цифр — берём только последнюю
                if (input.value.length > 2) {
                    input.value = input.value.slice(-1);
                }
            });

            // При потере фокуса приводим к диапазону 10–50
            input.addEventListener('blur', () => {
                let val = parseInt(input.value, 10);

                if (isNaN(val)) {
                    val = 10; // если ничего не ввели
                } else if (val < 10) {
                    val = 10;
                } else if (val > 50) {
                    val = 50;
                }

                input.value = val;
            });
        });


        //~ Обрабтотка нажатия кнопок (добавление лотов)
        const creatLotButtons = document.querySelectorAll('.tpi-ql--create-lot-option');
        creatLotButtons.forEach(button =>{
            const controlsWrapper = document.querySelector('.tpi-ql--controls-wrapper');
            button.addEventListener('click', ()=>{
                const lotType = button.getAttribute('lot-type');
                const cellName = button.getAttribute('lot-cell-name');
                const inputElement = button.parentElement.querySelector('label input');
                const tpiQlControlPanel = document.querySelector(".tpi-ql--controls-panel");
                const finalIcon = document.querySelector('.tpi-ql--status-progress-item-finished');
                const statusWrapper = document.querySelector('.tpi-ql--status-wrapper');
                
                // Принудительно корректируем значение в input перед получением amount
                let currentValue = parseInt(inputElement.value);
                if (isNaN(currentValue) || currentValue < 10) {
                    inputElement.value = '10';
                    currentValue = 10;
                } else if (currentValue > 50) {
                    inputElement.value = '50';
                    currentValue = 50;
                }
                
                const amount = currentValue;
                console.log('Финальное количество лотов:', amount);
                
                // Сохраняем ссылку на кнопку для финального сообщения
                window.currentButton = button;
                
                // Сбрасываем прогресс перед началом
                totalTasks = 0;
                completedTasks = 0;
                
                // Восстанавливаем изначальное состояние прогресса
                const descriptionWrapper = document.querySelector('.tpi-ql--status-progress-description');
                descriptionWrapper.innerHTML = `
                    <p current-state="shown">Ожидание инициализации статуса</p>
                    <p current-state="next">Вызов запроса</p>
                `;
                
                statusWrapper.style.display = "flex";
                setTimeout(() => {
                    statusWrapper.style.width = "calc(40% - 20px)";
                }, 10);
        
                updateProgress(0, "Подготовка к созданию лотов", "Инициализация процесса");
                
                // Блокируем кнопки и добавляем inert атрибут
                controlsWrapper.setAttribute('inert', '');
                
                finalIcon.setAttribute('current-state', 'default');
                controlsWrapper.setAttribute('current-state', 'loading');
                tpiQlControlPanel.setAttribute('current-state', 'creating-lot');
                
                ql_processLotButtons(lotType, cellName, amount).then(() => {
                    // Автоматически скрываем состояние загрузки после завершения
                    controlsWrapper.setAttribute('current-state', 'default');
                    controlsWrapper.removeAttribute('inert');
                }).catch(error => {
                    console.error('Ошибка в процессе:', error);
                    controlsWrapper.setAttribute('current-state', 'default');
                    controlsWrapper.removeAttribute('inert');
                });
            });
        });
    
        //~ Обработчики для удаления пачки
        const tbody = document.querySelector('.tpi-ql--table--tbody');

        // Делегирование для кнопок удаления
        tbody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('button[tpi-ql--lotpack-delete]');
            if (!deleteBtn) return;

            const tr = deleteBtn.closest('tr');
            if (!tr) return;

            const lotPackDiv = tr.querySelector('.tpi-ql--LOTPACK-name');
            if (!lotPackDiv) return;

            const lotPackName = lotPackDiv.getAttribute('tpi-ql-firebase-data-lotpackname');
            if (!lotPackName) return;

            // Подставляем имя пачки в заголовок
            const deleteTitle = document.querySelector('.tpi-ql--delete-lotpack-title p');
            if (deleteTitle) {
                deleteTitle.textContent = `Пачка ${lotPackName}`;
            }

            // Сохраняем ID в обертке
            const deleteWrapper = document.querySelector('.tpi-ql--delete-lotpack-wrapper');
            if (deleteWrapper) {
                deleteWrapper.setAttribute('data-lotpack-id', lotPackName);
                deleteWrapper.style.display = 'flex'
                setTimeout(() => {
                    deleteWrapper.setAttribute('current-state', 'shown');
                }, 10);
            }
        });

        // Обработчик подтверждения удаления
        const deleteWrapper = document.querySelector('.tpi-ql--delete-lotpack-wrapper');
        const confirmDeleteBtn = deleteWrapper.querySelector('.tpi-ql--delete-lotpack-button');
        
        confirmDeleteBtn.addEventListener('click', async () => {
            const lotPackId = deleteWrapper.getAttribute('data-lotpack-id');
            if (!lotPackId) return;
        
            deleteWrapper.setAttribute('current-state', "hidden")
            setTimeout(() => {
                deleteWrapper.style.display = 'none'
            }, 500);

            try {
                // Извлекаем дату из ID пачки (формат: LOTPACK-YYMMDDNN)
                const datePart = lotPackId.split('-')[1].substring(0, 6);
                const year = '20' + datePart.substring(0, 2);
                const month = datePart.substring(2, 4);
                const day = datePart.substring(4, 6);
                const dateDoc = `${year}-${month}-${day}`;
        
                console.log('Поиск пачки в дате:', dateDoc);
        
                const docRef = db.collection("dates").doc(dateDoc).collection("lotpacks").doc(lotPackId);
                const docSnapshot = await docRef.get();
        
                if (!docSnapshot.exists) {
                    // Если не найдено в конкретной дате, ищем во всех датах
                    console.log('Пачка не найдена в дате', dateDoc, ', ищем во всех датах...');
                    
                    let found = false;
                    const datesSnapshot = await db.collection("dates").get();
                    
                    for (const dateDoc of datesSnapshot.docs) {
                        const packRef = dateDoc.ref.collection("lotpacks").doc(lotPackId);
                        const packSnapshot = await packRef.get();
                        
                        if (packSnapshot.exists) {
                            found = true;
                            await packRef.update({
                                status: "deleted",
                                "deleted-time": firebase.firestore.Timestamp.now()
                            });
                            console.log(`Пачка ${lotPackId} помечена как удалённая в дате ${dateDoc.id}`);
                            break;
                        }
                    }
                    
                    if (!found) {
                        throw new Error(`Пачка ${lotPackId} не найдена ни в одной дате`);
                    }

                    
                } else {
                    // Пачка найдена в ожидаемой дате
                    await docRef.update({
                        status: "deleted",
                        "deleted-time": firebase.firestore.Timestamp.now()
                    });
                    console.log(`Пачка ${lotPackId} помечена как удалённая`);
                }
        
                deleteWrapper.setAttribute('current-state', 'hidden');
                
                // Обновляем таблицу после удаления
                await loadTableData();
                
            } catch (err) {
                console.error("Ошибка при удалении пачки:", err);
                tpiNotification.show('Ошибка удаления', 'error', `Не удалось удалить пачку: ${err.message}`);
            }
        });

        //~ Закрыть 
        const closeDeleteLotpackWrapper = document.querySelector(".tpi-ql--delete-lotpack-close")
        closeDeleteLotpackWrapper.addEventListener('click', ()=>{
            deleteWrapper.setAttribute('current-state', "hidden")
            setTimeout(() => {
                deleteWrapper.style.display = 'none'
            }, 500);
        })

        //~ Обработка нажатия на модальное окно
        const modalWindow = document.querySelector('.tpi-ql--modal-window');
        const modalWrapper = document.querySelector('.tpi-ql--modal-window-wrapper');
        const exitButton = document.querySelector('.tpi-ql--modal-window-exit');
        const tableWrapper = document.querySelector('.tpi-ql--modal-window-wrapper-table-wrapper');

        // Обработчик клика по модальному окну
        modalWindow.addEventListener('click', () => {
            modalWindow.setAttribute('current-state', 'hidden');
            setTimeout(() => {
                tableWrapper.innerHTML = ``
            }, 50);
        });
    
        // Обработчик клика по wrapper - останавливаем всплытие события
        modalWrapper.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    
        // Обработчик клика по кнопке закрытия
        exitButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие
            modalWindow.setAttribute('current-state', 'hidden');
            setTimeout(() => {
                tableWrapper.innerHTML = ``
            }, 500);
        });

        // //A- Функция админа
        // const ADMINdeleteALL_Lots = document.querySelector('.tpi-ql--ADMIN--delete-lots')
        // ADMINdeleteALL_Lots.addEventListener('click', ADMIN_delete_lots)

        // setTimeout(() => {
        //     if (!firebaseListenerInitialized) {
        //         initializeFirebaseRealtimeListener();
        //         updateTableWithFirebaseData();
        //     }
        // }, 100);
    }

    if (isQuickLotsPage(location.href)) {
        addTurboBlock();
        addToastContainer()
        setTimeout(() => {
            tpiNotification.show('Страница "Быстрые лоты" интегрированна', "info", `Для получения подробной информации о пользовании инструменом, посетите Wiki TURBOpi`);
        }, 1000);
        return; 
    }

    observer = new MutationObserver(() => {
        if (isQuickLotsPage(location.href)) {
            addTurboBlock();
        }
    });
    initTextAreaHandlers();
    observer.observe(document, { subtree: true, childList: true });
    setTimeout(() => {
        addTurboPiTitle()
    }, 1000);
}

//A- Функция админа (не лезь если не знаешь !!!!!!!!!)
function ADMIN_delete_lots() {
    // Находим все строки таблицы
    const rows = document.querySelectorAll('tr');
    let deleteButtonsClicked = 0;
    
    // Проходим по всем строкам
    rows.forEach((row, index) => {
        // Ищем кнопку удаления в текущей строке
        const deleteButton = row.querySelector('button[data-e2e="delete-lot-button"]');
        
        if (deleteButton) {
            // Если это не последняя строка с кнопкой удаления
            if (index < rows.length - 1) {
                // Создаем событие клика для React
                const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
                
                mouseClickEvents.forEach(mouseEventType => {
                    const event = new MouseEvent(mouseEventType, {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    deleteButton.dispatchEvent(event);
                });
                
                console.log(`Клик по кнопке удаления в строке ${index + 1}`);
                deleteButtonsClicked++;
            }
        }
    });
    
    console.log(`Нажато кнопок: ${deleteButtonsClicked}`);
}

//~

const ql_setInputValue = (inputElement, value) => {
    if (!inputElement) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(inputElement, value);
    const inputEvent = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(inputEvent);
};


function fillInput(input, text) {
    if (!input) return false;
    
    // Фокусируемся на поле
    input.focus();
    
    // Очищаем поле
    input.value = '';
    
    // Устанавливаем новое значение через нативный setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 
        "value"
    ).set;
    nativeInputValueSetter.call(input, text);
    
    // Создаем события для React (более полный набор событий)
    const inputEvent = new Event('input', { 
        bubbles: true,
        cancelable: true,
    });
    
    const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
    });
    
    // Для числовых полей также важно событие keydown
    const keyDownEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: '1',
        keyCode: 49,
        which: 49
    });
    
    const keyUpEvent = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: '1',
        keyCode: 49,
        which: 49
    });
    
    // Диспатчим события в правильном порядке
    input.dispatchEvent(keyDownEvent);
    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);
    input.dispatchEvent(keyUpEvent);
    
    // Для React также может потребоваться событие blur
    const blurEvent = new Event('blur', { bubbles: true });
    input.dispatchEvent(blurEvent);
    
    return true;
}

// Альтернативная функция специально для числовых полей
function fillNumericInput(input, number) {
    if (!input || typeof number !== 'number') return false;
    
    // Фокусируемся на поле
    input.focus();
    
    // Очищаем поле
    input.value = '';
    
    // Устанавливаем значение через свойство value
    input.value = number.toString();
    
    // Создаем специальное событие для числовых input
    const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: number.toString()
    });
    
    input.dispatchEvent(inputEvent);
    
    // Также отправляем change событие
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);
    
    // Убираем фокус
    input.blur();
    
    return true;
}

async function ql_processLotButtons(lotTpe, cellName, amount) {
    try {
        if (lotTpe && cellName && amount) {
            // Рассчитываем batch sizes
            const totalAmount = parseInt(amount);
            const fullBatches = Math.floor(totalAmount / 10);
            const remainder = totalAmount % 10;
            const batchSizes = [];
            
            for (let i = 0; i < fullBatches; i++) {
                batchSizes.push(10);
            }
            if (remainder > 0) {
                batchSizes.push(remainder);
            }
            
            // Инициализируем отслеживание прогресса
            totalTasks = calculateTotalTasks(batchSizes, totalAmount);
            completedTasks = 0;
            currentBatch = 0;
            totalBatches = batchSizes.length;
            
            // Устанавливаем начальные задачи
            currentTaskName = "Инициализация процесса";
            nextTaskName = "Вызов опции создания";
            updateProgress(0, currentTaskName, nextTaskName);
            
            const cellInput = document.querySelector('div[data-e2e="filters-cell-name"] input[data-tid-prop="282bb2c7 f17a1bf8"]');
            const originalValue = cellInput.value;
            
            console.log('1. Вызываем мутацию таблицы временной подстановкой значения');
            ql_setInputValue(cellInput, "tableMutatuion");
            await waitForTableMutation();
            
            console.log('2. Возвращаем оригинальное значение');
            ql_setInputValue(cellInput, cellName);
            await waitForTableMutation();
            
            // Обновляем прогресс после инициализации
            incrementCompletedTasks();
            moveToNextTask("Вызов опции создания", "Уточнение типа для лотов");
            currentTaskName = "Вызов опции создания";
            nextTaskName = "Уточнение типа для лотов";
        } else {
            return;
        }

        const totalAmount = parseInt(amount);
        let allAddedBarcodes = [];
        
        // Определяем количество полных партий и остаток
        const fullBatches = Math.floor(totalAmount / 10);
        const remainder = totalAmount % 10;

        // Функция для добавления одной партии лотов
        const addBatch = async (batchSize) => {
            console.log(`Добавляем партию из ${batchSize} лотов`);
            
            const existingBarcodes = new Set(getAllBarcodes());
            
            // Задача 3: Нажимаем кнопку создания лота
            console.log('3. Нажимаем кнопку создания лота');
            incrementCompletedTasks();
            moveToNextTask("Уточнение типа для лотов", "Привязка лотов к ячейкам");
            currentTaskName = "Уточнение типа для лотов";
            nextTaskName = "Привязка лотов к ячейкам";
            
            const firstButton = await waitForElement('button[data-e2e="create-sortable-toggler"]', 5000);
            clickElement(firstButton);

            console.log('4. Нажимаем кнопку создания лота (вторая)');
            const secondButton = await waitForElement('span[data-e2e="create-lot-button"]', 5000);
            clickElement(secondButton);

            console.log('5. Ждем появления формы');
            await waitForElement('span[data-e2e-i18n-key="pages.sorting-center-sortable-list:lots-form.create-title"]', 5000);

            // Задача 6: Заполняем поле Тип
            console.log('6. Заполняем поле Тип');
            incrementCompletedTasks();
            moveToNextTask("Привязка лотов к ячейкам", "Установка количества лотов");
            currentTaskName = "Привязка лотов к ячейкам";
            nextTaskName = "Установка количества лотов";
            
            const typeInput = await waitForElement('input[value="Возврат"]', 5000);
            clickElement(typeInput);

            let tempLotType = '';
            let tempDataValue = '';
            if (lotTpe === 'forward') {
                tempLotType = 'Отгрузка';
                tempDataValue = 'COURIER';
            } else if (lotTpe === 'return') {
                tempLotType = 'Возврат';
                tempDataValue = 'RETURN';
            } else if (lotTpe === 'hran') {
                tempLotType = 'Хранение';
                tempDataValue = 'BUFFER';
            } else {
                alert('Неизвестный тип лота');
                return;
            }

            console.log('7. Выбираем тип лота:', tempLotType);
            const shipmentOption = await waitForElement(`div[data-value="${tempDataValue}"][data-label="${tempLotType}"]`, 5000);
            clickElement(shipmentOption);

            console.log('8. Ищем поле Ячейка');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const inputContainers = document.querySelectorAll('[class*="___inner___"]');
            let cellInputForm = null;
            
            for (const container of inputContainers) {
                const label = container.querySelector('label');
                if (label && label.textContent.includes('Ячейка')) {
                    cellInputForm = container.querySelector('input');
                    break;
                }
            }

            if (!cellInputForm) {
                throw new Error('Поле "Ячейка" не найдено');
            }

            clickElement(cellInputForm);

            // Задача 9: Выбираем ячейку
            console.log('9. Выбираем ячейку:', cellName);
            incrementCompletedTasks();
            moveToNextTask("Установка количества лотов", "Создание лотов");
            currentTaskName = "Установка количества лотов";
            nextTaskName = "Создание лотов";
            
            const cellOption = await waitForElement(`div[data-label="${cellName}"]`, 5000);
            clickElement(cellOption);

            // Задача 10: Заполняем количество
            console.log('10. Заполняем количество:', batchSize);
            incrementCompletedTasks();
            moveToNextTask("Создание лотов", "Ожидание подтверждения");
            currentTaskName = "Создание лотов";
            nextTaskName = "Ожидание подтверждения";
            
            const quantityInput = await waitForElement('input[name="count"]', 1000);
            if (quantityInput) {
                fillInput(quantityInput, `${batchSize}`);
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.error('Поле "Количество" не найдено');
            }

            // Задача 11: Нажимаем кнопку Добавить
            console.log('11. Нажимаем кнопку Добавить');
            incrementCompletedTasks();
            moveToNextTask("Ожидание подтверждения", "Завершение партии");
            currentTaskName = "Ожидание подтверждения";
            nextTaskName = "Завершение партии";
            
            const addButton = await waitForElementByXPath('//button[.//span[contains(text(), "Добавить")]]', 5000);

            if (addButton) {
                clickElement(addButton);
                await waitForFormToClose();
                
                // Ждем появления новых штрихкодов
                const addedBarcodes = await waitForNewBarcodes(existingBarcodes, batchSize);
                
                // Обновляем прогресс после завершения партии
                moveToNextTask("Завершение партии", currentBatch < totalBatches - 1 ? "Начало следующей партии" : "Генерация QR-кодов");
                currentTaskName = "Завершение партии";
                nextTaskName = currentBatch < totalBatches - 1 ? "Начало следующей партии" : "Генерация QR-кодов";
                
                return addedBarcodes;
            }
            
            return [];
        };

        // Добавляем полные партии по 10 лотов
        for (let i = 0; i < fullBatches; i++) {
            currentBatch = i;
            const addedBarcodes = await addBatch(10);
            allAddedBarcodes = allAddedBarcodes.concat(addedBarcodes);
            
            // Небольшая задержка между партиями
            if (i < fullBatches - 1 || remainder > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Добавляем остаток, если есть
        if (remainder > 0) {
            currentBatch = fullBatches;
            const addedBarcodes = await addBatch(remainder);
            allAddedBarcodes = allAddedBarcodes.concat(addedBarcodes);
        }

        // Обновляем прогресс перед генерацией QR-кодов
        moveToNextTask("Генерация QR-кодов", "Создание PDF документа");
        currentTaskName = "Генерация QR-кодов";
        nextTaskName = "Создание PDF документа";
        
        // Финальное обновление прогресса и отображение сообщения
        updateProgress(100, "", "");
        showFinalMessage(allAddedBarcodes);
        
        // Проверяем общее количество добавленных лотов
        if (allAddedBarcodes.length === totalAmount) {
            console.log(`Успешно добавлено ${totalAmount} лотов: ${allAddedBarcodes.join(', ')}`);
        } else {
            console.log(`Добавлено ${allAddedBarcodes.length} из ${totalAmount} лотов: ${allAddedBarcodes.join(', ')}`);
        }
        
        return allAddedBarcodes;

    } catch (error) {
        console.error('Ошибка:', error.message);
        updateProgress((completedTasks / totalTasks) * 100, `Ошибка: ${error.message}`, "Прервано");
        throw error;
    }
}


//~ Создание лотов

function clickElement(element) {
    if (!element) return false;
    
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
    
    if (typeof React !== 'undefined') {
        const reactKey = Object.keys(element).find(key => key.startsWith('__reactFiber$'));
        if (reactKey) {
            const fiberNode = element[reactKey];
            let current = fiberNode;
            while (current) {
                if (current.memoizedProps && current.memoizedProps.onClick) {
                    current.memoizedProps.onClick();
                    break;
                }
                current = current.return;
            }
        }
    }
    return true;
}

function getAddedBarcodesAfter(firstBarcode) {
    const allBarcodeElements = document.querySelectorAll('tr a[data-e2e="sortable-barcode-link"] div');
    const addedBarcodes = [];
    let foundFirst = false;
    
    for (const element of allBarcodeElements) {
        const barcode = element.textContent.trim();
        
        if (barcode === firstBarcode) {
            foundFirst = true;
            continue;
        }
        
        if (foundFirst) {
            addedBarcodes.push(barcode);
        }
    }
    
    return addedBarcodes;
}

function waitForTableMutation() {
    return new Promise((resolve) => {
        console.log('Ожидаем обновления таблицы...');
        setTimeout(() => {
            console.log('Ожидание таблицы завершено');
            resolve();
        }, 2000);
    });
}
// Улучшенная функция для ожидания элемента
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        // Сначала проверяем сразу
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                reject(new Error(`Элемент ${selector} не найден за ${timeout}ms`));
            }
        }, 100);
    });
}

// Функция для ожидания мутации и получения добавленных номеров
function waitForMutationAndGetAddedBarcodes(firstBarcode, expectedAmount) {
    return new Promise((resolve) => {
        const spinnerContainer = document.querySelector('div[data-e2e="sortable-spinner"]');
        const addedBarcodes = [];
        let mutationTimeout;

        const observer = new MutationObserver((mutations) => {
            // Сбрасываем таймаут при каждой мутации
            clearTimeout(mutationTimeout);
            
            // Проверяем, завершилась ли мутация (нет активного спиннера)
            const activeSpinner = spinnerContainer.querySelector('div[aria-hidden="false"]');
            if (!activeSpinner) {
                // Ждем немного, чтобы убедиться, что мутация действительно завершена
                mutationTimeout = setTimeout(() => {
                    // Получаем все номера лотов после первого известного
                    const allBarcodeElements = document.querySelectorAll('tr a[data-e2e="sortable-barcode-link"] div');
                    let startCollecting = false;
                    
                    for (const element of allBarcodeElements) {
                        const barcode = element.textContent.trim();
                        
                        if (barcode === firstBarcode) {
                            startCollecting = true;
                            continue;
                        }
                        
                        if (startCollecting) {
                            addedBarcodes.push(barcode);
                        }
                    }
                    
                    observer.disconnect();
                    resolve(addedBarcodes);
                }, 1000);
            }
        });

        observer.observe(spinnerContainer, {
            attributes: true,
            subtree: true,
            attributeFilter: ['aria-hidden']
        });

        // Таймаут на случай, если мутация не произойдет
        setTimeout(() => {
            observer.disconnect();
            resolve(addedBarcodes);
        }, 30000);
    });
}

// Вспомогательная функция для поиска по XPath
function waitForElementByXPath(xpath, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                clearInterval(interval);
                resolve(result.singleNodeValue);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                reject(new Error(`Элемент по XPath ${xpath} не найден`));
            }
        }, 100);
    });
}

function waitForFormToClose() {
    return new Promise((resolve) => {
        console.log('Ожидаем закрытия формы...');
        
        const checkForm = setInterval(() => {
            const form = document.querySelector('span[data-e2e-i18n-key="pages.sorting-center-sortable-list:lots-form.create-title"]');
            if (!form) {
                console.log('Форма закрыта');
                clearInterval(checkForm);
                resolve();
            }
        }, 100);
        
        // Таймаут на случай если форма не закроется
        setTimeout(() => {
            clearInterval(checkForm);
            console.log('Таймаут ожидания закрытия формы');
            resolve();
        }, 5000);
    });
}

function waitForTableRowsUpdate(initialRowCount, expectedNewRows, firstBarcode) {
    return new Promise((resolve) => {
        console.log(`Ожидаем добавления ${expectedNewRows} строк в таблицу`);
        console.log('Начальное количество строк:', initialRowCount);
        
        let checkCount = 0;
        const maxChecks = 60; // 60 проверок по 500ms = 30 секунд
        
        const checkTable = () => {
            checkCount++;
            const currentRows = document.querySelectorAll('tr').length;
            console.log(`Проверка ${checkCount}: текущее количество строк = ${currentRows}`);
            
            // Получаем добавленные штрихкоды на каждой проверке
            const addedBarcodes = getAddedBarcodesAfter(firstBarcode);
            
            // Если нашли нужное количество штрихкодов
            if (addedBarcodes.length >= expectedNewRows) {
                console.log('Найдено нужное количество штрихкодов:', addedBarcodes.length);
                clearInterval(interval);
                resolve(addedBarcodes.slice(0, expectedNewRows));
            } 
            // Если количество строк увеличилось на ожидаемое количество или больше
            else if (currentRows >= initialRowCount + expectedNewRows) {
                console.log('Таблица обновилась, но штрихкодов меньше. Продолжаем поиск...');
                // Продолжаем проверять, не прерываем
            }
            // Если прошло много времени
            else if (checkCount >= maxChecks) {
                console.log('Таймаут ожидания обновления таблицы');
                console.log('Последние найденные штрихкоды:', addedBarcodes);
                clearInterval(interval);
                resolve(addedBarcodes);
            }
        };
        
        // Начинаем проверку сразу и затем каждые 500ms
        const interval = setInterval(checkTable, 500);
        checkTable(); // Первая проверка сразу
    });
}

async function waitForTableRowsUpdate(initialRowCount, expectedNewRows, firstBarcode) {
    console.log(`Ожидаем добавления ${expectedNewRows} строк в таблицу`);
    
    // Запоминаем все существующие штрихкоды перед добавлением
    const existingBarcodes = new Set(getAllBarcodes());
    console.log('Существующие штрихкоды:', Array.from(existingBarcodes));
    
    // Ждем появления новых штрихкодов
    const addedBarcodes = await waitForNewBarcodes(existingBarcodes, expectedNewRows);
    
    return addedBarcodes.slice(0, expectedNewRows);
}
// Функция для ожидания увеличения количества строк
function waitForRowCountIncrease(initialRowCount, expectedIncrease) {
    return new Promise((resolve) => {
        let checkCount = 0;
        const maxChecks = 40;
        
        const checkRows = () => {
            checkCount++;
            const currentRows = document.querySelectorAll('tr').length;
            
            if (currentRows >= initialRowCount + expectedIncrease || checkCount >= maxChecks) {
                console.log('Количество строк обновилось или таймаут');
                resolve();
            } else {
                setTimeout(checkRows, 500);
            }
        };
        
        checkRows();
    });
}

// Функция для получения всех штрихкодов в таблице
function getAllBarcodes() {
    const barcodeElements = document.querySelectorAll('tr a[data-e2e="sortable-barcode-link"] div');
    const barcodes = [];
    
    for (const element of barcodeElements) {
        const barcode = element.textContent.trim();
        if (barcode) {
            barcodes.push(barcode);
        }
    }
    
    return barcodes;
}

function waitForNewBarcodes(existingBarcodes, expectedCount) {
    return new Promise((resolve) => {
        console.log('Ожидаем появления новых штрихкодов...');
        
        let checkCount = 0;
        const maxChecks = 30;
        
        const checkForNewBarcodes = () => {
            checkCount++;
            const currentBarcodes = getAllBarcodes();
            const newBarcodes = currentBarcodes.filter(barcode => !existingBarcodes.has(barcode));
            
            console.log(`Проверка ${checkCount}: найдено ${newBarcodes.length} новых штрихкодов`);
            
            if (newBarcodes.length >= expectedCount || checkCount >= maxChecks) {
                console.log('Новые штрихкоды найдены:', newBarcodes);
                resolve(newBarcodes);
            } else {
                setTimeout(checkForNewBarcodes, 1000);
            }
        };
        
        checkForNewBarcodes();
    });
}

// Альтернативная функция для надежного поиска добавленных лотов
function reliableGetAddedBarcodes(existingBarcodes, expectedAmount) {
    return new Promise((resolve) => {
        console.log('Начинаем надежный поиск добавленных лотов...');
        
        let attempts = 0;
        const maxAttempts = 20;
        
        const findBarcodes = () => {
            attempts++;
            const currentBarcodes = getAllBarcodes();
            const newBarcodes = currentBarcodes.filter(barcode => !existingBarcodes.has(barcode));
            
            console.log(`Попытка ${attempts}: найдено ${newBarcodes.length} новых штрихкодов`);
            
            if (newBarcodes.length > 0 || attempts >= maxAttempts) {
                resolve(newBarcodes);
            } else {
                setTimeout(findBarcodes, 1000);
            }
        };
        
        findBarcodes();
    });
}

//A- прогресс выполнения задачь

// Функция для обновления прогресса
function updateProgress(targetPercentage, currentTask, nextTask) {
    const progressElement = document.querySelector('.tpi-ql--status-progress-item p');
    const progressCircle = document.querySelector('.tpi-ql--status-progress-item svg circle:nth-child(2)');
    const currentTaskElement = document.querySelector('.tpi-ql--status-progress-description p[current-state="shown"]');
    const nextTaskElement = document.querySelector('.tpi-ql--status-progress-description p[current-state="next"]');
    
    // Останавливаем предыдущую анимацию, если она была
    if (progressAnimationInterval) {
        clearInterval(progressAnimationInterval);
        progressAnimationInterval = null;
    }
    
    // Обновляем задачи
    if (currentTask && currentTaskElement) {
        currentTaskElement.textContent = currentTask;
    }
    
    if (nextTask && nextTaskElement) {
        nextTaskElement.textContent = nextTask;
    }
    
    // Запускаем плавную анимацию прогресса
    targetPercentage = Math.min(Math.round(targetPercentage), 100);
    const startPercentage = currentAnimatedPercentage;
    const duration = 800;
    const steps = 30;
    const stepTime = duration / steps;
    
    let step = 0;
    
    progressAnimationInterval = setInterval(() => {
        step++;
        
        // Вычисляем текущий процент с easing функцией для плавности
        const progress = step / steps;
        const easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        currentAnimatedPercentage = Math.round(startPercentage + (targetPercentage - startPercentage) * easedProgress);
        
        // Обновляем текст процента
        if (progressElement) {
            progressElement.textContent = `${currentAnimatedPercentage}%`;
        }
        
        // Обновляем круг прогресса
        if (progressCircle) {
            const circumference = 251.2;
            const offset = circumference - (currentAnimatedPercentage / 100 * circumference);
            progressCircle.style.transition = `stroke-dashoffset ${stepTime}ms ease`;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        // Завершаем анимацию
        if (step >= steps) {
            clearInterval(progressAnimationInterval);
            progressAnimationInterval = null;
            currentAnimatedPercentage = targetPercentage;
            
            // Убедимся, что финальное значение точно установлено
            if (progressElement) {
                progressElement.textContent = `${targetPercentage}%`;
            }
            if (progressCircle) {
                const circumference = 251.2;
                const offset = circumference - (targetPercentage / 100 * circumference);
                progressCircle.style.strokeDashoffset = offset;
            }
        }
    }, stepTime);
}

//A- Функция для перехода к следующей задаче
function moveToNextTask(newCurrentTask, newNextTask) {
    const descriptionWrapper = document.querySelector('.tpi-ql--status-progress-description');
    const currentTaskElement = document.querySelector('.tpi-ql--status-progress-description p[current-state="shown"]');
    const nextTaskElement = document.querySelector('.tpi-ql--status-progress-description p[current-state="next"]');
    
    if (!descriptionWrapper || !currentTaskElement || !nextTaskElement) return;
    
    // Помечаем текущую задачу как скрытую
    currentTaskElement.setAttribute('current-state', 'hidden');
    // Делаем следующую задачу текущей
    nextTaskElement.setAttribute('current-state', 'shown');
    
    setTimeout(() => {
        // Удаляем старую текущую задачу
        currentTaskElement.remove();
        
        // Создаем новую следующую задачу
        const newNextElement = document.createElement('p');
        newNextElement.setAttribute('current-state', 'next');
        newNextElement.textContent = newNextTask;
        
        descriptionWrapper.appendChild(newNextElement);
        
    }, 510);
}

//A- Функция для расчета общего количества задач
function calculateTotalTasks(batchSizes, totalLots) {
    return (batchSizes.length * 5) + 2 + 1 + 1;
}


//A- Функция для обновления счетчика выполненных задач
function incrementCompletedTasks() {
    completedTasks++;
    const percentage = (completedTasks / totalTasks) * 100;
    targetPercentage = percentage;
    updateProgress(percentage, currentTaskName, nextTaskName);
}

//A- Функция для отображения финального сообщения
// // В функции addTurboBlock(), в обработчике кнопок:
// const creatLotButtons = document.querySelectorAll('.tpi-ql--create-lot-option');
// creatLotButtons.forEach(button =>{
//     const controlsWrapper = document.querySelector('.tpi-ql--controls-wrapper');
//     button.addEventListener('click', ()=>{
//         const lotType = button.getAttribute('lot-type');
//         const cellName = button.getAttribute('lot-cell-name');
//         let amount = parseInt(button.parentElement.querySelector('label input').value);
//         let setAmount = button.parentElement.querySelector('label input').value
//         if (amount < 10) {
//             amount = 10;
//             setAmount = 10
//         } else if (amount > 50) {
//             amount = 50;
//             setAmount = 10
//         }
        
//         const tpiQlControlPanel = document.querySelector(".tpi-ql--controls-panel");
        
//         window.currentButton = button;
        
//         totalTasks = 0;
//         completedTasks = 0;
        
//         const descriptionWrapper = document.querySelector('.tpi-ql--status-progress-description');
//         descriptionWrapper.innerHTML = `
//             <p current-state="shown">Ожидание инициализации статуса</p>
//             <p current-state="next">Вызов запроса</p>
//         `;
        
//         updateProgress(0, "Подготовка к созданию лотов", "Инициализация процесса");
        
//         controlsWrapper.setAttribute('inert', '');
//         controlsWrapper.setAttribute('current-state', 'loading');
//         tpiQlControlPanel.setAttribute('current-state', 'creating-lot');
        
//         ql_processLotButtons(lotType, cellName, amount).then(() => {
//             controlsWrapper.setAttribute('current-state', 'default');
//             controlsWrapper.removeAttribute('inert');
//         }).catch(error => {
//             console.error('Ошибка в процессе:', error);
//             controlsWrapper.setAttribute('current-state', 'default');
//             controlsWrapper.removeAttribute('inert');
//         });
//     });
// });

//C- Функция для отображения финального сообщения
function showFinalMessage(allAddedBarcodes) {
    // Останавливаем анимацию прогресса
    if (progressAnimationInterval) {
        clearInterval(progressAnimationInterval);
        progressAnimationInterval = null;
    }
    
    // Устанавливаем финальные значения
    currentAnimatedPercentage = 100;
    targetPercentage = 100;
    
    const finalIcon = document.querySelector('.tpi-ql--status-progress-item-finished');
    const descriptionWrapper = document.querySelector('.tpi-ql--status-progress-description');
    const progressElement = document.querySelector('.tpi-ql--status-progress-item p');
    const progressCircle = document.querySelector('.tpi-ql--status-progress-item svg circle:nth-child(2)');
    
    // Немедленно обновляем прогресс до 100%
    if (progressElement) {
        progressElement.textContent = `100%`;
    }
    
    if (progressCircle) {
        const circumference = 251.2;
        const offset = circumference - (100 / 100 * circumference);
        progressCircle.style.transition = 'none';
        progressCircle.style.strokeDashoffset = offset;
    }
    
    // Очищаем все существующие задачи
    const existingTasks = descriptionWrapper.querySelectorAll('p');
    existingTasks.forEach(task => task.remove());
    
    // Создаем финальное сообщение
    const finalMessage = document.createElement('p');
    finalMessage.setAttribute('current-state', 'task-finished');
    finalMessage.textContent = 'Обработка завершена...';

    descriptionWrapper.appendChild(finalMessage);
    
    // Получаем данные из нажатой кнопки
    const buttonElement = window.currentButton;
    const cellName = buttonElement.getAttribute('lot-cell-name');
    const lotType = buttonElement.getAttribute('lot-type');

    // Преобразуем массив лотов
    const lotsData = allAddedBarcodes.map((lot, idx) => ({
        lotname: lot,
        lotid: String(idx + 1)
    }));

    // Создаём пачку в Firebase с дополнительными параметрами
    createLotPack(lotsData, cellName, lotType).then(({ dateDoc, lotPackId }) => {
        finalMessage.innerHTML = `Создана пачка <a href="https://console.firebase.google.com/project/dailylot/firestore/data/~2Fdates~2F${dateDoc}~2Flotpacks~2F${lotPackId}" target="_blank">${lotPackId}</a>`;
        
        // Обновляем UI
        setTimeout(() => {
            if (finalIcon) {
                finalIcon.setAttribute('current-state', 'task-finished');
            }
        }, 500);
        
    }).catch(err => {
        console.error("Ошибка при сохранении пачки:", err);
        finalMessage.innerHTML = "Ошибка при создании пачки, см. консоль.";
    });
}

//C- Функция для обновления таблицы данными из Firebase
async function updateTableWithFirebaseData() {
    try {
        console.log('Начинаем обновление таблицы из Firebase...');
        
        let allLotPacks = [];
        
        // Попробуем несколько способов получения данных
        await getAllLotPacks(allLotPacks);
        
        console.log('Всего пачек найдено:', allLotPacks.length);
        
        if (allLotPacks.length === 0) {
            console.log('Пачки не найдены, проверьте структуру данных в Firebase');
            // Покажем заглушку или сообщение об отсутствии данных
            showNoDataMessage();
            return;
        }
        
        // Сортируем по дате создания (новые сверху)
        allLotPacks.sort((a, b) => {
            const timeA = a['create-time'] ? a['create-time'].toDate().getTime() : 0;
            const timeB = b['create-time'] ? b['create-time'].toDate().getTime() : 0;
            return timeB - timeA;
        });
        
        // Берем последние 20 записей
        const recentLotPacks = allLotPacks.slice(0, 20);
        console.log('Отображаем последние', recentLotPacks.length, 'пачек');
        
        // Обновляем таблицу
        updateTableWithData(recentLotPacks);
        
    } catch (error) {
        console.error('Ошибка при загрузке данных из Firebase:', error);
    }
}

//C- Основная функция для получения всех пачек
async function getAllLotPacks(allLotPacks) {
    try {
        // Способ 1: Попробуем получить через collectionGroup (рекомендуемый способ)
        console.log('Попытка получения через collectionGroup...');
        const lotPacksSnapshot = await db.collectionGroup('lotpacks').get();
        
        if (!lotPacksSnapshot.empty) {
            console.log('Через collectionGroup найдено:', lotPacksSnapshot.size, 'пачек');
            lotPacksSnapshot.forEach(doc => {
                // Получаем ID родительского документа (даты)
                const pathParts = doc.ref.path.split('/');
                const dateDocId = pathParts[1]; // dates/2025-09-07/lotpacks/LOTPACK -> 2025-09-07
                
                allLotPacks.push({
                    id: doc.id,
                    ...doc.data(),
                    dateDoc: dateDocId
                });
            });
            return;
        }
        
        // Способ 2: Если collectionGroup не сработал, пробуем получить через конкретные даты
        console.log('Попытка получения через конкретные даты...');
        const datesSnapshot = await db.collection('dates').get();
        
        if (datesSnapshot.empty) {
            console.log('Коллекция dates пуста');
            return;
        }
        
        console.log('Найдено дат:', datesSnapshot.size);
        
        // Собираем все пачки из всех дат
        for (const dateDoc of datesSnapshot.docs) {
            const lotPacksSnapshot = await dateDoc.ref.collection('lotpacks').get();
            console.log('В дате', dateDoc.id, 'найдено пачек:', lotPacksSnapshot.size);
            
            lotPacksSnapshot.forEach(doc => {
                allLotPacks.push({
                    id: doc.id,
                    ...doc.data(),
                    dateDoc: dateDoc.id
                });
            });
        }
        
    } catch (error) {
        console.error('Ошибка при получении пачек:', error);
    }
}

//C- Функция для обновления таблицы данными
function updateTableWithData(lotPacks) {
    const tbody = document.querySelector('.tpi-ql--table--tbody');
    if (!tbody) return;
    
    // Удаляем все существующие строки данных (кроме лоадера)
    const dataRows = tbody.querySelectorAll('tr:not(.tpi-ql--table-loader-wrapper)');
    dataRows.forEach(row => row.remove());
    
    if (lotPacks.length === 0) {
        showNoDataMessage();
        return;
    }
    
    // Добавляем новые строки данных
    lotPacks.forEach(pack => {
        const tr = createTableRowFromPack(pack);
        tbody.appendChild(tr);
    });
    
    console.log('Таблица успешно обновлена');
}



//C- Функция для отображения сообщения об отсутствии данных
function showNoDataMessage() {
    const tbody = document.querySelector('.tpi-ql--table--tbody');
    if (!tbody) return;
    
    // Удаляем все существующие строки данных
    const dataRows = tbody.querySelectorAll('tr:not(.tpi-ql--table-loader-wrapper)');
    dataRows.forEach(row => row.remove());
    
    const noDataRow = document.createElement('tr');
    noDataRow.innerHTML = `
        <td colspan="11" style="text-align: center; padding: 20px;">
            <div style="color: #666; font-style: italic;">
                Нет данных о пачках. Создайте первую пачку лотов.
            </div>
        </td>
    `;
    tbody.appendChild(noDataRow);
}

//C- Функция для инициализации слушателя реального времени Firebase
function initializeFirebaseRealtimeListener() {
    if (firebaseListenerInitialized) return;
    
    console.log('Инициализация слушателя Firebase...');
    try {
        db.collectionGroup('lotpacks').onSnapshot((snapshot) => {
            console.log('Обновление данных из Firebase получено', snapshot.size, 'документов');
            
            // Перезагружаем данные таблицы при изменениях
            loadTableData();
        }, (error) => {
            console.error('Ошибка слушателя Firebase:', error);
        });
        
        firebaseListenerInitialized = true;
        console.log('Слушатель Firebase инициализирован');
        
    } catch (error) {
        console.error('Ошибка при инициализации слушателя Firebase:', error);
        setTimeout(initializeFirebaseRealtimeListener, 2000);
    }
}


//B- Функция для обработки печати
async function handlePrintLotPack(buttonElement) {
    const tr = buttonElement.closest('tr');
    if (!tr) {
        console.error('Не найдена строка таблицы');
        return;
    }
    
    // Ищем элемент с данными
    const lotPackDiv = tr.querySelector('.tpi-ql--LOTPACK-name');
    if (!lotPackDiv) {
        console.error('Не найден элемент с данными пачки');
        return;
    }
    
    // Получаем данные из атрибутов
    const lotPackName = lotPackDiv.getAttribute('tpi-ql-firebase-data-lotpackname');
    const lotsString = lotPackDiv.getAttribute('tpi-ql-firebase-data-lots');
    const cellName = lotPackDiv.getAttribute('tpi-ql-firebase-data-cellname');
    const lotType = lotPackDiv.getAttribute('tpi-ql-firebase-data-type');
    
    if (!lotPackName || !lotsString) {
        console.error('Недостаточно данных для печати');
        tpiNotification.show('Ошибка печати', 'error', 'Недостаточно данных для печати пачки');
        return;
    }
    
    // === ИЗМЕНЕНИЕ СТАТУСА В ТАБЛИЦЕ ПЕРЕД НАЧАЛОМ ПЕЧАТИ ===
    const statusDiv = tr.querySelector('td:nth-child(3) div');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <i tpi-ql--icon="processing"></i>
            <p>В обработке</p>
        `;
    }
    
    // Преобразуем строку лотов обратно в массив
    const lotsArray = lotsString.split(' ').filter(lot => lot.trim()).map((lotname, index) => ({
        lotname: lotname,
        lotid: String(index + 1)
    }));
    
    // Добавляем класс для анимации прогресса
    buttonElement.classList.add('tpi-ql--print-button-progress');
    // Сохраняем оригинальное содержимое кнопки
    const originalContent = buttonElement.innerHTML;
    
    // Создаем элемент для отображения прогресса
    const progressOverlay = document.createElement('span');
    progressOverlay.className = 'tpi-ql--print-progress-overlay';
    
    const progressText = document.createElement('span');
    progressText.className = 'tpi-ql--print-progress-text';
    progressText.textContent = '0%';
    
    buttonElement.appendChild(progressOverlay);
    buttonElement.appendChild(progressText);
    buttonElement.disabled = true;
    
    try {
        // Запускаем процесс печати с отслеживанием прогресса
        await generateLotsPDFWithProgress(
            lotsArray, 
            cellName, 
            lotsArray.length, 
            lotPackName, 
            lotType,
            (progress) => {
                // Обновляем прогресс
                progressText.textContent = `${Math.round(progress)}%`;
                
                // Обновляем анимацию заполнения кнопки на основе реального прогресса
                updateButtonProgressAnimation(progressOverlay, progress);
            }
        );
        
        // Обновляем статус в Firebase после успешной печати
        await updateLotPackStatus(lotPackName, 'printed');
        
        // Восстанавливаем кнопку
        buttonElement.classList.remove('tpi-ql--print-button-progress');
        buttonElement.innerHTML = originalContent;
        buttonElement.disabled = false;
        
        // === ОБНОВЛЕНИЕ СТАТУСА В ТАБЛИЦЕ ПОСЛЕ УСПЕШНОЙ ПЕЧАТИ ===
        if (statusDiv) {
            statusDiv.innerHTML = `
                <i tpi-ql--icon="printed"></i>
                <p>Распечатан</p>
            `;
        }
        
        // Обновляем дату печати
        const now = new Date();
        const printedDateDiv = tr.querySelector('td:nth-child(9)');
        if (printedDateDiv) {
            printedDateDiv.innerHTML = `
                <p dateData="lotpack--printed-date">${formatDateToDDMMYYYY(now)}</p>
                <p dateData="lotpack--printed-time">${formatDateToHHMMSS(now)}</p>
            `;
        }
        
        tpiNotification.show('Пачка распечатана', 'success', `Пачка ${lotPackName} успешно распечатана`);
        
    } catch (error) {
        console.error('Ошибка при печати:', error);
        
        // === ВОССТАНОВЛЕНИЕ СТАТУСА ПРИ ОШИБКЕ ===
        if (statusDiv) {
            statusDiv.innerHTML = `
                <i tpi-ql--icon="default"></i>
                <p>Готов к печати</p>
            `;
        }
        
        // Восстанавливаем кнопку в случае ошибки
        buttonElement.classList.remove('tpi-ql--print-button-progress');
        buttonElement.innerHTML = originalContent;
        buttonElement.disabled = false;
        
        tpiNotification.show('Ошибка печати', 'error', `Не удалось распечатать пачку: ${error.message}`);
    }
}

//B- Функция для обновления анимации прогресса кнопки на основе реального прогресса
function updateButtonProgressAnimation(progressElement, progress) {
    const progressPercentage = Math.max(0, Math.min(100, progress));
    
    // Вычисляем clip-path на основе прогресса (заполнение по часовой стрелке)
    const clipPath = calculateClipPathFromProgress(progressPercentage);
    progressElement.style.clipPath = clipPath;
}

//B- Функция для расчета clip-path на основе прогресса (заполнение по часовой стрелке)
function calculateClipPathFromProgress(progress) {
    const progressDecimal = progress / 100;
    
    // Точки для clip-path (по часовой стрелке)
    const points = [
        [50, 50],  // Центр
        [50, 0],    // Верх
        [100, 0],   // Верх-право
        [100, 50],  // Право-центр
        [100, 100], // Низ-право
        [50, 100],  // Низ
        [0, 100],   // Низ-лево
        [0, 50],    // Лево-центр
        [0, 0],     // Верх-лево
        [50, 0]     // Верх (замыкание)
    ];
    
    // Вычисляем, сколько точек должно быть видно на основе прогресса
    const totalSegments = points.length - 1;
    const visibleProgress = progressDecimal * totalSegments;
    const visiblePoints = Math.min(points.length, Math.ceil(visibleProgress) + 1);
    
    // Создаем clip-path строку
    let clipPath = 'polygon(';
    for (let i = 0; i < visiblePoints; i++) {
        if (i > 0) clipPath += ', ';
        clipPath += `${points[i][0]}% ${points[i][1]}%`;
    }
    
    // Если прогресс не полный, добавляем промежуточную точку для плавности
    if (progressDecimal < 1) {
        const nextPointIndex = Math.floor(visibleProgress);
        const segmentProgress = visibleProgress - nextPointIndex;
        
        if (nextPointIndex < points.length - 1) {
            const currentPoint = points[nextPointIndex];
            const nextPoint = points[nextPointIndex + 1];
            
            const intermediateX = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * segmentProgress;
            const intermediateY = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * segmentProgress;
            
            clipPath += `, ${intermediateX}% ${intermediateY}%`;
        }
    }
    
    clipPath += ')';
    
    return clipPath;
}

//B- Функция для обновления статуса пачки в Firebase
async function updateLotPackStatus(lotPackName, status) {
    try {
        console.log('Обновление статуса пачки:', lotPackName, 'на', status);

        // Находим документ даты и пачку
        let foundDoc = null;
        let foundPack = null;
        
        // Получаем все документы дат
        const datesSnapshot = await db.collection("dates").get();
        
        // Ищем пачку во всех датах
        for (const dateDoc of datesSnapshot.docs) {
            const packRef = dateDoc.ref.collection("lotpacks").doc(lotPackName);
            const packSnapshot = await packRef.get();
            
            if (packSnapshot.exists) {
                foundDoc = dateDoc.id;
                foundPack = packSnapshot;
                break;
            }
        }

        if (!foundPack) {
            throw new Error('Пачка не найдена в Firebase');
        }

        // Формируем данные для обновления
        const updateData = { status: status };
        if (status === 'printed') {
            updateData['printed-time'] = firebase.firestore.FieldValue.serverTimestamp();
        } else if (status === 'deleted') {
            updateData['deleted-time'] = firebase.firestore.FieldValue.serverTimestamp();
        }

        // Обновляем документ
        await db.collection("dates")
            .doc(foundDoc)
            .collection("lotpacks")
            .doc(lotPackName)
            .update(updateData);
            
        console.log('Статус пачки успешно обновлен');
        
    } catch (error) {
        console.error('Ошибка при обновлении статуса пачки:', error);
        throw error;
    }
}

//B- Функции для форматирования даты
function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateToHHMMSS(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

async function generateLotsPDFWithProgress(lots, cellName, totalLots, lotPackName, lotType, onProgress) {
    if (!lots || lots.length === 0) {
        if (onProgress) onProgress(100);
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Подключение шрифтов
    try {
        const fontRegularPath = chrome.runtime.getURL('fonts/Roboto-Regular.ttf');
        const responseRegular = await fetch(fontRegularPath);
        const fontRegularData = await responseRegular.arrayBuffer();

        const fontBoldPath = chrome.runtime.getURL('fonts/Roboto-Bold.ttf');
        const responseBold = await fetch(fontBoldPath);
        const fontBoldData = await responseBold.arrayBuffer();

        const fontItalicPath = chrome.runtime.getURL('fonts/Roboto-Italic.ttf');
        const responseItalic = await fetch(fontItalicPath);
        const fontItalicData = await responseItalic.arrayBuffer();

        const arrayBufferToBase64 = (buffer) => {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        };

        pdf.addFileToVFS('Roboto-Regular.ttf', arrayBufferToBase64(fontRegularData));
        pdf.addFileToVFS('Roboto-Bold.ttf', arrayBufferToBase64(fontBoldData));
        pdf.addFileToVFS('Roboto-Italic.ttf', arrayBufferToBase64(fontItalicData));

        pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        pdf.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
        pdf.addFont('Roboto-Italic.ttf', 'Roboto', 'italic');

        pdf.setFont('Roboto', 'normal');
    } catch (error) {
        console.error('Ошибка загрузки шрифтов Roboto:', error);
        try { pdf.setFont('helvetica'); } catch (e) {}
    }

    // Заголовок
    let headerText = "";
    switch(cellName) {
        case "3 - LIPETSK": headerText = "СЦ Липецк"; break;
        case "2 - KURSK": headerText = "СЦ Курск"; break;
        case "1 - BELGOROD": headerText = "СЦ Белгород"; break;
        case "DIMAN-tpi-TESTS": headerText = "СЦ Тестовый"; break;
        default: headerText = "СЦ";
    }

    // Тип лота
    let typeText = "";
    switch(lotType) {
        case "forward": typeText = "Отгрузка"; break;
        case "return": typeText = "Возврат"; break;
        case "hran": typeText = "Хранение"; break;
        default: typeText = "Отгрузка";
    }

    // Получатель
    let recipientText = "";
    switch(cellName) {
        case "3 - LIPETSK": recipientText = "СЦ МК Липецк"; break;
        case "2 - KURSK": recipientText = "СЦ МК Курск"; break;
        case "1 - BELGOROD": recipientText = "СЦ МК Белгород"; break;
        case "DIMAN-tpi-TESTS": recipientText = "СЦ МК Тестовый"; break;
        default: recipientText = "СЦ МК";
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 5.3;
    const maxTextWidth = pageWidth - (margin * 2);

    // Простой расчет: каждый лот добавляет свою долю процентов
    const progressPerLot = 95 / lots.length; // 95% распределяем по лотам, 5% оставляем на финал

    for (let i = 0; i < lots.length; i++) {
        const lot = lots[i];
        let currentProgress = i * progressPerLot;

        // Обновляем прогресс в начале обработки лота
        if (onProgress) {
            onProgress(Math.round(currentProgress));
        }

        // Генерация QR-кода
        const qrContainer = document.createElement("div");
        await new Promise(resolve => {
            new QRCode(qrContainer, {
                text: lot.lotname,
                width: 200,
                height: 200,
                correctLevel: QRCode.CorrectLevel.M
            });
            setTimeout(resolve, 100);
        });

        // Добавляем прогресс после генерации QR
        currentProgress += progressPerLot * 0.7; // 70% прогресса за QR
        if (onProgress) {
            onProgress(Math.round(currentProgress));
        }

        // Добавление в PDF
        const imgEl = qrContainer.querySelector("img");
        const qrDataURL = imgEl ? imgEl.src : qrContainer.toDataURL("image/png");

        if (i > 0) pdf.addPage();

        const qrSize = 90;
        const qrX = (pageWidth - qrSize) / 2;

        // Заголовок
        pdf.setFont('Roboto', 'bold');
        let fontSize = 100;
        let textWidth;
        do {
            pdf.setFontSize(fontSize);
            textWidth = pdf.getTextWidth(headerText);
            if (textWidth > maxTextWidth) fontSize -= 2;
        } while (textWidth > maxTextWidth && fontSize > 10);
        const textHeight = fontSize * 0.35;
        const textY = margin + textHeight;
        pdf.text(headerText, pageWidth / 2, textY, { align: "center" });

        // QR код
        const qrY = textY + textHeight - 10;
        pdf.addImage(qrDataURL, "PNG", qrX, qrY, qrSize, qrSize);

        // Текст лота
        const lotTextY = qrY + qrSize + 25;
        if (lot.lotname.length > 5) {
            const firstPart = lot.lotname.slice(0, -5);
            const lastPart = lot.lotname.slice(-5);

            const normalSize = 28;
            const boldSize = 42;

            pdf.setFontSize(normalSize);
            pdf.setFont('Roboto', 'normal');
            const firstPartWidth = pdf.getTextWidth(firstPart);

            pdf.setFontSize(boldSize);
            pdf.setFont('Roboto', 'bold');
            const lastPartWidth = pdf.getTextWidth(lastPart);

            const totalWidth = firstPartWidth + lastPartWidth;
            const startX = (pageWidth - totalWidth) / 2;

            pdf.setFontSize(normalSize);
            pdf.setFont('Roboto', 'normal');
            pdf.text(firstPart, startX, lotTextY);

            pdf.setFontSize(boldSize);
            pdf.setFont('Roboto', 'bold');
            pdf.text(lastPart, startX + firstPartWidth, lotTextY);

        } else {
            pdf.setFontSize(50);
            pdf.setFont('Roboto', 'bold');
            pdf.text(lot.lotname, pageWidth / 2, lotTextY, { align: "center" });
        }

        // Ячейка
        const cellTextY = lotTextY + 15;
        pdf.setFontSize(24);
        pdf.setFont('Roboto', 'normal');
        const cellLabel = "Ячейка: ";
        const cellLabelWidth = pdf.getTextWidth(cellLabel);

        pdf.setFontSize(26);
        pdf.setFont('Roboto', 'bold');
        const cellNameWidth = pdf.getTextWidth(cellName);

        const totalCellWidth = cellLabelWidth + cellNameWidth;
        const cellStartX = (pageWidth - totalCellWidth) / 2;

        pdf.setFontSize(24);
        pdf.setFont('Roboto', 'normal');
        pdf.text(cellLabel, cellStartX, cellTextY);

        pdf.setFontSize(26);
        pdf.setFont('Roboto', 'bold');
        pdf.text(cellName, cellStartX + cellLabelWidth, cellTextY);

        // Инфоблок внизу
        const infoBlockY = pageHeight - 5;
        const infoBlockX = 5;

        pdf.setFontSize(32);
        pdf.setFont('Roboto', 'bold');
        pdf.text("Палета", infoBlockX, infoBlockY - 46);

        pdf.setFontSize(18);
        pdf.setFont('Roboto', 'normal');
        pdf.text("Тип: ", infoBlockX, infoBlockY - 32);

        pdf.setFont('Roboto', 'bold');
        pdf.text(typeText, infoBlockX + pdf.getTextWidth("Тип: "), infoBlockY - 32);

        pdf.setFont('Roboto', 'normal');
        pdf.text("Отправитель: ", infoBlockX, infoBlockY - 24);

        pdf.setFont('Roboto', 'bold');
        pdf.text("СЦ Воронеж", infoBlockX + pdf.getTextWidth("Отправитель: "), infoBlockY - 24);

        pdf.setFont('Roboto', 'normal');
        pdf.text("Получатель: ", infoBlockX, infoBlockY - 16);

        pdf.setFont('Roboto', 'italic');
        pdf.text(recipientText, infoBlockX + pdf.getTextWidth("Получатель: "), infoBlockY - 16);

        pdf.setFont('Roboto', 'normal');
        pdf.text(`Пачка: ${lotPackName}`, infoBlockX, infoBlockY - 8);

        pdf.text(`Номер в пачке: ${i + 1}(${lots.length})`, infoBlockX, infoBlockY);

        // Добавляем оставшиеся 30% прогресса за добавление в PDF
        currentProgress += progressPerLot * 0.3;
        if (onProgress) {
            onProgress(Math.round(currentProgress));
        }
    }

    // Финальный прогресс 100%
    if (onProgress) {
        onProgress(100);
        // Даем время для отображения 100% перед открытием PDF
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Вывод
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${lotPackName} • Печать</title>
                <style>
                    body { 
                        margin: 0; 
                        background: #1a1a1a;
                        color: #e0e0e0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                        box-sizing: border-box;
                    }
                    
                    .header {
                        background: #f7f7f7;
                        padding: 15px 20px;
                        box-shadow: 0 2px 10px #0000004d;
                        margin-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 0px 0px 20px 20px;
                    }
                    
                    .title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #000000;
                    }
                    
                    .info {
                        font-size: 14px;
                        color: #000000;
                    }
                    
                    .pdf-container {
                        flex: 1;
                        width: 100%;
                        position: relative;
                        background: #2d2d2d;
                        border-radius: 20px 20px 0px 0px;
                        overflow: hidden;
                        box-shadow: 0 2px 10px #0000004d;
                    }
                    
                    iframe { 
                        width: 100%; 
                        height: 100%; 
                        border: none;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">Пачка лотов: ${lotPackName}</div>
                    <div class="info">Пачка создана при помощи TURBOpi</div>
                    <div class="info">Сгенерировано: ${new Date().toLocaleString()}</div>
                </div>
                
                <div class="pdf-container">
                    <iframe src="${pdfURL}" type="application/pdf"></iframe>
                </div>
            </body>
            </html>
        `);
        newWindow.document.close();
    } else {
        window.location.href = pdfURL;
    }
}

function lotExtraInfo(e) {
    const target = e.target.closest('.tpi-ql--lotpack-lots-amount');
    if (target) {
        const tr = target.closest('tr');
        if (tr) {
            showLotPackDetails(tr);
        }
    }
};

function showLotPackDetails(tr) {
    const lotPackElement = tr.querySelector('.tpi-ql--LOTPACK-name');
    if (!lotPackElement) return;
    
    // Получаем данные из атрибутов
    const lotPackName = lotPackElement.getAttribute('tpi-ql-firebase-data-lotpackname');
    const lotsString = lotPackElement.getAttribute('tpi-ql-firebase-data-lots');
    const cellName = lotPackElement.getAttribute('tpi-ql-firebase-data-cellname');
    const lotType = lotPackElement.getAttribute('tpi-ql-firebase-data-type');
    
    if (!lotsString) return;
    
    // Разбиваем строку лотов на массив
    const lotsArray = lotsString.split(' ').filter(lot => lot.trim());
    
    // Обновляем заголовок модального окна
    const modalTitle = document.querySelector('.tpi-ql--modal-window-wrapper-title h1');
    if (modalTitle) {
        modalTitle.textContent = `${lotPackName} лоты:`;
    }
    
    // Создаем таблицу с лотами
    const tableWrapper = document.querySelector('.tpi-ql--modal-window-wrapper-table-wrapper');
    tableWrapper.innerHTML = `
        <table class="tpi-ql--modal-window--lotpack-lots">
            <thead>
                <tr>
                    <th>
                        <div>ID</div>
                    </th>
                    <th>
                        <div>Код грузоместа лота</div>
                    </th>
                    <th>
                        <div>Ячейка</div>
                    </th>
                    <th>
                        <div>Тип</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                ${lotsArray.map((lot, index) => createLotRow(lot, index + 1, cellName, lotType)).join('')}
            </tbody>
        </table>
    `;
    
    // Показываем модальное окно
    const modalWindow = document.querySelector('.tpi-ql--modal-window');
    modalWindow.setAttribute('current-state', 'shown');
}

function createLotRow(lotCode, id, cellName, lotType) {
    // Преобразуем тип лота в читаемый текст
    let typeText = 'Отгрузка'; // значение по умолчанию
    switch(lotType) {
        case 'forward':
            typeText = 'Отгрузка';
            break;
        case 'return':
            typeText = 'Возврат';
            break;
        case 'hran':
            typeText = 'Хранение';
            break;
    }
    
    // Преобразуем название ячейки в читаемый текст
    let cellText = cellName;
    switch(cellName) {
        case '3 - LIPETSK':
            cellText = 'СЦ Липецк';
            break;
        case '2 - KURSK':
            cellText = 'СЦ Курск';
            break;
        case '1 - BELGOROD':
            cellText = 'СЦ Белгород';
            break;
        case 'DIMAN-tpi-TESTS':
            cellText = 'СЦ Тестовый';
            break;
    }
    
    return `
        <tr>
            <td>
                <div>${id}</div>
            </td>
            <td>
                <div>
                    <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableBarcode=${lotCode}" target="_blank">${lotCode}</a>
                </div>
            </td>
            <td>
                <div>${cellText}</div>
            </td>
            <td>
                <div>${typeText}</div>
            </td>
        </tr>
    `;
}

//@ 
function handleTableSizeButtons() {
    const sizeButtons = document.querySelectorAll('.tpi-ql--table-tr-amount');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Сбрасываем все кнопки к default состоянию
            sizeButtons.forEach(btn => btn.setAttribute('current-state', 'default'));
            
            // Устанавливаем selected для нажатой кнопки
            this.setAttribute('current-state', 'selected');
            
            // Получаем новый размер страницы
            const newSize = parseInt(this.getAttribute('tpi-list-size'));
            pageSize = newSize;
            
            // Сбрасываем на первую страницу
            currentPage = 1;
            updatePageControls();
            
            // Загружаем данные с новым размером страницы
            await loadTableData();
        });
    });
}

// Функция для обработки кнопок пагинации
function handlePaginationButtons() {
    const prevButton = document.querySelector('[tpi-ql-page-control="prevPage"]');
    const nextButton = document.querySelector('[tpi-ql-page-control="nextPage"]');
    
    if (prevButton) {
        prevButton.addEventListener('click', async function() {
            if (currentPage > 1) {
                currentPage--;
                updatePageControls();
                await loadTableData();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', async function() {
            const maxPages = Math.ceil(totalLotPacks / pageSize);
            if (currentPage < maxPages) {
                currentPage++;
                updatePageControls();
                await loadTableData();
            }
        });
    }
}

//@ 
function showTableLoader() {
    const tbody = document.querySelector('.tpi-ql--table--tbody');
    if (!tbody) return;
    
    // Удаляем существующий лоадер если есть
    const existingLoader = tbody.querySelector('.tpi-ql--table-loader-wrapper');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    // Создаем элемент лоадера
    const loaderRow = document.createElement('tr');
    loaderRow.className = 'tpi-ql--table-loader-wrapper';
    loaderRow.innerHTML = `
        <td colspan="11">
            <div class="tpi-ql--table-loader-item"></div>
        </td>
    `;
    
    // Вставляем лоадер ПЕРВЫМ элементом в tbody (перед всеми tr)
    const firstRow = tbody.querySelector('tr');
    if (firstRow) {
        tbody.insertBefore(loaderRow, firstRow);
    } else {
        tbody.appendChild(loaderRow);
    }
}
//@
function hideTableLoader() {
    const loader = document.querySelector('.tpi-ql--table-loader-wrapper');
    if (loader) {
        loader.remove();
    }
}

//@
function handlePaginationButtons() {
    const prevButton = document.querySelector('[tpi-ql-page-control="prevPage"]');
    const nextButton = document.querySelector('[tpi-ql-page-control="nextPage"]');
    const currentPageElement = document.querySelector('.tpi-ql--table-current-page');
    
    if (prevButton) {
        prevButton.addEventListener('click', async function() {
            if (currentPage > 1) {
                currentPage--;
                updatePageControls();
                showTableLoader();
                await loadTableData();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', async function() {
            const maxPages = Math.ceil(totalLotPacks / pageSize);
            if (currentPage < maxPages) {
                currentPage++;
                updatePageControls();
                showTableLoader();
                await loadTableData();
            }
        });
    }
}

//@
function updatePageControls() {
    const prevButton = document.querySelector('[tpi-ql-page-control="prevPage"]');
    const nextButton = document.querySelector('[tpi-ql-page-control="nextPage"]');
    const currentPageElement = document.querySelector('.tpi-ql--table-current-page');
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    if (prevButton) {
        prevButton.disabled = currentPage <= 1;
    }
    
    if (nextButton) {
        const maxPages = Math.ceil(totalLotPacks / pageSize);
        nextButton.disabled = currentPage >= maxPages;
    }
}

//@
async function loadTableData() {
    try {
        showTableLoader(); // Показываем лоадер
        
        let allLotPacks = [];
        
        // Получаем все пачки
        await getAllLotPacks(allLotPacks);
        
        // Сохраняем общее количество для пагинации
        totalLotPacks = allLotPacks.length;
        
        // Сортируем по дате создания (новые сверху)
        allLotPacks.sort((a, b) => {
            const timeA = a['create-time'] ? a['create-time'].toDate().getTime() : 0;
            const timeB = b['create-time'] ? b['create-time'].toDate().getTime() : 0;
            return timeB - timeA;
        });
        
        // Вычисляем диапазон для текущей страницы
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, allLotPacks.length);
        const pageLotPacks = allLotPacks.slice(startIndex, endIndex);
        
        // Обновляем таблицу
        updateTableWithData(pageLotPacks);
        
        // Обновляем элементы управления страницами
        updatePageControls();
        
    } catch (error) {
        console.error('Ошибка при загрузке данных таблицы:', error);
        showNoDataMessage();
    } finally {
        hideTableLoader(); // Скрываем лоадер в любом случае
    }
}


function createTableRowFromPack(pack) {
    const tr = document.createElement('tr');
    
    // Функция для форматирования даты из Firebase Timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            console.error('Ошибка форматирования даты:', e);
            return '';
        }
    };
    
    // Функция для форматирования времени из Firebase Timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        } catch (e) {
            console.error('Ошибка форматирования времени:', e);
            return '';
        }
    };
    
    // Определяем текст типа лота
    let typeText = 'Отгрузка'; // значение по умолчанию
    if (pack['lot-type']) {
        switch(pack['lot-type']) {
            case 'forward':
                typeText = 'Отгрузка';
                break;
            case 'return':
                typeText = 'Возврат';
                break;
            case 'hran':
                typeText = 'Хранение';
                break;
        }
    }
    
    // Определяем текст статуса
    let statusText = 'Создан';
    let statusIcon = '<i tpi-ql--icon="created"></i>';
    let fakeStatusIcon = '';
    
    if (pack.status) {
        switch(pack.status) {
            case 'created':
                statusText = 'Создан';
                statusIcon = '<i tpi-ql--icon="created"></i>';
                break;
            case 'deleted':
                statusText = 'Удалён';
                statusIcon = '<i tpi-ql--icon="deleted"></i>';
                fakeStatusIcon = '<i tpi-ql--icon="fake-deleted"></i>';
                break;
            case 'printed':
                statusText = 'Распечатан';
                statusIcon = '<i tpi-ql--icon="printed"></i>';
                fakeStatusIcon = '<i tpi-ql--icon="fake-printed"></i>';
                break;
        }
    }
    
    // Определяем текст получателя
    let recipientText = '';
    if (pack['cell-name']) {
        switch(pack['cell-name']) {
            case '3 - LIPETSK':
                recipientText = 'СЦ МК Липецк';
                break;
            case '2 - KURSK':
                recipientText = 'СЦ МК Курск';
                break;
            case '1 - BELGOROD':
                recipientText = 'СЦ МК Белгород';
                break;
            case 'DIMAN-tpi-TESTS':
                recipientText = 'СЦ МК Тестовый';
                break;
            default:
                recipientText = pack['cell-name'];
        }
    }
    
       const lotsString = pack.lots ? pack.lots.map(lot => lot.lotname).join(' ') : '';
    
    tr.innerHTML = `
        <td>
            <div class="tpi-ql--LOTPACK-name" 
                tpi-ql-firebase-data-lotpackname="${pack.id}" 
                tpi-ql-firebase-data-lots="${lotsString}" 
                tpi-ql-firebase-data-cellname="${pack['cell-name'] || ''}" 
                tpi-ql-firebase-data-type="${pack['lot-type'] || ''}"
                tpi-ql-firebase-data-date="${pack.dateDoc || ''}">
            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/orders/">${pack.id}</a>
            </div>
        </td>
        <td>
            <div>
                <p>${typeText}</p>
            </div>
        </td>
        <td>
            <div>
                ${statusIcon}
                ${fakeStatusIcon}
                <p>${statusText}</p>
            </div>
        </td>
        <td>
            <div class="tpi-ql--lotpack-lots-amount">
                <span>${pack.lotsAmount || 0} ${(pack.lotsAmount == 1) ? 'Лот' : 'Лотов'}</span>
            </div>
        </td>
        <td>
            <div>
                <p>${recipientText}</p>
            </div>
        </td>
        <td>
            <div>
                <p></p>
            </div>
        </td>
        <td>
            <div class="tpi-ql--table-date">
                <p dateData="lotpack--created-date">${formatDate(pack['create-time'])}</p>
                <p dateData="lotpack--created-time">${formatTime(pack['create-time'])}</p>
            </div>
        </td>
        <td>
            <div class="tpi-ql--table-date">
                <p dateData="lotpack--deleted-date">${formatDate(pack['deleted-time'])}</p>
                <p dateData="lotpack--deleted-time">${formatTime(pack['deleted-time'])}</p>
            </div>
        </td>
        <td>
            <div class="tpi-ql--table-date">
                <p dateData="lotpack--printed-date">${formatDate(pack['printed-time'])}</p>
                <p dateData="lotpack--printed-time">${formatTime(pack['printed-time'])}</p>
            </div>
        </td>
        <td>
            <div>
                <button class="tpi-ql--print-LOTPACK" tpi-ql--lotpack-print="default">
                    <p class="tpi-ql--print-LOTPACK-default-text">Печать</p>
                    ${printLOTPACKButtonSVG}
                </button>
            </div>
        </td>
        <td>
            <div>
                <button tpi-ql--lotpack-delete="default">
                    <p>Удалить</p>
                    ${deleteLOTPACKButtonSVG}
                </button>
            </div>
        </td>
    `;
    
    // Добавляем обработчик для кнопки печати
    const printButton = tr.querySelector('.tpi-ql--print-LOTPACK');
    if (printButton) {
        printButton.addEventListener('click', function() {
            handlePrintLotPack(this);
        });
    }
    // Добавляем обработчик для кнопки показа информации о лотах
    const showMeLotsInfoButton = tr.querySelector('.tpi-ql--lotpack-lots-amount span');
    if (showMeLotsInfoButton) {
        showMeLotsInfoButton.addEventListener('click', function(e) {
            lotExtraInfo(e);
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('tpi-ql--lotpack-delete', 'default');
    deleteButton.innerHTML = deleteLOTPACKButtonSVG;
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Предотвращаем всплытие события
        
        const tr = this.closest('tr');
        if (!tr) return;
        
        const lotPackDiv = tr.querySelector('.tpi-ql--LOTPACK-name');
        if (!lotPackDiv) return;
        
        const lotPackName = lotPackDiv.getAttribute('tpi-ql-firebase-data-lotpackname');
        if (!lotPackName) return;
        
        // Обновляем заголовок модального окна удаления
        const deleteTitle = document.querySelector('.tpi-ql--delete-lotpack-title p');
        if (deleteTitle) {
            deleteTitle.textContent = `Пачка ${lotPackName}`;
        }
        
        // Сохраняем ID пачки в data-атрибут для использования при подтверждении
        const deleteWrapper = document.querySelector('.tpi-ql--delete-lotpack-wrapper');
        if (deleteWrapper) {
            deleteWrapper.setAttribute('data-lotpack-id', lotPackName);
            deleteWrapper.setAttribute('current-state', 'shown');
        }
    });
    
    return tr;
}

//@
//@

checkiIs__onQuickLotsPage()
