// @ Установка
// ?
// ? tpiPDFtoOrders → → → Ключ ссылки
// ? checkiIs__onOrdersToPDF_page → → → имя функции вставки
// ? tpi-otp-wrapper → → → имя класса новой разметки
// ? Заказы из PDF → → → Название новой страницы (title)
// ? tpi_otp_add_listeners → → → Название функции для подключения слушателей
// ?

let selected_type = null;
let pdfJSScriptLoaded = false;
let pdfJSScriptLoading = false;

function tpi_loadPDFJS() {
    if (typeof window.pdfjsLib !== 'undefined') {
        console.log('✅ PDF.js уже загружена');
        return Promise.resolve();
    }

    return import(chrome.runtime.getURL('libs/pdf.mjs'))
        .then(module => {
            window.pdfjsLib = module;
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('libs/pdf.worker.mjs');
            console.log('✅ PDF.js загружена как модуль');
        })
        .catch(err => {
            console.error('❌ Ошибка загрузки PDF.js:', err);
            throw new Error('Не удалось загрузить PDF.js');
        });
}

async function tpi_extractTextFromFirstPage(arrayBuffer) {
    await tpi_loadPDFJS();
    const pdfjs = window.pdfjsLib;
    if (!pdfjs) throw new Error('PDF.js не загружена');

    const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
    });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    return content.items.map(item => item.str).join(' ').trim();
}

const tpi_i_file_pdf = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"></path>
</svg>
`,
tpi_otp_i_arrow_drop = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 12h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-3h6v3z"/>
    <path d="M15 3h-6"/>
    <path d="M15 6h-6"/>
</svg>

`,
tpi_otp_i_file_type = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z"></path>
    <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clip-rule="evenodd"></path>
    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"></path>
</svg>
`,
tpi_otp_icon_lot = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 64H257.6L76.5 251.6c-8 8-12.3 18.5-12.5 29-.3 11.3 3.9 22.6 12.5 31.2l123.7 123.6c8 8 20.8 12.5 28.8 12.5s22.8-3.9 31.4-12.5L448 256V96l-32-32zm-30.7 102.7c-21.7 6.1-41.3-10-41.3-30.7 0-17.7 14.3-32 32-32 20.7 0 36.8 19.6 30.7 41.3-2.9 10.3-11.1 18.5-21.4 21.4z"></path>
</svg>
`,
tpi_otp_icon_cevron_left = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
</svg>
`,
tpi_otp_icon_cevron_right = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
</svg>

`,
tpi_otp_icon_trash = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16">
    <path fill="currentColor" d="M5.386 6h1.806l.219 7H5.886zm3.206 7 .218-7h1.814l-.5 7z"></path>
    <path fill="currentColor" fill-rule="evenodd" d="M7.837.014h.303c.71-.001 1.333-.002 1.881.22a3 3 0 0 1 1.257.962c.36.47.522 1.072.707 1.758l.012.046H15v2l-.96.48-.585 5.922c-.177 1.787-.265 2.68-.72 3.326a3 3 0 0 1-.975.883C11.073 16 10.175 16 8.38 16h-.76c-1.795 0-2.693 0-3.38-.39a3 3 0 0 1-.974-.882c-.456-.646-.544-1.54-.72-3.326L1.96 5.48 1 5V3h2.98l.012-.046c.185-.686.347-1.287.706-1.758A3 3 0 0 1 5.955.235C6.503.012 7.126.013 7.837.015M3.922 5l.614 6.205c.092.93.15 1.494.23 1.911.036.194.07.308.095.376.022.06.037.08.04.084.085.12.196.221.324.294a.3.3 0 0 0 .088.031c.07.018.187.04.383.059.423.038.99.04 1.925.04h.758c.935 0 1.502-.002 1.925-.04.196-.018.313-.04.383-.059.062-.016.083-.028.088-.03a1 1 0 0 0 .325-.295c.002-.004.017-.024.039-.084a2.4 2.4 0 0 0 .096-.376c.08-.417.138-.981.23-1.91L12.077 5zm5.766-2.592c.063.084.116.2.232.592H6.057c.115-.393.168-.508.232-.592a1 1 0 0 1 .419-.32c.137-.056.327-.074 1.28-.074s1.144.018 1.28.074a1 1 0 0 1 .42.32" clip-rule="evenodd"></path>
