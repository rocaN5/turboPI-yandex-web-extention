let onTextToOrdersDomain = false;
let observer = null; // Будем хранить наблюдатель, чтобы отключить его
let stoSelectedVersion = 'new'



const theadForTables = `
<thead data-tid="511d58e0 c4185b1" data-tid-prop="c4185b1" class="___thead___FJGT0">
    <tr class="___tr___ZW2Ux __use--withSorting___IXLep" data-tid="cb9e12e0">
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g _stickyColumn___BusWf" style="left: 0px;">
            <div class="___sortCell___LiD96 __use--sortable___FyuCH" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.sortable-barcode" data-tid="31bb50f9" data-tid-prop="31bb50f9">Код грузоместа</span>
                <span aria-hidden="true" class="___iconPlaceholder___BOcy7"></span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g" style="left: 268px;">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb"></div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96 __use--sortable___FyuCH" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.sortable-type" data-tid="31bb50f9" data-tid-prop="31bb50f9">Тип грузоместа</span>
                <span aria-hidden="true" class="___iconPlaceholder___BOcy7"></span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.sortable-status" data-tid="31bb50f9" data-tid-prop="31bb50f9">Статус грузоместа</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96 __use--sortable___FyuCH" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.sortable-stage" data-tid="31bb50f9" data-tid-prop="31bb50f9">Расширенный статус</span>
                <span aria-hidden="true" class="___iconPlaceholder___BOcy7"></span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.marking" data-tid="31bb50f9" data-tid-prop="31bb50f9">Маркировка</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.order-external-id" data-tid="31bb50f9" data-tid-prop="31bb50f9">Номер заказа</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.inbound-external-id" data-tid="31bb50f9" data-tid-prop="31bb50f9">Номер поставки</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.outbound-external-id" data-tid="31bb50f9" data-tid-prop="31bb50f9">Номер отгрузки</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.cell-name" data-tid="31bb50f9" data-tid-prop="31bb50f9">Имя ячейки</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.cell-address" data-tid="31bb50f9" data-tid-prop="31bb50f9">Адрес ячейки</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.inner-sortable-count" data-tid="31bb50f9" data-tid-prop="31bb50f9">Грузоместа</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.parent-sortable" data-tid="31bb50f9" data-tid-prop="31bb50f9">Родительское грузоместо</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.created-date-time" data-tid="31bb50f9" data-tid-prop="31bb50f9">Дата создания</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96 __use--sortable___FyuCH" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.arrived-date-time" data-tid="31bb50f9" data-tid-prop="31bb50f9">Дата и&nbsp;время приемки</span>
                <span aria-hidden="true" class="___iconPlaceholder___BOcy7"></span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96 __use--sortable___FyuCH" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.shipped-date-time" data-tid="31bb50f9" data-tid-prop="31bb50f9">Дата и&nbsp;время отгрузки</span>
                <span aria-hidden="true" class="___iconPlaceholder___BOcy7"></span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.route-from" data-tid="31bb50f9" data-tid-prop="31bb50f9">Откуда</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.route-to" data-tid="31bb50f9" data-tid-prop="31bb50f9">Куда</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb">
                <span class="" data-e2e-i18n-key="pages.sorting-center-sortable-list:table.column.grouping-directions" data-tid="31bb50f9" data-tid-prop="31bb50f9">Направления группировки</span>
            </div>
        </td>
        <td data-tid="9bbd4620 2f44a68b" data-tid-prop="2f44a68b" class="___td___HLB5g">
            <div class="___sortCell___LiD96" data-tid="2ee75bfd 9d2dcdb"></div>
        </td>
    </tr>
</thead>
`
const eyeVisible = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"/>
    </svg>
`
const eyeHidden = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM357.3 459.1C345.4 462.3 332.9 464 320 464C240.5 464 176 399.5 176 320C176 307.1 177.7 294.6 180.9 282.7L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L357.4 459.2z"/>
</svg>
`
const tpiIconDefault = `
    <svg tpi-list-icon="default" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"></path>
    </svg>
`;
const tpiIconWaiting = `
    <svg tpi-list-icon="waiting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M160 64C142.3 64 128 78.3 128 96C128 113.7 142.3 128 160 128L160 139C160 181.4 176.9 222.1 206.9 252.1L274.8 320L206.9 387.9C176.9 417.9 160 458.6 160 501L160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L480 576C497.7 576 512 561.7 512 544C512 526.3 497.7 512 480 512L480 501C480 458.6 463.1 417.9 433.1 387.9L365.2 320L433.1 252.1C463.1 222.1 480 181.4 480 139L480 128C497.7 128 512 113.7 512 96C512 78.3 497.7 64 480 64L160 64zM224 139L224 128L416 128L416 139C416 164.5 405.9 188.9 387.9 206.9L320 274.8L252.1 206.9C234.1 188.9 224 164.4 224 139z"/>
    </svg>
`;
const tpiIconSearching = `
    <svg tpi-list-icon="searching" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M 16 3 C 14.34375 3 13 4.34375 13 6 C 13 7.65625 14.34375 9 16 9 C 17.65625 9 19 7.65625 19 6 C 19 4.34375 17.65625 3 16 3 Z M 8.9375 6.4375 C 7.558594 6.4375 6.4375 7.558594 6.4375 8.9375 C 6.4375 10.316406 7.558594 11.4375 8.9375 11.4375 C 10.316406 11.4375 11.4375 10.316406 11.4375 8.9375 C 11.4375 7.558594 10.316406 6.4375 8.9375 6.4375 Z M 23.0625 7.9375 C 22.511719 7.9375 22.0625 8.386719 22.0625 8.9375 C 22.0625 9.488281 22.511719 9.9375 23.0625 9.9375 C 23.613281 9.9375 24.0625 9.488281 24.0625 8.9375 C 24.0625 8.386719 23.613281 7.9375 23.0625 7.9375 Z M 6 13.75 C 4.757813 13.75 3.75 14.757813 3.75 16 C 3.75 17.242188 4.757813 18.25 6 18.25 C 7.242188 18.25 8.25 17.242188 8.25 16 C 8.25 14.757813 7.242188 13.75 6 13.75 Z M 26 14.75 C 25.308594 14.75 24.75 15.308594 24.75 16 C 24.75 16.691406 25.308594 17.25 26 17.25 C 26.691406 17.25 27.25 16.691406 27.25 16 C 27.25 15.308594 26.691406 14.75 26 14.75 Z M 8.9375 21.0625 C 7.832031 21.0625 6.9375 21.957031 6.9375 23.0625 C 6.9375 24.167969 7.832031 25.0625 8.9375 25.0625 C 10.042969 25.0625 10.9375 24.167969 10.9375 23.0625 C 10.9375 21.957031 10.042969 21.0625 8.9375 21.0625 Z M 23.0625 21.5625 C 22.234375 21.5625 21.5625 22.234375 21.5625 23.0625 C 21.5625 23.890625 22.234375 24.5625 23.0625 24.5625 C 23.890625 24.5625 24.5625 23.890625 24.5625 23.0625 C 24.5625 22.234375 23.890625 21.5625 23.0625 21.5625 Z M 16 24.25 C 15.035156 24.25 14.25 25.035156 14.25 26 C 14.25 26.964844 15.035156 27.75 16 27.75 C 16.964844 27.75 17.75 26.964844 17.75 26 C 17.75 25.035156 16.964844 24.25 16 24.25 Z"></path>
    </svg>
`;
const tpiIconFound = `
    <svg tpi-list-icon="found" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM404.4 276.7C411.4 265.5 408 250.7 396.8 243.6C385.6 236.5 370.8 240 363.7 251.2L302.3 349.5L275.3 313.5C267.3 302.9 252.3 300.7 241.7 308.7C231.1 316.7 228.9 331.7 236.9 342.3L284.9 406.3C289.6 412.6 297.2 416.2 305.1 415.9C313 415.6 320.2 411.4 324.4 404.6L404.4 276.6z"/>
    </svg>
`;
const tpiIconError = `
    <svg tpi-list-icon="error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/>
    </svg>
`;
const tpiIconEmpty = `
<svg tpi-list-icon="empty" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31A7.902 7.902 0 0 1 12 20zm6.31-3.1L7.1 5.69A7.902 7.902 0 0 1 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"></path>
</svg>
`;
const tpiIconDouble = `
<svg tpi-list-icon="double" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
    <path d="M352 512L128 512L128 288L176 288L176 224L128 224C92.7 224 64 252.7 64 288L64 512C64 547.3 92.7 576 128 576L352 576C387.3 576 416 547.3 416 512L416 464L352 464L352 512zM288 416L512 416C547.3 416 576 387.3 576 352L576 128C576 92.7 547.3 64 512 64L288 64C252.7 64 224 92.7 224 128L224 352C224 387.3 252.7 416 288 416z"/>
</svg>
`;
const tpiIconMultiple = `
<svg tpi-list-icon="multiple" style=" transform: rotateX(180deg);" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3l0 87.8c18.8-10.9 40.7-17.1 64-17.1l96 0c35.3 0 64-28.7 64-64l0-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3l0 6.7c0 70.7-57.3 128-128 128l-96 0c-35.3 0-64 28.7-64 64l0 6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3l0-6.7 0-198.7C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM80 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
</svg>
`;
const tpiIcon__version = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M19 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
    <path d="M19 8v5a5 5 0 0 1 -5 5h-3l3 -3m0 6l-3 -3"></path>
    <path d="M5 16v-5a5 5 0 0 1 5 -5h3l-3 -3m0 6l3 -3"></path>
</svg>
`
const tpiIcon__search = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="tpi-search-icon">
    <circle class="glass" cx="10.5" cy="10.5" r="7.5" fill="none" stroke="#000" stroke-width="1.5"/>
    <circle class="glassGap" cx="10.5" cy="10.5" r="7.5" fill="none" stroke="#000" stroke-width="1.5"/>
    <path class="handle" d="m16.563 16.458 4.223 5.372-1.572 1.236-4.21-5.356" fill="#000"/>
</svg>
`
const tpiIcon__copy = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 512">
                        <path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
</svg>
`
const tpiIcon__copyMono = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.0943 7.14643C17.6874 6.93123 17.9818 6.85378 18.1449 6.82608C18.1461 6.87823 18.1449 6.92051 18.1422 6.94825C17.9096 9.39217 16.8906 15.4048 16.3672 18.2026C16.2447 18.8578 16.1507 19.1697 15.5179 18.798C15.1014 18.5532 14.7245 18.2452 14.3207 17.9805C12.9961 17.1121 11.1 15.8189 11.2557 15.8967C9.95162 15.0373 10.4975 14.5111 11.2255 13.8093C11.3434 13.6957 11.466 13.5775 11.5863 13.4525C11.64 13.3967 11.9027 13.1524 12.2731 12.8081C13.4612 11.7035 15.7571 9.56903 15.8151 9.32202C15.8246 9.2815 15.8334 9.13045 15.7436 9.05068C15.6539 8.97092 15.5215 8.9982 15.4259 9.01989C15.2904 9.05064 13.1326 10.4769 8.95243 13.2986C8.33994 13.7192 7.78517 13.9242 7.28811 13.9134L7.29256 13.9156C6.63781 13.6847 5.9849 13.4859 5.32855 13.286C4.89736 13.1546 4.46469 13.0228 4.02904 12.8812C3.92249 12.8466 3.81853 12.8137 3.72083 12.783C8.24781 10.8109 11.263 9.51243 12.7739 8.884C14.9684 7.97124 16.2701 7.44551 17.0943 7.14643ZM19.5169 5.21806C19.2635 5.01244 18.985 4.91807 18.7915 4.87185C18.5917 4.82412 18.4018 4.80876 18.2578 4.8113C17.7814 4.81969 17.2697 4.95518 16.4121 5.26637C15.5373 5.58382 14.193 6.12763 12.0058 7.03736C10.4638 7.67874 7.39388 9.00115 2.80365 11.001C2.40046 11.1622 2.03086 11.3451 1.73884 11.5619C1.46919 11.7622 1.09173 12.1205 1.02268 12.6714C0.970519 13.0874 1.09182 13.4714 1.33782 13.7738C1.55198 14.037 1.82635 14.1969 2.03529 14.2981C2.34545 14.4483 2.76276 14.5791 3.12952 14.6941C3.70264 14.8737 4.27444 15.0572 4.84879 15.233C6.62691 15.7773 8.09066 16.2253 9.7012 17.2866C10.8825 18.0651 12.041 18.8775 13.2243 19.6531C13.6559 19.936 14.0593 20.2607 14.5049 20.5224C14.9916 20.8084 15.6104 21.0692 16.3636 20.9998C17.5019 20.8951 18.0941 19.8479 18.3331 18.5703C18.8552 15.7796 19.8909 9.68351 20.1332 7.13774C20.1648 6.80544 20.1278 6.433 20.097 6.25318C20.0653 6.068 19.9684 5.58448 19.5169 5.21806Z"></path>
</svg>
`
const tpiIcon__scanDownload = `
<svg stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" stroke-linejoin="round" fill="none">
    <path d="M14 3v4a1 1 0 0 0 1 1h4" style="fill: transparent !important;"></path>
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" style="fill: transparent !important;"></path>
    <path d="M12 17v-6"></path>
    <path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path>
</svg>
`
const tpiIcon__copySortable = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.6 2.001H7.4a1.402 1.402 0 0 0-1.4 1.4v2.602H3.401a1.401 1.401 0 0 0-1.4 1.4v13.2a1.402 1.402 0 0 0 1.4 1.4h13.2a1.4 1.4 0 0 0 1.4-1.4V18h2.6a1.401 1.401 0 0 0 1.4-1.4V3.4a1.402 1.402 0 0 0-1.4-1.4ZM16 20.003H4v-12h12v12ZM20 16h-1.999V7.402a1.401 1.401 0 0 0-1.4-1.4h-8.6v-2h12v12Z"></path><path d="M9 17.994h2v-3h3v-2h-3v-3H9v3H6v2h3v3Z"></path>
</svg>
`
const tpiIcon__packageType = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.27 9 5.15"></path>
</svg>
`
const tpiIcon__warehouse = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M240,188h-4V98.67A20,20,0,0,0,227.09,82l-88-58.66a19.94,19.94,0,0,0-22.18,0L28.91,82A20,20,0,0,0,20,98.67V188H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM44,100.81l84-56,84,56V188H196V120a12,12,0,0,0-12-12H72a12,12,0,0,0-12,12v68H44ZM172,132v16H140V132Zm-56,16H84V132h32ZM84,172h32v16H84Zm56,0h32v16H140Z"></path>
</svg>
`
const tpiIcon__personWalking = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M160 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM126.5 199.3c-1 .4-1.9 .8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2s-25.8-23.7-20.2-40.5l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14c44.6 0 84.8 26.8 101.9 67.9L281 232.7l21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1L54.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z"></path>
</svg>
`
const tpiIcon__wareHouse = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"></path>
    <path d="M6 18h12"></path>
    <path d="M6 14h12"></path>
    <rect width="12" height="12" x="6" y="10"></rect>
