function addTurboPiTitle() {
    const targetDiv = document.querySelector('div[data-tid="c08f713 7915f99e"]');
    const targetDivExtra = document.querySelector('div.cursor-pointer');
    if (targetDiv && !document.querySelector('.turboPiTitle') || targetDivExtra && !document.querySelector('.turboPiTitle')) {
        const newDiv = document.createElement('div');
        newDiv.className = 'turboPiTitle';
        newDiv.innerHTML = `
        <div class="turboPi__wrapper">
            <div class="turboPi__container" status="online">Extended by
                <span class="turboPianimText" style="margin-left: 4px;">T</span>
                <span class="turboPianimText" style="animation-delay: 50ms;">U</span>
                <span class="turboPianimText" style="animation-delay: 100ms;">R</span>
                <span class="turboPianimText" style="animation-delay: 150ms;">B</span>
                <span class="turboPianimText" style="animation-delay: 200ms;">O</span>
                <span class="turboPianimText" style="animation-delay: 250ms;">p</span>
                <span class="turboPianimText" style="animation-delay: 300ms;">i</span>
            </div>
            <div class="turboPi__version">Версия: ${turboPi__version}</div>
            <div class="turboPi__options">
                <div class="turboPi__options__block" id="tpi-page-main">
                    <div class="turboPI__Autorithation">
                        <div class="tpi-label--user-data" tpi-user-id="0">
                            <div class="turboPI__Autorithation__block" id="tpi-user-data">
                                <div class="auth__logo">
                                    <div class="auth__logo__avatar"></div>
                                </div>
                                <div class="auth__userData">
                                    <div class="auth__userData-info">user</div>
                                    <div class="userStatus">online</div>
                                </div>
                            </div>
                            <div class="auth__logOut">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="turboPI__Autorithation__block__devider"></div>

                        <div class="turboPI__Autorithation__block" id="tpi-user-role">
                            <div class="turboPI__roleSelection__title">Права:</div>
                            <div class="tpi-auth-role" tpi-role-id="0">
                                <i>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.729 4.271c-.389-.391-1.021-.393-1.414-.004-.104.104-.176.227-.225.355-.832 1.736-1.748 2.715-2.904 3.293-1.297.64-2.786 1.085-5.186 1.085-.13 0-.26.025-.382.076-.245.102-.439.297-.541.541-.101.244-.101.52 0 .764.051.123.124.234.217.326l3.243 3.243-4.537 6.05 6.05-4.537 3.242 3.242c.092.094.203.166.326.217.122.051.252.078.382.078s.26-.027.382-.078c.245-.102.44-.295.541-.541.051-.121.077-.252.077-.381 0-2.4.444-3.889 1.083-5.166.577-1.156 1.556-2.072 3.293-2.904.129-.049.251-.121.354-.225.389-.393.387-1.025-.004-1.414l-3.997-4.02z"></path>
                                    </svg>
                                </i>
                                <p>tester</p>
                            </div>
                        </div>
                    </div>
                    <div class="turboPI__hubwrapper">
                        <div class="turboPI__hubSection">
                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/orders/tpi-settings?tpiSettings=true" class="hubOption" id="tpi__goTo__radar">
                                <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                    <defs>
                                        <style>
                                        .turboPiLots {
                                            stroke: currentColor;
                                            stroke-miterlimit: 10;
                                            stroke-width: 1.4px;
                                        }
                                        </style>
                                    </defs>
                                    <path class="turboPiLots" d="m22.97,12.07c-.03,5.96-4.86,10.64-10.9,10.66-5.37.02-10.9-4.73-10.53-11.44C1.83,5.98,6.69,1.21,12.28,1.27c5.91.06,10.71,4.92,10.68,10.8Zm-.47-.24c.19-5.13-4.5-10.31-10.26-10.25C6.45,1.65,1.86,6.22,1.9,12.37c.03,4.23,4.27,9.86,10.31,9.86,5.92,0,10.62-5.4,10.29-10.4Z"></path>
                                    <path class="turboPiLots" d="m9.82,18.46c-3.94-.32,1.79-5.27-.22-5.99-7.09.43,3.31-8.22,5.71-8.07,2.03,1.65-2.8,5.43-.2,5.72,6.6.17-3.4,6.83-5.29,8.34Zm5.47-8.29c-3.86,1.39,1.26-3.95-.06-5.44-1.94.29-9.67,5.76-7.14,7.4,5.12-.67.22,3.06,1.04,5.77,2.13-.79,11.34-6.68,6.16-7.74Z"></path>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Настройки</div>
                                <div class="tpi-options--inDevelopment">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M446.1 251.6L332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3-.1-1.7-.8-3.2-2-4.4zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"></path>
                                        <circle cx="192" cy="256" r="22"></circle>
                                        <circle cx="256" cy="256" r="22"></circle>
                                        <circle cx="320" cy="256" r="22"></circle>
                                    </svg>
                                </div>
                            </a>
                            <button class="hubOption" id="tpi__goTo__radar">
                                <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path d="m22.7,12.23c-.06,1.55-.32,2.98-.95,4.32-2.04,4.36-6.13,6.73-10.93,6.24-3.31-.34-5.95-1.96-7.73-4.77-2.37-3.74-2.4-7.63-.14-11.41,1.59-2.66,4.03-4.29,7.11-4.86,3.11-.58,5.93.14,8.45,2.05.27.2.42.16.63-.06.47-.49.94-.97,1.44-1.44.46-.43.96-.5,1.35-.22.48.35.54,1,.07,1.49-1,1.04-2.03,2.06-3.05,3.08-1.41,1.41-2.83,2.82-4.23,4.25-.13.14-.2.45-.15.64.33,1.36-.44,2.74-1.78,3.17-1.32.43-2.75-.3-3.23-1.63-.47-1.3.17-2.72,1.46-3.26.56-.24,1.11-.34,1.71-.14.15.05.4.02.53-.08.46-.37.88-.78,1.35-1.22-.59-.61-1.26-.77-1.91-.86-2.44-.34-4.71,1.22-5.28,3.59-.6,2.52,1.06,5.24,3.49,5.71,2.87.55,5.38-1.13,5.75-3.92.08-.57.28-.75.81-.67.09.01.18,0,.27,0,.66,0,.95.32.86.97-.39,2.65-2.35,4.84-4.88,5.42-.21.05-.49,0-.67-.1-.58-.33-1.2-.52-1.76-.11-.53.38-1.01.27-1.49.07-2.05-.83-3.48-2.25-4.13-4.39-.1-.34-.1-.61.11-.94.34-.54.44-1.18.06-1.72-.39-.55-.22-1.05-.02-1.55,1.56-3.92,5.96-5.48,9.59-3.38.54.31.86.28,1.19-.19.02-.03.05-.05.07-.08.96-.99,1.09-.75-.22-1.58-2.92-1.82-7.28-1.44-9.92.78-1.56,1.31-2.58,2.92-3.02,4.91-.05.22-.19.45-.35.62-.69.75-.71,1.7-.04,2.46.18.2.33.46.4.72.9,3.47,3.06,5.66,6.53,6.57.29.08.58.25.81.45.69.6,1.71.59,2.39-.03.2-.18.46-.34.71-.4,3.77-.95,5.94-3.39,6.71-7.15.07-.33.05-.68.13-1,.03-.14.22-.33.35-.34.49-.04.99-.02,1.57-.02h0Z"></path>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Радар</div>
                                <div class="tpi-options--inDevelopment">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M446.1 251.6L332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3-.1-1.7-.8-3.2-2-4.4zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"></path>
                                        <circle cx="192" cy="256" r="22"></circle>
                                        <circle cx="256" cy="256" r="22"></circle>
                                        <circle cx="320" cy="256" r="22"></circle>
                                    </svg>
                                </div>
                            </button>
                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableTypes=PALLET&sortableStatuses=&sortableStatusesLeafs=&id=21972131&page=1&pageSize=55&stages=DIRECT%2FPREPARATION%2FLABEL_CREATED_WITH_COURIER_DIRECT&stagesLeafs=DIRECT%2FPREPARATION%2FLABEL_CREATED_WITH_COURIER_DIRECT&cellName=tpi-quickLots&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&turboPI-Quick-Lots=true" class="hubOption" id="tpi__goTo__quickLots">
                                <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="18">
                                        <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM80 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L80 96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 352c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm0 32l0 64 192 0 0-64L96 256zM240 416l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z">
                                        </path>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Быстрые лоты</div>
                                <!-- <div class="tpi-options--inDevelopment">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M446.1 251.6L332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3-.1-1.7-.8-3.2-2-4.4zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"></path>
                                        <circle cx="192" cy="256" r="22"></circle>
                                        <circle cx="256" cy="256" r="22"></circle>
                                        <circle cx="320" cy="256" r="22"></circle>
                                    </svg>
                                </div> -->
                            </a>
                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/sortables?turboPI-Text-to-Orders&sortableBarcode=turboPI-Text-to-Orders&pageSize=50" class="hubOption" id="tpi__goTo__textToOrders">
                                <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="20" viewBox="0 0 512 512">
                                        <path d="M24 56c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24l0 120 16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l16 0 0-96-8 0C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432l33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-88 0c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Строки в заказы</div>
                            </a>
                            <a href="https://hubs.market.yandex.ru/sorting-center/21972131/cells?number=tpiGroupHistory&page=1&pageSize=1&tpiGroupHistory=true" class="hubOption" id="tpi__goTo__groupHistory">
                                <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px">
                                        <path transform="translate(-3, -3) scale(0.025)" d="M349.5 115.7C344.6 103.8 332.9 96 320 96C307.1 96 295.4 103.8 290.5 115.7C197.2 339.7 143.8 467.7 130.5 499.7C123.7 516 131.4 534.7 147.7 541.5C164 548.3 182.7 540.6 189.5 524.3L221.3 448L418.6 448L450.4 524.3C457.2 540.6 475.9 548.3 492.2 541.5C508.5 534.7 516.2 516 509.4 499.7C496.1 467.7 442.7 339.7 349.4 115.7zM392 384L248 384L320 211.2L392 384z" fill="currentcolor"/>
                                        <path transform="translate(10, -3) scale(0.025)" d="M192 96C174.3 96 160 110.3 160 128L160 512C160 529.7 174.3 544 192 544L352 544C422.7 544 480 486.7 480 416C480 369.5 455.2 328.7 418 306.3C436.7 284 448 255.3 448 224C448 153.3 390.7 96 320 96L192 96zM320 288L224 288L224 160L320 160C355.3 160 384 188.7 384 224C384 259.3 355.3 288 320 288zM224 352L352 352C387.3 352 416 380.7 416 416C416 451.3 387.3 480 352 480L224 480L224 352z" fill="currentcolor"/>
                                        <path transform="translate(-3, 10) scale(0.025)" d="M457.1 206.9C394.6 144.4 301.3 144.4 238.8 206.9C176.3 269.4 176.3 370.7 238.8 433.2C301.3 495.7 394.6 495.7 457.1 433.2C469.6 420.7 489.9 420.7 502.4 433.2C514.9 445.7 514.9 466 502.4 478.5C414.9 566 281.1 566 193.6 478.5C106.1 391 106.1 249.2 193.6 161.7C281.1 74.2 414.9 74.2 502.4 161.7C514.9 174.2 514.9 194.5 502.4 207C489.9 219.5 469.6 219.5 457.1 207z" fill="currentcolor"/>
                                        <path transform="translate(11, 10) scale(0.025)" d="M128 128C128 110.3 142.3 96 160 96L288 96C411.7 96 512 196.3 512 320C512 443.7 411.7 544 288 544L160 544C142.3 544 128 529.7 128 512L128 128zM192 160L192 480L288 480C376.4 480 448 408.4 448 320C448 231.6 376.4 160 288 160L192 160z" fill="currentcolor"/>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Группировка</div>
                                <!--<div class="tpi-options--inDevelopment">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M446.1 251.6L332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3-.1-1.7-.8-3.2-2-4.4zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"></path>
                                        <circle cx="192" cy="256" r="22"></circle>
                                        <circle cx="256" cy="256" r="22"></circle>
                                        <circle cx="320" cy="256" r="22"></circle>
                                    </svg>
                                </div>-->
                            </a>
                            <a href="https://hubs.market.yandex.ru/sorting-center/21972131/billing-stat?&size=1&tpiInboundsFile=true" class="hubOption" id="tpi__goTo__inboundsFile">
                                <i>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3C6.30622 3 7.41746 3.83481 7.82929 5H10C12.2091 5 14 6.79086 14 9C14 11.2091 12.2091 13 10 13H7C5.34315 13 4 14.3431 4 16C4 17.6569 5.34315 19 7 19H13L15 21H7C4.23858 21 2 18.7614 2 16C2 13.2386 4.23858 11 7 11H10C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7H7.82929C7.41746 8.16519 6.30622 9 5 9C3.34315 9 2 7.65685 2 6C2 4.34315 3.34315 3 5 3Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5608 20.9961H18.4484C18.7487 20.192 19.5015 19.5618 20.1257 19.0568C20.3933 18.8404 20.6413 18.6397 20.8273 18.4502C21.3871 17.8811 21.7684 17.1554 21.9229 16.3652C22.0775 15.5751 21.9984 14.7559 21.6956 14.0116C21.3928 13.2673 20.88 12.6313 20.2221 12.1841C19.5642 11.737 18.7908 11.4989 18 11.5C17.2092 11.4989 16.4358 11.737 15.7779 12.1841C15.12 12.6313 14.6072 13.2673 14.3044 14.0116C14.0016 14.7559 13.9225 15.5751 14.0771 16.3652C14.2316 17.1554 14.6129 17.8811 15.1727 18.4502C15.359 18.6412 15.6088 18.8435 15.8786 19.0619C16.5011 19.5658 17.2566 20.2524 17.5608 20.9961Z"></path>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Файл поставок</div>
                                <!--<div class="tpi-options--inDevelopment">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M446.1 251.6L332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3-.1-1.7-.8-3.2-2-4.4zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"></path>
                                        <circle cx="192" cy="256" r="22"></circle>
                                        <circle cx="256" cy="256" r="22"></circle>
                                        <circle cx="320" cy="256" r="22"></circle>
                                    </svg>
                                </div>-->
                            </a>
                            <a href="https://logistics.market.yandex.ru/sorting-center/21972131/orders/tpi-cart-controls?tpiCartControls=true" class="hubOption" id="tpi__goTo__inboundsFile">
                                <i>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20l44 0 0 44c0 11 9 20 20 20s20-9 20-20l0-44 44 0c11 0 20-9 20-20s-9-20-20-20l-44 0 0-44c0-11-9-20-20-20s-20 9-20 20l0 44-44 0c-11 0-20 9-20 20z"></path>
                                    </svg>
                                </i>
                                <div class="hubOption__title">Управление МК</div>
                                <div class="tpi-options--inDevelopment">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M446.1 251.6L332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3-.1-1.7-.8-3.2-2-4.4zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"></path>
                                        <circle cx="192" cy="256" r="22"></circle>
                                        <circle cx="256" cy="256" r="22"></circle>
                                        <circle cx="320" cy="256" r="22"></circle>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="turboPI__radarMini">
                        <div class="turboPI__radarMini__title-container">
                            <div class="turboPI__radarMini__title-text">Радар<span>mini</span></div>
                            <div class="turboPI__radarMini__progress" id="mini-radar-progress"></div>
                        </div>
                        <div class="turboPI__radarMini__button-container">
                            <button class="miniRadar" id="mini-radar" mini-radar-status="search">
                                <i class="miniRadarStatusIcon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                                    </svg>
                                </i>
                                <div class="miniRadar-button-text">Показать сканлоги</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        if(targetDiv) targetDiv.parentNode.insertBefore(newDiv, targetDiv);
        if (targetDivExtra) targetDivExtra.parentNode.insertBefore(newDiv, targetDivExtra);
        const avatarImg = document.querySelector('.UserID-Avatar img');

        function cloneAvatarImage() {
            if (avatarImg) {
                const avatarSrc = avatarImg.src;
                const authAvatar = document.querySelector('.auth__logo__avatar');
                if (authAvatar) {
                    authAvatar.style.backgroundImage = `url(${avatarSrc})`;
                    authAvatar.style.backgroundSize = 'cover';
                    authAvatar.style.backgroundPosition = 'center';
                }
            }
        }
        
        const checkInterval = setInterval(() => {
            if (avatarImg && avatarImg.src !== 'https://avatars.mds.yandex.net/get-yapic/0/0-0/islands-middle') {
                cloneAvatarImage();
                clearInterval(checkInterval);
            }
        }, 150);
        
        if (avatarImg && avatarImg.src !== 'https://avatars.mds.yandex.net/get-yapic/0/0-0/islands-middle') {
            cloneAvatarImage();
        }
    }
}