</svg>
`,
tpi_otp_icon_document_app_courier = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512">
	<path d="M306.38,115.54c-15.15-12.11-33.97-18.71-53.37-18.71-47.22,0-85.5,38.28-85.5,85.51,0,19.4,6.6,38.22,18.71,53.37,8.67-13.97,27.76-28.95,66.79-28.95s58.1,14.96,66.79,28.95c29.48-36.89,23.47-90.69-13.42-120.17ZM253.01,194.54c-20.24,0-36.64-16.41-36.64-36.64s16.41-36.64,36.64-36.64,36.64,16.41,36.64,36.64-16.41,36.64-36.64,36.64ZM190.64,362.68h-4.34l-31.7,85.31h18.69l5.9-17.99h30.66l5.92,17.99h18.75l-31.88-85.31h-12.01ZM205.33,416.23h-21.62l10.79-32.9,10.82,32.9ZM391.97,447.99v-85.31h-69.43v85.31h17.58v-71.54h34.34v71.54h17.52ZM444.18,334.92v-160.12c0-16.65-6.62-32.63-18.4-44.4l-107.2-107.2c-11.77-11.78-27.75-18.4-44.4-18.4h-144.01c-34.68,0-62.8,28.12-62.8,62.8v376.81c0,34.68,28.12,62.8,62.8,62.8h251.21c23.26,0,43.55-12.65,54.4-31.44-.05,0-.1,0-.15,0H173.68c-24,0-43.45-19.45-43.45-43.45v-54.79c0-24,19.45-43.45,43.45-43.45h261.96c2.93,0,5.78.29,8.54.84ZM253.01,280.05c-53.97,0-97.72-43.75-97.72-97.72s43.75-97.72,97.72-97.72,97.72,43.75,97.72,97.72-43.75,97.72-97.72,97.72ZM309.53,447.99v-85.31h-69.43v85.31h17.58v-71.54h34.34v71.54h17.52Z" fill-rule="evenodd"/>
</svg>
`,
tpi_otp_icon_document_eapp_courier = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
	<path d="M384.94,447.99v-85.31h-69.43v85.31h17.58v-71.54h34.34v71.54h17.52ZM173.68,475.77c-24,0-43.45-19.45-43.45-43.45v-54.79c0-24,19.45-43.45,43.45-43.45h261.96c2.93,0,5.78.29,8.54.84v-160.12c0-16.65-6.62-32.63-18.4-44.4l-107.2-107.2c-11.77-11.78-27.75-18.4-44.4-18.4h-144.01c-34.68,0-62.8,28.12-62.8,62.8v376.81c0,34.68,28.12,62.8,62.8,62.8h251.21c23.26,0,43.55-12.65,54.4-31.44-.05,0-.1,0-.15,0H173.68ZM253.01,84.61c53.97,0,97.72,43.75,97.72,97.72s-43.75,97.72-97.72,97.72-97.72-43.75-97.72-97.72,43.75-97.72,97.72-97.72ZM253.01,206.76c39.03,0,58.1,14.96,66.79,28.95,29.48-36.89,23.47-90.69-13.42-120.17-15.15-12.11-33.97-18.71-53.37-18.71-47.22,0-85.5,38.28-85.5,85.51,0,19.4,6.6,38.22,18.71,53.37,8.67-13.97,27.76-28.95,66.79-28.95ZM253.01,121.26c20.24,0,36.64,16.41,36.64,36.64s-16.41,36.64-36.64,36.64-36.64-16.41-36.64-36.64,16.41-36.64,36.64-36.64ZM205.55,428.57c-1.43,2.29-3.25,4.02-5.48,5.21-2.23,1.19-4.9,1.79-8.03,1.79-3.67,0-6.7-.61-9.08-1.82-2.38-1.21-4.21-2.99-5.48-5.33-1.27-2.34-2.04-5.25-2.31-8.73h-17.52c.43,5.78,2.04,10.89,4.83,15.32,2.79,4.43,6.68,7.91,11.66,10.43s10.95,3.78,17.9,3.78c5.47,0,10.37-.96,14.71-2.87s8.03-4.64,11.07-8.17c3.05-3.54,5.37-7.82,6.97-12.86,1.6-5.04,2.4-10.7,2.4-16.99v-5.8c0-6.29-.82-11.95-2.46-16.99s-4-9.35-7.09-12.95c-3.09-3.59-6.81-6.34-11.16-8.23-4.36-1.89-9.23-2.84-14.62-2.84-7.11,0-13.11,1.29-17.99,3.87-4.88,2.58-8.68,6.12-11.4,10.63-2.72,4.51-4.35,9.68-4.89,15.5h17.52c.27-3.44.99-6.37,2.14-8.79,1.15-2.42,2.91-4.27,5.27-5.54,2.36-1.27,5.48-1.9,9.35-1.9,2.34,0,4.46.36,6.36,1.08,1.89.72,3.56,1.8,5.01,3.22,1.44,1.43,2.65,3.22,3.6,5.39.96,2.17,1.68,4.71,2.17,7.62.3,1.82.5,3.79.62,5.89h-26.84v13.77h26.84c-.15,2.83-.44,5.44-.92,7.79-.68,3.4-1.74,6.24-3.16,8.53ZM266.05,362.68h-4.34l-31.7,85.31h18.69l5.9-17.99h30.66l5.92,17.99h18.75l-31.88-85.31h-12.01ZM280.75,416.23h-21.62l10.79-32.9,10.82,32.9ZM397.95,362.68v85.31h17.58v-71.54h34.34v71.54h17.52v-85.31h-69.43Z" fill-rule="evenodd"/>