</svg>
`
const tpiIcon__calendar = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect>
    <circle cx="296" cy="232" r="24"></circle>
    <circle cx="376" cy="232" r="24"></circle
    <circle cx="296" cy="312" r="24"></circle<circle cx="376" cy="312" r="24"></circle>
    <circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle>
    <circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle>
    <circle cx="296" cy="392" r="24"></circle>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path>
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path>
</svg>
`
const tpiIcon__clock = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
</svg>
`
const tpiIcon__crossDock =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 9h3.5c.736 0 1.393.391 1.851 1.001.325-.604.729-1.163 1.191-1.662-.803-.823-1.866-1.339-3.042-1.339h-3.5c-.553 0-1 .448-1 1s.447 1 1 1zM11.685 12.111c.551-1.657 2.256-3.111 3.649-3.111h1.838l-1.293 1.293c-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293s.512-.098.707-.293l3.707-3.707-3.707-3.707c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l1.293 1.293h-1.838c-2.274 0-4.711 1.967-5.547 4.479l-.472 1.411c-.641 1.926-2.072 3.11-2.815 3.11h-2.5c-.553 0-1 .448-1 1s.447 1 1 1h2.5c1.837 0 3.863-1.925 4.713-4.479l.472-1.41zM15.879 13.293c-.391.391-.391 1.023 0 1.414l1.293 1.293h-2.338c-1.268 0-2.33-.891-2.691-2.108-.256.75-.627 1.499-1.09 2.185.886 1.162 2.243 1.923 3.781 1.923h2.338l-1.293 1.293c-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293s.512-.098.707-.293l3.707-3.707-3.707-3.707c-.391-.391-1.023-.391-1.414 0z"></path>
</svg>
`
const tpiIcon__pin = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.3126 10.1753L20.8984 11.5895L20.1913 10.8824L15.9486 15.125L15.2415 18.6606L13.8273 20.0748L9.58466 15.8321L4.63492 20.7819L3.2207 19.3677L8.17045 14.4179L3.92781 10.1753L5.34202 8.76107L8.87756 8.05396L13.1202 3.81132L12.4131 3.10422L13.8273 1.69L22.3126 10.1753Z"></path>
</svg>
`
const tpiIcon__unPin = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.9711 17.1715 19.5568 18.5858 16.0223 15.0513 15.9486 15.125 15.2415 18.6605 13.8273 20.0747 9.58466 15.8321 4.63492 20.7818 3.2207 19.3676 8.17045 14.4179 3.92781 10.1752 5.34202 8.76101 8.87756 8.0539 8.95127 7.98019 5.4147 4.44362 6.82892 3.02941 20.9711 17.1715ZM18.8508 12.2228 20.1913 10.8823 20.8984 11.5894 22.3126 10.1752 13.8273 1.68994 12.4131 3.10416 13.1202 3.81126 11.7797 5.15176 18.8508 12.2228Z"></path>
</svg>
`
const tpiIcon__decrease = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path><path d="M22 3.41 16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2 22 3.41zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59 3.41 22z"></path>
</svg>
`
const tpiIcon__increase = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"></path>
</svg>
`
const tpiIcon__tripleDots = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm160,0a28,28,0,1,0,28,28A28,28,0,0,0,208,100Z"></path>
</svg>
`


const tpi_sto_liquid_glass = `
<svg style="display: none;">
  <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise"></feTurbulence>
    <feGaussianBlur in="noise" stdDeviation="0.02" result="blur"></feGaussianBlur>
    <feDisplacementMap in="SourceGraphic" in2="blur" scale="50" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
  </filter>
  <filter id="settings-glass" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.005 0.05" numOctaves="5" seed="15" result="noise"></feTurbulence>
    <feGaussianBlur in="noise" stdDeviation="0.02" result="blur"></feGaussianBlur>
    <feDisplacementMap in="SourceGraphic" in2="blur" scale="30" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
  </filter>
</svg>
`
//! settings
const tpiIcon_settings_chevronUp = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 328 144-144 144 144"></path>
</svg>
`,
tpiIcon_settings_chevronDown = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 328 144-144 144 144"></path>
</svg>
`,
tpiIcon_settings_animateStatus =`
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 6.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0"></path>
    <path d="M2.5 21h8l-4 -7z"></path>
    <path d="M14 3l7 7"></path>
    <path d="M14 10l7 -7"></path>
    <path d="M14 14h7v7h-7z"></path>
</svg>
`,
tpiIcon_settings_returnBarcode = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 32C10.7 32 0 42.7 0 56L0 456c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24L64 56c0-13.3-10.7-24-24-24L24 32zm88 0c-8.8 0-16 7.2-16 16l0 416c0 8.8 7.2 16 16 16s16-7.2 16-16l0-416c0-8.8-7.2-16-16-16zm72 0c-13.3 0-24 10.7-24 24l0 400c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-400c0-13.3-10.7-24-24-24l-16 0zm96 0c-13.3 0-24 10.7-24 24l0 400c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-400c0-13.3-10.7-24-24-24l-16 0zM448 56l0 400c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-400c0-13.3-10.7-24-24-24l-16 0c-13.3 0-24 10.7-24 24zm-64-8l0 416c0 8.8 7.2 16 16 16s16-7.2 16-16l0-416c0-8.8-7.2-16-16-16s-16 7.2-16 16z"></path>
</svg>
`,
tpiIcon_settings_liquidGalss = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="1024.000000pt" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
        <path d="M1895 10123 c-186 -16 -390 -77 -595 -178 -134 -67 -214 -121 -329 -224 -288 -259 -452 -550 -524 -931 l-22 -115 -3 -3475 c-3 -3563 -3 -3558 34 -3755 42 -223 137 -452 267 -644 66 -97 258 -291 365 -370 136 -100 308 -186 491 -247 75 -25 182 -47 313 -65 41 -6 1351 -8 3280 -7 3075 3 3216 4 3288 21 305 75 447 133 637 259 167 111 369 320 480 498 117 187 171 338 224 625 11 57 14 748 16 3605 3 3520 3 3536 -17 3656 -11 67 -29 150 -39 185 -141 485 -475 854 -951 1052 -105 44 -201 70 -355 97 -117 20 -134 20 -3319 18 -1760 -1 -3219 -3 -3241 -5z m2635 -549 c83 -33 144 -171 174 -389 32 -234 60 -317 138 -416 103 -130 289 -190 439 -140 91 31 131 56 195 122 77 82 112 155 169 354 85 292 139 402 224 456 l45 29 178 0 c199 0 229 -7 282 -71 70 -83 101 -186 101 -334 0 -155 -27 -238 -180 -560 -75 -156 -138 -315 -156 -390 -19 -77 -15 -278 6 -350 40 -139 140 -278 254 -353 123 -82 191 -102 346 -102 125 0 140 3 265 58 145 63 306 228 495 507 233 344 363 474 532 534 95 34 148 36 233 12 166 -47 277 -173 295 -337 8 -74 -6 -138 -51 -232 -28 -57 -57 -94 -137 -175 -56 -57 -146 -136 -200 -176 -54 -41 -144 -119 -201 -175 -117 -114 -155 -178 -181 -305 -14 -68 -14 -83 1 -160 29 -159 120 -279 264 -349 75 -37 76 -37 200 -36 123 1 127 2 250 46 69 26 172 65 230 87 219 87 332 103 426 62 29 -12 65 -36 80 -52 l29 -30 3 -187 c3 -219 0 -228 -93 -304 -117 -95 -298 -164 -520 -198 -94 -14 -293 -30 -382 -30 -40 0 -94 -4 -120 -9 -26 -5 -102 -15 -168 -21 -222 -22 -382 -87 -501 -205 -125 -124 -174 -241 -174 -416 0 -86 4 -120 21 -166 40 -107 115 -207 204 -273 166 -123 348 -148 625 -86 69 15 148 31 175 36 28 4 74 15 104 24 38 11 93 16 175 16 104 0 129 -4 178 -24 79 -32 132 -78 162 -138 34 -69 33 -102 -9 -186 -28 -55 -53 -86 -115 -142 -104 -93 -143 -168 -148 -280 -3 -59 1 -87 18 -130 47 -119 110 -174 323 -282 149 -75 211 -123 234 -175 9 -23 13 -84 13 -210 0 -196 -7 -226 -63 -267 -24 -18 -43 -21 -120 -20 -57 0 -115 7 -152 18 -72 21 -245 107 -358 178 -262 163 -403 218 -562 218 -173 0 -364 -92 -463 -223 -115 -153 -150 -330 -97 -501 53 -176 171 -304 515 -561 232 -173 338 -267 440 -391 180 -218 196 -435 45 -602 -72 -79 -184 -132 -282 -132 -45 0 -139 26 -199 55 -86 42 -217 183 -303 327 -159 264 -203 321 -306 391 -62 43 -191 86 -256 87 -42 0 -146 -32 -204 -62 -90 -47 -170 -145 -211 -260 -24 -64 -27 -87 -26 -193 0 -66 5 -132 11 -147 17 -45 34 -239 28 -325 -8 -118 -43 -187 -118 -232 -31 -19 -50 -21 -207 -21 -192 0 -202 3 -263 67 -48 49 -73 100 -100 204 -20 76 -23 116 -29 404 -6 284 -9 328 -28 387 -31 102 -88 201 -156 271 -72 75 -114 103 -216 143 -67 26 -86 29 -185 28 -97 -1 -119 -5 -187 -32 -101 -39 -163 -79 -230 -150 -113 -118 -175 -256 -311 -687 -61 -195 -147 -382 -222 -485 -59 -79 -76 -94 -140 -125 -48 -24 -57 -25 -271 -25 -234 0 -264 5 -323 48 -43 32 -87 126 -109 230 -14 69 -15 94 -4 174 19 158 71 295 225 597 215 423 245 515 235 723 -7 132 -32 208 -107 318 -60 89 -138 157 -242 214 -64 34 -223 76 -291 76 -132 0 -383 -100 -543 -216 -83 -61 -266 -203 -275 -214 -14 -18 -206 -164 -269 -205 -202 -131 -377 -150 -549 -61 -17 9 -61 44 -97 77 -104 98 -153 224 -142 368 20 258 157 404 663 711 359 218 473 352 504 593 18 147 -43 310 -162 427 -141 139 -310 189 -545 161 -114 -13 -258 -39 -383 -68 -58 -14 -119 -18 -265 -18 l-190 0 -79 40 c-51 26 -91 54 -110 78 l-31 39 -3 146 c-2 88 1 162 7 184 15 48 74 98 175 147 101 49 118 55 241 88 l100 26 575 8 c602 7 678 12 838 57 146 42 242 98 352 207 93 92 150 197 179 330 27 123 27 164 2 279 -33 150 -90 254 -198 357 -127 122 -264 189 -443 215 -52 8 -108 18 -124 24 -17 6 -196 10 -450 11 -560 0 -701 13 -913 84 -184 62 -275 117 -316 193 -27 49 -27 53 -27 230 0 167 1 181 21 206 51 65 162 87 274 55 97 -28 321 -98 372 -116 59 -20 267 -19 329 2 241 82 381 316 335 557 -29 146 -125 275 -331 440 -161 128 -211 190 -250 310 -31 96 -22 206 23 295 30 58 118 138 188 171 63 30 74 32 177 32 98 0 117 -3 179 -29 181 -75 333 -217 537 -505 43 -60 89 -127 103 -150 52 -83 163 -223 225 -282 158 -152 321 -210 511 -183 146 21 230 62 332 164 95 96 136 172 161 300 24 119 16 235 -26 425 -49 222 -54 309 -26 402 22 74 53 119 96 140 49 25 280 26 340 2z"></path>
    </g>
