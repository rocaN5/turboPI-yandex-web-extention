const tpi_sto_thead_preset = /*html*/`
<thead class="tpi-sto--table-thead-wrapper">
    <tr class="tpi-sto--table-thead">
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Код грузоместа</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Номер заказа / XDOC</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Тип грузоместа</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Расширенный статус</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Статус грузоместа</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Родительское грузоместо</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Грузоместа</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Имя ячейки</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Адрес ячейки</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Номер поставки</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Номер отгрузки</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Откуда</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Куда</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Группировка</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Дата создания</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Дата приемки</div>
        </th>
        <th class="tpi-sto--table-thead-item">
            <div class="tpi-sto--table-thead-data">Дата отгрузки</div>
        </th>
    </tr>
</thead>
`,
tpi_sto_liquid_glass_svg = `
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
</svg>
`,
tpi_sto_icon_decrease = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path><path d="M22 3.41 16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2 22 3.41zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59 3.41 22z"></path>
</svg>
`,
tpi_sto_icon_increase = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"></path>
</svg>
`,
tpi_sto_icon_pin = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.3126 10.1753L20.8984 11.5895L20.1913 10.8824L15.9486 15.125L15.2415 18.6606L13.8273 20.0748L9.58466 15.8321L4.63492 20.7819L3.2207 19.3677L8.17045 14.4179L3.92781 10.1753L5.34202 8.76107L8.87756 8.05396L13.1202 3.81132L12.4131 3.10422L13.8273 1.69L22.3126 10.1753Z"></path>
</svg>
`,
tpi_sto_icon_search = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="tpi-search-icon">
    <circle class="glass" cx="10.5" cy="10.5" r="7.5" fill="none" stroke="#000" stroke-width="1.5"/>
    <circle class="glassGap" cx="10.5" cy="10.5" r="7.5" fill="none" stroke="#000" stroke-width="1.5"/>
    <path class="handle" d="m16.563 16.458 4.223 5.372-1.572 1.236-4.21-5.356" fill="#000"/>
</svg>
`,
tpi_sto_icon_pin_chevron_up = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 328 144-144 144 144"></path>
</svg>
`,
tpi_sto_icon_pin_chevron_down = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 328 144-144 144 144"></path>
</svg>
`,
tpi_sto_icon_settings_animate_status =`
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 6.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0"></path>
    <path d="M2.5 21h8l-4 -7z"></path>
    <path d="M14 3l7 7"></path>
    <path d="M14 10l7 -7"></path>
    <path d="M14 14h7v7h-7z"></path>
</svg>
`,
tpi_sto_icon_calendar = `
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
tpi_sto_icon_clock = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
</svg>
`,
tpi_sto_icon_inbound = `
<svg stroke="currentColor" fill="currentColor" stroke-width=".5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"></path>
    <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
</svg>
`,
tpi_sto_icon_outbound = `
<svg stroke="currentColor" fill="currentColor" stroke-width=".5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"></path>
    <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"></path>
</svg>
`;

//! ТИП грузоместа
//! ТИП грузоместа
//! ТИП грузоместа
const tpi_sto_icon_TYPE_place = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.27 9 5.15"></path>
</svg>
`,
tpi_sto_icon_TYPE_pallet = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M144 256h352c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H384v128l-64-32-64 32V0H144c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16zm480 128c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v64H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h608c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-48v-64h48zm-336 64H128v-64h160v64zm224 0H352v-64h160v64z"/>
</svg>
`,
tpi_sto_icon_TYPE_emptyLot = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"/>
</svg>
`,
tpi_sto_icon_TYPE_batch = `
<svg stroke="currentColor" fill="currentColor" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.37,17.65a16.777,16.777,0,0,0-2.01-5.54,17.037,17.037,0,0,0-3.74-4.55l-.1-.08a.121.121,0,0,1-.02-.15l1.49-2.59a1.12,1.12,0,0,0,0-1.12,1.092,1.092,0,0,0-.97-.55H8.98a1.1,1.1,0,0,0-.97.55,1.12,1.12,0,0,0,0,1.12l1.5,2.59a.124.124,0,0,1-.03.15l-.09.08A17.327,17.327,0,0,0,3.63,17.65a4.051,4.051,0,0,0-.04.48,2.8,2.8,0,0,0,2.8,2.8H17.62a2.782,2.782,0,0,0,2.13-.99A2.834,2.834,0,0,0,20.37,17.65ZM8.88,4.24a.1.1,0,0,1,0-.12.106.106,0,0,1,.1-.05h6.04a.143.143,0,0,1,.11.05.163.163,0,0,1,0,.12l-1.59,2.8H10.46Zm5.09,4.08a16.436,16.436,0,0,1,5.42,9.5,1.817,1.817,0,0,1-.4,1.47,1.786,1.786,0,0,1-1.37.64H6.39a1.805,1.805,0,0,1-1.8-1.8,1.628,1.628,0,0,1,.03-.31,16.286,16.286,0,0,1,5.42-9.5l.32-.28h3.28Z"></path>
</svg>
`,
tpi_sto_icon_TYPE_tot = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 3H4a2 2 0 0 0-2 2v2a2 2 0 0 0 1 1.72V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.72A2 2 0 0 0 22 7V5a2 2 0 0 0-2-2zM4 5h16v2H4zm1 14V9h14v10z"></path>
    <path d="M8 11h8v2H8z"></path>
</svg>
`,
tpi_sto_icon_TYPE_polybox = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
</svg>
`,
tpi_sto_icon_TYPE_anomaly = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033"/>
    <path d="M10 16v-6a2 2 0 1 1 4 0v6"/>
    <path d="M10 13h4"/>
</svg>
`,
tpi_sto_icon_TYPE_cart = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.756 5.345c-.191-.219-.466-.345-.756-.345h-13.819l-.195-1.164c-.08-.482-.497-.836-.986-.836h-2.25c-.553 0-1 .447-1 1s.447 1 1 1h1.403l1.86 11.164.045.124.054.151.12.179.095.112.193.13.112.065c.116.047.238.075.367.075h11.001c.553 0 1-.447 1-1s-.447-1-1-1h-10.153l-.166-1h11.319c.498 0 .92-.366.99-.858l1-7c.041-.288-.045-.579-.234-.797zm-1.909 1.655l-.285 2h-3.562v-2h3.847zm-4.847 0v2h-3v-2h3zm0 3v2h-3v-2h3zm-4-3v2h-3l-.148.03-.338-2.03h3.486zm-2.986 3h2.986v2h-2.653l-.333-2zm7.986 2v-2h3.418l-.285 2h-3.133z"/>
    <circle cx="8.5" cy="19.5" r="1.5"/>
    <circle cx="17.5" cy="19.5" r="1.5"/>
