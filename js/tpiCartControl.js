const tpiIcon__plus = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"></path>
</svg>
`,
tpiIcon__trashBucket = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"></path>
</svg>
`,
tpiIcon__cross = `
<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor"></path>
</svg>
`

function checkiIs__onCartControlsPage() {
    'use strict';

    // Функция проверки URL
    function isCartControlsPage(url) {
        const base = 'https://logistics.market.yandex.ru/sorting-center/21972131/orders/tpi-cart-controls?tpiCartControls=true';
        if (!url.startsWith(base)) return false;
        
        const params = new URLSearchParams(url.split('?')[1] || '');
        return params.get('tpiCartControls') === 'true' 
    }

    // Функция добавления блока (и отключения наблюдателя)
    function addTurboBlock() {
        if (document.querySelector('.tpi-settings--wrapper')) return;

        document.title = "Управление MK"

        const overlay = document.createElement('div');
        overlay.className = 'tpi-cc--wrapper';

        overlay.innerHTML = 
        `
        <div class="tpi-cc--wrapper-title">
            Управление МК
        </div>
        <div class="tpi-cc--table-wrapper">
            <table class="tpi-cc--table-data-output">
                <thead class="tpi-cc--table-thead-wrapper">
                    <tr class="tpi-cc--table-thead">
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Данные курьера</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Номер ячейки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Номер CART</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Номер PALLET</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Cтатус</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Прогресс сортировки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Начало<br>сортировки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Конец<br>сортировки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Прибытие<br>курьера</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Адрес ячейки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Маркировка</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Номер поставки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Номер отгрузки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Откуда</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Куда</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Группировка</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Дата создания</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Дата приемки</div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">Дата отгрузки</div>
                        </th>
                    </tr>
                </thead>
                <tbody class="tpi-cc--table-tbody-wrapper">
                    <tr class="tpi-cc--table-tbody">
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-tbody-data-courier">
                                <div class="tpi-cc--sortable-data-wrapper tpi-cc--sortable-id-data-wrapper">
                                    <a href="https://hubs.market.yandex.ru/sorting-center/21972131/support" target="_blank" class="tpi-cc--sortable-data-link">
                                        <p class="tpi-cc--sortable-data-link-test">Шишкин Александр Викторович</p>
                                    </a>
                                </div>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-tbody-data">
                                <a href="#" class="tpi-cc--table-tbody-data-link">
                                    MK-101
                                </a>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-data-carts">
                                <a href="#" class="tpi-cc--table-tbody-data-link tpi-cc-table-tbody-data-cart-id">
                                    CART-153
                                </a>
                                <a href="#" class="tpi-cc--table-tbody-data-link tpi-cc-table-tbody-data-cart-id">
                                    CART-127
                                </a>
                                <a href="#" class="tpi-cc--table-tbody-data-link tpi-cc-table-tbody-data-cart-id">
                                    CART-134
                                </a>
                                <a href="#" class="tpi-cc--table-tbody-data-link tpi-cc-table-tbody-data-cart-id">
                                    CART-167
                                </a>
                                <div class="tpi-cc--carts-control-buttons-wrapper">
                                    <button class="tpi-cc--table-tbody-add-cart" tpi-state-change="tpi-add-cart">
                                        <i>${tpiIcon__plus}</i>
                                    </button>
                                    <button class="tpi-cc--table-tbody-add-cart" tpi-state-change="tpi-remove-cart">
                                        <i>${tpiIcon__cross}</i>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-tbody-data">
                                <a href="#" class="tpi-cc--table-tbody-data-link">
                                    PALLET-776
                                </a>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-tbody-data">
                                <a href="#" class="tpi-cc--table-tbody-data-link">
                                    Отгружен
                                </a>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-tbody-data">
                                <a href="#" class="tpi-cc--table-tbody-data-link">
                                    MK-101
                                </a>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-body-date-container">
                                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                                    <i class="tpi-cc--table-tbody-data-icon">${tpiIcon__calendar}</i>
                                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-date-type="start">
                                        03/11/2025
                                    </p>
                                </div>
                                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                                    <i class="tpi-cc--table-tbody-data-icon">${tpiIcon__clock}</i>
                                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-time-type="start">
                                        21:36:24
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-body-date-container">
                                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                                    <i class="tpi-cc--table-tbody-data-icon">${tpiIcon__calendar}</i>
                                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-date-type="end">
                                        04/11/2025
                                    </p>
                                </div>
                                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                                    <i class="tpi-cc--table-tbody-data-icon">${tpiIcon__clock}</i>
                                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-time-type="end">
                                        7:30:12
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="tpi-cc--table-tbody-item">
                            <div class="tpi-cc--table-body-date-container">
                                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                                    <i class="tpi-cc--table-tbody-data-icon">${tpiIcon__calendar}</i>
                                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-date-type="arrived">
                                        04/11/2025
                                    </p>
                                </div>
                                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                                    <i class="tpi-cc--table-tbody-data-icon">${tpiIcon__clock}</i>
                                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-time-type="arrived">
                                        7:30:00
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `
        
        const appID = document.getElementById("app")
        const headerTitle = document.querySelector(".p-layout__header-wrapper")
        appID.remove()
        headerTitle.remove()

        document.querySelector(".p-layout__content").appendChild(overlay);
        
        callTurboPI__once();
        addTurboPiTitle()
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }


    if (isCartControlsPage(location.href)) {
        addTurboBlock();
        addCartsControlsListeners();
        addToastContainer()
        setTimeout(() => {
            tpiNotification.show('Страница "Управление МК" интегрированна', "info", `Для получения подробной информации о пользовании инструменом, посетите Wiki TURBOpi`);
        }, 100);
        return; 
    }

    observer = new MutationObserver(() => {
        if (isCartControlsPage(location.href)) {
            addTurboBlock();
        }
    });
    observer.observe(document, { subtree: true, childList: true });
    setTimeout(() => {
        addTurboPiTitle()
    }, 1000);
}

