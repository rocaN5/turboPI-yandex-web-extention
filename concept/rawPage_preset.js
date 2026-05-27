// @ Установка
// ?
// ? tpi_name → → → Ключ ссылки
// ? tpi_function_name → → → имя функции вставки
// ? tpi_div_wrapper_class_name → → → имя класса новой разметки
// ? tpi_new_page_title → → → Название новой страницы (title)
// ? tpi_listener_function → → → Название функции для подключения слушателей
// ?

function tpi_function_name() {
    'use strict';

    // Функция проверки URL
    function isSettingsPage(url) {
        const base = 'https://logistics.market.yandex.ru/sorting-center/21972131/orders/tpi_name?tpi_name=true';
        if (!url.startsWith(base)) return false;
        
        const params = new URLSearchParams(url.split('?')[1] || '');
        return params.get('tpi_name') === 'true' 
    }

    // Функция добавления блока (и отключения наблюдателя)
    function addTurboBlock() {
        if (document.querySelector('.tpi_div_wrapper_class_name')) return;

        document.title = "tpi_new_page_title"

        const overlay = document.createElement('div');
        overlay.className = 'tpi_div_wrapper_class_name';

        overlay.innerHTML = 
        `
        <div class="tpi_div_wrapper_class_name-title">
            tpi_new_page_title
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
        tpi_listener_function();
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

tpi_function_name()

function tpi_listener_function(){
    console.log('🆗 | Слушатели готовы к подключению')
}