// ===== ОРИГИНАЛЬНАЯ ФУНКЦИЯ ОПРЕДЕЛЕНИЯ ТИПА =====
function determineSearchType(value) {
    const str = String(value).trim();
    
    if (str.startsWith("LO-") || str.startsWith("FF-") || str.startsWith("AE-")) {
        return 'first';
    }
    
    const secondPrefixes = ["F12", "FA2", "F22", "F30", "F40", "F50", "P20", "YP", "BP", "SP", "VOZ", "PVZ", "YMCN", "07", "08", "05", "02"];
    if (secondPrefixes.some(prefix => str.startsWith(prefix))) {
        return 'second';
    }
    
    if (/^\d{11}-/.test(str)) {
        return 'second';
    }
    
    const digitsOnly = str.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
        return 'second';
    }
    
    return 'second';
}

function checkOrderMatch(order, searchValue, searchType) {
    if (!order) return false;
    
    const searchStr = String(searchValue).trim();
    
    if (searchType === 'first') {
        return order.sortableBarcode === searchStr;
    } else {
        return order.orderExternalId === searchStr;
    }
}

function processAndLogOrderData(data, searchType = '') {
    if (data && data.results && data.results.length > 0) {
        const result = data.results[0];
        
        if (result.data && result.data.content && result.data.content.length > 0) {
            const orders = result.data.content;
            const order = orders[0];
            
            return order;
        }
    }
    
    return null;
}

// ===== ФУНКЦИЯ ПОИСКА ПО ШТРИХКОДУ =====
function searchByBarcode(barcode, tryFallback = true) {
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

    const skToken = window.tpiUserTOKEN;

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
                if (tryFallback) {
                    return searchByOrderNumber(barcode, false);
                }
                return null;
            }
            
            if (result.data && result.data.content && result.data.content.length > 0) {
                const order = result.data.content[0];
                
                if (checkOrderMatch(order, barcode, 'first')) {
                    return processAndLogOrderData(data, 'штрихкоду');
                } else {
                    if (tryFallback) {
                        return searchByOrderNumber(barcode, false);
                    }
                }
            }
        }
        
        if (tryFallback) {
            return searchByOrderNumber(barcode, false);
        }
        return null;
    })
    .catch(error => {
        if (tryFallback) {
            return searchByOrderNumber(barcode, false);
        }
        return null;
    });
}

// ===== ФУНКЦИЯ ПОИСКА ПО НОМЕРУ ЗАКАЗА =====
function searchByOrderNumber(orderNumber, tryFallback = true) {
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

    const skToken = window.tpiUserTOKEN;

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
                if (tryFallback) {
                    return searchByBarcode(orderNumber, false);
                }
                return null;
            }
            
            if (result.data && result.data.content && result.data.content.length > 0) {
                const order = result.data.content[0];
                
                if (checkOrderMatch(order, orderNumber, 'second')) {
                    return processAndLogOrderData(data, 'номеру');
                } else {
                    if (tryFallback) {
                        return searchByBarcode(orderNumber, false);
                    }
                }
            }
        }
        
        if (tryFallback) {
            return searchByBarcode(orderNumber, false);
        }
        return null;
    })
    .catch(error => {
        if (tryFallback) {
            return searchByBarcode(orderNumber, false);
        }
        return null;
    });
}

// ===== ОСНОВНАЯ ФУНКЦИЯ ПОИСКА (ДЛЯ ОДНОГО ЗАКАЗА) =====
function tpi_sto_SearchOrder(value) {
    const searchType = determineSearchType(value);
    
    if (searchType === 'first') {
        return searchByBarcode(value, true)
            .then(result => result);
    } else {
        return searchByOrderNumber(value, true)
            .then(result => result);
    }
}

// ===== НОВЫЕ ФУНКЦИИ ДЛЯ ПАРАЛЛЕЛЬНОГО ПОИСКА =====
function processSingleOrder(value) {
    return tpi_sto_SearchOrder(value)
        .then(result => {
            return {
                value: value,
                result: result,
                success: !!result
            };
        })
        .catch(error => {
            return {
                value: value,
                result: null,
                success: false,
                error: error.message || 'Ошибка выполнения'
            };
        });
}

function showResultsAlert(results) {
    let message = '📊 РЕЗУЛЬТАТЫ ПОИСКА\n';
    message += '═══════════════════════════════════\n\n';
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    message += `✅ Найдено: ${successCount}\n`;
    message += `❌ Не найдено: ${failCount}\n`;
    message += `📦 Всего: ${results.length}\n\n`;
    message += '═══════════════════════════════════\n\n';
    
    results.forEach((item, index) => {
        const status = item.success ? '✅' : '❌';
        message += `${index + 1}. ${status} ${item.value}\n`;
        
        if (item.success && item.result) {
            message += `   📦 Номер: ${item.result.orderExternalId || 'N/A'}\n`;
            message += `   🏷️ Штрихкод: ${item.result.sortableBarcode || 'N/A'}\n`;
            if (item.result.status) {
                message += `   🚚 Статус: ${item.result.status}\n`;
            }
        } else if (!item.success && item.error) {
            message += `   ⚠️ Ошибка: ${item.error}\n`;
        } else {
            message += `   ⚠️ Не найден\n`;
        }
        message += '\n';
    });
    
    alert(message);
}

async function tpi_sto_SearchOrdersBatch(values) {
    if (!Array.isArray(values)) {
        return tpi_sto_SearchOrder(values);
    }
    
    if (!values || values.length === 0) {
        alert('❌ Список заказов пуст');
        return [];
    }
    
    if (!window.tpiUserTOKEN) {
        alert('❌ Токен не загружен, невозможно выполнить поиск');
        return values.map(v => ({
            value: v,
            result: null,
            success: false,
            error: 'Токен не загружен'
        }));
    }
    
    const promises = values.map(value => processSingleOrder(value));
    const results = await Promise.allSettled(promises);
    
    const processedResults = results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            return {
                value: values[index],
                result: null,
                success: false,
                error: result.reason?.message || 'Неизвестная ошибка'
            };
        }
    });
    
    showResultsAlert(processedResults);
    return processedResults;
}

// ===== ПРОСТАЯ ФУНКЦИЯ ДЛЯ ЗАПУСКА =====
async function searchOrders(ordersArray) {
    return await tpi_sto_SearchOrdersBatch(ordersArray);
}

// ===== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ =====
window.searchOrders = searchOrders;
window.tpi_sto_SearchOrdersBatch = tpi_sto_SearchOrdersBatch;
window.tpi_sto_SearchOrder = tpi_sto_SearchOrder;
window.determineSearchType = determineSearchType;

console.log('✅ Функции загружены! Используйте: await searchOrders([массив])');