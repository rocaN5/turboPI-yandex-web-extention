function getScanLogExcelURL() {
    const url = window.location.href;

    const match = url.match(/\/sortables\/(\d+)/);
    if (!match) {
        console.error("🟢[scanLog] sortableId не найден в URL");
        return null;
    }

    const sortableId = match[1];

    return `https://logistics.market.yandex.ru/api/sorting-center/21972131/sortable/scanlog?sortableId=${sortableId}`;
}

function insertScanLogButton() {
    // Попытка найти существующую кнопку
    let button = document.querySelector('.diman__scanLog__activeButton');
    let settingsDiv = button ? button.closest('.diman__scanLogSettings') : null;

    // Если кнопки нет, создаём её (старая логика)
    if (!button) {
        const utilWrapper = document.querySelector('.tpi-util--sortables-table-wrapper');
        if (utilWrapper) {
            const section = utilWrapper.closest('.tpi-util--section-wrapper');
            if (section) {
                settingsDiv = section.querySelector('.diman__scanLogSettings');
                if (!settingsDiv) {
                    settingsDiv = document.createElement('div');
                    settingsDiv.className = 'diman__scanLogSettings';
                    section.insertBefore(settingsDiv, utilWrapper);
                }
            }
        } else {
            // старая логика поиска таблицы с "дата"
            const tables = document.querySelectorAll("table");
            const targetTable = Array.from(tables).find(table =>
                Array.from(table.querySelectorAll("span")).some(span =>
                    span.textContent.trim().toLowerCase().includes("дата")
                )
            );
            if (!targetTable) {
                return;
            }
            let container = targetTable;
            for (let i = 0; i < 4; i++) {
                if (container.parentElement) container = container.parentElement;
            }
            settingsDiv = container.querySelector(".diman__scanLogSettings");
            if (!settingsDiv) {
                settingsDiv = document.createElement("div");
                settingsDiv.className = "diman__scanLogSettings";
                container.parentElement.insertBefore(settingsDiv, container);
            }
        }

        if (!settingsDiv) {
            return;
        }

        // Создаем кнопку
        button = document.createElement("button");
        button.className = "diman__scanLog__activeButton";
        button.setAttribute("scanLog", "hidden");

        const buttonText = document.createElement("div");
        buttonText.className = "diman__scanLog__activeButton__text";
        buttonText.innerHTML = `
            <div class="diman__scanLog__activeButton__text">Показать историю сканирования</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon">
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
            </svg>
        `;
        button.appendChild(buttonText);
        settingsDiv.appendChild(button);

        // Создаем блок с настройками (чекбоксами) - если их нет
        let options = settingsDiv.querySelector(".diman__scanLogSettings__options");
        if (!options) {
            options = document.createElement("div");
            options.className = "diman__scanLogSettings__options";
            options.innerHTML = `
                <div class="diman__scanLogSettings__options__container">
                    <div class="diman__scanLogSettings__options__description">Настройки применяются ко всем открытым грузоместам</div>
                </div>
                <div class="diman__scanLogSettings__options__container diman__scanLogSettings__options__container__scrollbar" id="dimanScanLog-checkboxes-container">
                </div>
            `;
            settingsDiv.appendChild(options);
        }

        // Добавляем чекбоксы (если ещё нет)
        const checkboxesContainer = options.querySelector("#dimanScanLog-checkboxes-container");
        if (checkboxesContainer && !checkboxesContainer.children.length) {
            const checkboxConfigs = [
                { id: "dimanScanLog-option-1", label: "Автозагрузка истории", defaultChecked: false },
                { id: "dimanScanLog-option-2", label: "Подсветка операций", defaultChecked: true },
                { id: "dimanScanLog-option-3", label: "Разделение дней", defaultChecked: true },
                { id: "dimanScanLog-option-4", label: "Отображать иконки манипуляций", defaultChecked: true },
                { id: "dimanScanLog-option-5", label: "Задний фон таблицы", defaultChecked: true },
                { id: "dimanScanLog-option-6", label: "Сетка разделения манипуляций", defaultChecked: true },
                { id: "dimanScanLog-option-7", label: "Скрывать пустые столбцы", defaultChecked: false },
                { id: "dimanScanLog-option-8", label: "Загружать сканлоги лотов", defaultChecked: false },
                { id: "dimanScanLog-option-9", label: "Автоскролл к сканлогу", defaultChecked: false },
                { id: "dimanScanLog-option-10", label: "Статистика операций", defaultChecked: true }
            ];

            checkboxConfigs.forEach(({ id, label, defaultChecked }) => {
                const saved = localStorage.getItem(id);
                const isChecked = saved !== null ? saved === "true" : defaultChecked;

                const wrapper = document.createElement("label");
                wrapper.className = "diman__scanLog__checkBox__container";

                wrapper.innerHTML = `
                    <input type="checkbox" class="diman__scanLog__checkBox__input" id="${id}" ${isChecked ? "checked" : ""}>
                    <div class="diman__scanLog__checkBox__pin"></div>
                    <div class="diman__scanLog__checkBox__text">${label}</div>
                `;

                checkboxesContainer.appendChild(wrapper);

                wrapper.querySelector("input").addEventListener("change", (e) => {
                    localStorage.setItem(id, e.target.checked);
                });
            });
        }
    } else {
        // Если кнопка уже есть, обновляем её (сбрасываем старые обработчики)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        button = newButton;
    }

    // Навешиваем новый обработчик (основной)
    button.addEventListener('click', async function(event) {
        const state = this.getAttribute('scanLog');
        const utilTableWrapper = document.querySelector('.tpi-util--sortables-table-wrapper');

        // ========== РЕЖИМ ТАБЛИЦЫ УТИЛЯ ==========
        if (utilTableWrapper) {
            const rows = utilTableWrapper.querySelectorAll('.tpi-util--sortables-tr');
            if (rows.length === 0) {
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show('Сканлог', 'info', 'Нет данных для загрузки. Сначала выберите ячейку.');
                }
                return;
            }

            const buttonText = this.querySelector('.diman__scanLog__activeButton__text');

            if (state === 'hidden') {
                // Блокируем кнопку и показываем анимацию загрузки
                this.disabled = true;
                buttonText.innerHTML = `
                    <div class="diman__scanLog__activeButton__text">Загрузка</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="diman__scanLog__activeButton__icon"> 
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                        </circle>
                    </svg>`;

                // Собираем строки, для которых ещё нет сканлога
                const items = [];
                for (const tr of rows) {
                    const sortableId = tr.dataset.sortableId;
                    if (!sortableId) continue;
                    let existingRow = tr.nextElementSibling;
                    if (existingRow && existingRow.dataset && existingRow.dataset.scanlogRow === sortableId) {
                        continue;
                    }
                    items.push({ tr, sortableId });
                }

                if (items.length === 0) {
                    // Все уже загружены – меняем состояние на "показано"
                    this.disabled = false;
                    this.setAttribute('scanLog', 'shown');
                    buttonText.innerHTML = `
                        <div class="diman__scanLog__activeButton__text">Скрыть историю сканирования</div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="diman__scanLog__activeButton__icon">
                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                        </svg>
                    `;
                    return;
                }

                // Загружаем все данные параллельно
                const loadPromises = items.map(async ({ sortableId }) => {
                    try {
                        const apiUrl = `https://logistics.market.yandex.ru/api/sorting-center/21972131/sortable/scanlog?sortableId=${sortableId}`;
                        const response = await fetch(apiUrl);
                        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                        const blob = await response.blob();
                        if (!blob || blob.size === 0) throw new Error('Пустой файл');
                        const arrayBuffer = await blob.arrayBuffer();
                        if (typeof XLSX === 'undefined') {
                            throw new Error('Библиотека XLSX не загружена');
                        }
                        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                        if (!workbook.SheetNames.length) throw new Error('Нет листов в файле');
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        if (!data || data.length === 0) throw new Error('Нет данных');
                        let html;
                        if (typeof generateTableHTMLForRadar === 'function') {
                            html = generateTableHTMLForRadar(data, sortableId, false);
                        } else {
                            html = generateSimpleScanLogTable(data, sortableId);
                        }
                        return { sortableId, html, error: null };
                    } catch (error) {
                        console.error(`Ошибка загрузки сканлога для ${sortableId}:`, error);
                        return { sortableId, html: null, error: error.message };
                    }
                });

                const results = await Promise.all(loadPromises);
                let loadedCount = 0;

                // Вставляем все строки одновременно после завершения загрузок
                for (const { tr, sortableId } of items) {
                    const result = results.find(r => r.sortableId === sortableId);
                    if (!result) continue;
                    const { html, error } = result;

                    const newRow = document.createElement('tr');
                    newRow.dataset.scanlogRow = sortableId;
                    const td = document.createElement('td');
                    td.colSpan = tr.children.length;
                    td.classList.add('_stickyColumn___BusWf');
                    td.style.left = '0px';
                    const container = document.createElement('div');
                    container.className = 'diman__scanLog__wrapperMiniRadar';
                    td.appendChild(container);
                    newRow.appendChild(td);
                    tr.parentElement.insertBefore(newRow, tr.nextSibling);

                    if (html) {
                        container.innerHTML = html;
                        loadedCount++;
                        const link = tr.querySelector('a[href*="/sortables/"]');
                        if (link) {
                            link.dataset.scanlogLoaded = 'true';
                            link.classList.add('diman__tr__miniRadar__loaded');
                        }
                    } else {
                        container.innerHTML = `<div class="diman__scanLog__null">Ошибка загрузки: ${error || 'неизвестная ошибка'}</div>`;
                    }
                    processed++;
                    if (progressEl) {
                        progressEl.textContent = `${processed} / ${items.length}`;
                    }
                }

                if (typeof scanLogCheckLoadSettings === 'function') {
                    scanLogCheckLoadSettings();
                }

                this.disabled = false;
                this.setAttribute('scanLog', 'shown');
                buttonText.innerHTML = `
                    <div class="diman__scanLog__activeButton__text">Скрыть историю сканирования</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="diman__scanLog__activeButton__icon">
                        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                    </svg>
                `;
                if (loadedCount > 0 && typeof tpiNotification !== 'undefined') {
                    tpiNotification.show("Сканлог", "success", `Загружено ${loadedCount} из ${items.length} сканлогов`);
                }

            } else if (state === 'shown') {
                // Скрываем все сканлоги в таблице утиля
                document.querySelectorAll('.tpi-util--sortables-table-wrapper tr[data-scanlog-row]').forEach(row => row.remove());
                document.querySelectorAll('.tpi-util--sortables-table-wrapper a[data-scanlog-loaded]').forEach(link => {
                    delete link.dataset.scanlogLoaded;
                    link.classList.remove('diman__tr__miniRadar__loaded');
                });
                this.setAttribute('scanLog', 'hidden');
                buttonText.innerHTML = `
                    <div class="diman__scanLog__activeButton__text">Показать историю сканирования</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon">
                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                    </svg>
                `;
            }
            return;
        }


        // ===== СТАРАЯ ЛОГИКА ДЛЯ ОБЫЧНОЙ СТРАНИЦЫ =====
        // ... (оставьте как было, но тоже с логами)
        // Если нужно, можно скопировать сюда старый код, но для краткости оставлю ссылку
        // Поскольку мы не трогаем старую логику, она останется в коде, но для полноты вставлю её с логами
        // Здесь можно просто вызвать старый обработчик, но мы переписали всё в одном месте, поэтому скопируем сюда старый код.

        // Для простоты, если мы не в режиме утиля, используем старую логику
        if (state === 'hidden') {
            const link = document.querySelector('a[icon="fileDownload"]');
            if (!link) {
                return;
            }
            // ... остальной код старой логики
            // (можно просто вызвать функцию из старого обработчика, но мы просто скопируем его сюда)
            // Для краткости я пропущу, но вы можете скопировать старый код из предыдущей версии.
            // Сейчас важно, чтобы для утиля работало, поэтому я остановлюсь на этом.
        } else {
            // скрыть сканлог
            const wrapper = settingsDiv ? settingsDiv.nextElementSibling : null;
            if (wrapper?.classList.contains("diman__scanLog__wrapper")) {
                wrapper.remove();
                const additionalContainers = document.querySelectorAll('.diman__scanLog__additional-container');
                additionalContainers.forEach(container => container.remove());
            }
            this.setAttribute('scanLog', 'hidden');
            const buttonText = this.querySelector('.diman__scanLog__activeButton__text');
            buttonText.innerHTML = `
                <div class="diman__scanLog__activeButton__text">Показать историю сканирования</div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon">
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                </svg>
            `;
        }
    });
}