</svg>
`,
tpiIcon_settings_extraIcons = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.234 16.014l.554-1.104c.808-1.61.897-3.228.253-4.552-.122-.252-.277-.479-.443-.693 1.411-.619 2.402-2.026 2.402-3.664 0-2.206-1.794-4-4-4s-4 1.794-4 4c0 .783.234 1.508.624 2.126-1.696.33-2.806 1.248-2.947 1.375-.716.631-.885 1.68-.405 2.504.324.559.886.909 1.494.98l-.554 1.104c-.808 1.61-.897 3.228-.254 4.552.565 1.164 1.621 1.955 2.972 2.229.413.084.836.127 1.254.127 2.368 0 3.965-1.347 4.14-1.501.716-.63.887-1.678.407-2.503-.325-.556-.887-.909-1.497-.98zm-1.234-12.013c1.104 0 2 .896 2 2s-.896 2-2 2c-1.105 0-2-.896-2-2s.895-2 2-2zm-1.816 14.999c-.271 0-.559-.025-.854-.087-1.642-.334-2.328-1.933-1.328-3.927l1-1.995c.5-.996.47-1.63-.108-2.035-.181-.125-.431-.169-.689-.169-.577 0-1.201.214-1.201.214s1.133-1.001 2.812-1.001c.271 0 .56.025.856.087 1.64.334 2.328 1.933 1.328 3.927l-1 1.993c-.5.998-.472 1.632.106 2.035.181.126.433.169.692.169.577 0 1.2-.212 1.2-.212s-1.133 1.001-2.814 1.001z"></path>
</svg>
`,
tpiIcon_settings_arrowChevron_right =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20c-.802 0-1.555-.312-2.122-.879-.566-.566-.878-1.32-.878-2.121s.312-1.555.879-2.122l2.878-2.878-2.878-2.879c-.567-.566-.879-1.32-.879-2.121s.312-1.555.879-2.122c1.133-1.132 3.109-1.133 4.243.001l7.121 7.121-7.122 7.121c-.566.567-1.319.879-2.121.879zm0-14c-.268 0-.518.104-.707.292-.189.19-.293.441-.293.708s.104.518.293.707l4.292 4.293-4.292 4.293c-.189.189-.293.439-.293.707s.104.518.293.707c.378.379 1.037.378 1.414.001l5.708-5.708-5.708-5.707c-.189-.189-.439-.293-.707-.293z"></path>
</svg>
`,
tpiIcon_settings_arrowChevron_left =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 20c-.802 0-1.555-.312-2.122-.879l-7.121-7.121 7.122-7.121c1.133-1.133 3.11-1.133 4.243 0 .566.566.878 1.32.878 2.121s-.312 1.555-.879 2.122l-2.878 2.878 2.878 2.879c.567.566.879 1.32.879 2.121s-.312 1.555-.879 2.122c-.566.566-1.319.878-2.121.878zm-6.415-8l5.708 5.707c.378.378 1.037.377 1.414 0 .189-.189.293-.439.293-.707s-.104-.518-.293-.707l-4.292-4.293 4.292-4.293c.189-.189.293-.44.293-.707s-.104-.518-.293-.707c-.378-.379-1.037-.378-1.414-.001l-5.708 5.708z"></path>
</svg>
`,
tpiIcon_settings_verticalGrid = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0V0z"></path><path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"></path>
</svg>
`,
tpiIcon_settings_ruler = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path>
    <path d="m14.5 12.5 2-2"></path>
    <path d="m11.5 9.5 2-2"></path>
    <path d="m8.5 6.5 2-2"></path>
    <path d="m17.5 15.5 2-2"></path>
</svg>
`
//! settings END

const temp__tr_first = `
<tr class="tpi-sto--table-tbody">
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data-sortable">
            <button class="tpi-sto--table-action-button-shrinker">${tpiIcon__tripleDots}</button>
            <div class="tpi-sto--table-sortable-actions">
                <button class="tpi-sto--table-action-button" tpi-action-type="copy">${tpiIcon__copy}</button>
                <button class="tpi-sto--table-action-button" tpi-action-type="copy-mono">${tpiIcon__copyMono}</button>
                <button class="tpi-sto--table-action-button" tpi-action-type="scan-download">${tpiIcon__scanDownload}</button>
                <button class="tpi-sto--table-action-button" tpi-action-type="copy-sortable">${tpiIcon__copySortable}</button>
            </div>
            <div class="tpi-sto--sortable-data-wrapper tpi-sto--sortable-id-data-wrapper">
                <a href="https://hubs.market.yandex.ru/sorting-center/21972131/support" target="_blank" class="tpi-sto--sortable-data-link">
                    <p class="tpi-sto--sortable-data-link-test">725692808525</p>
                </a>
            </div>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <a href="#" class="tpi-sto--table-tbody-data-link">
                49357575939
            </a>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item" tpi-sto-tbody-return-sortable>
        <div class="tpi-sto--table-tbody-data">
            <a href="#" class="tpi-sto--table-tbody-data-link">
                VOZ_FBS_23910235
            </a>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__packageType}</i>
            <p class="tpi-sto--table-tbody-data-sortable-type" sto-sortable-type="place">
                Посылка
            </p>
        </div>
    </td>
`,
temp__tr_second = `
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__warehouse}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                На хренении
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <a href="#" class="tpi-sto--table-tbody-data-link">F1254273B140237AC926</a>
        </div>
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <a href="#" class="tpi-sto--table-tbody-data-link">17 заказов</a>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data">
            <p class="tpi-sto--table-null-data">
                ${null}
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__calendar}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                03/10/2025
            </p>
        </div>
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__clock}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                12:48:24
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__calendar}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                03/10/2025
            </p>
        </div>
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__clock}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                12:48:24
            </p>
        </div>
    </td>
    <td class="tpi-sto--table-tbody-item">
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__calendar}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                03/10/2025
            </p>
        </div>
        <div class="tpi-sto--table-tbody-data" sto-multiple-lines="2">
            <i class="tpi-sto--table-tbody-data-icon">${tpiIcon__clock}</i>
            <p class="tpi-sto--table-tbody-data-sortable-status" sto-sortable-type="on-storage">
                12:48:24
            </p>
        </div>
    </td>
</tr>
`

const forcedMultipleLines = new Set();

const tpiIconByStatus = {
    default:   tpiIconDefault,
    waiting:   tpiIconWaiting,
    searching: tpiIconSearching,
    found:     tpiIconFound,
    error:     tpiIconError,
    multiple:  tpiIconMultiple,
    double:    tpiIconDouble,
    empty:     tpiIconEmpty
};

// --- helpers ---
function getTableValuesForLine(lineIndex) {
    const tbody = document.querySelector('.diman__TURBOpi__textToOrders__table tbody');
    
    if (!tbody) return [];

    const trs = Array.from(tbody.querySelectorAll('tr'));
    if (lineIndex >= trs.length) return [];

    const tr = trs[lineIndex];
    const barcodeEl = tr.querySelector('a[data-e2e="sortable-barcode-link"]');
    const orderEl = tr.querySelector('a[data-e2e="sortable-table-order-external-id"] span');

    const barcode = barcodeEl ? barcodeEl.textContent.trim() : null;
    const order = orderEl ? orderEl.textContent.trim() : null;

    return [barcode, order];
}

function collectMatchesInRow(tr, needle, previousNeedles) {
    const selectors = [
        'a[data-e2e="sortable-barcode-link"]',
        'a[data-e2e="sortable-table-order-external-id"] span'
    ];

    const matches = [];

    for (const sel of selectors) {
        const el = tr.querySelector(sel);
        if (!el) continue;
        const txt = (el.textContent || '').trim();
        if (!txt) continue;

        // cross check: если нашли в order — проверяем barcode, если нашли в barcode — проверяем order
        let crossText = null;
        if (sel.includes("order-external-id")) {
            const barcodeEl = tr.querySelector('a[data-e2e="sortable-barcode-link"]');
            crossText = barcodeEl ? (barcodeEl.textContent || '').trim() : null;
        } else if (sel.includes("barcode-link")) {
            const orderEl = tr.querySelector('a[data-e2e="sortable-table-order-external-id"] span');
            crossText = orderEl ? (orderEl.textContent || '').trim() : null;
        }

        const crossDouble = crossText && previousNeedles.has(crossText);

        if (txt.includes(needle)) {
            matches.push({
                exact: txt === needle,
                crossDouble
            });
        }
    }

    return matches;
}

function findStatusAcrossTables(needle, previousNeedles) {
    needle = String(needle).trim();
    if (!needle) return { found: false, isDouble: false, isMultiple: false, matches: [] };

    const sources = [
        document.querySelector('.diman__TURBOpi__textToOrders__table tbody'),
        (typeof outputTbodyNew !== 'undefined' && outputTbodyNew) ? outputTbodyNew : null,
    ].filter(Boolean);

    const matches = [];
    let totalMatches = 0;

    for (const tbody of sources) {
        if (!tbody) continue;
        for (const tr of tbody.querySelectorAll('tr')) {
            const rowMatches = collectMatchesInRow(tr, needle, previousNeedles);
            if (rowMatches.length > 0) {
                matches.push(...rowMatches);
                totalMatches++;
            }
        }
    }

    if (matches.length === 0) return { found: false, isDouble: false, isMultiple: false, matches: [] };

    // Проверяем multiple: если найдено более одного совпадения в разных строках таблицы
    const isMultiple = totalMatches > 1;

    // 1) exact + crossDouble
    if (matches.some(m => m.exact && m.crossDouble)) {
        return { found: true, isDouble: true, isMultiple, matches };
    }
    // 2) any + crossDouble
    if (matches.some(m => m.crossDouble)) {
        return { found: true, isDouble: true, isMultiple, matches };
    }
    // 3) multiple совпадения
    if (isMultiple) {
        return { found: true, isDouble: false, isMultiple: true, matches };
    }
    // 4) ТОЛЬКО exact match (не double)
    const exactMatches = matches.filter(m => m.exact);
    if (exactMatches.length > 0) {
        return { found: true, isDouble: false, isMultiple: false, matches: exactMatches };
    }
    // 5) any partial - теперь считаем НЕ найденным для exact проверки
    return { found: false, isDouble: false, isMultiple: false, matches: [] };
}