checkiIs__onCartControlsPage()

function addCartsControlsListeners(){
    console.log("test")
    waitForTokenAndRun();
}

//A-----------------------------------------------------------------------------------------

// function determineSearchType(value) {
//     const str = String(value).trim();
    
//     // Первый вариант: начинается с "LO-", "FF-", "AE-"
//     if (str.startsWith("LO-") || str.startsWith("FF-") || str.startsWith("AE-")) {
//         return 'first';
//     }
    
//     // Второй вариант: начинается с определенных префиксов
//     const secondPrefixes = ["F12", "FA2", "F22", "F30", "F40", "F50", "P20", "YP", "BP", "SP", "VOZ", "PVZ", "YMCN", "07", "08", "05", "02"];
//     if (secondPrefixes.some(prefix => str.startsWith(prefix))) {
//         return 'second';
//     }
    
//     // Второй вариант: 11 цифр с дефисом после
//     if (/^\d{11}-/.test(str)) {
//         return 'second';
//     }
    
//     // Второй вариант: 11 цифр (номера заказов)
//     const digitsOnly = str.replace(/\D/g, '');
//     if (digitsOnly.length === 11) {
//         return 'second';
//     }
    
//     // По умолчанию используем второй вариант для всех остальных случаев
//     return 'second';
// }

// // Функция проверки совпадения найденного заказа с искомым значением
// function checkOrderMatch(order, searchValue, searchType) {
//     if (!order) return false;
    
//     const searchStr = String(searchValue).trim();
    
//     if (searchType === 'first') {
//         // Для поиска по штрихкоду проверяем совпадение со штрихкодом
//         return order.sortableBarcode === searchStr;
//     } else {
//         // Для поиска по номеру заказа проверяем совпадение с номером заказа
//         return order.orderExternalId === searchStr;
//     }
// }

// // Универсальная функция обработки и логирования данных
// function processAndLogOrderData(data, searchType = '') {
//     if (data && data.results && data.results.length > 0) {
//         const result = data.results[0];
        
//         if (result.data && result.data.content && result.data.content.length > 0) {
//             const orders = result.data.content;
//             const order = orders[0];
            
//             const searchTypeText = searchType ? `по ${searchType}` : '';
            
