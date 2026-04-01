// Глобальные переменные для Firebase+
let tpiFirebaseInitialized = false;
let tpiDb = null;
window.tpiCalendarDatesCache = {};
window.tpiCalendarMonthCache = {};
let tpiCalendarDatesCache = {};
let calendarDatesCache = {};
let tpiCalendarDataLoaded = false;
let tpiCalendarPreloadPromise = null;
let tpiCalendarPreloadComplete = false;
let tpi_cc_lastLoaderShowTime = 0; 
const tpi_cc_minLoaderTextChangeInterval = 1000; 
const DEBUG_CALENDAR = false;
let tpi_cc_originalRowOrder = [];
let tpi_cc_currentFilterColumn = null;
let tpi_cc_currentFilterDirection = null;
let tpi_cc_tableSortInitialized = false;
window.tpi_getRoutesSummary = tpi_getRoutesSummary;
let tpiChartInstance = null;
// window.tpi_cc_claimTableData_toPrint = tpi_cc_claimTableData_toPrint;
// window.tpi_cc_generateQRcodes_toPrint = tpi_cc_generateQRcodes_toPrint;
// window.tpi_cc_generatePDFlabels_toPrint = tpi_cc_generatePDFlabels_toPrint;

// Функция для предзагрузки данных календаря
async function preloadCalendarData() {
    if (tpiCalendarPreloadComplete) {
        return Promise.resolve();
    }
    
    if (tpiCalendarPreloadPromise) {
        return tpiCalendarPreloadPromise;
    }
    
    console.log('📅 Запуск предзагрузки данных календаря...');
    
    tpiCalendarPreloadPromise = new Promise(async (resolve, reject) => {
        try {
            const now = new Date();
            const currentHour = now.getHours();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // 🔥 ПРЕДЗАГРУЖАЕМ ТОЛЬКО 5 ДНЕЙ, А НЕ 30
            const datesToCheck = [];
            
            // Проверяем только последние 2 дня и следующие 2 дня
            for (let i = -2; i <= 2; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() + i);
                const dateStr = formatDateToDDMMYYYY(date);
                datesToCheck.push(dateStr);
            }
            
            // Добавляем сегодня, если вдруг не попал в диапазон
            const todayStr = formatDateToDDMMYYYY(today);
            if (!datesToCheck.includes(todayStr)) {
                datesToCheck.push(todayStr);
            }
            
            // Если сейчас после 22:00, добавляем завтра
            if (currentHour >= 22) {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = formatDateToDDMMYYYY(tomorrow);
                if (!datesToCheck.includes(tomorrowStr)) {
                    datesToCheck.push(tomorrowStr);
                }
            }
            
            console.log(`🔍 Предзагрузка ${datesToCheck.length} актуальных дат...`);
            
            if (!window.tpiCalendarDatesCache) {
                window.tpiCalendarDatesCache = {};
            }
            
            // Используем массовую проверку ТОЛЬКО для этих дат
            const uniqueDates = [...new Set(datesToCheck)];
            const firebaseResults = await tpiCheckMultipleDatesInFirebase(uniqueDates);
            
            // Обновляем кэш
            uniqueDates.forEach(dateStr => {
                const result = firebaseResults[dateStr] || { exists: false };
                
                const dateParts = dateStr.split('/');
                const checkDate = new Date(
                    parseInt(dateParts[2]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[0])
                );
                checkDate.setHours(0, 0, 0, 0);
                
                const timeDiff = checkDate.getTime() - today.getTime();
                const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                
                let status;
                if (result.exists) {
                    status = 'has-bd-data';
                } else {
                    if (diffDays < 0) {
                        status = 'no-bd-data';
                    } else if (diffDays === 0) {
                        status = 'available-to-write-bd-data';
                    } else if (diffDays === 1) {
                        status = (currentHour >= 23) ? 'available-to-write-bd-data' : 'future-date';
                    } else {
                        status = 'future-date';
                    }
                }
                
                window.tpiCalendarDatesCache[dateStr] = status;
            });
            
            tpiCalendarPreloadComplete = true;
            tpiCalendarDataLoaded = true;
            
            console.log('✅ Данные календаря предзагружены');
            resolve();
            
        } catch (error) {
            console.warn('❌ Ошибка предзагрузки календаря:', error);
            tpiCalendarPreloadComplete = false;
            tpiCalendarPreloadPromise = null;
            reject(error);
        }
    });
    
    return tpiCalendarPreloadPromise;
}

// Функция для показа/скрытия лоадера предзагрузки календаря
function showCalendarPreloader(show) {
    // Можно добавить небольшой лоадер в угол экрана
    if (show) {
        console.log('⏳ Идет предзагрузка данных календаря...');
    } else {
        console.log('✅ Предзагрузка календаря завершена');
    }
}

async function updateCalendarCacheForDate(dateStr) {
    try {
        // Проверяем данные в Firebase
        const result = await tpiCheckDataInFirebase(dateStr);
        
        // Определяем правильный статус на основе результата
        const now = new Date();
        const currentHour = now.getHours();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dateParts = dateStr.split('/');
        const checkDate = new Date(
            parseInt(dateParts[2]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[0])
        );
        checkDate.setHours(0, 0, 0, 0);
        
        const timeDiff = checkDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        let status;
        if (result.exists) {
            status = 'has-bd-data';
        } else {
            if (diffDays < 0) {
                // Прошлые даты без данных
                status = 'no-bd-data';
            } else if (diffDays === 0) {
                // Сегодня без данных - ВСЕГДА можно записать
                status = 'available-to-write-bd-data';
            } else if (diffDays === 1) {
                // Завтра
                status = (currentHour >= 23) ? 'available-to-write-bd-data' : 'future-date';
            } else {
                // Будущие даты
                status = 'future-date';
            }
        }
        
        // Обновляем глобальный кэш
        window.tpiCalendarDatesCache[dateStr] = status;
        
        console.log(`🔄 Обновлен кэш для ${dateStr}: ${status}`);
        return status;
        
    } catch (error) {
        console.warn(`❌ Ошибка обновления кэша для ${dateStr}:`, error);
        return null;
    }
}

function canWriteToDate(targetDate) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Приводим даты к началу дня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateToCheck = new Date(targetDate);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Если дата в прошлом (раньше сегодня) - нельзя записывать
    if (dateToCheck < today) {
        return false;
    }
    
    // Если сегодняшняя дата - можно записывать всегда (до 23:00 следующего дня)
    if (dateToCheck.getTime() === today.getTime()) {
        return true; // ИЗМЕНЕНО: было ограничение по времени
    }
    
    // Если завтрашняя дата
    if (dateToCheck.getTime() === tomorrow.getTime()) {
        // Можно записывать на завтра если:
        // 1. Сейчас после 23:00 сегодняшнего дня
        // 2. Завтра до 23:00 (по сути это то же самое окно 23:00-23:00)
        return currentHour >= 23;
    }
    
    // Будущие даты (больше чем завтра) - нельзя
    return false;
}

// Функция для получения статуса даты (синхронная, для быстрого отображения)
function getDateStatusSync(dateStr, targetDate) {
    const now = new Date();
    const currentHour = now.getHours();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateToCheck = new Date(targetDate);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Вычисляем разницу в днях
    const timeDiff = dateToCheck.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // 1. Проверяем глобальный кэш (самый быстрый способ)
    if (window.tpiCalendarDatesCache && window.tpiCalendarDatesCache[dateStr] !== undefined) {
        return window.tpiCalendarDatesCache[dateStr];
    }
    
    // 2. Быстрая логика на основе времени
    if (diffDays < 0) {
        // Прошлые даты
        return 'no-bd-data';
    } else if (diffDays === 0) {
        // Сегодня - всегда можно записать, если нет данных
        return 'available-to-write-bd-data'; // ИЗМЕНЕНО: всегда доступно для записи
    } else if (diffDays === 1) {
        // Завтра - доступно только после 23:00
        return currentHour >= 23 ? 'available-to-write-bd-data' : 'future-date';
    } else {
        // Будущие даты (больше чем завтра)
        return 'future-date';
    }
}

// Функция для загрузки статусов диапазона дат
async function loadDateRangeStatuses(startDate, endDate) {
    const datesToCheck = [];
    const currentDate = new Date(startDate);
    
    // Создаем массив всех дат в диапазоне
    while (currentDate <= endDate) {
        const dateStr = formatDateToDDMMYYYY(new Date(currentDate));
        datesToCheck.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`🔍 Проверка ${datesToCheck.length} дат...`);
    
    // Проверяем даты пакетами по 10 штук
    const batchSize = 10;
    for (let i = 0; i < datesToCheck.length; i += batchSize) {
        const batch = datesToCheck.slice(i, i + batchSize);
        const promises = batch.map(dateStr => tpiCheckDataInFirebase(dateStr));
        
        try {
            const results = await Promise.all(promises);
            
            // Сохраняем результаты в кэш
            results.forEach((result, index) => {
                const dateStr = batch[index];
                window.tpiCalendarDatesCache[dateStr] = result.exists ? 'has-bd-data' : 'no-bd-data';
            });
            
            console.log(`📊 Загружено ${Math.min(i + batchSize, datesToCheck.length)}/${datesToCheck.length} дат`);
        } catch (error) {
            console.warn(`Ошибка загрузки батча ${i/batchSize + 1}:`, error);
        }
    }
}

function extractCartNumbers(courierData) {
    const cartNumbers = [];
    
    // Проверяем, есть ли уже сохраненные номера
    if (courierData.cartNumbers && Array.isArray(courierData.cartNumbers)) {
        return courierData.cartNumbers;
    }
    
    // Извлекаем из HTML, если таблица уже отрисована
    const rowIndex = courierData._rowIndex;
    if (rowIndex !== undefined) {
        const row = document.querySelectorAll('.tpi-cc--table-tbody')[rowIndex];
        if (row) {
            const cartButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
            cartButtons.forEach(btn => {
                const cartNumber = btn.getAttribute('tpi-data-courier-spec-cell');
                if (cartNumber && cartNumber.startsWith('CART-')) {
                    cartNumbers.push(cartNumber);
                }
            });
        }
    }
    
    return cartNumbers;
}

function extractPalletNumbers(courierData) {
    const palletNumbers = [];
    
    // Проверяем, есть ли уже сохраненные номера
    if (courierData.palletNumbers && Array.isArray(courierData.palletNumbers)) {
        return courierData.palletNumbers;
    }
    
    // Извлекаем из HTML, если таблица уже отрисована
    const rowIndex = courierData._rowIndex;
    if (rowIndex !== undefined) {
        const row = document.querySelectorAll('.tpi-cc--table-tbody')[rowIndex];
        if (row) {
            const palletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
            palletButtons.forEach(btn => {
                const palletNumber = btn.getAttribute('tpi-data-courier-spec-cell');
                if (palletNumber && palletNumber.startsWith('PALLET-')) {
                    palletNumbers.push(palletNumber);
                }
            });
        }
    }
    
    return palletNumbers;
}

// Функция для подготовки данных курьера к сохранению (с сохранением сгенерированных номеров)
function prepareCourierDataForSave(courierData) {
    const dataToSave = {
        ...courierData,
        savedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Сохраняем сгенерированные номера CART и PALLET
    if (courierData.cartNumbers && Array.isArray(courierData.cartNumbers)) {
        dataToSave.cartNumbers = courierData.cartNumbers;
    }
    
    if (courierData.palletNumbers && Array.isArray(courierData.palletNumbers)) {
        dataToSave.palletNumbers = courierData.palletNumbers;
    }
    
    // Сохраняем onlineTransferActId если он есть
    if (courierData.onlineTransferActId) {
        dataToSave.onlineTransferActId = courierData.onlineTransferActId;
    }
    
    // Удаляем временные поля, которые не нужно сохранять
    delete dataToSave._rowIndex;
    delete dataToSave._savedCartNumbers;
    delete dataToSave._savedPalletNumbers;
    delete dataToSave._savedOnlineTransferActId;
    
    return dataToSave;
}

// Функция для восстановления сгенерированных номеров и onlineTransferActId при загрузке из Firebase
function restoreGeneratedNumbers(courierData) {
    const restoredData = { ...courierData };
    
    // Восстанавливаем сохраненные номера CART
    if (courierData.cartNumbers && Array.isArray(courierData.cartNumbers)) {
        restoredData._savedCartNumbers = courierData.cartNumbers;
    }
    
    // Восстанавливаем сохраненные номера PALLET
    if (courierData.palletNumbers && Array.isArray(courierData.palletNumbers)) {
        restoredData._savedPalletNumbers = courierData.palletNumbers;
    }
    
    // Восстанавливаем onlineTransferActId
    if (courierData.onlineTransferActId) {
        restoredData._savedOnlineTransferActId = courierData.onlineTransferActId;
    }
    
    // Удаляем служебные поля Firebase
    delete restoredData.savedAt;
    
    return restoredData;
}

// Обновляем функцию tpi_getCouriersAndCells для получения onlineTransferActId
async function tpi_getCouriersAndCells(selectedDate = null) {
    console.log('🔍 Получение данных о курьерах и ячейках...');
    
    try {
        // Шаг 1: Получаем данные о маршрутах
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'sortingCenter/routes/resolveGetRoutesFullInfo:resolveGetRoutesFullInfo');

        let targetDate;
        
        if (selectedDate) {
            // Используем выбранную дату из формата DD/MM/YYYY
            const dateParts = selectedDate.split('/');
            if (dateParts.length === 3) {
                targetDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            } else {
                // Если формат неправильный, используем логику по умолчанию
                const today = new Date();
                const currentHour = today.getHours();
                targetDate = new Date(today);
                if (currentHour >= 22) {
                    targetDate.setDate(targetDate.getDate() + 1);
                }
            }
        } else {
            // Логика по умолчанию
            const today = new Date();
            const currentHour = today.getHours();
            targetDate = new Date(today);
            if (currentHour >= 22) {
                targetDate.setDate(targetDate.getDate() + 1);
            }
        }

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        
        console.log('📅 Дата запроса API:', currentDate, '(выбранная дата:', selectedDate || 'не указана', ')');
        
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
                'sk': tpiUserTOKEN
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
                
                // Шаг 2: Получаем ФИО курьеров по одному с кэшированием
                let courierNamesMap = {};
                const encryptedIds = [];
                const routeIdToEncryptedIdMap = {};
                
                // Собираем все encrypted IDs
                routes.forEach((route, index) => {
                    if (route.destination && 
                        route.destination.destinationName && 
                        route.destination.destinationName.encryptedPersonalFullNameId) {
                        
                        const encryptedId = route.destination.destinationName.encryptedPersonalFullNameId;
                        encryptedIds.push(encryptedId);
                        routeIdToEncryptedIdMap[index] = encryptedId;
                    }
                });
                
                console.log(`🔐 Собрано encrypted IDs: ${encryptedIds.length}`);
                
                if (encryptedIds.length > 0) {
                    console.log('📤 Получаем ФИО курьеров по одному...');
                    courierNamesMap = await tpi_getCourierNamesOneByOneWithCache(encryptedIds);
                    console.log(`✅ Получено ФИО для ${Object.keys(courierNamesMap).length} курьеров`);
                }
                
                // Шаг 3: Формируем данные для таблицы
                const couriersData = routes.map((route, index) => {
                    // Получаем ФИО
                    let courierName = 'Не указан';
                    const encryptedId = routeIdToEncryptedIdMap[index];
                    
                    if (encryptedId && courierNamesMap[encryptedId]) {
                        courierName = courierNamesMap[encryptedId];
                    } else if (route.courier && route.courier.externalId) {
                        courierName = `Курьер ${route.courier.externalId}`;
                    } else if (route.courier && route.courier.id) {
                        courierName = `Курьер ID:${route.courier.id}`;
                    }
                    
                    // Определяем ячейку
                    let cellNumbers = 'Нет ячеек';
                    let mainCell = 'Нет ячейки';
                    
                    if (route.cells && route.cells.length > 0) {
                        // Есть ячейки
                        cellNumbers = route.cells.map(cell => cell.number || 'Без номера').join(', ');
                        mainCell = route.cells[0]?.number || 'Нет ячейки';
                    } else if (route.cell && route.cell.number) {
                        // Есть отдельное поле cell
                        cellNumbers = route.cell.number;
                        mainCell = route.cell.number;
                    } else {
                        // Пустой cells - курьер уже отгружен и пропал
                        cellNumbers = 'null';
                        mainCell = 'null';
                    }
                    
                    const routeStatus = route.status || 'Неизвестно';
                    
                    // Получаем onlineTransferActId из route.transferAct
                    let onlineTransferActId = null;
                    if (route.transferAct && route.transferAct.id) {
                        onlineTransferActId = route.transferAct.id;
                    }
                    
                    return {
                        courier: courierName,
                        cell: mainCell,
                        cells: cellNumbers,
                        status: routeStatus,
                        ordersLeft: route.ordersLeft || 0,
                        ordersSorted: route.ordersSorted || 0,
                        ordersShipped: route.ordersShipped || 0,
                        ordersPlanned: route.ordersPlanned || 0,
                        sortablesInCell: route.sortablesInCell || 0,
                        sortablesPrepared: route.sortablesPrepared || 0,
                        courierArrivesAt: route.courierArrivesAt || null,
                        startedAt: route.startedAt || null,
                        finishedAt: route.finishedAt || null,
                        routeId: route.id || null,
                        courierId: route.courier?.id || null,
                        externalId: route.courier?.externalId || null,
                        encryptedId: encryptedId || null,
                        hasCells: route.cells && route.cells.length > 0,
                        onlineTransferActId: onlineTransferActId // Добавляем onlineTransferActId
                    };
                });
                
                console.log(`📊 Обработано курьеров: ${couriersData.length}`);
                console.log(`📄 Найдено onlineTransferActId: ${couriersData.filter(c => c.onlineTransferActId).length}`);
                
                // Статистика по ФИО
                const withRealNames = couriersData.filter(item => 
                    !item.courier.startsWith('Курьер ') && 
                    !item.courier.startsWith('Курьер ID:') && 
                    item.courier !== 'Не указан'
                ).length;
                
                console.log('📊 Статистика по ФИО:');
                console.log(`  - С реальными ФИО: ${withRealNames}`);
                console.log(`  - С ID вместо ФИО: ${couriersData.length - withRealNames}`);
                
                // Покажем примеры курьеров с ФИО и без
                const withNames = couriersData.filter(item => !item.courier.includes('Курьер'));
                const withoutNames = couriersData.filter(item => item.courier.includes('Курьер'));
                
                if (withNames.length > 0) {
                    console.log('\n✅ Курьеры с ФИО:');
                    withNames.slice(0, 5).forEach((item, i) => {
                        console.log(`  ${i + 1}. ${item.courier} (${item.cell})${item.onlineTransferActId ? ' [есть onlineTransferActId]' : ''}`);
                    });
                }
                
                if (withoutNames.length > 0) {
                    console.log('\n⚠️ Курьеры без ФИО (только ID):');
                    withoutNames.slice(0, 5).forEach((item, i) => {
                        console.log(`  ${i + 1}. ${item.courier} (${item.cell})`);
                    });
                    console.log(`  ...и еще ${withoutNames.length - 5} других`);
                }
                
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
        console.warn('💥 Ошибка при получении данных:', error);
        return null;
    }
}

// Функция для восстановления сгенерированных номеров при загрузке из Firebase
function restoreGeneratedNumbers(courierData) {
    const restoredData = { ...courierData };
    
    // Восстанавливаем сохраненные номера CART
    if (courierData.cartNumbers && Array.isArray(courierData.cartNumbers)) {
        restoredData._savedCartNumbers = courierData.cartNumbers;
    }
    
    // Восстанавливаем сохраненные номера PALLET
    if (courierData.palletNumbers && Array.isArray(courierData.palletNumbers)) {
        restoredData._savedPalletNumbers = courierData.palletNumbers;
    }
    
    // Удаляем служебные поля Firebase
    delete restoredData.savedAt;
    
    return restoredData;
}

// Инициализация Firebase
function tpiInitializeFirebase() {
    if (tpiFirebaseInitialized) return tpiDb;
    
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig, 'tpiCartControlsApp');
        } else {
            // Используем существующее приложение
            tpiDb = firebase.firestore();
        }
        tpiDb = firebase.firestore();
        tpiFirebaseInitialized = true;
        console.log('✅ TPI Firebase успешно инициализирован');
        return tpiDb;
    } catch (error) {
        console.warn('❌ Ошибка инициализации TPI Firebase:', error);
        return null;
    }
}

// Функция для проверки существования данных в Firebase
async function tpiCheckDataInFirebase(selectedDate) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return { exists: false, hasCartPalletData: false };
        }
        
        // Форматируем дату в формат YYYY-MM-DD
        const dateParts = selectedDate.split('/');
        if (dateParts.length !== 3) {
            console.warn('Неверный формат даты:', selectedDate);
            return { exists: false, hasCartPalletData: false };
        }
        
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        console.log('🔍 TPI Проверка одной даты в Firebase:', firebaseDate);
        
        // Проверяем существование документа с датой
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const dateDoc = await dateDocRef.get();
        
        if (!dateDoc.exists) {
            console.log('📭 TPI Документа с датой не существует');
            return { exists: false, hasCartPalletData: false };
        }
        
        // Проверяем существование подколлекции cartControl
        const cartControlRef = dateDocRef.collection("cartControl");
        const cartControlSnapshot = await cartControlRef.get();
        
        const hasData = !cartControlSnapshot.empty;
        console.log('📊 TPI Найдено записей в cartControl:', cartControlSnapshot.size);
        
        // Проверяем, есть ли данные о CART/PALLET в документах
        let hasCartPalletData = false;
        if (hasData) {
            cartControlSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.cartNumbers || data.palletNumbers) {
                    hasCartPalletData = true;
                }
            });
        }
        
        return {
            exists: hasData,
            hasCartPalletData: hasCartPalletData
        };
        
    } catch (error) {
        console.log('💥 TPI Ошибка при проверке данных в Firebase:', error);
        makeErrorMessage()
        return { exists: false, hasCartPalletData: false };
    }
}

function makeErrorMessage(){
    const no_data_storage_container = document.querySelector('tpi-cc--no-ds-data-container')
    const no_data_storage_title = document.querySelector('.tpi-cc--no-ds-data-title p')
    const no_data_storage_description = document.querySelector('p.tpi-cc--no-ds-data-description-block')
    const no_data_storage_description_sub = document.querySelector('p.tpi-cc--no-ds-data-description-block-sub')
    no_data_storage_container.setAttribute('tpi-current-state', error)
    no_data_storage_title.innerText = `Ошибка загрузки базы данных`
    no_data_storage_description.innerText = `Во время загрузки информации из базы данных произошла ошибка, пожалуйста перезагрузите страницу или подождите несколько минут`
    no_data_storage_description_sub.innerText = `Чаще всего данная проблема связана с проблемным соединением (интернет), если на пк работает VPN, обязательно выключите его!`
}

// Функция для загрузки данных из Firebase
async function tpiLoadDataFromFirebase(selectedDate) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return null;
        }
        
        // Форматируем дату в формат YYYY-MM-DD
        const dateParts = selectedDate.split('/');
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        console.log('📥 TPI Загрузка данных из Firebase для даты:', firebaseDate);
        
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const cartControlRef = dateDocRef.collection("cartControl");
        const snapshot = await cartControlRef.get();
        
        if (snapshot.empty) {
            console.log('📭 TPI Нет данных в cartControl');
            return null;
        }
        
        const couriersData = [];
        snapshot.forEach(doc => {
            const courierData = doc.data();
            // Восстанавливаем сгенерированные номера CART и PALLET
            const restoredCourierData = restoreGeneratedNumbers(courierData);
            // Убираем служебные поля
            delete restoredCourierData.savedAt;
            couriersData.push(restoredCourierData);
        });
        
        console.log('✅ TPI Загружено курьеров из Firebase:', couriersData.length);
        return couriersData;
        
    } catch (error) {
        console.warn('💥 TPI Ошибка при загрузке данных из Firebase:', error);
        return null;
    }
}

// Функция для сохранения данных в Firebase
async function tpiSaveDataToFirebase(selectedDate, couriersData) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return false;
        }
        
        // Форматируем дату в формат YYYY-MM-DD
        const dateParts = selectedDate.split('/');
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        console.log('💾 TPI Сохранение данных в Firebase для даты:', firebaseDate);
        console.log('📊 TPI Количество курьеров для сохранения:', couriersData.length);
        
        // Проверяем наличие onlineTransferActId перед сохранением
        const withActId = couriersData.filter(c => c.onlineTransferActId);
        console.log(`📄 TPI Курьеров с onlineTransferActId перед сохранением: ${withActId.length}`);
        if (withActId.length > 0) {
            console.log('📄 Примеры:');
            withActId.slice(0, 3).forEach(c => {
                console.log(`  - ${c.courier}: ${c.onlineTransferActId}`);
            });
        }
        
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const dateDoc = await dateDocRef.get();
        
        // Создаем документ даты, если он не существует
        if (!dateDoc.exists) {
            await dateDocRef.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('📄 TPI Создан новый документ даты:', firebaseDate);
        } else {
            // Обновляем время обновления
            await dateDocRef.update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Получаем ссылку на подколлекцию cartControl
        const cartControlRef = dateDocRef.collection("cartControl");
        
        // Удаляем старые данные (очищаем коллекцию)
        const oldSnapshot = await cartControlRef.get();
        const deletePromises = [];
        oldSnapshot.forEach(doc => {
            deletePromises.push(doc.ref.delete());
        });
        await Promise.all(deletePromises);
        console.log('🗑️ TPI Удалено старых записей:', deletePromises.length);
        
        // Сохраняем каждого курьера отдельным документом
        let savedCount = 0;
        let savedWithActIdCount = 0;
        
        for (const courier of couriersData) {
            try {
                // Используем courier-personal-id как ID документа
                const courierId = courier.externalId || courier.courierId || `courier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Подготавливаем данные для сохранения
                const courierDataToSave = prepareCourierDataForSave(courier);
                
                // Сохраняем документ
                await cartControlRef.doc(courierId).set(courierDataToSave);
                savedCount++;
                
                if (courierDataToSave.onlineTransferActId) {
                    savedWithActIdCount++;
                }
                
            } catch (error) {
                console.warn(`❌ TPI Ошибка при сохранении курьера ${courier.courier}:`, error);
            }
        }
        
        console.log(`✅ TPI Успешно сохранено ${savedCount}/${couriersData.length} курьеров в Firebase`);
        console.log(`✅ TPI Из них с onlineTransferActId: ${savedWithActIdCount}`);
        return savedCount > 0;
        
    } catch (error) {
        console.warn('💥 TPI Ошибка при сохранении данных в Firebase:', error);
        return false;
    }
}

const tpi_cc_i_cart_add = `
<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" fill="currentColor"></path>
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
`,
tpi_cc_i_cancel = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.44 12 21 19.56 19.56 21 12 13.44 4.44 21 3 19.56 10.56 12 3 4.44 4.44 3 12 10.56 19.56 3 21 4.44 13.44 12Z"></path>
</svg>
`,
tpi_cc_i_cart = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.756 5.345c-.191-.219-.466-.345-.756-.345h-13.819l-.195-1.164c-.08-.482-.497-.836-.986-.836h-2.25c-.553 0-1 .447-1 1s.447 1 1 1h1.403l1.86 11.164.045.124.054.151.12.179.095.112.193.13.112.065c.116.047.238.075.367.075h11.001c.553 0 1-.447 1-1s-.447-1-1-1h-10.153l-.166-1h11.319c.498 0 .92-.366.99-.858l1-7c.041-.288-.045-.579-.234-.797zm-1.909 1.655l-.285 2h-3.562v-2h3.847zm-4.847 0v2h-3v-2h3zm0 3v2h-3v-2h3zm-4-3v2h-3l-.148.03-.338-2.03h3.486zm-2.986 3h2.986v2h-2.653l-.333-2zm7.986 2v-2h3.418l-.285 2h-3.133z"></path>
    <circle cx="8.5" cy="19.5" r="1.5">
    </circle><circle cx="17.5" cy="19.5" r="1.5"></circle>
</svg>
`,
tpi_cc_i_pallet = `
<svg class="tpi-infi--icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg">
    <path d="M144 256h352c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H384v128l-64-32-64 32V0H144c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16zm480 128c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v64H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h608c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-48v-64h48zm-336 64H128v-64h160v64zm224 0H352v-64h160v64z"></path>
</svg>
`,
tpi_cc_i_courier = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
</svg>
`,
tpi_cc_i_courier_id = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg">
    <path d="M528 32H48C21.5 32 0 53.5 0 80v16h576V80c0-26.5-21.5-48-48-48zM0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V128H0v304zm352-232c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zM176 192c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zM67.1 396.2C75.5 370.5 99.6 352 128 352h8.2c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h8.2c28.4 0 52.5 18.5 60.9 44.2 3.2 9.9-5.2 19.8-15.6 19.8H82.7c-10.4 0-18.8-10-15.6-19.8z"></path>
</svg>
`,
tpi_cc_i_courier_route_id = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3C6.30622 3 7.41746 3.83481 7.82929 5H10C12.2091 5 14 6.79086 14 9C14 11.2091 12.2091 13 10 13H7C5.34315 13 4 14.3431 4 16C4 17.6569 5.34315 19 7 19H13L15 21H7C4.23858 21 2 18.7614 2 16C2 13.2386 4.23858 11 7 11H10C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7H7.82929C7.41746 8.16519 6.30622 9 5 9C3.34315 9 2 7.65685 2 6C2 4.34315 3.34315 3 5 3Z"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5608 20.9961H18.4484C18.7487 20.192 19.5015 19.5618 20.1257 19.0568C20.3933 18.8404 20.6413 18.6397 20.8273 18.4502C21.3871 17.8811 21.7684 17.1554 21.9229 16.3652C22.0775 15.5751 21.9984 14.7559 21.6956 14.0116C21.3928 13.2673 20.88 12.6313 20.2221 12.1841C19.5642 11.737 18.7908 11.4989 18 11.5C17.2092 11.4989 16.4358 11.737 15.7779 12.1841C15.12 12.6313 14.6072 13.2673 14.3044 14.0116C14.0016 14.7559 13.9225 15.5751 14.0771 16.3652C14.2316 17.1554 14.6129 17.8811 15.1727 18.4502C15.359 18.6412 15.6088 18.8435 15.8786 19.0619C16.5011 19.5658 17.2566 20.2524 17.5608 20.9961Z"></path>
</svg>
`,
tpi_cc_i_courier_print = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"></path><path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path>
</svg>
`,
tpi_cc_i_courier_eapp = `
<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25H10V18H4.75A2.75 2.75 0 0 1 2 15.25V4.75A2.75 2.75 0 0 1 4.75 2h6.81L15 5.44V8h-1.5V6.06L10.94 3.5H4.75Zm9.75 6.75a.75.75 0 0 1 .75.75v5.099l1.834-1.223a.75.75 0 1 1 .832 1.248l-2.534 1.69C15.102 18 14.5 18 14.5 18s-.601 0-.883-.187l-2.533-1.689a.75.75 0 0 1 .832-1.248l1.834 1.223V11a.75.75 0 0 1 .75-.75Zm-9 .5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" fill="#212121"></path>
</svg>
`,
tpi_cc_i_courier_app = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62z"></path>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 56v120a32 32 0 0 0 32 32h120"></path>
</svg>
`,
tpi_cc_i_courier_restore = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
    <path d="M12 9l0 3"></path>
    <path d="M12 15l.01 0"></path>
</svg>
`,
tpi_cc_i_courier_delete = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16">
        <path fill="currentColor" d="M5.386 6h1.806l.219 7H5.886zm3.206 7 .218-7h1.814l-.5 7z"></path>
        <path fill="currentColor" fill-rule="evenodd" d="M7.837.014h.303c.71-.001 1.333-.002 1.881.22a3 3 0 0 1 1.257.962c.36.47.522 1.072.707 1.758l.012.046H15v2l-.96.48-.585 5.922c-.177 1.787-.265 2.68-.72 3.326a3 3 0 0 1-.975.883C11.073 16 10.175 16 8.38 16h-.76c-1.795 0-2.693 0-3.38-.39a3 3 0 0 1-.974-.882c-.456-.646-.544-1.54-.72-3.326L1.96 5.48 1 5V3h2.98l.012-.046c.185-.686.347-1.287.706-1.758A3 3 0 0 1 5.955.235C6.503.012 7.126.013 7.837.015M3.922 5l.614 6.205c.092.93.15 1.494.23 1.911.036.194.07.308.095.376.022.06.037.08.04.084.085.12.196.221.324.294a.3.3 0 0 0 .088.031c.07.018.187.04.383.059.423.038.99.04 1.925.04h.758c.935 0 1.502-.002 1.925-.04.196-.018.313-.04.383-.059.062-.016.083-.028.088-.03a1 1 0 0 0 .325-.295c.002-.004.017-.024.039-.084a2.4 2.4 0 0 0 .096-.376c.08-.417.138-.981.23-1.91L12.077 5zm5.766-2.592c.063.084.116.2.232.592H6.057c.115-.393.168-.508.232-.592a1 1 0 0 1 .419-.32c.137-.056.327-.074 1.28-.074s1.144.018 1.28.074a1 1 0 0 1 .42.32" clip-rule="evenodd"></path>
</svg>
`,
tpi_cc_i_warning = `
<svg class="tpi-cc-i-warning" stroke="currentColor" fill="url(#myGradient)" stroke-width="0" version="1.2" baseProfile="tiny" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--no-ds-color-1)" />
            <stop offset="100%" stop-color="var(--no-ds-color-2)" />
        </linearGradient>
    </defs>
    <path d="M12 5.511c.561 0 1.119.354 1.544 1.062l5.912 9.854c.851 1.415.194 2.573-1.456 2.573h-12c-1.65 0-2.307-1.159-1.456-2.573l5.912-9.854c.425-.708.983-1.062 1.544-1.062m0-2c-1.296 0-2.482.74-3.259 2.031l-5.912 9.856c-.786 1.309-.872 2.705-.235 3.83s1.879 1.772 3.406 1.772h12c1.527 0 2.77-.646 3.406-1.771s.551-2.521-.235-3.83l-5.912-9.854c-.777-1.294-1.963-2.034-3.259-2.034z"></path>
    <circle cx="12" cy="16" r="1.3"></circle>
    <path d="M13.5 10c0-.83-.671-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .199.041.389.111.562.554 1.376 1.389 3.438 1.389 3.438l1.391-3.438c.068-.173.109-.363.109-.562z"></path>
</svg>
`,
tpi_cc_i_loading = `
<svg class="tpi-cc-i-loading" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="shape-rendering: auto; background: transparent;">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--no-ds-color-1)"/>
            <stop offset="100%" stop-color="var(--no-ds-color-2)"/>
        </linearGradient>
    </defs>
    <path style="transform:scale(0.8);transform-origin:50px 50px" stroke-linecap="round" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-dasharray="130.8603533935547 125.72857482910155" stroke-width="10" stroke="url(#gradient)" fill="none">
        <animate values="0;256.58892822265625" keyTimes="0;1" dur="0.9523809523809523s" repeatCount="indefinite" attributeName="stroke-dashoffset"/>
    </path>
</svg>
`,
tpi_cc_i_checmark = `
<svg class="tpi_cc_i_checmark" viewBox="0 0 120 120">
    <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--no-ds-color-1)" />
            <stop offset="100%" stop-color="var(--no-ds-color-2)" />
        </linearGradient>
    </defs>
    <circle class="tpi-circle-outline" cx="60" cy="60" r="50" stroke="url(#circleGradient)"/>
    <path class="tpi-checkmark" d="M43,60 L55,75 L78,45" stroke="url(#circleGradient)" fill="none" stroke-width="4"/>
</svg>
`,
tpi_cc_i_circle_error = `
<svg stroke="url(#gradientError)" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="tpi-cc-i-circle_error">
    <defs>
        <linearGradient id="gradientError" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--no-ds-color-1)" />
            <stop offset="100%" stop-color="var(--no-ds-color-2)" />
        </linearGradient>
    </defs>
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    <path d="M18.364 5.636l-12.728 12.728"></path>
</svg>
`,
tpi_cc_i_filter_default = `
<svg class="tpi-filter-icon-default" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.53039 5.46978L5.00006 1.93945L1.46973 5.46978L2.53039 6.53044L4.25006 4.81077V14.0001H5.75006V4.81077L7.46973 6.53044L8.53039 5.46978Z"></path>
    <path d="M11.7501 11.1895L13.4697 9.46978L14.5304 10.5304L11.0001 14.0608L7.46973 10.5304L8.53039 9.46978L10.2501 11.1895V2.00011H11.7501V11.1895Z"></path>
</svg>
`,
tpi_cc_i_filter_up = `
<svg class="tpi-filter-icon-up" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.77 160 16 160zm416 0H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
</svg>
`,
tpi_cc_i_filter_down = `
<svg class="tpi-filter-icon-down" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm-64 0h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352z"></path>
</svg>
`,
tpi_cc_i_search = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="tpi-search-icon">
    <circle class="glass" cx="10.5" cy="10.5" r="7.5" fill="none" stroke="currentcolor" stroke-width="1.5"/>
    <circle class="glassGap" cx="10.5" cy="10.5" r="7.5" fill="none" stroke="currentcolor" stroke-width="1.5"/>
    <path class="handle" d="m16.563 16.458 4.223 5.372-1.572 1.236-4.21-5.356" fill="currentcolor"/>
</svg>
`,
tpi_cc_i_chevron_down = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="fill: transparent;">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
</svg>
`,
tpi_cc_i_calendar = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect>
    <circle cx="296" cy="232" r="24"></circle>
    <circle cx="376" cy="232" r="24"></circle
    <circle cx="296" cy="312" r="24"></circle<circle cx="376" cy="312" r="24"></circle>
    <circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle>
    <circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle>
    <circle cx="296" cy="392" r="24"></circle>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path>
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path>
</svg>
`,
tpi_cc_i_clock = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
</svg>
`,
tpi_cc_i_chevron_right = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
</svg>
`,
tpi_cc_i_chevron_left = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
</svg>
`,
tpi_cc_i_couriersTotal = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
    <path d="M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"></path>
</svg>
`,
tpi_cc_i_couriersFiltered = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
    <path d="M256.1 8a120 120 0 1 1 0 240 120 120 0 1 1 0-240zM226.4 304l59.4 0c6.7 0 13.2 .4 19.7 1.1-.9 4.9-1.4 9.9-1.4 15l0 92.1c0 25.5 10.1 49.9 28.1 67.9l31.9 31.9-286.3 0c-16.4 0-29.7-13.3-29.7-29.7 0-98.5 79.8-178.3 178.3-178.3zM352.1 412.2l0-92.1c0-17.7 14.3-32 32-32l92.1 0c12.7 0 24.9 5.1 33.9 14.1l96 96c18.7 18.7 18.7 49.1 0 67.9l-76.1 76.1c-18.7 18.7-49.1 18.7-67.9 0l-96-96c-9-9-14.1-21.2-14.1-33.9zm104-44.2a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"></path>
</svg>
`,
tpi_cc_i_tag = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 64H257.6L76.5 251.6c-8 8-12.3 18.5-12.5 29-.3 11.3 3.9 22.6 12.5 31.2l123.7 123.6c8 8 20.8 12.5 28.8 12.5s22.8-3.9 31.4-12.5L448 256V96l-32-32zm-30.7 102.7c-21.7 6.1-41.3-10-41.3-30.7 0-17.7 14.3-32 32-32 20.7 0 36.8 19.6 30.7 41.3-2.9 10.3-11.1 18.5-21.4 21.4z"></path>
</svg>
`,
tpi_cc_i_box_outline = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"></path>
</svg>
`,
tpi_cc_i_box_filled = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003zM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461z"></path>
</svg>
`,
tpi_cc_i_pen_outline = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8492 11.6983L17.1421 10.9912L7.24264 20.8907H3V16.648L14.3137 5.33432L19.9706 10.9912C20.3611 11.3817 20.3611 12.0149 19.9706 12.4054L12.8995 19.4765L11.4853 18.0622L17.8492 11.6983ZM15.7279 9.57696L14.3137 8.16274L5 17.4765V18.8907H6.41421L15.7279 9.57696ZM18.5563 2.50589L21.3848 5.33432C21.7753 5.72484 21.7753 6.35801 21.3848 6.74853L19.9706 8.16274L15.7279 3.9201L17.1421 2.50589C17.5327 2.11537 18.1658 2.11537 18.5563 2.50589Z"></path>
</svg>
`,
tpi_cc_i_pen_filled = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8492 11.805L17.1421 11.0979L7.24264 20.9974H3V16.7547L14.3137 5.44101L19.9706 11.0979C20.3611 11.4884 20.3611 12.1216 19.9706 12.5121L12.8995 19.5831L11.4853 18.1689L17.8492 11.805ZM18.5563 2.61258L21.3848 5.44101C21.7753 5.83153 21.7753 6.4647 21.3848 6.85522L19.9706 8.26943L15.7279 4.02679L17.1421 2.61258C17.5327 2.22206 18.1658 2.22206 18.5563 2.61258Z"></path>
</svg>
`,
tpi_cc_liquid_glass = `
<svg style="display: none;">
  <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise"></feTurbulence>
    <feGaussianBlur in="noise" stdDeviation="0.02" result="blur"></feGaussianBlur>
    <feDisplacementMap in="SourceGraphic" in2="blur" scale="50" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
  </filter>
  <filter id="settings-glass" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.005 0.05" numOctaves="5" seed="15" result="noise"></feTurbulence>
    <feGaussianBlur in="noise" stdDeviation="0.02" result="blur"></feGaussianBlur>
    <feDisplacementMap in="SourceGraphic" in2="blur" scale="30" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
  </filter>
  <filter id="circle-glass" primitiveUnits="objectBoundingBox">
    <feImage href="data:image/png;base64,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" x="0" y="0" width="1" height="1" result="map"></feImage>
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur"></feGaussianBlur>
    <feDisplacementMap id="disp" in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G">
      <animate attributeName="scale" to="1.4" dur="0.3s" begin="btn.mouseover" fill="freeze"></animate>
      <animate attributeName="scale" to="1" dur="0.3s" begin="btn.mouseout" fill="freeze"></animate>
    </feDisplacementMap>
  </filter>
</svg>
`,
tpi_cc_i_boxes = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16"  xmlns="http://www.w3.org/2000/svg">
    <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"></path>
</svg>
`,
tpi_cc_i_truck = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="fill: none;">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
</svg>
`,
tpi_cc_i_circle_checmark = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
</svg>
`,
tpi_cc_i_circle_xmark = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"></path>
</svg>
`,
tpi_cc_i_clock_loader = `
<svg fill="#585858" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="tpi-cc-print-all-icon-loading">
    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"></path>
    <rect x="11" y="6" rx="1" width="2" height="7">
        <animateTransform attributeName="transform" type="rotate" dur="9s" values="0 12 12;360 12 12" repeatCount="indefinite"></animateTransform>
    </rect>
    <rect x="11" y="11" rx="1" width="2" height="9">
        <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"></animateTransform>
    </rect>
</svg>
`,
tpi_cc_i_print_all = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="tpi-cc-print-all-icon-static">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"></path><path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path>
</svg>
`,
tpi_cc_i_print_row = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" class="tpi-cc-print-all-icon-static">
    <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
</svg>
`,
tpi_cc_i_print_current_row = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="tpi-cc-print-current-row-icon-static">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"></path><path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path>
</svg>
`,
tpi_cc_i_circle_1 = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM140,80v96a8,8,0,0,1-16,0V95l-11.56,7.71a8,8,0,1,1-8.88-13.32l24-16A8,8,0,0,1,140,80Z"></path>
</svg>
`,
tpi_cc_i_circle_2 = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
    <path d="M153.56,123.26,120,168h32a8,8,0,0,1,0,16H104a8,8,0,0,1-6.4-12.8l43.17-57.56a16,16,0,1,0-27.86-15,8,8,0,0,1-15.09-5.34,32,32,0,1,1,55.74,29.93ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
</svg>
`,
tpi_cc_i_circle_3 = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
    <path d="M160,152a36,36,0,0,1-61.71,25.19A8,8,0,1,1,109.71,166,20,20,0,1,0,124,132a8,8,0,0,1-6.55-12.59L136.63,92H104a8,8,0,0,1,0-16h48a8,8,0,0,1,6.55,12.59l-21,30A36.07,36.07,0,0,1,160,152Zm72-24A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
</svg>
`,
tpi_cc_i_circle_4 = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm32-72h-8V80a8,8,0,0,0-14.31-4.91l-56,72A8,8,0,0,0,88,160h48v16a8,8,0,0,0,16,0V160h8a8,8,0,0,0,0-16Zm-24,0H104.36L136,103.32Z"></path>
</svg>
`,
tpi_cc_i_blocked_button = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M24,6C14.1,6,6,14.1,6,24s8.1,18,18,18s18-8.1,18-18S33.9,6,24,6z M24,10c3.1,0,6,1.1,8.4,2.8L12.8,32.4 C11.1,30,10,27.1,10,24C10,16.3,16.3,10,24,10z M24,38c-3.1,0-6-1.1-8.4-2.8l19.6-19.6C36.9,18,38,20.9,38,24C38,31.7,31.7,38,24,38 z"></path>
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
        <div class="tpi-tooltip-by-sheva_r6"></div>
        <div class="tpi-cc--wrapper-title">
            Управление MK
        </div>
        <div class="tpi-cc-graph-panel">
            <div class="tpi-cc-graph-wrapper">
                <div class="tpi-cc-graph-wrapper-title">
                    <p>График отгруженных заказов</p>
                </div>
                <div class="tpi-cc-graph-items-wrapper">
                    <div class="tpi-cc-graph-container"></div>
                    <div class="tpi-cc-graph-loader" style="display: none;">
                        <div class="tpi-cc-graph-loader-spinner"></div>
                        <p>Загрузка данных для графика...</p>
                    </div>
                    <div class="tpi-cc-graph-item-devider"></div>
                    <div class="tpi-cc-graph-item">
                        <ul class="tpi-cc-graph-total-list">
                            <li class="tpi-cc-graph-total-item">
                                <i class="tpi-cc-graph-total-item-icon">${tpi_cc_i_boxes}</i>
                                <p class="tpi-cc-graph-total-item-title">Всего заказов:</p>
                                <p class="tpi-cc-graph-total-item-value" id="tpi-cc-total-orderes">0</p>
                            </li>
                            <li class="tpi-cc-graph-total-item">
                                <i class="tpi-cc-graph-total-item-icon">${tpi_cc_i_truck}</i>
                                <p class="tpi-cc-graph-total-item-title">Отгружено:</p>
                                <p class="tpi-cc-graph-total-item-value" id="tpi-cc-total-orderes-shipped">0</p>
                            </li>
                            <li class="tpi-cc-graph-total-item">
                                <i class="tpi-cc-graph-total-item-icon" style="padding: 1px;">${tpi_cc_i_circle_checmark}</i>
                                <p class="tpi-cc-graph-total-item-title">Принято:</p>
                                <p class="tpi-cc-graph-total-item-value" id="tpi-cc-total-orderes-accepted">0</p>
                            </li>
                            <li class="tpi-cc-graph-total-item">
                                <i class="tpi-cc-graph-total-item-icon" style="padding: 1px;">${tpi_cc_i_circle_xmark}</i>
                                <p class="tpi-cc-graph-total-item-title">Не отгружено:</p>
                                <p class="tpi-cc-graph-total-item-value" id="tpi-cc-total-orderes-missed">0</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="tpi-cc-filters-panel">
            <div class="tpi-cc-filters-wrapper">
                <div class="tpi-cc-filters-wrapper-title">
                    <p>Фильтры</p>
                    <div class="tpi-cc-filters-item">
                        <button class="tpi-cc-filters-reset" tpi-tooltip-data="Кнопка для сброса всех фильтров в таблице">Сбросить фильтры</button>
                    </div>
                </div>
                <div class="tpi-cc-filters-items-wrapper">
                    <div class="tpi-cc-filters-item">
                        <button class="tpi-cc-search-date" tpi-tooltip-data="Календарь для выбора даты отгрузки">
                            <div class="tpi-cc-search-icon">${tpi_cc_i_calendar}</div>
                            <div class="tpi-cc-search-label-title" id="tpi-cc-seleceted-date">Дата</div>
                        </button>
                    </div>
                    <div class="tpi-cc-filters-item" tpi-tooltip-data="Поиск курьера по его ФИО">
                        <label for="tpi-cc-search-courier-name" class="tpi-cc-search-label">
                            <div class="tpi-cc-search-icon">${tpi_cc_i_search}</div>
                            <div class="tpi-cc-search-label-title">ФИО курьера</div>
                            <input type="text" id="tpi-cc-search-courier-name" placeholder="Введите ФИО курьера" autocomplete="off">
                        </label>
                    </div>
                    <div class="tpi-cc-filters-item" tpi-tooltip-data="Поиск курьера по его ячейке">
                        <label for="tpi-cc-search-courier-cell" class="tpi-cc-search-label">
                            <div class="tpi-cc-search-icon">${tpi_cc_i_search}</div>
                            <div class="tpi-cc-search-label-title">Имя ячейки</div>
                            <input type="text" id="tpi-cc-search-courier-cell" placeholder="Введите имя ячейки" autocomplete="off">
                        </label>
                    </div>
                    <div class="tpi-cc-filters-item">
                        <label for="tpi-cc-search-courier-status" class="tpi-cc-search-label tpi-cc-search-dropdown" tpi-tooltip-data="Поиск курьера по статусу его маршрута">
                            <div class="tpi-cc-search-label-title">Статус курьера</div>
                            <input type="text" id="tpi-cc-search-courier-status" placeholder="Выберите статус курьера" autocomplete="off" value="Выбраны все">
                            <div class="tpi-cc-search-icon">${tpi_cc_i_chevron_down}</div>
                        </label>
                    </div>
                    <div class="tpi-cc-data-item">
                        <div class="tpi-cc-data-item-container" tpi-tooltip-data="Всего курьеров к отгрузке">
                            <i class="tpi-cc-data-item-icon">${tpi_cc_i_couriersTotal}</i>
                            <p class="tpi-cc-data-item-title" id="tpi-cc-data-total-couriers">Всего: <span>0</span></p>
                        </div>
                        <div class="tpi-cc-data-item-container" tpi-tooltip-data="Всего курьеров с учётом фильтров">
                            <i class="tpi-cc-data-item-icon">${tpi_cc_i_couriersFiltered}</i>
                            <p class="tpi-cc-data-item-title" id="tpi-cc-data-filtered-couriers">Фильтр: <span>0</span></p>
                        </div>
                    </div>
                    <div class="tpi-cc-print-items-wrapper">
                        <div class="tpi-cc-print-row" tpi-tooltip-data="Кнопки для выбора всех CART или PALLET у курьеров в ряду выбранной кнопки">
                            <p class="tpi-cc-print-row-title">
                                <span class="tpi-cc-print-row-title-span">В</span>
                                <span class="tpi-cc-print-row-title-span">ы</span>
                                <span class="tpi-cc-print-row-title-span">б</span>
                                <span class="tpi-cc-print-row-title-span">р</span>
                                <span class="tpi-cc-print-row-title-span">а</span>
                                <span class="tpi-cc-print-row-title-span">т</span>
                                <span class="tpi-cc-print-row-title-span">ь</span>
                                <span class="tpi-cc-print-row-title-span">р</span>
                                <span class="tpi-cc-print-row-title-span">я</span>
                                <span class="tpi-cc-print-row-title-span">д</span>
                            </p>
                            <i class="tpi-cc-print-row-icon">${tpi_cc_i_print_row}${tpi_cc_i_clock_loader}</i>
                            <div class="tpi-cc-print-row-data">
                                <button class="tpi-print-row-button" tpi-cc-printing-row-index="1">${tpi_cc_i_circle_1}</button>
                                <button class="tpi-print-row-button" tpi-cc-printing-row-index="2">${tpi_cc_i_circle_2}</button>
                                <button class="tpi-print-row-button" tpi-cc-printing-row-index="3">${tpi_cc_i_circle_3}</button>
                                <button class="tpi-print-row-button" tpi-cc-printing-row-index="4">${tpi_cc_i_circle_4}</button>
                            </div>
                        </div>
                        <button class="tpi-cc-print-all" tpi-cc-printing-state="static" tpi-tooltip-data="Кнопка для печати всех CART или PALLET">
                            <div class="tpi-cc-print-all-progress-bar"></div>
                            <p class="tpi-cc-print-all-text">Распечатать все</p>
                            <i class="tpi-cc-print-all-icon">${tpi_cc_i_print_all}${tpi_cc_i_clock_loader}</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="tpi-cc--no-ds-data-wrapper">
            <div class="tpi-cc--no-ds-data-container" tpi-current-state="ready-to-data-search">
                <div class="tpi-cc--no-ds-data-block">
                    <div class="tpi-cc--no-ds-data-title">
                        <p>Данных нет</p>
                    </div>
                </div>
                <div class="tpi-cc--no-ds-data-block">
                    <div class="tpi-cc--no-ds-data-icon-wrapper">
                        <i>${tpi_cc_i_warning}${tpi_cc_i_loading}${tpi_cc_i_checmark}${tpi_cc_i_circle_error}</i>
                    </div>
                    <div class="tpi-cc--no-ds-data-info-wrapper">
                        <div class="tpi-cc--no-ds-data-description">
                            <p class="tpi-cc--no-ds-data-description-block">В базе данных нет записей о текущей дате отгрузки, для записи данных нажмите кнопку ниже</p>
                            <p class="tpi-cc--no-ds-data-description-block-sub">Внимание! Нажав на кнопку вы перезапишите текущую отгрузку и вся несохраненная или поврежденная информация будет утеряна, коридор для записи новых данных - с 23:00:00 по 23:00:00 следующего дня</p>
                        </div>
                    </div>
                </div>  
                <div class="tpi-cc--no-ds-data-block">
                    <button class="tpi-cc--no-ds-data-start">Начать</button>
                </div>  
            </div>
        </div>
        <div class="tpi-cc--no-data-loading-wrapper">
            <div class="tpi-cc--no-data-loader-item">
                <span class="tpi-cc--no-data-loader-spinner"></span>
            </div>
            <div class="tpi-cc--no-data-loader-funny-text-wrapper">
                <p class="tpi-cc--no-data-loader-funny-text" id="tpi-cc-funny-text-left"></p>
                <p class="tpi-cc--no-data-loader-funny-text" id="tpi-cc-funny-text-right"></p>
            </div>
        </div>
        <div class="tpi-cc--table-wrapper">
            <table class="tpi-cc--table-data-output">
                <thead class="tpi-cc--table-thead-wrapper">
                    <tr class="tpi-cc--table-thead">
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Данные курьера</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Ячейка</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item" tpi-cc-filters-not-allowed>
                            <div class="tpi-cc--table-thead-data">
                                <p>Номер CART</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item" tpi-cc-filters-not-allowed>
                            <div class="tpi-cc--table-thead-data">
                                <p>Номер PALLET</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Cтатус</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Прогресс сортировки</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Прогресс подготовки</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Начало<br>сортировки</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Конец<br>сортировки</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item">
                            <div class="tpi-cc--table-thead-data">
                                <p>Прибытие<br>курьера</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                        <th class="tpi-cc--table-thead-item" tpi-cc-filters-not-allowed>
                            <div class="tpi-cc--table-thead-data">
                                <p>Печать и<br>Документы</p>
                                <i class="tpi-cc--table-thead-filter" tpi-tooltip-data="Отфильтровать по данному столбцу">
                                    ${tpi_cc_i_filter_default}
                                    ${tpi_cc_i_filter_up}
                                    ${tpi_cc_i_filter_down}
                                </i>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="tpi-cc--table-tbody-wrapper"></tbody>
            </table>
        </div>
        <div class="tpi-cc-process-manager-wrapper" tpi-current-state="hidden">
            <div class="tpi-cc-process-manager-block">
                <div class="tpi-cc-process-manager-data-wrapper">
                    <div class="tpi-cc-process-manager-title">
                        <p>Выбранно:</p>
                    </div>
                    <div class="tpi-cc-process-data-container">
                        <div class="tpi-cc-process-data-item">
                            <i class="tpi-cc-process-data-item-icon">${tpi_cc_i_cart}</i>
                            <p class="tpi-cc-process-data-item-text tpi-cc-data-cart-amount">CART: <span>${'0'}</span></p>
                        </div>
                        <div class="tpi-cc-process-data-item">
                            <i class="tpi-cc-process-data-item-icon">${tpi_cc_i_pallet}</i>
                            <p class="tpi-cc-process-data-item-text tpi-cc-data-pallet-amount">PALLET: <span>${'0'}</span></p>
                        </div>
                    </div>
                </div>
                <button class="tpi-cc-process-manager-button" tpi-cc-action="print" tpi-cc-printing-state="static" tpi-tooltip-data="Кнопка для печати всех выбранных CART и PALLET">
                    <div class="tpi-cc-print-selected-progress-bar"></div>
                    <p class="tpi-cc-process-manager-text">Печать</p>
                    <span>Печать</span>
                    <i class="tpi-cc-progress-action-icon">${tpi_cc_i_print_all}${tpi_cc_i_clock_loader}</i>
                </button>
                <button class="tpi-cc-process-manager-button" tpi-cc-action="delete" tpi-tooltip-data="Кнопка для удаления всех выбранных CART и PALLET">
                    <p class="tpi-cc-process-manager-text">Удалить</p>
                    <i class="tpi-cc-progress-action-icon">${tpi_cc_i_courier_delete}</i>
                </button>
                <button class="tpi-cc-process-manager-close" tpi-tooltip-data="Отменить выделение">${tpi_cc_i_cancel}</button>
            </div>
        </div>
        <div class="tpi-cc-modal-window-wrapper">
            <div class="tpi-cc-modal-window-container">
                <div class="tpi-cc-modal-window-title">
                    <p class="tpi-cc-modal-window-title-text">Сброс данных курьера</p>
                    <button class="tpi-cc-modal-window-close">${tpi_cc_i_cancel}</button>
                </div>
                <div class="tpi-cc-modal-window-courier-data-wrapper">
                <div class="tpi-cc-modal-window-courier-data-container">
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">Курьер:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-name">Лунев Никита Сергеевич</p>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">Ячейка:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-cell">MK-103</p>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">Маршрут:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-route">1095024829</p>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">ID Курьера:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-id">1286447028</p>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">Статус:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-status">В работе</p>
                        </div>
                    </div>
                <div class="tpi-cc-modal-window-courier-data-container">
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">Отсортировано:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-sorted">107 / 231</p>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">Подготовлено:</p>
                            <p class="tpi-cc-modal-window-courier-data-item-text" tpi-data-anchor="courier-prepared">4 / 231</p>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">CART:</p>
                            <div class="tpi-cc-modal-window-courier-data-item-cart-wrapper" tpi-data-anchor="courier-carts">
                                <div class="tpi-cc-modal-window-courier-data-item-cart">
                                    <i class="tpi-cc-modal-window-courier-data-item-cart-icon">${tpi_cc_i_cart}</i>
                                    <p>-1031</p>
                                </div>
                                <div class="tpi-cc-modal-window-courier-data-item-cart">
                                    <i class="tpi-cc-modal-window-courier-data-item-cart-icon">${tpi_cc_i_cart}</i>
                                    <p>-1032</p>
                                </div>
                                <div class="tpi-cc-modal-window-courier-data-item-cart">
                                    <i class="tpi-cc-modal-window-courier-data-item-cart-icon">${tpi_cc_i_cart}</i>
                                    <p>-1033</p>
                                </div>
                                <div class="tpi-cc-modal-window-courier-data-item-cart">
                                    <i class="tpi-cc-modal-window-courier-data-item-cart-icon">${tpi_cc_i_cart}</i>
                                    <p>-1034</p>
                                </div>
                            </div>
                        </div>
                        <div class="tpi-cc-modal-window-courier-data-item">
                            <p class="tpi-cc-modal-window-courier-data-item-title">PALLET:</p>
                            <div class="tpi-cc-modal-window-courier-data-item-pallet-wrapper" tpi-data-anchor="courier-pallets">
                                <div class="tpi-cc-modal-window-courier-data-item-pallet">
                                    <i class="tpi-cc-modal-window-courier-data-item-pallet-icon">${tpi_cc_i_pallet}</i>
                                    <p>-103</p>
                                </div>
                                <div class="tpi-cc-modal-window-courier-data-item-pallet">
                                    <i class="tpi-cc-modal-window-courier-data-item-pallet-icon">${tpi_cc_i_pallet}</i>
                                    <p>-303</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tpi-cc-modal-window-accept-wrapper">
                    <button class="tpi-cc-modal-window-accept">
                        <i class="tpi-cc-modal-window-accept-icon">${tpi_cc_i_courier_restore}</i>
                        <p class="tpi-cc-modal-window-accept-title">Сбросить</p>
                    </button>
                </div>
                <i class="tpi-cc-modal-wolf-img"></i>
                <i class="tpi-cc-modal-wolf-img"></i>
            </div>
        </div>
        ${tpi_cc_liquid_glass}
        `
        
        const appID = document.getElementById("app")
        const headerTitle = document.querySelector(".p-layout__header-wrapper")
        appID.remove()
        headerTitle.remove()

        document.querySelector(".p-layout__content").appendChild(overlay);
        setTimeout(() => {
            initializeLoaderTexts();
        }, 100);

        const tpi_cc_closeManager = document.querySelector('.tpi-cc-process-manager-close')
        tpi_cc_closeManager.addEventListener('click', ()=>{
            if(document.querySelectorAll('button.tpi-cc--table-tbody-data-button[tpi-cc-selected-courier-cell]')){
                const evrySelectedButton = document.querySelectorAll('button.tpi-cc--table-tbody-data-button[tpi-cc-selected-courier-cell]')
                evrySelectedButton.forEach(btn =>{
                    btn.removeAttribute('tpi-cc-selected-courier-cell')
                })
                update_ActionProcessContainer()
            }else return
        })
        
        // Инициализируем Firebase ТОЛЬКО сейчас
        tpiInitializeFirebase();
        
        // Сразу скрываем все UI элементы
        hideAllUI();

        // Показываем лоадер перед первой проверкой данных
        const loadingWrapper = document.querySelector('.tpi-cc--no-data-loading-wrapper');
        if (loadingWrapper) {
            loadingWrapper.style.display = 'flex';
        }

        // Предзагружаем данные календаря
        setTimeout(() => {
            preloadCalendarData();
        }, 500);

        // Запускаем проверку данных для текущей даты
        setTimeout(async () => {
            await tpiCheckAndLoadData();
        }, 1000);

        callTurboPI__once();
        addTurboPiTitle()
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        
        // Инициализируем график
        initializeChartOnce();
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

//A-

// Функция проверки и загрузки данных
async function tpiCheckAndLoadData() {
    try {
        const searchDateButton = document.querySelector('.tpi-cc-search-date');
        if (!searchDateButton) return;
        
        // Получаем выбранную дату
        const selectedDate = searchDateButton.getAttribute('tpi-cc-selected-date-value');
        if (!selectedDate) return;
        
        console.log('🔍 TPI Проверка данных для даты:', selectedDate);
        
        // ВСЕГДА показываем лоадер перед проверкой
        hideAllUI();
        
        // Показываем лоадер
        const loadingWrapper = document.querySelector('.tpi-cc--no-data-loading-wrapper');
        if (loadingWrapper) {
            loadingWrapper.style.display = 'flex';
        }
        
        // Очищаем таблицу
        const tpi_cc_tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
        if (tpi_cc_tableBody) {
            tpi_cc_tableBody.innerHTML = '';
        }
        
        // Сбрасываем обработчики и данные
        tpi_cc_originalRowOrder = [];
        tpi_cc_currentFilterColumn = null;
        tpi_cc_currentFilterDirection = null;
        
        // Проверяем наличие данных в Firebase
        const firebaseData = await tpiCheckDataInFirebase(selectedDate);
        // const summaryData = await tpi_getRoutesSummary(selectedDate);
        // Скрываем лоадер после проверки
        if (loadingWrapper) {
            loadingWrapper.style.display = 'none';
        }
        
        if (firebaseData.exists) {
            // Данные есть в Firebase - загружаем их
            console.log('✅ TPI Данные найдены в Firebase, загружаем...');
            
            // Еще раз показываем лоадер на время загрузки данных
            if (loadingWrapper) {
                loadingWrapper.style.display = 'flex';
            }
            
            // Загружаем данные
            await tpiLoadAndDisplayData(selectedDate);
            
            // Скрываем лоадер после загрузки
            if (loadingWrapper) {
                loadingWrapper.style.display = 'none';
            }
        } else {
            // Данных нет в Firebase - показываем плашку "нет данных"
            console.log('📭 TPI Данных нет в Firebase, показываем плашку');
            
            // Определяем правильный статус для отображения
            const now = new Date();
            const currentHour = now.getHours();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const dateParts = selectedDate.split('/');
            const checkDate = new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
            );
            checkDate.setHours(0, 0, 0, 0);
            
            const timeDiff = checkDate.getTime() - today.getTime();
            const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            let showNoData = true;
            let canWrite = false;
            
            if (diffDays === 0) {
                // Сегодня - всегда можно записывать
                canWrite = true;
                if (window.tpiCalendarDatesCache) {
                    window.tpiCalendarDatesCache[selectedDate] = 'available-to-write-bd-data';
                }
            }   else if (diffDays === 1 && currentHour >= 23) {
                // Завтра после 23:00 - можно записывать
                canWrite = true;
                if (window.tpiCalendarDatesCache) {
                    window.tpiCalendarDatesCache[selectedDate] = 'available-to-write-bd-data';
                }
            } else {
                if (window.tpiCalendarDatesCache) {
                    window.tpiCalendarDatesCache[selectedDate] = 'no-bd-data';
                }
            }
            
            showNoDataScreen(showNoData, selectedDate, canWrite);
        }
        
    } catch (error) {
        console.log('💥 TPI Ошибка при проверке данных:', error);
        const loadingWrapper = document.querySelector('.tpi-cc--no-data-loading-wrapper');
        if (loadingWrapper) {
            loadingWrapper.style.display = 'none';
        }
        showNoDataScreen(true);
    }
}

const tpi_cc_funny_text_array = [
    'Что-то загружаем',
    'Ильяшенко - черт ;)',
    'Продам гараж',
    'Дима устал придумывать текст',
    'Делаем всё сразом',
    'Обращаемся к коленям',
    'Ищем 47 шк на заказе',
    'Вырубаем свет на СЦ',
    'Делаем так, чтобы ЛХ опоздали',
    'Сканируем каждый шк на заказе',
    'Подметаем заказы в мусорку',
    'Находим второй шк',
    'Ждём пока Матыцин уедет с СЦ',
    'Отгружаем все с баланса СЦ',
    'Чанган - лучшая машина в мире',
    'Депортируем Иззата домой',
    'Несем брак к столу',
    'Брат два щека',
    'Mitsubishi Lancer X',
    'Коллеги, я устал',
    'До самоуничтожения - 3 секунды',
    'Брат дай чуаркод по братски',
    'Коллеги, трахнем по чайку ?',
    'Утеря – Михаил Санин',
    'Включаем дуйчики на двойку',
    'Стрижём Ильяшенко',
    'Идём на четвертый склад',
    'Забираем у Валеры чайник',
    'Играем в муравьёв',
    'QR код возле ворот, на улице',
    'Ищем на СЦ, вернёмся с ОС',
    'Кидаем аномалии в хранение',
    'Покупаем новые джогеры',
    'Ищем третьего за стол',
    'Переупаковал 5 заказов - устал',
    'Делаем жёсткий ППС',
    'Делаем ППС по братски',
    'Олени не прошли в плановую ТС',
    'iPhone - говно',
    'Высматриваем шкоду по камерам',
    '5 градусов жары',
    'Прячем колонку от Ильяшенко',
    'Не пикаца брат',
    'Еврики- это наш чай с сахаром'
];

// Функция для управления лоадером
function showTableLoader(show) {
    const loadingWrapper = document.querySelector('.tpi-cc--no-data-loading-wrapper');
    const noDataWrapper = document.querySelector('.tpi-cc--no-ds-data-wrapper');
    const tableWrapper = document.querySelector('.tpi-cc--table-wrapper');
    
    if (loadingWrapper) {
        if (show) {
            // Обновляем тексты только если они еще не установлены или прошло достаточно времени
            const funnyTexts = getRandomFunnyTexts();
            const leftTextElement = document.getElementById('tpi-cc-funny-text-left');
            const rightTextElement = document.getElementById('tpi-cc-funny-text-right');
            
            if (leftTextElement) leftTextElement.textContent = funnyTexts.left;
            if (rightTextElement) rightTextElement.textContent = funnyTexts.right;
            
            loadingWrapper.style.display = 'flex';
        } else {
            loadingWrapper.style.display = 'none';
            
            const funnyTexts = getRandomFunnyTexts();
            const leftTextElement = document.getElementById('tpi-cc-funny-text-left');
            const rightTextElement = document.getElementById('tpi-cc-funny-text-right');
        }
    }
    
    if (noDataWrapper) {
        noDataWrapper.style.display = 'none';
    }
    
    if (tableWrapper) {
        tableWrapper.style.display = 'none';
    }
}

// Функция для генерации DEFAULT_COURIER номеров
function generateDefaultCourierNumbers(courierData, index, palletNumbersByDefault) {
    const numbers = {
        cartNumbers: [],
        palletNumbers: []
    };
    
    // Извлекаем индекс из ячейки (например, из "DEFAULT_COURIER (15)" или "DEFAULT_COURIER (15)")
    let defaultIndex = 0;
    if (courierData.cell) {
        // Ищем число в скобках
        const match = courierData.cell.match(/\((\d+)\)/);
        if (match) {
            defaultIndex = parseInt(match[1]);
        }
    }
    
    // Если индекс не найден, используем 1 как запасной вариант
    if (defaultIndex === 0) {
        defaultIndex = 1;
        console.warn(`⚠️ Не удалось определить индекс для DEFAULT_COURIER, используем 1`);
    }
    
    // Инициализируем хранилище для DEFAULT_COURIER, если его нет
    if (!window.tpiDefaultCourierNumbers) {
        window.tpiDefaultCourierNumbers = {
            cart: new Set(),
            pallet: new Set()
        };
    }
    
    // Генерируем CART номера (4 штуки: 60(индекс)1, 60(индекс)2, 60(индекс)3, 60(индекс)4)
    for (let i = 1; i <= 4; i++) {
        const cartNumber = 600 + (defaultIndex * 10) + i;
        // Проверяем, не занят ли номер
        if (!window.tpiDefaultCourierNumbers.cart.has(cartNumber)) {
            numbers.cartNumbers.push(`CART-${cartNumber}`);
            window.tpiDefaultCourierNumbers.cart.add(cartNumber);
        } else {
            // Если номер занят, ищем следующий свободный
            let nextNumber = cartNumber + 1;
            while (window.tpiDefaultCourierNumbers.cart.has(nextNumber) && nextNumber < 700) {
                nextNumber++;
            }
            if (nextNumber < 700) {
                numbers.cartNumbers.push(`CART-${nextNumber}`);
                window.tpiDefaultCourierNumbers.cart.add(nextNumber);
            }
        }
    }
    
    // Генерируем PALLET номера (2 штуки: 60(индекс)1, 60(индекс)2)
    for (let i = 1; i <= 2; i++) {
        const palletNumber = 600 + (defaultIndex * 10) + i;
        // Проверяем, не занят ли номер
        if (!window.tpiDefaultCourierNumbers.pallet.has(palletNumber)) {
            numbers.palletNumbers.push(`PALLET-${palletNumber}`);
            window.tpiDefaultCourierNumbers.pallet.add(palletNumber);
        } else {
            // Если номер занят, ищем следующий свободный
            let nextNumber = palletNumber + 1;
            while (window.tpiDefaultCourierNumbers.pallet.has(nextNumber) && nextNumber < 700) {
                nextNumber++;
            }
            if (nextNumber < 700) {
                numbers.palletNumbers.push(`PALLET-${nextNumber}`);
                window.tpiDefaultCourierNumbers.pallet.add(nextNumber);
            }
        }
    }
    
    return numbers;
}

// Добавьте эту функцию где-нибудь среди других функций (можно после функции showCalendarPreloader):
function getRandomFunnyTexts() {
    if (!tpi_cc_funny_text_array || tpi_cc_funny_text_array.length < 2) {
        return { left: 'Загрузка...', right: 'Пожалуйста, подождите' };
    }
    
    const now = Date.now();
    const timeSinceLastShow = now - tpi_cc_lastLoaderShowTime;
    
    // Если прошло меньше 2 секунд с последнего показа, не меняем тексты
    if (tpi_cc_lastLoaderShowTime > 0 && timeSinceLastShow < tpi_cc_minLoaderTextChangeInterval) {
        // Возвращаем текущие тексты (если они есть) или генерируем новые если это первый раз
        const leftTextElement = document.getElementById('tpi-cc-funny-text-left');
        const rightTextElement = document.getElementById('tpi-cc-funny-text-right');
        
        if (leftTextElement && rightTextElement && 
            leftTextElement.textContent && rightTextElement.textContent) {
            return { 
                left: leftTextElement.textContent, 
                right: rightTextElement.textContent 
            };
        }
    }
    
    // Создаем копию массива, чтобы не изменять оригинал
    const texts = [...tpi_cc_funny_text_array];
    
    // Получаем случайный индекс для левого текста
    const leftIndex = Math.floor(Math.random() * texts.length);
    const leftText = texts[leftIndex];
    
    // Удаляем выбранный текст из массива, чтобы правый был другим
    texts.splice(leftIndex, 1);
    
    // Получаем случайный индекс для правого текста из оставшихся
    const rightIndex = Math.floor(Math.random() * texts.length);
    const rightText = texts[rightIndex];
    
    // Обновляем время последнего показа
    tpi_cc_lastLoaderShowTime = now;
    
    return { left: leftText, right: rightText };
}

function initializeLoaderTexts() {
    const leftTextElement = document.getElementById('tpi-cc-funny-text-left');
    const rightTextElement = document.getElementById('tpi-cc-funny-text-right');
    
    if (leftTextElement && rightTextElement) {
        // Генерируем начальные тексты
        const funnyTexts = getRandomFunnyTexts();
        leftTextElement.textContent = funnyTexts.left;
        rightTextElement.textContent = funnyTexts.right;
        
        // Сбрасываем время показа, так как это инициализация при загрузке
        tpi_cc_lastLoaderShowTime = Date.now();
    }
}

// Функция для показа плашки "нет данных"
function showNoDataScreen(show, selectedDate = null, canWrite = false) {
    const noDataWrapper = document.querySelector('.tpi-cc--no-ds-data-wrapper');
    const loadingWrapper = document.querySelector('.tpi-cc--no-data-loading-wrapper');
    const tableWrapper = document.querySelector('.tpi-cc--table-wrapper');
    const noDataContainer = noDataWrapper.querySelector('.tpi-cc--no-ds-data-container');
    
    // Сначала скрываем всё
    if (noDataWrapper) noDataWrapper.style.display = 'none';
    if (loadingWrapper) loadingWrapper.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'none';
    
    if (show) {
        // Показываем только плашку "нет данных"
        if (noDataWrapper) {
            noDataWrapper.style.display = 'flex';
            
            // Обновляем текст в зависимости от статуса
            const titleElement = noDataWrapper.querySelector('.tpi-cc--no-ds-data-title p');
            const descriptionBlock = noDataWrapper.querySelector('.tpi-cc--no-ds-data-description');
            const startButton = noDataWrapper.querySelector('.tpi-cc--no-ds-data-start');
            
            if (titleElement) {
                titleElement.textContent = canWrite ? 'Доступно для записи' : 'Данных нет';
            }
            
            noDataContainer.setAttribute('tpi-current-state', 'ready-to-data-search')

            if (descriptionBlock && selectedDate) {
                if (canWrite) {
                    descriptionBlock.innerHTML = `
                        <p class="tpi-cc--no-ds-data-description-block">Дата ${selectedDate} доступна для записи данных, для создания новой отгрузки нажмите кнопку ниже</p>
                        <p class="tpi-cc--no-ds-data-description-block-sub">Внимание! Нажав на кнопку вы перезапишите текущую отгрузку и вся несохраненная или поврежденная информация будет утеряна</p>
                    `;
                } else {
                    descriptionBlock.innerHTML = `
                        <p class="tpi-cc--no-ds-data-description-block">В базе данных нет записей о дате отгрузки ${selectedDate}</p>
                        <p class="tpi-cc--no-ds-data-description-block-sub">Коридор для записи новых данных - с 23:00:00 по 23:00:00 следующего дня</p>
                    `;
                }
            }
            
            // Настраиваем кнопку
            if (startButton) {
                if (canWrite) {
                    startButton.textContent = 'Создать отгрузку';
                    startButton.disabled = false;
                    startButton.style.display = 'block';
                } else {
                    startButton.textContent = 'Недоступно';
                    startButton.disabled = true;
                    startButton.style.display = 'block';
                }
                
                // Клонируем кнопку для удаления старых обработчиков
                const newStartButton = startButton.cloneNode(true);
                startButton.parentNode.replaceChild(newStartButton, startButton);
                
                if (canWrite) {
                    // Добавляем новый обработчик только если можно записывать
                    newStartButton.addEventListener('click', async () => {
                        if(window.dataCapturingFlag === false){
                            document.querySelector('.tpi-cc--no-ds-data-title p').innerHTML = "<p>Загрузка</p>";
                            window.dataCapturingFlag = true;
                            const noDataContainer = document.querySelector('.tpi-cc--no-ds-data-container');
                            if (noDataContainer) {
                                noDataContainer.setAttribute('tpi-current-state', 'loading-data');
                            }
                            
                            // Заменяем текст на элементы загрузки
                            const descriptionBlock = document.querySelector('.tpi-cc--no-ds-data-description');
                            if (descriptionBlock) {
                                descriptionBlock.innerHTML = `
                                    <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="0" tpi-cc-status="waiting">
                                        <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                                        <p>Проверка ключа</p>
                                    </div>
                                    <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="1" tpi-cc-status="waiting">
                                        <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                                        <p>Поиск маршрутов</p>
                                    </div>
                                    <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="2" tpi-cc-status="waiting">
                                        <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                                        <p>Расшифровка данных курьеров</p>
                                    </div>
                                    <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="3" tpi-cc-status="waiting">
                                        <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                                        <p>Запись информации в базу данных</p>
                                    </div>
                                    <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="4" tpi-cc-status="waiting">
                                        <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                                        <p>Построение и внедрение таблицы в DOM</p>
                                    </div>
                                `;
                            }
                            
                            await fillCouriersTableAndSaveToFirebase();
                        } else return;
                    });
                }
            }
        }
    }
}

// Функция загрузки и отображения данных
async function tpiLoadAndDisplayData(selectedDate) {
    try {
        // Показываем лоадер перед загрузкой данных
        showTableLoader(true);
        
        const couriersData = await tpiLoadDataFromFirebase(selectedDate);
        
        if (!couriersData || couriersData.length === 0) {
            showNoDataScreen(true, selectedDate);
            return;
        }
        
        // Сортируем данные по группам в правильном порядке
        const sortedCouriersData = sortCouriersByGroupsForDisplay(couriersData);
        
        // Сбрасываем состояние сортировки перед заполнением новой таблицы
        resetTableSortState();
        
        // Заполняем таблицу данными
        const tpi_cc_tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
        if (tpi_cc_tableBody) {
            tpi_cc_tableBody.innerHTML = '';
            
            // Создаем строки для каждого курьера в правильном порядке
            sortedCouriersData.forEach((courierData, index) => {
                // Проверяем, является ли курьер КГТ или DEFAULT_COURIER
                if (courierData.cell && courierData.cell.toUpperCase().startsWith('KGT')) {
                    courierData.isKGT = true;
                }
                if (courierData.cell && courierData.cell.toUpperCase().startsWith('DEFAULT_COURIER')) {
                    courierData.isDefaultCourier = true;
                }
                courierData._rowIndex = index;
                const row = createCourierTableRow(courierData, index);
                tpi_cc_tableBody.appendChild(row);
            });
            
            // Обновляем видимость кнопок печати
            updatePrintButtonsVisibility();
            setTimeout(() => {
                initializePrintRowButtons();
            }, 100);
            
            // Инициализируем систему
            saveOriginalRowOrder();
            initializeAllFilters();
            cartPallet_btnActions();
            if (!tpi_cc_tableSortInitialized) {
                tpi_cc_filteringColumnData();
            }
            initializePrintRowHighlight();
            initializeRestoreModal();
        }
        
        // Показываем таблицу, скрываем лоадер
        showTableLoader(false);
        const tableWrapper = document.querySelector('.tpi-cc--table-wrapper');
        if (tableWrapper) {
            tableWrapper.style.display = 'block';
        }

        setTimeout(async () => {
            try {
                const result = await updateTableDataFromAPI(selectedDate);
                if (result && result.updatedCount > 0) {
                    console.log(`✅ Таблица обновлена: ${result.updatedCount} записей`);
                    // Обновляем видимость кнопок печати после обновления данных
                    updatePrintButtonsVisibility();
                }
            } catch (error) {
                console.warn('⚠️ Ошибка при обновлении таблицы:', error);
            }
        }, 1500);
        
    } catch (error) {
        console.warn('💥 TPI Ошибка при загрузке данных из Firebase:', error);
        showTableLoader(false);
        showNoDataScreen(true, selectedDate);
    }
}

function sortCouriersByGroupsForDisplay(couriersData) {
    const firstWave = []; // MK-1...
    const secondWave = []; // MK-2...
    const kgt = []; // KGT...
    const alreadyGone = []; // null
    const others = []; // Остальные
    
    couriersData.forEach(courier => {
        const cell = courier.cell ? courier.cell.toUpperCase() : '';
        
        if (cell === 'NULL') {
            alreadyGone.push(courier);
        } else if (cell.startsWith('MK-1')) {
            firstWave.push(courier);
        } else if (cell.startsWith('MK-2')) {
            secondWave.push(courier);
        } else if (cell.startsWith('KGT')) {
            kgt.push(courier);
        } else {
            others.push(courier);
        }
    });
    
    // Функция для сортировки по номеру ячейки (по возрастанию)
    const sortByCellNumber = (a, b) => {
        const cellA = a.cell ? a.cell.toUpperCase() : '';
        const cellB = b.cell ? b.cell.toUpperCase() : '';
        
        if (cellA === 'NULL' || cellB === 'NULL') return 0;
        
        const extractNumber = (cell) => {
            const match = cell.match(/\d+/);
            return match ? parseInt(match[0]) : 9999;
        };
        
        return extractNumber(cellA) - extractNumber(cellB);
    };
    
    // Сортируем каждую группу по возрастанию номеров
    firstWave.sort(sortByCellNumber);
    secondWave.sort(sortByCellNumber);
    kgt.sort(sortByCellNumber);
    others.sort(sortByCellNumber);
    alreadyGone.sort((a, b) => {
        // Для null сортируем по имени курьера
        return (a.courier || '').localeCompare(b.courier || '');
    });
    
    // Объединяем в правильном порядке
    return [
        ...firstWave,
        ...secondWave,
        ...kgt,
        ...others,
        ...alreadyGone
    ];
}

//A-


//B- Функции для работы с курьерами и ячейками
async function tpi_getCouriersAndCells(selectedDate = null) {
    console.log('🔍 Получение данных о курьерах и ячейках...');
    
    try {
        // Шаг 1: Получаем данные о маршрутах
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'sortingCenter/routes/resolveGetRoutesFullInfo:resolveGetRoutesFullInfo');

        let targetDate;
        
        if (selectedDate) {
            // Используем выбранную дату из формата DD/MM/YYYY
            const dateParts = selectedDate.split('/');
            if (dateParts.length === 3) {
                targetDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            } else {
                // Если формат неправильный, используем логику по умолчанию
                const today = new Date();
                const currentHour = today.getHours();
                targetDate = new Date(today);
                if (currentHour >= 22) {
                    targetDate.setDate(targetDate.getDate() + 1);
                }
            }
        } else {
            // Логика по умолчанию
            const today = new Date();
            const currentHour = today.getHours();
            targetDate = new Date(today);
            if (currentHour >= 22) {
                targetDate.setDate(targetDate.getDate() + 1);
            }
        }

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        
        console.log('📅 Дата запроса API:', currentDate, '(выбранная дата:', selectedDate || 'не указана', ')');
        
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
                'sk': tpiUserTOKEN
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
                
                // Шаг 2: Получаем ФИО курьеров по одному с кэшированием
                let courierNamesMap = {};
                const encryptedIds = [];
                const routeIdToEncryptedIdMap = {};
                
                // Собираем все encrypted IDs
                routes.forEach((route, index) => {
                    if (route.destination && 
                        route.destination.destinationName && 
                        route.destination.destinationName.encryptedPersonalFullNameId) {
                        
                        const encryptedId = route.destination.destinationName.encryptedPersonalFullNameId;
                        encryptedIds.push(encryptedId);
                        routeIdToEncryptedIdMap[index] = encryptedId;
                    }
                });
                
                console.log(`🔐 Собрано encrypted IDs: ${encryptedIds.length}`);
                
                if (encryptedIds.length > 0) {
                    console.log('📤 Получаем ФИО курьеров по одному...');
                    courierNamesMap = await tpi_getCourierNamesOneByOneWithCache(encryptedIds);
                    console.log(`✅ Получено ФИО для ${Object.keys(courierNamesMap).length} курьеров`);
                }
                
                // Шаг 3: Формируем данные для таблицы
                const couriersData = routes.map((route, index) => {
                    // Получаем ФИО
                    let courierName = 'Не указан';
                    const encryptedId = routeIdToEncryptedIdMap[index];
                    
                    if (encryptedId && courierNamesMap[encryptedId]) {
                        courierName = courierNamesMap[encryptedId];
                    } else if (route.courier && route.courier.externalId) {
                        courierName = `Курьер ${route.courier.externalId}`;
                    } else if (route.courier && route.courier.id) {
                        courierName = `Курьер ID:${route.courier.id}`;
                    }
                    
                    // Определяем ячейку
                    let cellNumbers = 'Нет ячеек';
                    let mainCell = 'Нет ячейки';
                    
                    if (route.cells && route.cells.length > 0) {
                        // Есть ячейки
                        cellNumbers = route.cells.map(cell => cell.number || 'Без номера').join(', ');
                        mainCell = route.cells[0]?.number || 'Нет ячейки';
                    } else if (route.cell && route.cell.number) {
                        // Есть отдельное поле cell
                        cellNumbers = route.cell.number;
                        mainCell = route.cell.number;
                    } else {
                        // Пустой cells - курьер уже отгружен и пропал
                        cellNumbers = 'null';
                        mainCell = 'null';
                    }
                    
                    const routeStatus = route.status || 'Неизвестно';
                    
                    // ПОЛУЧАЕМ onlineTransferActId ПРЯМО ИЗ ОБЪЕКТА ROUTE
                    // В предоставленной структуре данных поле называется onlineTransferActId
                    let onlineTransferActId = route.onlineTransferActId || null;
                    
                    return {
                        courier: courierName,
                        cell: mainCell,
                        cells: cellNumbers,
                        status: routeStatus,
                        ordersLeft: route.ordersLeft || 0,
                        ordersSorted: route.ordersSorted || 0,
                        ordersShipped: route.ordersShipped || 0,
                        ordersPlanned: route.ordersPlanned || 0,
                        sortablesInCell: route.sortablesInCell || 0,
                        sortablesPrepared: route.sortablesPrepared || 0,
                        courierArrivesAt: route.courierArrivesAt || null,
                        startedAt: route.startedAt || null,
                        finishedAt: route.finishedAt || null,
                        routeId: route.id || null,
                        courierId: route.courier?.id || null,
                        externalId: route.courier?.externalId || null,
                        encryptedId: encryptedId || null,
                        hasCells: route.cells && route.cells.length > 0,
                        onlineTransferActId: onlineTransferActId // Сохраняем onlineTransferActId
                    };
                });
                
                console.log(`📊 Обработано курьеров: ${couriersData.length}`);
                console.log(`📄 Найдено onlineTransferActId: ${couriersData.filter(c => c.onlineTransferActId).length}`);
                
                // Выводим примеры для отладки
                const withActId = couriersData.filter(c => c.onlineTransferActId);
                if (withActId.length > 0) {
                    console.log('✅ Примеры курьеров с onlineTransferActId:');
                    withActId.slice(0, 3).forEach(c => {
                        console.log(`  - ${c.courier}: ${c.onlineTransferActId}`);
                    });
                }
                
                // Статистика по ФИО
                const withRealNames = couriersData.filter(item => 
                    !item.courier.startsWith('Курьер ') && 
                    !item.courier.startsWith('Курьер ID:') && 
                    item.courier !== 'Не указан'
                ).length;
                
                console.log('📊 Статистика по ФИО:');
                console.log(`  - С реальными ФИО: ${withRealNames}`);
                console.log(`  - С ID вместо ФИО: ${couriersData.length - withRealNames}`);
                
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
        console.warn('💥 Ошибка при получении данных:', error);
        return null;
    }
}

// Получение ФИО по одному с кэшированием
async function tpi_getCourierNamesOneByOneWithCache(encryptedIds) {
    const nameMap = {};
    const batchSize = 15; // По 3 за раз
    const delay = 1500; // Задержка 1.5 сек между запросами
    
    console.log(`🔐 Запрашиваем ФИО для ${encryptedIds.length} курьеров...`);
    
    // Создаем кэш в localStorage
    const cacheKey = 'tpi_courier_names_cache';
    let cache = {};
    
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            cache = JSON.parse(cached);
            console.log(`📦 Загружено ${Object.keys(cache).length} ФИО из кэша`);
        }
    } catch (e) {
        console.log('⚠️ Не удалось загрузить кэш');
    }
    
    // Сначала проверяем кэш
    const toFetch = [];
    encryptedIds.forEach(id => {
        if (cache[id]) {
            nameMap[id] = cache[id];
        } else {
            toFetch.push(id);
        }
    });
    
    console.log(`📊 Из кэша: ${Object.keys(nameMap).length}, нужно запросить: ${toFetch.length}`);
    
    // Запрашиваем оставшиеся
    for (let i = 0; i < toFetch.length; i += batchSize) {
        const batch = toFetch.slice(i, i + batchSize);
        console.log(`📦 Батч ${Math.floor(i/batchSize) + 1}: ${batch.length} шт`);
        
        const promises = batch.map(async (encryptedId) => {
            try {
                const name = await tpi_getSingleCourierName(encryptedId);
                if (name) {
                    nameMap[encryptedId] = name;
                    cache[encryptedId] = name; // Сохраняем в кэш
                    return { success: true, id: encryptedId };
                }
                return { success: false, id: encryptedId };
            } catch (error) {
                console.log(`❌ Ошибка для ${encryptedId.substring(0, 15)}...: ${error.message}`);
                return { success: false, id: encryptedId };
            }
        });
        
        const results = await Promise.all(promises);
        const successCount = results.filter(r => r.success).length;
        console.log(`  ✅ Успешно: ${successCount}/${batch.length}`);
        
        // Сохраняем кэш после каждого батча
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        } catch (e) {
            console.log('⚠️ Не удалось сохранить кэш');
        }
        
        // Ждем перед следующим батчем
        if (i + batchSize < toFetch.length) {
            console.log(`  ⏳ Ждем ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    console.log(`🎯 Итог: ${Object.keys(nameMap).length} ФИО (${Object.keys(nameMap).length - (encryptedIds.length - toFetch.length)} новых)`);
    return nameMap;
}

// Получение ФИО для одного курьера
async function tpi_getSingleCourierName(encryptedId) {
    try {
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'logPoint/getLogpointPersonalIdBulk:getLogpointPersonalIdBulk');
        
        // Используем правильный формат запроса
        const requestBody = {
            "params": [{
                "campaignId": 21972131,
                "ids": [encryptedId]
            }],
            "path": `/sorting-center/21972131/routes?type=OUTGOING_COURIER&sort=&hasCarts=false&category=COURIER`
        };

        const response = await fetch(url.toString(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Market-Core-Service': '<UNKNOWN>',
                'sk': tpiUserTOKEN
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            return null;
        }

        const responseText = await response.text();
        if (!responseText) return null;

        try {
            const data = JSON.parse(responseText);
            if (data && data.results && data.results[0] && data.results[0].data) {
                const name = Object.values(data.results[0].data)[0];
                if (name && typeof name === 'string') {
                    return name;
                }
            }
        } catch (e) {
            // Игнорируем ошибки парсинга
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Функция для сортировки курьеров по группам
function sortCouriersByGroups(couriersData) {
    const firstWave = []; // MK-1...
    const secondWave = []; // MK-2...
    const kgt = []; // KGT...
    const alreadyGone = []; // null
    const others = []; // Остальные
    
    couriersData.forEach(courier => {
        const cell = courier.cell.toUpperCase();
        
        if (cell === 'null') {
            alreadyGone.push(courier);
        } else if (cell.startsWith('MK-1')) {
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
        if (a.cell === 'null' || b.cell === 'null') return 0;
        
        const extractNumber = (cell) => {
            const match = cell.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        };
        
        return extractNumber(a.cell) - extractNumber(b.cell);
    };
    
    // Функция для сортировки по ФИО (если есть) или по ID
    const sortByNameOrId = (a, b) => {
        // Сначала сортируем по наличию реального ФИО
        const aHasRealName = !a.courier.includes('Курьер ');
        const bHasRealName = !b.courier.includes('Курьер ');
        
        if (aHasRealName && !bHasRealName) return -1;
        if (!aHasRealName && bHasRealName) return 1;
        
        // Если оба с ФИО или оба без - сортируем по имени/ID
        return a.courier.localeCompare(b.courier);
    };
    
    // Сортируем каждую группу
    firstWave.sort(sortByCellNumber);
    secondWave.sort(sortByCellNumber);
    kgt.sort(sortByCellNumber);
    others.sort(sortByCellNumber);
    alreadyGone.sort(sortByNameOrId); // Сортируем "null" по имени
    
    return { firstWave, secondWave, kgt, alreadyGone, others };
}

// Функция для вывода таблицы в консоль
function displayCourierTable(couriers, title) {
    if (couriers.length === 0) return;
    
    console.log(`\n📋 ${title} (${couriers.length}):`);
    
    const tableData = couriers.map(item => ({
        'Ячейка': item.cell,
        'Курьер': item.courier,
        'Статус': item.status,
        'Осталось': item.ordersLeft,
        'Отгружено': item.ordersShipped,
        'Всего': item.ordersPlanned,
        'Прибытие': item.courierArrivesAt ? new Date(item.courierArrivesAt).toLocaleTimeString() : '-'
    }));
    
    // Сортируем таблицу: сначала с ФИО, потом с ID
    tableData.sort((a, b) => {
        const aHasName = !a.Курьер.includes('Курьер ');
        const bHasName = !b.Курьер.includes('Курьер ');
        if (aHasName && !bHasName) return -1;
        if (!aHasName && bHasName) return 1;
        return a.Курьер.localeCompare(b.Курьер);
    });
    
    console.table(tableData);
}

// Функция для быстрого вызова с таблицей в консоли
async function showCouriers() {
    try {
        console.log('🚀 Запуск получения данных о курьерах...');
        const data = await tpi_getCouriersAndCells();
        
        if (!data || data.length === 0) {
            console.log('❌ Нет данных о курьерах');
            return;
        }

        console.log(`✅ Получено ${data.length} курьеров`);
        
        // Сортируем курьеров по группам
        const { firstWave, secondWave, kgt, alreadyGone, others } = sortCouriersByGroups(data);
        
        // Выводим таблицы
        displayCourierTable(firstWave, 'ПЕРВАЯ ВОЛНА (MK-1...)');
        displayCourierTable(secondWave, 'ВТОРАЯ ВОЛНА (MK-2...)');
        displayCourierTable(kgt, 'КГТ (KGT...)');
        displayCourierTable(alreadyGone, 'nullИ');
        
        if (others.length > 0) {
            displayCourierTable(others, 'ДРУГИЕ ЯЧЕЙКИ');
        }
        
        // Общая статистика
        const shippedCouriers = data.filter(item => item.status === 'SHIPPED').length;
        const withRealNames = data.filter(item => !item.courier.includes('Курьер ')).length;
        const totalOrdersLeft = data.reduce((sum, item) => sum + (item.ordersLeft || 0), 0);
        const totalOrdersShipped = data.reduce((sum, item) => sum + (item.ordersShipped || 0), 0);
        const totalOrdersPlanned = data.reduce((sum, item) => sum + (item.ordersPlanned || 0), 0);
        
        console.log(`\n📈 ОБЩАЯ СТАТИСТИКА:`);
        console.log(`   Всего курьеров: ${data.length}`);
        console.log(`   ├─ С ФИО: ${withRealNames}`);
        console.log(`   ├─ С ID: ${data.length - withRealNames}`);
        console.log(`   ├─ Первая волна: ${firstWave.length}`);
        console.log(`   ├─ Вторая волна: ${secondWave.length}`);
        console.log(`   ├─ КГТ: ${kgt.length}`);
        console.log(`   ├─ nullи: ${alreadyGone.length}`);
        console.log(`   └─ Другие: ${others.length}`);
        console.log(`   Отгружено: ${shippedCouriers}`);
        console.log(`   В работе: ${data.length - shippedCouriers}`);
        console.log(`   Всего заказов запланировано: ${totalOrdersPlanned}`);
        console.log(`   Всего заказов осталось: ${totalOrdersLeft}`);
        console.log(`   Всего заказов отгружено: ${totalOrdersShipped}`);
        const efficiency = totalOrdersPlanned > 0 ? ((totalOrdersShipped / totalOrdersPlanned) * 100).toFixed(1) : 0;
        console.log(`   Эффективность: ${efficiency}%`);
        
        // Дополнительная статистика
        console.log(`\n📊 ДОПОЛНИТЕЛЬНО:`);
        console.log(`   Среднее на курьера: ${(totalOrdersPlanned / data.length).toFixed(1)} заказов`);
        console.log(`   Среднее осталось: ${(totalOrdersLeft / data.length).toFixed(1)} на курьера`);
        
        // Покажем курьеров с ФИО
        const couriersWithNames = data.filter(item => !item.courier.includes('Курьер '));
        if (couriersWithNames.length > 0) {
            console.log(`\n👤 Курьеры с ФИО (${couriersWithNames.length}):`);
            couriersWithNames.forEach(item => {
                console.log(`  • ${item.courier}`);
            });
        }
        
    } catch (error) {
        console.warn('💥 Ошибка:', error);
    }
}

// Добавляем функции в глобальную область видимости
window.tpi_getCouriersAndCells = tpi_getCouriersAndCells;
window.showCouriers = showCouriers;

// Функция для очистки кэша ФИО
function tpi_clearCourierNamesCache() {
    localStorage.removeItem('tpi_courier_names_cache');
    console.log('🗑️ Кэш ФИО очищен');
}

// Функция для ожидания загрузки токена
function waitForTokenAndRun() {
    let attempts = 0;
    const maxAttempts = 15;
    
    const checkInterval = setInterval(() => {
        attempts++;
        
        if (tpiUserTOKEN !== null && tpiUserTOKEN !== undefined) {
            console.log('✅ Токен загружен, запускаем получение данных...');
            clearInterval(checkInterval);
            // showCouriers();
        } else if (attempts >= maxAttempts) {
            console.log('❌ Превышено количество попыток ожидания токена');
            clearInterval(checkInterval);
        } else {
            console.log(`⏳ Ожидание токена... (попытка ${attempts}/${maxAttempts})`);
        }
    }, 1000);
}

window.dataCapturingFlag = false;

function couriersDataCapturing(){
    const tpi_cc_startButton = document.querySelector('.tpi-cc--no-ds-data-start')
    const tpi_cc_areaContainer = document.querySelector('.tpi-cc--no-ds-data-container')
    const tpi_cc_desctiption = document.querySelector('.tpi-cc--no-ds-data-description')
    const tpi_cc_tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper')
    
    // Инициализируем глобальную переменную
    window.dataCapturingFlag = false;
    
    tpi_cc_startButton.addEventListener('click', async () => {
        if(window.dataCapturingFlag === false){
            document.querySelector('.tpi-cc--no-ds-data-title p').innerHTML = "<p>Загрузка</p>"
            window.dataCapturingFlag = true
            tpi_cc_areaContainer.setAttribute('tpi-current-state', 'loading-data')
            tpi_cc_desctiption.innerHTML = `
                <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="0" tpi-cc-status="waiting">
                    <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                    <p>Проверка ключа</p>
                </div>
                <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="1" tpi-cc-status="waiting">
                    <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                    <p>Поиск маршрутов</p>
                </div>
                <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="2" tpi-cc-status="waiting">
                    <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                    <p>Расшифровка данных курьеров</p>
                </div>
                <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="3" tpi-cc-status="waiting">
                    <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                    <p>Запись информации в базу данных</p>
                </div>
                <div class="tpi-cc-no-ds-data-loading-item" tpi-cc-search-id="4" tpi-cc-status="waiting">
                    <i class="tpi-cc-no-ds-data-loading-item-icon"></i>
                    <p>Построение и внедрение таблицы в DOM</p>
                </div>
            `
            
            await fillCouriersTableAndSaveToFirebase();
            window.dataCapturingFlag = false;
        } else return
    })
}

function hideAllUI() {
    const noDataWrapper = document.querySelector('.tpi-cc--no-ds-data-wrapper');
    const loadingWrapper = document.querySelector('.tpi-cc--no-data-loading-wrapper');
    const tableWrapper = document.querySelector('.tpi-cc--table-wrapper');
    
    if (noDataWrapper) noDataWrapper.style.display = 'none';
    if (loadingWrapper) loadingWrapper.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'none';
}

function updateLoadingStatus(stepId, status) {
    const loadingItem = document.querySelector(`[tpi-cc-search-id="${stepId}"]`);
    if (loadingItem) {
        loadingItem.setAttribute('tpi-cc-status', status);
    }
}

function cartPallet_btnActions() {
    const tpi_cc_actionButtons = document.querySelectorAll('.tpi-cc-table-tbody-data-cart-id, .tpi-cc-table-tbody-data-pallet-id');
    tpi_cc_actionButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            if(newBtn.hasAttribute('tpi-cc-button-is-blocked')) {
                tpiNotification.show('Ошибка', "error", "Взаимодействия с паллетами КГТ были заблокированы по просьбе старших смен.");
                return
            }else{
                if (newBtn.hasAttribute('tpi-cc-selected-courier-cell')) {
                    newBtn.removeAttribute('tpi-cc-selected-courier-cell');
                } else {
                    newBtn.setAttribute('tpi-cc-selected-courier-cell', '');
                }
                update_ActionProcessContainer();
            }
        });
    });
    
    initializeAddCartButtons();
    initializeAddPalletButtons();
    initializeDeleteButton();
    update_ActionProcessContainer();
}

async function fillCouriersTable() {
    try {
        console.log('🚀 Начинаем заполнение таблицы...');

        // Обновляем статус загрузки
        updateLoadingStatus(0, 'in-progress');

        // Шаг 0: Проверка ключа (реальное выполнение)
        if (!tpiUserTOKEN) {
            throw new Error('Токен не найден');
        }
        
        // Минимум 1.5 секунды для статуса
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateLoadingStatus(0, 'complete');

        // Шаг 1: Поиск маршрутов
        updateLoadingStatus(1, 'in-progress');
        
        // Получаем данные о курьерах
        const data = await tpi_getCouriersAndCells();

        if (!data || data.length === 0) {
            throw new Error('Нет данных о курьерах');
        }
        
        // Минимум 1.5 секунды для статуса
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateLoadingStatus(1, 'complete');

        // Шаг 2: Расшифровка данных курьеров
        updateLoadingStatus(2, 'in-progress');
        
        // Сортируем курьеров по группам
        const { firstWave, secondWave, kgt, alreadyGone, others } = sortCouriersByGroups(data);
        
        // Объединяем все группы
        const allCouriers = [
            ...firstWave,
            ...secondWave, 
            ...kgt,
            ...alreadyGone,
            ...others
        ];
        
        // Минимум 1.5 секунды для статуса
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateLoadingStatus(2, 'complete');

        // Шаг 3: Запись информации в базу данных
        updateLoadingStatus(3, 'in-progress');
        
        // Задержка 3 секунды для имитации записи в БД
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateLoadingStatus(3, 'complete');

        // Шаг 4: Построение и внедрение таблицы в DOM
        updateLoadingStatus(4, 'in-progress');
        
        // Минимум 1.5 секунды для статуса
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // ВАЖНО: Сначала меняем статус на complete
        updateLoadingStatus(4, 'complete');

        await new Promise(resolve => setTimeout(resolve, 500));
        const progressContainerWrapper = document.querySelector('.tpi-cc--no-ds-data-container')
        progressContainerWrapper.setAttribute('tpi-current-state', 'loading-data-animation')
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.querySelector('.tpi-cc-no-ds-data-loading-item[tpi-cc-search-id="2"] p').innerText = "Данные успешно загружены, обработаны и сохранены в базу данных, хорошей сортировки!"
        progressContainerWrapper.setAttribute('tpi-current-state', 'done')

        // Ждем 1.5 секунды после того как последний шаг стал complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        progressContainerWrapper.setAttribute('tpi-current-state', 'hidden')

        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Создаем строки для каждого курьера
        allCouriers.forEach((courier, index) => {
            const row = createCourierTableRow(courier, index);
            tpi_cc_tableBody.appendChild(row);
        });
        saveOriginalRowOrder();
        initializeAllFilters();
        // Скрываем блок загрузки и показываем таблицу
        document.querySelector('.tpi-cc--no-ds-data-wrapper').style.display = 'none';
        document.querySelector('.tpi-cc--table-wrapper').style.display = 'flex';

        cartPallet_btnActions();
        tpi_cc_filteringColumnData();
        
    } catch (error) {
        console.log('💥 Ошибка при заполнении таблицы:', error);
        updateLoadingStatus(0, 'error');
    }
}

function getRouteStatusText(status) {
    switch(status) {
        case 'CELL_SHIPPED':
            return 'Передано курьеру';
        case 'FINISHED':
            return 'Собран';
        case 'IN_PROGRESS':
            return 'В работе';
        case 'NOT_STARTED':
            return 'Не начат';
        case 'SHIPPED':
            return 'Отгружен';
        default:
            return status || 'Неизвестно';
    }
}

function cc_formatTime(dateString) {
    if (!dateString || dateString === 'null') return null;

    try {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    } catch (e) {
        console.warn('Ошибка форматирования времени:', e);
        return null;
    }
}

function cc_formatDate(dateString) {
    if (!dateString || dateString === 'null') return null;

    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        console.warn('Ошибка форматирования даты:', e);
        return null;
    }
}

function generateRandomPalletNumbers(count, seed) {
    const numbers = [];
    const usedNumbers = new Set();
    
    // Используем seed для псевдослучайности, но разной для каждого курьера
    const baseSeed = seed * 9301 + 49297; // Простые числа для лучшей случайности
    
    for (let i = 0; i < count; i++) {
        let number;
        let attempts = 0;
        
        do {
            // Генерируем случайное число от 100 до 999
            const random = (baseSeed * (i + 1) * 233 + 741) % 900;
            number = 100 + random;
            attempts++;
            
            // Если не можем сгенерировать уникальное число за 10 попыток, используем следующее доступное
            if (attempts > 10) {
                number = 100 + ((baseSeed + i) % 900);
                while (usedNumbers.has(number) && number < 999) {
                    number++;
                }
            }
        } while (usedNumbers.has(number) && number >= 100 && number <= 999);
        
        numbers.push(number);
        usedNumbers.add(number);
    }
    
    return numbers;
}

function tpiClearUsedPalletNumbers() {
    if (window.tpiUsedPalletNumbers) {
        window.tpiUsedPalletNumbers.clear();
    }
}

function getProgressColor(percent) {
    let r, g, b;
    
    if (percent <= 50) {
        const ratio = percent / 50;
        r = Math.floor(255);
        g = Math.floor(ratio * 204);
        b = 0;
    } else {
        const ratio = (percent - 50) / 50;
        r = Math.floor(255 - (255 - 42) * ratio);
        g = Math.floor(204 + (173 - 204) * ratio);
        b = Math.floor(0 + 46 * ratio);
    }
    return `rgb(${r}, ${g}, ${b})`;
}

// Функция для проверки, можно ли показывать кнопку печати
function canShowPrintButton() {
    const searchDateButton = document.querySelector('.tpi-cc-search-date');
    if (!searchDateButton) return false;
    
    // Получаем выбранную дату из календаря
    const selectedDateStr = searchDateButton.getAttribute('tpi-cc-selected-date-value');
    if (!selectedDateStr) return false;
    
    // Преобразуем выбранную дату в объект Date
    const dateParts = selectedDateStr.split('/');
    const selectedDate = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0])
    );
    selectedDate.setHours(0, 0, 0, 0);
    
    // Получаем текущую дату
    const now = new Date();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Получаем дату следующего дня
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(0, 0, 0, 0);
    
    // Проверяем условия:
    const isToday = selectedDate.getTime() === currentDate.getTime();
    const isTomorrow = selectedDate.getTime() === nextDate.getTime();
    
    // Текущий час
    const currentHour = now.getHours();
    
    return (isToday && currentHour < 23) || isTomorrow;
}

// Функция для обновления отображения кнопок печати при изменении даты
function updatePrintButtonsVisibility() {
    const showPrintButton = canShowPrintButton();
    const printWrapper = document.querySelector('.tpi-cc-print-items-wrapper');
    
    if (printWrapper) {
        printWrapper.style.display = showPrintButton ? 'flex' : 'none';
    }
    
    // Обновляем состояние всех кнопок .tpi-cc--table-tbody-data-button
    const cartPallet_buttons = document.querySelectorAll('.tpi-cc--table-tbody-data-button');
    cartPallet_buttons.forEach(button => {
        if (!showPrintButton) {
            button.setAttribute('tpi-cc-day-passed', 'true');
            button.setAttribute('tpi-tooltip-data', "Уже отгружен, взаимодействий нет");
            button.disabled = true;
        } else {
            button.removeAttribute('tpi-cc-day-passed');
            button.disabled = false;
        }
    });
    
    const addCartPallet_button = document.querySelectorAll('.tpi-cc--carts-control-buttons-wrapper button');
    addCartPallet_button.forEach(button => {
        if (!showPrintButton) {
            button.setAttribute('tpi-cc-day-passed', 'true');
            button.setAttribute('tpi-tooltip-data', "Уже отгружен, взаимодействий нет");
            button.disabled = true;
        } else {
            button.removeAttribute('tpi-cc-day-passed');
            button.disabled = false;
        }
    });
    
    const printButtonsContainers = document.querySelectorAll('.tpi-cc--table-body-print-container');
    
    printButtonsContainers.forEach(container => {
        const printButton = container.querySelector('.tpi-cc--print-current-row');
        const restoreButton = container.querySelector('.tpi-cc-restore-courier-data');
        
        if (showPrintButton) {
            // Если кнопки печати нет, добавляем её
            if (!printButton) {
                const appLink = container.querySelector('.tpi-cc--dcoument-app');
                if (appLink) {
                    const printButtonHtml = `
                        <button class="tpi-cc--print-current-row">
                            <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_print_current_row}${tpi_cc_i_clock_loader}</i>
                        </button>
                    `;
                    appLink.insertAdjacentHTML('afterend', printButtonHtml);
                }
            }
            // Включаем кнопку восстановления
            if (restoreButton) {
                restoreButton.disabled = false;
                restoreButton.removeAttribute('disabled');
                restoreButton.setAttribute('tpi-tooltip-data', 'Сбросить и заново сгенерировать данные текущего курьера из БД');
            }
        } else {
            // Если кнопка печати есть, удаляем её
            if (printButton) {
                printButton.remove();
            }
            // Отключаем кнопку восстановления
            if (restoreButton) {
                restoreButton.disabled = true;
                restoreButton.setAttribute('tpi-tooltip-data', 'Восстановление недоступно для этой даты');
            }
        }
    });
}

function updateDateAndInterface() {
    const searchDateButton = document.querySelector('.tpi-cc-search-date');
    if (!searchDateButton) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Получаем текущую дату
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Получаем завтрашнюю дату
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    
    // Определяем, какую дату ставить при загрузке
    let targetDate = currentDate;
    
    // Если сейчас 23:00 или позже, ставим завтрашнюю дату
    if (currentHour >= 23) {
        targetDate = tomorrowDate;
    }
    
    // Форматируем целевую дату в формат DD/MM/YYYY
    const targetDay = String(targetDate.getDate()).padStart(2, '0');
    const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
    const targetYear = targetDate.getFullYear();
    const targetFormatted = `${targetDay}/${targetMonth}/${targetYear}`;
    
    // Устанавливаем дату в атрибут и текст
    searchDateButton.setAttribute('tpi-cc-selected-date-value', targetFormatted);
    
    const selectedDateElement = document.getElementById('tpi-cc-seleceted-date');
    if (selectedDateElement) {
        selectedDateElement.textContent = targetFormatted;
    }
    
    console.log(`📅 Установлена дата при загрузке: ${targetFormatted} (час: ${currentHour})`);
    
    // Обновляем интерфейс на основе установленной даты
    updatePrintButtonsVisibility();
}

function createCourierTableRow(courierData, index) {
    const row = document.createElement('tr');
    row.className = 'tpi-cc--table-tbody';
    
    const sortCount = courierData.ordersSorted > 0 
        ? courierData.ordersSorted 
        : (courierData.ordersShipped > 0 ? courierData.ordersShipped : 0);
        
    const sortPercent = courierData.ordersPlanned > 0 
        ? Math.round((sortCount / courierData.ordersPlanned) * 100)
        : 0;
        
    const preparedPercent = courierData.sortablesInCell > 0
        ? Math.round((courierData.sortablesPrepared / courierData.sortablesInCell) * 100)
        : 0;
    
    // Получаем цвет для прогресс-бара
    const sortColor = getProgressColor(sortPercent);
    const preparedColor = getProgressColor(preparedPercent);
    
    // Форматируем даты
    const startedDate = courierData.startedAt ? cc_formatDate(courierData.startedAt) : null;
    const startedTime = courierData.startedAt ? cc_formatTime(courierData.startedAt) : null;
    const endedDate = courierData.finishedAt ? cc_formatDate(courierData.finishedAt) : null;
    const endedTime = courierData.finishedAt ? cc_formatTime(courierData.finishedAt) : null;
    const arrivesDate = courierData.courierArrivesAt ? cc_formatDate(courierData.courierArrivesAt) : null;
    const arrivesTime = courierData.courierArrivesAt ? cc_formatTime(courierData.courierArrivesAt) : null;
    
    // Определяем статус маршрута
    const routeStatusText = getRouteStatusText(courierData.status);
    
    // Извлекаем номер из ячейки (например, "101" из "MK-101")
    let cellNumber = "000";
    if (courierData.cell && courierData.cell !== 'null' && courierData.cell !== 'Нет ячейки') {
        const match = courierData.cell.match(/\d+/);
        cellNumber = match ? match[0].padStart(3, '0') : "000";
    }
    
    // Проверяем, является ли курьер КГТ
    const isKGT = courierData.cell && courierData.cell.toUpperCase().startsWith('KGT');
    
    // Проверяем, является ли ячейка null
    const isNullCell = courierData.cell === 'null';
    
    // Получаем onlineTransferActId из сохраненных данных или из свежих данных
    const onlineTransferActId = courierData._savedOnlineTransferActId || courierData.onlineTransferActId;
    
    // Формируем ссылку для onlineTransferAct
    let eappLinkHtml = '';
    if (onlineTransferActId) {
        // Если есть onlineTransferActId - создаем активную ссылку
        eappLinkHtml = `
            <a class="tpi-cc--dcoument-eapp" href="/api/sorting-center/21972131/online-transfer-act/${onlineTransferActId}/download" target="_blank" tpi-tooltip-data="ЭАПП курьера">
                <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_eapp}</i>
            </a>
        `;
    } else {
        // Если нет onlineTransferActId - создаем disabled ссылку
        eappLinkHtml = `
            <div class="tpi-cc--dcoument-eapp" disabled tpi-tooltip-data="ЭАПП нет в БД, но не факт, что его нет вообще">
                <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_eapp}</i>
            </div>
        `;
    }
    
    // Получаем выбранную дату в формате YYYY-MM-DD для ссылки документа
    const searchDateButton = document.querySelector('.tpi-cc-search-date');
    let selectedDateFormatted = '';
    if (searchDateButton) {
        const selectedDateStr = searchDateButton.getAttribute('tpi-cc-selected-date-value');
        if (selectedDateStr) {
            const dateParts = selectedDateStr.split('/');
            if (dateParts.length === 3) {
                selectedDateFormatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
        }
    }
    
    // Если не удалось получить дату из календаря, используем текущую
    if (!selectedDateFormatted) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        selectedDateFormatted = `${year}-${month}-${day}`;
    }
    
    // Проверяем, нужно ли показывать кнопку печати
    const showPrintButton = canShowPrintButton();
    
    // Создаем HTML для кнопок CART (только для обычных курьеров, не для null ячеек)
    let cartButtonsHTML = '';
    if (!isNullCell && !isKGT) {
        // Проверяем, есть ли сохраненные номера CART
        if (courierData._savedCartNumbers && courierData._savedCartNumbers.length > 0) {
            // Используем сохраненные номера
            courierData._savedCartNumbers.forEach(cartNumber => {
                const cartId = cartNumber.replace('CART-', '');
                cartButtonsHTML += `
                    <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-cart-id tpi-cc-skeleton-target" tpi-data-courier-spec-cell="${cartNumber}" tpi-tooltip-data="Нажмите, чтобы выбрать этот CART">
                        <i class="tpi-cc-table-tbody-data-cart-icon">${tpi_cc_i_cart}</i>
                        -${cartId}
                    </button>
                `;
            });
        } else {
            // Генерируем новые номера CART
            if (courierData.isDefaultCourier) {
                // Для DEFAULT_COURIER используем сгенерированные номера
                // Они уже должны быть в _savedCartNumbers или в courierData.cartNumbers
                if (courierData.cartNumbers && courierData.cartNumbers.length > 0) {
                    courierData.cartNumbers.forEach(cartNumber => {
                        const cartId = cartNumber.replace('CART-', '');
                        cartButtonsHTML += `
                            <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-cart-id tpi-cc-skeleton-target" tpi-data-courier-spec-cell="${cartNumber}" tpi-tooltip-data="Нажмите, чтобы выбрать этот CART">
                                <i class="tpi-cc-table-tbody-data-cart-icon">${tpi_cc_i_cart}</i>
                                -${cartId}
                            </button>
                        `;
                    });
                }
            } else {
                // Обычная генерация для MK-1 и MK-2
                for (let i = 1; i <= 4; i++) {
                    const cartNumber = `${cellNumber}${i}`;
                    cartButtonsHTML += `
                        <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-cart-id tpi-cc-skeleton-target" tpi-data-courier-spec-cell="CART-${cartNumber}" tpi-tooltip-data="Нажмите, чтобы выбрать этот CART">
                            <i class="tpi-cc-table-tbody-data-cart-icon">${tpi_cc_i_cart}</i>
                            -${cartNumber}
                        </button>
                    `;
                }
            }
        }
    }
    
    // Создаем HTML для кнопок PALLET
    let palletButtonsHTML = '';
    if (!isNullCell) {
        // Проверяем, есть ли сохраненные номера PALLET
        if (courierData._savedPalletNumbers && courierData._savedPalletNumbers.length > 0) {
            // Используем сохраненные номера
            courierData._savedPalletNumbers.forEach(palletNumber => {
                const palletId = palletNumber.replace('PALLET-', '');
                // Проверяем, является ли этот сохраненный номер КГТ паллетом
                const isSavedKGT = isKGT || (courierData.cell && courierData.cell.toUpperCase().startsWith('KGT'));
                const isDefault = courierData.isDefaultCourier;
                
                if (isSavedKGT) {
                    // Для КГТ - добавляем заблокированную кнопку с индикатором
                    palletButtonsHTML += `
                        <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-pallet-id tpi-cc-skeleton-target" 
                                tpi-data-courier-spec-cell="${palletNumber}" 
                                tpi-tooltip-data="КГТ Паллеты заблокированы" 
                                tpi-cc-button-is-blocked 
                                disabled>
                            <div class="tpi-cc-blocked-button-indicator">${tpi_cc_i_blocked_button}</div>
                            <i class="tpi-cc-table-tbody-data-pallet-icon">${tpi_cc_i_pallet}</i>
                            -${palletId}
                        </button>
                    `;
                } else {
                    // Обычная кнопка PALLET
                    palletButtonsHTML += `
                        <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-pallet-id tpi-cc-skeleton-target" 
                                tpi-data-courier-spec-cell="${palletNumber}" 
                                tpi-tooltip-data="Нажмите, чтобы выбрать этот PALLET">
                            <i class="tpi-cc-table-tbody-data-pallet-icon">${tpi_cc_i_pallet}</i>
                            -${palletId}
                        </button>
                    `;
                }
            });
        } else {
            if (isKGT) {
                const kgtNumber = courierData.cell.replace('KGT-', '').replace('kgt-', '');
                palletButtonsHTML += `
                    <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-pallet-id tpi-cc-skeleton-target" 
                            tpi-data-courier-spec-cell="PALLET-${kgtNumber}" 
                            tpi-tooltip-data="КГТ Паллеты заблокированы" 
                            tpi-cc-button-is-blocked 
                            disabled>
                        <div class="tpi-cc-blocked-button-indicator">${tpi_cc_i_blocked_button}</div>
                        <i class="tpi-cc-table-tbody-data-pallet-icon">${tpi_cc_i_pallet}</i>
                        -${kgtNumber}
                    </button>
                `;
            } else if (courierData.isDefaultCourier) {
                // Для DEFAULT_COURIER используем сгенерированные номера
                if (courierData.palletNumbers && courierData.palletNumbers.length > 0) {
                    courierData.palletNumbers.forEach(palletNumber => {
                        const palletId = palletNumber.replace('PALLET-', '');
                        palletButtonsHTML += `
                            <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-pallet-id tpi-cc-skeleton-target" 
                                    tpi-data-courier-spec-cell="${palletNumber}" 
                                    tpi-tooltip-data="Нажмите, чтобы выбрать этот PALLET">
                                <i class="tpi-cc-table-tbody-data-pallet-icon">${tpi_cc_i_pallet}</i>
                                -${palletId}
                            </button>
                        `;
                    });
                }
            } else {
                // Для обычных курьеров - 2 кнопки PALLET со случайными номерами
                const palletNumbers = generateRandomPalletNumbers(2, index);
                palletNumbers.forEach(palletNumber => {
                    palletButtonsHTML += `
                        <button class="tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-pallet-id tpi-cc-skeleton-target" 
                                tpi-data-courier-spec-cell="PALLET-${palletNumber}" 
                                tpi-tooltip-data="Нажмите, чтобы выбрать этот PALLET">
                            <i class="tpi-cc-table-tbody-data-pallet-icon">${tpi_cc_i_pallet}</i>
                            -${palletNumber}
                        </button>
                    `;
                });
            }
        }
    }

    // Кнопка добавления PALLET (всегда показываем для обычных курьеров, но не для DEFAULT_COURIER)
    const addPalletButton = !isNullCell && !isKGT && !courierData.isDefaultCourier ? `
        <div class="tpi-cc--carts-control-buttons-wrapper">
            <button class="tpi-cc--table-tbody-add-pallet tpi-cc-skeleton-target" tpi-state-change="tpi-add-pallet" tpi-tooltip-data="Добавить PALLET курьеру">
                <i>${tpi_cc_i_cart_add}</i>
            </button>
        </div>
    ` : '';

     const addCartButton = !isNullCell && !isKGT && !courierData.isDefaultCourier ? `
        <div class="tpi-cc--carts-control-buttons-wrapper">
            <button class="tpi-cc--table-tbody-add-cart tpi-cc-skeleton-target" tpi-state-change="tpi-add-cart" tpi-tooltip-data="Добавить CART курьеру">
                <i>${tpi_cc_i_cart_add}</i>
            </button>
        </div>
    ` : '';
    
    let printBlockHtml = `
        <div class="tpi-cc--table-body-print-container tpi-cc-skeleton-target">
            <button class="tpi-cc-restore-courier-data" tpi-tooltip-data="Сбросить и заново сгенерировать данные текущего курьера из БД">
                <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_restore}</i>
            </button>
            ${eappLinkHtml}
            <a class="tpi-cc--dcoument-app" href="/api/sorting-center/21972131/routes/${courierData.routeId || ''}/transferAct/ALL?date=${selectedDateFormatted}" target="_blank" tpi-tooltip-data="АПП курьера">
                <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_app}</i>
            </a>
            <button class="tpi-cc--print-current-row" tpi-tooltip-data="Кнопка для печати всех CART и PALLET у данного курьера">
                <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_print_current_row}${tpi_cc_i_clock_loader}</i>
            </button>
        </div>
    `;

    if (!showPrintButton) {
        printBlockHtml = `
            <div class="tpi-cc--table-body-print-container tpi-cc-skeleton-target">
                <button class="tpi-cc-restore-courier-data" disabled tpi-tooltip-data="Восстановление недоступно для этой даты">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_restore}</i>
                </button>
                ${eappLinkHtml}
                <a class="tpi-cc--dcoument-app" href="/api/sorting-center/21972131/routes/${courierData.routeId || ''}/transferAct/ALL?date=${selectedDateFormatted}" target="_blank" tpi-tooltip-data="АПП курьера">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_app}</i>
                </a>
            </div>
        `;
    }
    
    row.innerHTML = `
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data-courier">
                <div class="tpi-cc--sortable-data-wrapper tpi-cc--courier-id-data-wrapper">
                    <a href="https://logistics.market.yandex.ru/sorting-center/21972131/routes?type=OUTGOING_COURIER&sort=&hasCarts=false&category=COURIER&id=21972131&page=1&pageSize=50&recipientName=${courierData.externalId}" target="_blank" class="tpi-cc--table-tbody-data-link tpi-cc-skeleton-target" tpi-tooltip-data="Ссылка на курьера в «Отгрузки по маршрутам»">
                        <i>${tpi_cc_i_courier}</i>
                        <p class="tpi-cc--sortable-data-courier" tpi-cc-parsing-data="courier-full-name">${courierData.courier}</p>
                    </a>
                    <div class="tpi-cc--table-tbody-data-courier-extra-info-wrapper">
                        <div class="tpi-cc--table-tbody-data-courier-extra-info tpi-cc-skeleton-target" tpi-tooltip-data="ID Маршрута курьера за текущую дату (каждый день разный)">
                            <i>${tpi_cc_i_courier_route_id}</i>
                            <p tpi-cc-parsing-data="courier-route-id">${courierData.routeId || 'Нет данных'}</p>
                        </div>
                        <div class="tpi-cc--table-tbody-data-courier-extra-info tpi-cc-skeleton-target" tpi-tooltip-data="Персональный ID курьера">
                            <i>${tpi_cc_i_courier_id}</i>
                            <p tpi-cc-parsing-data="courier-personal-id">${courierData.externalId || courierData.courierId || 'Нет данных'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data">
                <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableTypes=CART&sortableTypes=COURIER_PALLET&cellName=${courierData.cell}" class="tpi-cc--table-tbody-data-link tpi-cc-skeleton-target" tpi-cc-parsing-data="courier-route-cell" courier-spec-cell="${courierData.cell}" target="_blank" tpi-tooltip-data="Ссылка на активные CART и PALLET курьера">
                    <i class="tpi-cc-i-cell-name">${tpi_cc_i_tag}</i>
                    ${courierData.cell}
                </a>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-data-carts">
                ${cartButtonsHTML}
                ${addCartButton}
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-data-pallets">
                ${palletButtonsHTML}
                ${addPalletButton}
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data">
                <div class="tpi-cc-table-tbody-data-route-status tpi-cc-skeleton-target" tpi-cc-route-status="${courierData.status.toLowerCase()}" tpi-tooltip-data="Текущий статус маршрута курьера">
                    <i></i>
                    <p tpi-cc-parsing-data="courier-route-status">${routeStatusText}</p>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-data-sort-progress-container tpi-cc-skeleton-target">
                    <p class="tpi-cc--table-tbody-data-sort-progress tpi-cc-skeleton-target" tpi-cc-parsing-data="courier-sorting-progress">
                        <a class="tpi-cc--table-tbody-data-link" target="_blank" href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?routeId=${courierData.routeId}&searchRouteIdInOldRoutes=true&crossDockOnly=true&sortableStatusesLeafs=SHIPPED_DIRECT&sortableTypes=PLACE&sortableTypes=TOTE&sortableTypes=PALLET&sortableTypes=XDOC_PALLET&sortableTypes=XDOC_BOX" tpi-tooltip-data="Ссылка на отсортированные заказы курьеру"><i>${tpi_cc_i_box_outline}</i>${sortCount || 0}</a> из <a class="tpi-cc--table-tbody-data-link" target="_blank" href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?routeId=${courierData.routeId}&searchRouteIdInOldRoutes=true&sortableStatusesLeafs=&sortableTypes=PLACE&sortableTypes=TOTE&sortableTypes=PALLET&sortableTypes=XDOC_PALLET&sortableTypes=XDOC_BOX&crossDockOnly=true" tpi-tooltip-data="Ссылка на назначенные заказы курьеру"><i>${tpi_cc_i_box_filled}</i>${courierData.ordersPlanned || 0}</a>
                    </p>
                <div class="tpi-cc--table-tbody-data-sort-progress-circle-wrapper tpi-cc-skeleton-target" tpi-tooltip-data="Прогресс сортировки заказов курьеру">
                    <p class="tpi-cc--table-tbody-data-sort-progress-circle-value" tpi-cc-parsing-data="courier-sorting-progress-percent">
                        ${sortPercent}%
                    </p>
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg)">
                        <circle cx="25" cy="25" r="20" fill="transparent" stroke="#e8e8e8" stroke-width="4"></circle>
                        <circle cx="25" cy="25" r="20" fill="transparent" 
                                stroke="${sortColor}" stroke-width="5" stroke-linecap="round"
                                stroke-dasharray="125.6" 
                                stroke-dashoffset="${125.6 - (125.6 * sortPercent / 100)}"
                                tpi-cc-parsing-data="courier-sorting-progress-circle">
                        </circle>
                    </svg>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-data-sort-progress-container tpi-cc-skeleton-target">
                <p class="tpi-cc--table-tbody-data-sort-progress tpi-cc-skeleton-target" tpi-cc-parsing-data="courier-prepared-progress">
                    <span tpi-tooltip-data="Количество подготовленных заказов"><i>${tpi_cc_i_pen_outline}</i>${courierData.sortablesPrepared || 0}</span> из <span tpi-tooltip-data="Общее количество заказов для подготовки"><i>${tpi_cc_i_pen_filled}</i>${courierData.sortablesInCell || 0}</span>
                </p>
                <div class="tpi-cc--table-tbody-data-sort-progress-circle-wrapper tpi-cc-skeleton-target" tpi-tooltip-data="Прогресс подготовки заказов у курьреа">
                    <p class="tpi-cc--table-tbody-data-sort-progress-circle-value" tpi-cc-parsing-data="courier-prepared-progress-percent">
                        ${preparedPercent}%
                    </p>
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg)">
                        <circle cx="25" cy="25" r="20" fill="transparent" stroke="#e8e8e8" stroke-width="4"></circle>
                        <circle cx="25" cy="25" r="20" fill="transparent" 
                                stroke="${preparedColor}" stroke-width="5" stroke-linecap="round"
                                stroke-dasharray="125.6" 
                                stroke-dashoffset="${125.6 - (125.6 * preparedPercent / 100)}"
                                tpi-cc-parsing-data="courier-prepared-progress-circle">
                        </circle>
                    </svg>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-body-date-container tpi-cc-skeleton-target">
                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_calendar}</i>
                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-date-type="start" tpi-cc-parsing-data="courier-started-at-date">
                        ${startedDate || 'null'}
                    </p>
                </div>
                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_clock}</i>
                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-time-type="start" tpi-cc-parsing-data="courier-started-at-time">
                        ${startedTime || 'null'}
                    </p>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-body-date-container tpi-cc-skeleton-target">
                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_calendar}</i>
                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-date-type="end" tpi-cc-parsing-data="courier-ended-at-date">
                        ${endedDate || 'null'}
                    </p>
                </div>
                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_clock}</i>
                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-time-type="end" tpi-cc-parsing-data="courier-ended-at-time">
                        ${endedTime || 'null'}
                    </p>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            <div class="tpi-cc--table-body-date-container tpi-cc-skeleton-target">
                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_calendar}</i>
                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-date-type="arrived" tpi-cc-parsing-data="courier-arrives-at-date">
                        ${arrivesDate || 'null'}
                    </p>
                </div>
                <div class="tpi-cc--table-tbody-data tpi-cc--table-tbody-date-wrapper">
                    <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_clock}</i>
                    <p class="tpi-cc--table-tbody-data-courier-status" tpi-cc-time-type="arrived" tpi-cc-parsing-data="courier-arrives-at-time">
                        ${arrivesTime || 'null'}
                    </p>
                </div>
            </div>
        </td>
        <td class="tpi-cc--table-tbody-item">
            ${printBlockHtml}
        </td>
    `;
    
    return row;
}

async function fillCouriersTableAndSaveToFirebase() {
    try {
        console.log('🚀 Начинаем заполнение таблицы и сохранение в Firebase...');
        
        // Получаем выбранную дату
        const searchDateButton = document.querySelector('.tpi-cc-search-date');
        const selectedDate = searchDateButton.getAttribute('tpi-cc-selected-date-value');
        
        if (!selectedDate) {
            tpiNotification.show('Ошибка', "error", "Не удалось определить дату");
            return;
        }
        
        // Обновляем статус загрузки
        updateLoadingStatus(0, 'in-progress');
        
        // Шаг 0: Проверка ключа
        if (!tpiUserTOKEN) {
            throw new Error('Токен не найден');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateLoadingStatus(0, 'complete');
        
        // Шаг 1: Поиск маршрутов
        updateLoadingStatus(1, 'in-progress');
        
        // Получаем данные о курьерах для выбранной даты (уже с onlineTransferActId)
        const data = await tpi_getCouriersAndCells(selectedDate);
        
        if (!data || data.length === 0) {
            // ПОКАЗЫВАЕМ ОШИБКУ В UI
            const noDataContainer = document.querySelector('.tpi-cc--no-ds-data-container');
            if (noDataContainer) {
                noDataContainer.setAttribute('tpi-current-state', 'error');
                
                document.querySelector('.tpi-cc--no-ds-data-title p p').innerText = "Ошибка"

                const descriptionBlock = document.querySelector('.tpi-cc--no-ds-data-description');
                if (descriptionBlock) {
                    descriptionBlock.innerHTML = `
                        <p class="tpi-cc--no-ds-data-description-block">Данные курьеров за выбранную дату ещё не существуют</p>
                        <p class="tpi-cc--no-ds-data-description-block-sub">Пожалуйста попробуйте позже, когда данные курьеров будут сформированы в ПИ</p>
                        <p class="tpi-cc--no-ds-data-description-block-sub">Окно для записи данных - с 23:00 по МСК, убедитесь, что на вашем ПК стоит верное время</p>
                    `;
                }
            }
            return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateLoadingStatus(1, 'complete');
        
        // Шаг 2: Расшифровка данных курьеров
        updateLoadingStatus(2, 'in-progress');
        
        // Сортируем курьеров по группам в правильном порядке
        const sortedCouriersData = sortCouriersByGroupsForDisplay(data);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateLoadingStatus(2, 'complete');
        
        // Шаг 3: Запись информации в базу данных
        updateLoadingStatus(3, 'in-progress');
        
        // ВАЖНО: Теперь перед сохранением в Firebase мы добавляем сгенерированные номера CART и PALLET
        // и сохраняем onlineTransferActId к данным каждого курьера
        
        // Инициализируем массивы для отслеживания сгенерированных PALLET номеров по сотням
        const palletNumbersByHundred = {
            '1': new Set(),
            '2': new Set(),
            '3': new Set(),
            '5': new Set(),
            '6': new Set()
        };

        window.tpiDefaultCourierNumbers = {
            cart: new Set(),
            pallet: new Set()
        };

        
        const couriersWithGeneratedNumbers = sortedCouriersData.map((courier, index) => {
            // Создаем копию объекта курьера
            const courierWithNumbers = { ...courier };
            
            // Проверяем, является ли ячейка DEFAULT_COURIER
            const isDefaultCourier = courier.cell && courier.cell.toUpperCase().startsWith('DEFAULT_COURIER');
            const isKGT = courier.cell && courier.cell.toUpperCase().startsWith('KGT');
            const isNullCell = courier.cell === 'null';
            
            if (isDefaultCourier) {
                // Генерируем номера для DEFAULT_COURIER
                const defaultNumbers = generateDefaultCourierNumbers(courier, index, palletNumbersByHundred);
                courierWithNumbers.cartNumbers = defaultNumbers.cartNumbers;
                courierWithNumbers.palletNumbers = defaultNumbers.palletNumbers;
                courierWithNumbers.isDefaultCourier = true;
            } else {
                // Генерируем номера CART (только для обычных курьеров, не для null ячеек и не для КГТ)
                if (!isNullCell && !isKGT) {
                    // Извлекаем номер из ячейки
                    let cellNumber = "000";
                    if (courier.cell && courier.cell !== 'null' && courier.cell !== 'Нет ячейки') {
                        const match = courier.cell.match(/\d+/);
                        cellNumber = match ? match[0].padStart(3, '0') : "000";
                    }
                    
                    // Генерируем 4 номера CART
                    const cartNumbers = [];
                    for (let i = 1; i <= 4; i++) {
                        const cartNumber = `CART-${cellNumber}${i}`;
                        cartNumbers.push(cartNumber);
                    }
                    
                    // Добавляем в данные курьера
                    courierWithNumbers.cartNumbers = cartNumbers;
                }
                
                // Генерируем номера PALLET
                if (!isNullCell) {
                    const palletNumbers = [];
                    
                    if (isKGT) {
                        // Для КГТ - один номер PALLET с номером ячейки
                        const kgtNumber = courier.cell.replace('KGT-', '').replace('kgt-', '');
                        const palletNumber = `PALLET-${kgtNumber}`;
                        palletNumbers.push(palletNumber);
                        
                        // Сохраняем информацию, что это КГТ паллет
                        courierWithNumbers.isKGT = true;
                        
                        // Для КГТ добавляем в массив соответствующей сотни
                        const firstDigit = kgtNumber.toString()[0];
                        if (palletNumbersByHundred[firstDigit]) {
                            palletNumbersByHundred[firstDigit].add(parseInt(kgtNumber));
                        }
                    } else {
                        // Для обычных курьеров
                        // Извлекаем базовый номер ячейки (например, 101 из MK-101)
                        let baseNumber = 0;
                        if (courier.cell && courier.cell !== 'null' && courier.cell !== 'Нет ячейки') {
                            const match = courier.cell.match(/\d+/);
                            baseNumber = match ? parseInt(match[0]) : 0;
                        }
                        
                        if (baseNumber > 0) {
                            const firstDigit = baseNumber.toString()[0];
                            
                            // --- ПЕРВЫЙ PALLET (номер ячейки) ---
                            // Проверяем, есть ли уже такой номер в массиве для первой цифры
                            if (!palletNumbersByHundred[firstDigit].has(baseNumber)) {
                                palletNumbers.push(`PALLET-${baseNumber}`);
                                palletNumbersByHundred[firstDigit].add(baseNumber);
                            } else {
                                // Если номер уже занят, находим следующий свободный в этой сотне
                                let nextNumber = baseNumber;
                                while (palletNumbersByHundred[firstDigit].has(nextNumber) && nextNumber < (parseInt(firstDigit) * 100 + 99)) {
                                    nextNumber++;
                                }
                                palletNumbers.push(`PALLET-${nextNumber}`);
                                palletNumbersByHundred[firstDigit].add(nextNumber);
                            }
                            
                            // --- ВТОРОЙ PALLET (номер ячейки + 200) ---
                            const secondPalletNumber = baseNumber + 200;
                            const secondDigit = '3'; // Вторая сотня всегда начинается с 3
                            
                            // Проверяем, есть ли уже такой номер в массиве для третьей сотни
                            if (!palletNumbersByHundred[secondDigit].has(secondPalletNumber)) {
                                palletNumbers.push(`PALLET-${secondPalletNumber}`);
                                palletNumbersByHundred[secondDigit].add(secondPalletNumber);
                            } else {
                                // Если номер уже занят, находим следующий свободный в третьей сотне
                                let nextNumber = secondPalletNumber;
                                while (palletNumbersByHundred[secondDigit].has(nextNumber) && nextNumber < 400) {
                                    nextNumber++;
                                }
                                if (nextNumber < 400) {
                                    palletNumbers.push(`PALLET-${nextNumber}`);
                                    palletNumbersByHundred[secondDigit].add(nextNumber);
                                }
                            }
                        }
                    }
                    
                    // Добавляем в данные курьера
                    courierWithNumbers.palletNumbers = palletNumbers;
                }
            }
            
            // Сохраняем onlineTransferActId (он уже есть в courier)
            return courierWithNumbers;
        });
        
        // Сохраняем данные ВМЕСТЕ с номерами CART/PALLET и onlineTransferActId в Firebase
        const saveResult = await tpiSaveDataToFirebase(selectedDate, couriersWithGeneratedNumbers);
        
        if (!saveResult) {
            throw new Error('Не удалось сохранить данные в Firebase');
        }
        
        // ОБНОВЛЯЕМ КЭШ КАЛЕНДАРЯ ДЛЯ ЭТОЙ ДАТЫ
        if (window.tpiCalendarDatesCache) {
            window.tpiCalendarDatesCache[selectedDate] = 'has-bd-data';
            updateCalendarDateStatus(selectedDate, 'has-bd-data');
        }
        
        // Задержка 3 секунды для имитации записи в БД
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateLoadingStatus(3, 'complete');
        
        // Шаг 4: Построение и внедрение таблицы в DOM
        updateLoadingStatus(4, 'in-progress');
        resetTableSortState();
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // ВАЖНО: Сначала меняем статус на complete
        updateLoadingStatus(4, 'complete');

        await new Promise(resolve => setTimeout(resolve, 500));
        const progressContainerWrapper = document.querySelector('.tpi-cc--no-ds-data-container')
        progressContainerWrapper.setAttribute('tpi-current-state', 'loading-data-animation')
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.querySelector('.tpi-cc-no-ds-data-loading-item[tpi-cc-search-id="2"] p').innerText = 
            "Данные успешно загружены, обработаны и сохранены в базу данных, хорошей сортировки!"
        progressContainerWrapper.setAttribute('tpi-current-state', 'done')

        await new Promise(resolve => setTimeout(resolve, 2000));

        progressContainerWrapper.setAttribute('tpi-current-state', 'hidden')

        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Обновляем статус даты в календаре
        updateCalendarDateStatus(selectedDate, 'has-bd-data');

        // Очищаем таблицу и заполняем ее данными с сохраненными номерами и onlineTransferActId
        const tpi_cc_tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
        tpi_cc_tableBody.innerHTML = '';
        
        // Теперь при создании строк таблицы будут использоваться сохраненные номера и onlineTransferActId из couriersWithGeneratedNumbers
        couriersWithGeneratedNumbers.forEach((courier, index) => {
            // Добавляем сохраненные номера и onlineTransferActId в данные курьера для правильного отображения
            courier._savedCartNumbers = courier.cartNumbers || [];
            courier._savedPalletNumbers = courier.palletNumbers || [];
            courier._savedOnlineTransferActId = courier.onlineTransferActId;
            courier._rowIndex = index;
            
            const row = createCourierTableRow(courier, index);
            tpi_cc_tableBody.appendChild(row);
            
        });

        initializePrintRowButtons();
        initializeAddCartButtons();
        initializeAddPalletButtons();
        initializeDeleteButton();
        
        // Скрываем блок загрузки и показываем таблицу
        document.querySelector('.tpi-cc--no-ds-data-wrapper').style.display = 'none';
        document.querySelector('.tpi-cc--table-wrapper').style.display = 'flex';
        
        // Инициализируем систему
        saveOriginalRowOrder();
        initializeAllFilters();
        cartPallet_btnActions();
        tpi_cc_filteringColumnData();
        initializePrintRowHighlight();
        initializeRestoreModal();
        
    } catch (error) {
        console.log('💥 Ошибка при заполнении таблицы и сохранении в Firebase:', error);
        updateLoadingStatus(0, 'error');
        
        // ПОКАЗЫВАЕМ ОШИБКУ В UI
        const noDataContainer = document.querySelector('.tpi-cc--no-ds-data-container');
        if (noDataContainer) {
            noDataContainer.setAttribute('tpi-current-state', 'error');
            
            const descriptionBlock = document.querySelector('.tpi-cc--no-ds-data-description');
            if (descriptionBlock) {
                descriptionBlock.innerHTML = `
                    <p class="tpi-cc--no-ds-data-description-block">Данные курьеров за выбранную дату ещё не существуют</p>
                    <p class="tpi-cc--no-ds-data-description-block-sub">Пожалуйста попробуйте позже, когда данные курьеров будут сформированы в ПИ</p>
                    <p class="tpi-cc--no-ds-data-description-block-sub">Окно для записи данных - с 23:00 по МСК, убедитесь, что у вас стоит верное время</p>
                `;
            }
            
            // Скрываем кнопку "Начать"
            const startButton = document.querySelector('.tpi-cc--no-ds-data-start');
            if (startButton) {
                startButton.style.display = 'none';
            }
        }
        
        window.dataCapturingFlag = false;
    }
}

function tpi_cc_filteringColumnData() {
    const table = document.querySelector('table.tpi-cc--table-data-output');
    if (!table) return;

    const oldHandler = table._tpiSortHandler;
    if (oldHandler) {
        table.removeEventListener('click', oldHandler);
    }

    function handleTableClick(event) {
        const headerItem = event.target.closest('.tpi-cc--table-thead-item');
        if (!headerItem) return;
        if (headerItem.hasAttribute('tpi-cc-filters-not-allowed')) {
            return;
        }
        
        const targetDiv = headerItem.querySelector('div.tpi-cc--table-thead-data');
        if (!targetDiv) return;
        
        const currentState = targetDiv.getAttribute('tpi-current-state');
        const columnIndex = Array.from(headerItem.parentElement.children).indexOf(headerItem);
        let nextState = null;
        
        // Проверяем, нажимаем ли мы на тот же столбец
        const isSameColumn = tpi_cc_currentFilterColumn === columnIndex;
        
        if (!currentState) {
            nextState = 'filtered-down';
            tpi_cc_currentFilterDirection = 'down';
        } else if (currentState === 'filtered-down') {
            nextState = 'filtered-up';
            tpi_cc_currentFilterDirection = 'up';
        }
        
        // Сбрасываем все фильтры перед применением нового
        document.querySelectorAll('div.tpi-cc--table-thead-data[tpi-current-state]').forEach(div => {
            div.removeAttribute('tpi-current-state');
        });
        
        // Сбрасываем визуальные эффекты
        document.querySelectorAll('td.tpi-cc--table-tbody-item[tpi-current-state]').forEach(td => {
            td.removeAttribute('tpi-current-state');
        });
        
        if (nextState) {
            // Устанавливаем новый фильтр
            targetDiv.setAttribute('tpi-current-state', nextState);
            tpi_cc_currentFilterColumn = columnIndex;
            
            // Сортируем таблицу по выбранному столбцу
            sortTableByColumnMove(columnIndex, nextState);
            
        } else {
            // Если фильтр снят
            tpi_cc_currentFilterColumn = null;
            tpi_cc_currentFilterDirection = null;
            // Восстанавливаем исходный порядок
            restoreOriginalRowOrder();
        }
    }
    
    // Сохраняем обработчик для возможного удаления
    table._tpiSortHandler = handleTableClick;
    
    // Вешаем обработчик события только один раз
    table.addEventListener('click', handleTableClick);
    
    // Помечаем, что сортировка инициализирована
    tpi_cc_tableSortInitialized = true;
    console.log('✅ Обработчик сортировки таблицы добавлен');
}

function toggle_ActionProcessContainer(state){
    const actionProcessContainer = document.querySelector('.tpi-cc-process-manager-wrapper');
    
    if (!actionProcessContainer) {
        console.warn('Элемент .tpi-cc-process-manager-wrapper не найден');
        return;
    }
    
    const actionAttributeState = actionProcessContainer.getAttribute('tpi-current-state');
    
    if (state === "show" && actionAttributeState === 'hidden') {
        actionProcessContainer.style.display = 'flex';
        setTimeout(() => {
            actionProcessContainer.setAttribute('tpi-current-state', 'shown');
        }, 2);
    } else if (state === "hide" && actionAttributeState === 'shown') {
        actionProcessContainer.setAttribute('tpi-current-state', 'hidden');
        setTimeout(() => {
            actionProcessContainer.style.display = 'none';
        }, 400);
    }
}

function update_ActionProcessContainer(){
    const tpi_cc_selected_carts = document.querySelector('div.tpi-cc-process-data-item:has(p.tpi-cc-process-data-item-text.tpi-cc-data-cart-amount)');
    const tpi_cc_selected_pallets = document.querySelector('div.tpi-cc-process-data-item:has(p.tpi-cc-process-data-item-text.tpi-cc-data-pallet-amount)');
    const tpi_cc_selected_data_carts = document.querySelector('p.tpi-cc-process-data-item-text.tpi-cc-data-cart-amount span');
    const tpi_cc_selected_data_pallets = document.querySelector('p.tpi-cc-process-data-item-text.tpi-cc-data-pallet-amount span');

    // Считаем только НЕЗАБЛОКИРОВАННЫЕ выбранные кнопки
    const tpi_cc_cart_amount = document.querySelectorAll('.tpi-cc-table-tbody-data-cart-id[tpi-cc-selected-courier-cell]:not([tpi-cc-button-is-blocked])');
    const tpi_cc_pallet_amount = document.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id[tpi-cc-selected-courier-cell]:not([tpi-cc-button-is-blocked])');
    
    let hasSelected = false;
    
    if (tpi_cc_selected_data_carts) {
        tpi_cc_selected_data_carts.innerText = tpi_cc_cart_amount.length;
        
        if (tpi_cc_cart_amount.length > 0) {
            tpi_cc_selected_data_carts.style.color = '#fc0';
            tpi_cc_selected_carts.style.height = '.8rem'
            tpi_cc_selected_carts.style.opacity = '1'
            hasSelected = true;
        } else {
            tpi_cc_selected_data_carts.style.color = '';
            tpi_cc_selected_carts.style.height = '0rem'
            tpi_cc_selected_carts.style.opacity = '0'
        }
    }
    
    if (tpi_cc_selected_data_pallets) {
        tpi_cc_selected_data_pallets.innerText = tpi_cc_pallet_amount.length;
        
        if (tpi_cc_pallet_amount.length > 0) {
            tpi_cc_selected_data_pallets.style.color = '#fc0';
            tpi_cc_selected_pallets.style.height = '.8rem'
            tpi_cc_selected_pallets.style.opacity = '1'
            hasSelected = true;
        } else {
            tpi_cc_selected_data_pallets.style.color = '';
            tpi_cc_selected_pallets.style.height = '0rem'
            tpi_cc_selected_pallets.style.opacity = '0'
        }
    }
    
    if (hasSelected) {
        toggle_ActionProcessContainer("show");
    } else {
        toggle_ActionProcessContainer("hide");
    }
}

// B-
// B-
// B-   CALENDAR
// B-
// B-

// Функция для массовой проверки существования данных в Firebase
async function tpiCheckMultipleDatesInFirebase(dateStrings) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return {};
        }
        
        console.log(`🔍 Массовая проверка ${dateStrings.length} дат в Firebase...`);
        
        const results = {};
        const batchSize = 10;
        
        // 🔥 РАЗДЕЛЯЕМ ДАТЫ НА КЭШИРОВАННЫЕ И НОВЫЕ
        const datesToCheck = [];
        
        dateStrings.forEach(dateStr => {
            // Если дата уже есть в кэше, используем её
            if (window.tpiCalendarDatesCache && window.tpiCalendarDatesCache[dateStr] !== undefined) {
                const cachedStatus = window.tpiCalendarDatesCache[dateStr];
                results[dateStr] = { 
                    exists: cachedStatus === 'has-bd-data',
                    hasCartPalletData: cachedStatus === 'has-bd-data'
                };
            } else {
                datesToCheck.push(dateStr);
            }
        });
        
        console.log(`📊 Из кэша: ${Object.keys(results).length}, нужно проверить: ${datesToCheck.length}`);
        
        // Если нет дат для проверки - сразу возвращаем результат
        if (datesToCheck.length === 0) {
            return results;
        }
        
        // Проверяем только новые даты
        for (let i = 0; i < datesToCheck.length; i += batchSize) {
            const batch = datesToCheck.slice(i, i + batchSize);
            
            const promises = batch.map(async (dateStr) => {
                try {
                    const dateParts = dateStr.split('/');
                    if (dateParts.length !== 3) {
                        return { dateStr, exists: false };
                    }
                    
                    const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
                    
                    const dateDoc = await dateDocRef.get();
                    
                    if (!dateDoc.exists) {
                        return { dateStr, exists: false };
                    }
                    
                    const cartControlRef = dateDocRef.collection("cartControl");
                    const cartControlSnapshot = await cartControlRef.get();
                    
                    return { 
                        dateStr, 
                        exists: !cartControlSnapshot.empty,
                        hasData: !cartControlSnapshot.empty,
                        count: cartControlSnapshot.size
                    };
                    
                } catch (error) {
                    console.warn(`💥 Ошибка проверки даты ${dateStr}:`, error);
                    return { dateStr, exists: false };
                }
            });
            
            try {
                const batchResults = await Promise.all(promises);
                
                batchResults.forEach(result => {
                    results[result.dateStr] = { 
                        exists: result.exists,
                        hasCartPalletData: false
                    };
                    
                    // Сразу обновляем кэш
                    if (window.tpiCalendarDatesCache) {
                        window.tpiCalendarDatesCache[result.dateStr] = result.exists ? 'has-bd-data' : 'no-bd-data';
                    }
                });
                
            } catch (error) {
                console.warn('💥 Ошибка при выполнении батча:', error);
                batch.forEach(dateStr => {
                    results[dateStr] = { exists: false, hasCartPalletData: false };
                    
                    // Обновляем кэш даже при ошибке
                    if (window.tpiCalendarDatesCache) {
                        window.tpiCalendarDatesCache[dateStr] = 'no-bd-data';
                    }
                });
            }
            
            if (i + batchSize < datesToCheck.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        console.log(`✅ Массовая проверка завершена, проверено ${Object.keys(results).length} дат`);
        return results;
        
    } catch (error) {
        console.warn('💥 Ошибка при массовой проверке данных в Firebase:', error);
        return {};
    }
}

function initializeDatePicker() {
    const searchDateButton = document.querySelector('.tpi-cc-search-date');
    const selectedDateElement = document.getElementById('tpi-cc-seleceted-date');
    
    if (!searchDateButton) return;
    
    // Устанавливаем дату с учетом времени суток
    const now = new Date();
    const currentHour = now.getHours();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let targetDate = today;
    if (currentHour >= 23) {
        targetDate = tomorrow;
    }
    
    const formattedTarget = formatDateToDDMMYYYY(targetDate);
    selectedDateElement.textContent = formattedTarget;
    searchDateButton.setAttribute('tpi-cc-selected-date-value', formattedTarget);
    
    console.log(`📅 Начальная дата календаря: ${formattedTarget} (час: ${currentHour})`);
    
    // Создаем и добавляем контейнер календаря
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'tpi-cc-calendar-container';
    calendarContainer.style.display = 'none';
    
    searchDateButton.parentNode.appendChild(calendarContainer);
    
    // Переменные для хранения выбранной даты
    let selectedDate = targetDate;
    
    // Функция для открытия календаря с ожиданием предзагрузки
    async function openCalendar() {
        try {
            // Показываем лоадер в календаре
            calendarContainer.innerHTML = `
                <div class="tpi-cc-calendar-loading">
                    <div class="tpi-cc-calendar-loading-spinner"></div>
                    <p>Загрузка данных календаря...</p>
                </div>
            `;
            calendarContainer.style.display = 'block';
            
            // Ждем завершения предзагрузки данных календаря
            await preloadCalendarData();
            
            // Получаем выбранную дату
            const selectedDateStr = searchDateButton.getAttribute('tpi-cc-selected-date-value');
            
            // Обновляем календарь с текущей выбранной датой
            await createCalendar(calendarContainer, new Date(), selectedDate, selectedDateStr);
            
            // Показываем календарь с анимацией
            setTimeout(() => {
                calendarContainer.setAttribute('tpi-current-animation', 'shown');
                searchDateButton.setAttribute('tpi-current-state', 'active');
            }, 1);
            
            // Генерируем событие открытия календаря
            const calendarOpenedEvent = new CustomEvent('tpi-calendar-opened');
            document.dispatchEvent(calendarOpenedEvent);
            
        } catch (error) {
            console.warn('Ошибка открытия календаря:', error);
            calendarContainer.innerHTML = `
                <div class="tpi-cc-calendar-error">
                    <p>Не удалось загрузить календарь</p>
                    <button class="tpi-cc-calendar-retry">Повторить</button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки повтора
            const retryButton = calendarContainer.querySelector('.tpi-cc-calendar-retry');
            if (retryButton) {
                retryButton.addEventListener('click', openCalendar);
            }
        }
    }
    
    // Добавьте эту функцию для закрытия всех выпадающих списков
    function closeAllDropdowns() {
        document.querySelectorAll('.tpi-cc-dropdown-container').forEach(dropdown => {
            if (dropdown.style.display === 'block') {
                dropdown.removeAttribute('tpi-current-animation');
                setTimeout(() => {
                    dropdown.style.display = 'none';
                    const button = dropdown.parentNode.querySelector('.tpi-cc-search-dropdown');
                    if (button) {
                        button.removeAttribute('tpi-current-state');
                    }
                }, 200);
            }
        });
    }
    
    // Функция для закрытия календаря
    function closeCalendar() {
        if (calendarContainer.style.display === 'none') return;
        
        calendarContainer.removeAttribute('tpi-current-animation');
        searchDateButton.removeAttribute('tpi-current-state')
        
        // Через 200мс скрываем и удаляем атрибут
        setTimeout(() => {
            calendarContainer.style.display = 'none';
        }, 200);
    }
    
    // Создаем календарь с передачей выбранной даты
    const initialDateStr = searchDateButton.getAttribute('tpi-cc-selected-date-value');
    createCalendar(calendarContainer, today, selectedDate, initialDateStr);
    
    // Обработчик клика на кнопку
    searchDateButton.addEventListener('click', function(event) {
        event.stopPropagation();
        
        const isVisible = calendarContainer.style.display === 'block';
        
        // Скрываем все открытые календари
        document.querySelectorAll('.tpi-cc-calendar-container').forEach(cal => {
            if (cal !== calendarContainer) {
                closeCalendarElement(cal);
            }
        });
        
        if (!isVisible) {
            openCalendar();
        } else {
            closeCalendar();
        }
    });
    
    // Закрываем календарь при клике вне его
    document.addEventListener('click', function(event) {
        if (!calendarContainer.contains(event.target) && 
            !searchDateButton.contains(event.target) &&
            calendarContainer.style.display === 'block') {
            closeCalendar();
        }
    });
    
    // Функция для закрытия другого элемента календаря
    function closeCalendarElement(element) {
        if (element.style.display === 'none') return;
        
        element.removeAttribute('tpi-current-animation');
        searchDateButton.removeAttribute('tpi-current-state')
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 200);
    }
    
    // Слушаем событие изменения даты
    document.addEventListener('tpi-date-changed', function(event) {
        if (event.detail && event.detail.date) {
            // Немедленно показываем лоадер
            showTableLoader(true);
            
            // Немедленно очищаем таблицу
            const tpi_cc_tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
            if (tpi_cc_tableBody) {
                tpi_cc_tableBody.innerHTML = '';
            }
            
            // Сбрасываем флаг загрузки
            window.dataCapturingFlag = false;
            
            // Обновляем видимость кнопок печати
            updatePrintButtonsVisibility();
            
            // Сразу запускаем проверку данных
        }
    });

    // Проверяем данные при изменении даты
    document.addEventListener('tpi-date-changed', async function(event) {
        if (event.detail && event.detail.date) {
            // Немедленно показываем лоадер
            showTableLoader(true);
            
            // Немедленно очищаем таблицу
            const tpi_cc_tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
            if (tpi_cc_tableBody) {
                tpi_cc_tableBody.innerHTML = '';
            }
            
            // Сбрасываем флаг загрузки
            window.dataCapturingFlag = false;
            
            // Сразу запускаем проверку данных (без задержки)
            await tpiCheckAndLoadData();
        }
    });
}

function updateCalendarDateStatus(dateStr, status) {
    const calendarDays = document.querySelectorAll('.tpi-cc-calendar-day:not(.empty)');
    if (!calendarDays.length) return;
    
    const dateParts = dateStr.split('/');
    const targetDate = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0])
    );
    
    calendarDays.forEach(dayElement => {
        const day = parseInt(dayElement.textContent);
        const calendarDate = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            day
        );
        
        if (calendarDate.getTime() === targetDate.getTime()) {
            // Удаляем все статусные классы
            dayElement.classList.remove(
                'tpi-cc-has-bd-data',
                'tpi-cc-no-bd-data',
                'tpi-cc-available-to-write-bd-data',
                'tpi-cc-future-date'
            );
            
            // Добавляем новый статус
            if (status === 'has-bd-data') {
                dayElement.classList.add('tpi-cc-has-bd-data');
                dayElement.setAttribute('tpi-tooltip-data', 'Записи есть')
            } else if (status === 'available-to-write-bd-data') {
                dayElement.classList.add('tpi-cc-available-to-write-bd-data');
                dayElement.setAttribute('tpi-tooltip-data', 'Доступно для записи')
            }
        }
    });
}

function getDateStatusForCalendar(dateStr, targetDate) {
    const now = new Date();
    const currentHour = now.getHours();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateToCheck = new Date(targetDate);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Вычисляем разницу в днях
    const timeDiff = dateToCheck.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // 1. Проверяем глобальный кэш (самый быстрый способ)
    if (window.tpiCalendarDatesCache && window.tpiCalendarDatesCache[dateStr] !== undefined) {
        return window.tpiCalendarDatesCache[dateStr];
    }
    
    // 2. Быстрая логика на основе времени
    if (diffDays < 0) {
        // Прошлые даты
        return 'no-bd-data';
    } else if (diffDays === 0) {
        // Сегодня - всегда можно записать, если нет данных
        return 'available-to-write-bd-data'; // Всегда доступно
    } else if (diffDays === 1) {
        // Завтра - доступно только после 23:00
        return currentHour >= 23 ? 'available-to-write-bd-data' : 'future-date';
    } else {
        // Будущие даты (больше чем завтра)
        return 'future-date';
    }
}

// Асинхронная функция для проверки статусов дат в конкретном месяце с прогрессом
async function checkMonthDatesStatus(year, month) {
    const monthKey = `${year}-${month}`;
    
    // Если месяц уже проверялся, используем кэш
    if (window.tpiCalendarMonthCache && window.tpiCalendarMonthCache[monthKey]) {
        if (DEBUG_CALENDAR) {
            console.log(`📅 Используем кэшированные данные для месяца ${monthKey}`);
        }
        return window.tpiCalendarMonthCache[monthKey];
    }
    
    if (DEBUG_CALENDAR) {
        console.log(`📅 Проверяем актуальные даты в месяце ${monthKey}...`);
    }
    
    const monthStatuses = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentHour = new Date().getHours();
    
    // Получаем первый и последний день месяца
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Собираем все даты месяца
    const allDatesInMonth = [];
    let currentDate = new Date(firstDay);
    
    while (currentDate <= lastDay) {
        const dateStr = formatDateToDDMMYYYY(new Date(currentDate));
        allDatesInMonth.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 🔥 ВАЖНО: Сначала заполняем из глобального кэша ВСЕ даты
    const datesToCheck = [];
    
    allDatesInMonth.forEach(dateStr => {
        // Проверяем глобальный кэш
        if (window.tpiCalendarDatesCache && window.tpiCalendarDatesCache[dateStr] !== undefined) {
            monthStatuses[dateStr] = window.tpiCalendarDatesCache[dateStr];
        } else {
            // Если нет в кэше - будем проверять
            datesToCheck.push(dateStr);
        }
    });
    
    // Если есть даты для проверки, делаем массовый запрос
    if (datesToCheck.length > 0) {
        if (DEBUG_CALENDAR) {
            console.log(`🔍 Проверяем ${datesToCheck.length} дат в месяце массовым запросом...`);
        }
        
        // Используем массовую проверку
        const firebaseResults = await tpiCheckMultipleDatesInFirebase(datesToCheck);
        
        // Обрабатываем результаты
        datesToCheck.forEach(dateStr => {
            const result = firebaseResults[dateStr] || { exists: false, hasCartPalletData: false };
            
            const dateParts = dateStr.split('/');
            const checkDate = new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
            );
            checkDate.setHours(0, 0, 0, 0);
            
            const timeDiff = checkDate.getTime() - today.getTime();
            const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            let status;
            if (result.exists) {
                status = 'has-bd-data';
            } else {
                if (diffDays < 0) {
                    status = 'no-bd-data';
                } else if (diffDays === 0) {
                    status = 'available-to-write-bd-data';
                } else if (diffDays === 1) {
                    status = (currentHour >= 23) ? 'available-to-write-bd-data' : 'future-date';
                } else {
                    status = 'future-date';
                }
            }
            
            monthStatuses[dateStr] = status;
            
            // Обновляем глобальный кэш
            if (window.tpiCalendarDatesCache) {
                window.tpiCalendarDatesCache[dateStr] = status;
            }
        });
    }
    
    // Заполняем оставшиеся даты (которые уже были в кэше) - хотя они уже заполнены выше
    allDatesInMonth.forEach(dateStr => {
        if (!monthStatuses[dateStr] && window.tpiCalendarDatesCache && window.tpiCalendarDatesCache[dateStr]) {
            monthStatuses[dateStr] = window.tpiCalendarDatesCache[dateStr];
        }
    });
    
    // Сохраняем результат в кэш месяца
    if (window.tpiCalendarMonthCache) {
        window.tpiCalendarMonthCache[monthKey] = monthStatuses;
    }
    
    if (DEBUG_CALENDAR) {
        console.log(`✅ Проверка месяца ${monthKey} завершена, всего дат: ${Object.keys(monthStatuses).length}`);
    }
    
    return monthStatuses;
}
function applyStatusToDayElement(dayElement, status) {
    // Удаляем все статусные классы
    dayElement.classList.remove(
        'tpi-cc-has-bd-data',
        'tpi-cc-no-bd-data',
        'tpi-cc-available-to-write-bd-data',
        'tpi-cc-future-date'
    );
    
    // Добавляем новый класс в зависимости от статуса
    if (status === 'has-bd-data') {
        dayElement.classList.add('tpi-cc-has-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Записи есть')
    } else if (status === 'no-bd-data') {
        dayElement.classList.add('tpi-cc-no-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Нет записей')
    } else if (status === 'available-to-write-bd-data') {
        dayElement.classList.add('tpi-cc-available-to-write-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Доступно для записи')
    } else if (status === 'future-date') {
        dayElement.classList.add('tpi-cc-future-date');
        dayElement.setAttribute('tpi-tooltip-data', 'Дата недоступна')
    }
}

// Функция для создания календаря
function createCalendar(container, currentDisplayDate, currentSelectedDate, selectedDateStr) {
    let currentMonth = currentDisplayDate.getMonth();
    let currentYear = currentDisplayDate.getFullYear();
    
    async function renderCalendar() {
        container.innerHTML = '';
        
        // Заголовок календаря
        const header = document.createElement('div');
        header.className = 'tpi-cc-calendar-header';
        
        // Кнопка предыдущего месяца
        const prevButton = document.createElement('button');
        prevButton.innerHTML = tpi_cc_i_chevron_left;
        prevButton.className = 'tpi-cc-calendar-nav';
        prevButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            
            await renderCalendar();
        });
        
        // Отображение текущего месяца и года
        const monthYear = document.createElement('div');
        monthYear.className = 'tpi-cc-calendar-month-year';
        monthYear.textContent = getMonthName(currentMonth) + ' ' + currentYear;
        
        // Кнопка следующего месяца
        const nextButton = document.createElement('button');
        nextButton.innerHTML = tpi_cc_i_chevron_right;
        nextButton.className = 'tpi-cc-calendar-nav';
        nextButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            
            await renderCalendar();
        });
        
        header.appendChild(prevButton);
        header.appendChild(monthYear);
        header.appendChild(nextButton);
        container.appendChild(header);
        
        // Дни недели
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const weekDaysRow = document.createElement('div');
        weekDaysRow.className = 'tpi-cc-calendar-weekdays';

        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'tpi-cc-calendar-weekday';
            
            if (day === 'Пн') {
                dayElement.setAttribute('tpi-tooltip-data', 'Угадайте, кто же чёрт ?)');
            }
            
            weekDaysRow.appendChild(dayElement);
        });
        
        container.appendChild(weekDaysRow);
        
        // Дни месяца - ОТРИСОВЫВАЕМ СРАЗУ
        const daysGrid = document.createElement('div');
        daysGrid.className = 'tpi-cc-calendar-days';
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Пустые ячейки для первых дней
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'tpi-cc-calendar-day empty';
            daysGrid.appendChild(emptyCell);
        }
        
        // Создаем элементы дней БЕЗ статусов (только числа)
        const dayElements = {};
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('button');
            dayElement.textContent = day;
            dayElement.className = 'tpi-cc-calendar-day';
            
            const cellDate = new Date(currentYear, currentMonth, day);
            const dateStr = formatDateToDDMMYYYY(cellDate);
            
            // Сохраняем ссылку на элемент
            dayElements[dateStr] = dayElement;
            
            // Показываем индикатор загрузки для дат, которых нет в кэше
            if (!window.tpiCalendarDatesCache || window.tpiCalendarDatesCache[dateStr] === undefined) {
                dayElement.classList.add('tpi-cc-calendar-loading');
            }
            
            // Проверяем, является ли этот день сегодняшним
            const isToday = cellDate.getTime() === today.getTime();
            
            // Проверяем, является ли этот день выбранным
            let isSelected = false;
            if (selectedDateStr) {
                const selectedDateParts = selectedDateStr.split('/');
                const selectedDate = new Date(
                    parseInt(selectedDateParts[2]),
                    parseInt(selectedDateParts[1]) - 1,
                    parseInt(selectedDateParts[0])
                );
                selectedDate.setHours(0, 0, 0, 0);
                isSelected = cellDate.getTime() === selectedDate.getTime();
            }
            
            // Подсвечиваем сегодняшний день (если он не выбран)
            if (isToday && !isSelected) {
                dayElement.classList.add('today');
            }
            
            // Подсвечиваем выбранный день (включая текущий, если он выбран)
            if (isSelected) {
                dayElement.classList.add('selected');
                dayElement.setAttribute('disabled', '');
            }
            
            // Сохраняем дату в элементе
            dayElement.dataset.date = dateStr;
            dayElement.dataset.cellDate = cellDate.toISOString();
            
            // Добавляем обработчик выбора даты
            dayElement.addEventListener('click', async (e) => {
                e.stopPropagation();
                
                // Получаем текущий статус даты
                const currentStatus = window.tpiCalendarDatesCache ? window.tpiCalendarDatesCache[dateStr] : null;
                
                // Проверяем, можно ли выбрать эту дату
                const canSelect = currentStatus !== 'no-bd-data' && 
                                  currentStatus !== 'future-date' &&
                                  !dayElement.classList.contains('tpi-cc-calendar-loading');
                
                if (!canSelect) {
                    // Показываем подсказку почему нельзя выбрать
                    if (currentStatus === 'no-bd-data') {
                        console.log('Нельзя выбрать прошлую дату без данных');
                    } else if (currentStatus === 'future-date') {
                        console.log('Эта дата еще недоступна для записи');
                    } else if (dayElement.classList.contains('tpi-cc-calendar-loading')) {
                        console.log('Данные все еще загружаются...');
                    }
                    return;
                }
                
                const newSelectedDate = new Date(currentYear, currentMonth, day);
                
                // Обновляем глобальную переменную выбранной даты
                window.tpiSelectedDate = newSelectedDate;
                
                const formattedDate = formatDateToDDMMYYYY(newSelectedDate);
                
                // Обновляем отображение выбранной даты
                const selectedDateElement = document.getElementById('tpi-cc-seleceted-date');
                const searchDateButton = document.querySelector('.tpi-cc-search-date');
                
                selectedDateElement.textContent = formattedDate;
                searchDateButton.setAttribute('tpi-cc-selected-date-value', formattedDate);
                
                // Пересоздаем календарь с новой выбранной датой
                await createCalendar(container, new Date(currentYear, currentMonth, 1), newSelectedDate, formattedDate);
                
                // Триггерим событие изменения даты
                const dateChangeEvent = new CustomEvent('tpi-date-changed', {
                    detail: { 
                        date: newSelectedDate, 
                        formattedDate: formattedDate 
                    }
                });
                document.dispatchEvent(dateChangeEvent);
            });
            
            daysGrid.appendChild(dayElement);
        }
        
        container.appendChild(daysGrid);
        
        // ЗАПУСКАЕМ АСИНХРОННУЮ ПРОВЕРКУ СТАТУСОВ ПОСЛЕ ОТРИСОВКИ
        setTimeout(async () => {
            try {
                // Получаем статусы для текущего месяца
                const monthStatuses = await checkMonthDatesStatus(currentYear, currentMonth);
                
                // Применяем статусы к элементам
                Object.keys(monthStatuses).forEach(dateStr => {
                    const dayElement = dayElements[dateStr];
                    if (dayElement) {
                        // Убираем индикатор загрузки
                        dayElement.classList.remove('tpi-cc-calendar-loading');
                        
                        // Применяем статус
                        const status = monthStatuses[dateStr];
                        applyStatusToDayElement(dayElement, status);
                    }
                });
                
            } catch (error) {
                console.warn('Ошибка при проверке статусов дат:', error);
                
                // В случае ошибки убираем индикаторы загрузки
                Object.values(dayElements).forEach(dayElement => {
                    dayElement.classList.remove('tpi-cc-calendar-loading');
                });
            }
        }, 0);
    }
    
    renderCalendar();
}

function updateDayElementStatus(dayElement, status) {
    // Удаляем все статусные классы
    dayElement.classList.remove(
        'tpi-cc-has-bd-data',
        'tpi-cc-no-bd-data',
        'tpi-cc-available-to-write-bd-data',
        'tpi-cc-future-date'
    );
    
    // Добавляем новый класс
    if (status === 'has-bd-data') {
        dayElement.classList.add('tpi-cc-has-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Записи есть')
    } else if (status === 'no-bd-data') {
        dayElement.classList.add('tpi-cc-no-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Нет записей')
    } else if (status === 'available-to-write-bd-data') {
        dayElement.classList.add('tpi-cc-available-to-write-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Доступно для записи')
    } else if (status === 'future-date') {
        dayElement.classList.add('tpi-cc-future-date');
        dayElement.setAttribute('tpi-tooltip-data', 'Дата недоступна')
    }
}

function updateCalendarCacheForDate(dateStr) {
    // Обновляем глобальный кэш
    tpiCalendarDatesCache[dateStr] = 'has-bd-data';
    
    // Также обновляем локальный кэш если он существует
    if (typeof calendarDatesCache !== 'undefined') {
        // Находим ключ для этой даты в локальном кэше
        const dateParts = dateStr.split('/');
        if (dateParts.length === 3) {
            const date = new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
            );
            const cacheKey = `${dateStr}-${date.getFullYear()}-${date.getMonth()}`;
            calendarDatesCache[cacheKey] = 'has-bd-data';
        }
    }
    
    // Находим и обновляем элемент в DOM если он существует
    updateCalendarDayStatus(dateStr, 'has-bd-data');
}


function updateCalendarDayStatus(dateStr, status) {
    const dayElement = document.querySelector(`.tpi-cc-calendar-day[data-date="${dateStr}"]`);
    if (!dayElement) return;
    
    // Удаляем все статусные классы
    dayElement.classList.remove(
        'tpi-cc-has-bd-data',
        'tpi-cc-no-bd-data',
        'tpi-cc-available-to-write-bd-data',
        'tpi-cc-future-date',
        'tpi-cc-calendar-pending'
    );
    
    // Добавляем новый класс
    if (status === 'has-bd-data') {
        dayElement.classList.add('tpi-cc-has-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Записи есть')
    } else if (status === 'no-bd-data') {
        dayElement.classList.add('tpi-cc-no-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Нет записей')
    } else if (status === 'available-to-write-bd-data') {
        dayElement.classList.add('tpi-cc-available-to-write-bd-data');
        dayElement.setAttribute('tpi-tooltip-data', 'Доступно для записи')
    } else if (status === 'future-date') {
        dayElement.classList.add('tpi-cc-future-date');
        dayElement.setAttribute('tpi-tooltip-data', 'Дата недоступна')
    }
}

// Вспомогательные функции
function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getMonthName(monthIndex) {
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[monthIndex];
}

// B- Выпадающий список с чекбоксами (универсальный компонент)
// B- Выпадающий список с чекбоксами (универсальный компонент)
function createDropdownCheckboxFilter(dropdownButton, options, config = {}) {
    // Конфигурация по умолчанию
    const defaultConfig = {
        placeholder: 'Выберите значения',
        selectAllText: 'Выбрать все',
        nothingFoundText: 'Ничего не найдено',
        showCountInInput: true,
        multiple: true,
        allowFiltering: true,
        closeOnSelect: false // По умолчанию не закрываем при выборе
    };
    
    const cfg = { ...defaultConfig, ...config };
    
    // Проверяем, что передан правильный элемент
    if (!dropdownButton || !(dropdownButton instanceof HTMLElement)) {
        console.warn('Dropdown button element is required');
        return null;
    }
    
    // Проверяем options
    if (!Array.isArray(options) || options.length === 0) {
        console.warn('Options array is required');
        return null;
    }
    
    // Создаем контейнер для выпадающего списка
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'tpi-cc-dropdown-container';
    dropdownContainer.style.display = 'none';
    
    // Находим ближайший .tpi-cc-filters-item для правильного позиционирования
    const filterItem = dropdownButton.closest('.tpi-cc-filters-item');
    if (!filterItem) {
        console.warn('Could not find parent filter item');
        return null;
    }
    
    // Вставляем контейнер после фильтра
    filterItem.appendChild(dropdownContainer);
    
    // Состояние компонента
    let selectedOptions = [];
    let allOptions = [...options];
    let isOpen = false;
    let filteredOptions = [...allOptions];
    let searchTerm = '';
    let lastFocusTime = 0;
    let focusTimeout = null;
    let isFirstOpen = true; // Флаг первого открытия
    
    // Инициализируем все опции как выбранные, если multiple = true
    if (cfg.multiple) {
        selectedOptions = [...options];
    }
    
    // Получаем элемент ввода
    const input = dropdownButton.querySelector('input');
    if (!input) {
        console.warn('Input element not found inside dropdown button');
        return null;
    }
    
    // Сохраняем оригинальный текст
    const originalText = input.value || cfg.placeholder;
    input.setAttribute('data-original-value', originalText);
    
    // Функция для рендеринга выпадающего списка
    function renderDropdown() {
        dropdownContainer.innerHTML = '';
        
        // Контейнер для опций
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'tpi-cc-dropdown-options';
        
        // Добавляем чекбокс "Выбрать все" только для множественного выбора и если есть отфильтрованные опции
        if (cfg.multiple && filteredOptions.length > 0) {
            // Рассчитываем количество выбранных в отфильтрованных опций
            const filteredSelected = selectedOptions.filter(opt => 
                filteredOptions.some(fopt => fopt.value === opt.value)
            ).length;
            const allFilteredSelected = filteredSelected === filteredOptions.length;
            
            const selectAllItem = createSelectAllItem(allFilteredSelected);
            optionsContainer.appendChild(selectAllItem);
            
            // Добавляем разделитель
            const separator = document.createElement('div');
            separator.className = 'tpi-cc-dropdown-separator';
            optionsContainer.appendChild(separator);
        }
        
        // Добавляем опции или сообщение "Ничего не найдено"
        if (filteredOptions.length === 0) {
            // Показываем сообщение "Ничего не найдено"
            const nothingFoundEl = document.createElement('div');
            nothingFoundEl.className = 'tpi-cc-dropdown-nothing';
            nothingFoundEl.textContent = cfg.nothingFoundText;
            optionsContainer.appendChild(nothingFoundEl);
        } else {
            // Создаем обертку для всех остальных элементов
            const otherItemsWrapper = document.createElement('div');
            otherItemsWrapper.className = 'tpi-cc-dropdown-item-wrapper';
            
            filteredOptions.forEach(option => {
                const isSelected = selectedOptions.some(
                    selected => selected.value === option.value
                );
                
                const optionItem = createOptionItem(option, isSelected);
                otherItemsWrapper.appendChild(optionItem);
            });
            
            optionsContainer.appendChild(otherItemsWrapper);
        }
        
        dropdownContainer.appendChild(optionsContainer);
        
        // Обновляем счетчики статусов
        updateDropdownCounts(dropdownContainer);
    }
    
    // Функция для создания элемента "Выбрать все"
    function createSelectAllItem(isChecked) {
        const item = document.createElement('div');
        item.className = 'tpi-cc-dropdown-item';
        item.setAttribute('data-value', 'select-all');
        item.setAttribute('data-type', 'select-all');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `tpi-cc-dropdown-select-all-${Date.now()}`;
        checkbox.checked = isChecked;
        
        const checkboxCustom = document.createElement('div');
        checkboxCustom.className = 'tpi-cc-dropdown-checkbox-custom';
        
        const labelEl = document.createElement('div');
        labelEl.className = 'tpi-cc-dropdown-label';
        
        // Для "Выбрать все" используем обычный текст без дополнительной разметки
        const labelName = document.createElement('span');
        labelName.className = 'tpi-cc-dropdown-label-name';
        labelName.textContent = 'Выбрать все';
        
        labelEl.appendChild(labelName);
        
        item.appendChild(checkbox);
        item.appendChild(checkboxCustom);
        item.appendChild(labelEl);
        
        // Обработчик клика
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                if (checkbox.checked) {
                    // Снимаем выделение со ВСЕХ отфильтрованных опций
                    filteredOptions.forEach(option => {
                        selectedOptions = selectedOptions.filter(
                            selected => selected.value !== option.value
                        );
                    });
                } else {
                    // Выбираем ВСЕ отфильтрованные опции
                    filteredOptions.forEach(option => {
                        if (!selectedOptions.some(selected => selected.value === option.value)) {
                            selectedOptions.push(option);
                        }
                    });
                }
                // Обновляем состояние чекбоксов
                updateCheckboxStates();
            }
        });
        
        return item;
    }
    
    // Функция для создания элемента опции
    function createOptionItem(option, isSelected) {
        const item = document.createElement('div');
        item.className = 'tpi-cc-dropdown-item';
        item.setAttribute('data-value', option.value);
        item.setAttribute('data-type', 'option');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `tpi-cc-dropdown-${option.value}-${Date.now()}`;
        checkbox.checked = isSelected;
        
        const checkboxCustom = document.createElement('div');
        checkboxCustom.className = 'tpi-cc-dropdown-checkbox-custom';
        
        const labelEl = document.createElement('div');
        labelEl.className = 'tpi-cc-dropdown-label';
        
        // Создаем элементы для текста опции и количества
        const labelName = document.createElement('p');
        labelName.className = 'tpi-cc-dropdown-label-name';
        labelName.textContent = option.label;
        
        const labelAmount = document.createElement('span');
        labelAmount.className = 'tpi-cc-dropdown-label-amount';
        labelAmount.textContent = '0'; // Временное значение
        
        labelEl.appendChild(labelName);
        labelEl.appendChild(labelAmount);
        
        item.appendChild(checkbox);
        item.appendChild(checkboxCustom);
        item.appendChild(labelEl);
        
        // Обработчик клика
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                toggleOption(option, !checkbox.checked); // Инвертируем, так как состояние еще не обновилось
            }
        });
        
        return item;
    }
    
    // Функция для переключения опции
    function toggleOption(option, shouldSelect) {
        if (shouldSelect) {
            // Добавляем опцию
            if (cfg.multiple) {
                if (!selectedOptions.some(selected => selected.value === option.value)) {
                    selectedOptions.push(option);
                }
            } else {
                // Для одиночного выбора - только одна опция
                selectedOptions = [option];
            }
        } else {
            // Удаляем опцию
            selectedOptions = selectedOptions.filter(
                selected => selected.value !== option.value
            );
        }
        
        updateCheckboxStates();
        
        if (cfg.closeOnSelect && !cfg.multiple) {
            closeDropdown();
        }
    }
    
    // Функция для обновления состояния чекбоксов
    function updateCheckboxStates() {
        if (!isOpen) return;
        
        const optionsContainer = dropdownContainer.querySelector('.tpi-cc-dropdown-options');
        if (!optionsContainer) return;
        
        // Обновляем "Выбрать все" только если он есть
        const selectAllItem = optionsContainer.querySelector('.tpi-cc-dropdown-item[data-type="select-all"]');
        if (selectAllItem) {
            const selectAllCheckbox = selectAllItem.querySelector('input[type="checkbox"]');
            // Рассчитываем количество выбранных в отфильтрованном списке
            const filteredSelected = selectedOptions.filter(opt => 
                filteredOptions.some(fopt => fopt.value === opt.value)
            ).length;
            const allFilteredSelected = filteredSelected === filteredOptions.length && filteredOptions.length > 0;
            selectAllCheckbox.checked = allFilteredSelected;
        }
        
        // Обновляем опции
        const optionItems = optionsContainer.querySelectorAll('.tpi-cc-dropdown-item[data-type="option"]');
        optionItems.forEach(item => {
            const value = item.getAttribute('data-value');
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const isSelected = selectedOptions.some(
                    option => option.value === value
                );
                checkbox.checked = isSelected;
            }
        });
    }
    
    // Функция для обновления текста в инпуте
    function updateInputText() {
        // Подсчитываем активные опции (кроме "Выбрать все")
        const activeOptionsCount = selectedOptions.length;
        
        // Если ничего не выбрано, показываем placeholder
        if (activeOptionsCount === 0) {
            input.value = cfg.placeholder;
            input.setAttribute('data-original-value', cfg.placeholder);
        } 
        // Если выбраны все доступные опции
        else if (cfg.multiple && activeOptionsCount === allOptions.length) {
            input.value = 'Выбраны все';
            input.setAttribute('data-original-value', 'Выбраны все');
        } 
        // Если выбрано несколько
        else if (cfg.multiple && cfg.showCountInInput) {
            input.value = `Выбрано: ${activeOptionsCount}`;
            input.setAttribute('data-original-value', `Выбрано: ${activeOptionsCount}`);
        } 
        // Если одиночный выбор
        else if (!cfg.multiple && activeOptionsCount > 0) {
            input.value = selectedOptions[0].label;
            input.setAttribute('data-original-value', selectedOptions[0].label);
        } 
        // По умолчанию - показываем выбранные метки
        else {
            const labels = selectedOptions.map(opt => opt.label).join(', ');
            input.value = labels;
            input.setAttribute('data-original-value', labels);
        }
        
        // Генерируем событие изменения
        const changeEvent = new CustomEvent('tpi-dropdown-change', {
            detail: {
                selected: selectedOptions,
                allSelected: cfg.multiple && activeOptionsCount === allOptions.length
            }
        });
        dropdownButton.dispatchEvent(changeEvent);
    }
    
    // Функция для фильтрации опций на основе текста в инпуте
    function filterOptions() {
        const searchText = input.value.toLowerCase().trim();
        searchTerm = searchText;
        
        if (searchText === '') {
            filteredOptions = [...allOptions];
        } else {
            filteredOptions = allOptions.filter(option =>
                option.label.toLowerCase().includes(searchText)
            );
        }
        
        if (isOpen) {
            renderDropdown();
        }
    }
    
    // Функция для обработки фокуса с задержкой
    function handleFocusWithDelay() {
        const now = Date.now();
        const timeSinceLastFocus = now - lastFocusTime;
        
        // Очищаем предыдущий таймаут
        if (focusTimeout) {
            clearTimeout(focusTimeout);
            focusTimeout = null;
        }
        
        // Если прошло меньше 250ms с последнего фокуса
        if (timeSinceLastFocus < 250 && lastFocusTime > 0) {
            // Открываем немедленно
            immediateOpenDropdown();
        } else {
            // Открываем с небольшой задержкой
            focusTimeout = setTimeout(() => {
                if (!isOpen) {
                    openDropdown();
                }
                focusTimeout = null;
            }, 50);
        }
        
        lastFocusTime = now;
    }
    
    // Функция для немедленного открытия (без анимации закрытия)
    function immediateOpenDropdown() {
        if (isOpen) return;
        
        // Отменяем таймер закрытия, если он есть
        if (dropdownContainer._closeTimeout) {
            clearTimeout(dropdownContainer._closeTimeout);
            dropdownContainer._closeTimeout = null;
        }
        
        // Сбрасываем анимацию
        dropdownContainer.removeAttribute('tpi-current-animation');
        dropdownButton.removeAttribute('tpi-current-state');
        
        // Закрываем другие открытые выпадающие списки
        closeAllOtherDropdowns(dropdownContainer);
        // Также закрываем открытые календари
        closeAllCalendars();
        
        // Сбрасываем фильтр при открытии
        searchTerm = '';
        filteredOptions = [...allOptions];
        
        // Немедленно показываем выпадающий список
        dropdownContainer.style.display = 'block';
        
        // Для первого открытия даем время на рендеринг перед анимацией
        if (isFirstOpen) {
            isFirstOpen = false;
            // Рендерим содержимое
            renderDropdown();
            
            // Ждем следующего фрейма для гарантированной отрисовки DOM
            requestAnimationFrame(() => {
                // Даем браузеру время на отрисовку
                requestAnimationFrame(() => {
                    dropdownContainer.setAttribute('tpi-current-animation', 'shown');
                    dropdownButton.setAttribute('tpi-current-state', 'active');
                });
            });
        } else {
            // Рендерим содержимое
            renderDropdown();
            
            // Ждем следующего фрейма для отрисовки
            requestAnimationFrame(() => {
                dropdownContainer.setAttribute('tpi-current-animation', 'shown');
                dropdownButton.setAttribute('tpi-current-state', 'active');
            });
        }
        
        isOpen = true;
        
        // Очищаем инпут для поиска, только если это placeholder
        if (input.value === cfg.placeholder || 
            input.value === 'Выбраны все' || 
            input.value.startsWith('Выбрано: ')) {
            input.value = '';
        }
    }
    
    // Функция для открытия выпадающего списка
    function openDropdown() {
        if (isOpen) return;
        
        // Проверяем, идет ли анимация закрытия
        if (dropdownContainer._closeTimeout) {
            // Отменяем таймер закрытия
            clearTimeout(dropdownContainer._closeTimeout);
            dropdownContainer._closeTimeout = null;
            dropdownContainer.removeAttribute('tpi-current-animation');
            dropdownButton.removeAttribute('tpi-current-state');
        }
        
        // Закрываем другие открытые выпадающие списки
        closeAllOtherDropdowns(dropdownContainer);
        // Также закрываем открытые календари
        closeAllCalendars();
        
        // Сбрасываем фильтр при открытии
        searchTerm = '';
        filteredOptions = [...allOptions];
        
        // Показываем выпадающий список
        dropdownContainer.style.display = 'block';
        
        // Для первого открытия даем время на рендеринг
        if (isFirstOpen) {
            isFirstOpen = false;
            // Рендерим содержимое
            renderDropdown();
            
            // Ждем следующего фрейма для отрисовки
            requestAnimationFrame(() => {
                // Дополнительный фрейм для гарантии
                requestAnimationFrame(() => {
                    dropdownContainer.setAttribute('tpi-current-animation', 'shown');
                    dropdownButton.setAttribute('tpi-current-state', 'active');
                });
            });
        } else {
            // Рендерим содержимое
            renderDropdown();
            
            // Ждем следующего фрейма для отрисовки
            requestAnimationFrame(() => {
                dropdownContainer.setAttribute('tpi-current-animation', 'shown');
                dropdownButton.setAttribute('tpi-current-state', 'active');
            });
        }
        
        isOpen = true;
        
        // Очищаем инпут для поиска, только если это placeholder
        if (input.value === cfg.placeholder || 
            input.value === 'Выбраны все' || 
            input.value.startsWith('Выбрано: ')) {
            input.value = '';
        }
    }
    
    // Функция для закрытия выпадающего списка с проверкой фокуса
    function closeDropdown() {
        if (!isOpen) return;
        
        // Проверяем, находится ли инпут в фокусе
        const isInputFocused = document.activeElement === input;
        
        if (isInputFocused) {
            // Если инпут в фокусе, не закрываем выпадающий список
            // Вместо этого обновляем атрибут анимации для повторного показа
            dropdownContainer.removeAttribute('tpi-current-animation');
            dropdownButton.removeAttribute('tpi-current-state');
            
            // Через 10ms снова показываем анимацию
            setTimeout(() => {
                if (isOpen && document.activeElement === input) {
                    dropdownContainer.setAttribute('tpi-current-animation', 'shown');
                    dropdownButton.setAttribute('tpi-current-state', 'active');
                }
            }, 10);
            
            return; // Не закрываем выпадающий список
        }
        
        // Если инпут не в фокусе, продолжаем с закрытием
        dropdownContainer.removeAttribute('tpi-current-animation');
        dropdownButton.removeAttribute('tpi-current-state');
        
        // Мгновенно обновляем текст в инпуте
        updateInputText();
        
        // Сохраняем таймер для возможности отмены
        dropdownContainer._closeTimeout = setTimeout(() => {
            // Перед скрытием еще раз проверяем фокус
            const isStillFocused = document.activeElement === input;
            if (isStillFocused) {
                // Если инпут снова в фокусе, не скрываем
                dropdownContainer.setAttribute('tpi-current-animation', 'shown');
                dropdownButton.setAttribute('tpi-current-state', 'active');
                dropdownContainer._closeTimeout = null;
                return;
            }
            
            dropdownContainer.style.display = 'none';
            isOpen = false;
            dropdownContainer._closeTimeout = null;
        }, 200);
        
        // Очищаем фильтр при закрытии
        searchTerm = '';
        filteredOptions = [...allOptions];
    }
    
    // Функция для принудительного закрытия выпадающего списка
    function forceCloseDropdown() {
        if (!isOpen) return;
        
        // Отменяем таймер закрытия, если он есть
        if (dropdownContainer._closeTimeout) {
            clearTimeout(dropdownContainer._closeTimeout);
            dropdownContainer._closeTimeout = null;
        }
        
        dropdownContainer.removeAttribute('tpi-current-animation');
        dropdownButton.removeAttribute('tpi-current-state');
        
        // Мгновенно обновляем текст в инпуте
        updateInputText();
        
        // Немедленно скрываем контейнер (не проверяем фокус)
        dropdownContainer.style.display = 'none';
        isOpen = false;
        
        // Очищаем фильтр
        searchTerm = '';
        filteredOptions = [...allOptions];
    }
    
    // Функция для закрытия других выпадающих списков
    function closeAllOtherDropdowns(currentDropdown) {
        document.querySelectorAll('.tpi-cc-dropdown-container').forEach(dropdown => {
            if (dropdown !== currentDropdown && dropdown.style.display === 'block') {
                // Принудительно закрываем
                dropdown.removeAttribute('tpi-current-animation');
                const button = dropdown.parentNode.querySelector('.tpi-cc-search-dropdown');
                if (button) {
                    button.removeAttribute('tpi-current-state');
                }
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Функция для закрытия всех календарей
    function closeAllCalendars() {
        document.querySelectorAll('.tpi-cc-calendar-container').forEach(calendar => {
            if (calendar.style.display === 'block') {
                calendar.removeAttribute('tpi-current-animation');
                const searchDateButton = document.querySelector('.tpi-cc-search-date');
                if (searchDateButton) {
                    searchDateButton.removeAttribute('tpi-current-state');
                }
                calendar.style.display = 'none';
            }
        });
    }
    
    // Обработчики событий
    
    // Фокус на инпуте с умной обработкой
    input.addEventListener('focus', function() {
        handleFocusWithDelay();
    });
    
    // Клик по инпуту
    input.addEventListener('click', function(event) {
        event.stopPropagation();
        // Дополнительно обрабатываем клик для немедленного открытия
        if (!isOpen) {
            immediateOpenDropdown();
        }
    });
    
    // Потеря фокуса инпутом - закрываем с небольшой задержкой
    input.addEventListener('blur', function() {
        // Очищаем таймаут фокуса
        if (focusTimeout) {
            clearTimeout(focusTimeout);
            focusTimeout = null;
        }
        
        // Даем время на обработку клика внутри выпадающего списка
        setTimeout(() => {
            const activeElement = document.activeElement;
            const isClickInside = dropdownContainer.contains(activeElement) || 
                                 dropdownButton.contains(activeElement);
            
            // Если клик был вне выпадающего списка и кнопки, закрываем
            if (!isClickInside) {
                closeDropdown();
            }
        }, 100);
    });
    
    // Ввод текста для фильтрации
    if (cfg.allowFiltering) {
        input.addEventListener('input', function() {
            filterOptions();
        });
    }
    
    // Обработчик клика на кнопку (иконка)
    const icon = dropdownButton.querySelector('.tpi-cc-search-icon');
    if (icon) {
        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            if (!isOpen) {
                immediateOpenDropdown();
            } else {
                closeDropdown();
            }
        });
    }
    
    // Предотвращаем событие mousedown на контейнере выпадающего списка
    dropdownContainer.addEventListener('mousedown', function(event) {
        event.preventDefault();
        // Восстанавливаем фокус на input
        if (document.activeElement !== input) {
            input.focus();
        }
    });
    
    // Обработчик клика на весь контейнер выпадающего списка
    dropdownContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    // Закрываем выпадающий список при клике вне его
    document.addEventListener('click', function(event) {
        const target = event.target;
        const isClickInsideDropdown = dropdownContainer.contains(target) || 
                                      dropdownButton.contains(target);
        
        if (!isClickInsideDropdown && isOpen) {
            closeDropdown();
        }
    });
    
    // Закрываем выпадающий список при открытии календаря
    document.addEventListener('tpi-calendar-opened', function() {
        if (isOpen) {
            forceCloseDropdown();
        }
    });
    
    // Инициализация текста в инпуте
    updateInputText();
    

    const dropdownInstance = {
        getSelectedOptions: () => [...selectedOptions],
        setSelectedOptions: (options) => {
            selectedOptions = [...options];
            updateCheckboxStates();
            updateInputText();
        },
        getAllOptions: () => [...allOptions],
        setOptions: (newOptions) => {
            allOptions = [...newOptions];
            selectedOptions = selectedOptions.filter(selected => 
                newOptions.some(option => option.value === selected.value)
            );
            filteredOptions = [...allOptions];
            if (isOpen) {
                renderDropdown();
            }
            updateInputText();
        },
        open: () => immediateOpenDropdown(),
        close: () => closeDropdown(),
        isOpen: () => isOpen,
        updateInputText: () => updateInputText()
    };

    dropdownButton.tpiDropdownInstance = dropdownInstance;
    
    return dropdownInstance;
}
// Инициализация выпадающего списка для статусов курьера
function initializeCourierStatusDropdown() {
    const statusDropdownButton = document.querySelector('.tpi-cc-search-dropdown');
    
    if (!statusDropdownButton) {
        console.warn('Status dropdown button not found');
        return null;
    }
    
    // Опции для статусов курьера
    const statusOptions = [
        { value: 'finished', label: 'Собран' },
        { value: 'in_progress', label: 'В работе' },
        { value: 'not_started', label: 'Не начат' },
        { value: 'shipped', label: 'Отгружен' },
        { value: 'cell_shipped', label: 'Передано курьеру' }
    ];
    
    // Создаем выпадающий список
    const statusDropdown = createDropdownCheckboxFilter(statusDropdownButton, statusOptions, {
        placeholder: '',
        selectAllText: 'Выбрать все',
        nothingFoundText: 'Ничего не найдено',
        searchPlaceholder: 'Поиск статуса...',
        showCountInInput: true,
        multiple: true
    });
    
    return statusDropdown;
}

// Функция для подсчета статусов в таблице
function countStatusInTable() {
    const tableBody = document.querySelector('tbody.tpi-cc--table-tbody-wrapper');
    if (!tableBody) {
        return null; // Таблица еще не создана
    }
    
    const rows = tableBody.querySelectorAll('tr.tpi-cc--table-tbody');
    if (rows.length === 0) {
        return null; // Нет строк в таблице
    }
    
    const statusCounts = {};
    
    rows.forEach(row => {
        const statusElement = row.querySelector('p[tpi-cc-parsing-data="courier-route-status"]');
        if (statusElement) {
            const statusText = statusElement.textContent.trim();
            statusCounts[statusText] = (statusCounts[statusText] || 0) + 1;
        }
    });
    
    return statusCounts;
}

// Функция для обновления счетчиков в выпадающем списке
function updateDropdownCounts(dropdownContainer) {
    const statusCounts = countStatusInTable();
    if (!statusCounts) return;
    
    // Находим все элементы опций в выпадающем списке
    const optionItems = dropdownContainer.querySelectorAll('.tpi-cc-dropdown-item[data-type="option"]');
    
    optionItems.forEach(item => {
        const labelName = item.querySelector('.tpi-cc-dropdown-label-name');
        if (labelName) {
            const optionText = labelName.textContent.trim();
            const count = statusCounts[optionText] || 0;
            
            const labelAmount = item.querySelector('.tpi-cc-dropdown-label-amount');
            if (labelAmount) {
                labelAmount.textContent = count > 0 ? count.toString() : '0';
            }
        }
    });
}

// C-
// C-
// C- Сортировка ТАБЛИЦЫ
// C-
// C-

// Сохраняем исходный порядок строк с их обработчиками
function saveOriginalRowOrder() {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody || tableBody.children.length === 0) return;
    
    tpi_cc_originalRowOrder = Array.from(tableBody.querySelectorAll('.tpi-cc--table-tbody'));
}

function resetTableSortState() {
    tpi_cc_tableSortInitialized = false;
    tpi_cc_currentFilterColumn = null;
    tpi_cc_currentFilterDirection = null;
    tpi_cc_originalRowOrder = [];
}

// Новая функция сортировки, которая перемещает строки, а не пересоздает их
function sortTableByColumnMove(columnIndex, sortDirection) {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return;
    
    // Если исходный порядок не сохранен, сохраняем его
    if (tpi_cc_originalRowOrder.length === 0) {
        saveOriginalRowOrder();
    }
    
    // Получаем только видимые строки
    const rows = Array.from(tableBody.querySelectorAll('.tpi-cc--table-tbody'))
        .filter(row => row.style.display !== 'none');
    
    if (rows.length === 0) return;
    
    // Сохраняем порядок скрытых строк
    const hiddenRows = Array.from(tableBody.querySelectorAll('.tpi-cc--table-tbody'))
        .filter(row => row.style.display === 'none');
    
    // Создаем массив объектов с данными видимых строк для сортировки
    const rowData = rows.map((row, index) => {
        const cell = row.querySelectorAll('td.tpi-cc--table-tbody-item')[columnIndex];
        return {
            row: row,
            originalIndex: index,
            value: extractCellValue(cell),
            sortValue: getSortValue(cell, columnIndex)
        };
    });
    
    // Сортируем данные
    rowData.sort((a, b) => {
        let comparison = 0;
        
        if (a.sortValue !== null && b.sortValue !== null) {
            comparison = a.sortValue - b.sortValue;
        } else if (typeof a.value === 'string' && typeof b.value === 'string') {
            comparison = a.value.localeCompare(b.value, 'ru', { sensitivity: 'base' });
        }
        
        if (comparison === 0) {
            comparison = a.originalIndex - b.originalIndex;
        }
        
        if (sortDirection === 'filtered-up') {
            comparison = -comparison;
        }
        
        return comparison;
    });
    
    // Собираем все строки в правильном порядке
    const sortedVisibleRows = rowData.map(item => item.row);
    const allRows = [...sortedVisibleRows, ...hiddenRows];
    
    // Перемещаем строки в новом порядке
    moveRowsToNewOrder(allRows);
    
    // Добавляем визуальные эффекты к ячейкам
    addVisualEffectsWithFilter(columnIndex);
}

// Функция для получения значения для сортировки
function getSortValue(cell, columnIndex) {
    if (!cell) return null;
    
    // Для процентных значений
    const percentElement = cell.querySelector('p[tpi-cc-parsing-data*="progress-percent"]');
    if (percentElement) {
        const percentText = percentElement.textContent.trim().replace('%', '');
        return parseInt(percentText) || 0;
    }
    
    // Для числовых значений (прогресс)
    const progressElement = cell.querySelector('p[tpi-cc-parsing-data*="progress"]');
    if (progressElement && !progressElement.textContent.includes('%')) {
        const match = progressElement.textContent.match(/(\d+)\s*из\s*(\d+)/);
        if (match) {
            return parseInt(match[1]) || 0;
        }
    }
    
    // Для дат
    const dateElement = cell.querySelector('p[tpi-cc-parsing-data*="date"]');
    if (dateElement && dateElement.textContent !== 'null') {
        return parseDateString(dateElement.textContent.trim());
    }
    
    // Для времени
    const timeElement = cell.querySelector('p[tpi-cc-parsing-data*="time"]');
    if (timeElement && timeElement.textContent !== 'null') {
        return parseTimeString(timeElement.textContent.trim());
    }
    
    return null; // Используем текстовое сравнение
}

// Функция для перемещения строк с анимацией
function moveRowsToNewOrder(rowsInNewOrder) {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return;
    
    // Временно отключаем анимацию для производительности
    tableBody.style.transition = 'none';
    
    // Сохраняем текущие позиции
    const originalPositions = new Map();
    const rows = Array.from(tableBody.querySelectorAll('.tpi-cc--table-tbody'));
    
    rows.forEach((row, index) => {
        originalPositions.set(row, {
            element: row,
            originalIndex: index,
            rect: row.getBoundingClientRect()
        });
    });
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Добавляем строки в новом порядке
    rowsInNewOrder.forEach(row => {
        tableBody.appendChild(row);
    });
    
    // Включаем анимацию обратно
    setTimeout(() => {
        tableBody.style.transition = '';
    }, 10);
}

// Функция для восстановления исходного порядка
function restoreOriginalRowOrder() {
    if (tpi_cc_originalRowOrder.length === 0) return;
    
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return;
    
    // Удаляем сообщение "нет результатов", если оно есть
    removeNoResultsMessage();
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Добавляем строки в исходном порядке
    tpi_cc_originalRowOrder.forEach(row => {
        tableBody.appendChild(row);
    });
    
    // Восстанавливаем фильтры
    applyAllFilters();
    restoreEventListeners();
    initializePrintRowHighlight();
}

function removeNoResultsMessage() {
    const existingMessage = document.querySelector('tr[tpi-cc-no-filtered-results]');
    if (existingMessage) {
        existingMessage.classList.remove('shown');
        if (existingMessage.parentNode) {
            existingMessage.parentNode.removeChild(existingMessage);
        }
    }
}

function showNoResultsMessage() {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return;
    
    // Проверяем, не добавлено ли уже сообщение
    const existingMessage = document.querySelector('tr[tpi-cc-no-filtered-results]');
    if (existingMessage) return; // Сообщение уже есть, ничего не делаем
    
    // Создаем строку с сообщением
    const noResultsRow = document.createElement('tr');
    noResultsRow.setAttribute('tpi-cc-no-filtered-results', '');
    noResultsRow.className = 'tpi-cc-no-results-row';
    
    // Создаем ячейку, которая занимает все колонки
    const td = document.createElement('td');
    td.colSpan = 11; // Количество колонок в таблице
    td.className = 'tpi-cc-no-results-cell';
    td.innerHTML = `
        <div class="tpi-cc-no-results-container">
            <p class="tpi-cc-no-results-title">Нет результатов по выбранным фильтрам</p>
            <i class="tpi-cc-no-results-icon"></i>
        </div>
    `
    
    noResultsRow.appendChild(td);
    tableBody.appendChild(noResultsRow);
    
    // Добавляем CSS класс для анимации
    setTimeout(() => {
        noResultsRow.classList.add('shown');
    }, 10);
}

// Функция для добавления визуальных эффектов
function addVisualEffects(columnIndex) {
    const table = document.querySelector('table.tpi-cc--table-data-output');
    if (!table) return;
    
    const tableBodyRows = table.querySelectorAll('tbody tr');
    
    tableBodyRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td.tpi-cc--table-tbody-item');
        if (cells.length > columnIndex) {
            const cell = cells[columnIndex];
            
            // Удаляем старые атрибуты
            cell.removeAttribute('tpi-current-state');
            
            // Добавляем новые
            if (rowIndex === tableBodyRows.length - 1) {
                cell.setAttribute('tpi-current-state', 'filtered-last');
            } else {
                cell.setAttribute('tpi-current-state', 'filtered');
            }
        }
    });
}

// Функция для восстановления обработчиков событий
function restoreEventListeners() {
    // Восстанавливаем обработчики для кнопок CART и PALLET
    const tpi_cc_actionButtons = document.querySelectorAll('.tpi-cc-table-tbody-data-cart-id, .tpi-cc-table-tbody-data-pallet-id');
    tpi_cc_actionButtons.forEach(btn => {
        // Удаляем старые обработчики
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        initializePrintRowHighlight();

        // Добавляем новый обработчик
        newBtn.addEventListener('click', () => {
            if(newBtn.hasAttribute('tpi-cc-button-is-blocked')) {
                tpiNotification.show('Ошибка', "error", "Взаимодействия с паллетами КГТ были заблокированы по просьбе старших смен.");
                return
            }else{
                if (newBtn.hasAttribute('tpi-cc-selected-courier-cell')) {
                    newBtn.removeAttribute('tpi-cc-selected-courier-cell');
                } else {
                    newBtn.setAttribute('tpi-cc-selected-courier-cell', '');
                }
                update_ActionProcessContainer();
            }
        });
        initializePrintRowButtons();
    });
    initializeAddCartButtons();
    initializeAddPalletButtons();
    initializeDeleteButton();
    initializeRestoreModal();
    
    const printButtons = document.querySelectorAll('.tpi-cc--print-current-row');
    printButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Обновляем контейнер действий
    update_ActionProcessContainer();
}

// Функция для инициализации кнопок печати в каждой строке
function initializePrintRowButtons() {
    const printRowButtons = document.querySelectorAll('.tpi-cc--print-current-row');
    
    if (printRowButtons.length === 0) {
        console.log('⚠️ Кнопки печати не найдены');
        return;
    }
    
    console.log(`✅ Найдено кнопок печати: ${printRowButtons.length}`);
    
    printRowButtons.forEach(button => {
        // Удаляем старые обработчики, если они есть
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Проверяем, есть ли в строке курьер с заблокированными кнопками
        const row = newButton.closest('.tpi-cc--table-tbody');
        if (row) {
            // Проверяем, все ли кнопки PALLET заблокированы
            const palletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
            const allPalletsBlocked = palletButtons.length > 0 && 
                Array.from(palletButtons).every(btn => btn.hasAttribute('tpi-cc-button-is-blocked'));
            
            // Проверяем, есть ли у курьера PALLET кнопки (для КГТ)
            if (palletButtons.length > 0 && allPalletsBlocked) {
                newButton.disabled = true;
            }
        }
        
        // Добавляем новый обработчик
        newButton.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Проверяем, не выполняется ли уже печать
            if (this.hasAttribute('tpi-cc-printing-state')) {
                return;
            }
            
            // Проверяем, не отключена ли кнопка
            if (this.disabled) {
                return;
            }
            
            // Устанавливаем состояние загрузки
            this.setAttribute('tpi-cc-printing-state', 'loading');
            
            try {
                // Находим родительскую строку
                const row = this.closest('.tpi-cc--table-tbody');
                if (!row) {
                    console.warn('❌ Строка не найдена');
                    return;
                }
                
                // Собираем данные из строки (только незаблокированные)
                const courierNameElement = row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]');
                const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
                
                console.log('📋 Собираем данные из строки:', {
                    courierName: courierNameElement?.textContent,
                    cell: cellElement?.textContent
                });
                
                // Получаем ТОЛЬКО НЕЗАБЛОКИРОВАННЫЕ CART номера
                const cartElements = row.querySelectorAll('.tpi-cc--table-tbody-data-carts .tpi-cc-table-tbody-data-cart-id[tpi-data-courier-spec-cell]:not([tpi-cc-button-is-blocked])');
                const cartNumbers = Array.from(cartElements).map(el => el.getAttribute('tpi-data-courier-spec-cell'));
                
                // Получаем ТОЛЬКО НЕЗАБЛОКИРОВАННЫЕ PALLET номера
                const palletElements = row.querySelectorAll('.tpi-cc--table-tbody-data-pallets .tpi-cc-table-tbody-data-pallet-id[tpi-data-courier-spec-cell]:not([tpi-cc-button-is-blocked])');
                const palletNumbers = Array.from(palletElements).map(el => el.getAttribute('tpi-data-courier-spec-cell'));
                
                console.log('📦 Найденные номера (незаблокированные):', {
                    cart: cartNumbers,
                    pallet: palletNumbers
                });
                
                // Если нет номеров для печати, показываем уведомление
                if (cartNumbers.length === 0 && palletNumbers.length === 0) {
                    console.log('⚠️ Нет номеров для печати');
                    if (typeof tpiNotification !== 'undefined') {
                        tpiNotification.show('Нет номеров', 'warning', 'У курьера нет доступных CART или PALLET номеров для печати');
                    }
                    return;
                }
                
                // Формируем данные курьера
                const courierData = [{
                    courierName: courierNameElement ? courierNameElement.textContent.trim() : 'Не указано',
                    cell: {
                        value: cellElement ? cellElement.textContent.trim() : 'Нет ячейки',
                        attribute: cellElement ? cellElement.getAttribute('courier-spec-cell') : ''
                    },
                    cartNumbers,
                    palletNumbers
                }];
                
                // Генерируем PDF
                await tpi_cc_generatePDFlabels(courierData, {
                    printButton: this,
                    isSingleCourier: true
                });
                
            } catch (error) {
                console.warn('❌ Ошибка при печати:', error);
            } finally {
                // Снимаем состояние загрузки
                this.removeAttribute('tpi-cc-printing-state');
            }
        });
    });
}
// Функция для извлечения текстового значения из ячейки
function extractCellValue(cell) {
    if (!cell) return '';
    
    // Для ячеек со ссылками
    const linkElement = cell.querySelector('a.tpi-cc--table-tbody-data-link');
    if (linkElement) {
        return linkElement.textContent.trim();
    }
    
    // Для ячеек с кнопками CART/PALLET
    const buttonElements = cell.querySelectorAll('.tpi-cc--table-tbody-data-button');
    if (buttonElements.length > 0) {
        // Возвращаем текст первой кнопки или пустую строку
        return buttonElements[0].textContent.trim();
    }
    
    // Для ячеек с текстовыми данными
    const textElements = cell.querySelectorAll('p[tpi-cc-parsing-data]');
    if (textElements.length > 0) {
        // Объединяем текст всех параграфов
        return Array.from(textElements)
            .map(el => el.textContent.trim())
            .filter(text => text)
            .join(' ');
    }
    
    // Для ячеек с обычным текстом
    if (cell.textContent) {
        return cell.textContent.trim();
    }
    
    return '';
}

// Функция для парсинга даты из строки (если еще не существует)
function parseDateString(dateStr) {
    if (!dateStr || dateStr === 'null') return null;
    
    try {
        // Формат: DD/MM/YYYY
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day).getTime();
        }
    } catch (e) {
        console.warn('Ошибка парсинга даты:', e);
    }
    return null;
}

// Функция для парсинга времени из строки (если еще не существует)
function parseTimeString(timeStr) {
    if (!timeStr || timeStr === 'null') return null;
    
    try {
        // Формат: HH:MM:SS
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;
            return hours * 3600 + minutes * 60 + seconds;
        }
    } catch (e) {
        console.warn('Ошибка парсинга времени:', e);
    }
    return null;
}

// C-
// C-
// C- Фильтр ИНПУТОВ
// C-
// C-

let tpi_cc_currentFilters = {
    courierName: '',
    cellName: '',
    statuses: [], // Массив выбранных статусов
    allStatusesSelected: false
};

// Инициализация всех фильтров
function initializeAllFilters() {
    initializeCourierNameFilter();
    initializeCellFilter();
    initializeStatusFilter();
    initializeResetFiltersButton();
    initializeTotalCourierCount();
}

// Фильтр по ФИО курьера
function initializeCourierNameFilter() {
    const nameInput = document.getElementById('tpi-cc-search-courier-name');
    if (!nameInput) return;
    
    // Дебаунс для оптимизации
    let debounceTimer;
    
    nameInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            tpi_cc_currentFilters.courierName = this.value.trim().toLowerCase();
            applyAllFilters();
        }, 300);
    });
    
    // Очистка по кнопке Esc
    nameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            tpi_cc_currentFilters.courierName = '';
            applyAllFilters();
        }
    });
}

// Фильтр по ячейке
function initializeCellFilter() {
    const cellInput = document.getElementById('tpi-cc-search-courier-cell');
    if (!cellInput) return;
    
    let debounceTimer;
    
    cellInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            tpi_cc_currentFilters.cellName = this.value.trim().toLowerCase();
            applyAllFilters();
        }, 300);
    });
    
    cellInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            tpi_cc_currentFilters.cellName = '';
            applyAllFilters();
        }
    });
}

// Фильтр по статусам через выпадающий список
function initializeStatusFilter() {
    const statusDropdown = document.querySelector('.tpi-cc-search-dropdown');
    if (!statusDropdown) return;
    
    // Слушаем изменения в выпадающем списке
    statusDropdown.addEventListener('tpi-dropdown-change', function(event) {
        if (event.detail) {
            // Получаем выбранные статусы
            const selectedOptions = event.detail.selected;
            tpi_cc_currentFilters.statuses = selectedOptions.map(opt => opt.label);
            tpi_cc_currentFilters.allStatusesSelected = event.detail.allSelected || false;
            
            applyAllFilters();
        }
    });
}

// Кнопка сброса всех фильтров
function initializeResetFiltersButton() {
    const resetButton = document.querySelector('.tpi-cc-filters-reset');
    if (!resetButton) return;
    
    resetButton.addEventListener('click', function() {
        // Сбрасываем инпуты
        const nameInput = document.getElementById('tpi-cc-search-courier-name');
        const cellInput = document.getElementById('tpi-cc-search-courier-cell');
        
        if (nameInput) {
            nameInput.value = '';
            nameInput.blur();
        }
        
        if (cellInput) {
            cellInput.value = '';
            cellInput.blur();
        }
        
        // Сбрасываем статусы через выпадающий список
        const statusDropdown = document.querySelector('.tpi-cc-search-dropdown');
        if (statusDropdown && statusDropdown.tpiDropdownInstance) {
            // Выбираем все статусы
            const allOptions = statusDropdown.tpiDropdownInstance.getAllOptions();
            statusDropdown.tpiDropdownInstance.setSelectedOptions(allOptions);
        }
        
        // Сбрасываем глобальные фильтры
        tpi_cc_currentFilters = {
            courierName: '',
            cellName: '',
            statuses: [],
            allStatusesSelected: true
        };
        
        // Удаляем сообщение "нет результатов"
        removeNoResultsMessage();
        
        // Применяем фильтры (покажет все строки)
        applyAllFilters();
    });
}

function initializeTotalCourierCount() {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('.tpi-cc--table-tbody');
    const total = rows.length;
    
    // Устанавливаем начальное значение
    updateFilterCounters(total, total);
}

// Основная функция применения всех фильтров
function applyAllFilters() {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return;
    
    const rows = Array.from(tableBody.querySelectorAll('.tpi-cc--table-tbody'));
    if (rows.length === 0) return;
    
    // Проверяем, были ли изменения в фильтрах
    const previousVisibleCount = getVisibleRowCount();
    
    // Подсчитываем сколько строк отображается
    let visibleCount = 0;
    
    rows.forEach(row => {
        let shouldShow = true;
        
        // Проверяем все фильтры
        if (tpi_cc_currentFilters.courierName) {
            const nameElement = row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]');
            const name = nameElement ? nameElement.textContent.trim().toLowerCase() : '';
            shouldShow = shouldShow && name.includes(tpi_cc_currentFilters.courierName);
        }
        
        if (shouldShow && tpi_cc_currentFilters.cellName) {
            const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
            const cell = cellElement ? cellElement.textContent.trim().toLowerCase() : '';
            shouldShow = shouldShow && cell.includes(tpi_cc_currentFilters.cellName);
        }
        
        if (shouldShow && !tpi_cc_currentFilters.allStatusesSelected && tpi_cc_currentFilters.statuses.length > 0) {
            const statusElement = row.querySelector('p[tpi-cc-parsing-data="courier-route-status"]');
            const status = statusElement ? statusElement.textContent.trim() : '';
            shouldShow = shouldShow && tpi_cc_currentFilters.statuses.includes(status);
        }
        
        // Применяем видимость
        if (shouldShow) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Проверяем, изменилось ли количество видимых строк
    if (visibleCount !== previousVisibleCount) {
        // Удаляем старое сообщение "нет результатов", если оно есть
        removeNoResultsMessage();
        
        // Обновляем счетчики
        updateFilterCounters(rows.length, visibleCount);
        
        // Если нет видимых строк, показываем сообщение
        if (visibleCount === 0 && hasActiveFilters()) {
            showNoResultsMessage();
        }
    }
    
    // Обновляем визуальные эффекты сортировки, если она активна
    updateSortVisualEffects();
}

function getVisibleRowCount() {
    const tableBody = document.querySelector('.tpi-cc--table-tbody-wrapper');
    if (!tableBody) return 0;
    
    const rows = tableBody.querySelectorAll('.tpi-cc--table-tbody');
    let count = 0;
    
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            count++;
        }
    });
    
    return count;
}

function hasActiveFilters() {
    return tpi_cc_currentFilters.courierName || 
           tpi_cc_currentFilters.cellName || 
           (!tpi_cc_currentFilters.allStatusesSelected && tpi_cc_currentFilters.statuses.length > 0);
}

function updateSortVisualEffects() {
    if (tpi_cc_currentFilterColumn === null) return;
    
    const table = document.querySelector('table.tpi-cc--table-data-output');
    if (!table) return;
    
    // Удаляем старые эффекты
    document.querySelectorAll('td.tpi-cc--table-tbody-item[tpi-current-state]').forEach(td => {
        td.removeAttribute('tpi-current-state');
    });
    
    // Добавляем эффекты только к видимым строкам
    const visibleRows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(row => row.style.display !== 'none');
    
    visibleRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td.tpi-cc--table-tbody-item');
        if (cells.length > tpi_cc_currentFilterColumn) {
            const cell = cells[tpi_cc_currentFilterColumn];
            
            if (rowIndex === visibleRows.length - 1) {
                cell.setAttribute('tpi-current-state', 'filtered-last');
            } else {
                cell.setAttribute('tpi-current-state', 'filtered');
            }
        }
    });
}

function addVisualEffectsWithFilter(columnIndex) {
    const table = document.querySelector('table.tpi-cc--table-data-output');
    if (!table) return;
    
    // Получаем только видимые строки
    const visibleRows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(row => row.style.display !== 'none');
    
    visibleRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td.tpi-cc--table-tbody-item');
        if (cells.length > columnIndex) {
            const cell = cells[columnIndex];
            
            cell.removeAttribute('tpi-current-state');
            
            if (rowIndex === visibleRows.length - 1) {
                cell.setAttribute('tpi-current-state', 'filtered-last');
            } else {
                cell.setAttribute('tpi-current-state', 'filtered');
            }
        }
    });
}

// Функция для обновления счетчиков в фильтрах
function updateFilterCounters(total, filtered) {
    const totalElement = document.getElementById('tpi-cc-data-total-couriers');
    const filteredElement = document.getElementById('tpi-cc-data-filtered-couriers');
    
    if (totalElement) {
        const span = totalElement.querySelector('span');
        if (span) span.textContent = total;
    }
    
    if (filteredElement) {
        const span = filteredElement.querySelector('span');
        if (span) {
            // Если все строки отображаются, показываем 0
            if (filtered === total) {
                span.textContent = '0';
            } else {
                span.textContent = filtered;
            }
        }
    }
}

// C-
// C-
// C- Обновление данных в таблице при загрузке из БД
// C-
// C-

// Функция для получения свежих данных из API без расшифровки имен
async function getFreshCouriersData(selectedDate) {
    try {
        // Формируем URL для запроса
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'sortingCenter/routes/resolveGetRoutesFullInfo:resolveGetRoutesFullInfo');

        // ВАЖНО: Используем выбранную дату из календаря
        if (!selectedDate) {
            console.log('❌ Не указана дата для запроса API');
            return null;
        }

        // Преобразуем DD/MM/YYYY в YYYY-MM-DD для API
        const dateParts = selectedDate.split('/');
        if (dateParts.length !== 3) {
            console.log('❌ Неверный формат даты:', selectedDate);
            return null;
        }

        const currentDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        console.log(`📅 Запрашиваем данные API для даты: ${currentDate} (выбранная: ${selectedDate})`);
        
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
                "size": 200
            }],
            "path": `/sorting-center/21972131/routes?type=OUTGOING_COURIER&sort=&hasCarts=false&category=COURIER&date=${currentDate}&recipientName=`
        };

        const response = await fetch(url.toString(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Market-Core-Service': '<UNKNOWN>',
                'sk': tpiUserTOKEN
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
                
                // Формируем упрощенные данные (без расшифровки имен)
                const couriersData = routes.map((route, index) => {
                    // Берем ID курьера из разных возможных мест
                    let courierId = null;
                    if (route.courier && route.courier.externalId) {
                        courierId = route.courier.externalId;
                    } else if (route.courier && route.courier.id) {
                        courierId = route.courier.id;
                    }
                    
                    // Определяем ячейку
                    let mainCell = null; // По умолчанию null - значит не будем обновлять
                    if (route.cells && route.cells.length > 0 && route.cells[0]?.number) {
                        // Если есть ячейки и у первой есть номер - используем его
                        mainCell = route.cells[0].number;
                    } else if (route.cell && route.cell.number && route.cell.number !== 'null') {
                        // Если есть отдельное поле cell с валидным номером - используем его
                        mainCell = route.cell.number;
                    }

                    let onlineTransferActId = route.onlineTransferActId || null;
                    
                    return {
                        courierId: courierId,
                        externalId: route.courier?.externalId || null,
                        cell: mainCell,
                        status: route.status || 'Неизвестно',
                        ordersLeft: route.ordersLeft || 0,
                        ordersSorted: route.ordersSorted || 0,
                        ordersShipped: route.ordersShipped || 0,
                        ordersPlanned: route.ordersPlanned || 0,
                        sortablesInCell: route.sortablesInCell || 0,
                        sortablesPrepared: route.sortablesPrepared || 0,
                        courierArrivesAt: route.courierArrivesAt || null,
                        startedAt: route.startedAt || null,
                        finishedAt: route.finishedAt || null,
                        routeId: route.id || null,
                        hasCells: route.cells && route.cells.length > 0,
                        onlineTransferActId: onlineTransferActId // ДОБАВЛЯЕМ ЭТО ПОЛЕ
                    };
                });
                
                console.log(`📊 Получено ${couriersData.length} записей из API за дату ${selectedDate}`);
                return couriersData;
                
            } else {
                console.log(`❌ Нет данных о маршрутах за дату ${selectedDate}`);
                return null;
            }
        } else {
            console.log('❌ Неверный формат ответа API');
            return null;
        }
    } catch (error) {
        console.warn('💥 Ошибка при получении данных из API:', error);
        return null;
    }
}

// Функция для сохранения ОБНОВЛЕННЫХ данных в Firebase
async function saveUpdatedTableData(selectedDate) {
    try {
        // Сначала загружаем текущие данные из Firebase
        const currentData = await tpiLoadDataFromFirebase(selectedDate);
        if (!currentData || currentData.length === 0) {
            console.log('❌ Нет текущих данных в Firebase для сравнения');
            return false;
        }
        
        // Создаем мапу текущих данных по externalId
        const currentDataMap = new Map();
        currentData.forEach(item => {
            const key = item.externalId || item.courierId;
            if (key) {
                currentDataMap.set(key, item);
            }
        });
        
        // Получаем обновленные строки из таблицы
        const updatedRows = document.querySelectorAll('.tpi-cc--table-tbody[data-updated="true"]');
        
        if (updatedRows.length === 0) {
            console.log('✅ Нет измененных данных для сохранения');
            return false;
        }
        
        console.log(`🔄 Найдено ${updatedRows.length} строк с изменениями`);
        
        // Создаем массив для обновленных данных
        const updatedCouriersData = [];
        
        // Используем обычный цикл for для возможности использования await
        for (const row of updatedRows) {
            try {
                const courierId = row.getAttribute('data-courier-id');
                if (!courierId) continue;
                
                // Находим текущие данные этого курьера
                const currentCourierData = currentDataMap.get(courierId);
                if (!currentCourierData) {
                    console.log(`⚠️ Курьер ${courierId} не найден в текущих данных Firebase`);
                    continue;
                }
                
                // Создаем копию текущих данных
                const updatedData = { ...currentCourierData };
                let hasChanges = false;

                const newCell = row.getAttribute('data-cell');
                if (newCell && newCell !== 'null' && newCell !== 'Нет ячейки' && newCell.trim() !== '') {
                    const currentCell = updatedData.cell;
                    if (currentCell !== newCell) {
                        updatedData.cell = newCell;
                        hasChanges = true;
                        console.log(`  📝 cell ${courierId}: ${currentCell} -> ${newCell}`);
                    }
                }
                
                // 1. Обновляем статус если изменился
                const newStatus = row.getAttribute('data-status');
                if (newStatus && updatedData.status !== newStatus) {
                    updatedData.status = newStatus;
                    hasChanges = true;
                    console.log(`  📝 Статус ${courierId}: ${currentCourierData.status} -> ${newStatus}`);
                }
                
                // 2. Обновляем ordersSorted если изменился (берем большее значение из таблицы)
                const newOrdersSorted = parseInt(row.getAttribute('data-orders-sorted') || '0');
                if (newOrdersSorted > 0) {
                    // Берем большее значение из текущих данных
                    const currentSorted = updatedData.ordersSorted || 0;
                    const currentShipped = updatedData.ordersShipped || 0;
                    const currentMax = Math.max(currentSorted, currentShipped);
                    
                    if (newOrdersSorted > currentMax) {
                        updatedData.ordersSorted = newOrdersSorted;
                        // Если новое значение больше текущего shipped, обновляем и его
                        if (newOrdersSorted > currentShipped) {
                            updatedData.ordersShipped = newOrdersSorted;
                        }
                        hasChanges = true;
                        console.log(`  📝 ordersSorted ${courierId}: ${currentMax} -> ${newOrdersSorted}`);
                    }
                }
                
                // 3. Обновляем ordersPlanned если изменился
                const newOrdersPlanned = row.getAttribute('data-orders-planned');
                if (newOrdersPlanned) {
                    const newPlanned = parseInt(newOrdersPlanned);
                    const currentPlanned = updatedData.ordersPlanned || 0;
                    if (newPlanned !== currentPlanned) {
                        updatedData.ordersPlanned = newPlanned;
                        hasChanges = true;
                        console.log(`  📝 ordersPlanned ${courierId}: ${currentPlanned} -> ${newPlanned}`);
                    }
                }
                
                // 4. Обновляем sortablesPrepared всегда если изменился
                const newSortablesPrepared = row.getAttribute('data-sortables-prepared');
                if (newSortablesPrepared) {
                    const newPrepared = parseInt(newSortablesPrepared);
                    const currentPrepared = updatedData.sortablesPrepared || 0;
                    if (newPrepared !== currentPrepared) {
                        updatedData.sortablesPrepared = newPrepared;
                        hasChanges = true;
                        console.log(`  📝 sortablesPrepared ${courierId}: ${currentPrepared} -> ${newPrepared}`);
                    }
                }
                
                // 5. Обновляем sortablesInCell всегда если изменился
                const newSortablesInCell = row.getAttribute('data-sortables-in-cell');
                if (newSortablesInCell) {
                    const newInCell = parseInt(newSortablesInCell);
                    const currentInCell = updatedData.sortablesInCell || 0;
                    if (newInCell !== currentInCell) {
                        updatedData.sortablesInCell = newInCell;
                        hasChanges = true;
                        console.log(`  📝 sortablesInCell ${courierId}: ${currentInCell} -> ${newInCell}`);
                    }
                }
                
                // 6. Обновляем finishedAt если изменился
                const newFinishedAt = row.getAttribute('data-finished-at');
                if (newFinishedAt) {
                    const currentFinishedAt = updatedData.finishedAt;
                    if (currentFinishedAt !== newFinishedAt) {
                        updatedData.finishedAt = newFinishedAt;
                        hasChanges = true;
                        console.log(`  📝 finishedAt ${courierId}: ${currentFinishedAt} -> ${newFinishedAt}`);
                    }
                }

                 // 7. Обновляем onlineTransferActId если изменился (НОВОЕ)
                const newOnlineTransferActId = row.getAttribute('data-online-transfer-act-id');
                if (newOnlineTransferActId && newOnlineTransferActId !== 'null') {
                    const currentActId = updatedData.onlineTransferActId;
                    if (currentActId !== newOnlineTransferActId) {
                        updatedData.onlineTransferActId = newOnlineTransferActId;
                        hasChanges = true;
                        console.log(`  📝 onlineTransferActId ${courierId}: ${currentActId || 'null'} -> ${newOnlineTransferActId}`);
                    }
                }
                
                // Добавляем в массив только если есть изменения
                if (hasChanges) {
                    updatedCouriersData.push(updatedData);
                    console.log(`  ✅ Курьер ${courierId} добавлен в список обновлений`);
                } else {
                    console.log(`  ⏭️ Курьер ${courierId} без изменений, пропускаем`);
                }
                
                // Добавляем в массив только если есть изменения
                if (hasChanges) {
                    updatedCouriersData.push(updatedData);
                    console.log(`  ✅ Курьер ${courierId} добавлен в список обновлений`);
                } else {
                    console.log(`  ⏭️ Курьер ${courierId} без изменений, пропускаем`);
                }
                
            } catch (error) {
                console.warn(`Ошибка при обработке строки:`, error);
            }
        }
        
        if (updatedCouriersData.length === 0) {
            console.log('✅ Нет фактических изменений для сохранения');
            return false;
        }
        
        console.log(`💾 Сохраняем ${updatedCouriersData.length} из ${updatedRows.length} обновленных записей`);
        
        // Обновляем данные в Firebase ТОЛЬКО для измененных курьеров
        const saveResult = await updatePartialDataInFirebase(selectedDate, updatedCouriersData);
        
        // Очищаем флаги обновления после сохранения
        if (saveResult) {
            updatedRows.forEach(row => {
                row.removeAttribute('data-updated');
                row.removeAttribute('data-updated-at');
                row.removeAttribute('data-courier-id');
                row.removeAttribute('data-status');
                row.removeAttribute('data-orders-sorted');
                row.removeAttribute('data-orders-planned');
                row.removeAttribute('data-sortables-prepared');
                row.removeAttribute('data-sortables-in-cell');
                row.removeAttribute('data-finished-at');
            });
            
            console.log('✅ Флаги обновления очищены');
        }
        
        return saveResult;
        
    } catch (error) {
        console.warn('💥 Ошибка при сохранении обновленных данных:', error);
        return false;
    }
}

// Функция для обновления данных в таблице из API без перезагрузки всей таблицы
async function updateTableDataFromAPI(selectedDate) {
    try {
        console.log('🔄 Обновление данных таблицы из API...');
        
        if (!tpiUserTOKEN) {
            console.log('❌ Токен не найден');
            return;
        }
        
        // Получаем свежие данные из API (без расшифровки имен)
        const freshData = await getFreshCouriersData(selectedDate);
        
        if (!freshData || freshData.length === 0) {
            console.log('❌ Не удалось получить данные из API');
            return;
        }
        
        console.log(`✅ Получено ${freshData.length} записей из API`);
        
        // Создаем мапу для быстрого поиска по ID курьера
        const freshDataMap = new Map();
        freshData.forEach(item => {
            if (item.externalId) {
                freshDataMap.set(item.externalId, item);
            } else if (item.courierId) {
                freshDataMap.set(item.courierId, item);
            }
        });
        
        // Получаем все строки таблицы
        const tableRows = document.querySelectorAll('.tpi-cc--table-tbody');
        let updatedCount = 0;
        let savedToFirebase = false;
        
        // Проходим по каждой строке таблицы
        tableRows.forEach((row, rowIndex) => {
            // Находим ID курьера в строке
            const courierIdElement = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]');
            if (!courierIdElement) return;
            
            const courierId = courierIdElement.textContent.trim();
            const freshCourierData = freshDataMap.get(courierId);
            
            if (!freshCourierData) return;
            
            // Обновляем данные в строке и получаем флаг обновления
            const rowUpdated = updateRowData(row, freshCourierData, rowIndex);
            
            if (rowUpdated) {
                updatedCount++;
                
                // Сохраняем onlineTransferActId в data-атрибуты строки
                if (freshCourierData.onlineTransferActId) {
                    row.setAttribute('data-online-transfer-act-id', freshCourierData.onlineTransferActId);
                }
                
                // Сохраняем cell в data-атрибуты ТОЛЬКО если оно валидное
                if (freshCourierData.cell && 
                    freshCourierData.cell !== 'null' && 
                    freshCourierData.cell !== 'Нет ячейки' && 
                    freshCourierData.cell.trim() !== '') {
                    row.setAttribute('data-cell', freshCourierData.cell);
                }
            }
        });
        
        // Если были обновления, сохраняем в Firebase
        if (updatedCount > 0) {
            console.log(`🔄 Обновлено ${updatedCount} строк`);
            savedToFirebase = await saveUpdatedTableData(selectedDate);
            
            if (savedToFirebase) {
                console.log('✅ Данные успешно сохранены в Firebase');
                tpiNotification.show('Обновление', 'success', `Обновлено ${updatedCount} записей`);
                initializePrintRowHighlight();
                initializeRestoreModal();
            }
        } else {
            console.log('✅ Данные уже актуальны');
        }
        
        return { updatedCount, savedToFirebase };
        
    } catch (error) {
        console.warn('💥 Ошибка при обновлении данных таблицы:', error);
        return null;
    }
}

// Функция обновления данных в строке таблицы
function updateRowData(row, freshData, rowIndex) {
    let updated = false;
    const courierId = freshData.externalId || freshData.courierId;
    
    // 1. Обновление onlineTransferActId (НОВЫЙ БЛОК)
    const eappLink = row.querySelector('.tpi-cc--dcoument-eapp');
    const hasActId = freshData.onlineTransferActId && freshData.onlineTransferActId !== 'null';
    
    if (hasActId) {
        // Проверяем, есть ли уже активная ссылка
        const existingLink = row.querySelector('.tpi-cc--dcoument-eapp[tpi-tooltip-data="ЭАПП курьера"]');
        
        if (!existingLink) {
            // Если нет активной ссылки, заменяем disabled элемент на активную ссылку
            const disabledElement = row.querySelector('.tpi-cc--dcoument-eapp[disabled]');
            const printContainer = row.querySelector('.tpi-cc--table-body-print-container');
            
            if (disabledElement && printContainer) {
                // Получаем выбранную дату для ссылки
                const searchDateButton = document.querySelector('.tpi-cc-search-date');
                let selectedDateFormatted = '';
                if (searchDateButton) {
                    const selectedDateStr = searchDateButton.getAttribute('tpi-cc-selected-date-value');
                    if (selectedDateStr) {
                        const dateParts = selectedDateStr.split('/');
                        if (dateParts.length === 3) {
                            selectedDateFormatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                        }
                    }
                }
                
                // Создаем активную ссылку
                const newLinkHtml = `
                    <a class="tpi-cc--dcoument-eapp" 
                       href="/api/sorting-center/21972131/online-transfer-act/${freshData.onlineTransferActId}/download" 
                       target="_blank" 
                       tpi-tooltip-data="ЭАПП курьера">
                        <i class="tpi-cc--table-tbody-data-icon">${tpi_cc_i_courier_eapp}</i>
                    </a>
                `;
                
                // Заменяем disabled элемент на активную ссылку
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newLinkHtml;
                const newLink = tempDiv.firstElementChild;
                
                disabledElement.parentNode.replaceChild(newLink, disabledElement);
                updated = true;
                console.log(`🔄 Обновлен onlineTransferActId для курьера ${courierId}: появился новый акт`);
            }
        }
    }
    
    // 2. Обновление прогресса сортировки (только если новое значение больше)
    const sortProgressElement = row.querySelector('p.tpi-cc--table-tbody-data-sort-progress[tpi-cc-parsing-data="courier-sorting-progress"]');
    if (sortProgressElement && freshData.ordersPlanned > 0) {
        // Извлекаем текущие значения из текста
        const currentText = sortProgressElement.textContent.trim();
        const match = currentText.match(/(\d+)\s+из\s+(\d+)/);
        
        if (match) {
            const currentSorted = parseInt(match[1]);
            const currentPlanned = parseInt(match[2]);
            
            // Берем БОЛЬШЕЕ значение из ordersSorted и ordersShipped
            const apiSorted = freshData.ordersSorted || 0;
            const apiShipped = freshData.ordersShipped || 0;
            const newSorted = Math.max(apiSorted, apiShipped);
            
            // Обновляем только если новое значение сортировки БОЛЬШЕ ИЛИ изменилось общее количество заказов
            if (newSorted > currentSorted || freshData.ordersPlanned !== currentPlanned) {
                // ИСПРАВЛЕНО: используем freshData.routeId, а не courierData.routeId
                sortProgressElement.innerHTML = `<a class="tpi-cc--table-tbody-data-link" target="_blank" href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?routeId=${freshData.routeId || ''}&searchRouteIdInOldRoutes=true&crossDockOnly=true&sortableStatusesLeafs=SHIPPED_DIRECT&sortableTypes=PLACE&sortableTypes=TOTE&sortableTypes=PALLET&sortableTypes=XDOC_PALLET&sortableTypes=XDOC_BOX"><i>${tpi_cc_i_box_outline}</i>${newSorted}</a> из <a class="tpi-cc--table-tbody-data-link" target="_blank" href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?routeId=${freshData.routeId || ''}&searchRouteIdInOldRoutes=true&sortableStatusesLeafs=&sortableTypes=PLACE&sortableTypes=TOTE&sortableTypes=PALLET&sortableTypes=XDOC_PALLET&sortableTypes=XDOC_BOX&crossDockOnly=true"><i>${tpi_cc_i_box_filled}</i>${freshData.ordersPlanned || 0}</a>`;
                
                // Также обновляем процент
                const sortPercent = freshData.ordersPlanned > 0 ? Math.round((newSorted / freshData.ordersPlanned) * 100) : 0;
                const percentElement = row.querySelector('p.tpi-cc--table-tbody-data-sort-progress-circle-value[tpi-cc-parsing-data="courier-sorting-progress-percent"]');
                if (percentElement) {
                    percentElement.textContent = `${sortPercent}%`;
                }
                
                // Обновляем круговой прогресс
                const circleElement = row.querySelector('circle[tpi-cc-parsing-data="courier-sorting-progress-circle"]');
                if (circleElement) {
                    const dashArray = 125.6;
                    const dashOffset = dashArray - (dashArray * sortPercent / 100);
                    circleElement.style.stroke = getProgressColor(sortPercent);
                    circleElement.setAttribute('stroke-dashoffset', dashOffset);
                }
                
                updated = true;
                console.log(`🔄 Обновлен прогресс сортировки для курьера ${courierId}: ${currentSorted}/${currentPlanned} -> ${newSorted}/${freshData.ordersPlanned} (sorted: ${apiSorted}, shipped: ${apiShipped})`);
            }
        }
    }
    
    // 3. Обновление прогресса подготовки (всегда обновляем, даже если данные меньше)
    const preparedProgressElement = row.querySelector('p.tpi-cc--table-tbody-data-sort-progress[tpi-cc-parsing-data="courier-prepared-progress"]');
    if (preparedProgressElement && freshData.sortablesInCell > 0) {
        const newPrepared = freshData.sortablesPrepared || 0;
        const newInCell = freshData.sortablesInCell || 0;
        
        // Извлекаем текущие значения
        const currentText = preparedProgressElement.textContent.trim();
        const match = currentText.match(/(\d+)\s+из\s+(\d+)/);
        
        let currentPrepared = 0;
        let currentInCell = 0;
        
        if (match) {
            currentPrepared = parseInt(match[1]);
            currentInCell = parseInt(match[2]);
        }
        
        // Обновляем всегда, если данные изменились
        if (currentPrepared !== newPrepared || currentInCell !== newInCell) {
            // ИСПРАВЛЕНО: используем freshData вместо courierData
            preparedProgressElement.innerHTML = `<span><i>${tpi_cc_i_pen_outline}</i>${newPrepared}</span> из <span><i>${tpi_cc_i_pen_filled}</i>${newInCell}</span>`;
            
            // Обновляем процент
            const preparedPercent = newInCell > 0 ? Math.round((newPrepared / newInCell) * 100) : 0;
            const percentElement = row.querySelector('p.tpi-cc--table-tbody-data-sort-progress-circle-value[tpi-cc-parsing-data="courier-prepared-progress-percent"]');
            if (percentElement) {
                percentElement.textContent = `${preparedPercent}%`;
            }
            
            // Обновляем круговой прогресс
            const circleElement = row.querySelector('circle[tpi-cc-parsing-data="courier-prepared-progress-circle"]');
            if (circleElement) {
                const dashArray = 125.6;
                const dashOffset = dashArray - (dashArray * preparedPercent / 100);
                circleElement.style.stroke = getProgressColor(preparedPercent);
                circleElement.setAttribute('stroke-dashoffset', dashOffset);
            }
            
            updated = true;
            console.log(`🔄 Обновлен прогресс подготовки для курьера ${courierId}: ${currentPrepared}/${currentInCell} -> ${newPrepared}/${newInCell}`);
        }
    }
    
    // 4. Обновление времени окончания сортировки (только если в таблице null)
    const endTimeElement = row.querySelector('p[tpi-cc-time-type="end"]');
    const endDateElement = row.querySelector('p[tpi-cc-date-type="end"]');
    
    // Проверяем, что в таблице сейчас null
    const currentEndTime = endTimeElement ? endTimeElement.textContent.trim() : null;
    const currentEndDate = endDateElement ? endDateElement.textContent.trim() : null;
    
    if (freshData.finishedAt && 
        ((currentEndTime === 'null' || !currentEndTime) ||
         (currentEndDate === 'null' || !currentEndDate))) {
        
        const endTime = cc_formatTime(freshData.finishedAt);
        const endDate = cc_formatDate(freshData.finishedAt);
        
        if (endTime && endTimeElement && (currentEndTime === 'null' || !currentEndTime)) {
            endTimeElement.textContent = endTime;
            updated = true;
            console.log(`🔄 Обновлено время окончания для курьера ${courierId}: null -> ${endTime}`);
        }
        
        if (endDate && endDateElement && (currentEndDate === 'null' || !currentEndDate)) {
            endDateElement.textContent = endDate;
            updated = true;
            console.log(`🔄 Обновлена дата окончания для курьера ${courierId}: null -> ${endDate}`);
        }
    }

    // Обновляем отображение ячейки (для DEFAULT_COURIER важно)
    const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
    if (cellElement && freshData.cell && 
        freshData.cell !== 'null' && 
        freshData.cell !== 'Нет ячейки' && 
        freshData.cell.trim() !== '' && 
        cellElement.textContent.trim() !== freshData.cell) {
        
        cellElement.textContent = freshData.cell;
        updated = true;
        console.log(`🔄 Обновлена ячейка для курьера ${courierId}: ${cellElement.textContent} -> ${freshData.cell}`);
    }
    
    // 5. Сохраняем флаг обновления и данные ТОЛЬКО если были изменения
    if (updated) {
        // Сохраняем обновленные данные в data-атрибуты строки
        row.setAttribute('data-updated', 'true');
        row.setAttribute('data-updated-at', new Date().toISOString());
        row.setAttribute('data-courier-id', courierId);
        
        // Сохраняем ТОЛЬКО измененные данные
        if (freshData.status) {
            row.setAttribute('data-status', freshData.status);
        }
        
        if (freshData.ordersSorted !== undefined) {
            row.setAttribute('data-orders-sorted', freshData.ordersSorted);
        }
        
        if (freshData.ordersPlanned !== undefined) {
            row.setAttribute('data-orders-planned', freshData.ordersPlanned);
        }
        
        if (freshData.sortablesPrepared !== undefined) {
            row.setAttribute('data-sortables-prepared', freshData.sortablesPrepared);
        }
        
        if (freshData.sortablesInCell !== undefined) {
            row.setAttribute('data-sortables-in-cell', freshData.sortablesInCell);
        }
        
        if (freshData.finishedAt) {
            row.setAttribute('data-finished-at', freshData.finishedAt);
        }
    }
    
    return updated;
}

async function updatePartialDataInFirebase(selectedDate, updatedCouriersData) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return false;
        }
        
        // Форматируем дату в формат YYYY-MM-DD
        const dateParts = selectedDate.split('/');
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        console.log(`💾 Частичное обновление ${updatedCouriersData.length} записей в Firebase для даты:`, firebaseDate);
        
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const dateDoc = await dateDocRef.get();
        
        if (!dateDoc.exists) {
            console.log('❌ Документ даты не существует');
            return false;
        }
        
        const cartControlRef = dateDocRef.collection("cartControl");
        let successCount = 0;
        let errorCount = 0;
        
        // Обновляем только измененные записи
        for (const courier of updatedCouriersData) {
            try {
                // Используем courier-personal-id как ID документа
                const courierId = courier.externalId || courier.courierId;
                if (!courierId) {
                    console.log('⚠️ Пропускаем курьера без ID');
                    continue;
                }
                
                // Подготавливаем данные для обновления
                const updateData = {};
                
                // Добавляем только измененные поля
                if (courier.status !== undefined) updateData.status = courier.status;
                if (courier.ordersSorted !== undefined) updateData.ordersSorted = courier.ordersSorted;
                if (courier.ordersPlanned !== undefined) updateData.ordersPlanned = courier.ordersPlanned;
                if (courier.sortablesPrepared !== undefined) updateData.sortablesPrepared = courier.sortablesPrepared;
                if (courier.sortablesInCell !== undefined) updateData.sortablesInCell = courier.sortablesInCell;
                if (courier.finishedAt !== undefined) updateData.finishedAt = courier.finishedAt;
                if (courier.onlineTransferActId !== undefined) updateData.onlineTransferActId = courier.onlineTransferActId; // НОВОЕ
                if (courier.cell !== undefined && 
                    courier.cell !== null && 
                    courier.cell !== 'null' && 
                    courier.cell !== 'Нет ячейки' && 
                    courier.cell.trim() !== '') {
                    updateData.cell = courier.cell;
                }
                // Добавляем поле обновления
                updateData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
                
                // Обновляем документ
                await cartControlRef.doc(courierId).update(updateData);
                successCount++;
                
                console.log(`  ✅ Обновлен курьер ${courierId}`);
                
            } catch (error) {
                console.warn(`❌ Ошибка при обновлении курьера ${courier.courier}:`, error);
                errorCount++;
            }
        }
        
        console.log(`✅ Частичное обновление завершено: ${successCount} успешно, ${errorCount} с ошибками`);
        return successCount > 0;
        
    } catch (error) {
        console.warn('💥 Ошибка при частичном обновлении данных в Firebase:', error);
        return false;
    }
}

// C-
// C-
// C-       Получаем общие данные о маршрутах от YM API
// C-
// C-

async function tpi_getRoutesSummary(selectedDate = null) {
    try {
        // Формируем URL для запроса
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'sortingCenter/routes/resolveGetRoutesSummary:resolveGetRoutesSummary');

        // Определяем дату для запроса
        let targetDate;
        let dateForLog;
        
        if (selectedDate) {
            // Используем выбранную дату из формата DD/MM/YYYY
            const dateParts = selectedDate.split('/');
            if (dateParts.length === 3) {
                targetDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
                dateForLog = selectedDate;
            } else {
                targetDate = new Date();
                dateForLog = 'текущая';
            }
        } else {
            targetDate = new Date();
            dateForLog = 'текущая';
        }

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        const requestBody = {
            "params": [{
                "sortingCenterId": "21972131",
                "date": currentDate,
                "type": "OUTGOING_COURIER",
                "category": "COURIER"
            }],
            "path": `/sorting-center/21972131/routes?type=OUTGOING_COURIER&sort=&hasCarts=false&category=COURIER&date=${currentDate}`
        };

        const response = await fetch(url.toString(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Market-Core-Service': '<UNKNOWN>',
                'sk': tpiUserTOKEN
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
                console.log(`❌ Ошибка API для даты ${currentDate}:`, result.error.message);
                return null;
            }

            if (result.data) {
                return result.data;
            }
        }
        
        console.log(`❌ Нет данных за дату ${currentDate}`);
        return null;
        
    } catch (error) {
        console.warn(`💥 Ошибка при получении сводных данных за дату ${currentDate || 'неизвестную'}:`, error);
        return null;
    }
}

//C- Функция для получения данных за последние 30 дней
async function tpi_getLast20DaysStats() {
    try {
        const graphContainer = document.querySelector('.tpi-cc-graph-container');
        const loader = document.querySelector('.tpi-cc-graph-loader');
        if (loader) loader.style.display = 'flex';
        if (graphContainer) graphContainer.style.display = 'none';
        
        const dates = [];
        const ordersShippedData = [];
        const allDaysData = [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const promises = [];
        const dateMap = new Map();
        
        for (let i = 19; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const formattedDate = formatDateToDDMMYYYY(date);
            
            const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
            const parts = formattedDate.split('/');
            const day = parts[0];
            const month = parseInt(parts[1]) - 1;
            const displayDate = `${day} ${months[month]}`;
            
            dates.push(displayDate);
            dateMap.set(displayDate, {
                fullDate: formattedDate,
                index: dates.length - 1
            });
        }
        
        for (let i = 19; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const formattedDate = formatDateToDDMMYYYY(date);
            
            const promise = tpi_getRoutesSummary(formattedDate)
                .then(summaryData => {
                    if (summaryData) {
                        return {
                            fullDate: formattedDate,
                            ordersShipped: summaryData.ordersShipped || 0,
                            fullData: summaryData
                        };
                    } else {
                        return {
                            fullDate: formattedDate,
                            ordersShipped: 0,
                            fullData: null
                        };
                    }
                })
                .catch(error => {
                    return {
                        fullDate: formattedDate,
                        ordersShipped: 0,
                        fullData: null
                    };
                });
            
            promises.push(promise);
        }
        
        const results = await Promise.all(promises);
        
        const orderedData = new Array(20).fill(null);
        
        results.forEach(result => {
            const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
            const parts = result.fullDate.split('/');
            const day = parts[0];
            const month = parseInt(parts[1]) - 1;
            const displayDate = `${day} ${months[month]}`;
            
            const mapEntry = dateMap.get(displayDate);
            if (mapEntry) {
                orderedData[mapEntry.index] = {
                    value: result.ordersShipped,
                    fullData: result.fullData,
                    fullDate: result.fullDate
                };
            }
        });
        
        ordersShippedData.length = 0;
        allDaysData.length = 0;
        orderedData.forEach(item => {
            if (item) {
                ordersShippedData.push(item);
                allDaysData.push(item.fullData);
            } else {
                ordersShippedData.push({
                    value: 0,
                    fullData: null,
                    fullDate: 'Нет данных'
                });
                allDaysData.push(null);
            }
        });
        
        return { dates, ordersShippedData, allDaysData };
        
    } catch (error) {
        return { dates: [], ordersShippedData: [], allDaysData: [] };
    }
}
//C- Функция для инициализации графика
async function initializeChart() {
    const graphContainer = document.querySelector('.tpi-cc-graph-container');
    const loader = document.querySelector('.tpi-cc-graph-loader');
    
    if (!graphContainer) return;
    
    if (!loader && graphContainer.parentNode) {
        const newLoader = document.createElement('div');
        newLoader.className = 'tpi-cc-graph-loader';
        newLoader.innerHTML = `
            <div class="tpi-cc-graph-loader-spinner"></div>
            <p>Загрузка данных для графика...</p>
        `;
        graphContainer.parentNode.insertBefore(newLoader, graphContainer);
    }
    
    const { dates, ordersShippedData, allDaysData } = await tpi_getLast20DaysStats();
    
    const loaderElement = document.querySelector('.tpi-cc-graph-loader');
    if (loaderElement) loaderElement.style.display = 'none';
    graphContainer.style.display = 'block';
    
    let totalOrdersPlanned = 0, totalOrdersShipped = 0, totalOrdersLeft = 0, totalOrdersAccepted = 0, totalAcceptedButNotShipped = 0;
    if (allDaysData && allDaysData.length > 0) {
        allDaysData.forEach(dayData => {
            if (dayData) {
                totalOrdersPlanned += dayData.ordersPlanned || 0;
                totalOrdersShipped += dayData.ordersShipped || 0;
                totalOrdersLeft += dayData.ordersLeft || 0;
                totalOrdersAccepted += dayData.ordersAccepted || 0;
                totalAcceptedButNotShipped += (dayData.ordersAccepted || 0) - (dayData.ordersShipped || 0);
            }
        });
    }
    
    const totalOrdersElement = document.getElementById('tpi-cc-total-orderes');
    const totalShippedElement = document.getElementById('tpi-cc-total-orderes-shipped');
    const totalAcceptedElement = document.getElementById('tpi-cc-total-orderes-accepted');
    const totalMissedElement = document.getElementById('tpi-cc-total-orderes-missed');
    if (totalOrdersElement) totalOrdersElement.textContent = totalOrdersPlanned;
    if (totalShippedElement) totalShippedElement.textContent = totalOrdersShipped;
    if (totalAcceptedElement) totalAcceptedElement.textContent = totalOrdersAccepted;
    if (totalMissedElement) totalMissedElement.textContent = Math.max(0, totalAcceptedButNotShipped);
    
    if (dates.length === 0 || ordersShippedData.length === 0) {
        graphContainer.innerHTML = '<div class="tpi-cc-graph-error">Нет данных для отображения графика</div>';
        return;
    }
    
    if (tpiChartInstance) tpiChartInstance.dispose();
    tpiChartInstance = echarts.init(graphContainer);
    
    const weekDaysShort = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const dayOfWeekLabels = dates.map((dateStr, index) => {
        const months = {'янв':0, 'фев':1, 'мар':2, 'апр':3, 'май':4, 'июн':5, 'июл':6, 'авг':7, 'сен':8, 'окт':9, 'ноя':10, 'дек':11};
        const parts = dateStr.split(' ');
        
        if (parts.length === 2) {
            const day = parseInt(parts[0], 10);
            const monthAbbr = parts[1];
            const monthIndex = months[monthAbbr];
            
            // ИСПРАВЛЕНИЕ: используем фактические данные из ordersShippedData
            if (ordersShippedData[index] && ordersShippedData[index].fullDate) {
                const fullDateStr = ordersShippedData[index].fullDate; // формат DD/MM/YYYY
                const dateParts = fullDateStr.split('/');
                
                if (dateParts.length === 3) {
                    const year = parseInt(dateParts[2], 10);
                    const month = parseInt(dateParts[1], 10) - 1;
                    const dayOfMonth = parseInt(dateParts[0], 10);
                    
                    const actualDate = new Date(year, month, dayOfMonth);
                    if (!isNaN(actualDate.getTime())) {
                        const dayIndex = actualDate.getDay(); // 0 = вс, 1 = пн, ..., 6 = сб
                        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                        return weekDaysShort[adjustedIndex];
                    }
                }
            }
            
            // Запасной вариант с текущим годом, если нет данных
            const tempDate = new Date(new Date().getFullYear(), monthIndex, day);
            if (!isNaN(tempDate.getTime())) {
                const dayIndex = tempDate.getDay();
                const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                return weekDaysShort[adjustedIndex];
            }
        }
        return '';
    });
    
    const option = {
        title: { show: false },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            position: point => [point[0] + 15, point[1] - 40],
            transitionDuration: 0.2,
            hideDelay: 50,
            showDelay: 0,
            className: 'tpi-cc-chart-tooltip',
            formatter: params => {
                const data = params[0].data;
                const fullData = data.fullData;
                const date = data.fullDate;
                if (!fullData) return `${date}<br/>Нет данных за эту дату`;
                const formatDateTime = dt => {
                    if (!dt) return 'N/A';
                    try {
                        const d = new Date(dt);
                        return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
                    } catch { return dt; }
                };
                return `
                    <div style="font-weight: bold; margin-bottom: 5px;">${date}</div>
                    <div>Статус: ${fullData.status || 'N/A'}</div>
                    <div>Отгружено: ${fullData.ordersShipped || 0}</div>
                    <div>К отгрузке: ${fullData.ordersPlanned || 0}</div>
                    <div>Принято на СЦ: ${fullData.ordersAccepted || 0}</div>
                    <div>Осталось отгрузить: ${fullData.ordersLeft || 0}</div>
                    <div>Начало сортировки: ${formatDateTime(fullData.startedAt)}</div>
                `;
            },
            backgroundColor: '#00000094',
            borderColor: '#fc0',
            textStyle: { color: '#fff', fontSize: 12 },
            padding: [10, 15],
            extraCssText: 'box-shadow: 0 4px 12px #0000004D; border-radius: 6px;',
            enterable: false,
            alwaysShowContent: false
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '10%',
            containLabel: false
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisTick: { alignWithLabel: true, length: 5 },
            axisLabel: {
                rotate: 0,
                fontSize: 10,
                color: '#666',
                margin: 15,
                fontWeight: '500',
                interval: 0
            },
            axisLine: { lineStyle: { color: '#ddd' } }
        },
        yAxis: {
            type: 'value',
            name: 'Отгружено',
            nameTextStyle: { color: '#666', fontSize: 11, fontWeight: '500' },
            splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
            axisLabel: { fontSize: 10, color: '#666' }
        },
        series: [
            {
                name: 'Отгружено',
                type: 'bar',
                data: ordersShippedData,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: '#ffae00' },
                            { offset: 1, color: '#ffcc00' }
                        ]
                    },
                    borderRadius: [12, 12, 0, 0],
                    borderColor: '#ff8b00',
                    borderWidth: 1
                },
                barWidth: '70%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: params => params.data.value,
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#212121'
                },
                emphasis: {
                    itemStyle: { color: '#ffaa00' },
                    shadowBlur: 10,
                    shadowColor: '#ffaa00'
                },
                animation: false
            }
        ],
        animation: false
    };
    
    tpiChartInstance.setOption(option);
    
    // Флаг для контроля обновления графики
    let needsGraphicUpdate = true;
    let resizeTimer = null;
    
    function addWeekdayGraphics() {
        if (!tpiChartInstance) return;
        
        const graphics = [];
        const categoryCount = dates.length;
        
        for (let i = 0; i < categoryCount; i++) {
            const dayText = dayOfWeekLabels[i];
            if (!dayText) continue;
            
            // Получаем координату центра категории
            const point = tpiChartInstance.convertToPixel({ xAxisIndex: 0 }, i);
            if (!point) continue;
            
            // Получаем высоту столбца (значение) для определения нижней границы
            const value = ordersShippedData[i].value;
            const yZero = tpiChartInstance.convertToPixel({ yAxisIndex: 0 }, 0);
            
            if (yZero === null) continue;
            
            // Нижняя часть столбца: примерно yZero
            const x = point - 5;
            const y = yZero - 15; // чуть выше нулевой линии
            
            graphics.push({
                type: 'text',
                left: x - 2,
                top: y,
                style: {
                    text: dayText,
                    fill: '#212121',
                    font: 'bold 12px Arial, sans-serif',
                    textAlign: 'center',
                    textVerticalAlign: 'bottom'
                },
                z: 100
            });
        }
        
        tpiChartInstance.setOption({ graphic: graphics });
        needsGraphicUpdate = false;
    }
    
    // Первоначальное добавление графики
    addWeekdayGraphics();
    
    // Слушаем событие rendered, но обновляем графику только при необходимости
    tpiChartInstance.on('rendered', () => {
        if (needsGraphicUpdate) {
            addWeekdayGraphics();
        }
    });
    
    // Оптимизированный обработчик изменения размера с debounce
    const debouncedResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (tpiChartInstance) {
                tpiChartInstance.resize();
                needsGraphicUpdate = true;
                addWeekdayGraphics();
            }
        }, 100);
    };
    window.addEventListener('resize', debouncedResize);
    
    graphContainer.addEventListener('mouseleave', () => {
        if (tpiChartInstance) setTimeout(() => tpiChartInstance.dispatchAction({ type: 'hideTip' }), 100);
    });
    
    const graphItem = document.querySelector('.tpi-cc-graph-item');
    const graphDivider = document.querySelector('.tpi-cc-graph-item-devider');
    if (graphItem) graphItem.style.visibility = 'visible';
    if (graphDivider) graphDivider.style.visibility = 'visible';
}

function disposeChart() {
    if (tpiChartInstance) {
        tpiChartInstance.dispose();
        tpiChartInstance = null;
    }
}

// Добавляем вызов очистки при уходе со страницы
window.addEventListener('beforeunload', function() {
    disposeChart();
});

// Также очищаем при скрытии страницы (для SPA)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && tpiChartInstance) {
        // Можно ничего не делать или задиспоузить
    }
});

function initializeChartOnce() {
    const graphItem = document.querySelector('.tpi-cc-graph-item');
    const graphDivider = document.querySelector('.tpi-cc-graph-item-devider');
    if (graphItem) graphItem.style.visibility = 'hidden';
    if (graphDivider) graphDivider.style.visibility = 'hidden';
    
    if (window.tpiChartInitialized) {
        return;
    }
    
    const checkECharts = setInterval(() => {
        if (typeof echarts !== 'undefined' && document.querySelector('.tpi-cc-graph-container')) {
            clearInterval(checkECharts);
            setTimeout(() => {
                initializeChart();
                window.tpiChartInitialized = true;
            }, 500);
        }
    }, 200);
    
    setTimeout(() => {
        clearInterval(checkECharts);
        if (!window.tpiChartInitialized) {
            const graphContainer = document.querySelector('.tpi-cc-graph-container');
            if (graphContainer) {
                graphContainer.innerHTML = '<div class="tpi-cc-graph-error">Ошибка загрузки библиотеки графиков</div>';
            }
        }
    }, 5000);
}

//C-
//C-
//C- QR Коды /// CБОР ДАННЫХ ИЗ ТАБЛИЦЫ /// ГЕНЕРАЦИЯ PDF
//C-
//C-


// Функция для загрузки шрифта в формате base64
async function loadFontAsBase64(path) {
    const response = await fetch(path);
    const buffer = await response.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

// Функция для генерации QR-кодов с использованием qrcode.min.js
async function tpi_cc_generateQRcodes_toPrint(cartNumbers, palletNumbers) {
    const allQRPromises = [];
    const qrCodes = [];
    
    // Собираем все номера для генерации QR-кодов в правильном порядке
    // Сначала все CART номера по порядку из каждой строки
    if (cartNumbers && cartNumbers.length > 0) {
        // Транспонируем массив: сначала все первые CART номера, потом все вторые и т.д.
        const maxCartLength = Math.max(...cartNumbers.map(arr => arr.length));
        
        for (let i = 0; i < maxCartLength; i++) {
            cartNumbers.forEach((courierCarts, courierIndex) => {
                if (i < courierCarts.length) {
                    allQRPromises.push({
                        type: 'CART',
                        value: courierCarts[i],
                        courierIndex: courierIndex,
                        order: i
                    });
                }
            });
        }
    }
    
    // Затем все PALLET номера по порядку из каждой строки
    if (palletNumbers && palletNumbers.length > 0) {
        const maxPalletLength = Math.max(...palletNumbers.map(arr => arr.length));
        
        for (let i = 0; i < maxPalletLength; i++) {
            palletNumbers.forEach((courierPallets, courierIndex) => {
                if (i < courierPallets.length) {
                    allQRPromises.push({
                        type: 'PALLET',
                        value: courierPallets[i],
                        courierIndex: courierIndex,
                        order: i
                    });
                }
            });
        }
    }
    
    console.log(`🔄 Всего для генерации QR-кодов: ${allQRPromises.length} шт.`);
    
    // Генерируем QR-коды
    for (let i = 0; i < allQRPromises.length; i++) {
        const item = allQRPromises[i];
        try {
            // Создаем временный контейнер для QR-кода
            const qrContainer = document.createElement("div");
            
            // Генерируем QR-код
            new QRCode(qrContainer, {
                text: item.value,
                width: 200,
                height: 200,
                correctLevel: QRCode.CorrectLevel.M
            });
            
            // Ждем генерации и получаем DataURL
            const qrDataURL = await new Promise(resolve => {
                setTimeout(() => {
                    const img = qrContainer.querySelector("img");
                    if (img) {
                        resolve(img.src);
                    } else {
                        const canvas = qrContainer.querySelector("canvas");
                        resolve(canvas ? canvas.toDataURL() : null);
                    }
                }, 100);
            });
            
            if (qrDataURL) {
                qrCodes.push({
                    ...item,
                    qrDataURL
                });
            }
            
        } catch (error) {
            console.warn(`❌ Ошибка генерации QR для ${item.value}:`, error);
        }
    }
    
    return qrCodes;
}

// Функция для сбора данных из таблицы
function tpi_cc_claimTableData_toPrint() {
    const tableData = [];
    const rows = document.querySelectorAll('.tpi-cc--table-tbody');
    
    console.log(`🔍 Поиск данных в ${rows.length} строках`);
    
    rows.forEach((row, rowIndex) => {
        // 1) Получаем ФИО курьера
        const courierNameElement = row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]');
        const courierName = courierNameElement ? courierNameElement.textContent.trim() : 'Не указано';
        
        // 2) Получаем ячейку курьера
        const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
        const cellValue = cellElement ? cellElement.textContent.trim() : 'Нет ячейки';
        const cellAttribute = cellElement ? cellElement.getAttribute('courier-spec-cell') : '';
        
        // 3) Получаем все НЕЗАБЛОКИРОВАННЫЕ CART номера
        const cartElements = row.querySelectorAll('.tpi-cc--table-tbody-data-carts .tpi-cc-table-tbody-data-cart-id[tpi-data-courier-spec-cell]');
        const cartNumbers = Array.from(cartElements)
            .filter(el => !el.hasAttribute('tpi-cc-button-is-blocked'))
            .map(el => el.getAttribute('tpi-data-courier-spec-cell'));
        
        // 4) Получаем все НЕЗАБЛОКИРОВАННЫЕ PALLET номера
        const palletElements = row.querySelectorAll('.tpi-cc--table-tbody-data-pallets .tpi-cc-table-tbody-data-pallet-id[tpi-data-courier-spec-cell]');
        const palletNumbers = Array.from(palletElements)
            .filter(el => !el.hasAttribute('tpi-cc-button-is-blocked'))
            .map(el => el.getAttribute('tpi-data-courier-spec-cell'));
        
        console.log(`📋 Строка ${rowIndex + 1}:`, {
            courier: courierName,
            cell: cellValue,
            carts: cartNumbers,
            pallets: palletNumbers
        });
        
        // Добавляем в результат только если есть хотя бы один незаблокированный номер
        if (cartNumbers.length > 0 || palletNumbers.length > 0) {
            tableData.push({
                courierName,
                cell: {
                    value: cellValue,
                    attribute: cellAttribute
                },
                cartNumbers,
                palletNumbers
            });
        }
    });
    
    console.log(`📊 Собрано данных для ${tableData.length} курьеров`);
    return tableData;
}

//A-
//A-
//A-    ПЕЧАТЬ PDF и слушатели событий
//A-
//A-


// Единый обработчик для всех кнопок печати
document.addEventListener('click', async function(event) {
    // Проверяем, не кликнули ли по кнопке печати всех
    const printAllButton = event.target.closest('.tpi-cc-print-all');
    if (printAllButton) {
        event.preventDefault();
        event.stopPropagation();
        
        const printText = printAllButton.querySelector('.tpi-cc-print-all-text');
        const progBlock = document.querySelector('.tpi-cc-print-all-progress-bar')
        const data = tpi_cc_claimTableData_toPrint();
        
        await tpi_cc_generatePDFlabels(data, {
            printButton: printAllButton,
            progressText: printText,
            isSingleCourier: false,
            progressBlock: progBlock
        });
        return;
    }

    // Проверяем, не кликнули ли по кнопке печати в процессе-менеджере
    const processPrintButton = event.target.closest('.tpi-cc-process-manager-button[tpi-cc-action="print"]');
    if (processPrintButton) {
        event.preventDefault();
        event.stopPropagation();

        // Добавляем получение прогресс-бара
        const progBlock = document.querySelector('.tpi-cc-print-selected-progress-bar');
        let printText = document.querySelector('.tpi-cc-process-manager-button[tpi-cc-action="print"] p.tpi-cc-process-manager-text')
            
        // БЛОКИРУЕМ ВСЕ КНОПКИ В ПРОЦЕСС-МЕНЕДЖЕРЕ (включая кнопку закрытия)
        const processManagerButtons = document.querySelectorAll('.tpi-cc-process-manager-button');
        const closeButton = document.querySelector('.tpi-cc-process-manager-close');
        const selectRowsButtons = document.querySelectorAll('.tpi-print-row-button')
        
        processManagerButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.disabled = true;
        });
        
        // Блокируем кнопку закрытия отдельно
        if (closeButton && selectRowsButtons) {
            closeButton.style.pointerEvents = 'none';
            closeButton.disabled = true;
            selectRowsButtons.forEach(btn => {
                btn.disabled = true;
            })
        }
        
        // БЛОКИРУЕМ ВСЕ КНОПКИ CART И PALLET В ТАБЛИЦЕ
        const allTableButtons = document.querySelectorAll('.tpi-cc--table-tbody-data-button');
        allTableButtons.forEach(btn => {
            btn.disabled = true;
        });

        // Собираем выбранные номера CART и PALLET
        const selectedCartButtons = document.querySelectorAll('.tpi-cc-table-tbody-data-cart-id[tpi-cc-selected-courier-cell]:not([tpi-cc-button-is-blocked])');
        const selectedPalletButtons = document.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id[tpi-cc-selected-courier-cell]:not([tpi-cc-button-is-blocked])');

        if (selectedCartButtons.length === 0 && selectedPalletButtons.length === 0) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Нет выделенных', 'warning', 'Не выбрано ни одного CART или PALLET номера');
            }
            // РАЗБЛОКИРУЕМ КНОПКИ ПРИ ОШИБКЕ
            processManagerButtons.forEach(btn => {
                btn.style.pointerEvents = '';
                btn.disabled = false;
            });
            if (closeButton && selectRowsButtons) {
                closeButton.style.pointerEvents = '';
                closeButton.disabled = false;
                selectRowsButtons.forEach(btn => {
                    btn.disabled = false;
                })
            }
            allTableButtons.forEach(btn => {
                btn.disabled = false;
            });
            return;
        }

        // Группируем по строкам
        const rowsMap = new Map();
        
        selectedCartButtons.forEach(btn => {
            const row = btn.closest('.tpi-cc--table-tbody');
            if (!row) return;
            
            const rowIndex = Array.from(document.querySelectorAll('.tpi-cc--table-tbody')).indexOf(row);
            if (!rowsMap.has(rowIndex)) {
                rowsMap.set(rowIndex, {
                    courierName: row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]')?.textContent.trim() || 'Не указано',
                    cell: {
                        value: row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]')?.textContent.trim() || 'Нет ячейки',
                        attribute: row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]')?.getAttribute('courier-spec-cell') || ''
                    },
                    cartNumbers: [],
                    palletNumbers: []
                });
            }
            
            rowsMap.get(rowIndex).cartNumbers.push(btn.getAttribute('tpi-data-courier-spec-cell'));
        });

        selectedPalletButtons.forEach(btn => {
            const row = btn.closest('.tpi-cc--table-tbody');
            if (!row) return;
            
            const rowIndex = Array.from(document.querySelectorAll('.tpi-cc--table-tbody')).indexOf(row);
            if (!rowsMap.has(rowIndex)) {
                rowsMap.set(rowIndex, {
                    courierName: row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]')?.textContent.trim() || 'Не указано',
                    cell: {
                        value: row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]')?.textContent.trim() || 'Нет ячейки',
                        attribute: row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]')?.getAttribute('courier-spec-cell') || ''
                    },
                    cartNumbers: [],
                    palletNumbers: []
                });
            }
            
            rowsMap.get(rowIndex).palletNumbers.push(btn.getAttribute('tpi-data-courier-spec-cell'));
        });

        const data = Array.from(rowsMap.values());
        
        try {
            await tpi_cc_generatePDFlabels(data, {
                printButton: processPrintButton,
                isSingleCourier: data.length === 1,
                progressText: printText,
                progressBlock: progBlock
            });
        } finally {
            // РАЗБЛОКИРУЕМ ВСЕ КНОПКИ ПОСЛЕ ЗАВЕРШЕНИЯ
            processManagerButtons.forEach(btn => {
                btn.style.pointerEvents = '';
                btn.disabled = false;
            });
            if (closeButton && selectRowsButtons) {
                closeButton.style.pointerEvents = '';
                closeButton.disabled = false;
                selectRowsButtons.forEach(btn => {
                    btn.disabled = false;
                })
            }
            allTableButtons.forEach(btn => {
                btn.style.pointerEvents = '';
                btn.disabled = false;
            });
        }
        return;
    }

    // Проверяем, не кликнули ли по кнопке печати текущей строки
    const printRowButton = event.target.closest('.tpi-cc--print-current-row');
    if (printRowButton) {
        event.preventDefault();
        event.stopPropagation();

        if (printRowButton.hasAttribute('tpi-cc-printing-state')) {
            console.log('⏳ Печать уже выполняется');
            return;
        }

        const row = printRowButton.closest('.tpi-cc--table-tbody');
        if (!row) return;

        // Собираем данные из строки
        const courierName = row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]')?.textContent.trim() || 'Не указано';
        const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
        
        const cartNumbers = Array.from(row.querySelectorAll('.tpi-cc--table-tbody-data-carts .tpi-cc-table-tbody-data-cart-id[tpi-data-courier-spec-cell]'))
            .map(el => el.getAttribute('tpi-data-courier-spec-cell'));
        
        const palletNumbers = Array.from(row.querySelectorAll('.tpi-cc--table-tbody-data-pallets .tpi-cc-table-tbody-data-pallet-id[tpi-data-courier-spec-cell]'))
            .map(el => el.getAttribute('tpi-data-courier-spec-cell'));

        if (cartNumbers.length === 0 && palletNumbers.length === 0) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Нет номеров', 'warning', 'У курьера нет CART или PALLET номеров для печати');
            }
            return;
        }

        const courierData = [{
            courierName,
            cell: {
                value: cellElement?.textContent.trim() || 'Нет ячейки',
                attribute: cellElement?.getAttribute('courier-spec-cell') || ''
            },
            cartNumbers,
            palletNumbers
        }];

        await tpi_cc_generatePDFlabels(courierData, {
            printButton: printRowButton,
            isSingleCourier: true
        });
    }
});

// Удаляем старые обработчики, которые могут конфликтовать
const oldPrintAllHandler = document.querySelector('.tpi-cc-print-all')?._tpiHandler;
if (oldPrintAllHandler) {
    document.removeEventListener('click', oldPrintAllHandler);
}

// Единая функция для генерации PDF с этикетками
async function tpi_cc_generatePDFlabels(data, options = {}) {
    const {
        printButton = null,
        progressText = null,
        isSingleCourier = false,
        progressBlock = null
    } = options;

    try {
        // Устанавливаем состояние загрузки для кнопки
        if (printButton) {
            printButton.setAttribute('tpi-cc-printing-state', 'loading');
            printButton.disabled = true;
        }

        // Приводим данные к массиву, если это не массив
        let couriersData = Array.isArray(data) ? data : (data ? [data] : []);
        
        // Если данные пустые, собираем из таблицы
        if (couriersData.length === 0) {
            couriersData = tpi_cc_claimTableData_toPrint();
        }

        if (couriersData.length === 0) {
            throw new Error('Нет данных для печати');
        }

        // Очищаем данные от лишних пробелов и переносов строк
        couriersData = couriersData.map(courier => ({
            ...courier,
            courierName: courier.courierName ? courier.courierName.trim().replace(/\s+/g, ' ') : 'Не указано',
            cell: typeof courier.cell === 'object' 
                ? {
                    value: (courier.cell.value || courier.cell.attribute || '').trim().replace(/\s+/g, ' '),
                    attribute: (courier.cell.attribute || courier.cell.value || '').trim().replace(/\s+/g, ' ')
                  }
                : {
                    value: (courier.cell || '').trim().replace(/\s+/g, ' '),
                    attribute: (courier.cell || '').trim().replace(/\s+/g, ' ')
                  }
        }));

        // Формируем массивы для генерации QR-кодов
        const allCartNumbers = couriersData.map(item => item.cartNumbers || []);
        const allPalletNumbers = couriersData.map(item => item.palletNumbers || []);

        console.log('📊 Данные для печати:', {
            couriersCount: couriersData.length,
            cartNumbers: allCartNumbers,
            palletNumbers: allPalletNumbers
        });

        // Собираем все элементы для генерации QR-кодов
        const allQRPromises = [];

        // Сначала все CART номера
        if (allCartNumbers && allCartNumbers.length > 0) {
            const maxCartLength = Math.max(...allCartNumbers.map(arr => arr.length), 0);
            console.log(`📦 Максимальная длина CART: ${maxCartLength}`);
            
            for (let i = 0; i < maxCartLength; i++) {
                allCartNumbers.forEach((courierCarts, courierIndex) => {
                    if (courierCarts && i < courierCarts.length) {
                        const value = courierCarts[i];
                        if (value && value.startsWith('CART-')) {
                            allQRPromises.push({
                                type: 'CART',
                                value: value,
                                courierIndex: courierIndex,
                                order: i
                            });
                            console.log(`✅ Добавлен CART: ${value}`);
                        }
                    }
                });
            }
        }

        // Затем все PALLET номера
        if (allPalletNumbers && allPalletNumbers.length > 0) {
            const maxPalletLength = Math.max(...allPalletNumbers.map(arr => arr.length), 0);
            console.log(`📦 Максимальная длина PALLET: ${maxPalletLength}`);
            
            for (let i = 0; i < maxPalletLength; i++) {
                allPalletNumbers.forEach((courierPallets, courierIndex) => {
                    if (courierPallets && i < courierPallets.length) {
                        const value = courierPallets[i];
                        if (value && value.startsWith('PALLET-')) {
                            allQRPromises.push({
                                type: 'PALLET',
                                value: value,
                                courierIndex: courierIndex,
                                order: i
                            });
                            console.log(`✅ Добавлен PALLET: ${value}`);
                        }
                    }
                });
            }
        }

        console.log(`🔄 Всего для генерации QR-кодов: ${allQRPromises.length} шт.`);
        
        const qrCodes = [];
        const totalQRCount = allQRPromises.length;

        // Обновляем прогресс, если есть текстовый элемент
        if (progressText && progressBlock) {
            // Определяем, от какой кнопки пришел вызов
            const isProcessButton = printButton && printButton.closest('.tpi-cc-process-manager-button');
            progressText.textContent = isProcessButton ? '0%' : 'Генерация: 0%';
            progressBlock.style.width = '0%';
        }

        // Генерируем QR-коды с обновлением прогресса
        for (let i = 0; i < allQRPromises.length; i++) {
            const item = allQRPromises[i];
            
            try {
                // Создаем временный контейнер для QR-кода
                const qrContainer = document.createElement("div");
                
                // Генерируем QR-код
                new QRCode(qrContainer, {
                    text: item.value,
                    width: 200,
                    height: 200,
                    correctLevel: QRCode.CorrectLevel.M
                });
                
                // Ждем генерации и получаем DataURL
                const qrDataURL = await new Promise(resolve => {
                    setTimeout(() => {
                        const img = qrContainer.querySelector("img");
                        if (img) {
                            resolve(img.src);
                        } else {
                            const canvas = qrContainer.querySelector("canvas");
                            resolve(canvas ? canvas.toDataURL() : null);
                        }
                    }, 100);
                });
                
                if (qrDataURL) {
                    qrCodes.push({
                        ...item,
                        qrDataURL
                    });
                    console.log(`✅ QR сгенерирован для ${item.value}`);
                } else {
                    console.warn(`❌ Не удалось получить QR для ${item.value}`);
                }
                
            } catch (error) {
                console.warn(`❌ Ошибка генерации QR для ${item.value}:`, error);
            }

            // Обновляем прогресс после каждого QR-кода
            const progress = Math.round(((i + 1) / totalQRCount) * 100);
            if (progressText && progressBlock) {
                const isProcessButton = printButton && printButton.closest('.tpi-cc-process-manager-button');
                progressText.textContent = isProcessButton ? `${progress}%` : `Генерация: ${progress}%`;
                progressBlock.style.width = `${progress}%`;
            }
            
            // Небольшая задержка для плавности обновления UI
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        if (!qrCodes || qrCodes.length === 0) {
            throw new Error('Не удалось сгенерировать QR-коды');
        }

        // Создаем PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // ===== Подключаем шрифты с проверкой контекста =====
        try {
            // Проверяем, доступен ли chrome.runtime
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
                const fontPaths = {
                    regular: chrome.runtime.getURL('fonts/Roboto-Regular.ttf'),
                    bold: chrome.runtime.getURL('fonts/Roboto-Bold.ttf'),
                    black: chrome.runtime.getURL('fonts/Roboto-Black.ttf')
                };

                pdf.addFileToVFS("Roboto-Regular.ttf", await loadFontAsBase64(fontPaths.regular));
                pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");

                pdf.addFileToVFS("Roboto-Bold.ttf", await loadFontAsBase64(fontPaths.bold));
                pdf.addFont("Roboto-Bold.ttf", "Roboto", "bold");

                pdf.addFileToVFS("Roboto-Black.ttf", await loadFontAsBase64(fontPaths.black));
                pdf.addFont("Roboto-Black.ttf", "Roboto", "black");
            } else {
                console.log('⚠️ Контекст расширения недоступен, используем стандартные шрифты');
                pdf.setFont("helvetica", "bold");
            }
        } catch (fontError) {
            console.log('⚠️ Ошибка загрузки шрифтов, используем стандартные:', fontError);
            pdf.setFont("helvetica", "bold");
        }

        // Генерируем страницы для каждого QR-кода
        for (let i = 0; i < qrCodes.length; i++) {
            if (i > 0) pdf.addPage();

            const qr = qrCodes[i];
            const courierInfo = couriersData[qr.courierIndex];

        if (qr.type === 'PALLET') {
            // ===== ДИЗАЙН ДЛЯ PALLET =====
            
            // Квадрат справа
            const squareSize = 50;
            const squareX = pageWidth - squareSize - 5;
            const squareY = 10;
            
            // Заливка квадрата серым
            pdf.setFillColor(240, 240, 240);
            pdf.roundedRect(squareX, squareY, squareSize, squareSize, 10, 10, 'F');
            
            // Черная рамка
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.35);
            pdf.roundedRect(squareX, squareY, squareSize, squareSize, 10, 10, 'S');
            
            // QR-код в центре
            if (qr.qrDataURL) {
                const qrSize = 100;
                const qrX = (pageWidth - qrSize) / 2;
                const qrY = (pageHeight - qrSize) / 2 - 20;
                pdf.addImage(qr.qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
            }
            
            // Ячейка слева
            pdf.setFontSize(100);
            pdf.setFont("Roboto", "black");
            const cellValue = typeof courierInfo.cell === 'object' 
                ? (courierInfo.cell.value || courierInfo.cell.attribute || 'Нет ячейки')
                : (courierInfo.cell || 'Нет ячейки');
            
            // Проверяем, длинное ли название (DEFAULT_COURIER и т.д.)
            if (cellValue.includes('DEFAULT_COURIER') || cellValue.length > 20) {
                // Разбиваем на части
                pdf.setFontSize(30); // Уменьшаем размер для длинных названий
                
                const firstLine = cellValue.substring(0, 20);
                const secondLine = cellValue.substring(20);
                
                pdf.text(firstLine, 5, 30);
                if (secondLine) {
                    pdf.text(secondLine, 5, 45);
                }
            } else {
                pdf.text(cellValue, 5, 45);
            }
            
            // Номер PALLET под QR
            const pureNumber = qr.value;
            pdf.setFontSize(35);
            pdf.text(pureNumber, 6, 58);
            
        } else {
                // Для CART - ячейка справа
                pdf.setFont("Roboto", "black");
                const cellValue = typeof courierInfo.cell === 'object'
                    ? (courierInfo.cell.value || courierInfo.cell.attribute || 'Нет ячейки')
                    : (courierInfo.cell || 'Нет ячейки');
                
                // Проверяем, длинное ли название (DEFAULT_COURIER и т.д.)
                if (cellValue.includes('DEFAULT_COURIER') || cellValue.length > 20) {
                    pdf.setFontSize(50); // Уменьшаем размер
                    
                    const parts = cellValue.split(' ');
                    let yPos = 70;
                    
                    parts.forEach(part => {
                        pdf.text(part, cellValue.startsWith('KGT') ? 62 : 52, yPos);
                        yPos += 18;
                    });
                } else {
                    pdf.setFontSize(120);
                    const cellX = cellValue.startsWith('KGT') ? 62 : 52;
                    pdf.text(cellValue, cellX, 88);
                }
                
                // QR справа
                if (qr.qrDataURL) {
                    pdf.addImage(qr.qrDataURL, 'PNG', 84, 105, 90, 90);
                }

                // Левый вертикальный блок
                const blockX = 5;
                const blockY = 90;
                const blockWidth = 45;
                const blockHeight = 110;

                // Рамка
                pdf.setLineWidth(0.2);
                pdf.rect(blockX, blockY, blockWidth, blockHeight);

                // Черная шапка
                pdf.setFillColor(0, 0, 0);
                pdf.rect(blockX, blockY, blockWidth, 12, 'F');

                pdf.setTextColor(255, 255, 255);
                pdf.setFont("Roboto", "bold");
                pdf.setFontSize(16);
                pdf.text('Номер CART:', blockX + 4, blockY + 8);

                // Возвращаем цвет текста
                pdf.setTextColor(0, 0, 0);

                // Номер вертикально
                const pureNumberCart = qr.value.replace(/[^0-9]/g, '');
                pdf.setFont("Roboto", "black");
                pdf.setFontSize(100);

                const digitCount = pureNumberCart.length;
                let textX = 40;
                let textY = 192.5;

                switch(digitCount) {
                    case 1:
                        textY = 162.5;
                        break;
                    case 2:
                        textY = 172.5;
                        break;
                    case 3:
                        textY = 182.5;
                        break;
                    case 4:
                        textY = 192.5;
                        break;
                    default:
                        textY = 192.5 - ((digitCount - 4) * 2);
                }

                pdf.text(pureNumberCart, textX, textY, { angle: 90 });
            }

            // Иконка
            const svgString = qr.type === 'PALLET' ? tpi_cc_i_pallet : tpi_cc_i_cart;
            
            const canvas = document.createElement('canvas');
            canvas.width = 240;
            canvas.height = 240;
            const ctx = canvas.getContext('2d');
            ctx.scale(4, 4);
            
            const img = new Image();
            const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
            const url = URL.createObjectURL(svgBlob);
            
            await new Promise((resolve) => {
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, 60, 60);
                    URL.revokeObjectURL(url);
                    
                    const pngData = canvas.toDataURL('image/png');
                    
                    if (qr.type === 'PALLET') {
                        // Иконка внутри квадрата справа
                        pdf.addImage(pngData, 'PNG', pageWidth - 45, 15, 30, 35);
                    } else {
                        // Иконка над левым блоком
                        const blockX = 5;
                        const blockY = 90;
                        const blockWidth = 45;
                        const iconX = blockX + (blockWidth - 40) / 2;
                        const iconY = blockY - 40;
                        
                        pdf.addImage(pngData, 'PNG', iconX, iconY, 40, 40);
                    }
                    resolve();
                };
                img.src = url;
            });

            // ФИО курьера (на всех страницах)
            let processedName = courierInfo.courierName || 'Не указано';
            
            // Определяем выравнивание для текущей страницы
            const textAlign = qr.type === 'PALLET' ? 'right' : 'left';
            const textX = textAlign === 'right' ? pageWidth - 5 : 5;

            if (processedName.startsWith('СЦ Воронеж')) {
                const remainingText = processedName.replace('СЦ Воронеж', '').trim();
                const fioParts = ['СЦ', 'Воронеж'];
                
                if (remainingText) {
                    fioParts.push(remainingText);
                }
                
                const cleanedParts = fioParts.map(part => part.replace(/\s+/g, ''));
                
                pdf.setFont("Roboto", "bold");
                pdf.setFontSize(65);
                
                let fioY = 230;
                
                cleanedParts.forEach(part => {
                    if (part.trim()) {
                        if (textAlign === 'right') {
                            pdf.text(part, textX, fioY, { align: 'right' });
                        } else {
                            pdf.text(part, textX, fioY);
                        }
                        fioY += 26;
                    }
                });
            } else {
                // Разбиваем ФИО на части для лучшего отображения
                const nameParts = processedName.split(' ').filter(p => p.trim());
                
                pdf.setFont("Roboto", "bold");
                pdf.setFontSize(65);
                
                let fioY = 230;
                
                nameParts.forEach(part => {
                    if (part.trim()) {
                        if (textAlign === 'right') {
                            pdf.text(part.trim(), textX, fioY, { align: 'right' });
                        } else {
                            pdf.text(part.trim(), textX, fioY);
                        }
                        fioY += 26;
                    }
                });
            }
        }

        // Формируем имя файла
        let fileName;
        if (isSingleCourier && couriersData.length === 1) {
            // Для одного курьера
            const nameParts = couriersData[0].courierName.split(' ').filter(p => p);
            if (nameParts.length >= 1) {
                fileName = nameParts[0];
                
                if (nameParts.length >= 2) {
                    const firstName = nameParts[1].charAt(0).toUpperCase();
                    fileName += `_${firstName}`;
                    
                    if (nameParts.length >= 3) {
                        const lastName = nameParts[2].charAt(0).toUpperCase();
                        fileName += `${lastName}`;
                    }
                }
            } else {
                fileName = 'Курьер';
            }
            fileName = fileName.replace(/[^а-яА-ЯёЁa-zA-Z]/g, '');
        } else {
            // Для всех курьеров
            fileName = 'Все_курьеры';
        }
        
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateStr = `${day}.${month}.${year}`;
        
        fileName = `${fileName}_${dateStr}`;
        
        if (!fileName || fileName === '_' + dateStr || fileName === 'Курьер_' + dateStr) {
            fileName = `Курьеры_${dateStr}`;
        }

        if (progressText && progressBlock) {
            const isProcessButton = printButton && printButton.closest('.tpi-cc-process-manager-button');
            progressText.textContent = isProcessButton ? '100%' : 'Генерация: 100%';
            progressBlock.style.width = '100%';
            setTimeout(() => {
                progressText.textContent = isProcessButton ? 'Печать' : 'Распечатать все';
                progressBlock.style.width = '0%';
            }, 300);
        }

        pdf.save(`${fileName}.pdf`);

    } catch (error) {
        console.warn('❌ Ошибка создания PDF:', error);
        if (typeof tpiNotification !== 'undefined') {
            tpiNotification.show('Ошибка', 'error', 'Не удалось создать PDF');
        }
        if (progressText && progressBlock) {
            const isProcessButton = printButton && printButton.closest('.tpi-cc-process-manager-button');
            progressText.textContent = isProcessButton ? 'Печать' : 'Распечатать все';
            progressBlock.style.width = '0%';
        }
    } finally {
        if (printButton) {
            printButton.removeAttribute('tpi-cc-printing-state');
            printButton.disabled = false;
        }
    }
}

//A-
//A-
//A-    ПЕЧАТЬ PDF и слушатели событий • END END END
//A-
//A-

// Вспомогательная функция для загрузки изображения в base64
function loadImageAsBase64(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = imagePath;
    });
}

// D-
// D-
// D-   Кнопка выделить ряд
// D-
// D-

function initializePrintRowHighlight() {
    const printRowButtons = document.querySelectorAll('.tpi-print-row-button');
    
    printRowButtons.forEach(button => {
        // Удаляем старые обработчики, если они есть
        button.removeEventListener('mouseenter', handlePrintButtonMouseEnter);
        button.removeEventListener('mouseleave', handlePrintButtonMouseLeave);
        button.removeEventListener('click', handlePrintButtonClick);
        
        // Добавляем новые обработчики
        button.addEventListener('mouseenter', handlePrintButtonMouseEnter);
        button.addEventListener('mouseleave', handlePrintButtonMouseLeave);
        button.addEventListener('click', handlePrintButtonClick);
    });
}

// Обработчик наведения мыши на кнопку печати
function handlePrintButtonMouseEnter(event) {
    const button = event.currentTarget;
    const rowIndex = button.getAttribute('tpi-cc-printing-row-index');
    
    if (!rowIndex) return;
    
    // Находим все строки таблицы
    const rows = document.querySelectorAll('.tpi-cc--table-tbody');
    
    rows.forEach(row => {
        // Находим кнопки CART и PALLET в строке с нужным индексом
        const cartButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
        const palletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
        
        // Подсвечиваем кнопку CART с нужным индексом, только если она не заблокирована
        if (cartButtons.length >= rowIndex) {
            const targetCartButton = cartButtons[parseInt(rowIndex) - 1];
            // Добавляем проверку на заблокированную кнопку
            if (targetCartButton && !targetCartButton.hasAttribute('tpi-cc-button-is-blocked')) {
                targetCartButton.setAttribute('tpi-cc-highlighted_row', '');
            }
        }
        
        // Подсвечиваем кнопку PALLET с нужным индексом, только если она не заблокирована
        if (palletButtons.length >= rowIndex) {
            const targetPalletButton = palletButtons[parseInt(rowIndex) - 1];
            // Добавляем проверку на заблокированную кнопку
            if (targetPalletButton && !targetPalletButton.hasAttribute('tpi-cc-button-is-blocked')) {
                targetPalletButton.setAttribute('tpi-cc-highlighted_row', '');
            }
        }
    });
}

// Обработчик ухода мыши с кнопки печати
function handlePrintButtonMouseLeave(event) {
    // Убираем подсветку со всех кнопок
    const highlightedButtons = document.querySelectorAll('[tpi-cc-highlighted_row]');
    highlightedButtons.forEach(btn => {
        btn.removeAttribute('tpi-cc-highlighted_row');
    });
}

// Обработчик клика на кнопку печати
function handlePrintButtonClick(event) {
    const button = event.currentTarget;
    const rowIndex = button.getAttribute('tpi-cc-printing-row-index');
    
    if (!rowIndex) return;
    
    // Находим все строки таблицы
    const rows = document.querySelectorAll('.tpi-cc--table-tbody');
    
    rows.forEach(row => {
        // Находим кнопки CART и PALLET в строке с нужным индексом
        const cartButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
        const palletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
        
        // Выделяем кнопку CART с нужным индексом, только если она не заблокирована
        if (cartButtons.length >= rowIndex) {
            const targetCartButton = cartButtons[parseInt(rowIndex) - 1];
            // Добавляем проверку на заблокированную кнопку
            if (targetCartButton && !targetCartButton.hasAttribute('tpi-cc-button-is-blocked')) {
                targetCartButton.setAttribute('tpi-cc-selected-courier-cell', '');
            }
        }
        
        // Выделяем кнопку PALLET с нужным индексом, только если она не заблокирована
        if (palletButtons.length >= rowIndex) {
            const targetPalletButton = palletButtons[parseInt(rowIndex) - 1];
            // Добавляем проверку на заблокированную кнопку
            if (targetPalletButton && !targetPalletButton.hasAttribute('tpi-cc-button-is-blocked')) {
                targetPalletButton.setAttribute('tpi-cc-selected-courier-cell', '');
            }
        }
    });
    
    // Обновляем контейнер действий после выделения
    update_ActionProcessContainer();
}

// Функция для очистки подсветки всех строк
function clearAllHighlights() {
    const highlightedButtons = document.querySelectorAll('[tpi-cc-highlighted_row]');
    highlightedButtons.forEach(btn => {
        btn.removeAttribute('tpi-cc-highlighted_row');
    });
}

// Функция для очистки выделения всех кнопок
function clearAllSelections() {
    const selectedButtons = document.querySelectorAll('[tpi-cc-selected-courier-cell]');
    selectedButtons.forEach(btn => {
        btn.removeAttribute('tpi-cc-selected-courier-cell');
    });
    update_ActionProcessContainer();
}

// C-
// C-
// C- Добавить / Удалить CART
// C-
// C-

// Функция для добавления нового CART номер к курьеру
async function addNewCartToCourier(row, cartButton) {
    try {
        // Получаем ячейку курьера для определения базового номера
        const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
        const cellValue = cellElement ? cellElement.textContent.trim() : '';
        
        // Извлекаем номер из ячейки (например, "101" из "MK-101")
        let cellNumber = 0;
        if (cellValue && cellValue !== 'null' && cellValue !== 'Нет ячейки') {
            const match = cellValue.match(/\d+/);
            cellNumber = match ? parseInt(match[0]) : 0;
        }
        
        if (cellNumber === 0) {
            console.warn('❌ Не удалось определить номер ячейки');
            return null;
        }
        
        // Получаем все CART кнопки в строке
        const cartButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
        
        // Находим последний CART номер у этого курьера
        let lastCartValue = 0;
        let lastCartNumber = null;
        
        cartButtons.forEach(btn => {
            const cartNumber = btn.getAttribute('tpi-data-courier-spec-cell');
            if (cartNumber && cartNumber.startsWith('CART-')) {
                const numValue = parseInt(cartNumber.replace('CART-', ''));
                if (numValue > lastCartValue) {
                    lastCartValue = numValue;
                    lastCartNumber = cartNumber;
                }
            }
        });
        
        console.log(`🔍 Последний CART для ячейки ${cellValue}: ${lastCartValue}`);
        
        // Определяем следующий номер в зависимости от волны
        let nextNumber = null;
        
        if (cellValue.startsWith('MK-1')) {
            // Первая волна: диапазоны [cellNumber]1..9 и [cellNumber+200]1..9
            const firstRangeStart = cellNumber * 10 + 1;
            const firstRangeEnd   = cellNumber * 10 + 9;
            const secondRangeStart = (cellNumber + 200) * 10 + 1;
            const secondRangeEnd   = (cellNumber + 200) * 10 + 9;
            
            if (lastCartValue === 0) {
                // Нет CART – начинаем с первого диапазона
                nextNumber = firstRangeStart;
                console.log(`🆕 Нет CART, начинаем с ${firstRangeStart}`);
            } else if (lastCartValue >= firstRangeStart && lastCartValue <= firstRangeEnd) {
                // В первом диапазоне
                if (lastCartValue < firstRangeEnd) {
                    nextNumber = lastCartValue + 1;
                    console.log(`📈 В диапазоне ${firstRangeStart}-${firstRangeEnd}: ${lastCartValue} -> ${nextNumber}`);
                } else {
                    // Достигнут максимум первого диапазона → переходим во второй
                    nextNumber = secondRangeStart;
                    console.log(`🔄 Переход с ${firstRangeEnd} на ${secondRangeStart}`);
                }
            } else if (lastCartValue >= secondRangeStart && lastCartValue <= secondRangeEnd) {
                // Во втором диапазоне
                if (lastCartValue < secondRangeEnd) {
                    nextNumber = lastCartValue + 1;
                    console.log(`📈 В диапазоне ${secondRangeStart}-${secondRangeEnd}: ${lastCartValue} -> ${nextNumber}`);
                } else {
                    // Достигнут абсолютный максимум
                    nextNumber = null;
                    console.log(`❌ Достигнут максимум ${secondRangeEnd}`);
                }
            } else {
                // Некорректный номер – начинаем сначала
                nextNumber = firstRangeStart;
                console.log(`⚠️ Некорректный номер ${lastCartValue}, начинаем с ${firstRangeStart}`);
            }
            
        } else if (cellValue.startsWith('MK-2')) {
            // Вторая волна: диапазоны [cellNumber]1..9 и [cellNumber+200]1..9
            const firstRangeStart = cellNumber * 10 + 1;
            const firstRangeEnd   = cellNumber * 10 + 9;
            const secondRangeStart = (cellNumber + 200) * 10 + 1;
            const secondRangeEnd   = (cellNumber + 200) * 10 + 9;
            
            if (lastCartValue === 0) {
                nextNumber = firstRangeStart;
                console.log(`🆕 Нет CART, начинаем с ${firstRangeStart}`);
            } else if (lastCartValue >= firstRangeStart && lastCartValue <= firstRangeEnd) {
                if (lastCartValue < firstRangeEnd) {
                    nextNumber = lastCartValue + 1;
                    console.log(`📈 В диапазоне ${firstRangeStart}-${firstRangeEnd}: ${lastCartValue} -> ${nextNumber}`);
                } else {
                    nextNumber = secondRangeStart;
                    console.log(`🔄 Переход с ${firstRangeEnd} на ${secondRangeStart}`);
                }
            } else if (lastCartValue >= secondRangeStart && lastCartValue <= secondRangeEnd) {
                if (lastCartValue < secondRangeEnd) {
                    nextNumber = lastCartValue + 1;
                    console.log(`📈 В диапазоне ${secondRangeStart}-${secondRangeEnd}: ${lastCartValue} -> ${nextNumber}`);
                } else {
                    nextNumber = null;
                    console.log(`❌ Достигнут максимум ${secondRangeEnd}`);
                }
            } else {
                nextNumber = firstRangeStart;
                console.log(`⚠️ Некорректный номер ${lastCartValue}, начинаем с ${firstRangeStart}`);
            }
            
        } else {
            // Для других ячеек (KGT и т.д.) – не добавляем CART
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Невозможно добавить CART', 'warning', 'Для данного типа ячейки нельзя добавить CART');
            }
            return null;
        }
        
        // Проверяем, не превышен ли лимит
        if (nextNumber === null) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Превышено кол-во возможных CART', 'error', 'Для данного курьера достигнут максимум CART номеров');
            }
            return null;
        }
        
        // Создаём новый CART номер
        const newCartNumber = `CART-${nextNumber}`;
        
        // Создаём новую кнопку CART
        const newButton = document.createElement('button');
        newButton.className = 'tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-cart-id tpi-cc-skeleton-target';
        newButton.setAttribute('tpi-data-courier-spec-cell', newCartNumber);
        newButton.setAttribute('tpi-tooltip-data', 'Нажмите, чтобы выбрать этот CART');
        newButton.innerHTML = `
            <i class="tpi-cc-table-tbody-data-cart-icon">${tpi_cc_i_cart}</i>
            -${nextNumber}
        `;
        
        // Добавляем обработчик клика
        newButton.addEventListener('click', () => {
            if (newButton.hasAttribute('tpi-cc-selected-courier-cell')) {
                newButton.removeAttribute('tpi-cc-selected-courier-cell');
            } else {
                newButton.setAttribute('tpi-cc-selected-courier-cell', '');
            }
            update_ActionProcessContainer();
        });
        
        // Находим контейнер для CART
        const cartDataContainer = row.querySelector('.tpi-cc--table-tbody-data-carts');
        if (cartDataContainer) {
            const wrapper = cartDataContainer.querySelector('.tpi-cc--carts-control-buttons-wrapper');
            if (wrapper) {
                cartDataContainer.insertBefore(newButton, wrapper);
            } else {
                cartDataContainer.appendChild(newButton);
            }
        }
        
        console.log(`✅ Добавлен новый CART: ${newCartNumber} для ячейки ${cellValue}`);
        
        return newCartNumber;
        
    } catch (error) {
        console.warn('❌ Ошибка при добавлении CART:', error);
        return null;
    }
}

// Функция для сохранения обновленных CART номеров в Firebase
async function saveUpdatedCartNumbersToFirebase(selectedDate, courierId, cartNumbers) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return false;
        }
        
        // Форматируем дату
        const dateParts = selectedDate.split('/');
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const cartControlRef = dateDocRef.collection("cartControl");
        
        // Обновляем документ курьера
        await cartControlRef.doc(courierId).update({
            cartNumbers: cartNumbers,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ Сохранены CART номера для курьера ${courierId} в Firebase`);
        return true;
        
    } catch (error) {
        console.warn('❌ Ошибка при сохранении CART номеров в Firebase:', error);
        return false;
    }
}

// Функция для инициализации обработчиков кнопок добавления CART
function initializeAddCartButtons() {
    const addCartButtons = document.querySelectorAll('.tpi-cc--table-tbody-add-cart');
    
    addCartButtons.forEach(button => {
        // Удаляем старые обработчики
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Проверяем, можно ли показывать кнопки печати
            if (!canShowPrintButton()) {
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show('Недоступно', 'warning', 'Для данной даты нельзя добавлять CART');
                }
                return;
            }
            
            // Находим строку
            const row = this.closest('.tpi-cc--table-tbody');
            if (!row) return;
            
            // Получаем ID курьера
            const courierIdElement = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]');
            if (!courierIdElement) {
                console.warn('❌ Не найден ID курьера');
                return;
            }
            const courierId = courierIdElement.textContent.trim();
            
            // Получаем выбранную дату
            const searchDateButton = document.querySelector('.tpi-cc-search-date');
            const selectedDate = searchDateButton.getAttribute('tpi-cc-selected-date-value');
            
            // Добавляем новый CART
            const newCartNumber = await addNewCartToCourier(row, this);
            
            if (newCartNumber) {
                // Получаем все CART номера из строки после добавления
                const updatedCartButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
                const updatedCartNumbers = Array.from(updatedCartButtons).map(btn => 
                    btn.getAttribute('tpi-data-courier-spec-cell')
                );
                
                // Сохраняем в Firebase
                const saved = await saveUpdatedCartNumbersToFirebase(selectedDate, courierId, updatedCartNumbers);
                
                if (saved) {
                    
                    // Обновляем сохраненные номера в данных курьера (для последующего сохранения)
                    const rowIndex = Array.from(document.querySelectorAll('.tpi-cc--table-tbody')).indexOf(row);
                    
                    // Добавляем атрибут строки с обновленными номерами
                    row.setAttribute('data-cart-numbers', JSON.stringify(updatedCartNumbers));
                    
                } else {
                    if (typeof tpiNotification !== 'undefined') {
                        tpiNotification.show('Ошибка', 'error', 'Не удалось сохранить в базу данных');
                    }
                }
            }
        });
    });
}

// Функция для удаления выбранных CART/PALLET
async function deleteSelectedItems() {
    try {
        // Находим все выбранные кнопки
        const selectedCartButtons = document.querySelectorAll('.tpi-cc-table-tbody-data-cart-id[tpi-cc-selected-courier-cell]:not([tpi-cc-button-is-blocked])');
        const selectedPalletButtons = document.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id[tpi-cc-selected-courier-cell]:not([tpi-cc-button-is-blocked])');
        
        if (selectedCartButtons.length === 0 && selectedPalletButtons.length === 0) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Нет выделенных', 'warning', 'Не выбрано ни одного CART или PALLET номера');
            }
            return false;
        }
        
        // Группируем по строкам для обновления в БД
        const rowsToUpdate = new Map();
        
        // Собираем CART для удаления
        selectedCartButtons.forEach(btn => {
            const row = btn.closest('.tpi-cc--table-tbody');
            if (!row) return;
            
            const courierIdElement = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]');
            const courierId = courierIdElement ? courierIdElement.textContent.trim() : null;
            
            if (!courierId) return;
            
            if (!rowsToUpdate.has(courierId)) {
                rowsToUpdate.set(courierId, {
                    row: row,
                    cartNumbers: [],
                    palletNumbers: [],
                    cartElements: [],
                    palletElements: []
                });
            }
            
            const cartNumber = btn.getAttribute('tpi-data-courier-spec-cell');
            if (cartNumber) {
                rowsToUpdate.get(courierId).cartNumbers.push(cartNumber);
                rowsToUpdate.get(courierId).cartElements.push(btn);
            }
        });
        
        // Собираем PALLET для удаления
        selectedPalletButtons.forEach(btn => {
            const row = btn.closest('.tpi-cc--table-tbody');
            if (!row) return;
            
            const courierIdElement = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]');
            const courierId = courierIdElement ? courierIdElement.textContent.trim() : null;
            
            if (!courierId) return;
            
            if (!rowsToUpdate.has(courierId)) {
                rowsToUpdate.set(courierId, {
                    row: row,
                    cartNumbers: [],
                    palletNumbers: [],
                    cartElements: [],
                    palletElements: []
                });
            }
            
            const palletNumber = btn.getAttribute('tpi-data-courier-spec-cell');
            if (palletNumber) {
                rowsToUpdate.get(courierId).palletNumbers.push(palletNumber);
                rowsToUpdate.get(courierId).palletElements.push(btn);
            }
        });
        
        // Получаем выбранную дату
        const searchDateButton = document.querySelector('.tpi-cc-search-date');
        const selectedDate = searchDateButton.getAttribute('tpi-cc-selected-date-value');
        
        // Удаляем элементы из UI и обновляем БД
        let successCount = 0;
        
        for (const [courierId, data] of rowsToUpdate) {
            // Удаляем элементы из DOM
            data.cartElements.forEach(btn => btn.remove());
            data.palletElements.forEach(btn => btn.remove());
            
            // Получаем оставшиеся CART и PALLET номера в строке
            const remainingCartButtons = data.row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
            const remainingPalletButtons = data.row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
            
            const remainingCartNumbers = Array.from(remainingCartButtons).map(btn => 
                btn.getAttribute('tpi-data-courier-spec-cell')
            );
            
            const remainingPalletNumbers = Array.from(remainingPalletButtons).map(btn => 
                btn.getAttribute('tpi-data-courier-spec-cell')
            );
            
            // Сохраняем в Firebase
            const saved = await saveDeletedItemsToFirebase(selectedDate, courierId, remainingCartNumbers, remainingPalletNumbers);
            
            if (saved) {
                successCount++;
                
                // Обновляем атрибуты строки
                data.row.setAttribute('data-cart-numbers', JSON.stringify(remainingCartNumbers));
                data.row.setAttribute('data-pallet-numbers', JSON.stringify(remainingPalletNumbers));
            }
        }
        
        // Обновляем контейнер действий
        update_ActionProcessContainer();
        
        if (successCount > 0) {
            if (typeof tpiNotification !== 'undefined') {
                const totalDeleted = selectedCartButtons.length + selectedPalletButtons.length;
                tpiNotification.show('Удаление завершено', 'success', `Удалено ${totalDeleted} элементов у ${successCount} курьеров`);
            }
            return true;
        } else {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Ошибка', 'error', 'Не удалось удалить выбранные элементы');
            }
            return false;
        }
        
     } catch (error) {
        console.warn('❌ Ошибка при удалении выбранных элементов:', error);
        if (typeof tpiNotification !== 'undefined') {
            tpiNotification.show('Ошибка', 'error', 'Произошла ошибка при удалении');
        }
        return false;
    }
}

// Функция для сохранения изменений после удаления в Firebase
async function saveDeletedItemsToFirebase(selectedDate, courierId, cartNumbers, palletNumbers) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return false;
        }
        
        // Форматируем дату
        const dateParts = selectedDate.split('/');
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const cartControlRef = dateDocRef.collection("cartControl");
        
        // Подготавливаем данные для обновления
        const updateData = {
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (cartNumbers) {
            updateData.cartNumbers = cartNumbers;
        }
        
        if (palletNumbers) {
            updateData.palletNumbers = palletNumbers;
        }
        
        // Обновляем документ курьера
        await cartControlRef.doc(courierId).update(updateData);
        
        console.log(`✅ Сохранены изменения для курьера ${courierId} в Firebase после удаления`);
        return true;
        
    } catch (error) {
        console.warn('❌ Ошибка при сохранении изменений в Firebase:', error);
        return false;
    }
}

// Добавьте этот обработчик в существующий код или обновите существующий
function initializeDeleteButton() {
    const deleteButton = document.querySelector('.tpi-cc-process-manager-button[tpi-cc-action="delete"]');
    
    if (!deleteButton) return;
    
    // Удаляем старые обработчики
    const newButton = deleteButton.cloneNode(true);
    deleteButton.parentNode.replaceChild(newButton, deleteButton);
    
    newButton.addEventListener('click', async function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Проверяем, можно ли показывать кнопки печати (для удаления тоже)
        if (!canShowPrintButton()) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Недоступно', 'warning', 'Для данной даты нельзя удалять элементы');
            }
            return;
        }
        
        // Блокируем кнопки на время удаления
        const processManagerButtons = document.querySelectorAll('.tpi-cc-process-manager-button');
        const closeButton = document.querySelector('.tpi-cc-process-manager-close');
        const allTableButtons = document.querySelectorAll('.tpi-cc--table-tbody-data-button');
        
        processManagerButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.disabled = true;
        });
        
        if (closeButton) {
            closeButton.style.pointerEvents = 'none';
            closeButton.disabled = true;
        }
        
        allTableButtons.forEach(btn => {
            btn.disabled = true;
        });
        
        try {
            await deleteSelectedItems();
        } finally {
            // Разблокируем кнопки
            processManagerButtons.forEach(btn => {
                btn.style.pointerEvents = '';
                btn.disabled = false;
            });
            
            if (closeButton) {
                closeButton.style.pointerEvents = '';
                closeButton.disabled = false;
            }
            
            allTableButtons.forEach(btn => {
                btn.disabled = false;
            });
        }
    });
}

// Функция для добавления нового PALLET к курьеру
async function addNewPalletToCourier(row) {
    try {
        // Получаем все PALLET кнопки в строке (включая те, что внутри wrapper)
        const palletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
        
        // Получаем ячейку курьера
        const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
        const cellValue = cellElement ? cellElement.textContent.trim() : '';
        
        // Проверяем, является ли курьер КГТ
        const isKGT = cellValue && cellValue.toUpperCase().startsWith('KGT');
        
        // Для КГТ не должно быть кнопки добавления PALLET
        if (isKGT) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Невозможно добавить PALLET', 'warning', 'Для КГТ курьеров нельзя добавить PALLET');
            }
            return null;
        }
        
        // Извлекаем базовый номер ячейки
        let baseNumber = 0;
        if (cellValue && cellValue !== 'null' && cellValue !== 'Нет ячейки') {
            const match = cellValue.match(/\d+/);
            baseNumber = match ? parseInt(match[0]) : 0;
        }
        
        if (baseNumber === 0) {
            console.warn('❌ Не удалось определить номер ячейки');
            return null;
        }
        
        // Определяем, к какой волне относится курьер
        const isFirstWave = cellValue.startsWith('MK-1');
        const isSecondWave = cellValue.startsWith('MK-2');
        
        if (!isFirstWave && !isSecondWave) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Невозможно добавить PALLET', 'warning', 'Для данного типа ячейки нельзя добавить PALLET');
            }
            return null;
        }
        
        // Собираем все существующие PALLET номера у всех курьеров для определения следующего номера в нужном диапазоне
        const allPalletNumbers = new Set();
        const allRows = document.querySelectorAll('.tpi-cc--table-tbody');
        
        allRows.forEach(r => {
            const palletBtns = r.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
            palletBtns.forEach(btn => {
                const palletNumber = btn.getAttribute('tpi-data-courier-spec-cell');
                if (palletNumber && palletNumber.startsWith('PALLET-')) {
                    const num = parseInt(palletNumber.replace('PALLET-', ''));
                    allPalletNumbers.add(num);
                }
            });
        });
        
        // Определяем следующий номер
        let nextNumber = null;
        
        if (isFirstWave) {
            // Для первой волны: после базового номера (101) и 301, следующие в 500-й сотне
            // Проверяем, есть ли уже у курьера PALLET-{baseNumber}
            const hasBasePallet = Array.from(palletButtons).some(btn => {
                const num = parseInt(btn.getAttribute('tpi-data-courier-spec-cell').replace('PALLET-', ''));
                return num === baseNumber;
            });
            
            // Проверяем, есть ли уже у курьера PALLET-{baseNumber + 200} (301)
            const hasSecondPallet = Array.from(palletButtons).some(btn => {
                const num = parseInt(btn.getAttribute('tpi-data-courier-spec-cell').replace('PALLET-', ''));
                return num === (baseNumber + 200);
            });
            
            if (!hasBasePallet) {
                // Если нет первого PALLET (номер ячейки), добавляем его
                nextNumber = baseNumber;
            } else if (!hasSecondPallet) {
                // Если есть первый, но нет второго (номер ячейки + 200)
                nextNumber = baseNumber + 200;
            } else {
                // Если есть оба базовых, добавляем из 500-й сотни
                // Ищем наименьший свободный номер в 500-й сотне
                for (let i = 501; i <= 599; i++) {
                    if (!allPalletNumbers.has(i)) {
                        nextNumber = i;
                        break;
                    }
                }
            }
        } else if (isSecondWave) {
            // Для второй волны: после базового номера (201) и 401, следующие в 600-й сотне
            // Проверяем, есть ли уже у курьера PALLET-{baseNumber}
            const hasBasePallet = Array.from(palletButtons).some(btn => {
                const num = parseInt(btn.getAttribute('tpi-data-courier-spec-cell').replace('PALLET-', ''));
                return num === baseNumber;
            });
            
            // Проверяем, есть ли уже у курьера PALLET-{baseNumber + 200} (401)
            const hasSecondPallet = Array.from(palletButtons).some(btn => {
                const num = parseInt(btn.getAttribute('tpi-data-courier-spec-cell').replace('PALLET-', ''));
                return num === (baseNumber + 200);
            });
            
            if (!hasBasePallet) {
                // Если нет первого PALLET (номер ячейки), добавляем его
                nextNumber = baseNumber;
            } else if (!hasSecondPallet) {
                // Если есть первый, но нет второго (номер ячейки + 200)
                nextNumber = baseNumber + 200;
            } else {
                // Если есть оба базовых, добавляем из 600-й сотни
                // Ищем наименьший свободный номер в 600-й сотне
                for (let i = 601; i <= 699; i++) {
                    if (!allPalletNumbers.has(i)) {
                        nextNumber = i;
                        break;
                    }
                }
            }
        }
        
        // Проверяем, найден ли свободный номер
        if (nextNumber === null) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Нет свободных номеров', 'error', 'В данном диапазоне нет свободных PALLET номеров');
            }
            return null;
        }
        
        // Создаем новый PALLET номер
        const newPalletNumber = `PALLET-${nextNumber}`;
        
        // Создаем новую кнопку
        const newButton = document.createElement('button');
        newButton.className = 'tpi-cc--table-tbody-data-button tpi-cc-table-tbody-data-pallet-id tpi-cc-skeleton-target';
        newButton.setAttribute('tpi-data-courier-spec-cell', newPalletNumber);
        newButton.setAttribute('tpi-tooltip-data', 'Нажмите, чтобы выбрать этот PALLET');
        newButton.innerHTML = `
            <i class="tpi-cc-table-tbody-data-pallet-icon">${tpi_cc_i_pallet}</i>
            -${nextNumber}
        `;
        
        // Добавляем обработчик клика
        newButton.addEventListener('click', () => {
            if (newButton.hasAttribute('tpi-cc-selected-courier-cell')) {
                newButton.removeAttribute('tpi-cc-selected-courier-cell');
            } else {
                newButton.setAttribute('tpi-cc-selected-courier-cell', '');
            }
            update_ActionProcessContainer();
        });
        
        // Находим контейнер для PALLET
        const palletDataContainer = row.querySelector('.tpi-cc--table-tbody-data-pallets');
        if (palletDataContainer) {
            // Находим wrapper внутри контейнера PALLET
            const wrapper = palletDataContainer.querySelector('.tpi-cc--carts-control-buttons-wrapper');
            if (wrapper) {
                // Вставляем новую кнопку перед wrapper'ом
                palletDataContainer.insertBefore(newButton, wrapper);
            } else {
                // Если wrapper не найден, просто добавляем в конец
                palletDataContainer.appendChild(newButton);
            }
        }
        
        console.log(`✅ Добавлен новый PALLET: ${newPalletNumber}`);
        return newPalletNumber;
        
    } catch (error) {
        console.warn('❌ Ошибка при добавлении PALLET:', error);
        return null;
    }
}

// Функция для сохранения обновленных PALLET номеров в Firebase
async function saveUpdatedPalletNumbersToFirebase(selectedDate, courierId, palletNumbers) {
    try {
        if (!tpiFirebaseInitialized) {
            tpiDb = tpiInitializeFirebase();
            if (!tpiDb) return false;
        }
        
        // Форматируем дату
        const dateParts = selectedDate.split('/');
        const firebaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        const dateDocRef = tpiDb.collection("dates").doc(firebaseDate);
        const cartControlRef = dateDocRef.collection("cartControl");
        
        // Обновляем документ курьера
        await cartControlRef.doc(courierId).update({
            palletNumbers: palletNumbers,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ Сохранены PALLET номера для курьера ${courierId} в Firebase`);
        return true;
        
    } catch (error) {
        console.warn('❌ Ошибка при сохранении PALLET номеров в Firebase:', error);
        return false;
    }
}

// Функция для инициализации обработчиков кнопок добавления PALLET
function initializeAddPalletButtons() {
    const addPalletButtons = document.querySelectorAll('.tpi-cc--table-tbody-add-pallet');
    
    addPalletButtons.forEach(button => {
        // Удаляем старые обработчики
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Проверяем, можно ли показывать кнопки печати
            if (!canShowPrintButton()) {
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show('Недоступно', 'warning', 'Для данной даты нельзя добавлять PALLET');
                }
                return;
            }
            
            // Находим строку
            const row = this.closest('.tpi-cc--table-tbody');
            if (!row) return;
            
            // Получаем ячейку курьера для проверки на KGT
            const cellElement = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]');
            const cellValue = cellElement ? cellElement.textContent.trim() : '';
            
            // Проверяем, является ли курьер КГТ
            const isKGT = cellValue && cellValue.toUpperCase().startsWith('KGT');
            
            // Для КГТ не должно быть кнопки добавления PALLET
            if (isKGT) {
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show('Невозможно добавить PALLET', 'warning', 'Для КГТ курьеров нельзя добавить PALLET');
                }
                return;
            }
            
            // Получаем ID курьера
            const courierIdElement = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]');
            if (!courierIdElement) {
                console.warn('❌ Не найден ID курьера');
                return;
            }
            const courierId = courierIdElement.textContent.trim();
            
            // Получаем выбранную дату
            const searchDateButton = document.querySelector('.tpi-cc-search-date');
            const selectedDate = searchDateButton.getAttribute('tpi-cc-selected-date-value');
            
            // Добавляем новый PALLET
            const newPalletNumber = await addNewPalletToCourier(row);
            
            if (newPalletNumber) {
                // Получаем все PALLET номера из строки после добавления
                const updatedPalletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
                const updatedPalletNumbers = Array.from(updatedPalletButtons).map(btn => 
                    btn.getAttribute('tpi-data-courier-spec-cell')
                );
                
                // Сохраняем в Firebase
                const saved = await saveUpdatedPalletNumbersToFirebase(selectedDate, courierId, updatedPalletNumbers);
                
                if (saved) {
                    
                    // Обновляем атрибуты строки
                    row.setAttribute('data-pallet-numbers', JSON.stringify(updatedPalletNumbers));
                    
                } else {
                    if (typeof tpiNotification !== 'undefined') {
                        tpiNotification.show('Ошибка', 'error', 'Не удалось сохранить в базу данных');
                    }
                }
            }
        });
    });
}

// Функция для открытия модального окна с данными курьера
function openCourierRestoreModal(row) {
    const modalWrapper = document.querySelector('.tpi-cc-modal-window-wrapper');
    
    if (!modalWrapper || !row) return;
    
    // Получаем данные из строки
    const courierName = row.querySelector('p[tpi-cc-parsing-data="courier-full-name"]')?.textContent.trim() || 'Не указано';
    const courierCell = row.querySelector('a[tpi-cc-parsing-data="courier-route-cell"]')?.textContent.trim() || 'Нет ячейки';
    const courierRouteId = row.querySelector('p[tpi-cc-parsing-data="courier-route-id"]')?.textContent.trim() || 'Нет данных';
    const courierId = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]')?.textContent.trim() || 'Нет данных';
    const courierStatus = row.querySelector('p[tpi-cc-parsing-data="courier-route-status"]')?.textContent.trim() || 'Неизвестно';
    
    // Получаем прогресс сортировки
    const sortingProgress = row.querySelector('p[tpi-cc-parsing-data="courier-sorting-progress"]')?.textContent.trim() || '0 из 0';
    
    // Получаем прогресс подготовки
    const preparedProgress = row.querySelector('p[tpi-cc-parsing-data="courier-prepared-progress"]')?.textContent.trim() || '0 из 0';
    
    // Получаем все CART номера
    const cartButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-cart-id');
    const cartNumbers = Array.from(cartButtons).map(btn => {
        const cartNumber = btn.getAttribute('tpi-data-courier-spec-cell')?.replace('CART-', '') || '';
        return cartNumber;
    });
    
    // Получаем все PALLET номера
    const palletButtons = row.querySelectorAll('.tpi-cc-table-tbody-data-pallet-id');
    const palletNumbers = Array.from(palletButtons).map(btn => {
        const palletNumber = btn.getAttribute('tpi-data-courier-spec-cell')?.replace('PALLET-', '') || '';
        return palletNumber;
    });
    
    // Заполняем данные в модальном окне
    const nameElement = modalWrapper.querySelector('[tpi-data-anchor="courier-name"]');
    const cellElement = modalWrapper.querySelector('[tpi-data-anchor="courier-cell"]');
    const routeElement = modalWrapper.querySelector('[tpi-data-anchor="courier-route"]');
    const idElement = modalWrapper.querySelector('[tpi-data-anchor="courier-id"]');
    const statusElement = modalWrapper.querySelector('[tpi-data-anchor="courier-status"]');
    
    if (nameElement) nameElement.textContent = courierName;
    if (cellElement) cellElement.textContent = courierCell;
    if (routeElement) routeElement.textContent = courierRouteId;
    if (idElement) idElement.textContent = courierId;
    if (statusElement) statusElement.textContent = courierStatus;
    
    // Заполняем прогресс сортировки
    const sortedElement = modalWrapper.querySelector('[tpi-data-anchor="courier-sorted"]');
    if (sortedElement) sortedElement.textContent = sortingProgress;
    
    // Заполняем прогресс подготовки
    const preparedElement = modalWrapper.querySelector('[tpi-data-anchor="courier-prepared"]');
    if (preparedElement) preparedElement.textContent = preparedProgress;
    
    // Заполняем CART номера
    const cartWrapper = modalWrapper.querySelector('[tpi-data-anchor="courier-carts"]');
    if (cartWrapper) {
        cartWrapper.innerHTML = '';
        cartNumbers.forEach(cartNumber => {
            if (cartNumber) {
                const cartDiv = document.createElement('div');
                cartDiv.className = 'tpi-cc-modal-window-courier-data-item-cart';
                cartDiv.innerHTML = `
                    <i class="tpi-cc-modal-window-courier-data-item-cart-icon">${tpi_cc_i_cart}</i>
                    <p>-${cartNumber}</p>
                `;
                cartWrapper.appendChild(cartDiv);
            }
        });
        
        if (cartNumbers.length === 0) {
            const emptyDiv = document.createElement('p');
            emptyDiv.className = 'tpi-cc-modal-window-courier-data-item-text';
            emptyDiv.innerText = `Нет`;
            cartWrapper.appendChild(emptyDiv);
        }
    }
    
    // Заполняем PALLET номера
    const palletWrapper = modalWrapper.querySelector('[tpi-data-anchor="courier-pallets"]');
    if (palletWrapper) {
        palletWrapper.innerHTML = '';
        palletNumbers.forEach(palletNumber => {
            if (palletNumber) {
                const palletDiv = document.createElement('div');
                palletDiv.className = 'tpi-cc-modal-window-courier-data-item-pallet';
                palletDiv.innerHTML = `
                    <i class="tpi-cc-modal-window-courier-data-item-pallet-icon">${tpi_cc_i_pallet}</i>
                    <p>-${palletNumber}</p>
                `;
                palletWrapper.appendChild(palletDiv);
            }
        });
        
        if (palletNumbers.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'tpi-cc-modal-window-courier-data-item-pallet';
            emptyDiv.innerHTML = `<p>Нет PALLET номеров</p>`;
            palletWrapper.appendChild(emptyDiv);
        }
    }
    
    // Сохраняем ссылку на строку
    modalWrapper.setAttribute('data-current-row', Array.from(document.querySelectorAll('.tpi-cc--table-tbody')).indexOf(row));
    
    // Показываем модальное окно МГНОВЕННО
    modalWrapper.style.display = 'flex';
    modalWrapper.setAttribute('tpi-current-state', 'shown');
}

// Функция для немедленного закрытия модального окна (без задержки)
function closeCourierRestoreModalImmediate() {
    const modalWrapper = document.querySelector('.tpi-cc-modal-window-wrapper');
    
    if (!modalWrapper) return;
    
    // Убираем атрибуты и скрываем мгновенно
    modalWrapper.removeAttribute('tpi-current-state');
    modalWrapper.style.display = 'none';
    modalWrapper.removeAttribute('data-current-row');
}

// Функция для восстановления данных курьера (только для одного конкретного курьера)
async function restoreCourierData() {
    const modalWrapper = document.querySelector('.tpi-cc-modal-window-wrapper');
    
    if (!modalWrapper) return;
    
    const rowIndex = modalWrapper.getAttribute('data-current-row');
    if (rowIndex === null) return;
    
    const rows = document.querySelectorAll('.tpi-cc--table-tbody');
    const row = rows[parseInt(rowIndex)];
    
    if (!row) return;
    
    // Получаем ID курьера
    const courierIdElement = row.querySelector('p[tpi-cc-parsing-data="courier-personal-id"]');
    const courierId = courierIdElement ? courierIdElement.textContent.trim() : null;
    
    if (!courierId) {
        if (typeof tpiNotification !== 'undefined') {
            tpiNotification.show('Ошибка', 'error', 'Не удалось определить ID курьера');
        }
        closeCourierRestoreModalImmediate();
        return;
    }
    
    // Получаем выбранную дату
    const searchDateButton = document.querySelector('.tpi-cc-search-date');
    const selectedDate = searchDateButton.getAttribute('tpi-cc-selected-date-value');
    
    // СРАЗУ ЗАКРЫВАЕМ МОДАЛЬНОЕ ОКНО
    closeCourierRestoreModalImmediate();
    
    try {
        // Добавляем скелетон всем элементам в строке
        const skeletonTargets = row.querySelectorAll('.tpi-cc-skeleton-target');
        skeletonTargets.forEach(el => {
            el.classList.add('tpi-lazy-load-skeleton');
        });
        
        // Получаем данные курьера из API
        const freshData = await getSingleCourierDataFromAPI(selectedDate, courierId);
        
        if (!freshData) {
            throw new Error('Не удалось получить данные курьера из API');
        }
        
        // Обновляем строку в таблице
        const updated = updateRowData(row, freshData, parseInt(rowIndex));
        
        // Удаляем скелетон после обновления
        skeletonTargets.forEach(el => {
            el.classList.remove('tpi-lazy-load-skeleton');
        });
        
        if (updated) {
            // Сохраняем изменения в Firebase
            const updatedData = [{
                externalId: courierId,
                courierId: courierId,
                status: freshData.status,
                ordersSorted: freshData.ordersSorted,
                ordersShipped: freshData.ordersShipped,
                ordersPlanned: freshData.ordersPlanned,
                sortablesPrepared: freshData.sortablesPrepared,
                sortablesInCell: freshData.sortablesInCell,
                finishedAt: freshData.finishedAt,
                onlineTransferActId: freshData.onlineTransferActId,
                cell: freshData.cell
            }];
            
            await updatePartialDataInFirebase(selectedDate, updatedData);
            
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Успешно', 'success', 'Данные курьера восстановлены');
            }
        } else {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Информация', 'info', 'Данные уже актуальны');
            }
        }
        
    } catch (error) {
        console.warn('❌ Ошибка при восстановлении данных курьера:', error);
        
        // Удаляем скелетон в случае ошибки
        const skeletonTargets = row.querySelectorAll('.tpi-cc-skeleton-target');
        skeletonTargets.forEach(el => {
            el.classList.remove('tpi-lazy-load-skeleton');
        });
        
        if (typeof tpiNotification !== 'undefined') {
            tpiNotification.show('Ошибка', 'error', error.message || 'Не удалось восстановить данные');
        }
    }
}

// Функция для инициализации обработчиков модального окна
function initializeRestoreModal() {
    const modalWrapper = document.querySelector('.tpi-cc-modal-window-wrapper');
    const closeBtn = document.querySelector('.tpi-cc-modal-window-close');
    const acceptBtn = document.querySelector('.tpi-cc-modal-window-accept');
    const restoreButtons = document.querySelectorAll('.tpi-cc-restore-courier-data');
    
    if (!modalWrapper) return;
    
    // Обработчик для кнопок восстановления в каждой строке
        restoreButtons.forEach(button => {
            // Удаляем старые обработчики
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Находим родительскую строку
                const row = this.closest('.tpi-cc--table-tbody');
                if (!row) return;
                
                // Открываем модальное окно с данными курьера
                openCourierRestoreModal(row);
            });
        });
        
    // Обработчик для кнопки закрытия
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeCourierRestoreModalImmediate(); // Используем мгновенное закрытие
        });
    }

    // Обработчик для кнопки подтверждения (восстановления)
    if (acceptBtn) {
        const newAcceptBtn = acceptBtn.cloneNode(true);
        acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
        
        newAcceptBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            restoreCourierData(); // Эта функция сама закроет модальное окно после завершения
        });
    }

    // Закрытие по клику вне модального окна - тоже мгновенно
    modalWrapper.addEventListener('click', function(event) {
        if (event.target === modalWrapper) {
            closeCourierRestoreModalImmediate();
        }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalWrapper.style.display === 'flex') {
            closeCourierRestoreModalImmediate();
        }
    });
}

async function getSingleCourierDataFromAPI(selectedDate, courierId) {
    try {
        if (!selectedDate || !courierId) return null;
        
        // Формируем URL для запроса
        const url = new URL('https://logistics.market.yandex.ru/api/resolve/');
        url.searchParams.append('r', 'sortingCenter/routes/resolveGetRoutesFullInfo:resolveGetRoutesFullInfo');

        // Преобразуем DD/MM/YYYY в YYYY-MM-DD для API
        const dateParts = selectedDate.split('/');
        if (dateParts.length !== 3) return null;

        const currentDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
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
                "size": 200
            }],
            "path": `/sorting-center/21972131/routes?type=OUTGOING_COURIER&sort=&hasCarts=false&category=COURIER&date=${currentDate}&recipientName=`
        };

        const response = await fetch(url.toString(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Market-Core-Service': '<UNKNOWN>',
                'sk': tpiUserTOKEN
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) return null;

        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
            const result = data.results[0];
            
            if (result.error || !result.data || !result.data.content) return null;
            
            const route = result.data.content.find(r => 
                (r.courier && (r.courier.externalId === courierId || r.courier.id === courierId))
            );
            
            if (!route) return null;
            
            let mainCell = null;
            if (route.cells && route.cells.length > 0 && route.cells[0]?.number) {
                mainCell = route.cells[0].number;
            } else if (route.cell && route.cell.number && route.cell.number !== 'null') {
                mainCell = route.cell.number;
            }
            
            return {
                courierId: courierId,
                externalId: route.courier?.externalId || null,
                cell: mainCell,
                status: route.status || 'Неизвестно',
                ordersLeft: route.ordersLeft || 0,
                ordersSorted: route.ordersSorted || 0,
                ordersShipped: route.ordersShipped || 0,
                ordersPlanned: route.ordersPlanned || 0,
                sortablesInCell: route.sortablesInCell || 0,
                sortablesPrepared: route.sortablesPrepared || 0,
                courierArrivesAt: route.courierArrivesAt || null,
                startedAt: route.startedAt || null,
                finishedAt: route.finishedAt || null,
                routeId: route.id || null,
                onlineTransferActId: route.onlineTransferActId || null
            };
        }
        
        return null;
        
    } catch (error) {
        console.warn('💥 Ошибка при получении данных одного курьера:', error);
        return null;
    }
}

function addCartsControlsListeners(){
    waitForTokenAndRun();
    initTooltips();
    couriersDataCapturing();
    tpi_cc_filteringColumnData()
    initializeDatePicker();
    initializeCourierStatusDropdown()
    hideAllUI();
}