</svg>
`,
tpi_otp_icon_document_eapp_roadway = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
	<path d="M337.12,171.08l-28.17-28.17h-18.47v34.98h46.64v-6.81ZM313.8,218.71c-9.66,0-17.49,7.83-17.49,17.49s7.83,17.49,17.49,17.49,17.49-7.83,17.49-17.49-7.83-17.49-17.49-17.49ZM173.68,475.77c-24,0-43.45-19.45-43.45-43.45v-54.79c0-24,19.45-43.45,43.45-43.45h261.96c2.93,0,5.78.29,8.54.84v-160.12c0-16.65-6.62-32.63-18.4-44.4l-107.2-107.2c-11.77-11.78-27.75-18.4-44.4-18.4h-144.01c-34.68,0-62.8,28.12-62.8,62.8v376.81c0,34.68,28.12,62.8,62.8,62.8h251.21c23.26,0,43.55-12.65,54.4-31.44-.05,0-.1,0-.15,0H173.68ZM226.35,154.58h-69.96c-3.21,0-5.83-2.62-5.83-5.83s2.62-5.83,5.83-5.83h81.62c3.21,0,5.83-2.62,5.83-5.83s-2.62-5.83-5.83-5.83h-93.28c-3.21,0-5.83-2.62-5.83-5.83s2.62-5.83,5.83-5.83h17.49v-17.49c0-9.66,7.83-17.49,17.49-17.49h93.28c9.66,0,17.49,7.83,17.49,17.49v17.49h18.47c6.19,0,12.13,2.44,16.51,6.81l28.17,28.17c4.37,4.37,6.81,10.31,6.81,16.51v41.8c6.45,0,11.66,5.21,11.66,11.66s-5.21,11.66-11.66,11.66h-11.66c0,19.31-15.67,34.98-34.98,34.98s-34.98-15.67-34.98-34.98h-46.64c0,19.31-15.67,34.98-34.98,34.98s-34.98-15.67-34.98-34.98v-46.64h52.47c3.21,0,5.83-2.62,5.83-5.83s-2.62-5.83-5.83-5.83h-69.96c-3.21,0-5.83-2.62-5.83-5.83s2.62-5.83,5.83-5.83h81.62c3.21,0,5.83-2.62,5.83-5.83s-2.62-5.83-5.83-5.83ZM197.2,218.71c-9.66,0-17.49,7.83-17.49,17.49s7.83,17.49,17.49,17.49,17.49-7.83,17.49-17.49-7.83-17.49-17.49-17.49ZM205.55,428.57c-1.43,2.29-3.25,4.02-5.48,5.21-2.23,1.19-4.9,1.79-8.03,1.79-3.67,0-6.7-.61-9.08-1.82-2.38-1.21-4.21-2.99-5.48-5.33-1.27-2.34-2.04-5.25-2.31-8.73h-17.52c.43,5.78,2.04,10.89,4.83,15.32,2.79,4.43,6.68,7.91,11.66,10.43s10.95,3.78,17.9,3.78c5.47,0,10.37-.96,14.71-2.87s8.03-4.64,11.07-8.17c3.05-3.54,5.37-7.82,6.97-12.86,1.6-5.04,2.4-10.7,2.4-16.99v-5.8c0-6.29-.82-11.95-2.46-16.99s-4-9.35-7.09-12.95c-3.09-3.59-6.81-6.34-11.16-8.23-4.36-1.89-9.23-2.84-14.62-2.84-7.11,0-13.11,1.29-17.99,3.87-4.88,2.58-8.68,6.12-11.4,10.63-2.72,4.51-4.35,9.68-4.89,15.5h17.52c.27-3.44.99-6.37,2.14-8.79,1.15-2.42,2.91-4.27,5.27-5.54,2.36-1.27,5.48-1.9,9.35-1.9,2.34,0,4.46.36,6.36,1.08,1.89.72,3.56,1.8,5.01,3.22,1.44,1.43,2.65,3.22,3.6,5.39.96,2.17,1.68,4.71,2.17,7.62.3,1.82.5,3.79.62,5.89h-26.84v13.77h26.84c-.15,2.83-.44,5.44-.92,7.79-.68,3.4-1.74,6.24-3.16,8.53ZM266.05,362.68h-4.34l-31.7,85.31h18.69l5.9-17.99h30.66l5.92,17.99h18.75l-31.88-85.31h-12.01ZM280.75,416.23h-21.62l10.79-32.9,10.82,32.9ZM397.95,362.68v85.31h17.58v-71.54h34.34v71.54h17.52v-85.31h-69.43ZM384.94,447.99v-85.31h-69.43v85.31h17.58v-71.54h34.34v71.54h17.52Z"/>
</svg>
`,
tpi_otp_icon_change_file = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512">
    <path id="tpi_icon_change_file_arrows" d="M421.55,325.66c34.73-82.24,3.56-179.4-75.76-225.19-57.31-33.09-125.29-31-178.91-.42l-22.28-38.99c67.03-38.22,151.99-40.83,223.64.53,100.81,58.2,139.4,182.79,92.43,286.66l30.12,17.39-93.5,49.7-3.7-105.83,27.96,16.14ZM90.45,186.34c-34.73,82.24-3.56,179.4,75.76,225.19,57.31,33.09,125.29,31,178.91.43l22.28,38.99c-67.03,38.21-151.99,40.83-223.63-.53C42.94,392.21,4.35,267.63,51.32,163.75l-30.12-17.39,93.5-49.7,3.71,105.83-27.96-16.14Z"/>
   <path id="tpi_icon_change_file_document" d="M341.33,192.79l-53.95-53.95c-5.93-5.93-13.96-9.26-22.34-9.26h-72.47c-17.45,0-31.6,14.15-31.6,31.6v189.63c0,17.45,14.15,31.6,31.6,31.6h126.42c17.45,0,31.6-14.15,31.6-31.6v-135.68c0-8.38-3.33-16.42-9.26-22.34ZM317.2,305.03c0,5.6-4.54,10.13-10.13,10.13h-103.15c-5.6,0-10.13-4.54-10.13-10.13h0c0-5.6,4.54-10.13,10.13-10.13h103.15c5.6,0,10.13,4.54,10.13,10.13h0ZM317.7,264.51c0,5.6-4.54,10.13-10.13,10.13h-103.15c-5.6,0-10.13-4.54-10.13-10.13h0c0-5.6,4.54-10.13,10.13-10.13h103.15c5.6,0,10.13,4.54,10.13,10.13h0Z"/>
