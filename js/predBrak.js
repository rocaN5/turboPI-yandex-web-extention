function predBrak(){
    let currentUrl = window.location.href;
    let urlObserver = null;
    let tableObserver = null;
    let isProcessing = false;
    let mutationActive = false;
    let tableMutationTimer = null;
    let currentAbortController = null;
    const TABLE_MUTATION_DEBOUNCE = 600;

    function initPredBrakObserver() {
        stopObservers();

        urlObserver = new MutationObserver(() => {
            const newUrl = window.location.href;
            if (newUrl !== currentUrl) {
                currentUrl = newUrl;
                startTableWatchingCycle();
            }
        });
        if (document.body) urlObserver.observe(document.body, { childList: true, subtree: false });

        tableObserver = new MutationObserver(tableMutationCallback);
        observeAllTables();

        setTimeout(startTableWatchingCycle, 300);
    }

    function stopObservers() {
        urlObserver?.disconnect();
        tableObserver?.disconnect();
        clearTimeout(tableMutationTimer);
        urlObserver = tableObserver = null;
    }

    function observeAllTables() {
        if (!tableObserver) tableObserver = new MutationObserver(tableMutationCallback);
        tableObserver.disconnect();
        const tables = document.querySelectorAll('table');
        tables.forEach(tbl => {
            try {
                tableObserver.observe(tbl, { childList: true, subtree: true, characterData: true });
            } catch (e) { /* игнор */ }
        });
    }

    // --- CALLBACK мутаций ---
    function tableMutationCallback() {
        mutationActive = true;

        // если идёт обработка — отменяем её немедленно (AbortController)
        if (isProcessing) {
            cancelCurrentProcessing();
        }

        if (tableMutationTimer) clearTimeout(tableMutationTimer);

        removeAllStatusWrappersSafely();

        tableMutationTimer = setTimeout(() => {
            mutationActive = false;
            startProcessingCycle(true); // форсированная (после мутаций) обработка
        }, TABLE_MUTATION_DEBOUNCE);
    }

    function removeAllStatusWrappersSafely() {
        tableObserver?.disconnect();
        const wrappers = document.querySelectorAll('.tpi-bc--status-wrapper');
        if (wrappers.length) {
            wrappers.forEach(w => {
                try { w.remove(); } catch (e) {}
            });
        }
        setTimeout(observeAllTables, 60);
    }

    function cancelCurrentProcessing() {
        if (currentAbortController) {
        }
        isProcessing = false;
    }

    // === Этой функции не хватало — реализуем корректно ===
    function startTableWatchingCycle() {
        // при смене URL — удаляем старые статусы и начинаем наблюдать
        removeAllStatusWrappersSafely();
        observeAllTables();
        if (tableMutationTimer) { clearTimeout(tableMutationTimer); tableMutationTimer = null; }
        // через небольшую задержку стартуем обработку, если таблица уже готова
        tableMutationTimer = setTimeout(() => {
            tableMutationTimer = null;
            startProcessingCycle(true);
        }, 250);
    }

    // Главный цикл — force позволяет форсировать запуск, даже если mutationActive = true
    async function startProcessingCycle(force = false) {
        if (mutationActive && !force) {
            return;
        }

        // Если уже идёт обработка — отменяем и начнём заново
        if (isProcessing) {
            cancelCurrentProcessing();
        }

        isProcessing = true;
        currentAbortController = new AbortController();
        const signal = currentAbortController.signal;

        try {
            tableObserver?.disconnect();
            addSkeletonsForPredBrak();

            await processAllScanLogs(signal);

            // Если после завершения есть незаполненные skeleton — перезапуск через небольшой интервал
            const remainingSkeleton = document.querySelector('.tpi-bc--skeleton');
            if (remainingSkeleton && !mutationActive) {
                // небольшая пауза, чтобы DOM стабилизировался и попытаться ещё раз
                setTimeout(() => {
                    if (!mutationActive) startProcessingCycle(true);
                }, 500);
            }
        } catch (err) {
            if (err && err.name === 'AbortError') {
            } else {
                console.error('startProcessingCycle: unexpected error', err);
            }
        } finally {
            isProcessing = false;
            observeAllTables();
        }
    }

    function addSkeletonsForPredBrak() {
        const tableRows = document.querySelectorAll('table tbody tr');
        if (!tableRows || !tableRows.length) return;
        let added = 0;
        tableRows.forEach(row => {
            const span = row.querySelector('span[data-e2e-i18n-key="common.sorting-center:sortable-damaged.PRE_DAMAGED"]');
            if (span && span.textContent.trim() === 'Предбрак') {
                let target = span;
                for (let i = 0; i < 4; i++) target = target?.parentElement;
                if (target && !target.querySelector('.tpi-bc--status-wrapper')) {
                    try {
                        target.insertAdjacentHTML('beforeend',
                            `<div class="tpi-bc--status-wrapper tpi-bc--skeleton"><div class="tpi-bc--skeleton-preview">Загрузка</div></div>`
                        );
                        added++;
                    } catch (e) {}
                }
            }
        });
    }

    // --- Обработка строк с поддержкой AbortSignal ---
    async function processAllScanLogs(signal) {
        const rows = document.querySelectorAll('table tbody tr');
        let processed = 0;

        for (const row of rows) {
            if (signal.aborted) throw new DOMException('aborted', 'AbortError');

            const wrapper = row.querySelector('.tpi-bc--status-wrapper.tpi-bc--skeleton');
            if (!wrapper) continue;

            const link = row.querySelector('a[icon="fileDownload"]');
            if (!link) {
                // если нет ссылки — это явно не ok
                updateStatusWrapperContent(wrapper, 'not_created');
                continue;
            }

            try {
                const result = await checkScanLogForCreateOperation(link, signal);
                if (signal.aborted) throw new DOMException('aborted', 'AbortError');

                if (result === 'created') updateStatusWrapperContent(wrapper, 'created');
                else updateStatusWrapperContent(wrapper, 'not_created');

                processed++;
            } catch (err) {
                if (err && err.name === 'AbortError') {
                    // отмена — не помечаем как ошибка; просто прекратим
                    throw err;
                } else {
                    // при любых других непредвиденных ошибках — помечаем как error
                    console.error('processAllScanLogs: unexpected error for row', err);
                    updateStatusWrapperContent(wrapper, 'error');
                }
            }
        }
    }

    // --- checkScanLogForCreateOperation WITH signal, и более мягкая обработка ошибок ---
    async function checkScanLogForCreateOperation(linkEl, signal) {
        const href = linkEl.getAttribute('href') || linkEl.href || '';
        let sortableId = null;
        let m = href.match(/\/sortables\/(\d+)/);
        if (m) sortableId = m[1];
        if (!sortableId) {
            m = href.match(/[?&]sortableId=(\d+)/);
            if (m) sortableId = m[1];
        }
        if (!sortableId) {
            sortableId = linkEl.dataset.sortableId || linkEl.dataset.id || linkEl.getAttribute('data-sortable-id');
        }
        if (!sortableId) {
            // если не смогли извлечь — считаем как not_created (не критическая ошибка)
            console.warn('checkScanLogForCreateOperation: sortableId not found for', href);
            return 'not_created';
        }

        const urlMatch = window.location.href.match(/sorting-center\/(\d+)\/sortable/);
        const sortingCenterId = urlMatch ? urlMatch[1] : null;
        if (!sortingCenterId) {
            console.warn('checkScanLogForCreateOperation: sortingCenterId not found in URL');
            return 'not_created';
        }

        const apiUrl = `https://logistics.market.yandex.ru/api/sorting-center/${sortingCenterId}/sortable/scanlog?sortableId=${sortableId}`;
        try {
            const response = await fetch(apiUrl, { signal });
            if (!response.ok) {
                // не считать это критической ошибкой — вероятно 404/403 — трактуем как not_created
                console.warn('checkScanLogForCreateOperation: response not ok', response.status, apiUrl);
                return 'not_created';
            }

            const arrayBuffer = await response.arrayBuffer();
            let workbook;
            try {
                workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            } catch (e) {
                console.warn('checkScanLogForCreateOperation: XLSX.parse failed', e);
                return 'not_created';
            }

            if (!workbook.SheetNames.length) {
                console.warn('checkScanLogForCreateOperation: no sheets in workbook');
                return 'not_created';
            }

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (!data || !data.length) {
                console.warn('checkScanLogForCreateOperation: empty data');
                return 'not_created';
            }

            return await checkExcelDataForCreateOperation(data);
        } catch (err) {
            if (err && err.name === 'AbortError') {
                // пробрасываем аборт дальше — обработчик выше поймает и не пометит как ошибку
                throw err;
            }
            // прочие ошибки — логируем и возвращаем not_created чтобы не засорять "Ошибка"
            console.error('checkScanLogForCreateOperation: fetch/parse error', err);
            return 'not_created';
        }
    }

    // --- Анализ Excel (возвращаем 'created' или 'not_created') ---
    async function checkExcelDataForCreateOperation(data) {
        try {
            const header = data[0] || [];
            const rows = data.slice(1);

            const operationIndex = header.findIndex(cell =>
                cell?.toString().trim().toLowerCase().includes('операция')
            );
            const resultIndex = header.findIndex(cell =>
                cell?.toString().trim().toLowerCase().includes('результат')
            );

            let hasCreateOperation = false;
            let hasSuccessResult = false;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i] || [];
                if (operationIndex !== -1 && row[operationIndex] !== undefined) {
                    const operationCell = String(row[operationIndex]).trim();
                    if (operationCell.includes('sc.display.operation.CREATE') || operationCell.includes('operation.CREATE') || operationCell.includes('CREATE')) {
                        hasCreateOperation = true;
                    }
                }
                if (resultIndex !== -1 && row[resultIndex] !== undefined) {
                    const resultCell = String(row[resultIndex]).trim();
                    if (/Успех/i.test(resultCell) || /Success/i.test(resultCell)) {
                        hasSuccessResult = true;
                    }
                }
            }
            return (hasCreateOperation && hasSuccessResult) ? 'created' : 'not_created';
        } catch (e) {
            console.error('checkExcelDataForCreateOperation: unexpected error', e);
            return 'not_created';
        }
    }

    // --- Обновление статуса (унифицировано) ---
    function updateStatusWrapperContent(wrapperElement, status) {
        wrapperElement.className = 'tpi-bc--status-wrapper';
        if (status === 'created') {
            wrapperElement.innerHTML = '<i class="tpi-bc--status-icon" tpi-current-state="created"></i><p class="tpi-bc--status-text">Оформлен</p>';
        } else if (status === 'not_created') {
            wrapperElement.innerHTML = '<i class="tpi-bc--status-icon" tpi-current-state="null"></i><p class="tpi-bc--status-text">Не оформлен</p>';
        } else { // 'error' и всё остальное
            wrapperElement.innerHTML = '<i class="tpi-bc--status-icon" tpi-current-state="error"></i><p class="tpi-bc--status-text">Ошибка</p>';
        }
    }

    // Перехват history
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;
    history.pushState = function(...args) {
        originalPush.apply(this, args);
        setTimeout(() => {
            const newUrl = window.location.href;
            if (newUrl !== currentUrl) {
                currentUrl = newUrl;
                startTableWatchingCycle();
            }
        }, 100);
    };
    history.replaceState = function(...args) {
        originalReplace.apply(this, args);
        setTimeout(() => {
            const newUrl = window.location.href;
            if (newUrl !== currentUrl) {
                currentUrl = newUrl;
                startTableWatchingCycle();
            }
        }, 100);
    };

    // Старт
    initPredBrakObserver();
}