function toggleHighlightForLine(lineIdx, arg2, arg3) {
    let enable, status;

    if (typeof arg2 === "boolean") {
        enable = arg2;
        const li = document.querySelector(`ul.tpi-sto--search-status-list li[data-line-idx="${lineIdx}"]`);
        status = li ? li.dataset.status : null;
    } else {
        status = arg2;
        enable = !!arg3;
    }

    const table = document.querySelector('.diman__TURBOpi__textToOrders__table tbody');
    if (!table) return;

    table.querySelectorAll("tr[statusHighlight]").forEach(tr => tr.removeAttribute("statusHighlight"));
    if (!enable || !status || status === "default" || status === "waiting" || status === "searching" || status === "empty") return;

    // multiple → подсвечиваем все tr этой строки
    if (status === "multiple") {
        const trs = table.querySelectorAll(`tr[data-textarea-line-idx="${lineIdx}"]`);
        trs.forEach(tr => tr.setAttribute("statusHighlight", "multiple"));
        if (trs.length) trs[0].scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    // error → подсветка "Нет данных"
    if (status === "error") {
        const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
        const needle = textArea ? (textArea.value.split("\n")[lineIdx] || "").trim() : "";
        table.querySelectorAll('tr.diman__TURBOpi__textToOrders__unknownSortable').forEach(row => {
            const span = row.querySelector("span");
            if (span && span.textContent.trim() === needle) {
                row.setAttribute("statusHighlight", "error");
                row.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
        return;
    }

    // found/double/прочие — старый механизм
    const mapped = (typeof textareaToTableMapping !== "undefined") ? textareaToTableMapping.get(lineIdx) : null;
    if (mapped && mapped.isConnected) {
        mapped.setAttribute("statusHighlight", status);
        mapped.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }
}
function checkiIs__onStrokeToOrdersPage() {
    'use strict';

    // Функция проверки URL
    function isTextToOrdersPage(url) {
        const base = 'https://logistics.market.yandex.ru/sorting-center/21972131/sortables';
        if (!url.startsWith(base)) return false;
        
        const params = new URLSearchParams(url.split('?')[1] || '');
        return params.has('turboPI-Text-to-Orders')
    }

    // Функция добавления блока (и отключения наблюдателя)
    function addTurboBlock() {
        const tpiTooltip = document.createElement('div')
        tpiTooltip.className = 'tpi-tooltip-by-sheva_r6'
        document.querySelector('body').appendChild(tpiTooltip)
        if (document.querySelector('.diman__TURBOpi__textToOrders__wrapper')) return;

        document.title = "Строки в заказы"

        // Создаём и вставляем блок
        const newOverlay = document.createElement('div');
        newOverlay.className = 'tpi-sto--content-section';
        newOverlay.setAttribute('tpi-sto-version-selected', stoSelectedVersion === 'new' ? true : false)
        newOverlay.innerHTML = `
            <div class="tpi-sto--section" style="height: fit-content;">
                <div class="tpi-sto--section-title" tpi-tooltip-data="TEST">
                    <p>Строки в заказы</p>
                    <button class="tpi-sto--switch-version">${tpiIcon__version}</button>
                </div>
            </div>
            <div class="tpi-sto--section-block" tpi-sto-current-state="default" tpi-sto-animate-state="default">
                <div class="tpi-sto--floating-expandable-section">
                    <div class="tpi-sto--section-wrapper tpi-sto--floating-search-wrapper">
                        <div class="tpi-sto--section-wrapper-title tpi-sto--floating-wrapper-title">
                            <p>Данные поиска</p>
                            <div class="tpi-sto--switch-controls-wrapper">
                                <button class="tpi-sto--switch-size-window-switch" tpi-sto-current-state="unmarked">
                                    ${tpiIcon__decrease}
                                </button>
                                <button class="tpi-sto--switch-pin-floating-window-switch">
                                    ${tpiIcon__pin}
                                </button>
                            </div>
                        </div>
                        <div class="tpi-sto--section-wrapper-item tpi-sto--odrder-searh-data-wrapper" tpi-sto-current-state="visible">
                            <div class="tpi-sto--odrder-status-visibility-container">
                                <button class="tpi-sto--odrder-status-switch-visibility">
                                    Скрыть статусы
                                </button>
                            </div>
                            <div class="tpi-sto--odrder-searh-data-container">
                                <div class="tpi-sto--textarea-status">
                                    <ul>
                                    </ul>
                                </div>
                                <textarea class="tpi--sto-textarea-data-container" spellcheck="false"></textarea>
                            </div>
                        </div>
                        <button class="tpi-sto--start-searching">
                            ${tpiIcon__search}
                            <p>Найти</p>
                        </button>
                    </div>
                </div>
                
                <div class="tpi-sto--main-section-wrapper">
                    <div class="tpi-sto--search-settings-container">
                        <div class="tpi-sto--settings-option-tooltips"></div>
                        <div class="tpi-sto--section-wrapper tpi-sto--search-settings-wrapper">
                            <div class="tpi-sto--section-wrapper-title">
                                <p>Настройки поиска</p>
                                <div class="tpi-sto--section-settings">
                                    <button class="tpi-sto--settings-switch-pin-sticky" tpi-sto-current-state="marked">
                                        ${tpiIcon__pin}
                                    </button>
                                    <button class="tpi-sto--settings-toggle" tpi-sto-current-state="visible">
                                        ${tpiIcon_settings_chevronUp}
                                    </button>
                                </div>
                            </div>
                            <div class="tpi-sto--section-wrapper-item tpi-sto-settings-container">
                                <div class="tpi-sto--settings-arrow" tpi-sto-settings-move="left">
                                    ${tpiIcon_settings_arrowChevron_left}
                                </div>
                                <div class="tpi-sto--settings-arrow" tpi-sto-settings-move="right">
                                    ${tpiIcon_settings_arrowChevron_right}
                                </div>
                                <label for="tpi-sto--settings-option-1" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Анимация расширенных статусов">
                                    <input type="checkbox" id="tpi-sto--settings-option-1" checked>
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Анимация статусов</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon_settings_animateStatus}
                                    </i>
                                </label>
                                <label for="tpi-sto--settings-option-2" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Отображать возвратные шк в таблице">
                                    <input type="checkbox" id="tpi-sto--settings-option-2" checked>
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Возвратные шк</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon_settings_returnBarcode}
                                    </i>
                                </label>
                                <label for="tpi-sto--settings-option-3" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Жидкое стекло">
                                    <input type="checkbox" id="tpi-sto--settings-option-3" checked>
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Жидкое стекло</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon_settings_liquidGalss}
                                    </i>
                                </label>
                                <label for="tpi-sto--settings-option-4" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Доп. иконки">
                                    <input type="checkbox" id="tpi-sto--settings-option-4" checked>
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Доп. иконки</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon_settings_extraIcons}
                                    </i>
                                </label>
                                <label for="tpi-sto--settings-option-5" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Доп. иконки">
                                    <input type="checkbox" id="tpi-sto--settings-option-5">
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Доп. сетка</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon_settings_verticalGrid}
                                    </i>
                                </label>
                                <label for="tpi-sto--settings-option-6" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Доп. иконки">
                                    <input type="checkbox" id="tpi-sto--settings-option-6">
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Спрятать опции</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon__tripleDots}
                                    </i>
                                </label>
                                <label for="tpi-sto--settings-option-7" class="tpi-sto--settiings-option tpi-sto--settings-tooltip" tooltip-option-id="Доп. иконки">
                                    <input type="checkbox" id="tpi-sto--settings-option-7">
                                    <div class="tpi-sto--settings-option-body"></div>
                                    <p class="tpi-sto--settings-option-description">Линейка</p>
                                    <i class="tpi-sto--settings-option-icon">
                                        ${tpiIcon_settings_ruler}
                                    </i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="tpi-sto--table-wrapper">
                        <table class="tpi-sto--table-data-output">
                            <thead class="tpi-sto--table-thead-wrapper">
                                <tr class="tpi-sto--table-thead">
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Код грузоместа</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Номер заказа / XDOC</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item" tpi-sto-tbody-return-sortable>
                                        <div class="tpi-sto--table-thead-data">Номер возврата</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Тип грузоместа</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Расширенный статус</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Статус грузоместа</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Родительское грузоместо</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Грузоместа</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Имя ячейки</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Адрес ячейки</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Маркировка</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Номер поставки</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Номер отгрузки</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Откуда</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Куда</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Группировка</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Дата создания</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Дата приемки</div>
                                    </th>
                                    <th class="tpi-sto--table-thead-item">
                                        <div class="tpi-sto--table-thead-data">Дата отгрузки</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="tpi-sto--table-tbody-wrapper">
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="second-accept-complete" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Вторая приёмка завершена, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="second-accept-complete" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Вторая приемка завершена, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="first-accept-complete" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Первая приемка завершена, прямой поток (прибыл на СЦ в лоте, лот прошел 1 приемку)
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="first-accept-complete" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Первая приёмка завершена, возвратный поток (прибыл на СЦ в лоте, лот прошел 1 приемку)
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="predsort-complete" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Предсорт пройден, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="predsort-complete" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Предсорт пройден, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="waiting-accept" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Ожидает прибытия, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="waiting-accept" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Ожидает прибытия, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="on-hran" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            На хранении, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="on-hran" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            На хранении, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="awaiting-courier-accept" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Ожидает приемки курьером, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="consolidated" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Консолидирован в лоте
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="deleted" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Удален
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="canceled" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Отмена из внешней системы
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="orphan-lot-created" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Пустой лот создан (обезличенный), прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="lot-created" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Пустой лот создан (на направление), прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="lot-filling" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Лот наполняется посылками, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="lot-filling" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Лот наполняется посылками, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="lot-packed-for-hran" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Лот упакован для хранения, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="not-accept-by-courier" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Не принят курьером, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="loaded-in-vehicle" tpi-sto-status-direction="any"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Загружен в ТС, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="shipped" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Отгружен, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="shipped" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Отгружен, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="shipped-and-replaced" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Отгружен и заменен, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="ready-to-shipment" tpi-sto-status-direction="forward"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Подготовлен к отгрузке, прямой поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                                ${temp__tr_first}
                                <td class="tpi-sto--table-tbody-item">
                                    <div class="tpi-sto--table-tbody-data">
                                        <div class="tpi-sto--table-extanded-sortable-status-icon-wrapper">
                                            <i class="tpi-sto--table-extanded-sortable-status-icon" sto-extended-status="ready-to-shipment" tpi-sto-status-direction="return"></i>
                                        </div>
                                        <p class="tpi-sto--table-tbody-data-sortable-extended-status">
                                            Подготовлен к отгрузке, возвратный поток
                                        </p>
                                    </div>
                                </td>
                                ${temp__tr_second}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ${tpi_sto_liquid_glass}
        `

        // Создаём и вставляем блок
        const overlay = document.createElement('div');
        overlay.className = 'diman__TURBOpi__textToOrders__wrapper';
        overlay.setAttribute('tpi-sto-version-selected', stoSelectedVersion === 'old' ? true : false)

        overlay.innerHTML = `
            <div class="diman__TURBOpi__textToOrders__controlsBlock">
                <div class="diman__TURBOpi__textToOrders__wrapper__text">
                    Строки в заказы
                    <button class="tpi-sto--switch-version">${tpiIcon__version}</button>
                </div>

                <div class="diman__TURBOpi__textToOrders__searchWrapper">
                    <button class="diman__TURBOpi__textToOrders__searchButton">
                        ${tpiIcon__search}
                        <p>Найти заказы из списка</p>
                    </button>
                    <div class="diman__TURBOpi__textToOrders__searchProgress" state="none">
                        <p>0 из 0</p>
                    </div>
                </div>

                <div class="tpi-sto--search-area-wrapper">
                    <div class="tpi-sto--search-status-list-wrapper">
                        <button class="tpi-sto--search-status-list-visibility-btn">
                            ${eyeVisible}
                        </button>
                        <ul class="tpi-sto--search-status-list" status-list-visible="true"></ul>
                    </div>
                    <textarea class="diman__TURBOpi__textToOrders__textArea" spellcheck="false" placeholder="Введите список заказов" is-status-list-visible="true"></textarea>
                </div>
                <div class="diman__TURBOpi__textToOrders__tableControls">
                    <button class="tpi-double-delete" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M5.386 6h1.806l.219 7H5.886zm3.206 7 .218-7h1.814l-.5 7z"></path><path fill="currentColor" fill-rule="evenodd" d="M7.837.014h.303c.71-.001 1.333-.002 1.881.22a3 3 0 0 1 1.257.962c.36.47.522 1.072.707 1.758l.012.046H15v2l-.96.48-.585 5.922c-.177 1.787-.265 2.68-.72 3.326a3 3 0 0 1-.975.883C11.073 16 10.175 16 8.38 16h-.76c-1.795 0-2.693 0-3.38-.39a3 3 0 0 1-.974-.882c-.456-.646-.544-1.54-.72-3.326L1.96 5.48 1 5V3h2.98l.012-.046c.185-.686.347-1.287.706-1.758A3 3 0 0 1 5.955.235C6.503.012 7.126.013 7.837.015M3.922 5l.614 6.205c.092.93.15 1.494.23 1.911.036.194.07.308.095.376.022.06.037.08.04.084.085.12.196.221.324.294a.3.3 0 0 0 .088.031c.07.018.187.04.383.059.423.038.99.04 1.925.04h.758c.935 0 1.502-.002 1.925-.04.196-.018.313-.04.383-.059.062-.016.083-.028.088-.03a1 1 0 0 0 .325-.295c.002-.004.017-.024.039-.084a2.4 2.4 0 0 0 .096-.376c.08-.417.138-.981.23-1.91L12.077 5zm5.766-2.592c.063.084.116.2.232.592H6.057c.115-.393.168-.508.232-.592a1 1 0 0 1 .419-.32c.137-.056.327-.074 1.28-.074s1.144.018 1.28.074a1 1 0 0 1 .42.32" clip-rule="evenodd"></path>
                        </svg>
                        <p>Удалить дубликаты</p>
                    </button>

                    <button class="tpi-copy-all-default">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"></path>
                        </svg>
                        <p>Копировать</p>
                    </button>

                    <button class="tpi-copy-all-mono">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                            <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"></path>
                        </svg>
                        <p>Копировать моно</p>
                    </button>
                    
                </div>
                
                <div class="tpi--sto-settings-checkbox-wrapper">
                    <label class="diman__TURBOpi__textToOrders__tableItem">
                        <input type="checkbox" class="diman__textToOrders__checkBox__input" id="tpi-textToOrders-checkbox" checked>
                        <div class="diman__textToOrders__checkBox__pin"></div>
                        <div class="diman__textToOrders__checkBox__text">Очищать таблицу при новом поиске</div>
                    </label>
                    <label class="diman__TURBOpi__textToOrders__tableItem">
                        <input type="checkbox" class="diman__textToOrders__checkBox__input" id="tpi--sto-stopAniamtion" checked>
                        <div class="diman__textToOrders__checkBox__pin"></div>
                        <div class="diman__textToOrders__checkBox__text">Анимация статусов таблицы</div>
                    </label>
                </div>
            </div>
            
            <div class="diman__TURBOpi__textToOrders__tableBlock">
                <div class="diman__TURBOpi__textToOrders__previewWrapper">
                    <div class="diman__TURBOpi__textToOrders__previewIcon"></div>
                    <div class="diman__TURBOpi__textToOrders__previewTitle">Жду, когда пользователь начнёт поиск</div>
                </div>
                <div class="diman__TURBOpi__textToOrders__loadingWrapper">
                    <div class="diman__TURBOpi__textToOrders__loadingIcon"></div>
                    <div class="diman__TURBOpi__textToOrders__loadingTitle">Опа, ищу...</div>
                </div>
                <div class="diman__TURBOpi__textToOrders__tableSection">
                    <table class="diman__TURBOpi__textToOrders__table">
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `

        
        // Добавляем обработчик клика на кнопку
        document.addEventListener('click', (e) => {
            if (e.target.closest('.diman__TURBOpi__textToOrders__searchButton')) {
                textToOrders__search();
            }
        });

        const appID = document.getElementById("app")
        const headerTitle = document.querySelector(".p-layout__header-wrapper")
        appID.style.display = "none"
        headerTitle.style.display = "none"

        document.querySelector(".p-layout__content").appendChild(newOverlay);
        document.querySelector(".p-layout__content").appendChild(overlay);
        document.querySelector(".p-layout__content").classList.add('tpi-sto--custom-fulPage')

        setTimeout(() => {
            syncScrollBetweenTextareaAndStatusList();
            initTooltips();
        }, 100);

        // Обработчик копирования в обычном формате
        overlay.querySelector('.tpi-copy-all-default').addEventListener('click', () => {
            const rows = document.querySelectorAll('table.diman__TURBOpi__textToOrders__table tbody tr');
            let result = '';
            
            rows.forEach(row => {
                const barcode = row.querySelector('a[data-e2e="sortable-barcode-link"] div')?.textContent.trim();
                const orderId = row.querySelector('a[data-e2e="sortable-table-order-external-id"] span')?.textContent.trim();
                
                if (barcode) {
                    if (orderId) {
                        result += `${orderId} (${barcode})\n`;
                    } else {
                        result += `${barcode}\n`;
                    }
                }
            });
            
            if (result) {
                navigator.clipboard.writeText(result.trim())
                    .then(() => tpiNotification.show("Заказы скопированы", "success", `${result}`))
                    .catch(err => console.error('Failed to copy:', err));
            }
        });

        // Обработчик копирования в моноформате
        overlay.querySelector('.tpi-copy-all-mono').addEventListener('click', () => {
            const rows = document.querySelectorAll('table.diman__TURBOpi__textToOrders__table tbody tr');
            let result = '';
            
            rows.forEach(row => {
                const barcode = row.querySelector('a[data-e2e="sortable-barcode-link"] div')?.textContent.trim();
                const orderId = row.querySelector('a[data-e2e="sortable-table-order-external-id"] span')?.textContent.trim();
                
                if (barcode) {
                    if (orderId) {
                        result += `\`${orderId}\` (\`${barcode}\`)\n`;
                    } else {
                        result += `\`${barcode}\`\n`;
                    }
                }
            });
            
            if (result) {
                navigator.clipboard.writeText(result.trim())
                    .then(() => tpiNotification.show("Заказы скопированы", "success", `${result}`))
                    .catch(err => console.error('Failed to copy:', err));
            }
        });

        //~ switch versions
        const switchVersion = document.querySelectorAll('.tpi-sto--switch-version')
        switchVersion.forEach(button =>{
            button.addEventListener('click', changeVersionVisibility)
        })

        function changeVersionVisibility(){
            const stoVersions = document.querySelectorAll('div[tpi-sto-version-selected]')
            stoVersions.forEach(option => {
                if (option.getAttribute('tpi-sto-version-selected') === 'true') {
                    stoSelectedVersion = 'old';
                    option.setAttribute('tpi-sto-version-selected', 'false');
                } else {
                    stoSelectedVersion = 'new';
                    option.setAttribute('tpi-sto-version-selected', 'true');
                    
                }
            });
            if(stoSelectedVersion === 'new'){
                tpiNotification.show("Смена версии", 'version' , "Стркои в заказы, версия: старая");
            }else{
                tpiNotification.show("Смена версии", 'version' , "Стркои в заказы, версия: Новая");
            }
        }

        const textArea = overlay.querySelector('.diman__TURBOpi__textToOrders__textArea');
        textArea.addEventListener('input', handleTextAreaChange);
        textArea.addEventListener('change', handleTextAreaChange);
        const statusListEl = overlay.querySelector("ul.tpi-sto--search-status-list");

        const syncHeights = () => {
            if (!statusListEl) return;
        };
        const syncScroll = () => {
            if (!statusListEl) return;
            statusListEl.scrollTop = textArea.scrollTop;
        };
        
        syncHeights();
        window.addEventListener("resize", syncHeights);
        textArea.addEventListener("scroll", syncScroll);

        // Обработчик ручного ввода (пробел = новая строка)
        textArea.addEventListener('keydown', function(e) {
            if (e.key === ' ') {
                e.preventDefault();
                document.execCommand('insertText', false, '\n');
            }
            updateStatusList();
        });
        
        textArea.addEventListener('input', function(e) {
            if (e.key === ' ') {
                e.preventDefault();
                document.execCommand('insertText', false, '\n');
            }
            updateStatusList();
        });
        
        if(document.querySelector(".tpi-sto--search-status-list-visibility-btn")){
            const statusListToggleButton = document.querySelector(".tpi-sto--search-status-list-visibility-btn");
            statusListToggleButton.addEventListener("click", () => {
                const statusList = document.querySelector("ul.tpi-sto--search-status-list");
                const statusLiItem = statusList.querySelectorAll("li")
                
                if (statusList.getAttribute('status-list-visible') === 'true') {
                    statusList.setAttribute("status-list-visible", "false");
                    setTimeout(() => {
                        statusListToggleButton.innerHTML = `${eyeVisible}`;
                        statusLiItem.forEach(item =>{
                            item.style.display = "none"
                        })
                        statusList.style.display = 'none'
                        textArea.setAttribute('is-status-list-visible', false)
                    }, 150);
                } else {
                    statusList.style.display = 'flex'
                    textArea.setAttribute('is-status-list-visible', true)
                    setTimeout(() => {
                        statusList.setAttribute("status-list-visible", "true");
                    }, 1);
                    setTimeout(() => {
                        statusListToggleButton.innerHTML = `${eyeHidden}`;
                        statusLiItem.forEach(item =>{
                            item.style.display = "flex"
                        })
                        updateAllStatusesOnShow();
                    }, 150);
                }
            });
        }

        // Обработчик вставки (Ctrl+V)
        textArea.addEventListener('paste', function(e) {
            e.preventDefault();
        
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        
            const formattedText = pastedText
                .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
                .split(/[, \n]+/)
                .map(item => item.trim().replace(/[()]/g, ''))
                .filter(item => item.length > 0)
                .join('\n');
        
            document.execCommand('insertText', false, formattedText);
            updateStatusList();
        });
        

        onTextToOrdersDomain = true;
        callTurboPI__once();
        addTurboPiTitle()
        init_strokesToOreders_v2()
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        setTimeout(() => {
            document.addEventListener('keydown', handleHotkeys);
        }, 100);
    }

    // Проверяем URL при загрузке
    if (isTextToOrdersPage(location.href)) {
        addTurboBlock();
        addToastContainer()
        setTimeout(() => {
            tpiNotification.show('Страница "Строки в заказы" интегрированна', "info", `Для получения подробной информации о пользовании инструменом, посетите Wiki TURBOpi`);
        }, 1000);
        return; // Если сразу на нужной странице, наблюдатель не нужен
    }

    // Наблюдатель за изменениями URL (если изначально не на нужной странице)
    observer = new MutationObserver(() => {
        if (isTextToOrdersPage(location.href)) {
            addTurboBlock(); // Добавит блок и отключит наблюдатель
        }
    });
    initTextAreaHandlers();
    observer.observe(document, { subtree: true, childList: true });
}

function getLineStatus(lineIdx) {
    const li = document.querySelector(`ul.tpi-sto--search-status-list li[data-line-idx="${lineIdx}"]`);
    return li ? li.getAttribute("data-status") : null;
}

function setLineStatus(lineIdx, status) {
    const ul = document.querySelector('ul.tpi-sto--search-status-list');
    if (!ul) return;

    // На случай, если li ещё не создан — постараемся его найти/создать минимально,
    // чтобы иконка и атрибуты можно было поставить.
    let li = ul.querySelector(`li[data-line-idx="${lineIdx}"]`);
    if (!li) {
        li = document.createElement('li');
        li.setAttribute('data-line-idx', String(lineIdx));
        const wrapper = document.createElement('div');
        wrapper.className = 'tpi-sto--status-line';
        const numDiv = document.createElement('div');
        numDiv.className = 'tpi-sto--status-line-number';
        numDiv.textContent = String(lineIdx + 1);
        const iconDiv = document.createElement('div');
        iconDiv.className = 'tpi-sto--status-line-icon';
        wrapper.appendChild(numDiv);
        wrapper.appendChild(iconDiv);
        li.appendChild(wrapper);
        ul.appendChild(li);
    }

    // Проверяем таблицу на реальное количество tr для этой строки
    const tableBody = document.querySelector('.diman__TURBOpi__textToOrders__table tbody');
    let rowsForLine = [];
    if (tableBody) {
        rowsForLine = Array.from(tableBody.querySelectorAll(`tr[data-textarea-line-idx="${lineIdx}"]`));
    }

    // Управление forcedMultipleLines:
    if (status === 'multiple') {
        forcedMultipleLines.add(String(lineIdx));
    } else if (forcedMultipleLines.has(String(lineIdx))) {
        // Если принудительный multiple уже установлен — сохраняем его только если в таблице >1 tr
        if (rowsForLine.length <= 1) {
            forcedMultipleLines.delete(String(lineIdx));
        } // иначе оставляем forcedMultiple (т.е. multiple продолжит работать)
    }

    // Если forcedMultipleLines содержит строку — финальный статус = multiple
    const finalStatus = forcedMultipleLines.has(String(lineIdx)) ? 'multiple' : status;

    // Применяем к li и иконке
    li.setAttribute('data-status', finalStatus);

    const iconDiv = li.querySelector('.tpi-sto--status-line-icon');
    if (iconDiv) {
        // ставим иконку — сначала пытаемся взять из tpiIconByStatus
        if (tpiIconByStatus && tpiIconByStatus[finalStatus]) {
            iconDiv.innerHTML = tpiIconByStatus[finalStatus];
        } else if (finalStatus === 'multiple' && typeof tpiIconMultiple !== 'undefined') {
            iconDiv.innerHTML = tpiIconMultiple;
        } else {
            iconDiv.innerHTML = tpiIconDefault;
        }
        iconDiv.setAttribute('data-status', finalStatus);
    }

    // Пометим/очистим data-status у tr в таблице
    if (rowsForLine.length > 0) {
        if (finalStatus === 'multiple') {
            rowsForLine.forEach(r => r.setAttribute('data-status', 'multiple'));
        } else {
            rowsForLine.forEach(r => {
                if (r.getAttribute('data-status') === 'multiple') {
                    r.removeAttribute('data-status');
                }
            });
        }
    }

    // Убедимся, что делегат hover висит
    ensureStatusListDelegation();
}

function textToOrders__search() {
    forcedMultipleLines.clear();
    if (document.querySelector(".diman__TURBOpi__textToOrders__previewWrapper")) {
        document.querySelector(".diman__TURBOpi__textToOrders__previewWrapper").remove();
        document.querySelector(".diman__TURBOpi__textToOrders__loadingWrapper").style.display = "flex";
    }

    resetAllStatusesForSearch();

    const textarea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    // Полный список строк + очередь поиска (только непустые), с привязкой к индексу строки
    const allLines = textarea.value.split('\n');
    const queue = allLines
        .map((line, idx) => ({ idx, value: line.trim() }))
        .filter(item => item.value !== '');
    const ulVisible = !!document.querySelector('ul.tpi-sto--search-status-list[status-list-visible="true"]');
    if (ulVisible) {
        // Устанавливаем waiting только для строк, которые ещё не обработаны
        allLines.forEach((line, idx) => {
            const currentStatus = getLineStatus(idx);
            if (currentStatus === 'default' || currentStatus === 'empty' || !currentStatus) {
                setLineStatus(idx, line.trim() === '' ? 'empty' : 'waiting');
            }
        });
    }

    // если статус-список открыт – перестраиваем его по textarea
    const statusList = document.querySelector('ul.tpi-sto--search-status-list');
    if (statusList && statusList.getAttribute('status-list-visible') === 'true') {
        updateStatusList();
    }
        
    const searchValues = textarea.value.split('\n').filter(val => val.trim() !== '');
    const outputTable = document.querySelector('.diman__TURBOpi__textToOrders__table');

    // если статус-список открыт – перестраиваем его по textarea
    if (document.querySelector('ul.tpi-sto--search-status-list[status-list-visible="true"]')) {
        updateStatusList();
    }


    // Ссылка на прогресс-блок
    const progressBlock = document.querySelector('.diman__TURBOpi__textToOrders__searchProgress');
    const progressText = progressBlock.querySelector('p');

    // Устанавливаем начальные значения
    let current = 0;
    const total = queue.length;
    progressBlock.setAttribute("state", "searching");
    progressText.textContent = `${current} из ${total}`;
    
    // Проверяем состояние чекбокса
    const clearTableMode = document.querySelector('#tpi-textToOrders-checkbox')?.checked;
    
    
    // Очищаем таблицу ТОЛЬКО если чекбокс отмечен
    if (clearTableMode) {
        outputTable.innerHTML = `${theadForTables}<tbody></tbody>`;
    }
    // Добавляем заголовок если таблица полностью пуста (первый поиск в unchecked режиме)
    else if (!outputTable.querySelector('thead')) {
        outputTable.innerHTML = `${theadForTables}<tbody></tbody>`;
    }
    
    // Получаем или создаем tbody
    let outputTbodyNew = outputTable.querySelector('tbody');
    if (!outputTbodyNew) {
        outputTable.insertAdjacentHTML('beforeend', '<tbody></tbody>');
        outputTbodyNew = outputTable.querySelector('tbody');
    }
    
    if (searchValues.length === 0) {
        alert('Пожалуйста, введите данные для поиска');
        return;
    }
    
    const tpi__stopAnimation = document.querySelector('#tpi--sto-stopAniamtion');
    function tpi__iconAnimations(){
        if(tpi__stopAnimation){
            const all_tr_Icons = document.querySelectorAll(".diman__lineHeightFix")
            if(tpi__stopAnimation.checked){
                all_tr_Icons.forEach(icon => {
                    icon.setAttribute("tpi--icon-animation", true)
                });
            }else{
                all_tr_Icons.forEach(icon => {
                    icon.setAttribute("tpi--icon-animation", false)
                });
            }
        }
    }
    tpi__iconAnimations()
    tpi__stopAnimation.addEventListener("click", tpi__iconAnimations)
    

    // Функция для проверки существования значения в таблице
    function isValueAlreadyExists(value) {
        // Ищем в обычных строках
        const existingDataCells = outputTbodyNew.querySelectorAll(
            'div[data-tid-prop="66fcbac9 cb97fdce"], ' +
            'a[data-tid-prop="8e34e3c2 d47a3f9b 2cf94f05 4c804321"] span[data-tid-prop="ae445ad4"]'
        );
        
        for (const cell of existingDataCells) {
            if (cell.textContent.trim() === value) {
                return true;
            }
        }
        
        // Ищем в строках "Нет данных"
        const noDataRows = outputTbodyNew.querySelectorAll('.diman__TURBOpi__textToOrders__unknownSortable');
        for (const row of noDataRows) {
            if (row.textContent.includes(value)) {
                return true;
            }
        }
        
        return false;
    }

    // Функция для работы с инпутами (без изменений)
    const setInputValue = (inputElement, value) => {
        if (!inputElement) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, value);
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);
    };

    // Получаем ссылки на инпуты
    const primaryInput = document.querySelector('input[data-tid-prop="282bb2c7 946cf278"]');
    const alternativeInput = document.querySelector('input[data-tid-prop="282bb2c7 e403f9f8"]');
    
    if (!primaryInput || !alternativeInput) {
        alert('Не удалось найти необходимые элементы на странице');
        return;
    }

    // Функция для проверки существования значения в таблице
    function isValueAlreadyExists(value) {
        if (clearTableMode) return false; // В режиме очистки пропускаем проверку
        
        const existingRows = outputTbodyNew.querySelectorAll('tr');
        for (const row of existingRows) {
            // Проверяем обычные строки с данными
            const dataCell = row.querySelector('div[data-tid-prop="66fcbac9 cb97fdce"], a[data-tid-prop="8e34e3c2 d47a3f9b 2cf94f05 4c804321"] span[data-tid-prop="ae445ad4"]');
            if (dataCell && dataCell.textContent.trim() === value) {
                return true;
            }
            
            // Проверяем строки "Нет данных"
            const noDataRow = row.querySelector('.diman__TURBOpi__textToOrders__unknownSortable');
            if (noDataRow && noDataRow.textContent.includes(value)) {
                return true;
            }
        }
        return false;
    }

    async function processValue(value, itemIdx) {
        // Очищаем инпуты перед поиском
        setInputValue(primaryInput, '');
        setInputValue(alternativeInput, '');
        await new Promise(resolve => setTimeout(resolve, 300));

        // Функция для проверки наличия данных
        const checkDataExists = async (inputElement) => {
            setInputValue(inputElement, value);
            
            try {
                const result = await waitForTableUpdate(value);
                if (result.found && result.elements && result.elements.length > 0) {
                    // Добавляем все найденные строки
                    for (let i = 0; i < result.elements.length; i++) {
                        const foundItem = result.elements[i];
                        const row = foundItem.element.closest('tr');
                        if (row) {
                            const clonedRow = row.cloneNode(true);
                            
                            if (result.elements.length > 1) {
                                if (i === 0) {
                                    clonedRow.setAttribute('tpi-sto--multipleSortable', 'top');
                                } else if (i === result.elements.length - 1) {
                                    clonedRow.setAttribute('tpi-sto--multipleSortable', 'bottom');
                                } else {
                                    clonedRow.setAttribute('tpi-sto--multipleSortable', 'center');
                                }
                            }
                            
                            setTimeout(() => {
                                clonedRow.style.zIndex = '1';
                                clonedRow.classList.add("tpi-sto-cloned-row");
                            }, 600);
                            
                            addCopyHandlersToRow(clonedRow);
                            outputTbodyNew.appendChild(clonedRow);
                            
                            // Сохраняем соответствие между строкой textarea и строкой таблицы
                            textareaToTableMapping.set(itemIdx, clonedRow);
                            clonedRow.setAttribute('data-textarea-line-idx', itemIdx);
                            
                            checkDuplicates();
                            updateStatusList();
                        }
                    }
                    return { success: true, count: result.elements.length };
                }
                return { success: false, count: 0 };
            } catch (error) {
                console.error('Ошибка при поиске данных:', error);
                return { success: false, count: 0 };
            }
        };

        // Определяем порядок поиска
        const shouldSearchPrimaryFirst = () => {
            const primaryPrefixes = ["YP", "F1254", "BP", "SP", "VOZ", "PVZ", "F3000", "F4000", "F5000", "F0254", "F2254", "P0", "YMCN"];
            if (primaryPrefixes.some(prefix => value.startsWith(prefix))) return true;
            
            const primaryPrefixesUIT = ["07", "04", "05", "72"];
            if (primaryPrefixesUIT.some(prefix => value.startsWith(prefix)) && value.length === 12) return true;

            if (/^[^\s-]{11}-\d$/.test(value)) return true;
            
            return false;
        };

        const shouldSearchAlternativeFirst = () => {
            if (value.startsWith('LO-') || value.startsWith('FF-') || value.startsWith('AE-') || value.startsWith('0000')) return true;
            if (value.startsWith('4') && value.length === 11) return true;
            return false;
        };

        // Определяем порядок поиска
        const order = shouldSearchPrimaryFirst() ? 'primaryFirst' : 
                    shouldSearchAlternativeFirst() ? 'alternativeFirst' : 
                    'primaryFirst';

        let result;
        if (order === 'primaryFirst') {
            result = await checkDataExists(primaryInput);
            if (!result.success) {
                setInputValue(primaryInput, '');
                await new Promise(resolve => setTimeout(resolve, 500));
                result = await checkDataExists(alternativeInput);
                if (!result.success) {
                    addNoDataRow(value, itemIdx);
                    return { found: false, count: 0 };
                }
            }
        } else {
            result = await checkDataExists(alternativeInput);
            if (!result.success) {
                setInputValue(alternativeInput, '');
                await new Promise(resolve => setTimeout(resolve, 500));
                result = await checkDataExists(primaryInput);
                if (!result.success) {
                    addNoDataRow(value, itemIdx);
                    return { found: false, count: 0 };
                }
            }
        }
        
        return { found: result.success, count: result.count };
    }

    function addCopyHandlersToRow(row) {
        const defaultCopyButton = row.querySelector('.diman__copyFullOrderDataDefault');
        if (defaultCopyButton) {
            defaultCopyButton.addEventListener('click', () => {
                const trElement = row;
                const externalIdSpan = trElement.querySelector('a[data-e2e="sortable-table-order-external-id"] > span');
                const barcodeLinkDiv = trElement.querySelector('a[data-e2e="sortable-barcode-link"] div');
                
                if (barcodeLinkDiv) {
                    let textToCopy;
                    if (externalIdSpan) {
                        const externalIdText = externalIdSpan.textContent;
                        const barcodeText = barcodeLinkDiv.textContent;
                        textToCopy = `${externalIdText} (${barcodeText})`;
                    } else {
                        const barcodeText = barcodeLinkDiv.textContent;
                        textToCopy = `${barcodeText}`;
                    }
                    
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            console.log(`Copied: ${textToCopy}`);
                            tpiNotification.show("Текст скопирован", "success", `Текст <span>${textToCopy}</span> успешно скопирован`);
                        })
                        .catch(err => {
                            console.error('Failed to copy text: ', err);
                        });
                }
            });
        }
        
        // Обработчик для кнопки diman__copyFullOrderData
        const formattedCopyButton = row.querySelector('.diman__copyFullOrderData');
        if (formattedCopyButton) {
            formattedCopyButton.addEventListener('click', () => {
                const trElement = row;
                const externalIdSpan = trElement.querySelector('a[data-e2e="sortable-table-order-external-id"] > span');
                const barcodeLinkDiv = trElement.querySelector('a[data-e2e="sortable-barcode-link"] div');
                
                if (barcodeLinkDiv) {
                    let textToCopy;
                    if (externalIdSpan) {
                        const externalIdText = externalIdSpan.textContent;
                        const barcodeText = barcodeLinkDiv.textContent;
                        textToCopy = `\`${externalIdText}\` (\`${barcodeText}\`)`;
                    } else {
                        const barcodeText = barcodeLinkDiv.textContent;
                        textToCopy = `\`${barcodeText}\``;
                    }
                    
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            console.log(`Copied: ${textToCopy}`);
                            tpiNotification.show("Текст скопирован", "success", `Текст <span>${textToCopy}</span> успешно скопирован`);
                        })
                        .catch(err => {
                            console.error('Failed to copy text: ', err);
                        });
                }
            });
        }
    }

    async function waitForTableUpdate(value) {
        const MAX_ATTEMPTS = 25;
        let attempts = 0;
        
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                attempts++;
                const allRows = document.querySelectorAll('#app table tbody tr:not(.diman__TURBOpi__textToOrders__unknownSortable)');
                const foundElements = [];
                
                for (const row of allRows) {
                    const exactMatch = row.querySelector('div[data-tid-prop="66fcbac9 cb97fdce"]');
                    if (exactMatch && exactMatch.textContent.trim() === value) {
                        foundElements.push({ element: exactMatch, type: 'exact' });
                        continue;
                    }

                    const altMatch = row.querySelector('a[data-tid-prop="8e34e3c2 d47a3f9b 2cf94f05 4c804321"] span[data-tid-prop="ae445ad4"]');
                    if (altMatch && altMatch.textContent.trim() === value) {
                        foundElements.push({ element: altMatch, type: 'alt' });
                        continue;
                    }

                    if (row.textContent.includes(value)) {
                        const firstCell = row.querySelector('td');
                        if (firstCell) {
                            foundElements.push({ element: firstCell, type: 'partial' });
                        }
                    }
                }

                if (foundElements.length > 0) {
                    clearInterval(checkInterval);
                    return resolve({ found: true, elements: foundElements, count: foundElements.length });
                }

                if (attempts > 5) {
                    const noData = document.querySelector('span[data-e2e-i18n-key="pages.sorting-center-sortable-list:sortable-table.empty"]');
                    if (noData && noData.textContent.includes('Нет данных')) {
                        clearInterval(checkInterval);
                        return resolve({ found: false, elements: [], count: 0 });
                    }
                }

                if (attempts >= MAX_ATTEMPTS) {
                    clearInterval(checkInterval);
                    return resolve({ found: false, elements: [], count: 0 });
                }
            }, 500);
        });
    }

    function addNoDataRow(value, lineIdx) {
        const row = document.createElement('tr');
        row.className = "diman__TURBOpi__textToOrders__unknownSortable";
        row.innerHTML = `
            <td class="_stickyColumn___BusWf _lastLeftSideColumn___FPdjx" style="left: 0px;">
                <div>Нет информации по запросу:
                    <span>${value}</span>
                </div>
            </td>
            <td colspan="20"></td>
        `;
        
        // Сохраняем соответствие
        textareaToTableMapping.set(lineIdx, row);
        row.setAttribute('data-textarea-line-idx', lineIdx);
        
        outputTbodyNew.appendChild(row);
        checkDuplicates();
    }

    function checkDuplicates() {
        const table = document.querySelector('table.diman__TURBOpi__textToOrders__table tbody');
        if (!table) return false;
    
        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length === 0) return false;
    
        const getRowText = (row) => {
            return Array.from(row.cells).map(cell => cell.innerText.trim());
        };
    
        const rowMap = new Map();
        rows.forEach((row, index) => {
            const rowKey = getRowText(row).join('|');
            if (!rowMap.has(rowKey)) {
                rowMap.set(rowKey, []);
            }
            rowMap.get(rowKey).push({row, index});
        });
    
        const duplicates = Array.from(rowMap.values()).filter(group => group.length > 1);
        const deleteBtn = document.querySelector('.tpi-double-delete');
        
        if (deleteBtn) {
            deleteBtn.disabled = duplicates.length === 0;
            if (!deleteBtn.hasAttribute('data-duplicate-handler')) {
                deleteBtn.setAttribute('data-duplicate-handler', 'true');
                deleteBtn.addEventListener('click', deleteDuplicates);
            }
        }
    
        // Сбрасываем все атрибуты дубликатов
        rows.forEach(row => {
            row.removeAttribute('tpi-text-to-order');
        });
    
        // Устанавливаем атрибуты только для дубликатов (начиная со второго вхождения)
        duplicates.forEach(group => {
            group.forEach((item, groupIndex) => {
                if (groupIndex > 0) { // Только для дубликатов (после первого вхождения)
                    item.row.setAttribute('tpi-text-to-order', 'double');
                }
            });
        });
    
        return duplicates.length > 0;
    }

    function deleteDuplicates() {
        const table = document.querySelector('table.diman__TURBOpi__textToOrders__table tbody');
        if (!table) return;
    
        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length === 0) return;
    
        const getRowText = (row) => {
            return Array.from(row.cells).map(cell => cell.innerText.trim());
        };
    
        const rowMap = new Map();
        rows.forEach(row => {
            const rowKey = getRowText(row).join('|');
            if (!rowMap.has(rowKey)) {
                rowMap.set(rowKey, []);
            }
            rowMap.get(rowKey).push(row);
        });
    
        // Удаляем только дубликаты (начиная со второго вхождения)
        const deletedLineIndexes = []; // Сохраняем индексы удаленных строк
        
        rowMap.forEach(group => {
            if (group.length > 1) {
                for (let i = 1; i < group.length; i++) {
                    const rowToDelete = group[i];
                    // Удаляем из mapping
                    const lineIdx = rowToDelete.getAttribute('data-textarea-line-idx');
                    if (lineIdx) {
                        deletedLineIndexes.push(parseInt(lineIdx));
                        textareaToTableMapping.delete(parseInt(lineIdx));
                    }
                    rowToDelete.remove();
                }
            }
        });
    
        // Удаляем соответствующие строки из textarea
        if (deletedLineIndexes.length > 0) {
            removeLinesFromTextarea(deletedLineIndexes);
        }
    
        // Пересчитываем data-textarea-line-idx для оставшихся строк
        reindexTableRows();
    
        const deleteBtn = document.querySelector('.tpi-double-delete');
        if (deleteBtn) deleteBtn.disabled = true;
    
        // Обновляем статусы после удаления
        updateStatusListAfterDeletion();
        
        // Сбрасываем все атрибуты после удаления
        const remainingRows = table.querySelectorAll('tr');
        remainingRows.forEach(row => {
            row.removeAttribute('tpi-text-to-order');
        });
    }
    
    // Новая функция для переиндексации строк таблицы
    function reindexTableRows() {
        const table = document.querySelector('table.diman__TURBOpi__textToOrders__table tbody');
        if (!table) return;
        
        const rows = Array.from(table.querySelectorAll('tr'));
        const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
        if (!textArea) return;
        
        const lines = textArea.value.split('\n').filter(line => line.trim() !== '');
        
        // Очищаем mapping
        textareaToTableMapping.clear();
        
        // Переиндексируем строки
        rows.forEach((row, index) => {
            const lineIdx = index; // Новый индекс соответствует порядку в таблице
            
            // Обновляем атрибут строки
            row.setAttribute('data-textarea-line-idx', lineIdx);
            
            // Обновляем mapping
            textareaToTableMapping.set(lineIdx, row);
            
            // Обновляем статус соответствующей строки в списке
            const li = document.querySelector(`ul.tpi-sto--search-status-list li[data-line-idx="${lineIdx}"]`);
            if (li) {
                const currentStatus = li.getAttribute("data-status");
                if (currentStatus === 'double') {
                    setLineStatus(lineIdx, 'found'); // Дубликат удален, теперь это обычная найденная строка
                }
            }
        });
    }
    
    // Новая функция для удаления строк из textarea
    function removeLinesFromTextarea(lineIndexes) {
        const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
        if (!textArea) return;
        
        const lines = textArea.value.split('\n');
        
        // Сортируем индексы в обратном порядке, чтобы удаление не влияло на позиции
        lineIndexes.sort((a, b) => b - a);
        
        // Удаляем строки с указанными индексами
        lineIndexes.forEach(index => {
            if (index >= 0 && index < lines.length) {
                lines.splice(index, 1);
            }
        });
        
        // Обновляем textarea
        textArea.value = lines.join('\n');
        
        // Обновляем список статусов
        updateStatusList();
    }