//             console.log(`
// 🎯 РЕЗУЛЬТАТ ПОИСКА ${searchTypeText.toUpperCase()}:
// ├─ 📦 Номер заказа: ${order.orderExternalId || 'N/A'}
// ├─ 🏷️ Штрихкод: ${order.sortableBarcode || 'N/A'}
// ├─ 🔢 ID сортируемого: ${order.sortableId || 'N/A'}
// ├─ 📊 Тип: ${order.sortableType || 'N/A'}
// ├─ 🚚 Статус: ${order.status || 'N/A'}
// ├─ 📊 Расширенный статус: ${order.stageDisplayName || 'N/A'}
// ├─ 🎯 Назначение: ${order.destinationNameTo?.name || 'N/A'}
// ├─ 📍 Откуда: ${order.routeFrom || 'N/A'}
// ├─ 📍 Куда: ${order.routeTo || 'N/A'}
// ├─ 📅 Создан: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
// ├─ ⏰ Прибыл: ${order.arrivedDateTime ? new Date(order.arrivedDateTime).toLocaleString() : 'N/A'}
// ├─ 📤 Отгружен: ${order.shippedDateTime ? new Date(order.shippedDateTime).toLocaleString() : 'N/A'}
// ├─ 🔢 Код группы: ${order.groupCode || 'N/A'}
// ├─ 🎯 Кросс-док: ${order.crossDock ? 'Да' : 'Нет'}
// ├─ ⚠️ Статус повреждения: ${order.damagedStatus || 'N/A'}
// ├─ 🚛 Курьер: ${order.courierName || 'N/A'}
// └─ 🆔 Номер лота: ${order.lotExternalId || 'N/A'}
//             `);
            
//             // Дополнительная информация о грузоместах
//             if (orders.length > 1) {
//                 console.log('📦 Связанные грузоместа:');
//                 orders.forEach((o, index) => {
//                     console.log(`   ${index + 1}. ${o.sortableBarcode} (${o.sortableId}) - ${o.sortableType || 'N/A'}`);
//                 });
//             }
            
//             return order;
//         }
//     }
    
//     console.log('❌ Заказ не найден в ответе');
//     return null;
// }

// // Функция поиска по штрихкоду
// function searchByBarcode(barcode, tryFallback = true) {
//     console.log(`🔍 Поиск по штрихкоду: ${barcode}`);
    
//     const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
//     url.searchParams.append('r', 'sortingCenter/sortables/resolveSortableReport:resolveSortableReport');

//     const requestBody = {
//         "params": [{
//             "sortableStatuses": [],
//             "stages": [],
//             "sortableBarcode": barcode,
//             "outboundIdTitle": "",
//             "groupingDirectionId": "",
//             "groupingDirectionName": "",
//             "sortingCenterId": 21972131,
//             "page": 0,
//             "size": 20,
//             "sortableTypes": ["PLACE","PALLET","TOT","BATCH"],
//             "crossDockOnly": false
//         }],
//         "path": `/sorting-center/21972131/sortables?sortableTypes=PLACE,PALLET,TOT,BATCH&sortableStatuses=&sortableStatusesLeafs=&sortableBarcode=${barcode}&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=`
//     };

//     // Используем токен из переменной
//     const skToken = tpiUserTOKEN;

//     return fetch(url.toString(), {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest',
//             'X-Market-Core-Service': '<UNKNOWN>',
//             'sk': skToken
//         },
//         body: JSON.stringify(requestBody)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.results && data.results.length > 0) {
//             const result = data.results[0];
            
//             if (result.error) {
//                 console.log('❌ Ошибка API:', result.error.message);
//                 if (tryFallback) {
//                     console.log('🔄 Пробуем поиск по номеру заказа...');
//                     return searchByOrderNumber(barcode, false);
//                 }
//                 return null;
//             }
            
//             if (result.data && result.data.content && result.data.content.length > 0) {
//                 const order = result.data.content[0];
                
//                 // Проверяем совпадение штрихкода
//                 if (checkOrderMatch(order, barcode, 'first')) {
//                     console.log('✅ Заказ найден по штрихкоду!');
//                     return processAndLogOrderData(data, 'штрихкоду');
//                 } else {
//                     console.log('⚠️ Найден заказ, но штрихкод не совпадает');
//                     if (tryFallback) {
//                         console.log('🔄 Пробуем поиск по номеру заказа...');
//                         return searchByOrderNumber(barcode, false);
//                     }
//                 }
//             }
//         }
        
