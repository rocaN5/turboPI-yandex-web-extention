try {
  let token = null;
  const currentUrl = window.location.href;
  
  // Определяем домен
  if (currentUrl.includes('https://hubs.market.yandex.ru')) {
    // Домен 1: поиск в meta-тегах
    console.log('🌐 Домен 1 (hubs.market.yandex.ru) - ищем токен в meta-тегах...');
    token = extractTokenFromMetaTags();
  } else if (currentUrl.includes('https://logistics.market.yandex.ru')) {
    // Домен 2: старый метод через __INITIAL_STATE__
    console.log('🌐 Домен 2 (logistics.market.yandex.ru) - ищем токен в __INITIAL_STATE__...');
    token = window.__INITIAL_STATE__?.user?.sk;
    
    if (!token) {
      console.log('❌ Токен не найден в __INITIAL_STATE__');
    }
  } else {
    // Другие домены
    console.log('❌ Неподдерживаемый домен');
    token = null;
  }
  
  if (token) {
    console.log('✅ Токен найден:', token.substring(0, 20) + '...');
    // Сохраняем токен в глобальную переменную страницы
    window.tpiUserTOKEN = token;
    console.log('✅ TPI токен сохранен как tpiUserTOKEN');
    
    // Отправляем сообщение в content script
    window.postMessage({
      type: 'TPI_TOKEN_LOADED',
      token: token
    }, '*');
  } else if (currentUrl.includes('https://hubs.market.yandex.ru') || 
             currentUrl.includes('https://logistics.market.yandex.ru')) {
    console.log('❌ Токен не найден на поддерживаемом домене');
  }
} catch (error) {
  console.error('❌ Ошибка при получении токена:', error);
}

// Функция для извлечения токена из meta-тегов (для домена 1)
function extractTokenFromMetaTags() {
  try {
    // Ищем meta-тег с именем csrf-token
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag && metaTag.content) {
      console.log('✅ Нашли токен в meta-теге csrf-token');
      return metaTag.content;
    }
    
    console.log('❌ Meta-тег csrf-token не найден');
  } catch (e) {
    console.error('❌ Ошибка при поиске в meta-тегах:', e);
  }
  return null;
}