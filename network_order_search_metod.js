A-----------------------------------------------------------------------------------------

function determineSearchType(value) {
    const str = String(value).trim();
    
    // Первый вариант: начинается с "LO-", "FF-", "AE-"
    if (str.startsWith("LO-") || str.startsWith("FF-") || str.startsWith("AE-")) {
        return 'first';
    }
    
    // Второй вариант: начинается с определенных префиксов
    const secondPrefixes = ["F12", "FA2", "F22", "F30", "F40", "F50", "P20", "YP", "BP", "SP", "VOZ", "PVZ", "YMCN", "07", "08", "05", "02"];
    if (secondPrefixes.some(prefix => str.startsWith(prefix))) {
        return 'second';
    }
    
    // Второй вариант: 11 цифр с дефисом после
    if (/^\d{11}-/.test(str)) {
        return 'second';
    }
    
    // Второй вариант: 11 цифр (номера заказов)
    const digitsOnly = str.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
        return 'second';
    }
    
    // По умолчанию используем второй вариант для всех остальных случаев
    return 'second';
}

// Функция проверки совпадения найденного заказа с искомым значением
function checkOrderMatch(order, searchValue, searchType) {
    if (!order) return false;
    
    const searchStr = String(searchValue).trim();
    
    if (searchType === 'first') {
        // Для поиска по штрихкоду проверяем совпадение со штрихкодом
        return order.sortableBarcode === searchStr;
    } else {
        // Для поиска по номеру заказа проверяем совпадение с номером заказа
        return order.orderExternalId === searchStr;
    }
}

// Универсальная функция обработки и логирования данных
function processAndLogOrderData(data, searchType = '') {
    if (data && data.results && data.results.length > 0) {
        const result = data.results[0];
        
        if (result.data && result.data.content && result.data.content.length > 0) {
            const orders = result.data.content;
            const order = orders[0];
            
            const searchTypeText = searchType ? `по ${searchType}` : '';
            
            console.log(`
🎯 РЕЗУЛЬТАТ ПОИСКА ${searchTypeText.toUpperCase()}:
├─ 📦 Номер заказа: ${order.orderExternalId || 'N/A'}
├─ 🏷️ Штрихкод: ${order.sortableBarcode || 'N/A'}
├─ 🔢 ID сортируемого: ${order.sortableId || 'N/A'}
├─ 📊 Тип: ${order.sortableType || 'N/A'}
├─ 🚚 Статус: ${order.status || 'N/A'}
├─ 📊 Расширенный статус: ${order.stageDisplayName || 'N/A'}
├─ 🎯 Назначение: ${order.destinationNameTo?.name || 'N/A'}
├─ 📍 Откуда: ${order.routeFrom || 'N/A'}
├─ 📍 Куда: ${order.routeTo || 'N/A'}
├─ 📅 Создан: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
├─ ⏰ Прибыл: ${order.arrivedDateTime ? new Date(order.arrivedDateTime).toLocaleString() : 'N/A'}
├─ 📤 Отгружен: ${order.shippedDateTime ? new Date(order.shippedDateTime).toLocaleString() : 'N/A'}
├─ 🔢 Код группы: ${order.groupCode || 'N/A'}
├─ 🎯 Кросс-док: ${order.crossDock ? 'Да' : 'Нет'}
├─ ⚠️ Статус повреждения: ${order.damagedStatus || 'N/A'}
├─ 🚛 Курьер: ${order.courierName || 'N/A'}
└─ 🆔 Номер лота: ${order.lotExternalId || 'N/A'}
            `);
            
            // Дополнительная информация о грузоместах
            if (orders.length > 1) {
                console.log('📦 Связанные грузоместа:');
                orders.forEach((o, index) => {
                    console.log(`   ${index + 1}. ${o.sortableBarcode} (${o.sortableId}) - ${o.sortableType || 'N/A'}`);
                });
            }
            
            return order;
        }
    }
    
    console.log('❌ Заказ не найден в ответе');
    return null;
}