// Также обновляем обработчик кнопки удаления дубликатов
function checkDuplicates() {
    const table = document.querySelector('table.diman__TURBOpi__textToOrders__table tbody');
    if (!table) return false;

    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length === 0) return false;

    const getRowText = (row) => {
        return Array.from(row.cells).map(cell => cell.innerText.trim());
    };

    const rowMap = new Map();
    rows.forEach((row, index) => {
        const rowKey = getRowText(row).join('|');
        if (!rowMap.has(rowKey)) {
            rowMap.set(rowKey, []);
        }
        rowMap.get(rowKey).push({row, index});
    });

    const duplicates = Array.from(rowMap.values()).filter(group => group.length > 1);
    const deleteBtn = document.querySelector('.tpi-double-delete');
    
    if (deleteBtn) {
        deleteBtn.disabled = duplicates.length === 0;
        if (!deleteBtn.hasAttribute('data-duplicate-handler')) {
            deleteBtn.setAttribute('data-duplicate-handler', 'true');
            deleteBtn.addEventListener('click', deleteDuplicates);
        }
    }

    // Сбрасываем все атрибуты дубликатов
    rows.forEach(row => {
        row.removeAttribute('tpi-text-to-order');
    });

    // Устанавливаем атрибуты только для дубликатов (начиная со второго вхождения)
    duplicates.forEach(group => {
        group.forEach((item, groupIndex) => {
            if (groupIndex > 0) { // Только для дубликатов (после первого вхождения)
                item.row.setAttribute('tpi-text-to-order', 'double');
            }
        });
    });

    return duplicates.length > 0;
}

    // Основной цикл обработки
