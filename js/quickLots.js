let firebaseListenerInitialized = false;
let currentPage = 1;
let pageSize = 20;
let totalLotPacks = 0;

const tpi_quickLots_id_array = {
    0: {
        cellid: '15152',
        cellName: '3 - LIPETSK',
        dirrection: 'СЦ МК Липецк',
        type: 'Отгрузка'
    },
    1: {
        cellid: '15156',
        cellName: '2 - KURSK',
        dirrection: 'СЦ МК Курск',
        type: 'Отгрузка'
    },
    2: {
        cellid: '688839',
        cellName: '1 - BELGOROD',
        dirrection: 'СЦ МК Белгород',
        type: 'Отгрузка'
    },
    3: {
        cellid: '12134707',
        cellid_alternate: '12133802',
        cellName: '17 - Tarn DEN',
        cellName_alternate: '11 - Tarn NOCH',
        dirrection: 'Тарный День',
        dirrection_alternate: 'Тарный Ночь',
        type: 'Хранение'
    },
    4: {
        cellid: '16795528',
        cellName: 'SOFINO SKLAD 3.1',
        dirrection: 'Софьино ФФЦ',
        type: 'Хранение'
    },
    5: {
        cellid: '2191542',
        cellName: '16 - ROSTOV',
        dirrection: 'СЦ Ростов',
        type: 'Отгрузка'
    },
    6: {
        cellid: '28645976',
        cellName: 'FFC_ROSTOV_KGT',
        dirrection: 'ФФЦ Ростов КГТ',
        type: 'Хранение'
    },
    7: {
        cellid: '17935164',
        cellName: '21 - KROSS KRASNODAR',
        dirrection: 'СЦ МК Краснодар',
        type: 'Хранение'
    }
}

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

const tpi_ql_icon_daytime_switch_sun =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path>
</svg>
`,
tpi_ql_icon_daytime_switch_moon =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path>
</svg>
`,
tpi_ql_i_lot_type = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4zm-92 160H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32zm0-80H176a16 16 0 0 1 0-32h160a16 16 0 0 1 0 32z"></path>
    <path d="M419.22 188.59 275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16h129.81a2 2 0 0 0 1.41-3.41z"></path>
</svg>
`,
tpi_ql_i_lot_cellname = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 64H257.6L76.5 251.6c-8 8-12.3 18.5-12.5 29-.3 11.3 3.9 22.6 12.5 31.2l123.7 123.6c8 8 20.8 12.5 28.8 12.5s22.8-3.9 31.4-12.5L448 256V96l-32-32zm-30.7 102.7c-21.7 6.1-41.3-10-41.3-30.7 0-17.7 14.3-32 32-32 20.7 0 36.8 19.6 30.7 41.3-2.9 10.3-11.1 18.5-21.4 21.4z"></path>
</svg>
`,
tpi_ql_i_lot_dirrection = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3C6.30622 3 7.41746 3.83481 7.82929 5H10C12.2091 5 14 6.79086 14 9C14 11.2091 12.2091 13 10 13H7C5.34315 13 4 14.3431 4 16C4 17.6569 5.34315 19 7 19H13L15 21H7C4.23858 21 2 18.7614 2 16C2 13.2386 4.23858 11 7 11H10C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7H7.82929C7.41746 8.16519 6.30622 9 5 9C3.34315 9 2 7.65685 2 6C2 4.34315 3.34315 3 5 3Z"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5608 20.9961H18.4484C18.7487 20.192 19.5015 19.5618 20.1257 19.0568C20.3933 18.8404 20.6413 18.6397 20.8273 18.4502C21.3871 17.8811 21.7684 17.1554 21.9229 16.3652C22.0775 15.5751 21.9984 14.7559 21.6956 14.0116C21.3928 13.2673 20.88 12.6313 20.2221 12.1841C19.5642 11.737 18.7908 11.4989 18 11.5C17.2092 11.4989 16.4358 11.737 15.7779 12.1841C15.12 12.6313 14.6072 13.2673 14.3044 14.0116C14.0016 14.7559 13.9225 15.5751 14.0771 16.3652C14.2316 17.1554 14.6129 17.8811 15.1727 18.4502C15.359 18.6412 15.6088 18.8435 15.8786 19.0619C16.5011 19.5658 17.2566 20.2524 17.5608 20.9961Z"></path>
</svg>
`,
tpi_ql_i_lot_info = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
</svg>
`,
tpi_ql_i_multipack = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M298.39 248a4 4 0 0 0 2.86-6.8l-78.4-79.72a4 4 0 0 0-6.85 2.81V236a12 12 0 0 0 12 12z"></path>
    <path d="M197 267a43.67 43.67 0 0 1-13-31v-92h-72a64.19 64.19 0 0 0-64 64v224a64 64 0 0 0 64 64h144a64 64 0 0 0 64-64V280h-92a43.61 43.61 0 0 1-31-13zm175-147h70.39a4 4 0 0 0 2.86-6.8l-78.4-79.72a4 4 0 0 0-6.85 2.81V108a12 12 0 0 0 12 12z"></path>
    <path d="M372 152a44.34 44.34 0 0 1-44-44V16H220a60.07 60.07 0 0 0-60 60v36h42.12A40.81 40.81 0 0 1 231 124.14l109.16 111a41.11 41.11 0 0 1 11.83 29V400h53.05c32.51 0 58.95-26.92 58.95-60V152z"></path>