</svg>
`
;

function checkiIs__onOrdersToPDF_page() {
    'use strict';

    // Функция проверки URL
    function isSettingsPage(url) {
        const base = 'https://logistics.market.yandex.ru/sorting-center/21972131/orders/tpiPDFtoOrders?tpiPDFtoOrders=true';
        if (!url.startsWith(base)) return false;
        
        const params = new URLSearchParams(url.split('?')[1] || '');
        return params.get('tpiPDFtoOrders') === 'true' 
    }

    initTooltips();

    function addTurboBlock() {
        if (document.querySelector('.tpi-otp-wrapper')) return;

        document.title = "Заказы из PDF"

        const overlay = document.createElement('div');
        overlay.className = 'tpi-otp-wrapper';

        overlay.innerHTML = /*html*/ `
        <div class="tpi-otp-wrapper-title">
            Заказы из PDF
        </div>
        <div class="tpi-otp-content-block">
            <div class="tpi-otp-container" tpi-otp-container-id="0">
                <div class="tpi-otp-section" tpi-current-section="file-input">
                    <div class="tpi-otp-section-block">
                        <div class="tpi-otp-section-title">
                            <p>Выбор файла</p>
                        </div>
                        <div class="tpi-otp-section-container" tpi-current-section="file-input">
                            <label class="tpi-otp-file-input-wrapper" for="tpi_file_input">
                                <input type="file" accept=".pdf" id="tpi_file_input" placeholder="">
                                <div class="tpi-otp-default-input-wrapper">
                                    <icon>${tpi_i_file_pdf}</icon>
                                    <p class="tpi-otp-file-input-title">Загрузите файл</p>
                                </div>
                                <div class="tpi-otp-dragover-input-wrapper">
                                    <icon>${tpi_otp_i_arrow_drop}</icon>
                                </div>
                            </label>
                            <div class="tpi-otp-file-control-wrapper">
                                <div class="tpi-otp-file-list-carousel">
                                    <div class="tpi-otp-file-list-carousel-item">
                                        <icon class="tpi-otp-file-list-carousel-icon">
                                            ${tpi_otp_icon_document_app_courier}
                                            ${tpi_otp_icon_document_eapp_courier}
                                            ${tpi_otp_icon_document_eapp_roadway}
                                            ${tpi_otp_icon_change_file}
                                        </icon>
                                    </div>
                                </div>
                                <div class="tpi-otp-file-contorl-options">
                                    <button class="tpi-otp-file-control-button" tpi-otp-on-click="remove-file">
                                        <icon class="tpi-otp-file-control-button-icon">${tpi_otp_icon_trash}</icon>
                                        <p class="tpi-otp-file-control-button-text">Убрать файл</p>
                                    </button>
                                    <div class="tpi-otp-file-change-text-wrapper">
                                        <p class="tpi-otp-file-change-text">Заменить файл</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tpi-otp-section-block" tpi-otp-section-block-id="file-data-list">
                        <ul class="tpi-otp-file-input-data-wrapper">
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="document-type" style="--tpi-list-index:0">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Тип:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="sender" style="--tpi-list-index:1">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Отправитель:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="reciver" style="--tpi-list-index:2">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Получатель:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="orders-amout" style="--tpi-list-index:3">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Заказов:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="sortables-amount" style="--tpi-list-index:4">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Грузомест:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="lots-amount" style="--tpi-list-index:5">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Лотов:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="sortables-cost" style="--tpi-list-index:6">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Стоимость:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                            <li class="tpi-otp-file-input-data-list" tpi-data-type="document-date" style="--tpi-list-index:7">
                                <div class="tpi-otp-file-input-title">
                                    <p class="tpi-otp-file-input-title-title">Дата:</p>
                                </div>
                                <div class="tpi-otp-file-input-data">
                                    <p class="tpi-otp-file-input-data-title"></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="tpi-otp-section" tpi-current-section="file-lots-data">
                    <div class="tpi-otp-section-block">
                        <div class="tpi-otp-section-title">
                            <p>Лоты</p>
                        </div>
                        <div class="tpi-otp-lots-table-wrapper">
                            <table class="tpi-otp-lots-table">
                                <thead class="tpi-otp-lots-table-thead">
                                    <tr class="tpi-otp-lots-table-row">
                                        <th class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p class="tpi-otp-lots-table-item-name-index">#</p>
                                            </div>
                                        </th>
                                        <th class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p>Наименование лота</p>
                                            </div>
                                        </th>
                                        <th class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p>Статус</p>
                                            </div>
                                        </th>
                                        <th class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p>Грузомест</p>
                                            </div>
                                        </th>
                                        <th class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p>Действия</p>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="tpi-otp-lots-table-tbody">
                                    <tr class="tpi-otp-lots-table-row">
                                        <td class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p class="tpi-otp-lots-table-item-sortable-id" tpi-otp-data="sortable-index">1</p>
                                            </div>
                                        </td>
                                        <td class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <a class="tpi-otp-lots-table-item-link" draggable="false" href="#">
                                                    <icon class="tpi-otp-lots-table-item-icon">${tpi_otp_icon_lot}</icon>
                                                    <p class="tpi-otp-lots-table-item-sortable-id" tpi-otp-data="sortable-lot-id">F1254273B14031678C4E</p>
                                                </a>
                                            </div>
                                        </td>
                                        <td class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name tpi-otp-lots-table-item-status-container">
                                                <div class="tpi-otp-lots-table-item-status-wrapper" tpi-otp-custom-lot-status="default" tpi-tooltip-data="Лот привязан к отгрузке как в ПИ так и в документах корректно">
                                                    <icon class="tpi-otp-lots-table-item-status-icon"></icon>
                                                    <p class="tpi-otp-lots-table-item-status-text">Остался</p>
                                                </div>
                                                <div class="tpi-otp-lots-table-item-status-wrapper" tpi-otp-custom-lot-status="removed" tpi-tooltip-data="Лот больше не привязан к данной отгрузке, сохранился только в документах">
                                                    <icon class="tpi-otp-lots-table-item-status-icon"></icon>
                                                    <p class="tpi-otp-lots-table-item-status-text">Выпал</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <p class="tpi-otp-lots-table-item-sortable-id" tpi-otp-data="amount-sortables">212</p>
                                            </div>
                                        </td>
                                        <td class="tpi-otp-lots-table-item">
                                            <div class="tpi-otp-lots-table-item-name">
                                                <label class="tpi-otp-lots-table-checkbox-lable" for="tpi-lot-lost-select-1">
                                                    <input type="checkbox" id="tpi-lot-lost-select-1">
                                                    <div class="tpi-lot-lost-select-pin"></div>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tpi-otp-container" tpi-otp-full-size>
                <div class="tpi-otp-section" tpi-current-section="sortables-filters"">
                    <div class="tpi-otp-section-block">
                        <div class="tpi-otp-section-title">
                            <p>Фильтры</p>
                        </div>
                    </div>
                </div>
                <div class="tpi-otp-section" tpi-current-section="sortables-data">
                    <div class="tpi-otp-section-block">
                        <div class="tpi-otp-section-title">
                            <p>Грузоместа</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        
        const appID = document.getElementById("app")
        const headerTitle = document.querySelector(".p-layout__header-wrapper")
        appID.remove()
        headerTitle.remove()

        document.querySelector(".p-layout__content").appendChild(overlay);
        
        callTurboPI__once();
        addTurboPiTitle()
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }


    if (isSettingsPage(location.href)) {
        addTurboBlock();
        tpi_otp_add_listeners();
        addToastContainer()
        setTimeout(() => {
            tpiNotification.show('Заголовок', "info", `Описание`);
        }, 1);
        return; 
    }

    observer = new MutationObserver(() => {
        if (isSettingsPage(location.href)) {
            addTurboBlock();
        }
    });
    observer.observe(document, { subtree: true, childList: true });
    setTimeout(() => {
        addTurboPiTitle()
    }, 1);
}