//         console.log('❌ Заказ не найден по штрихкоду');
//         if (tryFallback) {
//             console.log('🔄 Пробуем поиск по номеру заказа...');
//             return searchByOrderNumber(barcode, false);
//         }
//         return null;
//     })
//     .catch(error => {
//         console.error('💥 Ошибка:', error);
//         if (tryFallback) {
//             console.log('🔄 Пробуем поиск по номеру заказа...');
//             return searchByOrderNumber(barcode, false);
//         }
//         return null;
//     });
// }

// // Функция поиска по номеру заказа
// function searchByOrderNumber(orderNumber, tryFallback = true) {
//     console.log(`🔍 Поиск по номеру заказа: ${orderNumber}`);
    
//     const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
//     url.searchParams.append('r', 'sortingCenter/sortables/resolveSortableReport:resolveSortableReport');

//     const requestBody = {
//         "params": [{
//             "sortableStatuses": [],
//             "stages": [],
//             "orderExternalId": orderNumber,
//             "outboundIdTitle": "",
//             "groupingDirectionId": "",
//             "groupingDirectionName": "",
//             "sortingCenterId": 21972131,
//             "page": 0,
//             "size": 20,
//             "sortableTypes": ["PLACE","PALLET","TOT","BATCH"],
//             "crossDockOnly": false
//         }],
//         "path": `/sorting-center/21972131/sortables?sortableTypes=PLACE,PALLET,TOT,BATCH&sortableStatuses=&sortableStatusesLeafs=&orderExternalId=${orderNumber}&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=`
//     };

//     // Используем токен из переменной
//     const skToken = tpiUserTOKEN;

//     return fetch(url.toString(), {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest',
//             'X-Market-Core-Service': '<UNKNOWN>',
//             'sk': skToken
//         },
//         body: JSON.stringify(requestBody)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data && data.results && data.results.length > 0) {
//             const result = data.results[0];
            
//             if (result.error) {
//                 console.log('❌ Ошибка:', result.error.message);
//                 if (tryFallback) {
//                     console.log('🔄 Пробуем поиск по штрихкоду...');
//                     return searchByBarcode(orderNumber, false);
//                 }
//                 return null;
//             }
            
//             if (result.data && result.data.content && result.data.content.length > 0) {
//                 const order = result.data.content[0];
                
//                 // Проверяем совпадение номера заказа
//                 if (checkOrderMatch(order, orderNumber, 'second')) {
//                     console.log('✅ Заказ найден по номеру!');
//                     return processAndLogOrderData(data, 'номеру');
//                 } else {
//                     console.log('⚠️ Найден заказ, но номер не совпадает');
//                     if (tryFallback) {
//                         console.log('🔄 Пробуем поиск по штрихкоду...');
//                         return searchByBarcode(orderNumber, false);
//                     }
//                 }
//             }
//         }
        
//         console.log('❌ Заказ не найден по номеру');
//         if (tryFallback) {
//             console.log('🔄 Пробуем поиск по штрихкоду...');
//             return searchByBarcode(orderNumber, false);
//         }
//         return null;
//     })
//     .catch(error => {
//         console.error('❌ Ошибка:', error);
//         if (tryFallback) {
//             console.log('🔄 Пробуем поиск по штрихкоду...');
//             return searchByBarcode(orderNumber, false);
//         }
//         return null;
//     });
// }

// // Основная функция поиска
// async function tpi_sto_SearchOrder(value) {
//     console.log(`🔍 Запуск поиска для: "${value}"`);
    
//     // Проверяем наличие токена
//     if (!tpiUserTOKEN) {
//         console.log('❌ Токен не загружен, невозможно выполнить поиск');
//         return null;
//     }
    
//     console.log('✅ Токен готов, начинаем поиск...');
    
//     const searchType = determineSearchType(value);
//     console.log(`📊 Определен тип поиска: ${searchType === 'first' ? 'по штрихкоду' : 'по номеру заказа'}`);
    
//     if (searchType === 'first') {
//         return searchByBarcode(value, true)
//             .then(result => {
//                 if (!result) {
//                     console.log('❌❌❌ Ничего не нашлось :/');
//                 }
//                 return result;
//             });
//     } else {
//         return searchByOrderNumber(value, true)
//             .then(result => {
//                 if (!result) {
//                     console.log('❌❌❌ Ничего не нашлось :/');
//                 }
//                 return result;
//             });
//     }
// }