</svg>
`,
tpi_ql_i_lotpack = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M428 224H288a48 48 0 0 1-48-48V36a4 4 0 0 0-4-4h-92a64 64 0 0 0-64 64v320a64 64 0 0 0 64 64h224a64 64 0 0 0 64-64V228a4 4 0 0 0-4-4z"></path>
    <path d="M419.22 188.59 275.41 44.78a2 2 0 0 0-3.41 1.41V176a16 16 0 0 0 16 16h129.81a2 2 0 0 0 1.41-3.41z"></path>
</svg>
`,
tpi_ql_i_lot_amount = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M336 264.13V436c0 24.3-19.05 44-42.95 44H107c-23.95 0-43-19.7-43-44V172a44.26 44.26 0 0 1 44-44h94.12a24.55 24.55 0 0 1 17.49 7.36l109.15 111a25.4 25.4 0 0 1 7.24 17.77z"></path>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M200 128v108a28.34 28.34 0 0 0 28 28h108"></path>
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M176 128V76a44.26 44.26 0 0 1 44-44h94a24.83 24.83 0 0 1 17.61 7.36l109.15 111A25.09 25.09 0 0 1 448 168v172c0 24.3-19.05 44-42.95 44H344"></path>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M312 32v108a28.34 28.34 0 0 0 28 28h108"></path>
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
            <!--<div class="tpi-ql-firebase-storage-data">
                <div class="tpi-ql-firebase-storage-data-item">
                    <p>Использованно 0% хранилища</p>
                </div>
                <div class="tpi-ql-firebase-storage-data-item">
                    <p>Память: 0MB/1GB</p>
                </div>
                <div class="tpi-ql-firebase-storage-data-item">
                    <p>Дедлайн хранилища: ∞</p>
                </div>
            </div>-->
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
                <div class="tpi-ql--controls-items-wrapper-border">
                    <div class="tpi-ql--controls-items-wrapper">

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="012" tpi-ql-sc-data-id-label="custom-1">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <div class="tpi-ql--sc-icon-wrapper">
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="0"></i>
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="1"></i>
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="2"></i>
                                    </div>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        Первый склад
                                    </h1>
                                    
                                    <ul class="tpi-ql--controls-option-data-description-wrapper tpi-ql--controls-option-data-description-custom">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <div class="tpi-ql--controls-option-data-description-block">
                                                <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_info}</i>
                                                <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направления:</h2>
                                            </div>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ МК Липецк</h3>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ МК Курск</h3>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ МК Белгород</h3>
                                        </li>
                                    </ul>

                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-012">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-012" type="number" min="0" max="50" value="10">
                                        </label>
                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="34567" tpi-ql-sc-data-id-label="custom-2">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <div class="tpi-ql--sc-icon-wrapper">
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="3"></i>
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="4"></i>
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="5"></i>
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="6"></i>
                                        <i class="tpi-ql--sc-icon-custom" tpi-ql-custom-sc="7"></i>
                                    </div>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        Третий склад
                                    </h1>
                                    
                                    <ul class="tpi-ql--controls-option-data-description-wrapper tpi-ql--controls-option-data-description-custom">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <div class="tpi-ql--controls-option-data-description-block">
                                                <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_info}</i>
                                                <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направления:</h2>
                                            </div>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ Тарный</h3>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Софьино ФФЦ</h3>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ Ростов</h3>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ Ростов КГТ</h3>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">СЦ Краснодар</h3>
                                        </li>
                                    </ul>

                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-4567">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-4567" type="number" min="0" max="50" value="10">
                                        </label>
                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div class="tpi-ql--controls-option-wrapper-devider"></div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="0" tpi-ql-sc-data-id-label="Липецк">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        СЦ Липецк
                                    </h1>
                                    
                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Отгрузка</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>3 - LIPETSK</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>СЦ МК Липецк</h3>
                                        </li>
                                    </ul>

                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-0">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-0" type="number" min="0" max="50" value="10">
                                        </label>
                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="1" tpi-ql-sc-data-id-label="Курск">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        СЦ Курск
                                    </h1>
                                    
                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Отгрузка</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>2 - KURSK</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>СЦ МК Курск</h3>
                                        </li>
                                    </ul>

                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-1">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-1" type="number" min="0" max="50" value="10">
                                        </label>
                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="2" tpi-ql-sc-data-id-label="Белгород">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        СЦ Белгород
                                    </h1>
                                    
                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Отгрузка</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>3 - BELGOROD</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>СЦ МК Белгород</h3>
                                        </li>
                                    </ul>

                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-2">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-2" type="number" min="0" max="50" value="10">
                                        </label>
                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="3" tpi-ql-sc-data-id-label="Тарный">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <div class="tpi-ql--controls--controls-option-data-title-wrapper">
                                        <i class="tpi-ql--sc-icon"></i>
                                        <h1 class="tpi-ql--controls-option-data-title">
                                            СЦ Тарный
                                        </h1>
                                        <h4 class="tpi-ql--controls-option-data-sub-title">
                                            День
                                        </h4>
                                        <label class="tpi-ql-controls-option-daytime" for="tpi-ql-contols-daytime-3">
                                            <div class="tpi-ql-controls-daytime-circle"></div>
                                            <i class="tpi-ql-controls-icon" tpi-ql-daytime-state="day">
                                                ${tpi_ql_icon_daytime_switch_sun}
                                            </i>
                                            <i class="tpi-ql-controls-icon" tpi-ql-daytime-state="night">
                                                ${tpi_ql_icon_daytime_switch_moon}
                                            </i>
                                            <input class="tpi-ql-controls-option-daytime-checkbox" id="tpi-ql-contols-daytime-3" type="checkbox" checked>
                                        </label>
                                    
                                        <ul class="tpi-ql--controls-option-data-description-wrapper">
                                            <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                                <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                                <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                                <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Хранение</h3>
                                            </li>
                                            <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                                <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                                <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                                <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>17 - Tarn DEN</h3>
                                            </li>
                                            <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                                <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                                <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                                <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>Тарный День</h3>
                                            </li>
                                        </ul>

                                    </div>
                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-3">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-3" type="number" min="0" max="50" value="10">
                                        </label>
                                        <button class="tpi-ql--controls-option-create-lotpack" tpi-daytime-state="day">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="4" tpi-ql-sc-data-id-label="Софьино">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        Софьино ФФЦ
                                    </h1>

                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Хранение</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>SOFINO SKLAD 3.1</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>Софьино ФФЦ</h3>
                                        </li>
                                    </ul>
                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-4">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-4" type="number" min="0" max="50" value="10">
                                        </label>

                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="5" tpi-ql-sc-data-id-label="Ростов">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        СЦ Ростов
                                    </h1>

                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Отгрузка</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>16 - ROSTOV</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>СЦ Ростов</h3>
                                        </li>
                                    </ul>
                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-5">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-5" type="number" min="0" max="50" value="10">
                                        </label>

                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="6" tpi-ql-sc-data-id-label="Ростов КГТ">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        Ростов КГТ
                                    </h1>

                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Хранение</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>FFC_ROSTOV_KGT</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>ФФЦ Ростов КГТ</h3>
                                        </li>
                                    </ul>
                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-6">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-6" type="number" min="0" max="50" value="10">
                                        </label>

                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tpi-ql--controls-option-wrapper" tpi-ql-sc-data-id="7" tpi-ql-sc-data-id-label="Краснодар">
                            <div class="tpi-ql--contorols-option-img-title">
                                <div class="tpi-ql--controls-option-data-wrapper">
                                    <i class="tpi-ql--sc-icon"></i>
                                    <h1 class="tpi-ql--controls-option-data-title">
                                        СЦ Краснодар
                                    </h1>

                                    <ul class="tpi-ql--controls-option-data-description-wrapper">
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_type}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Тип:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text">Отгрузка</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_cellname}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Ячейка:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-cellname>21 - KROSS KRASNODAR</h3>
                                        </li>
                                        <li class="tpi-ql--controls-option-data-description-wrapper-item">
                                            <i class="tpi-ql-i-lot-type">${tpi_ql_i_lot_dirrection}</i>
                                            <h2 class="tpi-ql--controls-option-data-description-wrapper-item-text">Направление:</h2>
                                            <h3 class="tpi-ql--controls-option-data-description-wrapper-item-text" tpi-ql-card-direction>СЦ Краснодар</h3>
                                        </li>
                                    </ul>
                                    <div class="tpi-ql-controls-option-submit-wrapper">
                                        <label class="tpi-ql--controls-option-amount-wrapper" for="tpi-ql--controls-option-amount-id-7">
                                            <input class="tpi-ql--controls-option-amount-input" id="tpi-ql--controls-option-amount-id-7" type="number" min="0" max="50" value="10">
                                        </label>

                                        <button class="tpi-ql--controls-option-create-lotpack">
                                            Создать
                                        </button>
                                    </div>
                                </div>
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
                            <div>Управление</div>
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
        document.querySelectorAll('.tpi-ql--controls-option-amount-wrapper input.tpi-ql--controls-option-amount-input').forEach(input => {
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
                } else if (val < 1) {
                    val = 1;
                } else if (val > 50) {
                    val = 50;
                }

                input.value = val;
            });
        });


        //~ Обработка нажатия кнопок создания пачек лотов (новый метод через API)
        const createLotPackButtons = document.querySelectorAll('.tpi-ql--controls-option-create-lotpack');
        createLotPackButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const wrapper = this.closest('.tpi-ql--controls-option-wrapper');
                if (!wrapper) return;
                
                const wrapperId = wrapper.getAttribute('tpi-ql-sc-data-id');
                if (!wrapperId) return;
                
                let cellConfigs = [];
                let isMultiPack = false;
                
                if (wrapperId === '012') {
                    // Комбо №1: Липецк, Курск, Белгород
                    isMultiPack = true;
                    cellConfigs = [
                        { ...tpi_quickLots_id_array[0] },
                        { ...tpi_quickLots_id_array[1] },
                        { ...tpi_quickLots_id_array[2] }
                    ];
                } else if (wrapperId === '34567') {
                    // Комбо №2: Тарный (оба варианта), Софьино, Ростов, Ростов КГТ, Краснодар
                    isMultiPack = true;
                    
                    // Добавляем оба варианта Тарного
                    const tarnDay = { ...tpi_quickLots_id_array[3] };
                    const tarnNight = { 
                        ...tpi_quickLots_id_array[3],
                        cellid: tpi_quickLots_id_array[3].cellid_alternate,
                        cellName: tpi_quickLots_id_array[3].cellName_alternate,
                        dirrection: tpi_quickLots_id_array[3].dirrection_alternate
                    };
                    
                    cellConfigs = [
                        tarnDay,
                        tarnNight,
                        { ...tpi_quickLots_id_array[4] },
                        { ...tpi_quickLots_id_array[5] },
                        { ...tpi_quickLots_id_array[6] },
                        { ...tpi_quickLots_id_array[7] }
                    ];
                } else {
                    // Одиночная кнопка
                    const config = tpi_quickLots_id_array[wrapperId];
                    if (config) {
                        if (wrapperId === '3') {
                            const configCopy = { ...config };
                            const daytimeCheckbox = wrapper.querySelector('.tpi-ql-controls-option-daytime-checkbox');
                            if (daytimeCheckbox && !daytimeCheckbox.checked) {
                                configCopy.cellid = configCopy.cellid_alternate;
                                configCopy.cellName = configCopy.cellName_alternate;
                                configCopy.dirrection = configCopy.dirrection_alternate;
                            }
                            cellConfigs = [configCopy];
                        } else {
                            cellConfigs = [config];
                        }
                    }
                }
                
                if (cellConfigs.length === 0) {
                    console.error('Не найдена конфигурация для wrapper:', wrapperId);
                    return;
                }
                
                const amountInput = wrapper.querySelector('.tpi-ql--controls-option-amount-input');
                let amount = 10;
                if (amountInput) {
                    amount = parseInt(amountInput.value) || 10;
                    if (amount < 1) amount = 1;
                    if (amount > 50) amount = 50;
                }
                
                const controlsWrapper = document.querySelector('.tpi-ql--controls-wrapper');
                const tpiQlControlPanel = document.querySelector('.tpi-ql--controls-panel');
                
                 try {
                    let allBarcodes = [];
                    
                    // Для мультипаков создаем лоты для всех ячеек в одну пачку
                    if (isMultiPack) {
                        for (const cellConfig of cellConfigs) {
                            const cellId = cellConfig.cellid;
                            const cellName = cellConfig.cellName;
                            
                            console.log(`Создание лотов для ячейки: ${cellName} (ID: ${cellId})`);
                            
                            const lots = await ql_processLotButtons(cellId, amount);
                            if (lots && lots.length > 0) {
                                allBarcodes = allBarcodes.concat(lots);
                            }
                        }
                        
                        // Создаем ОДНУ пачку для всех лотов
                        const lotsData = allBarcodes.map((lot, idx) => ({
                            lotname: lot,
                            lotid: String(idx + 1)
                        }));
                        
                        let packCellName;
                        if (wrapperId === '012') {
                            packCellName = 'Первый склад';
                        } else if (wrapperId === '34567') {
                            packCellName = 'Третий склад';
                        }
                        
                        const { dateDoc, lotPackId } = await createLotPack(
                            lotsData, 
                            packCellName, 
                            'forward', 
                            true,
                            cellConfigs
                        );
                        
                        tpiNotification.show(
                            'Пачка создана', 
                            'success', 
                            `Создана пачка ${lotPackId} с ${lotsData.length} лотами`
                        );
                    } else {
                        // Для одиночных кнопок
                        const cellConfig = cellConfigs[0];
                        const lots = await ql_processLotButtons(cellConfig.cellid, amount);
                        if (lots && lots.length > 0) {
                            allBarcodes = lots;
                        }
                        
                        const lotsData = allBarcodes.map((lot, idx) => ({
                            lotname: lot,
                            lotid: String(idx + 1)
                        }));
                        
                        const { dateDoc, lotPackId } = await createLotPack(
                            lotsData, 
                            cellConfig.cellName, 
                            cellConfig.type, 
                            false
                        );
                        
                        tpiNotification.show(
                            'Пачка создана', 
                            'success', 
                            `Создана пачка ${lotPackId} с ${lotsData.length} лотами`
                        );
                    }
                    // Обновляем таблицу
                    await loadTableData();
                    
                } catch (error) {
                    console.error('Ошибка в процессе создания:', error);
                    tpiNotification.show('Ошибка', 'error', `Не удалось создать лоты: ${error.message}`);
                } finally {
                    controlsWrapper.setAttribute('current-state', 'default');
                    controlsWrapper.removeAttribute('inert');
                    tpiQlControlPanel.setAttribute('current-state', 'default');
                }
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

    }

    if (isQuickLotsPage(location.href)) {
        addTurboBlock();
        addToastContainer()
        tpiQL_addCardListeners();
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

function createLotPack(lotsData, cellName, lotType, isMultiPack = false, cellConfigs = null) {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date();
            const yy = String(now.getFullYear()).slice(-2);
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const dateDoc = `${now.getFullYear()}-${mm}-${dd}`;
            
            const datePart = `${yy}${mm}${dd}`;
            const dateRef = db.collection("dates").doc(dateDoc);
            
            const existingPacks = await dateRef.collection("lotpacks").get();
            const packCount = existingPacks.size;
            const packNumber = String(packCount + 1).padStart(2, '0');
            
            const prefix = isMultiPack ? 'MULTIPACK' : 'LOTPACK';
            const lotPackId = `${prefix}-${datePart}${packNumber}`;
            
            // Если есть cellConfigs и это мультипак, добавляем информацию о ячейке к каждому лоту
            let enhancedLots = lotsData;
            if (isMultiPack && cellConfigs) {
                enhancedLots = lotsData.map((lot, index) => {
                    // Определяем к какой ячейке относится этот лот
                    let lotCellName = cellName;
                    let lotCellDirrection = cellName;
                    
                    if (cellConfigs.length > 0) {
                        // Распределяем лоты по ячейкам
                        const lotsPerCell = Math.ceil(lotsData.length / cellConfigs.length);
                        const cellIndex = Math.floor(index / lotsPerCell);
                        if (cellIndex < cellConfigs.length) {
                            lotCellName = cellConfigs[cellIndex].cellName;
                            lotCellDirrection = cellConfigs[cellIndex].dirrection;
                        }
                    }
                    
                    return {
                        ...lot,
                        cellName: lotCellName,
                        dirrection: lotCellDirrection
                    };
                });
            } else {
                // Для обычных пачек добавляем информацию о ячейке
                enhancedLots = lotsData.map(lot => ({
                    ...lot,
                    cellName: cellName,
                    dirrection: cellName
                }));
            }
            
            const packData = {
                'cell-name': cellName,
                'lot-type': lotType,
                'create-time': firebase.firestore.Timestamp.now(),
                status: 'created',
                lots: enhancedLots,
                lotsAmount: enhancedLots.length,
                'pack-type': isMultiPack ? 'multipack' : 'lotpack'
            };
            
            await dateRef.collection("lotpacks").doc(lotPackId).set(packData);
            
            console.log(`Пачка ${lotPackId} создана в Firebase`);
            resolve({ dateDoc, lotPackId });
            
        } catch (error) {
            console.error('Ошибка при создании пачки:', error);
            reject(error);
        }
    });
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