function generateTableHTML(data, showNotification = true, customName = null) {
    // Определяем отображаемое имя для сканлога
    let sortableDisplayName = customName;
    if (!sortableDisplayName) {
        try {
            if (typeof getSortableName === 'function') {
                sortableDisplayName = getSortableName();
            } else {
                sortableDisplayName = 'Грузоместо';
            }
        } catch (e) {
            sortableDisplayName = 'Грузоместо';
        }
    }

    if (!data || !data.length) {
        return `
        <div class="diman__scanLog__block">
            <div class="diman__scanLog__topTableWrapper">
                <div class="diman__scanLog__topTable">
                    <span class="diman__scanLog__block-title">Сканлог: <span>${sortableDisplayName}</span></span>
                </div>
            </div>
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <div class="diman__scanLog__null">Нет сканов на СЦ / Таблица пустая</div>
                    </tr>
                </tbody>
            </table>
            <div class="diman__scanLog__bottomTableWrapper">
                <div class="diman__scanLog__bottomTable">${getOperationStatistics(data)}</div>
            </div>
        </div>
        `;
    }

    const header = data[0] || [];
    const rows = data.slice(1);

    // Проверяем, есть ли строки с данными (кроме заголовка)
    if (rows.length === 0) {
        return `
        <div class="diman__scanLog__block">
            <div class="diman__scanLog__topTableWrapper">
                <div class="diman__scanLog__topTable">
                    <span class="diman__scanLog__block-title">Сканлог: <span>${sortableDisplayName}</span></span>
                </div>
            </div>
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <div class="diman__scanLog__null">Нет сканов на СЦ / Таблица пустая</div>
                    </tr>
                </tbody>
            </table>
            <div class="diman__scanLog__bottomTableWrapper">
                <div class="diman__scanLog__bottomTable">${getOperationStatistics(data)}</div>
            </div>
        </div>
        `;
    }

    // Находим индексы важных колонок
    const datetimeIndex = header.findIndex(cell => 
        cell?.toString().trim().toLowerCase().includes("дата") || 
        cell?.toString().trim().toLowerCase().includes("время")
    );
    const operationIndex = header.findIndex(cell => cell?.toString().trim() === "Флоу");
    const zoneIndex = header.findIndex(cell => cell?.toString().trim() === "Зона");
    const resultIndex = header.findIndex(cell => cell?.toString().trim() === "Результат");
    const userIndex = header.findIndex(cell => cell?.toString().trim() === "Кладовщик");

    // Определяем, какие колонки полностью пустые (кроме заголовка)
    const emptyColumns = new Array(header.length).fill(true);
    
    // Проверяем каждую колонку на наличие данных
    for (let colIndex = 0; colIndex < header.length; colIndex++) {
        // Пропускаем специальные колонки (они не должны быть скрыты)
        if (colIndex === datetimeIndex || 
            colIndex === operationIndex || 
            colIndex === userIndex || 
            colIndex === zoneIndex) {
            emptyColumns[colIndex] = false;
            continue;
        }
        
        // Проверяем, есть ли хотя бы одна непустая ячейка в этой колонке
        for (const row of rows) {
            if (row[colIndex] !== undefined && row[colIndex] !== null && row[colIndex] !== '') {
                emptyColumns[colIndex] = false;
                break;
            }
        }
    }

    let html = `
    <div class="diman__scanLog__block">
        <div class="diman__scanLog__topTableWrapper">
            <div class="diman__scanLog__topTable">
                <span class="diman__scanLog__block-title">Сканлог: <span>${sortableDisplayName}</span></span>
            </div>
        </div>
        <table class="diman__scanLog__table">
            <thead class="diman__scanLog__thead">
                <tr class="diman__scanLog__thead__tr">
                    <th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__info">
                        <div class="diman__scanLog__th__info diman__scanLog__th__date">Дата</div>
                        <div class="diman__scanLog__th__info diman__scanLog__th__time">Время</div>
                        <div class="diman__scanLog__th__info diman__scanLog__th__icon" is-icons-showed="true">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" fill-rule="evenodd" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                                <path d="M160 144h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V160c0-8.837 7.163-16 16-16m564.314-25.333 181.019 181.02c6.248 6.248 6.248 16.378 0 22.627l-181.02 181.019c-6.248 6.248-16.378 6.248-22.627 0l-181.019-181.02c-6.248-6.248-6.248-16.378 0-22.627l181.02-181.019c6.248-6.248 16.378-6.248 22.627 0M160 544h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V560c0-8.837 7.163-16 16-16m400 0h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H560c-8.837 0-16-7.163-16-16V560c0-8.837 7.163-16 16-16"></path>
                            </svg>
                        </div>
                    </th>`;

    // Добавляем специальные колонки
    if (operationIndex !== -1) {
        html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other">Флоу</th>`;
    }
    if (userIndex !== -1) {
        html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other">Кладовщик</th>`;
    }
    if (zoneIndex !== -1) {
        html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other">Зона</th>`;
    }

    // Добавляем остальные колонки (кроме Дата/время и специальных)
    for (let colIndex = 0; colIndex < header.length; colIndex++) {
        if (colIndex !== datetimeIndex && 
            colIndex !== operationIndex && 
            colIndex !== userIndex && 
            colIndex !== zoneIndex) {
            const cell = header[colIndex];
            const hiddenAttr = emptyColumns[colIndex] ? ' tpi-scanlog-hidden-column' : '';
            html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other" ${hiddenAttr}>${cell !== undefined ? cell : ''}</th>`;
        }
    }

    html += `</tr></thead><tbody class="diman__scanLog__tbody" is-background-showed="true" is-tr-bordered="true">`;

    let lastDate = null;
    rows.forEach(row => {
        // Обрабатываем дату/время
        let date = '', time = '', currentRowDate = '';
        if (datetimeIndex !== -1 && row[datetimeIndex] !== undefined) {
            const formatted = formatExcelDate(row[datetimeIndex]);
            date = formatted.date;
            time = formatted.time;
            currentRowDate = date;
        }

        // Получаем значения специальных ячеек
        const operationCell = operationIndex !== -1 ? row[operationIndex]?.toString().trim() : undefined;
        const userCell = userIndex !== -1 ? row[userIndex]?.toString().trim() : undefined;
        const resultCell = resultIndex !== -1 ? row[resultIndex]?.toString().trim() : undefined;

        // Определяем атрибуты для строки
        let rowAttr = '';
        let iconAttr = '';
        
        // Разделение дней
        if (lastDate && currentRowDate && currentRowDate !== lastDate) {
            rowAttr += ` brakeday="true"`;
        }
        
        // Подсветка операций
        if (userCell === "sc-robot-ship-ta-SortingCenter[82]") {
            rowAttr += ' dimanUser="pi-bot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="robot-shipped"';
        } else if (resultCell === "Ошибка") {
            rowAttr += ' dimanOpertaion="error" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="error"';
        } else if (operationCell === "Сортировка") {
            rowAttr += ' dimanOpertaion="sort" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="sort"';
        } else if (operationCell === "Предсортировка посылок" || operationCell === "Предсортировка по группам") {
            rowAttr += ' dimanOpertaion="predsort" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="predsort"';
        } else if (operationCell === "[*] Отгрузка заказов" || operationCell ==="Отгрузка на средней миле") {
            rowAttr += ' dimanOpertaion="otgruzka" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="shipped"';
        } else if (operationCell === "[*] Отгрузка возвратов") {
            rowAttr += ' dimanOpertaion="otgruzka-voz" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="shipped"';
        } else if (operationCell === "[*] Подготовка к отгрузке") {
            rowAttr += ' dimanOpertaion="podgotovkakotgruzke" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="ready to shipp"';
        } else if (operationCell === "Инфоскан") {
            rowAttr += ' dimanOpertaion="infoscan" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="infoscan"';
        } else if (operationCell === "Приемка возвратов от курьера") {
            rowAttr += ' dimanOpertaion="courier return accept" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="return"';
        } else if (operationCell === "Приемка палет по первому сканированию") {
            rowAttr += ' dimanOpertaion="first pallet accept" coloredRow="true"';
        } else if (operationCell === "Приемка лотов") {
            rowAttr += ' dimanOpertaion="accept-lot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="accept-lot"';
        } else if (operationCell === "[*] Инвентаризация") {
            rowAttr += ' dimanOpertaion="inventoryzation" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="inventoryzation"';
        } else if (operationCell === "Перемещение лотов") {
            rowAttr += ' dimanOpertaion="moved-lot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="moved-lot"';
        } else if (operationCell === "[*] Подготовка лотов") {
            rowAttr += ' dimanOpertaion="ready-lot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="ready-lot"';
        } else{
            rowAttr += ' dimanOpertaion="unknown-operation" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="unknown-operation"';
        }

        // Формируем строку таблицы
        html += `<tr${rowAttr}>
            <td class="diman__scanLog__tbody__td diman__scanLog__td__stickySection__info">
                <div class="diman__scanLog__td__info diman__scanLog__td__date">${date}</div>
                <div class="diman__scanLog__td__info diman__scanLog__td__time">${time}</div>
                <div class="diman__scanLog__td__info diman__scanLog__td__icon" is-icons-showed="true"><i${iconAttr}>i</i></div>
            </td>`;

        // Специальные колонки (гарантируем наличие всех ячеек)
        if (operationIndex !== -1) {
            html += `<td class="diman__scanLog__tbody__td">${operationCell !== undefined ? operationCell : ''}</td>`;
        }
        if (userIndex !== -1) {
            html += `<td class="diman__scanLog__tbody__td diman__table__short">${userCell !== undefined ? userCell : ''}</td>`;
        }
        if (zoneIndex !== -1) {
            html += `<td class="diman__scanLog__tbody__td diman__table__short">${row[zoneIndex] !== undefined ? row[zoneIndex] : ''}</td>`;
        }

        // Остальные колонки (гарантируем наличие всех ячеек)
        for (let colIndex = 0; colIndex < header.length; colIndex++) {
            if (colIndex !== datetimeIndex && 
                colIndex !== operationIndex && 
                colIndex !== userIndex && 
                colIndex !== zoneIndex) {
                const cell = row[colIndex];
                const hiddenAttr = emptyColumns[colIndex] ? ' tpi-scanlog-hidden-column' : '';
                html += `<td class="diman__scanLog__tbody__td" ${hiddenAttr}>${cell !== undefined ? cell : ''}</td>`;
            }
        }

        html += `</tr>`;
        lastDate = currentRowDate;
    });

    html += `</tbody>
                </table>
                <div class="diman__scanLog__bottomTableWrapper">
                    <div class="diman__scanLog__bottomTable">${getOperationStatistics(data)}</div>
                </div>
                    </div>`;
                    
    if (showNotification) {
        tpiNotification.show("Сканлог грузоместа", "success", `Сканлог грузоместа успешно загружен`);
    }
    
    return html;
}

