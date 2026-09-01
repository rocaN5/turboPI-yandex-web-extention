const tpi_util_icon_order = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M225.6,62.64l-88-48.17a19.91,19.91,0,0,0-19.2,0l-88,48.17A20,20,0,0,0,20,80.19v95.62a20,20,0,0,0,10.4,17.55l88,48.17a19.89,19.89,0,0,0,19.2,0l88-48.17A20,20,0,0,0,236,175.81V80.19A20,20,0,0,0,225.6,62.64ZM128,36.57,200,76,128,115.4,56,76ZM44,96.79l72,39.4v76.67L44,173.44Zm96,116.07V136.19l72-39.4v76.65Z"/>
</svg>
`,
tpi_util_icon_chevron_left = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
</svg>
`,
tpi_util_icon_pin = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path fill-rule="evenodd" d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3"></path>
</svg>
`,
tpi_util_icon_chevron_right = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
</svg>
`,
tpi_util_icon_x_mark = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
</svg>
`,
tpi_util_icon_copy = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 512">
    <path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
</svg>
`,
tpi_util_icon_copyMono = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.0943 7.14643C17.6874 6.93123 17.9818 6.85378 18.1449 6.82608C18.1461 6.87823 18.1449 6.92051 18.1422 6.94825C17.9096 9.39217 16.8906 15.4048 16.3672 18.2026C16.2447 18.8578 16.1507 19.1697 15.5179 18.798C15.1014 18.5532 14.7245 18.2452 14.3207 17.9805C12.9961 17.1121 11.1 15.8189 11.2557 15.8967C9.95162 15.0373 10.4975 14.5111 11.2255 13.8093C11.3434 13.6957 11.466 13.5775 11.5863 13.4525C11.64 13.3967 11.9027 13.1524 12.2731 12.8081C13.4612 11.7035 15.7571 9.56903 15.8151 9.32202C15.8246 9.2815 15.8334 9.13045 15.7436 9.05068C15.6539 8.97092 15.5215 8.9982 15.4259 9.01989C15.2904 9.05064 13.1326 10.4769 8.95243 13.2986C8.33994 13.7192 7.78517 13.9242 7.28811 13.9134L7.29256 13.9156C6.63781 13.6847 5.9849 13.4859 5.32855 13.286C4.89736 13.1546 4.46469 13.0228 4.02904 12.8812C3.92249 12.8466 3.81853 12.8137 3.72083 12.783C8.24781 10.8109 11.263 9.51243 12.7739 8.884C14.9684 7.97124 16.2701 7.44551 17.0943 7.14643ZM19.5169 5.21806C19.2635 5.01244 18.985 4.91807 18.7915 4.87185C18.5917 4.82412 18.4018 4.80876 18.2578 4.8113C17.7814 4.81969 17.2697 4.95518 16.4121 5.26637C15.5373 5.58382 14.193 6.12763 12.0058 7.03736C10.4638 7.67874 7.39388 9.00115 2.80365 11.001C2.40046 11.1622 2.03086 11.3451 1.73884 11.5619C1.46919 11.7622 1.09173 12.1205 1.02268 12.6714C0.970519 13.0874 1.09182 13.4714 1.33782 13.7738C1.55198 14.037 1.82635 14.1969 2.03529 14.2981C2.34545 14.4483 2.76276 14.5791 3.12952 14.6941C3.70264 14.8737 4.27444 15.0572 4.84879 15.233C6.62691 15.7773 8.09066 16.2253 9.7012 17.2866C10.8825 18.0651 12.041 18.8775 13.2243 19.6531C13.6559 19.936 14.0593 20.2607 14.5049 20.5224C14.9916 20.8084 15.6104 21.0692 16.3636 20.9998C17.5019 20.8951 18.0941 19.8479 18.3331 18.5703C18.8552 15.7796 19.8909 9.68351 20.1332 7.13774C20.1648 6.80544 20.1278 6.433 20.097 6.25318C20.0653 6.068 19.9684 5.58448 19.5169 5.21806Z"></path>
</svg>
`,
tpi_util_icon_scanDownload = `
<svg stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" stroke-linejoin="round" fill="none">
    <path d="M14 3v4a1 1 0 0 0 1 1h4" style="fill: transparent !important;"></path>
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" style="fill: transparent !important;"></path>
    <path d="M12 17v-6"></path>
    <path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path>
</svg>
`,
tpi_util_icon_copySortable = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.6 2.001H7.4a1.402 1.402 0 0 0-1.4 1.4v2.602H3.401a1.401 1.401 0 0 0-1.4 1.4v13.2a1.402 1.402 0 0 0 1.4 1.4h13.2a1.4 1.4 0 0 0 1.4-1.4V18h2.6a1.401 1.401 0 0 0 1.4-1.4V3.4a1.402 1.402 0 0 0-1.4-1.4ZM16 20.003H4v-12h12v12ZM20 16h-1.999V7.402a1.401 1.401 0 0 0-1.4-1.4h-8.6v-2h12v12Z"></path><path d="M9 17.994h2v-3h3v-2h-3v-3H9v3H6v2h3v3Z"></path>
</svg>
`,
tpi_util_icon_calendar = `
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
tpi_util_icon_clock = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
</svg>
`,
tpi_util_icon_inbound = `
<svg stroke="currentColor" fill="currentColor" stroke-width=".5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"></path>
    <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
</svg>
`,
tpi_util_icon_outbound = `
<svg stroke="currentColor" fill="currentColor" stroke-width=".5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
    <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"></path>
    <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"></path>
</svg>
`,
tpi_util_icon_info_copy = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
    <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"></path>
</svg>
`,
tpi_util_icon_info_copyMono = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor">
    <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z">
</svg>
`
;