function createLots(cellId, count = 10) {

    const url = 'https://logistics.market.yandex.ru/api/resolve/?r=sortingCenter/sortables/resolveCreateLots:resolveCreateLots';

    const path = location.pathname + location.search;

    const body = {
        params: [{
            sortingCenterId: 21972131,
            createLotsDto: {
                cellId: String(cellId),
                count: String(count) // ← СТРОКА!
            }
        }],
        path
    };

    console.log('🚀 REQUEST BODY:', body);

    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            'sk': tpiUserTOKEN,

            // 👇 важно
            'origin': location.origin,
            'referer': location.href,

            // 👇 можно оставить
            'x-market-core-service': '<UNKNOWN>'
        },
        body: JSON.stringify(body)
    })
    .then(async (r) => {
        const text = await r.text();

        console.log('📊 STATUS:', r.status);
        console.log('📦 RAW:', text);

        if (!r.ok) {
            throw new Error(`HTTP ${r.status}: ${text}`);
        }

        return JSON.parse(text);
    })
    .then(data => {
        console.log('✅ SUCCESS:', data);

        const lots = data?.results?.[0]?.data || [];

        console.log('🎉 ЛОТЫ:');
        lots.forEach((lot, i) => {
            console.log(`${i + 1}. ${lot.id} | ${lot.barcode}`);
        });

        return lots;
    })
    .catch(err => {
        console.error('❌ ERROR:', err);
        throw err; // Пробрасываем ошибку дальше
    });
}