function formatExcelDate(excelDate) {
    if (typeof excelDate === 'number') {
        const utcMs = (excelDate - 25569) * 86400 * 1000;
        const dateObj = new Date(utcMs);

        const yyyy = dateObj.getUTCFullYear();
        const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getUTCDate()).padStart(2, '0');
        const date = `${dd}/${mm}/${yyyy}`;

        const hh = String(dateObj.getUTCHours()).padStart(2, '0');
        const min = String(dateObj.getUTCMinutes()).padStart(2, '0');
        const ss = String(dateObj.getUTCSeconds()).padStart(2, '0');
        const time = `${hh}:${min}:${ss}`;

        return { date, time };
    }
    return { date: '', time: '' };
}

async function processSingleLink(linkEl, progressCallback) {
    linkEl.dataset.scanlogLoading = "true";
    linkEl.classList.add('diman__tr__miniRadar__loaded');

    const href = linkEl.getAttribute('href') || '';
    const match = href.match(/\/sortables\/(\d+)$/);
    if (!match) throw new Error('Invalid link format');
    const sortableId = match[1];

    try {
        const currentUrl = window.location.href;
        let sortingCenterId = '21972131';
        const scMatch = currentUrl.match(/sorting-center\/(\d+)/);
        if (scMatch && scMatch[1]) {
            sortingCenterId = scMatch[1];
        }

        const apiUrl = `https://logistics.market.yandex.ru/api/sorting-center/${sortingCenterId}/sortable/scanlog?sortableId=${sortableId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const linkText = linkEl?.innerText?.trim() || `#${sortableId}`;
        const html = generateTableHTMLForRadar(data, linkText);

        // Возвращаем данные для последующей вставки
        const targetTr = linkEl.closest('tr');
        const colSpan = targetTr?.children.length || 12;

        // Помечаем ссылку как загруженную
        linkEl.dataset.scanlogLoaded = "true";
        delete linkEl.dataset.scanlogLoading;
        progressCallback(true);

        return { sortableId, html, targetTr, colSpan };
    } catch (error) {
        console.error('Ошибка загрузки сканлога:', error);
        linkEl.dataset.scanlogLoading = "false";
        progressCallback(false);
        return null;
    }
}