checkiIs__onOrdersToPDF_page()

function tpi_otp_add_listeners() {
    'use strict';
    console.log('🆗 | Слушатели готовы к подключению');
    
    const fileInput = document.getElementById('tpi_file_input');
    if (!fileInput) return;
    
    fileInput.removeEventListener('change', tpi_handleFileSelect);
    fileInput.addEventListener('change', tpi_handleFileSelect);
    
    tpi_addDragAndDropSupport();
    tpi_addFileControlListeners();
    tpi_loadPDFJS();
}

async function tpi_handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        tpiNotification.show('Ошибка', 'error', 'Пожалуйста, загрузите файл в формате PDF');
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const text = await tpi_extractTextFromFirstPage(arrayBuffer);

        if (!text || text.length < 5) {
            tpiNotification.show('Ошибка', 'error', 'Не удалось извлечь текст. Возможно, PDF содержит только изображения.');
            return;
        }

        const docType = tpi_detectDocumentType(text);
        console.log(`📄 Определён тип: ${docType}`);
        tpi_updateFileInfo(text, docType);
        tpiNotification.show('Успешно', 'info', `Тип документа: ${docType}`);

    } catch (error) {
        console.error('❌ Ошибка обработки PDF:', error);
        tpiNotification.show('Ошибка', 'error', `Не удалось обработать PDF: ${error.message}`);
    }
}


