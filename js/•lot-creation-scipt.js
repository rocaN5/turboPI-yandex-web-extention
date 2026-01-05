// Функция для клика на элемент с обработкой React событий
function clickElement(element) {
    if (!element) return false;
    
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
    
    if (typeof React !== 'undefined') {
        const reactKey = Object.keys(element).find(key => key.startsWith('__reactFiber$'));
        if (reactKey) {
            const fiberNode = element[reactKey];
            let current = fiberNode;
            while (current) {
                if (current.memoizedProps && current.memoizedProps.onClick) {
                    current.memoizedProps.onClick();
                    break;
                }
                current = current.return;
            }
        }
    }
    return true;
}

// Функция для заполнения input
// Улучшенная функция для заполнения input
function fillInput(input, text) {
    if (!input) return false;
    
    // Фокусируемся на поле
    input.focus();
    
    // Очищаем поле
    input.value = '';
    
    // Устанавливаем новое значение через нативный setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 
        "value"
    ).set;
    nativeInputValueSetter.call(input, text);
    
    // Создаем события для React (более полный набор событий)
    const inputEvent = new Event('input', { 
        bubbles: true,
        cancelable: true,
    });
    
    const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
    });
    
    // Для числовых полей также важно событие keydown
    const keyDownEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: '1',
        keyCode: 49,
        which: 49
    });
    
    const keyUpEvent = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: '1',
        keyCode: 49,
        which: 49
    });
    
    // Диспатчим события в правильном порядке
    input.dispatchEvent(keyDownEvent);
    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);
    input.dispatchEvent(keyUpEvent);
    
    // Для React также может потребоваться событие blur
    const blurEvent = new Event('blur', { bubbles: true });
    input.dispatchEvent(blurEvent);
    
    return true;
}

// Альтернативная функция специально для числовых полей
function fillNumericInput(input, number) {
    if (!input || typeof number !== 'number') return false;
    
    // Фокусируемся на поле
    input.focus();
    
    // Очищаем поле
    input.value = '';
    
    // Устанавливаем значение через свойство value
    input.value = number.toString();
    
    // Создаем специальное событие для числовых input
    const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: number.toString()
    });
    
    input.dispatchEvent(inputEvent);
    
    // Также отправляем change событие
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);
    
    // Убираем фокус
    input.blur();
    
    return true;
}

// Функция для ожидания элемента
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                reject(new Error(`Элемент ${selector} не найден за ${timeout}ms`));
            }
        }, 100);
    });
}

// Основная функция
async function executeFullSequence() {
    try {
        console.log('Запуск последовательности...');

        // 1. Нажимаем первую кнопку
        const firstButton = await waitForElement('button[data-e2e="create-sortable-toggler"]');
        clickElement(firstButton);
        console.log('Первая кнопка нажата');

        // 2. Ждем и нажимаем вторую кнопку
        const secondButton = await waitForElement('span[data-e2e="create-lot-button"]');
        clickElement(secondButton);
        console.log('Вторая кнопка нажата');

        // 3. Ждем появления формы
        await waitForElement('span[data-e2e-i18n-key="pages.sorting-center-sortable-list:lots-form.create-title"]');
        console.log('Форма обнаружена');

        // 4. Работаем с полем "Тип"
        const typeInput = await waitForElement('input[value="Возврат"]');
        clickElement(typeInput);
        console.log('Поле "Тип" открыто');

        // 5. Выбираем опцию "Отгрузка"
        const shipmentOption = await waitForElement('div[data-value="COURIER"][data-label="Отгрузка"]');
        clickElement(shipmentOption);
        console.log('Опция "Отгрузка" выбрана');

        // 6. Ищем поле "Ячейка" по тексту метки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Ищем все контейнеры полей ввода и находим нужный по тексту label
        const inputContainers = document.querySelectorAll('[class*="___inner___"]');
        let cellInput = null;
        
        for (const container of inputContainers) {
            const label = container.querySelector('label');
            if (label && label.textContent.includes('Ячейка')) {
                cellInput = container.querySelector('input');
                break;
            }
        }

        if (!cellInput) {
            throw new Error('Поле "Ячейка" не найдено');
        }

        clickElement(cellInput);
        console.log('Поле "Ячейка" открыто');

        // 7. Выбираем опцию ячейки
        const cellOption = await waitForElement('div[data-label="DIMAN-tpi-TESTS"]');
        clickElement(cellOption);
        console.log('Опция "DIMAN-tpi-TESTS" выбрана');

        // 8. Заполняем поле "Количество"
        const quantityInput = await waitForElement('input[name="count"]');
        if (quantityInput) {
            console.log('Заполняем поле "Количество"...');
            
            // Попробуйте оба метода, один из них должен сработать
            fillInput(quantityInput, '1'); // Стандартный метод
            // ИЛИ
            fillNumericInput(quantityInput, 1); // Специальный для числовых полей
            
            console.log('Поле "Количество" заполнено');
        } else {
            console.error('Поле "Количество" не найдено');
        }
        
        // 9. Нажимаем кнопку "Добавить"
        try {
            // Функция для поиска по XPath
            function waitForElementByXPath(xpath, timeout = 5000) {
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    const interval = setInterval(() => {
                        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                        if (result.singleNodeValue) {
                            clearInterval(interval);
                            resolve(result.singleNodeValue);
                        } else if (Date.now() - startTime > timeout) {
                            clearInterval(interval);
                            reject(new Error(`Элемент по XPath ${xpath} не найден`));
                        }
                    }, 100);
                });
            }

            // Ищем кнопку, содержащую текст "Добавить"
            const addButton = await waitForElementByXPath('//button[.//span[contains(text(), "Добавить")]]');
            
            if (addButton) {
                await new Promise(resolve => setTimeout(resolve, 500));
                clickElement(addButton);
                console.log('Кнопка "Добавить" найдена по XPath и нажата');
            } else {
                console.error('Кнопка "Добавить" не найдена по XPath');
            }
        } catch (error) {
            console.error('Ошибка при нажатии кнопки "Добавить":', error.message);
        }

        console.log('Все операции успешно выполнены!');

    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Запускаем выполнение
executeFullSequence();