// Функция поиска по штрихкоду
function searchByBarcode(barcode, tryFallback = true) {
    console.log(`🔍 Поиск по штрихкоду: ${barcode}`);
    
    const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
    url.searchParams.append('r', 'sortingCenter/sortables/resolveSortableReport:resolveSortableReport');

    const requestBody = {
        "params": [{
            "sortableStatuses": [],
            "stages": [],
            "sortableBarcode": barcode,
            "outboundIdTitle": "",
            "groupingDirectionId": "",
            "groupingDirectionName": "",
            "sortingCenterId": 21972131,
            "page": 0,
            "size": 20,
            "sortableTypes": ["PLACE","PALLET","TOT","BATCH"],
            "crossDockOnly": false
        }],
        "path": `/sorting-center/21972131/sortables?sortableTypes=PLACE,PALLET,TOT,BATCH&sortableStatuses=&sortableStatusesLeafs=&sortableBarcode=${barcode}&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=`
    };

    // Используем токен из переменной
    const skToken = tpiUserTOKEN;

    return fetch(url.toString(), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Market-Core-Service': '<UNKNOWN>',
            'sk': skToken
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            
            if (result.error) {
                console.log('❌ Ошибка API:', result.error.message);
                if (tryFallback) {
                    console.log('🔄 Пробуем поиск по номеру заказа...');
                    return searchByOrderNumber(barcode, false);
                }
                return null;
            }
            
            if (result.data && result.data.content && result.data.content.length > 0) {
                const order = result.data.content[0];
                
                // Проверяем совпадение штрихкода
                if (checkOrderMatch(order, barcode, 'first')) {
                    console.log('✅ Заказ найден по штрихкоду!');
                    return processAndLogOrderData(data, 'штрихкоду');
                } else {
                    console.log('⚠️ Найден заказ, но штрихкод не совпадает');
                    if (tryFallback) {
                        console.log('🔄 Пробуем поиск по номеру заказа...');
                        return searchByOrderNumber(barcode, false);
                    }
                }
            }
        }
        
        console.log('❌ Заказ не найден по штрихкоду');
        if (tryFallback) {
            console.log('🔄 Пробуем поиск по номеру заказа...');
            return searchByOrderNumber(barcode, false);
        }
        return null;
    })
    .catch(error => {
        console.error('💥 Ошибка:', error);
        if (tryFallback) {
            console.log('🔄 Пробуем поиск по номеру заказа...');
            return searchByOrderNumber(barcode, false);
        }
        return null;
    });
}

// Функция поиска по номеру заказа
function searchByOrderNumber(orderNumber, tryFallback = true) {
    console.log(`🔍 Поиск по номеру заказа: ${orderNumber}`);
    
    const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
    url.searchParams.append('r', 'sortingCenter/sortables/resolveSortableReport:resolveSortableReport');

    const requestBody = {
        "params": [{
            "sortableStatuses": [],
            "stages": [],
            "orderExternalId": orderNumber,
            "outboundIdTitle": "",
            "groupingDirectionId": "",
            "groupingDirectionName": "",
            "sortingCenterId": 21972131,
            "page": 0,
            "size": 20,
            "sortableTypes": ["PLACE","PALLET","TOT","BATCH"],
            "crossDockOnly": false
        }],
        "path": `/sorting-center/21972131/sortables?sortableTypes=PLACE,PALLET,TOT,BATCH&sortableStatuses=&sortableStatusesLeafs=&orderExternalId=${orderNumber}&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=`
    };

    // Используем токен из переменной
    const skToken = tpiUserTOKEN;

    return fetch(url.toString(), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Market-Core-Service': '<UNKNOWN>',
            'sk': skToken
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.results && data.results.length > 0) {
            const result = data.results[0];
            
            if (result.error) {
                console.log('❌ Ошибка:', result.error.message);
                if (tryFallback) {
                    console.log('🔄 Пробуем поиск по штрихкоду...');
                    return searchByBarcode(orderNumber, false);
                }
                return null;
            }
            
            if (result.data && result.data.content && result.data.content.length > 0) {
                const order = result.data.content[0];
                
                // Проверяем совпадение номера заказа
                if (checkOrderMatch(order, orderNumber, 'second')) {
                    console.log('✅ Заказ найден по номеру!');
                    return processAndLogOrderData(data, 'номеру');
                } else {
                    console.log('⚠️ Найден заказ, но номер не совпадает');
                    if (tryFallback) {
                        console.log('🔄 Пробуем поиск по штрихкоду...');
                        return searchByBarcode(orderNumber, false);
                    }
                }
            }
        }
        
        console.log('❌ Заказ не найден по номеру');
        if (tryFallback) {
            console.log('🔄 Пробуем поиск по штрихкоду...');
            return searchByBarcode(orderNumber, false);
        }
        return null;
    })
    .catch(error => {
        console.error('❌ Ошибка:', error);
        if (tryFallback) {
            console.log('🔄 Пробуем поиск по штрихкоду...');
            return searchByBarcode(orderNumber, false);
        }
        return null;
    });
}

// Основная функция поиска
async function tpi_sto_SearchOrder(value) {
    console.log(`🔍 Запуск поиска для: "${value}"`);
    
    // Проверяем наличие токена
    if (!tpiUserTOKEN) {
        console.log('❌ Токен не загружен, невозможно выполнить поиск');
        return null;
    }
    
    console.log('✅ Токен готов, начинаем поиск...');
    
    const searchType = determineSearchType(value);
    console.log(`📊 Определен тип поиска: ${searchType === 'first' ? 'по штрихкоду' : 'по номеру заказа'}`);
    
    if (searchType === 'first') {
        return searchByBarcode(value, true)
            .then(result => {
                if (!result) {
                    console.log('❌❌❌ Ничего не нашлось :/');
                }
                return result;
            });
    } else {
        return searchByOrderNumber(value, true)
            .then(result => {
                if (!result) {
                    console.log('❌❌❌ Ничего не нашлось :/');
                }
                return result;
            });
    }
}

// Дополнительные функции для обратной совместимости
function tpiSearchOrder_sortable(value) {
    return tpi_sto_SearchOrder(value);
}

function getOrderData(value) {
    return tpi_sto_SearchOrder(value);
}