function tpi_detectDocumentType(text) {
    let type = 'Неизвестный тип';
    if (text.includes('Подписано простой электронной подписью(ПЭП)')) {
        type = 'ЭАПП Магистраль';
    } else if (text.includes('Подписано простой электронной подписью')) {
        type = 'ЭАПП Курьер';
    } else if (text.includes('Курьер:')) {
        type = 'АПП Курьер';
    }

    selected_type = type;

    // Обновляем интерфейс
    const typeEl = document.querySelector('li[tpi-data-type="document-type"] p.tpi-otp-file-input-data-title');
    if (typeEl) typeEl.textContent = type;

    // Стилизация
    const container = document.querySelector('li[tpi-data-type="document-type"]');
    const filePreviewContainer = document.querySelector('.tpi-otp-file-control-wrapper');
    
    if (container) {
        container.classList.remove('tpi-type-eapp-roadway', 'tpi-type-eapp-courier', 'tpi-type-app-courier', 'tpi-type-unknown');
        const typeMap = {
            'ЭАПП Магистраль': { class: 'tpi-type-eapp-roadway', attr: 'eapp-roadway' },
            'ЭАПП Курьер': { class: 'tpi-type-eapp-courier', attr: 'eapp-courier' },
            'АПП Курьер': { class: 'tpi-type-app-courier', attr: 'app-courier' }
        };
        
        if (typeMap[type]) {
            container.classList.add(typeMap[type].class);
            if (filePreviewContainer) {
                filePreviewContainer.setAttribute('tpi-document-type', typeMap[type].attr);
            }
        } else {
            container.classList.add('tpi-type-unknown');
            if (filePreviewContainer) {
                filePreviewContainer.removeAttribute('tpi-document-type');
            }
        }
    }

    return type;
}

function tpi_addDragAndDropSupport() {
    const wrapper = document.querySelector('.tpi-otp-file-input-wrapper');
    if (!wrapper) return;
    
    wrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        wrapper.classList.add('tpi-dragover');
    });
    
    wrapper.addEventListener('dragleave', () => {
        wrapper.classList.remove('tpi-dragover');
    });
    
    wrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        wrapper.classList.remove('tpi-dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fileInput = document.getElementById('tpi_file_input');
            if (fileInput) {
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                fileInput.files = dt.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        }
    });
}

async function tpi_extractFullText(pdfDocument) {
    let fullText = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText.trim();
}

