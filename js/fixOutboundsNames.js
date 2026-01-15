function fixOutboundsNames(){
    if (window.location.pathname === '/sorting-center/21972131/routes') {
        if(document.querySelectorAll('*[data-tid="66fcbac9 cb97fdce b1af7f56 40d1152e 6a4477cd"] div[data-tid-prop="66fcbac9 cb97fdce"][data-tid="66fcbac9 cb97fdce"]')){
            const tpi_allEyeButtons = document.querySelectorAll('*[data-tid="66fcbac9 cb97fdce b1af7f56 40d1152e 6a4477cd"] div[data-tid-prop="66fcbac9 cb97fdce"][data-tid="66fcbac9 cb97fdce"]')
            console.log(tpi_allEyeButtons)
            setTimeout(() => {
                
            tpi_allEyeButtons.forEach(eye => {
                eye.style.background = '#fc0'
            });
            }, 200);
        }
    }
}