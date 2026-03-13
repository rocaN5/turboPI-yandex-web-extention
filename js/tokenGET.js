// tokenGET.js - выполняется на странице
window.tpiCurrentDomain = 'unknown';
window.tpiTokens = { new: null, old: null };

// Флаг для предотвращения повторной обработки токенов
let tokensProcessed = false;

// Слушаем ответы от content script
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'TOKEN_SAVED_CONFIRMATION') {
        window.tpiTokens.new = event.data.tokens.new;
        window.tpiTokens.old = event.data.tokens.old;
    }
    
    if (event.data.type === 'TOKENS_FROM_STORAGE' && !tokensProcessed) {
        // Устанавливаем флаг, чтобы не дублировать логи
        tokensProcessed = true;
        
        console.log('📌 tpi_storage_skt_new:', event.data.tokens.new ? event.data.tokens.new.substring(0, 20) + '...' : null);
        console.log('📌 tpi_storage_skt_old:', event.data.tokens.old ? event.data.tokens.old.substring(0, 20) + '...' : null);
        
        window.tpiTokens = event.data.tokens;
        
        // Если это старый домен, но у нас нет свежего токена, пробуем использовать сохраненный
        if (window.tpiCurrentDomain === 'old' && !window.tpiUserTOKEN && event.data.tokens.old) {
            console.log('🔄 Используем сохраненный токен для old домена');
            window.tpiUserTOKEN = event.data.tokens.old;
            
            window.postMessage({
                type: 'TPI_TOKEN_LOADED',
                token: event.data.tokens.old,
                domain: 'old'
            }, '*');
        }
        
        // Если это новый домен, но у нас нет свежего токена, пробуем использовать сохраненный
        if (window.tpiCurrentDomain === 'new' && !window.tpiUserTOKEN && event.data.tokens.new) {
            console.log('🔄 Используем сохраненный токен для new домена');
            window.tpiUserTOKEN = event.data.tokens.new;
            
            window.postMessage({
                type: 'TPI_TOKEN_LOADED',
                token: event.data.tokens.new,
                domain: 'new'
            }, '*');
        }
    }
});

// Функция для извлечения токена из meta-тегов
function extractTokenFromMetaTags() {
    try {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag && metaTag.content) {
            return metaTag.content;
        }
        console.log('❌ Meta-тег csrf-token не найден');
    } catch (e) {
        console.error('❌ Ошибка при поиске в meta-тегах:', e);
    }
    return null;
}

// Функция для проверки, был ли уже обработан токен
function isTokenAlreadyProcessed() {
    return window.tpiTokenProcessed === true;
}

// Основная логика - выполняем только если токен еще не был обработан
if (!isTokenAlreadyProcessed()) {
    try {
        let token = null;
        const currentUrl = window.location.href;
        
        if (currentUrl.includes('https://hubs.market.yandex.ru')) {
            console.log('🌐 Домен 1 (hubs.market.yandex.ru) - ищем токен в meta-тегах...');
            window.tpiCurrentDomain = 'new';
            token = extractTokenFromMetaTags();
        } else if (currentUrl.includes('https://logistics.market.yandex.ru')) {
            console.log('🌐 Домен 2 (logistics.market.yandex.ru) - ищем токен в __INITIAL_STATE__...');
            window.tpiCurrentDomain = 'old';
            token = window.__INITIAL_STATE__?.user?.sk;
            
            if (!token) {
                console.log('❌ Токен не найден в __INITIAL_STATE__');
            }
        } else {
            console.log('❌ Неподдерживаемый домен');
            window.tpiCurrentDomain = 'unknown';
            token = null;
        }
        
        console.log(`📌 tpiCurrentDomain = ${window.tpiCurrentDomain}`);
        
        if (token) {
            console.log('📌 Токен найден:', token.substring(0, 20) + '...');
            
            window.tpiUserTOKEN = token;
            
            // Устанавливаем флаг, что токен обработан
            window.tpiTokenProcessed = true;
            
            // Отправляем запрос на сохранение в content script
            window.postMessage({
                type: 'SAVE_TOKEN_TO_STORAGE',
                domain: window.tpiCurrentDomain,
                token: token
            }, '*');
            
            // Отправляем токен для использования
            window.postMessage({
                type: 'TPI_TOKEN_LOADED',
                token: token,
                domain: window.tpiCurrentDomain
            }, '*');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при получении токена:', error);
    }
}

// Запрашиваем существующие токены (только если еще не запрашивали)
if (!window.tpiStorageRequested) {
    window.tpiStorageRequested = true;
    window.postMessage({ type: 'GET_TOKENS_FROM_STORAGE' }, '*');
}

// Добавляем проверку на множественные вызовы через MutationObserver
if (!window.tpiObserverInitialized) {
    window.tpiObserverInitialized = true;
    
    // Используем MutationObserver для отслеживания загрузки страницы
    const observer = new MutationObserver((mutations) => {
        // Если страница полностью загрузилась и токен еще не обработан
        if (document.readyState === 'complete' && !window.tpiTokenProcessed) {
            // Повторно пытаемся получить токен
            // Здесь можно добавить логику повторного получения токена при необходимости
        }
    });
    
    observer.observe(document, { childList: true, subtree: true });
}