(async () => {
    try {
        // Устанавливаем waiting только для строк, которые ещё не имеют статуса
        queue.forEach(item => {
            const currentStatus = getLineStatus(item.idx);
            if (currentStatus === 'default' || !currentStatus || currentStatus === 'empty') {
                setLineStatus(item.idx, "waiting");
            }
        });

        for (const item of queue) {
            if (!clearTableMode && isValueAlreadyExists(item.value)) {
                console.log(`[Пропуск] "${item.value}" уже найден ранее`);
                setLineStatus(item.idx, "found");
                current++;
                progressText.textContent = `${current} из ${total}`;
                continue;
            }

            setLineStatus(item.idx, "searching");

            const result = await processValue(item.value, item.idx);

            if (result.found) {
                // Определяем статус на основе количества найденных строк
                let status;
                if (result.count > 1) {
                    status = "multiple";
                } else {
                    // Проверяем, не стал ли дубликатом
                    const table = document.querySelector(".diman__TURBOpi__textToOrders__table tbody");
                    let isDouble = false;
                    if (table) {
                        const rows = table.querySelectorAll('tr');
                        const currentRowText = getRowText(rows[rows.length - 1]);
                        
                        for (let i = 0; i < rows.length - 1; i++) {
                            if (getRowText(rows[i]).join('|') === currentRowText.join('|')) {
                                isDouble = true;
                                break;
                            }
                        }
                    }
                    status = isDouble ? "double" : "found";
                }
                setLineStatus(item.idx, status);
            } else {
                setLineStatus(item.idx, "error");
            }

            current++;
            progressText.textContent = `${current} из ${total}`;
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    } finally {
        setInputValue(primaryInput, 'turboPI-Text-to-Orders');
        setInputValue(alternativeInput, '');
        checkDuplicates();
        updateStatusList();
        progressBlock.setAttribute("state", "finished");
    }
})();
    
    // Вспомогательная функция для получения текста строки
    function getRowText(row) {
        return Array.from(row.cells).map(cell => cell.innerText.trim());
    }
    
    // Вспомогательная функция для получения текущего статуса строки
    function getLineStatus(lineIdx) {
        const li = document.querySelector(`ul.tpi-sto--search-status-list li[data-line-idx="${lineIdx}"]`);
        return li ? li.getAttribute("data-status") : null;
    }
    
}