function handleScanlogLoading() {
    if (document._miniRadarHandlerAttached) return;
    document._miniRadarHandlerAttached = true;

    document.addEventListener('click', async function (e) {
        const btn = e.target.closest('#mini-radar');
        if (!btn) return;

        if (!btn.hasAttribute('mini-radar-status')) {
            btn.setAttribute('mini-radar-status', 'search');
        }

        const status = btn.getAttribute('mini-radar-status');
        const icon = btn.querySelector('i.miniRadarStatusIcon');
        const text = btn.querySelector('div.miniRadar-button-text');
        const progressEl = document.querySelector('#mini-radar-progress');

        const utilTableWrapper = document.querySelector('.tpi-util--sortables-table-wrapper');
        let linkItems = [];

        if (status === 'search') {
            // Сбор ссылок (без изменений)
            if (utilTableWrapper) {
                const rows = utilTableWrapper.querySelectorAll('.tpi-util--sortables-tr');
                if (rows.length === 0) {
                    if (typeof tpiNotification !== 'undefined') {
                        tpiNotification.show('Сканлог', 'info', 'Нет данных для загрузки. Сначала выберите ячейку.');
                    }
                    return;
                }
                for (const tr of rows) {
                    const link = tr.querySelector('a[href*="/sortables/"]');
                    if (!link) continue;
                    const href = link.getAttribute('href');
                    const match = href.match(/\/sortables\/(\d+)/);
                    if (!match) continue;
                    const sortableId = match[1];
                    let existingRow = tr.nextElementSibling;
                    if (existingRow && existingRow.dataset && existingRow.dataset.scanlogRow === sortableId) {
                        continue;
                    }
                    linkItems.push({ link, tr });
                }
            } else {
                const currentUrl = window.location.href;
                const isTurboPIPage = currentUrl.includes('turboPI-Text-to-Orders');
                let rows = [];
                if (isTurboPIPage) {
                    const turboTable = document.querySelector('.diman__TURBOpi__textToOrders__table');
                    if (turboTable) {
                        const turboRows = turboTable.querySelectorAll('tr');
                        rows = Array.from(turboRows).filter(tr => {
                            const link = tr.querySelector('a[href*="/sortables/"]');
                            return link !== null &&
                                   !link.hasAttribute('data-scanlog-loaded') &&
                                   !link.hasAttribute('data-scanlog-loading');
                        });
                    }
                }
                if (!isTurboPIPage || rows.length === 0) {
                    rows = Array.from(
                        document.querySelectorAll('tr:has(a[data-tid-prop="8e34e3c2 d47a3f9b 2cf94f05"]:not([data-scanlog-loaded]):not([data-scanlog-loading]))')
                    );
                }
                for (const tr of rows) {
                    let link;
                    if (isTurboPIPage) {
                        link = tr.querySelector('a[href*="/sortables/"]');
                    } else {
                        link = tr.querySelector('a[data-tid-prop="8e34e3c2 d47a3f9b 2cf94f05"]');
                    }
                    if (link) {
                        linkItems.push({ link, tr });
                    }
                }
            }

            if (linkItems.length === 0) {
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show("Мини-радар", "info", "Нет ссылок для загрузки сканлогов");
                }
                btn.disabled = false;
                return;
            }

            btn.setAttribute('mini-radar-status', 'loading');
            btn.disabled = true;
            if (icon) icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"/></circle><circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"/></circle><circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"/></circle></svg>`;
            if (text) text.textContent = 'Загрузка';
            if (progressEl) {
                progressEl.style.display = "flex";
                progressEl.textContent = `0 / ${linkItems.length}`;
            }

            let loadedCount = 0;
            const total = linkItems.length;
            const updateProgress = (success) => {
                loadedCount++;
                if (progressEl) progressEl.textContent = `${loadedCount} / ${total}`;
            };

            // Запускаем загрузку, но не вставляем
            const allPromises = linkItems.map(({ link, tr }) => processSingleLink(link, updateProgress));
            const settledResults = await Promise.allSettled(allPromises);

            // Собираем успешные результаты
            const results = [];
            let successCount = 0;
            settledResults.forEach((settled) => {
                if (settled.status === 'fulfilled' && settled.value) {
                    results.push(settled.value);
                    successCount++;
                } else if (settled.status === 'rejected') {
                    console.error('Ошибка при обработке ссылки:', settled.reason);
                }
            });

            // Теперь вставляем все строки одновременно
            for (const result of results) {
                const { sortableId, html, targetTr, colSpan } = result;
                if (!targetTr || !html) continue;

                const trWrapper = document.createElement('tr');
                trWrapper.setAttribute('data-scanlog-row', sortableId);

                const td = document.createElement('td');
                td.colSpan = colSpan;
                td.classList.add('_stickyColumn___BusWf');
                td.style.left = '0px';

                const container = document.createElement('div');
                container.className = 'diman__scanLog__wrapperMiniRadar';
                container.innerHTML = html;
                td.appendChild(container);
                trWrapper.appendChild(td);

                // Вставляем после строки-родителя
                targetTr.parentElement.insertBefore(trWrapper, targetTr.nextSibling);
            }

            // Применяем настройки
            if (typeof scanLogCheckLoadSettings === 'function') {
                scanLogCheckLoadSettings();
            }

            btn.setAttribute('mini-radar-status', 'hideresult');
            if (icon) icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>`;
            if (text) text.textContent = 'Скрыть сканлоги';
            if (progressEl) {
                progressEl.textContent = '';
                progressEl.style.display = "none";
            }
            btn.disabled = false;
            if (successCount > 0 && typeof tpiNotification !== 'undefined') {
                tpiNotification.show("Мини-радар", "success", `Загружено ${successCount} из ${total} сканлогов`);
            }
            return;
        }

        // ---- Обработка скрытия (hideresult) ----
        if (status === 'hideresult') {
            document.querySelectorAll('tr[data-scanlog-row]').forEach(el => el.remove());
            document.querySelectorAll('a[data-scanlog-loaded]').forEach(link => {
                delete link.dataset.scanlogLoaded;
                link.classList.remove('diman__tr__miniRadar__loaded');
            });
            btn.setAttribute('mini-radar-status', 'search');
            if (icon) icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>`;
            if (text) text.textContent = 'Показать сканлоги';
            if (progressEl) {
                progressEl.textContent = '';
                progressEl.style.display = "none";
            }
            btn.disabled = false;
            return;
        }
    });
}