// // Дополнительные функции для обратной совместимости
// function tpiSearchOrder_sortable(value) {
//     return tpi_sto_SearchOrder(value);
// }

// function getOrderData(value) {
//     return tpi_sto_SearchOrder(value);
// }

//B- Функции для работы с курьерами и ячейками
async function tpi_getCouriersAndCells() {
    console.log('🔍 Получение данных о курьерах и ячейках...');
    
    try {
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'sortingCenter/routes/resolveGetRoutesFullInfo:resolveGetRoutesFullInfo');

        // Получаем текущую дату в правильном формате
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        
        const requestBody = {
            "params": [{
                "sortingCenterId": 21972131,
                "type": "OUTGOING_COURIER",
                "sort": "",
                "hasCarts": false,
                "category": "COURIER", 
                "date": currentDate,
                "recipientName": "",
                "page": 0,
                "size": 100
            }],
            "path": `/sorting-center/21972131/routes?type=OUTGOING_COURIER&sort=&hasCarts=false&category=COURIER&date=${currentDate}&recipientName=`
        };

        console.log('📅 Дата запроса:', currentDate);

        const response = await fetch(url.toString(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Market-Core-Service': '<UNKNOWN>',
                'sk': tpiUserTOKEN // Используем напрямую
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
            const result = data.results[0];
            
            if (result.error) {
                console.log('❌ Ошибка API:', result.error.message);
                return null;
            }
            
            if (result.data && result.data.content && result.data.content.length > 0) {
                const routes = result.data.content;
                console.log(`✅ Найдено маршрутов: ${routes.length}`);
                
                // Формируем данные для таблицы
                const couriersData = routes.map(route => {
                    const courierName = route.courier?.name || 'Не указан';
                    
                    // Получаем ячейки из массива cells (если они есть)
                    let cellNumbers = 'Нет ячеек';
                    let mainCell = 'Нет ячейки';
                    
                    if (route.cells && route.cells.length > 0) {
                        cellNumbers = route.cells.map(cell => cell.number || 'Без номера').join(', ');
                        mainCell = route.cells[0]?.number || 'Нет ячейки';
                    }
                    
                    const routeStatus = route.status || 'Неизвестно';
                    
                    return {
                        courier: courierName,
                        cell: mainCell, // Основная ячейка для сортировки
                        cells: cellNumbers, // Все ячейки для отображения
                        status: routeStatus,
                        ordersLeft: route.ordersLeft || 0,
                        ordersSorted: route.ordersSorted || 0,
                        ordersShipped: route.ordersShipped || 0,
                        ordersPlanned: route.ordersPlanned || 0,
                        courierArrivesAt: route.courierArrivesAt || 'Не указано',
                        finishedAt: route.finishedAt || 'Не завершен',
                        routeId: route.id || null
                    };
                }).filter(item => item.cell !== 'Нет ячейки'); // Фильтруем только курьеров с ячейками
                
                console.log(`📊 Обработано курьеров с ячейками: ${couriersData.length}`);
                return couriersData;
            } else {
                console.log('❌ Нет данных о маршрутах');
                return null;
            }
        } else {
            console.log('❌ Неверный формат ответа');
            return null;
        }
    } catch (error) {
        console.error('💥 Ошибка при получении данных:', error);
        return null;
    }
}

// Функция для сортировки курьеров по группам
function sortCouriersByGroups(couriersData) {
    const firstWave = []; // MK-1...
    const secondWave = []; // MK-2...
    const kgt = []; // KGT...
    const others = []; // Остальные
    
    couriersData.forEach(courier => {
        const cell = courier.cell.toUpperCase();
        
        if (cell.startsWith('MK-1')) {
            firstWave.push(courier);
        } else if (cell.startsWith('MK-2')) {
            secondWave.push(courier);
        } else if (cell.startsWith('KGT')) {
            kgt.push(courier);
        } else {
            others.push(courier);
        }
    });
    
    // Функция для сортировки по номеру ячейки
    const sortByCellNumber = (a, b) => {
        const extractNumber = (cell) => {
            const match = cell.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        };
        
        return extractNumber(a.cell) - extractNumber(b.cell);
    };
    
    // Сортируем каждую группу
    firstWave.sort(sortByCellNumber);
    secondWave.sort(sortByCellNumber);
    kgt.sort(sortByCellNumber);
    others.sort(sortByCellNumber);
    
    return { firstWave, secondWave, kgt, others };
}