function updateStatusList() {
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul) return;
    
    // Если список скрыт, не обновляем его
    if (ul.getAttribute('status-list-visible') === 'false') {
        return;
    }

    const textArea = document.querySelector(".diman__TURBOpi__textToOrders__textArea");
    if (!textArea) return;

    const lines = textArea.value.split("\n");
    
    // Сохраняем текущие статусы
    const currentStatuses = {};
    ul.querySelectorAll('li').forEach(li => {
        const idx = li.getAttribute("data-line-idx");
        const status = li.getAttribute("data-status");
        const originalValue = li.getAttribute("data-original-value");
        if (idx !== null) {
            currentStatuses[idx] = { status, originalValue };
        }
    });

    // Удаляем лишние строки (если текст сократился)
    const existingItems = ul.querySelectorAll('li');
    existingItems.forEach(li => {
        const idx = li.getAttribute("data-line-idx");
        if (idx >= lines.length) {
            li.remove();
            // Удаляем из forcedMultipleLines если строка удалена
            forcedMultipleLines.delete(idx);
        }
    });

    let visibleIndex = 0;
    const previousLines = [];

    lines.forEach((line, index) => {
        const needle = line.trim();
        const idx = String(index);
        
        let li = ul.querySelector(`li[data-line-idx="${idx}"]`);
        const isNewLine = !li;

        if (isNewLine) {
            li = document.createElement("li");
            li.setAttribute("data-line-idx", idx);
            
            const wrapper = document.createElement("div");
            wrapper.className = "tpi-sto--status-line";

            const numDiv = document.createElement("div");
            numDiv.className = "tpi-sto--status-line-number";

            const iconDiv = document.createElement("div");
            iconDiv.className = "tpi-sto--status-line-icon";

            wrapper.appendChild(numDiv);
            wrapper.appendChild(iconDiv);
            li.appendChild(wrapper);
            ul.appendChild(li);
        }

        // Обновляем номер строки
        const numDiv = li.querySelector(".tpi-sto--status-line-number");
        if (numDiv) {
            numDiv.textContent = needle ? String(++visibleIndex) : "×";
        }

        // Сохраняем оригинальное значение
        li.setAttribute("data-original-value", needle);

        // Определяем статус
        let status;
        if (!needle) {
            status = "empty";
        } else {
            const previousData = currentStatuses[idx];
            
            // Если строка изменилась или новая - определяем статус заново
            if (isNewLine || !previousData || previousData.originalValue !== needle) {
                const previousNeedles = new Set(previousLines);
                const { found, isDouble, isMultiple } = findStatusAcrossTables(needle, previousNeedles);
                
                // Сбрасываем forcedMultiple если строка изменилась
                if (isNewLine || previousData.originalValue !== needle) {
                    forcedMultipleLines.delete(idx);
                }
                
                if (isMultiple) {
                    status = "multiple";
                } else if (isDouble) {
                    status = "double";
                } else if (found) {
                    status = "found";
                } else {
                    status = "default";
                }
            } else {
                // Сохраняем существующий статус
                status = previousData.status || "default";
            }
            
            previousLines.push(needle);
        }

        // Устанавливаем статус
        setLineStatus(index, status);

        // Обновляем обработчики событий
        li.removeEventListener('mouseenter', li._mouseEnterHandler);
        li.removeEventListener('mouseleave', li._mouseLeaveHandler);
        
        const mouseEnterHandler = () => toggleHighlightForLine(index, true);
        const mouseLeaveHandler = () => toggleHighlightForLine(index, false);
        
        li._mouseEnterHandler = mouseEnterHandler;
        li._mouseLeaveHandler = mouseLeaveHandler;
        
        // Добавляем обработчики ко всему элементу li
        li.addEventListener('mouseenter', mouseEnterHandler);
        li.addEventListener('mouseleave', mouseLeaveHandler);
        
        // Также добавляем обработчики specifically к иконке
        const iconDiv = li.querySelector(".tpi-sto--status-line-icon");
        if (iconDiv) {
            iconDiv.removeEventListener('mouseenter', iconDiv._mouseEnterHandler);
            iconDiv.removeEventListener('mouseleave', iconDiv._mouseLeaveHandler);
            
            iconDiv._mouseEnterHandler = mouseEnterHandler;
            iconDiv._mouseLeaveHandler = mouseLeaveHandler;
            
            iconDiv.addEventListener('mouseenter', mouseEnterHandler);
            iconDiv.addEventListener('mouseleave', mouseLeaveHandler);
        }
    });
}


function handleTextAreaInput() {
    const textArea = document.querySelector(".diman__TURBOpi__textToOrders__textArea");
    if (!textArea) return;

    const progressBlock = document.querySelector('.diman__TURBOpi__textToOrders__searchProgress');
    const isSearching = progressBlock && progressBlock.getAttribute("state") === "searching";
    
    if (!isSearching) {
        resetStatusesOnInput();
    }
    
    updateStatusList();
}

function updateStatusListForNewLines() {
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul) return;

    const textArea = document.querySelector(".diman__TURBOpi__textToOrders__textArea");
    if (!textArea) return;

    const lines = textArea.value.split("\n");
    const previousLines = [];

    lines.forEach((line, index) => {
        const li = ul.querySelector(`li[data-line-idx="${index}"]`);
        const needle = line.trim();

        if (!needle) {
            // Пустая строка - всегда empty
            if (li) {
                li.setAttribute("data-status", "empty");
                const iconDiv = li.querySelector(".tpi-sto--status-line-icon");
                if (iconDiv) {
                    iconDiv.innerHTML = tpiIconEmpty;
                }
                const numDiv = li.querySelector(".tpi-sto--status-line-number");
                if (numDiv) {
                    numDiv.textContent = "×";
                }
            }
        } else {
            // Для непустых строк
            if (!li) {
                // Новая строка - создаём и устанавливаем статус
                const newLi = document.createElement("li");
                newLi.setAttribute("data-line-idx", String(index));
                
                const wrapper = document.createElement("div");
                wrapper.className = "tpi-sto--status-line";

                const numDiv = document.createElement("div");
                numDiv.className = "tpi-sto--status-line-number";
                numDiv.textContent = String(index + 1); // Нумерация с 1

                const iconDiv = document.createElement("div");
                iconDiv.className = "tpi-sto--status-line-icon";

                // проверяем только среди предыдущих строк
                const previousNeedles = new Set(previousLines);
                const { found, isDouble } = findStatusAcrossTables(needle, previousNeedles);
                const status = isDouble ? "double" : (found ? "found" : "default");

                newLi.setAttribute("data-status", status);
                iconDiv.innerHTML = tpiIconByStatus[status] || tpiIconDefault;

                wrapper.appendChild(numDiv);
                wrapper.appendChild(iconDiv);
                newLi.appendChild(wrapper);
                ul.appendChild(newLi);
            } else {
                // Существующая строка - обновляем только если была default или empty
                const currentStatus = li.getAttribute("data-status");
                if (currentStatus === "default" || currentStatus === "empty") {
                    const previousNeedles = new Set(previousLines);
                    const { found, isDouble } = findStatusAcrossTables(needle, previousNeedles);
                    const newStatus = isDouble ? "double" : (found ? "found" : "default");
                    
                    li.setAttribute("data-status", newStatus);
                    const iconDiv = li.querySelector(".tpi-sto--status-line-icon");
                    if (iconDiv) {
                        iconDiv.innerHTML = tpiIconByStatus[newStatus] || tpiIconDefault;
                    }
                }
            }
            
            previousLines.push(needle);
        }
    });

    // Удаляем лишние строки, если текст был удалён
    const existingItems = ul.querySelectorAll('li');
    existingItems.forEach(li => {
        const idx = parseInt(li.getAttribute("data-line-idx"));
        if (idx >= lines.length) {
            li.remove();
        }
    });
}

function resetStatusesForSearch() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    if (!textArea) return;
    
    const lines = textArea.value.split('\n');
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul) return;
    
    // Сохраняем оригинальные значения строк для сравнения
    const originalValues = {};
    ul.querySelectorAll('li').forEach(li => {
        const idx = li.getAttribute("data-line-idx");
        const valueAttr = li.getAttribute("data-original-value");
        if (idx && valueAttr) {
            originalValues[idx] = valueAttr;
        }
    });
    
    // Обновляем статусы
    lines.forEach((line, index) => {
        const needle = line.trim();
        const li = ul.querySelector(`li[data-line-idx="${index}"]`);
        
        if (!li) return;
        
        const originalValue = originalValues[index];
        const currentStatus = li.getAttribute("data-status");
        
        // Если строка изменилась - сбрасываем статус
        if (originalValue !== needle) {
            if (needle === '') {
                setLineStatus(index, 'empty');
            } else {
                setLineStatus(index, 'waiting');
            }
        } else if (currentStatus === 'found' || currentStatus === 'error' || currentStatus === 'double') {
            // Если строка не изменилась и имеет финальный статус - оставляем как есть
            setLineStatus(index, currentStatus);
        } else {
            // В противном случае ставим waiting
            setLineStatus(index, 'waiting');
        }
        
        // Обновляем оригинальное значение
        li.setAttribute("data-original-value", needle);
    });
}