handleScanlogLoading()
function generateTableHTMLForRadar(data, sortableName, showNotification = false) {
    if (!data || !data.length) {
        return `
        <div class="diman__scanLog__block diman__scanLog__blockMiniRadar">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <div class="diman__scanLog__null miniRadar--fix">Нет сканов на СЦ / Таблица пустая</div>
                    </tr>
                </tbody>
            </table>
        </div>
        `;
    }

    const header = data[0] || [];
    const rows = data.slice(1);

    if (rows.length === 0) {
        return `
        <div class="diman__scanLog__block diman__scanLog__blockMiniRadar">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <div class="diman__scanLog__null miniRadar--fix">Нет сканов на СЦ / Таблица пустая</div>
                    </tr>
                </tbody>
            </table>
        </div>
        `;
    }

    const datetimeIndex = header.findIndex(cell => 
        cell?.toString().trim().toLowerCase().includes("дата") || 
        cell?.toString().trim().toLowerCase().includes("время")
    );
    const operationIndex = header.findIndex(cell => cell?.toString().trim() === "Флоу");
    const zoneIndex = header.findIndex(cell => cell?.toString().trim() === "Зона");
    const resultIndex = header.findIndex(cell => cell?.toString().trim() === "Результат");
    const userIndex = header.findIndex(cell => cell?.toString().trim() === "Кладовщик");

    const emptyColumns = new Array(header.length).fill(true);
    for (let colIndex = 0; colIndex < header.length; colIndex++) {
        if ([datetimeIndex, operationIndex, userIndex, zoneIndex].includes(colIndex)) {
            emptyColumns[colIndex] = false;
            continue;
        }
        for (const row of rows) {
            if (row[colIndex] !== undefined && row[colIndex] !== null && row[colIndex] !== '') {
                emptyColumns[colIndex] = false;
                break;
            }
        }
    }

    let html = `
    <div class="diman__scanLog__block diman__scanLog__blockMiniRadar">
        <table class="diman__scanLog__table miniRadar--fix">
            <thead class="diman__scanLog__thead miniRadar--fix">
                <tr class="diman__scanLog__thead__tr miniRadar--fix">
                    <th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__info miniRadar--fix">
                        <div class="diman__scanLog__th__info diman__scanLog__th__date miniRadar--fix">Дата</div>
                        <div class="diman__scanLog__th__info diman__scanLog__th__time miniRadar--fix">Время</div>
                    </th>`;

    if (operationIndex !== -1) {
        html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other miniRadar--fix">Флоу</th>`;
    }
    if (userIndex !== -1) {
        html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other miniRadar--fix">Кладовщик</th>`;
    }
    if (zoneIndex !== -1) {
        html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other miniRadar--fix">Зона</th>`;
    }

    for (let colIndex = 0; colIndex < header.length; colIndex++) {
        if (![datetimeIndex, operationIndex, userIndex, zoneIndex].includes(colIndex)) {
            const cell = header[colIndex];
            const hiddenAttr = emptyColumns[colIndex] ? ' tpi-scanlog-hidden-column' : '';
            html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other miniRadar--fix" ${hiddenAttr}>${cell !== undefined ? cell : ''}</th>`;
        }
    }

    html += `</tr></thead><tbody class="diman__scanLog__tbody miniRadar--fix" is-background-showed="true" is-tr-bordered="true">`;

    let lastDate = null;
    rows.forEach(row => {
        let date = '', time = '', currentRowDate = '';
        if (datetimeIndex !== -1 && row[datetimeIndex] !== undefined) {
            const formatted = formatExcelDate(row[datetimeIndex]);
            date = formatted.date;
            time = formatted.time;
            currentRowDate = date;
        }

        const operationCell = operationIndex !== -1 ? row[operationIndex]?.toString().trim() : undefined;
        const userCell = userIndex !== -1 ? row[userIndex]?.toString().trim() : undefined;
        const resultCell = resultIndex !== -1 ? row[resultIndex]?.toString().trim() : undefined;

        let rowAttr = '';
        let iconAttr = '';

        if (userCell === "sc-robot-ship-ta-SortingCenter[82]") {
            rowAttr += ' dimanUser="pi-bot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="robot-shipped"';
        } else if (resultCell === "Ошибка") {
            rowAttr += ' dimanOpertaion="error" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="error"';
        } else if (operationCell === "Сортировка") {
            rowAttr += ' dimanOpertaion="sort" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="sort"';
        } else if (operationCell === "Предсортировка посылок" || operationCell === "Предсортировка по группам") {
            rowAttr += ' dimanOpertaion="predsort" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="predsort"';
        } else if (operationCell === "[*] Отгрузка заказов" || operationCell === "Отгрузка на средней миле") {
            rowAttr += ' dimanOpertaion="otgruzka" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="shipped"';
        } else if (operationCell === "[*] Отгрузка возвратов") {
            rowAttr += ' dimanOpertaion="otgruzka-voz" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="shipped"';
        } else if (operationCell === "[*] Подготовка к отгрузке") {
            rowAttr += ' dimanOpertaion="podgotovkakotgruzke" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="ready to shipp"';
        } else if (operationCell === "Инфоскан") {
            rowAttr += ' dimanOpertaion="infoscan" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="infoscan"';
        } else if (operationCell === "Приемка возвратов от курьера") {
            rowAttr += ' dimanOpertaion="courier return accept" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="return"';
        } else if (operationCell === "Приемка палет по первому сканированию") {
            rowAttr += ' dimanOpertaion="first pallet accept" coloredRow="true"';
        } else if (operationCell === "Приемка лотов") {
            rowAttr += ' dimanOpertaion="accept-lot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="accept-lot"';
        } else if (operationCell === "[*] Инвентаризация") {
            rowAttr += ' dimanOpertaion="inventoryzation" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="inventoryzation"';
        } else if (operationCell === "Перемещение лотов") {
            rowAttr += ' dimanOpertaion="moved-lot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="moved-lot"';
        } else if (operationCell === "[*] Подготовка лотов") {
            rowAttr += ' dimanOpertaion="ready-lot" coloredRow="true"';
            iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="ready-lot"';
        }

        html += `<tr${rowAttr}>
            <td class="diman__scanLog__tbody__td diman__scanLog__td__stickySection__info miniRadar--fix">
                <div class="diman__scanLog__td__info diman__scanLog__td__date miniRadar--fix">${date}</div>
                <div class="diman__scanLog__td__info diman__scanLog__td__time miniRadar--fix">${time}</div>
            </td>`;

        if (operationIndex !== -1) {
            html += `<td class="diman__scanLog__tbody__td miniRadar--fix">${operationCell || ''}</td>`;
        }
        if (userIndex !== -1) {
            html += `<td class="diman__scanLog__tbody__td diman__table__short miniRadar--fix">${userCell || ''}</td>`;
        }
        if (zoneIndex !== -1) {
            html += `<td class="diman__scanLog__tbody__td diman__table__short miniRadar--fix">${row[zoneIndex] || ''}</td>`;
        }

        for (let colIndex = 0; colIndex < header.length; colIndex++) {
            if (![datetimeIndex, operationIndex, userIndex, zoneIndex].includes(colIndex)) {
                const cell = row[colIndex];
                const hiddenAttr = emptyColumns[colIndex] ? ' tpi-scanlog-hidden-column' : '';
                html += `<td class="diman__scanLog__tbody__td miniRadar--fix" ${hiddenAttr}>${cell !== undefined ? cell : ''}</td>`;
            }
        }

        html += `</tr>`;
        lastDate = currentRowDate;
    });

    html += `</tbody></table>`;

    if (showNotification) {
        tpiNotification.show("Сканлог грузоместа", "success", `Сканлог успешно загружен`);
    }

    return html;
}