function tpi_parseAPPCourier(fullText) {
    // 1. Отправитель
    const senderMatch = fullText.match(/Отправитель[:\s]*([^,\n]+(?:,?\s*[^,\n]+)?)/i);
    if (senderMatch) {
        let sender = senderMatch[1].trim();
        const execIdx = sender.indexOf('Исполнитель');
        if (execIdx > 0) sender = sender.substring(0, execIdx).trim();
        const el = document.querySelector('li[tpi-data-type="sender"] p.tpi-otp-file-input-data-title');
        if (el) el.textContent = sender;
    }

    // 2. Получатель – имя курьера после "Курьер:"
    const courierMatch = fullText.match(/Курьер[:\s]*([^\n]+)/i);
    if (courierMatch) {
        let courier = courierMatch[1].trim();
        // Убираем всё, что похоже на "число/число" в конце (например, "4/ 8" или "9/ 13")
        courier = courier.replace(/\s*\d+\s*\/\s*\d+\s*$/, '').trim();
        // Убираем дату, если она попала (формат "27.06.2026 21:08:53")
        courier = courier.replace(/^\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}:\d{2}\s*/, '').trim();
        const el = document.querySelector('li[tpi-data-type="reciver"] p.tpi-otp-file-input-data-title');
        if (el) {
            el.textContent = courier
            el.setAttribute('tpi-tooltip-data', `${courier}`)
        };
    }

    // 3. Поиск итоговой строки "Итого ..."
    let totalLine = null;
    const totalMatch = fullText.match(/Итого\s+([\d\s.]+)/i);
    if (totalMatch) {
        totalLine = totalMatch[1].trim();
    }

    // Извлекаем числа из строки "Итого"
    let totalNumbers = [];
    if (totalLine) {
        totalNumbers = totalLine.split(/\s+/).filter(s => /^\d+(\.\d+)?$/.test(s));
    }

    // 4. Грузоместа
    let sortables = null;
    const sortablesPhrase = fullText.match(/грузовых мест[:\s]*(\d+)/i);
    if (sortablesPhrase) {
        sortables = sortablesPhrase[1];
    } else if (totalNumbers.length >= 1) {
        sortables = totalNumbers[0];
    } else {
        const sortablesMatch = fullText.match(/Грузомест[:\s]*(\d+)/i);
        if (sortablesMatch) sortables = sortablesMatch[1];
    }
    if (sortables) {
        const el = document.querySelector('li[tpi-data-type="sortables-amount"] p.tpi-otp-file-input-data-title');
        if (el) el.textContent = sortables;
    }

    // 5. Заказы
    let orders = null;
    const ordersMatch = fullText.match(/Заказов[:\s]*(\d+)/i);
    if (ordersMatch) {
        orders = ordersMatch[1];
    } else if (totalNumbers.length >= 2) {
        orders = totalNumbers[1];
    } else {
        const ordersPhrase = fullText.match(/Отправлений[:\s]*(\d+)/i);
        if (ordersPhrase) orders = ordersPhrase[1];
    }
    if (orders) {
        const el = document.querySelector('li[tpi-data-type="orders-amout"] p.tpi-otp-file-input-data-title');
        if (el) el.textContent = orders;
    }

    // 6. Лоты
    let lots = null;
    const lotsMatch = fullText.match(/лот(?:ов|ы)?[:\s]*(\d+)/i);
    if (lotsMatch) {
        lots = lotsMatch[1];
    } else {
        const occurrences = (fullText.match(/Лот\s+отгрузки/gi) || []).length;
        if (occurrences > 0) lots = String(occurrences);
    }
    if (lots) {
        const el = document.querySelector('li[tpi-data-type="lots-amount"] p.tpi-otp-file-input-data-title');
        if (el) el.textContent = lots;
    }

    // 7. Стоимость
    let cost = null;
    const costMatch = fullText.match(/Стоимость[:\s]*([\d.]+)/i);
    if (costMatch) {
        cost = costMatch[1];
    } else if (totalNumbers.length >= 4) {
        cost = totalNumbers[totalNumbers.length - 1];
    } else if (totalNumbers.length >= 3) {
        cost = totalNumbers[2];
    }
    if (cost) {
        const el = document.querySelector('li[tpi-data-type="sortables-cost"] p.tpi-otp-file-input-data-title');
        if (el) el.textContent = cost;
    }
}

async function tpi_handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        tpiNotification.show('Ошибка', 'error', 'Пожалуйста, загрузите файл в формате PDF');
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        await tpi_loadPDFJS();
        const pdfjs = window.pdfjsLib;
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const page1 = await pdf.getPage(1);
        const content1 = await page1.getTextContent();
        const textPage1 = content1.items.map(item => item.str).join(' ').trim();
        const docType = tpi_detectDocumentType(textPage1);
        console.log(`📄 Определён тип: ${docType}`);

        if (docType === 'АПП Курьер') {
            const fullText = await tpi_extractFullText(pdf);
            tpi_parseAPPCourier(fullText);
        } else {
            tpiNotification.show('Информация', 'info', `Тип "${docType}" пока не поддерживается для автоматического заполнения`);
        }

        // Добавляем класс на label
        const label = document.querySelector('.tpi-otp-file-input-wrapper');
        if (label) label.classList.add('tpi-has-file');

        tpiNotification.show('Успешно', 'info', `Тип документа: ${docType}`);

    } catch (error) {
        console.error('❌ Ошибка обработки PDF:', error);
        tpiNotification.show('Ошибка', 'error', `Не удалось обработать PDF: ${error.message}`);
    }
}

// ! Управление файлами

function tpi_addFileControlListeners() {
    const controlButtons = document.querySelectorAll('.tpi-otp-file-control-button');
    
    controlButtons.forEach(button => {
        const action = button.getAttribute('tpi-otp-on-click');
        
        // Удаляем старые слушатели, чтобы избежать дублирования
        button.removeEventListener('click', tpi_handleFileControlClick);
        button.addEventListener('click', tpi_handleFileControlClick);
    });

    tpi_addFileReplaceDropSupport();
}