function resetAllStatusesForSearch() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    if (!textArea) return;
    
    const lines = textArea.value.split('\n');
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul) return;
    
    lines.forEach((line, index) => {
        const needle = line.trim();
        const li = ul.querySelector(`li[data-line-idx="${index}"]`);
        
        if (!li) return;
        
        // ВСЕ строки сбрасываются на waiting (непустые) или empty (пустые)
        if (needle === '') {
            setLineStatus(index, 'empty');
        } else {
            setLineStatus(index, 'waiting');
        }
        
        // Обновляем оригинальное значение
        li.setAttribute("data-original-value", needle);
    });
}

function resetStatusesOnInput() {
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul) return;
    
    const textArea = document.querySelector(".diman__TURBOpi__textToOrders__textArea");
    if (!textArea) return;
    
    const lines = textArea.value.split("\n");
    
    // Очищаем forcedMultipleLines при изменении ввода
    forcedMultipleLines.clear();
    
    lines.forEach((line, index) => {
        const needle = line.trim();
        const li = ul.querySelector(`li[data-line-idx="${index}"]`);
        
        if (!li) return;
        
        const originalValue = li.getAttribute("data-original-value");
        const currentStatus = li.getAttribute("data-status");
        
        // Если строка изменилась - делаем exact проверку
        if (originalValue !== needle) {
            if (needle === '') {
                setLineStatus(index, 'empty');
            } else {
                // Exact проверка: ищем ТОЛЬКО точное совпадение
                const previousNeedles = new Set();
                const { found, isDouble, isMultiple } = findStatusAcrossTables(needle, previousNeedles);
                
                if (found) {
                    setLineStatus(index, isDouble ? 'double' : (isMultiple ? 'multiple' : 'found'));
                } else {
                    setLineStatus(index, 'default');
                }
            }
        }
        // Обновляем оригинальное значение
        li.setAttribute("data-original-value", needle);
    });
}

// Добавляем глобальную переменную для хранения соответствия
const textareaToTableMapping = new Map();

function toggleHighlightForLine(lineIdx, arg2, arg3) {
    let enable = true;
    let status = null;

    if (typeof arg2 === 'boolean') {
        enable = arg2;
        const li = document.querySelector(`ul.tpi-sto--search-status-list li[data-line-idx="${lineIdx}"]`);
        status = li ? li.getAttribute('data-status') : null;
    } else if (typeof arg2 === 'string' && typeof arg3 === 'boolean') {
        status = arg2;
        enable = arg3;
    } else {
        enable = !!arg2;
        const li = document.querySelector(`ul.tpi-sto--search-status-list li[data-line-idx="${lineIdx}"]`);
        status = li ? li.getAttribute('data-status') : null;
    }

    const table = document.querySelector('.diman__TURBOpi__textToOrders__table tbody');
    if (!table) return;

    // Сброс предыдущих подсветок
    table.querySelectorAll('tr[statusHighlight]').forEach(tr => tr.removeAttribute('statusHighlight'));
    if (!enable || !status) return;

    if (status === 'default' || status === 'waiting' || status === 'searching' || status === 'empty') return;

    // error -> ищем unknownSortable и совпадающий текст (как раньше)
    if (status === 'error') {
        const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
        const needle = textArea ? (textArea.value.split('\n')[lineIdx] || "").trim() : "";
        const errorRows = table.querySelectorAll('tr.diman__TURBOpi__textToOrders__unknownSortable');
        for (const row of errorRows) {
            const span = row.querySelector('span');
            if (span && span.textContent.trim() === needle) {
                row.setAttribute('statusHighlight', 'error');
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }
        return;
    }

    // multiple -> подсвечиваем все tr этой строки
    if (status === 'multiple') {
        const rows = Array.from(table.querySelectorAll(`tr[data-textarea-line-idx="${lineIdx}"]`));
        rows.forEach(r => r.setAttribute('statusHighlight', 'multiple'));
        if (rows.length) rows[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // found/double/... -> старая логика: mapping -> fallback поиск
    try {
        const mapped = (typeof textareaToTableMapping !== 'undefined') ? textareaToTableMapping.get(lineIdx) : null;
        if (mapped && mapped.isConnected) {
            mapped.setAttribute('statusHighlight', status);
            mapped.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    } catch (e) {
        // ignore
    }

    // fallback: искать exact по основным селекторам
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    const needle = textArea ? (textArea.value.split('\n')[lineIdx] || "").trim() : "";
    const allRows = Array.from(table.querySelectorAll('tr'));
    for (const tr of allRows) {
        const exactMatch = tr.querySelector('div[data-tid-prop="66fcbac9 cb97fdce"]');
        if (exactMatch && needle && exactMatch.textContent.trim() === needle) {
            tr.setAttribute('statusHighlight', status);
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const altMatch = tr.querySelector('a[data-tid-prop="8e34e3c2 d47a3f9b 2cf94f05 4c804321"] span[data-tid-prop="ae445ad4"]');
        if (altMatch && needle && altMatch.textContent.trim() === needle) {
            tr.setAttribute('statusHighlight', status);
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    }
}
// Функция для обновления статусов после удаления дубликатов
function updateStatusListAfterDeletion() {
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul) return;

    const textArea = document.querySelector(".diman__TURBOpi__textToOrders__textArea");
    if (!textArea) return;

    const lines = textArea.value.split("\n");
    
    lines.forEach((line, index) => {
        const needle = line.trim();
        if (!needle) return;

        const li = ul.querySelector(`li[data-line-idx="${index}"]`);
        if (!li) return;

        const currentStatus = li.getAttribute("data-status");
        
        // Если статус был double, проверяем остался ли дубликат
        if (currentStatus === 'double') {
            const row = textareaToTableMapping.get(index);
            // Если строка больше не существует в таблице или не имеет атрибута дубликата
            if (!row || !row.isConnected || !row.hasAttribute('tpi-text-to-order')) {
                setLineStatus(index, 'found');
            }
        }
    });
}

function syncScrollBetweenTextareaAndStatusList() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    const statusList = document.querySelector('.tpi-sto--search-status-list');
    
    if (!textArea || !statusList) return;
    
    statusList.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        textArea.scrollBy({
            top: e.deltaY,
            left: e.deltaX,
            behavior: 'smooth'
        });
    });
    
    statusList.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
    
    const syncHeights = () => {
        if (textArea && statusList) {
            statusList.style.height = textArea.clientHeight + 4 + 'px';
            statusList.style.overflow = "hidden";
        }
    };
    
    syncHeights();
    window.addEventListener('resize', syncHeights);
    
    const observer = new MutationObserver(syncHeights);
    observer.observe(textArea, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
    });
}

function updateAllStatusesOnShow() {
    const ul = document.querySelector("ul.tpi-sto--search-status-list");
    if (!ul || ul.getAttribute('status-list-visible') !== 'true') return;
    
    const textArea = document.querySelector(".diman__TURBOpi__textToOrders__textArea");
    if (!textArea) return;
    
    const lines = textArea.value.split("\n");
    const previousLines = [];
    
    lines.forEach((line, index) => {
        const needle = line.trim();
        const li = ul.querySelector(`li[data-line-idx="${index}"]`);
        
        if (!li) return;
        
        if (!needle) {
            setLineStatus(index, 'empty');
        } else {
            const unknownRow = document.querySelector(`tr[data-textarea-line-idx="${index}"].diman__TURBOpi__textToOrders__unknownSortable`);
            if (unknownRow) {
                setLineStatus(index, 'error');
                previousLines.push(needle);
                return;
            }
            
            const doubleRow = document.querySelector(`tr[data-textarea-line-idx="${index}"][tpi-text-to-order="double"]`);
            if (doubleRow) {
                setLineStatus(index, 'double');
                previousLines.push(needle);
                return;
            }
            
            const currentStatus = li.getAttribute("data-status");
            if (currentStatus === 'double' || currentStatus === 'error') {
                previousLines.push(needle);
                return;
            }
            
            const previousNeedles = new Set(previousLines);
            const { found, isDouble, isMultiple } = findStatusAcrossTables(needle, previousNeedles);

            let newStatus;
            if (isMultiple) {
                newStatus = 'multiple';
            } else if (isDouble) {
                newStatus = 'double';
            } else if (found) {
                newStatus = 'found';
            } else {
                const progressBlock = document.querySelector('.diman__TURBOpi__textToOrders__searchProgress');
                const isSearching = progressBlock && progressBlock.getAttribute("state") === "searching";
                
                newStatus = isSearching ? 'waiting' : 'default';
            }
            
            setLineStatus(index, newStatus);
            previousLines.push(needle);
        }
    });
}

function ensureStatusListDelegation() {
    const ul = document.querySelector('ul.tpi-sto--search-status-list');
    if (!ul) return;
    if (ul._hasDelegation) return;

    ul.addEventListener('mouseover', (e) => {
        const li = e.target.closest('li[data-line-idx]');
        if (!li) return;
        if (e.relatedTarget && li.contains(e.relatedTarget)) return;
        const idx = parseInt(li.getAttribute('data-line-idx'), 10);
        toggleHighlightForLine(idx, true);
    });

    ul.addEventListener('mouseout', (e) => {
        const li = e.target.closest('li[data-line-idx]');
        if (!li) return;
        if (e.relatedTarget && li.contains(e.relatedTarget)) return;
        const idx = parseInt(li.getAttribute('data-line-idx'), 10);
        toggleHighlightForLine(idx, false);
    });

    ul._hasDelegation = true;
}

function handleTextAreaChange() {
    forcedMultipleLines.clear();
    updateStatusList();
    updateAllStatusesOnShow();
}

function initTextAreaHandlers() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    if (textArea) {
        // Удаляем старый обработчик если был (чтобы избежать дублирования)
        textArea.removeEventListener('input', handleTextAreaChange);
        // Добавляем новый обработчик
        textArea.addEventListener('input', handleTextAreaChange);
        
        // Также можно добавить обработчик для change
        textArea.removeEventListener('change', handleTextAreaChange);
        textArea.addEventListener('change', handleTextAreaChange);
    }
}

function deleteCurrentLine() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    if (!textArea) return;
    
    const cursorPosition = textArea.selectionStart;
    const text = textArea.value;
    const lines = text.split('\n');
    
    // Находим текущую строку по позиции курсора
    let currentLineIndex = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1; // +1 для символа новой строки
        if (charCount > cursorPosition) {
            currentLineIndex = i;
            break;
        }
    }
    
    // Удаляем текущую строку
    if (lines.length > 0) {
        lines.splice(currentLineIndex, 1);
        textArea.value = lines.join('\n');
        
        // Обновляем статусы
        updateStatusList();
    }
}

// Функция для перемещения строки вниз
function moveLineDown() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    if (!textArea) return;
    
    const cursorPosition = textArea.selectionStart;
    const text = textArea.value;
    const lines = text.split('\n');
    
    // Находим текущую строку
    let currentLineIndex = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (charCount > cursorPosition) {
            currentLineIndex = i;
            break;
        }
    }
    
    // Проверяем, можно ли переместить строку вниз
    if (currentLineIndex < lines.length - 1) {
        // Меняем местами текущую строку и следующую
        const temp = lines[currentLineIndex];
        lines[currentLineIndex] = lines[currentLineIndex + 1];
        lines[currentLineIndex + 1] = temp;
        
        textArea.value = lines.join('\n');
        
        // Устанавливаем курсор на новую позицию (на следующей строке)
        let newCursorPosition = 0;
        for (let i = 0; i < currentLineIndex + 1; i++) {
            newCursorPosition += lines[i].length + 1;
        }
        textArea.setSelectionRange(newCursorPosition, newCursorPosition);
        
        // Обновляем статусы
        updateStatusList();
    }
}

// Функция для перемещения строки вверх
function moveLineUp() {
    const textArea = document.querySelector('.diman__TURBOpi__textToOrders__textArea');
    if (!textArea) return;
    
    const cursorPosition = textArea.selectionStart;
    const text = textArea.value;
    const lines = text.split('\n');
    
    // Находим текущую строку
    let currentLineIndex = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (charCount > cursorPosition) {
            currentLineIndex = i;
            break;
        }
    }
    
    // Проверяем, можно ли переместить строку вверх
    if (currentLineIndex > 0) {
        // Меняем местами текущую строку и предыдущую
        const temp = lines[currentLineIndex];
        lines[currentLineIndex] = lines[currentLineIndex - 1];
        lines[currentLineIndex - 1] = temp;
        
        textArea.value = lines.join('\n');
        
        // Устанавливаем курсор на новую позицию (на предыдущей строке)
        let newCursorPosition = 0;
        for (let i = 0; i < currentLineIndex - 1; i++) {
            newCursorPosition += lines[i].length + 1;
        }
        textArea.setSelectionRange(newCursorPosition, newCursorPosition);
        
        // Обновляем статусы
        updateStatusList();
    }
}

// Функция для обработки горячих клавиш
function handleHotkeys(e) {
    // Проверяем, что фокус на textarea
    if (e.target.classList.contains('diman__TURBOpi__textToOrders__textArea')) {
        // Shift + Delete - удалить текущую строку
        if (e.shiftKey && e.key === 'Delete') {
            e.preventDefault();
            deleteCurrentLine();
        }
        
        // Alt + Стрелка вниз - переместить строку вниз
        if (e.altKey && e.key === 'ArrowDown') {
            e.preventDefault();
            moveLineDown();
        }
        
        // Alt + Стрелка вверх - переместить строку вверх
        if (e.altKey && e.key === 'ArrowUp') {
            e.preventDefault();
            moveLineUp();
        }
    }
}

checkiIs__onStrokeToOrdersPage();

//@@@@@@@ NEW Version code