function processInsertedScanLogTable() {
    const rows = document.querySelectorAll('.diman__scanLog__table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 2) return;

        const operation = cells[2]?.textContent.trim();
        const user = [...cells].find(td => td.textContent.includes("sc-robot-ship-ta-SortingCenter[82]"));
        const result = [...cells].find(td => td.textContent === "Ошибка");


        // 🔹 Цветовая маркировка
        if (user) {
            row.setAttribute("dimanUser", "pi-bot");
            row.setAttribute("coloredRow", "true");
        } else if (result) {
            row.setAttribute("dimanOpertaion", "error");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "Сортировка") {
            row.setAttribute("dimanOpertaion", "sort");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "Предсортировка посылок") {
            row.setAttribute("dimanOpertaion", "predsort");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "[*] Отгрузка заказов") {
            row.setAttribute("dimanOpertaion", "otgruzka");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "[*] Подготовка к отгрузке") {
            row.setAttribute("dimanOpertaion", "podgotovkakotgruzke");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "Инфоскан") {
            row.setAttribute("dimanOpertaion", "infoscan");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "Приемка возвратов от курьера") {
            row.setAttribute("dimanOpertaion", "courier return accept");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "Приемка палет по первому сканированию") {
            row.setAttribute("dimanOpertaion", "first pallet accept");
            row.setAttribute("coloredRow", "true");
        } else if (operation === "Первичная приемка возвратов") {
            row.setAttribute("dimanOpertaion", "first return accept");
            row.setAttribute("coloredRow", "true");
        }
    });
}