function tpi_addFileReplaceDropSupport() {
    const controlWrapper = document.querySelector('.tpi-otp-file-control-wrapper');
    if (!controlWrapper) return;

    controlWrapper.removeEventListener('dragover', tpi_handleFileReplaceDragOver);
    controlWrapper.removeEventListener('dragleave', tpi_handleFileReplaceDragLeave);
    controlWrapper.removeEventListener('drop', tpi_handleFileReplaceDrop);

    controlWrapper.addEventListener('dragover', tpi_handleFileReplaceDragOver);
    controlWrapper.addEventListener('dragleave', tpi_handleFileReplaceDragLeave);
    controlWrapper.addEventListener('drop', tpi_handleFileReplaceDrop);
}

function tpi_handleFileReplaceDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const controlWrapper = event.currentTarget;
    controlWrapper.setAttribute('tpi-document-type', 'change-file');
}

function tpi_handleFileReplaceDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const relatedTarget = event.relatedTarget;
    const controlWrapper = event.currentTarget;
    
    if (relatedTarget && controlWrapper.contains(relatedTarget)) {
        return;
    }
    
    const fileInput = document.getElementById('tpi_file_input');
    
    if (fileInput && fileInput.files.length > 0) {
        const docType = selected_type || 'unknown';
        const typeMap = {
            'ЭАПП Магистраль': 'eapp-roadway',
            'ЭАПП Курьер': 'eapp-courier',
            'АПП Курьер': 'app-courier'
        };
        const typeAttr = typeMap[docType] || 'unknown';
        controlWrapper.setAttribute('tpi-document-type', typeAttr);
    } else {
        controlWrapper.removeAttribute('tpi-document-type');
    }
}

function tpi_handleFileReplaceDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const controlWrapper = event.currentTarget;
    const files = event.dataTransfer.files;
    
    if (files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
        tpiNotification.show('Ошибка', 'error', 'Пожалуйста, загрузите файл в формате PDF');
        tpi_restoreDocumentType(controlWrapper);
        return;
    }

    const fileInput = document.getElementById('tpi_file_input');
    if (!fileInput) {
        tpi_restoreDocumentType(controlWrapper);
        return;
    }

    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;

    const fileWrapper = document.querySelector('.tpi-otp-file-input-wrapper');
    if (fileWrapper) {
        fileWrapper.classList.remove('tpi-has-file');
    }

    const dataItems = document.querySelectorAll('.tpi-otp-file-input-data-title');
    dataItems.forEach(el => el.textContent = '');

    controlWrapper.setAttribute('tpi-document-type', 'change-file');

    fileInput.dispatchEvent(new Event('change'));

    setTimeout(() => {
        if (fileWrapper && fileInput.files.length > 0) {
            fileWrapper.classList.add('tpi-has-file');
        }
        tpi_restoreDocumentType(controlWrapper);
    }, 2);
}

function tpi_restoreDocumentType(controlWrapper) {
    const fileInput = document.getElementById('tpi_file_input');
    if (!controlWrapper) return;

    if (fileInput && fileInput.files.length > 0) {
        const docType = selected_type || 'unknown';
        const typeMap = {
            'ЭАПП Магистраль': 'eapp-roadway',
            'ЭАПП Курьер': 'eapp-courier',
            'АПП Курьер': 'app-courier'
        };
        const typeAttr = typeMap[docType] || 'unknown';
        controlWrapper.setAttribute('tpi-document-type', typeAttr);
    } else {
        controlWrapper.removeAttribute('tpi-document-type');
    }
}

function tpi_handleFileControlClick(event) {
    const button = event.currentTarget;
    const action = button.getAttribute('tpi-otp-on-click');
    
    switch (action) {
        case 'remove-file':
            tpi_removeFile();
            break;
        case 'move-left':
            tpi_moveFileCarousel('left');
            break;
        case 'move-right':
            tpi_moveFileCarousel('right');
            break;
        default:
            console.warn(`⚠️ Неизвестное действие: ${action}`);
    }
}

function tpi_removeFile() {
    const fileInput = document.getElementById('tpi_file_input');
    if (!fileInput) return;
    
    fileInput.value = '';
    const dt = new DataTransfer();
    fileInput.files = dt.files;
    
    const dataItems = document.querySelectorAll('.tpi-otp-file-input-data-title');
    dataItems.forEach(el => el.textContent = '');
    
    const label = document.querySelector('.tpi-otp-file-input-wrapper');
    if (label) label.classList.remove('tpi-has-file');
    
    selected_type = null;
    const typeEl = document.querySelector('li[tpi-data-type="document-type"]');
    if (typeEl) {
        typeEl.classList.remove('tpi-type-eapp-roadway', 'tpi-type-eapp-courier', 'tpi-type-app-courier', 'tpi-type-unknown');
    }
    
    const controlWrapper = document.querySelector('.tpi-otp-file-control-wrapper');
    if (controlWrapper) {
        controlWrapper.removeAttribute('tpi-document-type');
    }
    
    tpiNotification.show('Успешно', 'info', 'Файл удален');
}

function tpi_moveFileCarousel(direction) {
    // Заглушка для будущей реализации
    console.log(`🔄 Перемещение карусели: ${direction}`);
}