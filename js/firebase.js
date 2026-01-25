// simple-encrypt.js
const encodedConfig = {
    apiKey: '41497a6153792d7a43542d5f7045366d66776f644f566569725f44747778346e674a61357559',
    authDomain: '6461696c796c6f742e66697265626173656170702e636f6d',
    projectId: '6461696c796c6f74',
    storageBucket: '6461696c796c6f742e61707073706f742e636f6d',
    messagingSenderId: '373335383330333238353939',
    appId: '313a3733353833303332383539393a7765623a39663334383638376465643165316330366232333532'
  };
  
  function decode(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
  
  const firebaseConfig = {
    apiKey: decode(encodedConfig.apiKey),
    authDomain: decode(encodedConfig.authDomain),
    projectId: decode(encodedConfig.projectId),
    storageBucket: decode(encodedConfig.storageBucket),
    messagingSenderId: decode(encodedConfig.messagingSenderId),
    appId: decode(encodedConfig.appId)
  };
  
  // Инициализация Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

async function createLotPack(lotsArray, cellName, lotType) {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateKey = `${yy}${mm}${dd}`;
    const dateDoc = `${today.getFullYear()}-${mm}-${dd}`;

    console.log('Создание пачки для даты:', dateDoc);

    try {
        // Проверяем, существует ли документ с датой
        const docRef = db.collection("dates").doc(dateDoc);
        const docSnapshot = await docRef.get();
        
        if (!docSnapshot.exists) {
            // Создаем документ даты, если он не существует
            await docRef.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Создан новый документ даты:', dateDoc);
        }

        // Получаем подколлекцию lotpacks
        const subCol = docRef.collection("lotpacks");
        const snapshot = await subCol.get();
        const countToday = snapshot.size;
        const nextNum = String(countToday + 1).padStart(2, "0");

        // Генерируем ID
        const lotPackId = `LOTPACK-${dateKey}${nextNum}`;

        // Формируем объект пачки с дополнительными параметрами
        const lotPackData = {
            status: "created",
            "create-time": firebase.firestore.Timestamp.now(),
            "deleted-time": null,
            "printed-time": null,
            lotsAmount: lotsArray.length,
            "cell-name": cellName,
            "lot-type": lotType,
            lots: lotsArray
        };

        console.log('Сохраняем пачку:', lotPackId, lotPackData);

        // Сохраняем
        await subCol.doc(lotPackId).set(lotPackData);

        console.log('Пачка успешно сохранена:', lotPackId);

        return { dateDoc, lotPackId };

    } catch (error) {
        console.error('Ошибка при сохранении пачки:', error);
        throw error;
    }
}