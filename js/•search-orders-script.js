function getSKTokenFromStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('sk')) {
            const value = localStorage.getItem(key);
            if (value && value.length > 10) {
                return value;
            }
        }
    }

    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('sk')) {
            const value = sessionStorage.getItem(key);
            if (value && value.length > 10) {
                return value;
            }
        }
    }

    try {
        if (window.__INITIAL_STATE__?.user?.sk) {
            return window.__INITIAL_STATE__.user.sk;
        }
    } catch (e) {}

    console.log('❌ SK токен не найден');
    return null;
}

function determineSearchType(value) {
    const str = String(value).trim();
    
    if (str.startsWith("LO-") || str.startsWith("FF-") || str.startsWith("AE-")) {
        return 'barcode';
    }
    
    const barcodePrefixes = ["F12", "FA2", "F22", "F30", "F40", "F50", "P20", "VPACK", "YP","GRW", "BP", "YD", "SP", "VOZ", "PVZ", "YMCN", "72", "0", "OL"];
    if (barcodePrefixes.some(prefix => str.startsWith(prefix))) {
        return 'barcode';
    }
    
    if (/^\d{11}-/.test(str)) {
        return 'barcode';
    }
    
    const digitsOnly = str.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
        return 'order';
    }
    
    return 'order';
}

function checkOrderMatch(order, searchValue, searchType) {
    if (!order) return false;
    
    const searchStr = String(searchValue).trim();
    
    if (searchType === 'barcode') {
        return order.sortableBarcode === searchStr;
    } else {
        return order.orderExternalId === searchStr;
    }
}

function universalSearch(searchValue, searchBy = 'barcode', tryFallback = true) {
    const searchTypeText = searchBy === 'barcode' ? 'грузоместу (штрихкоду)' : 'номеру заказа';
    console.log(`🔍 Универсальный поиск по ${searchTypeText}: ${searchValue}`);
    
    const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
    url.searchParams.append('r', 'sortingCenter/sortables/resolveSortableReport:resolveSortableReport');

    const requestBody = {
        "params": [{
            "sortableStatuses": [],
            "stages": [],
            [searchBy === 'barcode' ? 'sortableBarcode' : 'orderExternalId']: searchValue,
            "outboundIdTitle": "",
            "groupingDirectionId": "",
            "groupingDirectionName": "",
            "sortingCenterId": 21972131,
            "page": 0,
            "size": 20,
            "sortableTypes": ["PLACE","PALLET","TOT","BATCH","ANOMALY","ORPHAN_PALLET","DROP_PALLET","POLYBOX","POLYBOX_CAP","POLYBOX_TRAY","CART","COURIER_PALLET","CLIENT_RETURN","ZASYL"],
            "crossDockOnly": false
        }],
        "path": `/sorting-center/21972131/sortables?sortableTypes=all&sortableStatuses=&sortableStatusesLeafs=&${searchBy === 'barcode' ? 'sortableBarcode' : 'orderExternalId'}=${searchValue}&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=`
    };

    return fetch(url.toString(), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Market-Core-Service': '<UNKNOWN>',
            'sk': getSKTokenFromStorage() || 'default_sk_token'
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
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            
            if (result.error) {
                console.log('❌ Ошибка API:', result.error.message);
                if (tryFallback) {
                    const fallbackType = searchBy === 'barcode' ? 'номеру заказа' : 'грузоместу';
                    console.log(`🔄 Пробуем поиск по ${fallbackType}...`);
                    return universalSearch(searchValue, searchBy === 'barcode' ? 'order' : 'barcode', false);
                }
                return null;
            }
            
            if (result.data && result.data.content && result.data.content.length > 0) {
                const order = result.data.content[0];
                
                if (checkOrderMatch(order, searchValue, searchBy)) {
                    const successType = searchBy === 'barcode' ? 'грузоместу' : 'номеру';
                    console.log(`✅ Заказ найден по ${successType}!`);
                    return processAndLogOrderData(data, successType);
                } else {
                    console.log('⚠️ Найден заказ, но данные не совпадают');
                    if (tryFallback) {
                        const fallbackType = searchBy === 'barcode' ? 'номеру заказа' : 'грузоместу';
                        console.log(`🔄 Пробуем поиск по ${fallbackType}...`);
                        return universalSearch(searchValue, searchBy === 'barcode' ? 'order' : 'barcode', false);
                    }
                }
            }
        }
        
        console.log(`❌ Заказ не найден по ${searchTypeText}`);
        if (tryFallback) {
            const fallbackType = searchBy === 'barcode' ? 'номеру заказа' : 'грузоместу';
            console.log(`🔄 Пробуем поиск по ${fallbackType}...`);
            return universalSearch(searchValue, searchBy === 'barcode' ? 'order' : 'barcode', false);
        }
        return null;
    })
    .catch(error => {
        console.error('💥 Ошибка:', error);
        if (tryFallback) {
            const fallbackType = searchBy === 'barcode' ? 'номеру заказа' : 'грузоместу';
            console.log(`🔄 Пробуем поиск по ${fallbackType}...`);
            return universalSearch(searchValue, searchBy === 'barcode' ? 'order' : 'barcode', false);
        }
        return null;
    });
}

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
├─ 🆔 Номер лота: ${order.lotExternalId || 'N/A'}
${order.anomalyTicket ? `├─ 🚨 Аномалия: ${order.anomalyTicket || 'N/A'}` : ''}
            `.trim());
            
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

function tpi_sto_SearchOrder(value) {
    console.log(`🔍 Запуск поиска для: "${value}"`);
    
    const searchType = determineSearchType(value);
    const searchTypeText = searchType === 'barcode' ? 'грузоместу (штрихкоду)' : 'номеру заказа';
    console.log(`📊 Определен тип поиска: по ${searchTypeText}`);
    
    return universalSearch(value, searchType, true)
        .then(result => {
            if (!result) {
                console.log('❌❌❌ Ничего не нашлось :/');
            }
            return result;
        });
}

function tpiSearchOrder_sortable(value) {
    return tpi_sto_SearchOrder(value);
}

function getOrderData(value) {
    return tpi_sto_SearchOrder(value);
}

function checkTokens() {
    const skToken = getSKTokenFromStorage();
    if (skToken) {
        console.log('✅ SK токен найден');
    } else {
        console.log('❌ SK токен не найден');
    }
}

checkTokens();