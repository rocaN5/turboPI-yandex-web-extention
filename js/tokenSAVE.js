// tokenSAVE.js
let tpiUserTOKEN = null;

// Слушаем сообщения от инжектированного tokenGET.js
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    // Получили токен со страницы
    if (event.data.type === 'TPI_TOKEN_LOADED') {
        tpiUserTOKEN = event.data.token;
    }
    
    // Запрос на сохранение токена в storage
    if (event.data.type === 'SAVE_TOKEN_TO_STORAGE') {
        const { domain, token } = event.data;
        saveTokenToStorage(domain, token);
    }
    
    // Запрос на чтение токенов из storage
    if (event.data.type === 'GET_TOKENS_FROM_STORAGE') {
        readTokensFromStorage();
    }
});

// Функция для сохранения токена в chrome.storage.local
function saveTokenToStorage(domain, token) {
    chrome.storage.local.get(['tpi_tokens'], (result) => {
        let tokens = result.tpi_tokens || { 
            new: null, 
            old: null,
            lastUpdated: null,
            updatedFrom: null
        };
        
        // Обновляем нужный токен
        tokens[domain] = token;
        tokens.lastUpdated = new Date().toISOString();
        tokens.updatedFrom = window.location.href;
        
        // Сохраняем в chrome.storage.local
        chrome.storage.local.set({ 'tpi_tokens': tokens }, () => {
            
            // Отправляем подтверждение обратно на страницу
            window.postMessage({
                type: 'TOKEN_SAVED_CONFIRMATION',
                domain: domain,
                tokens: {
                    new: tokens.new ? tokens.new.substring(0, 20) + '...' : null,
                    old: tokens.old ? tokens.old.substring(0, 20) + '...' : null,
                    lastUpdated: tokens.lastUpdated
                }
            }, '*');
        });
    });
}

// Функция для чтения токенов из chrome.storage.local
function readTokensFromStorage() {
    chrome.storage.local.get(['tpi_tokens'], (result) => {
        const tokens = result.tpi_tokens || { 
            new: null, 
            old: null,
            lastUpdated: null,
            updatedFrom: null
        };
        
        // Отправляем токены на страницу
        window.postMessage({
            type: 'TOKENS_FROM_STORAGE',
            tokens: tokens
        }, '*');
    });
}

// Инжектим tokenGET.js на страницу
function loadTokenAndInit() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/tokenGET.js');
    document.head.appendChild(script);
}

// Запускаем
loadTokenAndInit();

// Читаем токены при загрузке
setTimeout(() => {
    readTokensFromStorage();
}, 1000);

// Экспортируем функцию для доступа к токену
function getSKToken() {
    return tpiUserTOKEN;
}