</svg>
`,
tpi_sto_icon_TYPE_clientReturn = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
</svg>
`,
tpi_sto_icon_TYPE_zasyl = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"/>
    <path d="m3 8.41 9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7z"/>
</svg>
`,
tpi_sto_icon_TYPE_UNKNOWN = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"/>
</svg>
`
//! ТИП грузоместа •○• END
//! ТИП грузоместа •○• END
//! ТИП грузоместа •○• END

//? Статус грузоместа
//? Статус грузоместа
//? Статус грузоместа

const tpi_sto_icon_STATUS_waiting_accept = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M368 48h4c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12H12C5.373 0 0 5.373 0 12v24c0 6.627 5.373 12 12 12h4c0 80.564 32.188 165.807 97.18 208C47.899 298.381 16 383.9 16 464h-4c-6.627 0-12 5.373-12 12v24c0 6.627 5.373 12 12 12h360c6.627 0 12-5.373 12-12v-24c0-6.627-5.373-12-12-12h-4c0-80.564-32.188-165.807-97.18-208C336.102 213.619 368 128.1 368 48zM64 48h256c0 101.62-57.307 184-128 184S64 149.621 64 48zm256 416H64c0-101.62 57.308-184 128-184s128 82.38 128 184z"/>
</svg>
`,
tpi_sto_icon_STATUS_accepte = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/>
</svg>
`,
tpi_sto_icon_STATUS_sorted = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3 4 7l4 4"/>
    <path d="M4 7h16"/>
    <path d="m16 21 4-4-4-4"/>
    <path d="M20 17H4"/>
</svg>
`,
tpi_sto_icon_STATUS_hran = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/>
    <path d="M6 18h12"/>
    <path d="M6 14h12"/>
    <rect width="12" height="12" x="6" y="10"/>
</svg>
`,
tpi_sto_icon_STATUS_ready = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.25 511.25">
    <path d="M255.63,155.35v100.28M255.63,355.9h.25M481.25,255.63c0,124.61-101.02,225.63-225.63,225.63S30,380.24,30,255.63,131.02,30,255.63,30s225.63,101.02,225.63,225.63Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="60"/>
</svg>
`,
tpi_sto_icon_STATUS_shipped = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
    <path d="M15 18H9"/>
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
    <circle cx="17" cy="18" r="2"/>
    <circle cx="7" cy="18" r="2"/>
</svg>
`,
tpi_sto_icon_STATUS_consolidated = `
<svg stroke="currentColor" fill="currentColor" stroke-width=".5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.063 1.456a1.749 1.749 0 0 1 1.874 0l8.383 5.316a1.751 1.751 0 0 1 0 2.956l-8.383 5.316a1.749 1.749 0 0 1-1.874 0L2.68 9.728a1.751 1.751 0 0 1 0-2.956Zm1.071 1.267a.25.25 0 0 0-.268 0L3.483 8.039a.25.25 0 0 0 0 .422l8.383 5.316a.25.25 0 0 0 .268 0l8.383-5.316a.25.25 0 0 0 0-.422Z"></path>
    <path d="M1.867 12.324a.75.75 0 0 1 1.035-.232l8.964 5.685a.25.25 0 0 0 .268 0l8.964-5.685a.75.75 0 0 1 .804 1.267l-8.965 5.685a1.749 1.749 0 0 1-1.874 0l-8.965-5.685a.75.75 0 0 1-.231-1.035Z"></path>
    <path d="M1.867 16.324a.75.75 0 0 1 1.035-.232l8.964 5.685a.25.25 0 0 0 .268 0l8.964-5.685a.75.75 0 0 1 .804 1.267l-8.965 5.685a1.749 1.749 0 0 1-1.874 0l-8.965-5.685a.75.75 0 0 1-.231-1.035Z"></path>
</svg>
`,
tpi_sto_icon_STATUS_canceled = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
</svg>
`,
tpi_sto_icon_STATUS_deleted = `
<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z" fill="currentColor"/>
    <path d="M9 9H11V17H9V9Z" fill="currentColor"/>
    <path d="M13 9H15V17H13V9Z" fill="currentColor"/>
</svg>

