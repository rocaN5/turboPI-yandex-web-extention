let tpiUserTOKEN = null;

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'TPI_TOKEN_LOADED') {
        tpiUserTOKEN = event.data.token;
    }
    
    if (event.data.type === 'SAVE_TOKEN_TO_STORAGE') {
        const { domain, token } = event.data;
        saveTokenToStorage(domain, token);
    }
    
    if (event.data.type === 'GET_TOKENS_FROM_STORAGE') {
        readTokensFromStorage();
    }
});

function saveTokenToStorage(domain, token) {
    chrome.storage.local.get(['tpi_tokens'], (result) => {
        let tokens = result.tpi_tokens || { 
            new: null, 
            old: null,
            lastUpdated: null,
            updatedFrom: null
        };
        
        tokens[domain] = token;
        tokens.lastUpdated = new Date().toISOString();
        tokens.updatedFrom = window.location.href;
        
        chrome.storage.local.set({ 'tpi_tokens': tokens }, () => {
            
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

function readTokensFromStorage() {
    chrome.storage.local.get(['tpi_tokens'], (result) => {
        const tokens = result.tpi_tokens || { 
            new: null, 
            old: null,
            lastUpdated: null,
            updatedFrom: null
        };
        
        window.postMessage({
            type: 'TOKENS_FROM_STORAGE',
            tokens: tokens
        }, '*');
    });
}

function loadTokenAndInit() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/tokenGET.js');
    document.head.appendChild(script);
}

loadTokenAndInit();

setTimeout(() => {
    readTokensFromStorage();
}, 1000);

function getSKToken() {
    return tpiUserTOKEN;
}