(function() {
    'use strict';

    const BASE_URL = 'https://logistics.market.yandex.ru/sorting-center/21972131/orders/tpiUtilData?tpiUtilData=true';
    const PARAM_KEY = 'tpiUtilData';
    const SORTING_CENTER_ID = 21972131;
    const CELL_DATA_CACHE = new Map();

    function isUtilPage(url) {
        if (!url.startsWith(BASE_URL.split('?')[0])) return false;
        const params = new URLSearchParams(url.split('?')[1] || '');
        return params.get(PARAM_KEY) === 'true';
    }

    function waitForToken(timeout = 5000) {
        return new Promise((resolve) => {
            if (typeof tpiUserTOKEN !== 'undefined' && tpiUserTOKEN) {
                resolve(tpiUserTOKEN);
                return;
            }
            const start = Date.now();
            const interval = setInterval(() => {
                if (typeof tpiUserTOKEN !== 'undefined' && tpiUserTOKEN) {
                    clearInterval(interval);
                    resolve(tpiUserTOKEN);
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 100);
        });
    }

    //! Генерация данных для STL и PLT ячеек
    function generateAllData() {
        const stlShelves = [];
        for (let alley = 1; alley <= 5; alley++) {
            const cells = [];
            for (let level = 1; level <= 3; level++) {
                for (let section = 1; section <= 6; section++) {
                    cells.push({
                        number: `STL-${alley}-${level}-${section}`,
                        levelNumber: level,
                        sectionNumber: section,
                        alleyNumber: alley,
                        sortingCenterId: SORTING_CENTER_ID,
                        type: 'STL'
                    });
                }
            }
            stlShelves.push({ alley, cells });
        }

        const pltShelves = [];
        const totalPairs = 14;
        const pairsPerSlide = 4;
        const slideCount = Math.ceil(totalPairs / pairsPerSlide);

        for (let s = 0; s < slideCount; s++) {
            const cells = [];
            const startIdx = s * pairsPerSlide;
            const endIdx = Math.min(startIdx + pairsPerSlide, totalPairs);
            for (let idx = startIdx; idx < endIdx; idx++) {
                cells.push({
                    number: `PLT-1-${idx+1}`,
                    rowNumber: 1,
                    indexNumber: idx+1,
                    sortingCenterId: SORTING_CENTER_ID,
                    type: 'PLT'
                });
                cells.push({
                    number: `PLT-2-${idx+1}`,
                    rowNumber: 2,
                    indexNumber: idx+1,
                    sortingCenterId: SORTING_CENTER_ID,
                    type: 'PLT'
                });
            }
            pltShelves.push({ alley: s + 1, cells });
        }

        return { stlShelves, pltShelves };
    }

    //! Функция получения данных для ячейки
    async function fetchCellData(cellName, token) {
        const url = 'https://logistics.market.yandex.ru/api/resolve/?r=sortingCenter/sortables/resolveSortableReport:resolveSortableReport&r=sortingCenter/zones/resolveGetZones:resolveGetZones';
        const body = {
            "params": [
                {
                    "sortableStatuses": [
                        "ARRIVED_DIRECT",
                        "KEEPED_DIRECT",
                        "SORTED_DIRECT",
                        "PREPARED_DIRECT",
                        "ACCEPTED_RETURN",
                        "KEEPED_RETURN",
                        "SORTED_RETURN",
                        "PREPARED_RETURN",
                        "CONSOLIDATED"
                    ],
                    "cellName": cellName,
                    "page": 0,
                    "pageSize": "300",
                    "stages": [],
                    "sortingCenterId": SORTING_CENTER_ID,
                    "size": 300,
                    "sortableTypes": [
                        "PLACE",
                        "PALLET",
                        "ORPHAN_PALLET",
                        "DROP_PALLET",
                        "TOT",
                        "BATCH",
                        "POLYBOX",
                        "POLYBOX_CAP",
                        "POLYBOX_TRAY",
                        "XDOC_PALLET",
                        "XDOC_BOX",
                        "ANOMALY",
                        "CART",
                        "COURIER_PALLET",
                        "CLIENT_RETURN",
                        "CART_SD",
                        "ZASYL"
                    ],
                    "crossDockOnly": false
                },
                {
                    "sortingCenterId": SORTING_CENTER_ID
                }
            ],
            "path": `/sorting-center/${SORTING_CENTER_ID}/sortables?sortableTypes=all&sortableStatuses=DIRECT%2FARRIVED_DIRECT&sortableStatuses=DIRECT%2FKEEPED_DIRECT&sortableStatuses=DIRECT%2FSORTED_DIRECT&sortableStatuses=DIRECT%2FPREPARED_DIRECT&sortableStatuses=RETURN%2FACCEPTED_RETURN&sortableStatuses=RETURN%2FKEEPED_RETURN&sortableStatuses=RETURN%2FSORTED_RETURN&sortableStatuses=RETURN%2FPREPARED_RETURN&sortableStatuses=DIRECT%2FCONSOLIDATED&sortableStatusesLeafs=DIRECT%2FARRIVED_DIRECT&sortableStatusesLeafs=DIRECT%2FKEEPED_DIRECT&sortableStatusesLeafs=DIRECT%2FSORTED_DIRECT&sortableStatusesLeafs=DIRECT%2FPREPARED_DIRECT&sortableStatusesLeafs=RETURN%2FACCEPTED_RETURN&sortableStatusesLeafs=RETURN%2FKEEPED_RETURN&sortableStatusesLeafs=RETURN%2FSORTED_RETURN&sortableStatusesLeafs=RETURN%2FPREPARED_RETURN&sortableStatusesLeafs=DIRECT%2FCONSOLIDATED&cellName=${cellName}&id=${SORTING_CENTER_ID}&page=1&pageSize=300`
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Market-Core-Service': '<UNKNOWN>',
                    'sk': token
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            const result = data.results?.[0]?.data;
            if (!result) return { totalElements: 0, utilCount: 0, content: [] };
            const totalElements = result.totalElements || 0;
            const content = result.content || [];
            let utilCount = 0;
            for (const item of content) {
                if (item.stageSystemName === 'FINAL_ACCEPT_DIRECT') {
                    utilCount++;
                }
            }
            return { totalElements, utilCount, content };
        } catch (error) {
            console.log(`Ошибка получения данных для ячейки ${cellName}:`, error);
            return { totalElements: 0, utilCount: 0, content: [] };
        }
    }

    //! Функция загрузки данных стеллажа
    async function loadShelfData(shelf, token) {
        const promises = shelf.cells.map(cell => fetchCellData(cell.number, token));
        const results = await Promise.allSettled(promises);
        results.forEach((result, index) => {
            const cellName = shelf.cells[index].number;
            if (result.status === 'fulfilled') {
                CELL_DATA_CACHE.set(cellName, result.value);
            } else {
                console.log(`Ошибка загрузки для ${cellName}:`, result.reason);
                CELL_DATA_CACHE.set(cellName, { totalElements: 0, utilCount: 0, content: [] });
            }
        });
    }

    //! Создание HTML для ячейки (STL и PLT)
    function createCellHtml(cellNumber, data) {
        const { totalElements, utilCount } = data;
        const hasItems = totalElements > 0 || utilCount > 0;
        const parts = cellNumber.split('-');
        const type = parts[0];
        let attrs = `tpi-cell-type="${type}" data-cell-name="${cellNumber}"`;

        if (type === 'STL') {
            const alley = parts[1];
            const level = parts[2];
            const section = parts[3];
            attrs += ` tpi-alley-number="${alley}" tpi-alley-section="${section}" tpi-alley-level="${level}"`;
        } else if (type === 'PLT') {
            const row = parts[1];
            const col = parts[2];
            attrs += ` tpi-row="${row}" tpi-col="${col}"`;
        }

        if (!hasItems) {
            return /*html*/`
                <div class="tpi-util--cell-container" tpi-cell-state="empty" tpi-tooltip-data="Данная ячейка пуста" ${attrs}>
                    <div class="tpi-util--cell-container-item">
                        <div class="tpi-util--cell-title-wrapper">
                            <p class="tpi-util--cell-title">${cellNumber}</p>
                        </div>
                    </div>
                    <div class="tpi-util--cell-container-item">
                        <devider></devider>
                    </div>
                    <div class="tpi-util--cell-container-item" tpi-util-empty-item>
                        <div class="tpi-util--cell-container-item-section">
                            <div class="tpi-util--cell-data-title-empty">
                                <icon>${tpi_util_icon_x_mark}</icon>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const isUtil = utilCount > 0;
        const stateAttr = isUtil ? 'util' : 'data';
        const link = `https://hubs.market.yandex.ru/sorting-center/${SORTING_CENTER_ID}/sortables?cellName=${cellNumber}&sortableTypes=PLACE&sortableTypes=POLYBOX_CAP&sortableTypes=POLYBOX_TRAY&sortableTypes=BATCH&sortableTypes=ZASYL&sortableTypes=XDOC_BOX&sortableTypes=ANOMALY&sortableTypes=CLIENT_RETURN`;
        const linkUtil = `https://logistics.market.yandex.ru/sorting-center/${SORTING_CENTER_ID}/sortables?cellName=${cellNumber}&sortableTypes=PLACE&sortableTypes=POLYBOX_CAP&sortableTypes=POLYBOX_TRAY&sortableTypes=BATCH&sortableTypes=ZASYL&sortableTypes=XDOC_BOX&sortableTypes=ANOMALY&sortableTypes=CLIENT_RETURN&sortableStatuses=DIRECT%2FARRIVED_DIRECT&sortableStatuses=DIRECT%2FKEEPED_DIRECT&sortableStatuses=DIRECT%2FSORTED_DIRECT&sortableStatuses=DIRECT%2FPREPARED_DIRECT&sortableStatuses=RETURN%2FACCEPTED_RETURN&sortableStatuses=RETURN%2FKEEPED_RETURN&sortableStatuses=RETURN%2FSORTED_RETURN&sortableStatuses=RETURN%2FPREPARED_RETURN&sortableStatuses=DIRECT%2FCONSOLIDATED&sortableStatusesLeafs=DIRECT%2FARRIVED_DIRECT&sortableStatusesLeafs=DIRECT%2FKEEPED_DIRECT&sortableStatusesLeafs=DIRECT%2FSORTED_DIRECT&sortableStatusesLeafs=DIRECT%2FPREPARED_DIRECT&sortableStatusesLeafs=RETURN%2FACCEPTED_RETURN&sortableStatusesLeafs=RETURN%2FKEEPED_RETURN&sortableStatusesLeafs=RETURN%2FSORTED_RETURN&sortableStatusesLeafs=RETURN%2FPREPARED_RETURN&sortableStatusesLeafs=DIRECT%2FCONSOLIDATED&stages=DIRECT&stagesLeafs=DIRECT%2FTERMINAL%2FRETURNED_WITHOUT_ACCEPTANCE&stagesLeafs=DIRECT%2FTERMINAL%2FCONSOLIDATED&stagesLeafs=DIRECT%2FTERMINAL%2FFIRST_ACCEPT_CANCELLED&stagesLeafs=DIRECT%2FTERMINAL%2FDELETED&stagesLeafs=DIRECT%2FTERMINAL%2FCANCELLED&stagesLeafs=DIRECT%2FTERMINAL&stagesLeafs=DIRECT%2FPREPARATION%2FPRE_SORTED_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FPRE_SORTED_FROM_CART_SD&stagesLeafs=DIRECT%2FPREPARATION%2FLABEL_CREATED_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FLABEL_CREATED_WITH_COURIER_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FSORTED_IN_CART_SD&stagesLeafs=DIRECT%2FPREPARATION%2FAWAITING_SORT_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FLOT_READY_FOR_FILLING_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FSORTING_IN_LOT_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FSORTED_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FTRANSIT_READY_LOT_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FPREPARED_DIRECT&stagesLeafs=DIRECT%2FPREPARATION&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FSORTING_IN_LOT_KEEPED_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FLABEL_CREATED_KEEPED_WITH_GROUP_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FPACKED_KEEPED_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FINSUFFICIENT_DATA_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FANOMALY_QCS_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FKEEPED_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE%2FTRANSIT_NOT_READY_LOT_DIRECT&stagesLeafs=DIRECT%2FLONG_TERM_STORAGE&stagesLeafs=DIRECT%2FACCEPT%2FFIRST_ACCEPT_DIRECT&stagesLeafs=DIRECT%2FACCEPT%2FFINAL_ACCEPT_DIRECT&stagesLeafs=DIRECT%2FACCEPT%2FAWAITING_DIRECT&stagesLeafs=DIRECT%2FACCEPT%2FNOT_ACCEPTED_BY_COURIER_DIRECT&stagesLeafs=DIRECT%2FACCEPT&stagesLeafs=DIRECT%2FSHIPMENT%2FSHIPPED_DIRECT&stagesLeafs=DIRECT%2FSHIPMENT%2FAWAITING_ACCEPTANCE_BY_COURIER_DIRECT&stagesLeafs=DIRECT%2FSHIPMENT%2FSHIPPED_DIRECT_REPLACED&stagesLeafs=DIRECT%2FSHIPMENT&stagesLeafs=DIRECT`;

        return /*html*/`
            <div class="tpi-util--cell-container" tpi-cell-state="${stateAttr}" tpi-tooltip-data="Нажмите, чтобы увидеть список грузомест" ${attrs}>
                <icon class="tpi-util--cell-container-pin">${tpi_util_icon_pin}</icon>
                <div class="tpi-util--cell-container-item">
                    <div class="tpi-util--cell-title-wrapper">
                        <p class="tpi-util--cell-title">${cellNumber}</p>
                    </div>
                </div>
                <div class="tpi-util--cell-container-item">
                    <devider></devider>
                </div>
                <div class="tpi-util--cell-container-item">
                    <div class="tpi-util--cell-container-item-section">
                        <div class="tpi-util--cell-data-title">В ячейке:</div>
                        <a class="tpi-util--cell-data-link" href="${link}" target="_blank">
                            ${totalElements} гм<icon>${tpi_util_icon_order}</icon>
                        </a>
                    </div>
                    <div class="tpi-util--cell-container-item-section">
                        <div class="tpi-util--cell-data-title">Утиль:</div>
                        <a class="tpi-util--cell-data-link" href="${linkUtil}" target="_blank">
                            ${utilCount} гм<icon>${tpi_util_icon_order}</icon>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    //! Словари для расшифровки
    const sortableTypeMap = {
        'PLACE': 'Посылка',
        'PALLET': 'Палета',
        'ORPHAN_PALLET': 'Обезличенная палета',
        'DROP_PALLET': 'Палета ФФЦ (дропка)',
        'TOT': 'TOT',
        'BATCH': 'Батч',
        'POLYBOX': 'Короб полибокса',
        'POLYBOX_CAP': 'Крышка полибокса',
        'POLYBOX_TRAY': 'Поддон полибокса',
        'XDOC_PALLET': 'XDOC палета',
        'XDOC_BOX': 'XDOC короб',
        'ANOMALY': 'Аномалия',
        'CART': 'Тележка',
        'COURIER_PALLET': 'Палета МК',
        'CLIENT_RETURN': 'Клиентский возврат',
        'ZASYL': 'Засыл'
    };

    const statusMap = {
        'AWAITING_DIRECT': 'Ожидает приемки',
        'ARRIVED_DIRECT': 'Принят',
        'SORTED_DIRECT': 'Отсортирован',
        'KEEPED_DIRECT': 'На хранении',
        'PREPARED_DIRECT': 'Подготовлен',
        'SHIPPED_DIRECT': 'Отгружен',
        'CONSOLIDATED': 'Консолидирован в лоте',
        'AWAITING_RETURN': 'Ожидает приемки (ВП)',
        'ACCEPTED_RETURN': 'Принят (ВП)',
        'SORTED_RETURN': 'Отсортирован (ВП)',
        'KEEPED_RETURN': 'На хранении (ВП)',
        'PREPARED_RETURN': 'Подготовлен (ВП)',
        'SHIPPED_RETURN': 'Отгружен (ВП)',
        'CANCELLED': 'Отменен',
        'DELETED': 'Удален'
    };

    //! Форматирование даты и времени
    function formatDateTime(isoString) {
        if (!isoString) return { date: null, time: null };
        try {
            const d = new Date(isoString);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');
            return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}:${seconds}` };
        } catch {
            return { date: null, time: null };
        }
    }

    //! Рендеринг таблицы sortables для выбранной ячейки
    function renderSortablesTable(cellName) {
        const wrapper = document.querySelector('.tpi-util--sortables-table-wrapper');
        const tbody = document.querySelector('.tpi-util--sortables-tbody');
        if (!wrapper || !tbody) return;

        const data = CELL_DATA_CACHE.get(cellName);
        if (!data || !data.content || data.content.length === 0) {
            tbody.innerHTML = `<tr><td colspan="18" style="text-align:center;padding:20px;">Нет данных для отображения</td></tr>`;
            return;
        }

        function getStatusIconAttrs(stageSystemName) {
            const map = {
                'FIRST_ACCEPT_DIRECT': { extendedStatus: 'first-accept-complete', direction: 'forward' },
                'FIRST_ACCEPT_RETURN': { extendedStatus: 'first-accept-complete', direction: 'return' },
                'FINAL_ACCEPT_DIRECT': { extendedStatus: 'second-accept-complete', direction: 'forward' },
                'FINAL_ACCEPT_RETURN': { extendedStatus: 'second-accept-complete', direction: 'return' },
                'PRE_SORTED_DIRECT': { extendedStatus: 'predsort-complete', direction: 'forward' },
                'PRE_SORTED_RETURN': { extendedStatus: 'predsort-complete', direction: 'return' },
                'AWAITING_DIRECT': { extendedStatus: 'waiting-accept', direction: 'forward' },
                'AWAITING_RETURN': { extendedStatus: 'waiting-accept', direction: 'return' },
                'KEEPED_DIRECT': { extendedStatus: 'on-hran', direction: 'forward' },
                'KEEPED_RETURN': { extendedStatus: 'on-hran', direction: 'return' },
                'AWAITING_ACCEPTANCE_BY_COURIER_DIRECT': { extendedStatus: 'awaiting-courier-accept', direction: 'any' },
                'CONSOLIDATED': { extendedStatus: 'consolidated', direction: 'any' },
                'DELETED': { extendedStatus: 'deleted', direction: 'any' },
                'CANCELLED': { extendedStatus: 'canceled', direction: 'any' },
                'LABEL_CREATED_DIRECT': { extendedStatus: 'lot-created', direction: 'any' },
                'SORTING_IN_LOT_DIRECT': { extendedStatus: 'lot-filling', direction: 'forward' },
                'SORTING_IN_LOT_RETURN': { extendedStatus: 'lot-filling', direction: 'return' },
                'PACKED_KEEPED_DIRECT': { extendedStatus: 'lot-packed-for-hran', direction: 'any' },
                'NOT_ACCEPTED_BY_COURIER_DIRECT': { extendedStatus: 'not-accept-by-courier', direction: 'any' },
                'PREPARED_DIRECT': { extendedStatus: 'loaded-in-vehicle', direction: 'any' },
                'SHIPPED_DIRECT': { extendedStatus: 'shipped', direction: 'forward' },
                'SHIPPED_RETURN': { extendedStatus: 'shipped', direction: 'return' },
                'SHIPPED_DIRECT_REPLACED': { extendedStatus: 'shipped-and-replaced', direction: 'forward' },
                'SHIPPED_RETURN_REPLACED': { extendedStatus: 'shipped-and-replaced', direction: 'return' },
                'SORTED_DIRECT': { extendedStatus: 'ready-to-shipment', direction: 'forward' },
                'SORTED_RETURN': { extendedStatus: 'ready-to-shipment', direction: 'return' }
            };
            return map[stageSystemName] || { extendedStatus: 'second-accept-complete', direction: 'forward' };
        }

        const sortedContent = [...data.content].sort((a, b) => {
            const aIsFinal = a.stageSystemName === 'FINAL_ACCEPT_DIRECT' || a.stageSystemName === 'FINAL_ACCEPT_RETURN';
            const bIsFinal = b.stageSystemName === 'FINAL_ACCEPT_DIRECT' || b.stageSystemName === 'FINAL_ACCEPT_RETURN';
            if (aIsFinal && !bIsFinal) return -1;
            if (!aIsFinal && bIsFinal) return 1;
            return 0;
        });

        tbody.innerHTML = '';
        for (const item of sortedContent) {
            const tr = document.createElement('tr');
            tr.className = 'tpi-util--sortables-tr';

            const sortableId = item.sortableId || '';
            const sortableBarcode = item.sortableBarcode || '';
            const groupCode = item.groupCode || '';
            const sortableType = sortableTypeMap[item.sortableType] || item.sortableType || 'null';
            const stageSystemName = item.stageSystemName || '';
            const stageDisplayName = item.stageDisplayName || '';
            const status = statusMap[item.status] || item.status || 'null';
            const parentBarcode = item.parentBarcode || '';
            const innerCount = item.innerCount || '';
            const cellNameField = item.cellName || '';
            const cellAddress = item.cellAddress || '';
            const inboundExternalId = item.inboundExternalId || '';
            const outboundExternalId = item.outboundExternalId || '';
            const courierName = item.courierName || '';
            const warehouseReturn = item.warehouseReturn || '';
            const readableName = item.groupingDirections?.[0]?.readableName || '';

            const createdAt = formatDateTime(item.createdAt);
            const arrivedDateTime = formatDateTime(item.arrivedDateTime);
            const shippedDateTime = formatDateTime(item.shippedDateTime);

            // Добавляем data-атрибуты
            tr.dataset.sortableId = sortableId;
            tr.dataset.sortableBarcode = sortableBarcode;
            tr.dataset.orderId = groupCode || sortableBarcode;
            tr.dataset.stageSystemName = stageSystemName;
            tr.dataset.warehouseReturn = warehouseReturn;

            const createLink = (id, url, icon) => {
                if (!id) {
                    return /*html*/`<div class="tpi-util--sortables-td-data-wrapper">
                                <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="null">
                                    <p class="tpi-util--sortables-null">null</p>
                                </div>
                            </div>`;
                }
                return /*html*/`<div class="tpi-util--sortables-td-data-wrapper">
                            <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="sortableId">
                                <a class="tpi-util--sortables-data-item-link" href="${url}" target="_blank">
                                    ${icon ? `<icon>${icon}</icon>` : ''}
                                    <p>${id}</p>
                                </a>
                            </div>
                        </div>`;
            };

            const renderText = (value) => {
                if (!value) {
                    return /*html*/`<div class="tpi-util--sortables-td-data-wrapper">
                                <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="null">
                                    <p class="tpi-util--sortables-null">null</p>
                                </div>
                            </div>`;
                }
                return /*html*/`<div class="tpi-util--sortables-td-data-wrapper">
                            <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="text">
                                <p class="tpi-util--sortables-data">${value}</p>
                            </div>
                        </div>`;
            };

            const renderDateTimePair = (dateObj, fieldId) => {
                const dateValue = dateObj.date || null;
                const timeValue = dateObj.time || null;

                let dateHtml;
                if (dateValue) {
                    dateHtml = /*html*/`
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="${fieldId}" tpi-util-table-data-anchor="Date">
                            <icon>${tpi_util_icon_calendar}</icon>
                            <p class="tpi-util--sortables-data">${dateValue}</p>
                        </div>
                    `;
                } else {
                    dateHtml = /*html*/`
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="${fieldId}" tpi-util-table-data-anchor="Date">
                            <p class="tpi-util--sortables-null">null</p>
                        </div>
                    `;
                }

                let timeHtml;
                if (timeValue) {
                    timeHtml = /*html*/`
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="${fieldId}" tpi-util-table-data-anchor="Time">
                            <icon>${tpi_util_icon_clock}</icon>
                            <p class="tpi-util--sortables-data">${timeValue}</p>
                        </div>
                    `;
                } else {
                    timeHtml = /*html*/`
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="${fieldId}" tpi-util-table-data-anchor="Time">
                            <p class="tpi-util--sortables-null">null</p>
                        </div>
                    `;
                }

                return /*html*/`
                    <div class="tpi-util--sortables-td-data-wrapper tpi-util--sortables-time-section">
                        ${dateHtml}
                        ${timeHtml}
                    </div>
                `;
            };

            const iconAttrs = getStatusIconAttrs(stageSystemName);

            tr.innerHTML = /*html*/`
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-actions">
                            <button class="tpi-util--sortables-action-button" tpi-util-action="copy">
                                <icon class="tpi-util--sortables-action-icon">${tpi_util_icon_copy}</icon>
                            </button>
                            <button class="tpi-util--sortables-action-button" tpi-util-action="copyMono">
                                <icon class="tpi-util--sortables-action-icon">${tpi_util_icon_copyMono}</icon>
                            </button>
                            <button class="tpi-util--sortables-action-button" tpi-util-action="scanDownload">
                                <icon class="tpi-util--sortables-action-icon">${tpi_util_icon_scanDownload}</icon>
                            </button>
                            <button class="tpi-util--sortables-action-button" tpi-util-action="copySortable">
                                <icon class="tpi-util--sortables-action-icon">${tpi_util_icon_copySortable}</icon>
                            </button>
                        </div>
                        ${createLink(sortableBarcode, `https://logistics.market.yandex.ru/sorting-center/21972131/sortables/${sortableId}`)}
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    ${createLink(groupCode || sortableBarcode, `https://logistics.market.yandex.ru/sorting-center/21972131/orders/${groupCode || sortableBarcode}`)}
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="type">
                            <p class="tpi-util--sortables-data">${sortableType}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="stageSystemName" tpi-tooltip-data="${stageDisplayName}">
                            <icon class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="${iconAttrs.extendedStatus}" tpi-sto-status-direction="${iconAttrs.direction}"></icon>
                            <p class="tpi-util--sortables-data">${stageDisplayName}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="status">
                            <p class="tpi-util--sortables-data">${status}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    ${createLink(parentBarcode, `https://logistics.market.yandex.ru/sorting-center/21972131/sortables/${parentBarcode}`)}
                </td>
                <td class="tpi-util--sortables-td">
                    ${createLink(innerCount, `https://logistics.market.yandex.ru/sorting-center/21972131/sortables/${innerCount}`)}
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="cellName">
                            <p class="tpi-util--sortables-data">${cellNameField}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="cellAdress">
                            <p class="tpi-util--sortables-data">${cellAddress}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="null">
                            <p class="tpi-util--sortables-null">null</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="inboundExternalId">
                            ${createLink(inboundExternalId, `https://sorting-center.logistics.yandex.ru/sorting-center/21972131/inbounds?externalIdQuery=${inboundExternalId}`, tpi_util_icon_inbound)}
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="outboundExternalId">
                            ${createLink(outboundExternalId, `https://logistics.market.yandex.ru/sorting-center/21972131/outbounds?query=${outboundExternalId}`, tpi_util_icon_outbound)}
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="courierName">
                            <p class="tpi-util--sortables-data">${courierName}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    <div class="tpi-util--sortables-td-data-wrapper">
                        <div class="tpi-util--sortables-data-item" tpi-util-table-data-id="warehouseReturn" tpi-tooltip-data="${warehouseReturn}">
                            <p class="tpi-util--sortables-data">${warehouseReturn}</p>
                        </div>
                    </div>
                </td>
                <td class="tpi-util--sortables-td">
                    ${renderText(readableName)}
                </td>
                <td class="tpi-util--sortables-td">
                    ${renderDateTimePair(createdAt, 'createdAt')}
                </td>
                <td class="tpi-util--sortables-td">
                    ${renderDateTimePair(arrivedDateTime, 'arrivedDateTime')}
                </td>
                <td class="tpi-util--sortables-td">
                    ${renderDateTimePair(shippedDateTime, 'shippedDateTime')}
                </td>
            `;
            tbody.appendChild(tr);
        }

        // После обновления таблицы пересоздаём информационный блок для текущей выбранной ячейки
        const selectedContainer = document.querySelector('.tpi-util--cell-container[tpi-card-selected]');
        if (selectedContainer) {
            createSelectedInfoBlock(selectedContainer.dataset.cellName);
        }
    }

    function setupSortablesActions() {
        const wrapper = document.querySelector('.tpi-util--sortables-table-wrapper');
        if (!wrapper) return;
        if (wrapper._actionsHandlerAdded) return;
        wrapper._actionsHandlerAdded = true;

        wrapper.addEventListener('click', function(e) {
            const button = e.target.closest('.tpi-util--sortables-action-button');
            if (!button) return;

            const action = button.getAttribute('tpi-util-action');
            if (!action) return;

            const tr = button.closest('.tpi-util--sortables-tr');
            if (!tr) return;

            const sortableBarcode = tr.dataset.sortableBarcode || '';
            const orderId = tr.dataset.orderId || '';
            const sortableId = tr.dataset.sortableId || '';

            switch (action) {
                case 'copy':
                    if (orderId && sortableBarcode) {
                        const text = `${orderId} (${sortableBarcode})`;
                        navigator.clipboard.writeText(text).then(() => {
                            if (typeof tpiNotification !== 'undefined') {
                                tpiNotification.show('Скопировано', 'success', `Скопировано: ${text}`);
                            }
                        }).catch(() => {
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                        });
                    }
                    break;

                case 'copyMono':
                    if (orderId && sortableBarcode) {
                        const text = `\`${orderId}\` (\`${sortableBarcode}\`)`;
                        navigator.clipboard.writeText(text).then(() => {
                            if (typeof tpiNotification !== 'undefined') {
                                tpiNotification.show('Скопировано', 'success', `Скопировано: ${text}`);
                            }
                        }).catch(() => {
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                        });
                    }
                    break;

                case 'copySortable':
                    if (sortableBarcode) {
                        navigator.clipboard.writeText(sortableBarcode).then(() => {
                            if (typeof tpiNotification !== 'undefined') {
                                tpiNotification.show('Скопировано', 'success', `Скопирован код: ${sortableBarcode}`);
                            }
                        }).catch(() => {
                            const textarea = document.createElement('textarea');
                            textarea.value = sortableBarcode;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                        });
                    }
                    break;

                case 'scanDownload':
                    if (sortableId) {
                        const url = `https://logistics.market.yandex.ru/api/sorting-center/21972131/sortable/scanlog?sortableId=${sortableId}`;
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `scanlog_${sortableId}.log`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    //! Вспомогательная функция для поиска контейнера по атрибутам (STL или PLT)
    function findContainerByAttributes(container) {
        const type = container.getAttribute('tpi-cell-type');
        if (type === 'STL') {
            const alley = container.getAttribute('tpi-alley-number');
            const section = container.getAttribute('tpi-alley-section');
            const level = container.getAttribute('tpi-alley-level');
            return document.querySelector(
                `[tpi-cell-type="STL"][tpi-alley-number="${alley}"][tpi-alley-section="${section}"][tpi-alley-level="${level}"]`
            );
        } else if (type === 'PLT') {
            const row = container.getAttribute('tpi-row');
            const col = container.getAttribute('tpi-col');
            return document.querySelector(
                `[tpi-cell-type="PLT"][tpi-row="${row}"][tpi-col="${col}"]`
            );
        }
        return null;
    }

    //! Рендеринг STL стеллажа
    function renderSTL(shelfData, tbody) {
        tbody.innerHTML = '';
        const cells = shelfData.cells;
        const alley = shelfData.alley;

        for (let level = 1; level <= 3; level++) {
            const tr = document.createElement('tr');
            tr.className = 'tpi-util--cell-table-tr';

            for (let section = 1; section <= 6; section++) {
                const td = document.createElement('td');
                td.className = 'tpi-util--cell-table-td';

                const cellNumber = `STL-${alley}-${level}-${section}`;
                const data = CELL_DATA_CACHE.get(cellNumber) || { totalElements: 0, utilCount: 0 };
                td.innerHTML = createCellHtml(cellNumber, data);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }

    //! Рендеринг PLT
    function renderPLT(shelfData, tbody) {
        tbody.innerHTML = '';
        // Копируем и сортируем ячейки: сначала все с row=1, затем row=2
        const cells = [...shelfData.cells].sort((a, b) => a.rowNumber - b.rowNumber);
        const totalCells = cells.length;
        if (totalCells === 0) return;

        const rows = 2;
        const cols = Math.ceil(totalCells / rows);
        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            tr.className = 'tpi-util--cell-table-tr';
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                const td = document.createElement('td');
                td.className = 'tpi-util--cell-table-td';
                if (idx < totalCells) {
                    const cell = cells[idx];
                    const data = CELL_DATA_CACHE.get(cell.number) || { totalElements: 0, utilCount: 0 };
                    td.innerHTML = createCellHtml(cell.number, data);
                } else {
                    td.innerHTML = `<div class="tpi-util--cell-container" tpi-cell-state="empty" tpi-cell-type="PLT" style="opacity:0;pointer-events:none;"></div>`;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
}

    function updateNavigation(container, currentIndex, totalShelves, renderCallback) {
        const nav = container.querySelector('.tpi-util--cell-table-control-nav');
        if (!nav) return;
        nav.innerHTML = '';
        for (let i = 0; i < totalShelves; i++) {
            const span = document.createElement('span');
            if (i === currentIndex) span.setAttribute('tpi-selected-slide', '');
            span.addEventListener('click', () => {
                renderCallback(i);
            });
            nav.appendChild(span);
        }
    }

    //! Рендеринг карты для обоих типов (STL и PLT)
    function renderMap(overlay, type, isLoading = false) {
        const tbody = overlay.querySelector(`.tpi-util--map[tpi-table-map-type="${type}"] .tpi-util--map-tbody`);
        if (!tbody) return;
        tbody.innerHTML = '';

        if (type === 'STL') {
            for (let level = 1; level <= 3; level++) {
                const tr = document.createElement('tr');
                tr.className = 'tpi-util--map-tr';
                for (let alley = 1; alley <= 5; alley++) {
                    for (let section = 1; section <= 6; section++) {
                        const td = document.createElement('td');
                        td.className = 'tpi-util--map-td';
                        const span = document.createElement('span');
                        span.className = 'tpi-util--map-marker';
                        span.setAttribute('tpi-cell-type', 'STL');
                        span.setAttribute('tpi-alley-number', alley);
                        span.setAttribute('tpi-alley-section', section);
                        span.setAttribute('tpi-alley-level', level);
                        span.setAttribute('tpi-tooltip-data', `Ячейка: STL-${alley}-${level}-${section}`);
                        const state = isLoading ? 'loading' : 'empty';
                        span.setAttribute('tpi-marker-state', state);
                        if (!isLoading) {
                            const cellNumber = `STL-${alley}-${level}-${section}`;
                            const data = CELL_DATA_CACHE.get(cellNumber) || { totalElements: 0, utilCount: 0 };
                            if (data.totalElements > 0 || data.utilCount > 0) {
                                span.setAttribute('tpi-marker-state', data.utilCount > 0 ? 'util' : 'data');
                            }
                        }
                        td.appendChild(span);
                        tr.appendChild(td);
                    }
                }
                tbody.appendChild(tr);
            }
        } else if (type === 'PLT') {
            for (let row = 1; row <= 2; row++) {
                const tr = document.createElement('tr');
                tr.className = 'tpi-util--map-tr';
                for (let idx = 1; idx <= 14; idx++) {
                    const td = document.createElement('td');
                    td.className = 'tpi-util--map-td';
                    const span = document.createElement('span');
                    span.className = 'tpi-util--map-marker';
                    span.setAttribute('tpi-cell-type', 'PLT');
                    span.setAttribute('tpi-row', row);
                    span.setAttribute('tpi-col', idx);
                    span.setAttribute('tpi-tooltip-data', `Ячейка: PLT-${row}-${idx}`);
                    const state = isLoading ? 'loading' : 'empty';
                    span.setAttribute('tpi-marker-state', state);
                    if (!isLoading) {
                        const cellNumber = `PLT-${row}-${idx}`;
                        const data = CELL_DATA_CACHE.get(cellNumber) || { totalElements: 0, utilCount: 0 };
                        if (data.totalElements > 0 || data.utilCount > 0) {
                            span.setAttribute('tpi-marker-state', data.utilCount > 0 ? 'util' : 'data');
                        }
                    }
                    td.appendChild(span);
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
        }
    }

    //! Обновление статистики с учётом STL и PLT
    function updateStats(overlay) {
        let totalData = 0;
        let totalUtil = 0;
        let totalEmpty = 0;
        let totalOrders = 0;
        let totalUtilItems = 0;
        const totalCells = 90 + 30;

        for (const [cellName, data] of CELL_DATA_CACHE) {
            totalOrders += data.totalElements;
            totalUtilItems += data.utilCount;
            if (data.totalElements > 0 || data.utilCount > 0) {
                if (data.utilCount > 0) {
                    totalUtil++;
                } else {
                    totalData++;
                }
            } else {
                totalEmpty++;
            }
        }

        function animateProgressBlock(blockSelector, targetValue, totalCount, color) {
            const block = overlay.querySelector(blockSelector);
            if (!block) return;
            const valueEl = block.querySelector('.tpi-util--info-section-value');
            const progressEl = block.querySelector('.tpi-util--info-section-progress');
            if (!valueEl || !progressEl) return;
            const ring = progressEl.querySelector('.tpi-util--icon-main-ring');
            const text = progressEl.querySelector('.tpi-util--icon-value');
            if (!ring || !text) return;

            const circumference = 574.62;
            const targetPercent = totalCount > 0 ? (targetValue / totalCount) * 100 : 0;

            const startTime = performance.now();
            const duration = 1500;

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                let progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = targetValue * eased;
                const currentPercent = targetPercent * eased;

                valueEl.textContent = Math.round(currentValue);
                text.textContent = Math.round(currentPercent) + '%';
                const dashOffset = circumference - (circumference * currentPercent / 100);
                ring.style.strokeDashoffset = dashOffset + 'px';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    valueEl.textContent = targetValue;
                    text.textContent = Math.round(targetPercent) + '%';
                    ring.style.strokeDashoffset = (circumference - (circumference * targetPercent / 100)) + 'px';
                }
            }
            requestAnimationFrame(animate);
        }

        animateProgressBlock('[tpi-info-section-type="data"]', totalData, totalCells, '#8fd199');
        animateProgressBlock('[tpi-info-section-type="util"]', totalUtil, totalCells, '#9fafff');
        animateProgressBlock('[tpi-info-section-type="empty"]', totalEmpty, totalCells, '#b3b3b3');

        const ordersSpan = overlay.querySelector('[tpi-info-section-type="data"] .tpi-util--info-section-data-title span');
        const utilSpan = overlay.querySelector('[tpi-info-section-type="util"] .tpi-util--info-section-data-title span');
        animateValue(ordersSpan, 0, totalOrders, 1500);
        animateValue(utilSpan, 0, totalUtilItems, 1500);
    }

    function animateValue(element, start, end, duration) {
        if (!element) return;
        const startTime = performance.now();
        const isInteger = Number.isInteger(end);

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;
            element.textContent = isInteger ? Math.round(current) : current.toFixed(1);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = isInteger ? end : end.toFixed(1);
            }
        }
        requestAnimationFrame(update);
    }

    

    function setHideSortablesWrapper(value){
        document.querySelector('.tpi-util--sortables-table-wrapper').style.display = value
    }

    function setWrapperJustify(value) {
        document.querySelector('.tpi-util--cell-table-wrapper').style.justifyContent = value;
    }

    function util__cardClick(renderFn) {
        const wrapper = document.querySelector('.tpi-util--cell-table-wrapper');
        if (!wrapper) return;
        if (wrapper._cardClickHandlerAdded) return;
        wrapper._cardClickHandlerAdded = true;

        let animationTimer = null;

        function setDisabledAll() {
            document.querySelectorAll('.tpi-util--cell-container').forEach(el => {
                el.setAttribute('disabled', '');
            });
        }

        function removeDisabledAll() {
            document.querySelectorAll('.tpi-util--cell-container').forEach(el => {
                el.removeAttribute('disabled');
            });
        }

        function hideOtherRowsAndCells(currentTr, currentTd) {
            document.querySelectorAll('.tpi-util--cell-table-tr').forEach(tr => {
                if (tr !== currentTr) {
                    tr.style.display = 'none';
                } else {
                    tr.style.display = '';
                }
            });
            currentTr.querySelectorAll('.tpi-util--cell-table-td').forEach(td => {
                if (td !== currentTd) {
                    td.style.display = 'none';
                } else {
                    td.style.display = 'table-cell';
                }
            });
        }

        function updateMapMarker(container) {
            const allMarkers = document.querySelectorAll('.tpi-util--map-marker');
            allMarkers.forEach(marker => marker.removeAttribute('tpi-marker-selected'));
            if (container) {
                const type = container.getAttribute('tpi-cell-type');
                if (type === 'STL') {
                    const alley = container.getAttribute('tpi-alley-number');
                    const section = container.getAttribute('tpi-alley-section');
                    const level = container.getAttribute('tpi-alley-level');
                    const targetMarker = document.querySelector(
                        `.tpi-util--map-marker[tpi-cell-type="STL"][tpi-alley-number="${alley}"][tpi-alley-section="${section}"][tpi-alley-level="${level}"]`
                    );
                    if (targetMarker) targetMarker.setAttribute('tpi-marker-selected', '');
                } else if (type === 'PLT') {
                    const row = container.getAttribute('tpi-row');
                    const col = container.getAttribute('tpi-col');
                    const targetMarker = document.querySelector(
                        `.tpi-util--map-marker[tpi-cell-type="PLT"][tpi-row="${row}"][tpi-col="${col}"]`
                    );
                    if (targetMarker) targetMarker.setAttribute('tpi-marker-selected', '');
                }
            }
        }

        function setControlInert(inert) {
            const controlSection = document.querySelector('.tpi-util--cell-table-control-section');
            if (controlSection) {
                if (inert) {
                    controlSection.setAttribute('inert', '');
                } else {
                    controlSection.removeAttribute('inert');
                }
            }
        }

        function handleContainerClick(event) {
            const container = event.target.closest('.tpi-util--cell-container');
            if (!container) return;
            if (event.target.closest('a')) return;

            if (container.getAttribute('tpi-cell-state') === 'empty') {
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show('Ошибка', 'error', 'Нельзя отобразить данные о <span>пустой</span> ячейке');
                }
                return;
            }

            const isSelected = container.hasAttribute('tpi-card-selected');

            if (isSelected) {
                container.removeAttribute('tpi-card-selected');
                window._tpiSelectedContainer = null;
                if (animationTimer) {
                    clearTimeout(animationTimer);
                    animationTimer = null;
                }
                removeSelectedInfoBlock();
                if (typeof renderFn === 'function') {
                    renderFn();
                }
                setDisabledAll();
                setTimeout(() => {
                    removeDisabledAll();
                    updateMapMarker(null);
                    setControlInert(false);
                    setWrapperJustify('center');
                    setHideSortablesWrapper('none');
                }, 50);
                return;
            }

            if (window._tpiSelectedContainer) {
                const oldContainer = window._tpiSelectedContainer;
                oldContainer.removeAttribute('tpi-card-selected');
                oldContainer.setAttribute('disabled', '');
                window._tpiSelectedContainer = null;
                if (animationTimer) {
                    clearTimeout(animationTimer);
                    animationTimer = null;
                }
                removeSelectedInfoBlock();
                if (typeof renderFn === 'function') {
                    renderFn();
                }
                setDisabledAll();
                setTimeout(() => {
                    removeDisabledAll();
                    updateMapMarker(null);
                    setControlInert(false);
                    setWrapperJustify('center');
                    setHideSortablesWrapper('none');
                    const newContainer = findContainerByAttributes(container);
                    if (newContainer) {
                        setTimeout(() => {
                            newContainer.click();
                        }, 210);
                    }
                }, 210);
                return;
            }

            container.setAttribute('tpi-card-selected', '');
            window._tpiSelectedContainer = container;

            const currentTd = container.closest('.tpi-util--cell-table-td');
            if (!currentTd) return;
            const currentTr = currentTd.closest('.tpi-util--cell-table-tr');
            if (!currentTr) return;

            setDisabledAll();
            setTimeout(() => {
                container.removeAttribute('disabled');
            }, 210);

            animationTimer = setTimeout(() => {
                hideOtherRowsAndCells(currentTr, currentTd);
                animationTimer = null;
                updateMapMarker(container);
                setControlInert(true);
                setWrapperJustify('flex-start');
                setHideSortablesWrapper('flex');
                renderSortablesTable(container.dataset.cellName);
                // Инфоблок создаётся внутри renderSortablesTable
            }, 210);
        }

        wrapper.addEventListener('click', handleContainerClick);
    }

    //! Основная инициализация с поддержкой двух типов
    async function initUtilData(overlay) {
        const token = await waitForToken();
        if (!token) {
            overlay.querySelector('.tpi-util--cell-table-wrapper').innerHTML = '<p>Токен не получен</p>';
            return;
        }

        const { stlShelves, pltShelves } = generateAllData();

        const allStlLoad = stlShelves.map(shelf => loadShelfData(shelf, token));
        const allPltLoad = pltShelves.map(shelf => loadShelfData(shelf, token));
        await Promise.all([...allStlLoad, ...allPltLoad]);

        let activeType = 'STL';
        let shelves = stlShelves;
        let currentIndex = 0;

        const wrapper = overlay.querySelector('.tpi-util--cell-table-wrapper');
        const stlTable = wrapper.querySelector('[tpi-table-type="STL"]');
        const pltTable = wrapper.querySelector('[tpi-table-type="PLT"]');
        const stlTbody = stlTable.querySelector('.tpi-util--cell-table-tbody');
        const pltTbody = pltTable.querySelector('.tpi-util--cell-table-tbody');
        const leftBtn = overlay.querySelector('[tpi-util-move="left"]');
        const rightBtn = overlay.querySelector('[tpi-util-move="right"]');
        const toggle = overlay.querySelector('#tpi-util--toggle-table-type');

        function renderTable(index) {
            const shelf = shelves[index];
            if (!shelf) return;
            if (activeType === 'STL') {
                renderSTL(shelf, stlTbody);
                stlTable.style.display = '';
                pltTable.style.display = 'none';
                stlTable.removeAttribute('tpi-visibility-state')
                pltTable.setAttribute('tpi-visibility-state', 'disabled')
            } else {
                renderPLT(shelf, pltTbody);
                pltTable.style.display = '';
                stlTable.style.display = 'none';
                pltTable.removeAttribute('tpi-visibility-state')
                stlTable.setAttribute('tpi-visibility-state', 'disabled')
            }
            updateNavigation(overlay, index, shelves.length, renderTable);
            if (window._tpiSelectedContainer) {
                window._tpiSelectedContainer.removeAttribute('tpi-card-selected');
                window._tpiSelectedContainer = null;
            }
            document.querySelectorAll('.tpi-util--cell-container').forEach(el => {
                el.removeAttribute('disabled');
            });
            document.querySelectorAll('.tpi-util--map-marker').forEach(marker => {
                marker.removeAttribute('tpi-marker-selected');
            });
            const controlSection = document.querySelector('.tpi-util--cell-table-control-section');
            if (controlSection) controlSection.removeAttribute('inert');
        }

        toggle.addEventListener('change', function() {
            const checked = this.checked;
            activeType = checked ? 'PLT' : 'STL';
            shelves = activeType === 'STL' ? stlShelves : pltShelves;
            currentIndex = 0;
            setWrapperJustify('center')
            setHideSortablesWrapper('none')
            if (window._tpiSelectedContainer) {
                window._tpiSelectedContainer.removeAttribute('tpi-card-selected');
                window._tpiSelectedContainer = null;
            }
            document.querySelectorAll('.tpi-util--cell-container').forEach(el => {
                el.removeAttribute('disabled');
            });
            document.querySelectorAll('.tpi-util--map-marker').forEach(marker => {
                marker.removeAttribute('tpi-marker-selected');
            });
            const controlSection = document.querySelector('.tpi-util--cell-table-control-section');
            if (controlSection) controlSection.removeAttribute('inert');
            renderTable(0);
        });

        leftBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderTable(currentIndex);
            }
        });
        rightBtn.addEventListener('click', () => {
            if (currentIndex < shelves.length - 1) {
                currentIndex++;
                renderTable(currentIndex);
            }
        });

        renderMap(overlay, 'STL', false);
        renderMap(overlay, 'PLT', false);
        const stlMap = overlay.querySelector('.tpi-util--map[tpi-table-map-type="STL"]');
        const pltMap = overlay.querySelector('.tpi-util--map[tpi-table-map-type="PLT"]');
        stlMap.style.display = '';
        pltMap.style.display = '';

        renderTable(0);
        setupSortablesActions();
        util__cardClick(() => renderTable(currentIndex));

        updateStats(overlay);
    }

    function createSelectedInfoBlock(cellName) {
        const wrapper = document.querySelector('.tpi-util--cell-table-selected-wrapper');
        if (!wrapper) return;

        const oldBlock = wrapper.querySelector('.tpi-util--cell-table-selected-info-wrapper');
        if (oldBlock) oldBlock.remove();

        const tbody = document.querySelector('.tpi-util--sortables-tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('.tpi-util--sortables-tr');

        const warehouseSet = new Set();
        rows.forEach(tr => {
            const val = tr.dataset.warehouseReturn || '';
            if (val && val !== 'Склад СЦ Яндекс Маркет Тарный') {
                warehouseSet.add(val);
            }
        });
        const uniqueWarehouses = Array.from(warehouseSet);


        const block = document.createElement('div');
        block.className = 'tpi-util--cell-table-selected-info-wrapper';
        block.innerHTML = /*html*/`
            <div class="tpi-util--cell-table-selected-info-item">
                <button class="tpi-util--cell-table-selected-button" tpi-tooltip-data="Копировать все заказы" tpi-util-info-btn-action="copy" tpi-util-info-btn-type="default">
                    <icon>${tpi_util_icon_info_copy}</icon>
                </button>
                <button class="tpi-util--cell-table-selected-button" tpi-tooltip-data="Копировать все заказы в формате моно" tpi-util-info-btn-action="copyMono" tpi-util-info-btn-type="default">
                    <icon>${tpi_util_icon_info_copyMono}</icon>
                </button>
                <button class="tpi-util--cell-table-selected-button" tpi-tooltip-data="Копировать весь утиль" tpi-util-info-btn-action="copy" tpi-util-info-btn-type="util">
                    <icon>${tpi_util_icon_info_copy}</icon>
                </button>
                <button class="tpi-util--cell-table-selected-button" tpi-tooltip-data="Копировать весь утиль моно" tpi-util-info-btn-action="copyMono" tpi-util-info-btn-type="util">
                    <icon>${tpi_util_icon_info_copyMono}</icon>
                </button>
            </div>
            <div class="tpi-util--cell-table-selected-info-item">
                <div class="tpi-util--info-merch-wrapper">
                    <div class="tpi-util--info-merch-wrapper-title">Список мерчей:</div>
                    <ul class="tpi-util--info-merch-ul">
                        ${uniqueWarehouses.map((name, index) => `
                            <li class="tpi-util--info-merch-item">
                                <div class="tpi-util--info-merch-item-index">${index + 1}</div>
                                <div class="tpi-util--info-merch-item-name" tpi-tooltip-data="${name}">${name}</div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;

        wrapper.appendChild(block);

        block.querySelectorAll('.tpi-util--cell-table-selected-button').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('tpi-util-info-btn-action');
                const type = this.getAttribute('tpi-util-info-btn-type');
                handleInfoButtonClick(action, type);
            });
        });
    }

    //! функция removeSelectedInfoBlock
    function removeSelectedInfoBlock() {
        const wrapper = document.querySelector('.tpi-util--cell-table-selected-wrapper');
        if (!wrapper) return;
        const block = wrapper.querySelector('.tpi-util--cell-table-selected-info-wrapper');
        if (block) block.remove();
    }

    //! функция handleInfoButtonClick
    function handleInfoButtonClick(action, type) {
        const tbody = document.querySelector('.tpi-util--sortables-tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('.tpi-util--sortables-tr');
        let items = [];
        rows.forEach(tr => {
            const stage = tr.dataset.stageSystemName || '';
            if (type === 'util' && stage !== 'FINAL_ACCEPT_DIRECT') return;
            const orderId = tr.dataset.orderId || '';
            const barcode = tr.dataset.sortableBarcode || '';
            if (orderId && barcode) {
                items.push(`${orderId} (${barcode})`);
            } else if (orderId) {
                items.push(orderId);
            } else if (barcode) {
                items.push(barcode);
            }
        });

        if (items.length === 0) {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Нет данных для копирования', 'error', '');
            }
            return;
        }

        const text = items.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            if (typeof tpiNotification !== 'undefined') {
                tpiNotification.show('Скопировано', 'success', `Скопировано ${items.length} записей`);
            }
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }

    function addUtilBlock() {
        if (document.querySelector('.tpi-util--wrapper')) return;

        document.title = 'Контроль утиля';

        const overlay = document.createElement('div');
        overlay.className = 'tpi-util--wrapper';
        overlay.innerHTML = /*html*/`
            <div class="tpi-tooltip-by-sheva_r6"></div>
            <div class="tpi-util--wrapper-title">Контроль утиля</div>
            <div class="tpi-util--content-block">
                <div class="tpi-util--section-wrapper">
                    <div class="tpi-util--section-wrapper-title">
                        <p>Состояние ячеек</p>
                    </div>
                    <div class="tpi-util--content-block">
                        <div class="tpi-util--info-section-wrapper" tpi-info-section-type="data">
                            <div class="tpi-util--info-section">
                                <div class="tpi-util--info-section-title-wrapper">
                                    <p class="tpi-util--info-section-title">Всего ячеек с заказами</p>
                                    <p class="tpi-util--info-section-value">0</p>
                                    <icon class="tpi-util--info-section-progress">
                                        <svg viewBox="-25.375 -25.375 253.75 253.75" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg)">
                                            <circle r="91.5" cx="101.5" cy="101.5" fill="transparent" stroke="#e0e0e0" stroke-width="20" class="tpi-util--icon-outer-ring"></circle>
                                            <circle r="91.5" cx="101.5" cy="101.5" stroke="#8fd199" stroke-width="30" stroke-linecap="round" stroke-dashoffset="574.62px" fill="transparent" stroke-dasharray="574.62px" class="tpi-util--icon-main-ring"></circle>
                                        </svg>
                                        <p class="tpi-util--icon-value">0%</p>
                                    </icon>
                                </div>
                                <div class="tpi-util--info-section-data-wrapper">
                                    <p class="tpi-util--info-section-data-title">Всего заказов в ячейках: <span>0</span></p>
                                </div>
                            </div>
                        </div>
                        <div class="tpi-util--info-section-wrapper" tpi-info-section-type="util">
                            <div class="tpi-util--info-section">
                                <div class="tpi-util--info-section-title-wrapper">
                                    <p class="tpi-util--info-section-title">Всего ячеек с утилём</p>
                                    <p class="tpi-util--info-section-value">0</p>
                                    <icon class="tpi-util--info-section-progress">
                                        <svg viewBox="-25.375 -25.375 253.75 253.75" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg)">
                                            <circle r="91.5" cx="101.5" cy="101.5" fill="transparent" stroke="#e0e0e0" stroke-width="20" class="tpi-util--icon-outer-ring"></circle>
                                            <circle r="91.5" cx="101.5" cy="101.5" stroke="#9fafff" stroke-width="30" stroke-linecap="round" stroke-dashoffset="574.62px" fill="transparent" stroke-dasharray="574.62px" class="tpi-util--icon-main-ring"></circle>
                                        </svg>
                                        <p class="tpi-util--icon-value">0%</p>
                                    </icon>
                                </div>
                                <div class="tpi-util--info-section-data-wrapper">
                                    <p class="tpi-util--info-section-data-title">Всего утиля в ячейках: <span>0</span></p>
                                </div>
                            </div>
                        </div>
                        <div class="tpi-util--info-section-wrapper" tpi-info-section-type="empty">
                            <div class="tpi-util--info-section">
                                <div class="tpi-util--info-section-title-wrapper">
                                    <p class="tpi-util--info-section-title">Всего пустых ячеек</p>
                                    <p class="tpi-util--info-section-value">0</p>
                                    <icon class="tpi-util--info-section-progress">
                                        <svg viewBox="-25.375 -25.375 253.75 253.75" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg)">
                                            <circle r="91.5" cx="101.5" cy="101.5" fill="transparent" stroke="#e0e0e0" stroke-width="20" class="tpi-util--icon-outer-ring"></circle>
                                            <circle r="91.5" cx="101.5" cy="101.5" stroke="#b3b3b3" stroke-width="30" stroke-linecap="round" stroke-dashoffset="574.62px" fill="transparent" stroke-dasharray="574.62px" class="tpi-util--icon-main-ring"></circle>
                                        </svg>
                                        <p class="tpi-util--icon-value">0%</p>
                                    </icon>
                                </div>
                            </div>
                        </div>
                        <div class="tpi-util--map-section-wrapper">
                            <table class="tpi-util--map" tpi-table-map-type="STL">
                                <thead class="tpi-util--map-thead">
                                    <tr class="tpi-util--map-tr">
                                        <th class="tpi-util--map-th" colspan="6">
                                            <div class="tpi-util--map-th-wrapper">
                                                <p class="tpi-util--map-th-title">Стеллаж 1</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--map-th" colspan="6">
                                            <div class="tpi-util--map-th-wrapper">
                                                <p class="tpi-util--map-th-title">Стеллаж 2</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--map-th" colspan="6">
                                            <div class="tpi-util--map-th-wrapper">
                                                <p class="tpi-util--map-th-title">Стеллаж 3</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--map-th" colspan="6">
                                            <div class="tpi-util--map-th-wrapper">
                                                <p class="tpi-util--map-th-title">Стеллаж 4</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--map-th" colspan="6">
                                            <div class="tpi-util--map-th-wrapper">
                                                <p class="tpi-util--map-th-title">Стеллаж 5</p>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="tpi-util--map-tbody"></tbody>
                            </table>
                            <table class="tpi-util--map" tpi-table-map-type="PLT">
                                <tbody class="tpi-util--map-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tpi-util--content-block">
                <div class="tpi-util--section-wrapper">
                    <div class="tpi-util--section-wrapper-title">
                        <p>Данные ячеек адресного хранения</p>
                        <label class="tpi-util--toggle-table-type-wrapper">
                            <input type="checkbox" id="tpi-util--toggle-table-type">
                            <div class="tpi-util--toggle-table-type-dot"></div>
                            <div class="tpi-util--toggle-table-type-body">
                                <p class="tpi-util--toggle-table-type-title">STL</p>
                                <p class="tpi-util--toggle-table-type-title">PLT</p>
                            </div>
                        </label>
                    </div>
                    <div class="tpi-util--cell-table-wrapper">
                        <div class="tpi-util--loader">
                            <div class="tpi-util--loader-spinner"></div>
                            <p>Загрузка данных ячеек</p>
                        </div>
                        <div class="tpi-util--cell-table-selected-wrapper ">
                            <table class="tpi-util--cell-table" tpi-table-type="STL">
                                <tbody class="tpi-util--cell-table-tbody"></tbody>
                            </table>
                            <table class="tpi-util--cell-table" tpi-table-type="PLT" style="display: none">
                                <tbody class="tpi-util--cell-table-tbody"></tbody>
                            </table>
                        </div>
                        <div class="tpi-util--sortables-table-wrapper">
                            <table class="tpi-util--sortables-table">
                                <thead class="tpi-util--sortables-thead">
                                    <tr class="tpi-util--sortables-tr">
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Код грузоместа</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Номер заказа / XDOC</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Тип грузоместа</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Расширенный статус</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Статус грузоместа</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Родительское грузоместо</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Грузоместа</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Имя ячейки</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Адрес ячейки</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Маркировка</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Номер поставки</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Номер отгрузки</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Откуда</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Куда</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Группировка</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Дата создания</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Дата приемки</p>
                                            </div>
                                        </th>
                                        <th class="tpi-util--sortables-th">
                                            <div class="tpi-util--sortables-th-data-wrapper">
                                                <p class="tpi-util--sortables-th-data">Дата отгрузки</p>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="tpi-util--sortables-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tpi-util--cell-table-control-section">
                        <button class="tpi-util--cell-table-control-button" tpi-util-move="left">
                            <icon>${tpi_util_icon_chevron_left}</icon>
                        </button>
                        <div class="tpi-util--cell-table-control-nav"></div>
                        <button class="tpi-util--cell-table-control-button" tpi-util-move="right">
                            <icon>${tpi_util_icon_chevron_right}</icon>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const appID = document.getElementById("app");
        const headerTitle = document.querySelector(".p-layout__header-wrapper");
        if (appID) appID.remove();
        if (headerTitle) headerTitle.remove();

        const content = document.querySelector(".p-layout__content");
        if (content) {
            content.appendChild(overlay);
            initUtilData(overlay);
        } else {
            const observer = new MutationObserver(() => {
                const content = document.querySelector(".p-layout__content");
                if (content) {
                    content.appendChild(overlay);
                    observer.disconnect();
                    initUtilData(overlay);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
}

    if (isUtilPage(location.href)) {
        addUtilBlock();
        return;
    }

    const observer = new MutationObserver(() => {
        if (isUtilPage(location.href)) {
            addUtilBlock();
        }
    });
    observer.observe(document, { subtree: true, childList: true });
})();