`;
//? Статус грузоместа •○• END
//? Статус грузоместа •○• END
//? Статус грузоместа •○• END


(function() {
    'use strict';

    //! Конфигурация
    const TARGET_PATH = '/orders/stroke-to-orders-v2';
    const BLOCK_SELECTOR = '.tpi-sto--content-section';
    const APP_SELECTOR = '#app';
    const HEADER_SELECTOR = '.p-layout__header-wrapper';
    const CONTENT_SELECTOR = '.p-layout__content';

    let hiddenApp = null;
    let hiddenHeader = null;

    function isTargetPage() {
        return location.pathname.includes(TARGET_PATH);
    }

    function addTurboBlock() {
        if (document.querySelector(BLOCK_SELECTOR)) return;

        const app = document.querySelector(APP_SELECTOR);
        const header = document.querySelector(HEADER_SELECTOR);
        if (app && app.style.display !== 'none') {
            app.style.display = 'none';
            hiddenApp = app;
        }
        if (header && header.style.display !== 'none') {
            header.style.display = 'none';
            hiddenHeader = header;
        }

        const overlay = document.createElement('div');
        overlay.className = BLOCK_SELECTOR.slice(1);
        overlay.innerHTML = /*html*/`
            <div class="tpi-sto--section" style="height: fit-content;">
                <div class="tpi-sto--section-title">
                    <p>Строки в заказы</p>
                </div>
            </div>
            <div class="tpi-sto--section-block" tpi-sto-current-state="default" tpi-sto-animate-state="default">
                <div class="tpi-sto--floating-expandable-section">
                    <div class="tpi-sto--section-wrapper tpi-sto--floating-search-wrapper">
                        <div class="tpi-sto--section-wrapper-title tpi-sto--floating-wrapper-title">
                            <p>Данные поиска</p>
                            <div class="tpi-sto--switch-controls-wrapper">
                                <button class="tpi-sto--switch-size-window-switch" tpi-sto-current-state="unmarked">
                                    ${tpi_sto_icon_decrease}
                                </button>
                                <button class="tpi-sto--switch-pin-floating-window-switch">
                                    ${tpi_sto_icon_pin}
                                </button>
                            </div>
                        </div>
                        <div class="tpi-sto--section-wrapper-item tpi-sto--odrder-searh-data-wrapper" tpi-sto-current-state="visible">
                            <div class="tpi-sto--odrder-status-visibility-container">
                                <button class="tpi-sto--odrder-status-switch-visibility">
                                    Скрыть статусы
                                </button>
                            </div>
                            <div class="tpi-sto--odrder-searh-data-container">
                                <div class="tpi-sto--textarea-status">
                                    <ul>
                                    </ul>
                                </div>
                                <textarea class="tpi--sto-textarea-data-container" spellcheck="false"></textarea>
                            </div>
                        </div>
                        <button class="tpi-sto--start-searching">
                            ${tpi_sto_icon_search}
                            <p>Найти</p>
                        </button>
                    </div>
                </div>
                <div class="tpi-sto--main-section-wrapper">
                    <div class="tpi-sto--search-settings-container">
                        <div class="tpi-sto--settings-option-tooltips"></div>
                        <div class="tpi-sto--section-wrapper tpi-sto--search-settings-wrapper">
                            <div class="tpi-sto--section-wrapper-title">
                                <p>Настройки таблицы</p>
                                <div class="tpi-sto--section-settings">
                                    <button class="tpi-sto--settings-switch-pin-sticky" tpi-sto-current-state="marked">
                                        ${tpi_sto_icon_pin}
                                    </button>
                                    <button class="tpi-sto--settings-toggle" tpi-sto-current-state="visible">
                                        ${tpi_sto_icon_pin_chevron_up}
                                    </button>
                                </div>
                            </div>
                            <div class="tpi-sto--section-wrapper-item tpi-sto-settings-container">
                                <div class="tpi-sto--settings-arrow" tpi-sto-settings-move="left">
                                    ${tpiIcon_settings_arrowChevron_left}
                                </div>
                                <div class="tpi-sto--settings-arrow" tpi-sto-settings-move="right">
                                    ${tpiIcon_settings_arrowChevron_right}
                                </div>
                                <div class="tpi-sto--settings-block">
                                    <label for="tpi-sto--settings-option-1" class="tpi-sto--settiings-option" tpi-tooltip-data="Включить/Отключить анимацию иконок расширенного статуса">
                                        <input type="checkbox" id="tpi-sto--settings-option-1" checked>
                                        <div class="tpi-sto--settings-option-body"></div>
                                        <p class="tpi-sto--settings-option-description">Анимация статусов</p>
                                        <i class="tpi-sto--settings-option-icon">
                                            ${tpi_sto_icon_settings_animate_status}
                                        </i>
                                    </label>
                                    <label for="tpi-sto--settings-option-3" class="tpi-sto--settiings-option" tpi-tooltip-data="Включить/Отключить эффект жидко стекла на заднем фоне плавающих окон">
                                        <input type="checkbox" id="tpi-sto--settings-option-3" checked>
                                        <div class="tpi-sto--settings-option-body"></div>
                                        <p class="tpi-sto--settings-option-description">Жидкое стекло</p>
                                        <i class="tpi-sto--settings-option-icon">
                                            ${tpiIcon_settings_liquidGalss}
                                        </i>
                                    </label>
                                    <label for="tpi-sto--settings-option-4" class="tpi-sto--settiings-option" tpi-tooltip-data="Включить/Отключить дополнительные иконки">
                                        <input type="checkbox" id="tpi-sto--settings-option-4" checked>
                                        <div class="tpi-sto--settings-option-body"></div>
                                        <p class="tpi-sto--settings-option-description">Доп. иконки</p>
                                        <i class="tpi-sto--settings-option-icon">
                                            ${tpiIcon_settings_extraIcons}
                                        </i>
                                    </label>
                                    <label for="tpi-sto--settings-option-5" class="tpi-sto--settiings-option" tpi-tooltip-data="Включить/Отключить дополнительную сетку таблицы">
                                        <input type="checkbox" id="tpi-sto--settings-option-5">
                                        <div class="tpi-sto--settings-option-body"></div>
                                        <p class="tpi-sto--settings-option-description">Доп. сетка</p>
                                        <i class="tpi-sto--settings-option-icon">
                                            ${tpiIcon_settings_verticalGrid}
                                        </i>
                                    </label>
                                    <label for="tpi-sto--settings-option-6" class="tpi-sto--settiings-option" tpi-tooltip-data="Спрятать/Показать дополнительные опции копирования номера заказа и скачивание файла сканлога">
                                        <input type="checkbox" id="tpi-sto--settings-option-6">
                                        <div class="tpi-sto--settings-option-body"></div>
                                        <p class="tpi-sto--settings-option-description">Спрятать опции</p>
                                        <i class="tpi-sto--settings-option-icon">
                                            ${tpiIcon__tripleDots}
                                        </i>
                                    </label>
                                    <label for="tpi-sto--settings-option-7" class="tpi-sto--settiings-option" tpi-tooltip-data="Заменять пустые ячейки на null">
                                        <input type="checkbox" id="tpi-sto--settings-option-7" checked>
                                        <div class="tpi-sto--settings-option-body"></div>
                                        <p class="tpi-sto--settings-option-description">Ячейки null</p>
                                        <i class="tpi-sto--settings-option-icon">
                                            ${tpiIcon__nullCells}
                                        </i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tpi-sto--table-wrapper">
                        <table class="tpi-sto--table-data-output">
                            ${tpi_sto_thead_preset}
                            <tbody class="tpi-sto--table-tbody-wrapper">
                                <tr class="tpi-sto--table-tbody" tpi-sto-row-index="1" tpi-sto-sortable-id="sortableId" tpi-sto-group-code="groupCode">
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data-sortable">
                                            <button class="tpi-sto--table-action-button-shrinker">${tpiIcon__tripleDots}</button>
                                            <div class="tpi-sto--table-sortable-actions">
                                                <button class="tpi-sto--table-action-button" tpi-action-type="copy">${tpiIcon__copy}</button>
                                                <button class="tpi-sto--table-action-button" tpi-action-type="copy-mono">${tpiIcon__copyMono}</button>
                                                <button class="tpi-sto--table-action-button" tpi-action-type="scan-download">${tpiIcon__scanDownload}</button>
                                                <button class="tpi-sto--table-action-button" tpi-action-type="copy-sortable">${tpiIcon__copySortable}</button>
                                            </div>
                                            <div class="tpi-sto--sortable-data-wrapper tpi-sto--sortable-id-data-wrapper">
                                                <a href="#" target="_blank" class="tpi-sto--sortable-data-link" tpi-tooltip-data="гм: 077120002407005156" tpi-sto-search-anchor="sortableBarcode">
                                                    <p>077120002407005156</p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <a href="#" class="tpi-sto--table-tbody-data-link" tpi-sto-search-anchor="groupCode">
                                                <p>LO-892191045</p>
                                            </a>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data" tpi-tooltip-data="Посылка">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_TYPE_place}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-type" tpi-sto-search-anchor="sortableType">Посылка</p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data" tpi-tooltip-data="Вторая приёмка завершена, прямой поток">
                                            <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                                <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="second-accept-complete" tpi-sto-status-direction="forward" tpi-sto-search-anchor="stageDisplayName"></i>
                                            </div>
                                            <p class="tpi-sto--table-tbody-data-sortable-extended-status">Вторая приёмка завершена, прямой поток</p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_STATUS_hran}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">На хренении</p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableBarcode=F1254273B140237AC926" target="_blank" class="tpi-sto--table-tbody-data-link" tpi-sto-search-anchor="lotExternalId">F1254273B140237AC926</a>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?lotSortableId=${"sortableId"}&sortableTypes=&sortableStatusesLeafs=" target="_blank" class="tpi-sto--table-tbody-data-link" tpi-sto-search-anchor="placesCount"><i>${tpi_sto_icon_TYPE_place}</i>5</a>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <p class="tpi-sto--table-tbody-data-sortable-type" tpi-sto-search-anchor="cellName">2 - KURSK</p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <p class="tpi-sto--table-tbody-data-sortable-type" tpi-sto-search-anchor="address">STL-0005-0006-03</p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <a href="https://sorting-center.logistics.yandex.ru/sorting-center/21972131/inbounds?externalIdQuery=TMU177332367" target="_blank" class="tpi-sto--table-tbody-data-link" tpi-sto-search-anchor="inboundExternalId"><i>${tpi_sto_icon_inbound}</i>TMU177332367</a>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/outbounds?query=TMU176746939" target="_blank" class="tpi-sto--table-tbody-data-link" tpi-sto-search-anchor="outboundExternalId"><i>${tpi_sto_icon_outbound}</i>TMU176746939</a>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <p class="tpi-sto--table-null-data">
                                                ${null}
                                            </p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <p class="tpi-sto--table-null-data">
                                                ${null}
                                            </p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <p class="tpi-sto--table-null-data">
                                                ${null}
                                            </p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_calendar}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">
                                                03/10/2025
                                            </p>
                                        </div>
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_clock}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">
                                                12:48:24
                                            </p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_calendar}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">
                                                03/10/2025
                                            </p>
                                        </div>
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_clock}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">
                                                12:48:24
                                            </p>
                                        </div>
                                    </td>
                                    <td class="tpi-sto--table-tbody-item">
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_calendar}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">
                                                03/10/2025
                                            </p>
                                        </div>
                                        <div class="tpi-sto--table-tbody-data">
                                            <i class="tpi-sto--table-tbody-data-icon">${tpi_sto_icon_clock}</i>
                                            <p class="tpi-sto--table-tbody-data-sortable-status">
                                                12:48:24
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ${tpi_sto_liquid_glass_svg}
        `

        const content = document.querySelector(CONTENT_SELECTOR);
        if (content) {
            content.appendChild(overlay);
            content.classList.add('tpi-sto--custom-fulPage')
        }

        if (typeof callTurboPI__once === 'function') callTurboPI__once();
        else console.warn('[TPI] callTurboPI__once не найдена');

        if (typeof addTurboPiTitle === 'function') addTurboPiTitle();
        else console.warn('[TPI] addTurboPiTitle не найдена');

        if (typeof tpi_listener_stroke_to_orders_v2 === 'function') tpi_listener_stroke_to_orders_v2();
        else console.warn('[TPI] tpi_listener_stroke_to_orders_v2 не найдена');

        if (typeof addToastContainer === 'function') addToastContainer();
        else console.warn('[TPI] addToastContainer не найдена');

        if (typeof tpiNotification !== 'undefined' && tpiNotification.show) {
            setTimeout(() => {
                tpiNotification.show('Заголовок', 'info', 'Описание');
            }, 100);
        } else {
            console.warn('[TPI] tpiNotification недоступен');
        }

        document.title = 'Строки в заказы v2';
    }

    function removeTurboBlock() {
        const block = document.querySelector(BLOCK_SELECTOR);
        if (block) block.remove();

        if (hiddenApp) {
            hiddenApp.style.display = '';
            hiddenApp = null;
        }
        if (hiddenHeader) {
            hiddenHeader.style.display = '';
            hiddenHeader = null;
        }
        if (document.title === 'Строки в заказы v2') {
            document.title = 'Яндекс Маркет';
        }
    }

    function handleUrlChange() {
        if (isTargetPage()) {
            addTurboBlock();
        } else {
            removeTurboBlock();
        }
    }

    //! ! ! Инициализация
    function tpi_sto_init() {
        handleUrlChange();

        let lastPathname = location.pathname;
        const observer = new MutationObserver(() => {
            if (lastPathname !== location.pathname) {
                lastPathname = location.pathname;
                handleUrlChange();
            }
        });
        observer.observe(document, { subtree: true, childList: true });

        window.addEventListener('popstate', handleUrlChange);

        const originalPush = history.pushState;
        const originalReplace = history.replaceState;
        history.pushState = function() {
            originalPush.apply(this, arguments);
            handleUrlChange();
        };
        history.replaceState = function() {
            originalReplace.apply(this, arguments);
            handleUrlChange();
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tpi_sto_init);
    } else {
        tpi_sto_init();
    }
})();

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function tpi_listener_stroke_to_orders_v2(){
    tpi_sto_switchFloatingTextareaPin()
    tpi_sto_grabAndDrag_floatingWindow()
    tpi_sto_changeStatusVisibility()
    tpi_sto_changeFloatingWindowSize();
    tpi_sto_settingsOverflowControl();
    tpi_sto_settingsClickListeners();
    tpi_sto_textarea_format_fix()
}

function tpi_sto_changeStatusVisibility(){
    const toggleButton = document.querySelector('.tpi-sto--odrder-status-switch-visibility')
    const stateHolder = document.querySelector('.tpi-sto--odrder-searh-data-wrapper')
    toggleButton.addEventListener('click', ()=>{
        const stateAttribute = stateHolder.getAttribute('tpi-sto-current-state')
        if(stateAttribute === 'visible'){
            stateHolder.setAttribute('tpi-sto-current-state', 'hidden')
        }else if(stateAttribute === 'hidden'){
            stateHolder.setAttribute('tpi-sto-current-state', 'visible')
        } else{
            alert('❌ wrong attribute error')
        }
    })
}

function tpi_sto_grabAndDrag_floatingWindow(){
    const floatingWrapper = document.querySelector('.tpi-sto--floating-search-wrapper');
    const container = document.querySelector('.tpi-sto--custom-fulPage');
    const sectionBlock = document.querySelector('.tpi-sto--section-block');

    if (floatingWrapper && container && sectionBlock) {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;
        
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollAnimationFrame = null;
        
        function canDrag() {
            const currentState = sectionBlock.getAttribute('tpi-sto-current-state');
            return currentState === 'floating';
        }
        
        floatingWrapper.style.transition = 'none';
        
        function canStartDrag(element) {
            if (!canDrag()) return false;
            
            if (element.closest('button') || 
                element.closest('textarea') || 
                element.closest('.tpi-sto--odrder-searh-data-container')) {
                return false;
            }
            
            return element.closest('.tpi-sto--floating-search-wrapper') === floatingWrapper ||
                element.closest('.tpi-sto--section-wrapper-title.tpi-sto--floating-wrapper-title');
        }
        
        function disableSelection() {
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.cursor = 'grabbing';
            
        }
        
        function enableSelection() {
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.cursor = '';
        }
        
        function checkBoundaries() {
            const containerRect = container.getBoundingClientRect();
            const wrapperRect = floatingWrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const maxX = containerRect.width - wrapperRect.width - 5;
            const maxY = containerRect.height - wrapperRect.height - 5;
            
            let currentX = parseInt(floatingWrapper.style.left) || 0;
            let currentY = parseInt(floatingWrapper.style.top) || 0;
            
            currentX = Math.max(5, Math.min(currentX, maxX));
            currentY = Math.max(5, Math.min(currentY, maxY));
            
            if (containerRect.height > viewportHeight) {
                const wrapperAbsoluteTop = currentY + containerRect.top;
                const wrapperBottom = wrapperAbsoluteTop + wrapperRect.height;
                
                const maxVisibleBottom = viewportHeight - 15;
                
                if (wrapperBottom > maxVisibleBottom) {
                    const correction = wrapperBottom - maxVisibleBottom;
                    currentY = Math.max(5, currentY - correction);
                }
                
                if (wrapperAbsoluteTop < minVisibleTop) {
                    const correction = minVisibleTop - wrapperAbsoluteTop;
                    currentY = Math.min(maxY, currentY + correction);
                }
            }
            
            floatingWrapper.style.left = currentX + 'px';
            floatingWrapper.style.top = currentY + 'px';
        }
        
        window.addEventListener('scroll', (e) => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDiff = currentScrollTop - lastScrollTop;

            if (isDragging) {
                initialTop += scrollDiff;
                floatingWrapper.style.top = (parseInt(floatingWrapper.style.top) + scrollDiff) + 'px';
            } else {
                if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
                scrollAnimationFrame = requestAnimationFrame(() => {
                    const currentTop = parseInt(floatingWrapper.style.top) || 0;
                    floatingWrapper.style.top = (currentTop + scrollDiff) + 'px';
                    checkBoundaries();
                });
            }

            lastScrollTop = currentScrollTop;
        }, { passive: true });
        
        document.addEventListener('mousedown', function(e) {
            if (!canStartDrag(e.target)) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const computedStyle = getComputedStyle(floatingWrapper);
            initialLeft = parseInt(computedStyle.left) || 0;
            initialTop = parseInt(computedStyle.top) || 0;
            
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            floatingWrapper.classList.add('tpi-sto--floating-search-wrapper-grabbing');
            
            disableSelection();
            
            function onMouseMove(e) {
                if (!isDragging) return;
                
                if (scrollAnimationFrame) {
                    cancelAnimationFrame(scrollAnimationFrame);
                }
                
                scrollAnimationFrame = requestAnimationFrame(() => {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    let newX = initialLeft + deltaX;
                    let newY = initialTop + deltaY;
                    
                    floatingWrapper.style.left = newX + 'px';
                    floatingWrapper.style.top = newY + 'px';
                    
                    checkBoundaries();
                });
            }
            
            function onMouseUp() {
                isDragging = false;
                
                floatingWrapper.classList.remove('tpi-sto--floating-search-wrapper-grabbing');
                
                enableSelection();
                
                checkBoundaries();
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        checkBoundaries();
        
        window.addEventListener('resize', checkBoundaries);
    }
}

function tpi_sto_switchFloatingTextareaPin(){
    const mainSection = document.querySelector('.tpi-sto--section-block')
    const pinSwitcher = document.querySelector('.tpi-sto--switch-pin-floating-window-switch')
    const floatingWindow = document.querySelector('.tpi-sto--floating-search-wrapper')
    const switchButton = document.querySelector('.tpi-sto--switch-size-window-switch')
    const otherSection = document.querySelector('.tpi-sto--main-section-wrapper')
    pinSwitcher.addEventListener('click', ()=>{
        const attributeData = mainSection.getAttribute('tpi-sto-current-state')
        if(attributeData === 'floating'){
            mainSection.setAttribute('tpi-sto-current-state', 'default')
            pinSwitcher.innerHTML = `${tpiIcon__unPin}`
            otherSection.classList.add('tpi-sto--floating-animatedZindex')
            switchButton.style.display = 'none'
            setTimeout(() => {
                otherSection.classList.remove('tpi-sto--floating-animatedZindex')
            }, 310);
        }else{
            mainSection.setAttribute('tpi-sto-current-state', 'floating')
            pinSwitcher.innerHTML = `${tpi_sto_icon_pin}`
            switchButton.style.display = 'flex'
            setTimeout(() => {
                switchButton.style.animation = 'tpiFloatingWindowSize-switch 300ms ease-in-out'
            }, 1);
        }
    })
}

function tpi_sto_changeFloatingWindowSize() {
    const floatingWrapper = document.querySelector('.tpi-sto--floating-search-wrapper');
    const switchButton = document.querySelector('.tpi-sto--switch-size-window-switch');
    let hoverTimeout;
    let mouseOnFloatingWindow = false;
    let isAnimating = false; // 🔹 защита от обрывов
    let queuedState = null; // 🔹 если пришло новое действие — запомним и выполним после

    switchButton.addEventListener('click', () => {
        const state = switchButton.getAttribute('tpi-sto-current-state');
        if (state === 'marked') {
            switchButton.setAttribute('tpi-sto-current-state', 'unmarked');
            switchButton.innerHTML = `${tpi_sto_icon_decrease}`;
            if (!mouseOnFloatingWindow) requestAnimation('default');
        } else {
            switchButton.setAttribute('tpi-sto-current-state', 'marked');
            switchButton.innerHTML = `${tpi_sto_icon_increase}`;
            floatingWrapper.setAttribute('tpi-sto-current-state', 'minimized');
            if (!mouseOnFloatingWindow) requestAnimation('minimized');
        }
    });

    floatingWrapper.addEventListener('mouseenter', () => {
        mouseOnFloatingWindow = true;
        clearTimeout(hoverTimeout);
        const state = switchButton.getAttribute('tpi-sto-current-state');
        if (state === 'marked') hoverTimeout = setTimeout(() => requestAnimation('default'), 100);
    });

    floatingWrapper.addEventListener('mouseleave', () => {
        mouseOnFloatingWindow = false;
        clearTimeout(hoverTimeout);
        const state = switchButton.getAttribute('tpi-sto-current-state');
        if (state === 'marked') hoverTimeout = setTimeout(() => requestAnimation('minimized'), 200);
    });

    function requestAnimation(target) {
        if (isAnimating) {
            queuedState = target;
            return;
        }
        if (target === 'minimized') animateFloatingWindow_minimized();
        if (target === 'default') animateFloatingWindow_default();
    }

    function animateFloatingWindow_minimized() {
        isAnimating = true;
        floatingWrapper.setAttribute('tpi-sto-animate-state', 'animate');
        setTimeout(() => {
            floatingWrapper.setAttribute('tpi-sto-animate-state', 'hidden');
            endAnimation();
        }, 300);
    }

    function animateFloatingWindow_default() {
        isAnimating = true;
        floatingWrapper.setAttribute('tpi-sto-animate-state', 'animate');
        setTimeout(() => {
            floatingWrapper.setAttribute('tpi-sto-animate-state', 'animate-reversed');
            setTimeout(() => {
                floatingWrapper.setAttribute('tpi-sto-animate-state', 'default');
                endAnimation();
            }, 300);
        }, 10);
    }

    function endAnimation() {
        isAnimating = false;
        if (queuedState) {
            const next = queuedState;
            queuedState = null;
        }
    }
}

function tpi_sto_settingsOverflowControl(){
    const settingsContainer = document.querySelector(".tpi-sto-settings-container");
    const settingsArrowLeft = document.querySelector('.tpi-sto--settings-arrow[tpi-sto-settings-move="left"]');
    const settingsArrowRight = document.querySelector('.tpi-sto--settings-arrow[tpi-sto-settings-move="right"]');

    function updateArrowsVisibility() {
        const maxScroll = settingsContainer.scrollWidth - settingsContainer.clientWidth;

        settingsArrowLeft.hidden = settingsContainer.scrollLeft <= 2;

        settingsArrowRight.hidden = settingsContainer.scrollLeft >= maxScroll - 2;
    }

    settingsArrowLeft.addEventListener("click", () => {
        settingsContainer.scrollLeft -= 180;
    });
    settingsArrowRight.addEventListener("click", () => {
        settingsContainer.scrollLeft += 180;
    });

    settingsContainer.addEventListener("scroll", updateArrowsVisibility);
    window.addEventListener('resize', updateArrowsVisibility)
    updateArrowsVisibility();
}

function tpi_sto_settingsClickListeners(){
    const sto_settingsWrapper = document.querySelector('.tpi-sto--section-wrapper.tpi-sto--search-settings-wrapper')
    const sto_visibilitySwitcher = document.querySelector('.tpi-sto--settings-toggle')
    const sto_pinSwitcher = document.querySelector('.tpi-sto--settings-switch-pin-sticky')
    const tpi_settings_option_1 = document.getElementById('tpi-sto--settings-option-1')
    const tpi_settings_option_3 = document.getElementById('tpi-sto--settings-option-3')
    const tpi_settings_option_4 = document.getElementById('tpi-sto--settings-option-4')
    const tpi_settings_option_5 = document.getElementById('tpi-sto--settings-option-5')
    const tpi_settings_option_6 = document.getElementById('tpi-sto--settings-option-6')
    const tpi_settings_option_7 = document.getElementById('tpi-sto--settings-option-7')

    sto_settingsWrapper.addEventListener('click', (event) => {
        if (sto_visibilitySwitcher.contains(event.target)) {
            const sto_settings_rawAttribute = sto_visibilitySwitcher.getAttribute('tpi-sto-current-state')
            if(sto_settings_rawAttribute == 'visible'){
                sto_visibilitySwitcher.setAttribute('tpi-sto-current-state', 'hidden')
            }else{
                sto_visibilitySwitcher.setAttribute('tpi-sto-current-state', 'visible')
            }
        }else if(sto_pinSwitcher.contains(event.target)) {
            const sto_settings_rawAttribute = sto_pinSwitcher.getAttribute('tpi-sto-current-state')
            if(sto_settings_rawAttribute == 'marked'){
                sto_pinSwitcher.setAttribute('tpi-sto-current-state', 'unmarked')
                sto_pinSwitcher.innerHTML = tpiIcon__unPin
            }else{
                sto_pinSwitcher.setAttribute('tpi-sto-current-state', 'marked')
                sto_pinSwitcher.innerHTML = tpi_sto_icon_pin
            }
        }else if(tpi_settings_option_1.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-stop-extended-status-animation')
            
            if(tpi_settings_option_1.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-stop-extended-status-animation')
            }else if(!tpi_settings_option_1.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-stop-extended-status-animation', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_1.checked){
                    tpi_sto__tbody.removeAttribute('tpi-stop-extended-status-animation')
                }else{
                    tpi_sto__tbody.setAttribute('tpi-stop-extended-status-animation', '')
                }
            }
        }
        // else if(tpi_settings_option_2.contains(event.target)) {
        //     const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper');
        //     const tpi_sto__thead = document.querySelector('.tpi-sto--table-thead-wrapper');
        //     const isCurrentlyHidden = tpi_sto__tbody.hasAttribute('tpi-hidden-return-barcode');
            
            // if(tpi_settings_option_2.checked){
            //     // Показать колонку
            //     tpi_sto__tbody.removeAttribute('tpi-hidden-return-barcode');
            //     tpi_sto__thead.removeAttribute('tpi-hidden-return-barcode');
                
            //     // Показать все ячейки
            //     document.querySelectorAll('[tpi-sto-tbody-return-sortable]').forEach(cell => {
            //         cell.style.display = '';
            //     });
            // } else {
            //     // Скрыть колонку
            //     tpi_sto__tbody.setAttribute('tpi-hidden-return-barcode', '');
            //     tpi_sto__thead.setAttribute('tpi-hidden-return-barcode', '');
                
            //     setTimeout(() => {
            //         if(!tpi_settings_option_2.checked){
            //             document.querySelectorAll('[tpi-sto-tbody-return-sortable]').forEach(cell => {
            //                 cell.style.display = 'none';
            //             });
            //         }
            //     }, 750);
            // }
        // }
        else if(tpi_settings_option_3.contains(event.target)) {
            const tpi_sto__contentSection = document.querySelector('.tpi-sto--content-section')
            const sto_option_rawAttribute = tpi_sto__contentSection.hasAttribute('tpi-hide-liquid-glass-effect')
            
            if(tpi_settings_option_3.checked && sto_option_rawAttribute){
                tpi_sto__contentSection.removeAttribute('tpi-hide-liquid-glass-effect')
            }else if(!tpi_settings_option_3.checked && sto_option_rawAttribute){
                tpi_sto__contentSection.setAttribute('tpi-hide-liquid-glass-effect', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_3.checked){
                    tpi_sto__contentSection.removeAttribute('tpi-hide-liquid-glass-effect')
                }else{
                    tpi_sto__contentSection.setAttribute('tpi-hide-liquid-glass-effect', '')
                }
            }
        }else if(tpi_settings_option_4.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-hide-extra-icons')
            
            if(tpi_settings_option_4.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-hide-extra-icons')
            }else if(!tpi_settings_option_4.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-hide-extra-icons', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_4.checked){
                    tpi_sto__tbody.removeAttribute('tpi-hide-extra-icons')
                }else{
                    tpi_sto__tbody.setAttribute('tpi-hide-extra-icons', '')
                }
            }
        }else if(tpi_settings_option_5.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-extra-grid')
            
            if(tpi_settings_option_5.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-extra-grid', '')
            }else if(!tpi_settings_option_5.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-extra-grid')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_5.checked){
                    tpi_sto__tbody.setAttribute('tpi-extra-grid', '')
                }else{
                    tpi_sto__tbody.removeAttribute('tpi-extra-grid')
                }
            }
        }else if(tpi_settings_option_6.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-hide-extra-option-buttons')
            
            if(tpi_settings_option_6.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-hide-extra-option-buttons', '')
            }else if(!tpi_settings_option_6.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-hide-extra-option-buttons')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_6.checked){
                    tpi_sto__tbody.setAttribute('tpi-hide-extra-option-buttons', '')
                }else{
                    tpi_sto__tbody.removeAttribute('tpi-hide-extra-option-buttons')
                }
            }
        }else if(tpi_settings_option_7.contains(event.target)) {
            const tpi_sto__tbody = document.querySelector('.tpi-sto--table-tbody-wrapper')
            const sto_option_rawAttribute = tpi_sto__tbody.hasAttribute('tpi-hide-null-cells')
            
            if(tpi_settings_option_7.checked && sto_option_rawAttribute){
                tpi_sto__tbody.removeAttribute('tpi-hide-null-cells')
            }else if(!tpi_settings_option_7.checked && sto_option_rawAttribute){
                tpi_sto__tbody.setAttribute('tpi-hide-null-cells', '')
            }else if(!sto_option_rawAttribute){
                if(tpi_settings_option_7.checked){
                    tpi_sto__tbody.removeAttribute('tpi-hide-null-cells')
                }else{
                    tpi_sto__tbody.setAttribute('tpi-hide-null-cells', '')
                }
            }
        }
    });
}

function tpi_sto_textarea_format_fix() {
    const textarea = document.querySelector('.tpi--sto-textarea-data-container');
    if (!textarea) return;

    function getLines() { return textarea.value.split('\n'); }
    function setLines(lines, cursorPos) {
        textarea.value = lines.join('\n');
        if (cursorPos !== undefined) textarea.setSelectionRange(cursorPos, cursorPos);
    }
    function getLineIndex(pos) {
        const lines = getLines();
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            const len = lines[i].length;
            if (pos <= count + len) return i;
            count += len + 1;
        }
        return lines.length - 1;
    }
    function getLineStart(idx) {
        const lines = getLines();
        let pos = 0;
        for (let i = 0; i < idx; i++) pos += lines[i].length + 1;
        return pos;
    }
    function getLineEnd(idx) {
        const lines = getLines();
        let pos = 0;
        for (let i = 0; i <= idx; i++) pos += lines[i].length + 1;
        return pos - 1; 
    }

    textarea.addEventListener('keydown', function(e) {
        const key = e.key, shift = e.shiftKey, alt = e.altKey, ctrl = e.ctrlKey || e.metaKey;
        const pos = textarea.selectionStart;

        //! Удаление строки (Shift+Delete)
        if (key === 'Delete' && shift && !alt && !ctrl) {
            e.preventDefault();
            const lines = getLines();
            const idx = getLineIndex(pos);
            if (lines.length === 1) return;
            lines.splice(idx, 1);
            const newPos = (idx < lines.length) ? getLineStart(idx) : getLineStart(lines.length - 1) + lines[lines.length - 1].length;
            setLines(lines, newPos);
            return;
        }

        //! Перемещение строки вверх (Alt+↑)
        if (key === 'ArrowUp' && alt && !shift && !ctrl) {
            e.preventDefault();
            const lines = getLines();
            const idx = getLineIndex(pos);
            if (idx === 0) return;
            [lines[idx - 1], lines[idx]] = [lines[idx], lines[idx - 1]];
            setLines(lines, getLineStart(idx - 1) + lines[idx - 1].length);
            return;
        }

        //! Перемещение строки вниз (Alt+↓)
        if (key === 'ArrowDown' && alt && !shift && !ctrl) {
            e.preventDefault();
            const lines = getLines();
            const idx = getLineIndex(pos);
            if (idx === lines.length - 1) return;
            [lines[idx], lines[idx + 1]] = [lines[idx + 1], lines[idx]];
            setLines(lines, getLineStart(idx + 1) + lines[idx + 1].length);
            return;
        }

        //! Пробел в конце строки → перенос на новую строку
        if (key === ' ' && !shift && !alt && !ctrl) {
            const idx = getLineIndex(pos);
            const lineEnd = getLineEnd(idx);
            if (pos === lineEnd + 1) {
                e.preventDefault();
                const before = textarea.value.substring(0, pos);
                const after = textarea.value.substring(pos);
                textarea.value = before + '\n' + after;
                textarea.setSelectionRange(pos + 1, pos + 1);
            }
        }
    });

    //! Вставка из Excel – табуляция заменяется на перевод строки
    textarea.addEventListener('paste', function(e) {
        const clipboard = (e.clipboardData || window.clipboardData).getData('text');
        if (clipboard.includes('\t')) {
            e.preventDefault();
            const processed = clipboard.replace(/\t/g, '\n');
            document.execCommand('insertText', false, processed);
        }
    });
}