// Функция для вывода таблицы в консоль
function displayCourierTable(couriers, title) {
    if (couriers.length === 0) return;
    
    console.log(`\n📋 ${title}:`);
    console.table(couriers.map(item => ({
        'Ячейка': item.cell,
        'Курьер': item.courier,
        'Статус': item.status,
        'Осталось': item.ordersLeft,
        'Отсортировано': item.ordersSorted,
        'Отгружено': item.ordersShipped,
        'Всего': item.ordersPlanned,
        'Прибытие': item.courierArrivesAt ? new Date(item.courierArrivesAt).toLocaleTimeString() : '-'
    })));
}

// Функция для быстрого вызова с таблицей в консоли
async function showCouriers() {
    try {
        const data = await tpi_getCouriersAndCells();
        
        if (!data || data.length === 0) {
            console.log('❌ Нет данных о курьерах с ячейками');
            return;
        }

        // Сортируем курьеров по группам
        const { firstWave, secondWave, kgt, others } = sortCouriersByGroups(data);
        
        // Выводим таблицы
        displayCourierTable(firstWave, 'ПЕРВАЯ ВОЛНА (MK-1...)');
        displayCourierTable(secondWave, 'ВТОРАЯ ВОЛНА (MK-2...)');
        displayCourierTable(kgt, 'КГТ (KGT...)');
        
        if (others.length > 0) {
            displayCourierTable(others, 'ДРУГИЕ ЯЧЕЙКИ');
        }
        
        // Общая статистика
        const shippedCouriers = data.filter(item => item.status === 'SHIPPED').length;
        const totalOrdersLeft = data.reduce((sum, item) => sum + (item.ordersLeft || 0), 0);
        const totalOrdersShipped = data.reduce((sum, item) => sum + (item.ordersShipped || 0), 0);
        const totalOrdersPlanned = data.reduce((sum, item) => sum + (item.ordersPlanned || 0), 0);
        
        console.log(`\n📈 ОБЩАЯ СТАТИСТИКА:`);
        console.log(`   Всего курьеров с ячейками: ${data.length}`);
        console.log(`   ├─ Первая волна: ${firstWave.length}`);
        console.log(`   ├─ Вторая волна: ${secondWave.length}`);
        console.log(`   ├─ КГТ: ${kgt.length}`);
        console.log(`   └─ Другие: ${others.length}`);
        console.log(`   Отгружено: ${shippedCouriers}`);
        console.log(`   В работе: ${data.length - shippedCouriers}`);
        console.log(`   Всего заказов запланировано: ${totalOrdersPlanned}`);
        console.log(`   Всего заказов осталось: ${totalOrdersLeft}`);
        console.log(`   Всего заказов отгружено: ${totalOrdersShipped}`);
        console.log(`   Эффективность: ${((totalOrdersShipped / totalOrdersPlanned) * 100).toFixed(1)}%`);
        
    } catch (error) {
        console.error('💥 Ошибка:', error);
    }
}

// Добавляем функции в глобальную область видимости
window.tpi_getCouriersAndCells = tpi_getCouriersAndCells;
window.showCouriers = showCouriers;

// Функция для ожидания загрузки токена
function waitForTokenAndRun() {
    let attempts = 0;
    const maxAttempts = 15;
    
    const checkInterval = setInterval(() => {
        attempts++;
        
        if (tpiUserTOKEN !== null && tpiUserTOKEN !== undefined) {
            console.log('✅ Токен загружен, запускаем получение данных...');
            clearInterval(checkInterval);
            showCouriers();
        } else if (attempts >= maxAttempts) {
            console.log('❌ Превышено количество попыток ожидания токена');
            clearInterval(checkInterval);
        } else {
            console.log(`⏳ Ожидание токена... (попытка ${attempts}/${maxAttempts})`);
        }
    }, 1000);
}


// Запускаем ожидание токена