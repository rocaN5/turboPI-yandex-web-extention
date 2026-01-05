let tpiUserTOKEN = null;

// Слушаем сообщения от getToken.js
window.addEventListener('message', (event) => {
    if (event.data.type === 'TPI_TOKEN_LOADED') {
        console.log('🎉 Токен получен через message:', event.data.token);
        tpiUserTOKEN = event.data.token;
    }
});

function loadTokenAndInit() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/tokenGET.js');
    document.head.appendChild(script);
}
loadTokenAndInit()

function getSKToken() {
    return tpiUserTOKEN;
}