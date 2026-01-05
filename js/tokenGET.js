try {
  // Проверяем, что страница НЕ является страницей sorting-center
  if (!window.location.href.includes('https://hubs.market.yandex.ru/sorting-center')) {
    const token = window.__INITIAL_STATE__?.user?.sk;
    if (token) {
      console.log('✅ Токен найден в __INITIAL_STATE__:', token.substring(0, 20) + '...');
      // Сохраняем токен в глобальную переменную страницы
      window.tpiUserTOKEN = token;
      console.log('✅ TPI токен сохранен как tpiUserTOKEN');
      
      // Отправляем сообщение в content script
      window.postMessage({
        type: 'TPI_TOKEN_LOADED',
        token: token
      }, '*');
    } else {
      console.log('❌ Токен не найден в __INITIAL_STATE__');
    }
  } else {
    console.log('ℹ️ Страница sorting-center - токен не извлекается');
  }
} catch (error) {
  console.error('❌ Ошибка при получении токена:', error);
}