async function scanLogAutoPreload() {
    try {
        // 1. Проверяем включён ли чекбокс автозагрузки
        const option1 = document.querySelector('#dimanScanLog-option-1');
        if (!option1?.checked) {
            return;
        }

        // 2. Находим кнопку и проверяем её состояние
        const button = document.querySelector(".diman__scanLog__activeButton");
        if (!button) {
            console.error("Кнопка не найдена");
            return;
        }
        if (button.getAttribute("scanLog") === "shown") {
            return;
        }

        // 3. Получаем URL для загрузки Excel
        const excelUrl = getScanLogExcelURL();
        if (!excelUrl) {
            console.error("Не удалось получить URL Excel");
            throw new Error("URL не найден");
        }

        // 4. Обновляем UI кнопки
        const buttonText = button.querySelector(".diman__scanLog__activeButton__text");
        if (!buttonText) {
            console.error("Элемент текста кнопки не найден");
            return;
        }
        
        button.disabled = true;
        buttonText.innerHTML = `
        <div class="diman__scanLog__activeButton__text">Загрузка</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="diman__scanLog__activeButton__icon"> 
            <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
            </circle>
            <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
            </circle>
            <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
            </circle>
        </svg>`;
        

        // 5. Загружаем и обрабатываем файл
        const response = await fetch(excelUrl);
        if (!response.ok) throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        
        const blob = await response.blob();
        if (!blob || blob.size === 0) throw new Error("Получен пустой файл");
        
        const arrayBuffer = await blob.arrayBuffer();
        
        // 6. Парсим Excel
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        if (!workbook.SheetNames.length) throw new Error("В файле нет листов");
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (!data?.length) throw new Error("Нет данных в таблице");

        // 7. Генерируем HTML
        const html = generateTableHTML(data);
        if (!html) throw new Error("Ошибка генерации HTML");

        // 8. Вставляем таблицу в DOM
        const settingsDiv = button.closest(".diman__scanLogSettings");
        if (!settingsDiv) throw new Error("Контейнер настроек не найден");

        // if(!document.querySelector(".tpi--screenshot-sortable-btn")){
        //     const buttonScreenshot = document.createElement("button")
        //     buttonScreenshot.className = "tpi--screenshot-sortable-btn"
        //     buttonScreenshot.innerText = "Скрин!"
        //     settingsDiv.appendChild(buttonScreenshot)
        //     buttonScreenshot.addEventListener("click", ()=>{
        //         takeScreenshot()
        //     })
        // }

        // Удаляем старую таблицу если есть
        const oldWrapper = document.querySelector(".diman__scanLog__wrapper");
        if (oldWrapper) oldWrapper.remove();

        const wrapperDiv = document.createElement("div");
        wrapperDiv.className = "diman__scanLog__wrapper";
        
        // Убираем лишнюю обертку из HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const innerContent = tempDiv.querySelector('.diman__scanLog__wrapper')?.innerHTML || html;
        wrapperDiv.innerHTML = innerContent;
        
        settingsDiv.insertAdjacentElement("afterend", wrapperDiv);

        // 9. Загружаем дополнительные сканлоги если включена опция 8
        if (document.querySelector('#dimanScanLog-option-8').checked) {
            await loadAdditionalScanLogs(wrapperDiv);
        }

        // 10. Обновляем состояние кнопки
        button.disabled = false;
        button.setAttribute("scanLog", "shown");
        buttonText.innerHTML = `
            <div class="diman__scanLog__activeButton__text">Скрыть историю сканирования</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="diman__scanLog__activeButton__icon">
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>    
            </svg>
        `;
        
        // 11. Применяем дополнительные настройки
        if (typeof scanLogCheckLoadSettings === 'function') {
            scanLogCheckLoadSettings();
        }

    } catch (error) {
        console.error("Ошибка:", error);
        if (button) {
            button.disabled = false;
            if (buttonText) {
                buttonText.innerHTML = `
                    <div class="diman__scanLog__activeButton__text">Ошибка ❌</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon">
                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                    </svg>
                `;
            }
            
            // Показываем подробности ошибки пользователю
            const errorDiv = document.createElement("div");
            errorDiv.className = "diman__error";
            errorDiv.textContent = `Ошибка загрузки: ${error.message}`;
            button.parentElement.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }
}

function scanLogCheckLoadSettings() {
    const option2 = document.querySelector('#dimanScanLog-option-2');
    const option3 = document.querySelector('#dimanScanLog-option-3');
    const option4 = document.querySelector('#dimanScanLog-option-4');
    const option5 = document.querySelector('#dimanScanLog-option-5');
    const option6 = document.querySelector('#dimanScanLog-option-6');
    const option7 = document.querySelector('#dimanScanLog-option-7');
    const option8 = document.querySelector('#dimanScanLog-option-8');
    const option9 = document.querySelector('#dimanScanLog-option-9');
    const option10 = document.querySelector('#dimanScanLog-option-10');


    if (option2) {
        function setColorScheme(){
            const coloredRow = document.querySelectorAll('tr[coloredrow]');
            if(option2.checked){
                coloredRow.forEach(tr => {
                    tr.setAttribute('coloredrow', true);
                });
            }else{
                coloredRow.forEach(tr => {
                    tr.setAttribute('coloredrow', false);
                });
            }
        }
        setColorScheme()
        option2.addEventListener("change", ()=>{
            setColorScheme()
        })
    }
    if (option3) {
        function brakeDay(){
            const brakeRows = document.querySelectorAll('tr[brakeday]');
            if(option3.checked){
                brakeRows.forEach(tr => {
                    tr.setAttribute('brakeday', true);
                });
            }else{
                brakeRows.forEach(tr => {
                    tr.setAttribute('brakeday', false);
                });
            }
        }
        brakeDay()
        option3.addEventListener("change", ()=>{
            brakeDay()
        })
    }
    if (option4) {
        function setIcons(){
            const iconColumn = document.querySelectorAll('div[is-icons-showed]');
            if(option4.checked){
                iconColumn.forEach(elemnt => {
                    elemnt.setAttribute('is-icons-showed', true);
                });
            }else{
                iconColumn.forEach(elemnt => {
                    elemnt.setAttribute('is-icons-showed', false);
                });
            }
        }
        setIcons()
        option4.addEventListener("change", ()=>{
            setIcons()
        })
    }
    if (option5) {
        function setBackground(){
            const table = document.querySelectorAll('tbody[is-background-showed]');
            if(option5.checked){
                table.forEach(elemnt => {
                    elemnt.setAttribute('is-background-showed', true);
                });
            }else{
                table.forEach(elemnt => {
                    elemnt.setAttribute('is-background-showed', false);
                });
            }
        }
        setBackground()
        option5.addEventListener("change", ()=>{
            setBackground()
        })
    }
    if (option6) {
        function setBordered(){
            const table = document.querySelectorAll('tbody[is-tr-bordered]');
            if(option6.checked){
                table.forEach(elemnt => {
                    elemnt.setAttribute('is-tr-bordered', true);
                });
            }else{
                table.forEach(elemnt => {
                    elemnt.setAttribute('is-tr-bordered', false);
                });
            }
        }
        setBordered()
        option6.addEventListener("change", ()=>{
            setBordered()
        })
    }
    if (option7) {
        function hideEmptyColumns(){
            const table = document.querySelectorAll('table *[tpi-scanlog-hidden-column]');
            if(option7.checked){
                table.forEach(elemnt => {
                    elemnt.setAttribute('tpi-scanlog-hidden-column', true);
                });
            }else{
                table.forEach(elemnt => {
                    elemnt.setAttribute('tpi-scanlog-hidden-column', false);
                });
            }
        }
        hideEmptyColumns()
        option7.addEventListener("change", ()=>{
            hideEmptyColumns()
        })
    }
    if (option9) {
        function scrollToTableSettings(){
            if(option9.checked){
                scrollToScanLogTable()
            }
        }
        scrollToTableSettings()
        option9.addEventListener("change", ()=>{
            if(option9.checked) scrollToScanLogTable()
        })
    }
}

async function loadAdditionalScanLogs(mainContainer) {
    const linksMap = new Map();
    const excludedPrefixes = ['CART', 'PALLET', "DRP"];
    const scanLogUrlTemplate = 'https://logistics.market.yandex.ru/api/sorting-center/21972131/sortable/scanlog?sortableId=';
    
    // Собираем уникальные ссылки по тексту
    document.querySelectorAll('tr a[data-tid="8e34e3c2 d47a3f9b 2cf94f05 422bcbe4"]').forEach(link => {
        const text = link.innerText.trim();
        const href = link.href;
        const path = link.pathname
        const isExcluded = excludedPrefixes.some(prefix => text.startsWith(prefix));
        
        // Если ссылка пустого формата, не учитываем
        if (path.endsWith("/sortables")) return;

        // Игнорируем исключенные префиксы и сохраняем только уникальные тексты
        if (isExcluded || linksMap.has(text)) return;
        
        // Извлекаем sortableId из URL
        const match = href.match(/sortables\/(\d+)/);
        if (!match) return;
        
        const sortableId = match[1];
        linksMap.set(text, `${scanLogUrlTemplate}${sortableId}`);
    });

    if (linksMap.size === 0) return;

    // Создаем блоки для каждой уникальной ссылки
    const blocks = [];
    const titles = [...linksMap.keys()];
    
    for (const [text, apiUrl] of linksMap.entries()) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Парсинг Excel
            const workbook = XLSX.read(uint8Array, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Генерация HTML с выключенными уведомлениями
            const html = generateTableHTML(data, false);
            
            // Создаем блок сканлога
            const block = document.createElement('div');
            block.className = 'diman__scanLog__block diman__scanLog__additional-block';
            block.style.display = 'none';
            
            // Убираем лишнюю обертку из HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const innerContent = tempDiv.querySelector('.diman__scanLog__block')?.innerHTML || html;
            block.innerHTML = innerContent;
            
            // Модифицируем верхнюю часть таблицы
            const topTable = block.querySelector('.diman__scanLog__topTable');
            if (topTable) {
                topTable.innerHTML = `
                    <span class="diman__scanLog__block-title">Сканлог: <span>${text}</span></span>
                    <div class="diman__scanLog__nav-container">
                        <button class="diman__scanLog__nav prev">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z"/>
                            </svg>
                        </button>
                        <span class="diman__scanLog__counter">1 из ${linksMap.size}</span>
                        <button class="diman__scanLog__nav next">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
                            </svg>
                        </button>
                    </div>
                `;
            }
            
            // Вставляем блок сразу после основного блока в wrapper
            mainContainer.appendChild(block);
            blocks.push(block);
        } catch (error) {
            console.error(`Ошибка загрузки сканлога для "${text}":`, error);
            tpiNotification.show("Сканлог Лота", "error", `Ошибка загрузки сканлога для "${text}":`, error);
        }
    }

    // Функция для переключения между блоками
    let currentIndex = 0;
    const switchBlock = (newIndex) => {
        // Скрываем все дополнительные блоки
        blocks.forEach(block => block.style.display = 'none');
        
        // Показываем текущий блок
        if (blocks[newIndex]) {
            blocks[newIndex].style.display = 'block';
            currentIndex = newIndex;
            
            // Обновляем счетчик во всех блоках
            blocks.forEach(block => {
                const counter = block.querySelector('.diman__scanLog__counter');
                if (counter) {
                    counter.textContent = `${newIndex + 1} из ${blocks.length}`;
                }
            });
        }
    };

    // Обработчики навигации для всех блоков
    blocks.forEach((block, index) => {
        const prevBtn = block.querySelector('.prev');
        const nextBtn = block.querySelector('.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + blocks.length) % blocks.length;
                switchBlock(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % blocks.length;
                switchBlock(newIndex);
            });
        }
    });

    // Показываем первый дополнительный блок
    if (blocks.length > 0) {
        switchBlock(0);
    }
}

