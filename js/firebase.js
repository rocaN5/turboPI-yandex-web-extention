// simple-encrypt.js
const encodedConfig = {
    apiKey: '41497a6153792d7a43542d5f7045366d66776f644f566569725f44747778346e674a61357559',
    authDomain: '6461696c796c6f742e66697265626173656170702e636f6d',
    projectId: '6461696c796c6f74',
    storageBucket: '6461696c796c6f742e61707073706f742e636f6d',
    messagingSenderId: '373335383330333238353939',
    appId: '313a3733353833303332383539393a7765623a39663334383638376465643165316330366232333532'
  };
  
  function decode(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
  
  const firebaseConfig = {
    apiKey: decode(encodedConfig.apiKey),
    authDomain: decode(encodedConfig.authDomain),
    projectId: decode(encodedConfig.projectId),
    storageBucket: decode(encodedConfig.storageBucket),
    messagingSenderId: decode(encodedConfig.messagingSenderId),
    appId: decode(encodedConfig.appId)
  };
  
  // Инициализация Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

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

async function createLotPack(lotsArray, cellName, lotType) {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateKey = `${yy}${mm}${dd}`;
    const dateDoc = `${today.getFullYear()}-${mm}-${dd}`;

    console.log('Создание пачки для даты:', dateDoc);

    try {
        // Проверяем, существует ли документ с датой
        const docRef = db.collection("dates").doc(dateDoc);
        const docSnapshot = await docRef.get();
        
        if (!docSnapshot.exists) {
            // Создаем документ даты, если он не существует
            await docRef.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Создан новый документ даты:', dateDoc);
        }

        // Получаем подколлекцию lotpacks
        const subCol = docRef.collection("lotpacks");
        const snapshot = await subCol.get();
        const countToday = snapshot.size;
        const nextNum = String(countToday + 1).padStart(2, "0");

        // Генерируем ID
        const lotPackId = `LOTPACK-${dateKey}${nextNum}`;

        // Формируем объект пачки с дополнительными параметрами
        const lotPackData = {
            status: "created",
            "create-time": firebase.firestore.Timestamp.now(),
            "deleted-time": null,
            "printed-time": null,
            lotsAmount: lotsArray.length,
            "cell-name": cellName,
            "lot-type": lotType,
            lots: lotsArray
        };

        console.log('Сохраняем пачку:', lotPackId, lotPackData);

        // Сохраняем
        await subCol.doc(lotPackId).set(lotPackData);

        console.log('Пачка успешно сохранена:', lotPackId);

        return { dateDoc, lotPackId };

    } catch (error) {
        console.error('Ошибка при сохранении пачки:', error);
        throw error;
    }
}