async function ql_processLotButtons(cellId, count) {
    try {
        const totalAmount = parseInt(count);
        const batchSize = 10;
        const fullBatches = Math.floor(totalAmount / batchSize);
        const remainder = totalAmount % batchSize;
        
        let allCreatedLots = [];
        
        // Создаем полные батчи по 10
        for (let i = 0; i < fullBatches; i++) {
            console.log(`Создание партии ${i + 1}/${fullBatches}, количество: ${batchSize}`);
            const lots = await createLots(cellId, batchSize);
            if (lots && lots.length > 0) {
                allCreatedLots = allCreatedLots.concat(lots);
            }
            
            if (i < fullBatches - 1 || remainder > 0) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // Создаем остаток
        if (remainder > 0) {
            console.log(`Создание последней партии, количество: ${remainder}`);
            const lots = await createLots(cellId, remainder);
            if (lots && lots.length > 0) {
                allCreatedLots = allCreatedLots.concat(lots);
            }
        }
        
        const allBarcodes = allCreatedLots.map(lot => lot.barcode || lot.id);
        console.log(`Успешно создано ${allBarcodes.length} лотов`);
        
        return allBarcodes;
        
    } catch (error) {
        console.error('Ошибка при создании лотов:', error);
        throw error;
    }
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
    let pack = null;
    try {
        // Извлекаем дату из ID пачки
        const datePart = lotPackName.includes('-') ? lotPackName.split('-')[1].substring(0, 6) : '';
        if (datePart) {
            const year = '20' + datePart.substring(0, 2);
            const month = datePart.substring(2, 4);
            const day = datePart.substring(4, 6);
            const dateDoc = `${year}-${month}-${day}`;
            
            const docRef = db.collection("dates").doc(dateDoc).collection("lotpacks").doc(lotPackName);
            const docSnapshot = await docRef.get();
            
            if (docSnapshot.exists) {
                pack = docSnapshot.data();
            } else {
                // Ищем во всех датах
                const datesSnapshot = await db.collection("dates").get();
                for (const dateDoc of datesSnapshot.docs) {
                    const packRef = dateDoc.ref.collection("lotpacks").doc(lotPackName);
                    const packSnapshot = await packRef.get();
                    if (packSnapshot.exists) {
                        pack = packSnapshot.data();
                        break;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при получении данных пачки:', error);
    }
    
    // Преобразуем строку лотов обратно в массив
    const lotsArray = lotsString.split(' ').filter(lot => lot.trim()).map((lotname, index) => {
        // Пытаемся найти дополнительные данные в pack.lots
        if (pack && pack.lots && pack.lots[index]) {
            return {
                lotname: lotname,
                lotid: String(index + 1),
                cellName: pack.lots[index].cellName || cellName,
                dirrection: pack.lots[index].dirrection || cellName
            };
        }
        return {
            lotname: lotname,
            lotid: String(index + 1),
            cellName: cellName,
            dirrection: cellName
        };
    });
    
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
        
        // Запускаем процесс печати с отслеживанием прогресса (НЕ ЖДЕМ)
        await generateLotsPDFWithProgress(
            lotsArray, 
            cellName, 
            lotsArray.length, 
            lotPackName, 
            lotType,
            (progress) => {
                // Обновляем прогресс на кнопке
                progressText.textContent = `${Math.round(progress)}%`;
                updateButtonProgressAnimation(progressOverlay, progress);
                
                // Когда прогресс достигает 100%, восстанавливаем кнопку
                if (progress >= 100) {
                    setTimeout(() => {
                        // СНАЧАЛА обновляем статус в Firebase
                        updateLotPackStatus(lotPackName, 'printed').catch(err => {
                            console.error('Ошибка при обновлении статуса:', err);
                        });
                        
                        // Восстанавливаем кнопку
                        buttonElement.classList.remove('tpi-ql--print-button-progress');
                        buttonElement.innerHTML = originalContent;
                        buttonElement.disabled = false;
                        
                        // Обновляем статус в таблице
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
                                <div class="tpi-ql--table-date">
                                    <p dateData="lotpack--printed-date">${formatDateToDDMMYYYY(now)}</p>
                                    <p dateData="lotpack--printed-time">${formatDateToHHMMSS(now)}</p>
                                </div>
                            `;
                        }
                        
                        tpiNotification.show('Пачка распечатана', 'success', `Пачка ${lotPackName} успешно распечатана`);
                    }, 500);
                }
            }
        );
        
    } catch (error) {
        console.error('Ошибка при печати:', error);
        
        // Восстанавливаем статус при ошибке
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
    if (progressDecimal < 1 && visiblePoints < points.length) {
        const nextPointIndex = visiblePoints - 1;
        const segmentProgress = visibleProgress - Math.floor(visibleProgress);
        
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

        // Быстро извлекаем дату из ID пачки
        let dateDoc = null;
        
        if (lotPackName.includes('-')) {
            const parts = lotPackName.split('-');
            if (parts.length >= 2) {
                const datePart = parts[1].substring(0, 6);
                if (datePart.length === 6) {
                    const year = '20' + datePart.substring(0, 2);
                    const month = datePart.substring(2, 4);
                    const day = datePart.substring(4, 6);
                    dateDoc = `${year}-${month}-${day}`;
                }
            }
        }

        // Если смогли извлечь дату, пробуем сразу обновить
        if (dateDoc) {
            try {
                const docRef = db.collection("dates").doc(dateDoc).collection("lotpacks").doc(lotPackName);
                const docSnapshot = await docRef.get();
                
                if (docSnapshot.exists) {
                    const updateData = { status: status };
                    if (status === 'printed') {
                        updateData['printed-time'] = firebase.firestore.FieldValue.serverTimestamp();
                    } else if (status === 'deleted') {
                        updateData['deleted-time'] = firebase.firestore.FieldValue.serverTimestamp();
                    }
                    
                    await docRef.update(updateData);
                    console.log('Статус пачки успешно обновлен (прямой путь)');
                    return;
                }
            } catch (error) {
                console.log('Не удалось обновить напрямую, ищем в других датах...');
            }
        }

        // Если не получилось, быстро ищем через collectionGroup
        const snapshot = await db.collectionGroup('lotpacks')
            .where(firebase.firestore.FieldPath.documentId(), '==', lotPackName)
            .limit(1)
            .get();

        if (snapshot.empty) {
            throw new Error('Пачка не найдена в Firebase');
        }

        const doc = snapshot.docs[0];
        const updateData = { status: status };
        if (status === 'printed') {
            updateData['printed-time'] = firebase.firestore.FieldValue.serverTimestamp();
        } else if (status === 'deleted') {
            updateData['deleted-time'] = firebase.firestore.FieldValue.serverTimestamp();
        }

        await doc.ref.update(updateData);
        console.log('Статус пачки успешно обновлен (через collectionGroup)');
        
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

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 5.3;
    const maxTextWidth = pageWidth - (margin * 2);

    // Каждый лот = 5% прогресса, но не более 80% total
    const progressPerLot = 90 / lots.length;
    
    for (let i = 0; i < lots.length; i++) {
        const lot = lots[i];
        
        // Начало обработки лота
        if (onProgress) {
            onProgress(Math.round(i * progressPerLot));
        }

        // ===== Определяем данные для каждого лота =====
        const lotCellName = lot.cellName || cellName;
        
        let headerText = "СЦ";
        let typeText = "Отгрузка";
        let recipientText = "СЦ МК";
        
        for (const key in tpi_quickLots_id_array) {
            const config = tpi_quickLots_id_array[key];
            if (config.cellName === lotCellName || config.cellName_alternate === lotCellName) {
                let dirrection;
                let recipient;
                
                if (config.cellName_alternate && lotCellName === config.cellName_alternate) {
                    dirrection = config.dirrection_alternate || config.dirrection;
                    recipient = config.dirrection_alternate || config.dirrection;
                } else {
                    dirrection = config.dirrection;
                    recipient = config.dirrection;
                }
                
                dirrection = dirrection.replace(/^СЦ\s+/, '').replace(/^МК\s+/, '');
                headerText = dirrection;
                typeText = config.type;
                recipientText = recipient;
                break;
            }
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
        const cellNameWidth = pdf.getTextWidth(lotCellName);

        const totalCellWidth = cellLabelWidth + cellNameWidth;
        const cellStartX = (pageWidth - totalCellWidth) / 2;

        pdf.setFontSize(24);
        pdf.setFont('Roboto', 'normal');
        pdf.text(cellLabel, cellStartX, cellTextY);

        pdf.setFontSize(26);
        pdf.setFont('Roboto', 'bold');
        pdf.text(lotCellName, cellStartX + cellLabelWidth, cellTextY);

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
    }

    // Генерация PDF файла - показываем 90%
    if (onProgress) {
        onProgress(92);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    if (onProgress) {
        onProgress(96);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 100% перед открытием
    if (onProgress) {
        onProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Открываем PDF
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

function getLotDeclension(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'Лотов';
    }
    
    if (lastDigit === 1) {
        return 'Лот';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'Лота';
    }
    
    return 'Лотов';
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
    let typeText = 'Отгрузка';
    if (pack['lot-type']) {
        switch(pack['lot-type']) {
            case 'forward': typeText = 'Отгрузка'; break;
            case 'return': typeText = 'Возврат'; break;
            case 'hran': typeText = 'Хранение'; break;
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
    
    // Определяем текст получателя на основе tpi_quickLots_id_array
    let recipientText = '';
    let directionId = '';
    
    if (pack['cell-name']) {
        // Сначала проверяем специальные случаи для мультипаков
        if (pack['cell-name'] === 'Первый склад') {
            recipientText = 'Первый склад';
            directionId = '012';
        } else if (pack['cell-name'] === 'Третий склад') {
            recipientText = 'Третий склад';
            directionId = '34567';
        } else {
            // Ищем совпадение в tpi_quickLots_id_array по cellName
            let found = false;
            for (const key in tpi_quickLots_id_array) {
                const config = tpi_quickLots_id_array[key];
                if (config.cellName === pack['cell-name']) {
                    recipientText = config.dirrection;
                    // Для Тарного (id=3) проверяем день/ночь
                    if (key === '3') {
                        directionId = '3_0'; // День
                    } else {
                        directionId = key;
                    }
                    found = true;
                    break;
                }
                // Проверяем также альтернативные названия
                if (config.cellName_alternate && config.cellName_alternate === pack['cell-name']) {
                    recipientText = config.dirrection_alternate || config.dirrection;
                    // Если это альтернативное название Тарного - значит ночь
                    if (key === '3') {
                        directionId = '3_1'; // Ночь
                    } else {
                        directionId = key;
                    }
                    found = true;
                    break;
                }
            }
            // Если не нашли - используем оригинальное значение
            if (!found) {
                recipientText = pack['cell-name'];
                directionId = '';
            }
        }
    }
    
    // Определяем тип пачки для отображения
    const packType = pack['pack-type'] === 'multipack' ? 'MULTIPACK' : 'LOTPACK';
    const lotsString = pack.lots ? pack.lots.map(lot => lot.lotname).join(' ') : '';
    
    tr.innerHTML = `
        <td>
            <div class="tpi-ql--LOTPACK-name" 
                tpi-ql-firebase-data-lotpackname="${pack.id}" 
                tpi-ql-firebase-data-lots="${lotsString}" 
                tpi-ql-firebase-data-cellname="${pack['cell-name'] || ''}" 
                tpi-ql-firebase-data-type="${pack['lot-type'] || ''}"
                tpi-ql-firebase-data-date="${pack.dateDoc || ''}">
            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/orders/" class="tpi-ql--table-link tpi-ql--pack-link">
                <i class="tpi-ql--pack-link-icon">${packType === 'MULTIPACK' ? tpi_ql_i_multipack : tpi_ql_i_lotpack}</i>
                ${pack.id}
            </a>
            </div>
        </td>
        <td>
            <div>
                <p>${packType === 'MULTIPACK' ? 'Мультипачка' : typeText}</p>
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
                <span class="tpi-ql--table-link">
                    <i>${tpi_ql_i_lot_amount}</i>                
                    ${pack.lotsAmount || 0} ${getLotDeclension(pack.lotsAmount || 0)}
                </span>
            </div>
        </td>
        <td>
            <div class="tpi-ql--recipient-data" tpi-ql-current-data="${directionId}">
                <i class="tpi-ql--recipient-data-icon"></i>
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
            <div class="tpi-ql--table-activity">
                <button class="tpi-ql--print-LOTPACK" tpi-ql--lotpack-print="default">
                    ${printLOTPACKButtonSVG}
                </button>
                <button tpi-ql--lotpack-delete="default">
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

function tpiQL_addCardListeners() {
    const container = document.querySelector('.tpi-ql--controls-items-wrapper');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const optionWrapper = e.target.closest('.tpi-ql--controls-option-wrapper');
        if (!optionWrapper) return;
        
        const tpiQl_card_id = optionWrapper.getAttribute('tpi-ql-sc-data-id')

        const daytimeLabel = e.target.closest('.tpi-ql-controls-option-daytime');
        if (!daytimeLabel) return;

        const tpiQl_checkbox = daytimeLabel.querySelector('.tpi-ql-controls-option-daytime-checkbox');
        if (!tpiQl_checkbox) return;

        const tpiQl_isChecked = tpiQl_checkbox.checked;

        const tpiQl_button = optionWrapper.querySelector('.tpi-ql--controls-option-create-lotpack');
        if (!tpiQl_button) return;

        const tpiQl_sub_title = optionWrapper.querySelector('.tpi-ql--controls-option-data-sub-title');
        if (!tpiQl_sub_title) return;

        if (tpiQl_isChecked) {
            tpiQl_button.setAttribute('tpi-daytime-state', 'day');
            tpiQl_sub_title.innerHTML = `День`
        } else {
            tpiQl_button.setAttribute('tpi-daytime-state', 'night');
            tpiQl_sub_title.innerHTML = `Ночь`
        }

        if(tpiQl_card_id == "3"){
            const tpiQl_card_cellName = optionWrapper.querySelector('h3.tpi-ql--controls-option-data-description-wrapper-item-text[tpi-ql-card-cellname]')
            const tpiQl_card_dirrection = optionWrapper.querySelector('h3.tpi-ql--controls-option-data-description-wrapper-item-text[tpi-ql-card-direction]')
            if(tpiQl_isChecked){
                tpiQl_card_cellName.innerHTML = `17 - Tarn DEN`
                tpiQl_card_dirrection.innerHTML = `Тарный День`
            }else{
                tpiQl_card_cellName.innerHTML = `11 - Tarn NOCH `
                tpiQl_card_dirrection.innerHTML = `Тарный Ночь`
            }
        }else return

    });
}

//@

checkiIs__onQuickLotsPage()