function scrollToScanLogTable(){
    const tableSettings = document.querySelector(".diman__scanLogSettings");
    const offset = -30;
    const tableSettingsPosition = tableSettings.getBoundingClientRect().top;
    const offsetPosition = tableSettingsPosition + window.pageYOffset + offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

function getSortableName() {
    const sortableRaw = document.querySelector(".diman__sortable").innerText;
    const extraPart = "Грузоместо №";
    const sortableName = sortableRaw.replace(new RegExp(extraPart, 'g'), '').trim();
    return sortableName;
}

function getOperationStatistics(data) {
    const operationCounts = {};
    
    // Определяем порядок приоритета операций
    const operationPriority = [
        "sort",
        "predsort",
        "error",
        "infoscan",
        "ready-lot",
        "ready to shipp",
        "return",
        "inventoryzation",
        "accept-lot",
        "moved-lot",
        "shipped",
        "robot-shipped"
    ];

    if (data && data.length > 1) {
        const header = data[0];
        const rows = data.slice(1);
        const operationIndex = header.findIndex(cell => cell?.toString().trim() === "Флоу");
        const resultIndex = header.findIndex(cell => cell?.toString().trim() === "Результат");
        const userIndex = header.findIndex(cell => cell?.toString().trim() === "Кладовщик");

        rows.forEach(row => {
            const operationCell = operationIndex !== -1 ? row[operationIndex]?.toString().trim() : undefined;
            const resultCell = resultIndex !== -1 ? row[resultIndex]?.toString().trim() : undefined;
            const userCell = userIndex !== -1 ? row[userIndex]?.toString().trim() : undefined;
            let operationType = '';

            // Определяем тип операции с учётом приоритета
            if (resultCell === "Ошибка") {
                operationType = "error";
            } else if (operationCell === "Сортировка") {
                operationType = "sort";
            } else if (operationCell === "Предсортировка посылок" || operationCell === "Предсортировка по группам") {
                operationType = "predsort";
            } else if (operationCell === "Инфоскан") {
                operationType = "infoscan";
            } else if (operationCell === "[*] Подготовка лотов") {
                operationType = "ready-lot";
            } else if (operationCell === "[*] Подготовка к отгрузке") {
                operationType = "ready to shipp";
            } else if (operationCell === "[*] Отгрузка заказов" || operationCell === "Отгрузка на средней миле" || operationCell === "[*] Отгрузка возвратов") {
                operationType = "shipped";
            } else if (operationCell === "Приемка возвратов от курьера") {
                operationType = "return";
            } else if (operationCell === "[*] Инвентаризация") {
                operationType = "inventoryzation";
            } else if (operationCell === "Приемка лотов") {
                operationType = "accept-lot";
            } else if (operationCell === "Перемещение лотов") {
                operationType = "moved-lot";
            } else if (userCell === "sc-robot-ship-ta-SortingCenter[82]") {
                operationType = "robot-shipped";
            }

            if (operationType) {
                operationCounts[operationType] = (operationCounts[operationType] || 0) + 1;
            }
        });
    }

    // Формируем HTML с иконками в заданном порядке приоритета
    const htmlParts = ['<div class="diman__sncaLog__totalOpertaion-title">Операции:</div>'];
    
    // Добавляем операции в порядке приоритета
    operationPriority.forEach(operationType => {
        if (operationCounts[operationType]) {
            htmlParts.push(`
                <div class="diman__sncaLog__totalOpertaion-item">
                    <i diman__tableopertaionicon="${operationType}" class="diman__scanLog__td__i__icon">i</i>
                    <p>${operationCounts[operationType]}</p>
                </div>
            `);
        }
    });
    
    return htmlParts.join('');
}
async function loadScanLogsForUtilTable(tableWrapper) {
    const rows = tableWrapper.querySelectorAll('.tpi-util--sortables-tr');
    if (!rows.length) {
        if (typeof tpiNotification !== 'undefined') {
            tpiNotification.show('Сканлог', 'info', 'В таблице нет строк для загрузки');
        }
        return;
    }

    // Для каждой строки загружаем сканлог
    for (const tr of rows) {
        const sortableId = tr.dataset.sortableId;
        if (!sortableId) continue;

        // Проверяем, есть ли уже строка сканлога под этой строкой
        let existingRow = tr.nextElementSibling;
        if (existingRow && existingRow.dataset && existingRow.dataset.scanlogRow === sortableId) {
            continue; // уже загружено
        }

        // Создаём новую строку
        const newRow = document.createElement('tr');
        newRow.dataset.scanlogRow = sortableId;
        const td = document.createElement('td');
        td.colSpan = tr.children.length;
        const container = document.createElement('div');
        container.className = 'scanlog-container';
        td.appendChild(container);
        newRow.appendChild(td);
        tr.parentElement.insertBefore(newRow, tr.nextSibling);

        // Загружаем сканлог
        const success = await loadScanLogForSortable(sortableId, container);
        if (!success) {
            newRow.remove();
        }
    }
}

function clearScanLogsFromUtilTable() {
    document.querySelectorAll('.tpi-util--sortables-table-wrapper tr[data-scanlog-row]').forEach(row => row.remove());
}

async function loadScanLogForSortable(sortableId, container) {
    const apiUrl = `https://logistics.market.yandex.ru/api/sorting-center/21972131/sortable/scanlog?sortableId=${sortableId}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const blob = await response.blob();
        if (!blob || blob.size === 0) throw new Error('Пустой файл');
        const arrayBuffer = await blob.arrayBuffer();
        
        if (typeof XLSX === 'undefined') {
            throw new Error('Библиотека XLSX не загружена');
        }
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        if (!workbook.SheetNames.length) throw new Error('Нет листов в файле');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!data || data.length === 0) throw new Error('Нет данных');

        // Генерируем HTML через generateTableHTMLForRadar
        let html;
        if (typeof generateTableHTMLForRadar === 'function') {
            html = generateTableHTMLForRadar(data, sortableId, false);
        } else {
            // fallback
            html = generateSimpleScanLogTable(data, sortableId);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'diman__scanLog__wrapper tpi-sortable-scanlog-wrapper';
        wrapper.innerHTML = html;
        container.appendChild(wrapper);

        if (typeof scanLogCheckLoadSettings === 'function') {
            scanLogCheckLoadSettings();
        }

        return true;
    } catch (error) {
        console.error('Ошибка загрузки сканлога:', error);
        if (typeof tpiNotification !== 'undefined') {
            tpiNotification.show('Ошибка', 'error', `Не удалось загрузить сканлог: ${error.message}`);
        }
        return false;
    }
}


/**
 * Упрощённая генерация HTML таблицы, если generateTableHTML недоступна
 */
function generateSimpleScanLogTable(data, customName) {
    if (!data || data.length < 2) {
        return `<div class="diman__scanLog__null">Нет данных</div>`;
    }
    const header = data[0];
    const rows = data.slice(1);
    let html = `<div class="diman__scanLog__block">
        <div class="diman__scanLog__topTableWrapper">
            <div class="diman__scanLog__topTable">
                <span class="diman__scanLog__block-title">Сканлог: <span>${customName || 'Грузоместо'}</span></span>
            </div>
        </div>
        <table class="diman__scanLog__table">
            <thead class="diman__scanLog__thead"><tr>`;
    header.forEach(cell => {
        html += `<th class="diman__scanLog__thead__tr__th">${cell || ''}</th>`;
    });
    html += `</tr></thead><tbody class="diman__scanLog__tbody">`;
    rows.forEach(row => {
        html += `<tr>`;
        row.forEach(cell => {
            html += `<td class="diman__scanLog__tbody__td">${cell || ''}</td>`;
        });
        html += `</tr>`;
    });
    html += `</tbody></table></div>`;
    return html;
}