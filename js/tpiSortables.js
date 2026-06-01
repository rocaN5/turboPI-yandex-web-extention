let THREE, OrbitControls;
let scene, camera, renderer, controls, cubeGroup, palletGroup, rulersGroup;
let cubeWidth = 300, cubeHeight = 300, cubeDepth = 300;
let animationId = null;
let is3DInitialized = false;
let currentSortableDimensions = { width: 300, height: 300, length: 300 };
let sortableType = null;
let is3DInserted = false;
let currentAnimationId = null;
let current3DInstance = null;

const tpi_sort_icon_cell = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM160 144L480 144C488.8 144 496 151.2 496 160L496 480C496 488.8 488.8 496 480 496L160 496C151.2 496 144 488.8 144 480L144 160C144 151.2 151.2 144 160 144zM224 256C210.7 256 200 266.7 200 280C200 293.3 210.7 304 224 304L416 304C429.3 304 440 293.3 440 280C440 266.7 429.3 256 416 256L224 256zM224 336C210.7 336 200 346.7 200 360C200 373.3 210.7 384 224 384L416 384C429.3 384 440 373.3 440 360C440 346.7 429.3 336 416 336L224 336z"/>
</svg>
`,
tpi_sort_icon_type = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentcolor">
	<path d="M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 240C302.3 240 288 254.3 288 272C288 285.3 277.3 296 264 296C250.7 296 240 285.3 240 272C240 227.8 275.8 192 320 192C364.2 192 400 227.8 400 272C400 319.2 364 339.2 344 346.5L344 350.3C344 363.6 333.3 374.3 320 374.3C306.7 374.3 296 363.6 296 350.3L296 342.2C296 321.7 310.8 307 326.1 302C332.5 299.9 339.3 296.5 344.3 291.7C348.6 287.5 352 281.7 352 272.1C352 254.4 337.7 240.1 320 240.1zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z"/>
</svg>
`,
tpi_sort_icon_date = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentcolor">
    <path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM480 496C488.8 496 496 488.8 496 480L496 416L408 416L408 496L480 496zM496 368L496 288L408 288L408 368L496 368zM360 368L360 288L280 288L280 368L360 368zM232 368L232 288L144 288L144 368L232 368zM144 416L144 480C144 488.8 151.2 496 160 496L232 496L232 416L144 416zM280 416L280 496L360 496L360 416L280 416zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176z"/>
</svg>
`,
tpi_sort_icon_status = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM296 208C296 194.7 306.7 184 320 184C333.3 184 344 194.7 344 208L344 352C344 365.3 333.3 376 320 376C306.7 376 296 365.3 296 352L296 208zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z"/>
</svg>
`,
tpi_sort_icon_stage = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M320 64C335.9 64 351.2 70.3 362.5 81.5L558.5 277.5C569.7 288.8 576 304.1 576 320C576 335.9 569.7 351.2 558.5 362.5L362.5 558.5C351.2 569.7 335.9 576 320 576C304.1 576 288.8 569.7 277.5 558.5L81.5 362.5C70.3 351.2 64 335.9 64 320C64 304.1 70.3 288.8 81.5 277.5L277.5 81.5C288.8 70.3 304.1 64 320 64zM320 128C310.6 128 301.6 131.7 294.9 138.3L138.3 294.9C131.7 301.6 128 310.6 128 320C128 329.4 131.7 338.4 138.3 345.1L294.9 501.7C301.6 508.3 310.6 512 320 512C329.4 512 338.4 508.3 345.1 501.7L501.7 345.1C508.3 338.4 512 329.4 512 320C512 310.6 508.3 301.6 501.7 294.9L345.1 138.3C338.4 131.7 329.4 128 320 128zM296 208C296 194.7 306.7 184 320 184C333.3 184 344 194.7 344 208L344 352C344 365.3 333.3 376 320 376C306.7 376 296 365.3 296 352L296 208zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z"/>
</svg>
`,
tpi_sort_icon_group = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M160 112C195.3 112 225 134.9 236 165.8L288 165.8C341 165.8 384 208.8 384 261.8C384 314.8 341 357.8 288 357.8L224 357.8C188.7 357.8 160 386.5 160 421.8C160 457.1 188.7 485.8 224 485.8L404 485.8L404 448C404 438.3 409.8 429.6 418.8 425.9C427.8 422.2 438.1 424.3 445 431.1L525 511.1C534.4 520.5 534.4 535.5 525 544.9L445 624.9C438.1 631.7 427.8 633.8 418.8 630.1C409.8 626.4 404 617.7 404 608L404 573.8L224 573.8C162.1 573.8 112 523.7 112 461.8C112 399.9 162.1 349.8 224 349.8L288 349.8C314.5 349.8 336 328.3 336 301.8C336 275.3 314.5 253.8 288 253.8L236 253.8C225 284.7 195.3 307.6 160 307.6C115.8 307.6 80 271.8 80 227.6C80 183.4 115.8 152 160 152C195.3 152 225 174.9 236 205.8L288 205.8C341 205.8 384 248.8 384 301.8C384 354.8 341 397.8 288 397.8L224 397.8C188.7 397.8 160 426.5 160 461.8C160 497.1 188.7 525.8 224 525.8L404 525.8L404 485.8L224 485.8C188.7 485.8 160 457.1 160 421.8C160 386.5 188.7 357.8 224 357.8L288 357.8C341 357.8 384 314.8 384 261.8C384 208.8 341 165.8 288 165.8L236 165.8C225 134.9 195.3 112 160 112z"/>
</svg>
`,
tpi_sort_icon_title = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <path d="M8 12a2 2 0 0 0 2-2V8H8"></path>
    <path d="M14 12a2 2 0 0 0 2-2V8h-2"></path>
</svg>
`,
tpi_sort_icon_title_3d = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 17.6l-2 -1.1v-2.5"></path>
    <path d="M4 10v-2.5l2 -1.1"></path>
    <path d="M10 4.1l2 -1.1l2 1.1"></path>
    <path d="M18 6.4l2 1.1v2.5"></path>
    <path d="M20 14v2.5l-2 1.12"></path>
    <path d="M14 19.9l-2 1.1l-2 -1.1"></path>
    <path d="M12 12l2 -1.1"></path>
    <path d="M18 8.6l2 -1.1"></path>
    <path d="M12 12l0 2.5"></path>
    <path d="M12 18.5l0 2.5"></path>
    <path d="M12 12l-2 -1.12"></path>
    <path d="M6 8.6l-2 -1.1"></path>
</svg>
`,
tpi_sort_icon_title_anomaly = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 16v-6a2 2 0 1 1 4 0v6"></path>
    <path d="M10 13h4"></path>
    <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95"></path>
    <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44"></path>
    <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92"></path>
    <path d="M8.56 20.31a9 9 0 0 0 3.44 .69"></path>
    <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95"></path>
    <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44"></path>
    <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92"></path>
    <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69"></path>
</svg>
`,
tpi_sort_icon_order_number = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M216 112C216 94.3 230.3 80 248 80C265.7 80 280 94.3 280 112L280 216L360 216L360 112C360 94.3 374.3 80 392 80C409.7 80 424 94.3 424 112L424 216L456 216C469.3 216 480 226.7 480 240C480 253.3 469.3 264 456 264L424 264L424 360L456 360C469.3 360 480 370.7 480 384C480 397.3 469.3 408 456 408L424 408L424 528C424 545.7 409.7 560 392 560C374.3 560 360 545.7 360 528L360 408L280 408L280 528C280 545.7 265.7 560 248 560C230.3 560 216 545.7 216 528L216 408L184 408C170.7 408 160 397.3 160 384C160 370.7 170.7 360 184 360L216 360L216 264L184 264C170.7 264 160 253.3 160 240C160 226.7 170.7 216 184 216L216 216L216 112zM280 264L280 360L360 360L360 264L280 264z"/>
</svg>
`,
tpi_sort_icon_support = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M320 80C196.3 80 96 180.3 96 304L96 384C78.3 384 64 398.3 64 416L64 464C64 481.7 78.3 496 96 496L128 496C145.7 496 160 481.7 160 464L160 336C160 318.3 145.7 304 128 304L128 304C128 207.5 206.5 128 320 128C433.5 128 512 207.5 512 304L512 336C494.3 336 480 350.3 480 368L480 464C480 481.7 494.3 496 512 496L544 496C561.7 496 576 481.7 576 464L576 416C576 398.3 561.7 384 544 384L544 304C544 180.3 443.7 80 320 80zM272 496C258.7 496 248 506.7 248 520C248 533.3 258.7 544 272 544L368 544C381.3 544 392 533.3 392 520C392 506.7 381.3 496 368 496L272 496z"/>
</svg>
`,
tpi_sort_icon_copy_single = `
<svg viewBox="0 0 24 24" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.6 2.001H7.4a1.402 1.402 0 0 0-1.4 1.4v2.602H3.401a1.401 1.401 0 0 0-1.4 1.4v13.2a1.402 1.402 0 0 0 1.4 1.4h13.2a1.4 1.4 0 0 0 1.4-1.4V18h2.6a1.401 1.401 0 0 0 1.4-1.4V3.4a1.402 1.402 0 0 0-1.4-1.4ZM16 20.003H4v-12h12v12ZM20 16h-1.999V7.402a1.401 1.401 0 0 0-1.4-1.4h-8.6v-2h12v12Z"></path>
    <path d="M9 17.994h2v-3h3v-2h-3v-3H9v3H6v2h3v3Z"></path>
</svg>
`,
tpi_sort_icon_3d = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7.5L12 2L4 7.5V16.5L12 22L20 16.5V7.5Z M12 12L20 7.5 M12 12V22 M12 12L4 7.5 M4 7.5L12 12 M20 7.5L12 12 M12 22L4 16.5M4 16.5L4 7.5M20 7.5V16.5L12 22"/>
</svg>
`,
tpi_sort_icon_inner_sortables = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M224 176C224 162.7 213.3 152 200 152C193.6 152 187.5 154.5 183 159L71 304C61.7 313.4 61.7 328.6 71 338L183 483C187.5 487.5 193.6 490 200 490C213.3 490 224 479.3 224 466C224 459.6 221.5 453.5 217 449L128 320L217 191C221.5 186.5 224 180.4 224 176zM416 176C416 162.7 426.7 152 440 152C446.4 152 452.5 154.5 457 159L569 304C578.3 313.4 578.3 328.6 569 338L457 483C452.5 487.5 446.4 490 440 490C426.7 490 416 479.3 416 466C416 459.6 418.5 453.5 423 449L512 320L423 191C418.5 186.5 416 180.4 416 176zM296 208C296 194.7 306.7 184 320 184C333.3 184 344 194.7 344 208L344 368L392 320C401.4 310.6 416.6 310.6 426 320C435.4 329.4 435.4 344.6 426 354L336 444C331.5 448.5 325.4 451 320 451C314.6 451 308.5 448.5 304 444L214 354C204.6 344.6 204.6 329.4 214 320C223.4 310.6 238.6 310.6 248 320L296 368L296 208z"/>
</svg>
`,
tpi_sort_icon_3d_ruler= `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
<path d="M.2 468.9C2.7 493.1 23.1 512 48 512l96 0 320 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-48c0-26.5-21.5-48-48-48L48 0C21.5 0 0 21.5 0 48L0 368l0 96c0 1.7 .1 3.3 .2 4.9z"></path>
</svg>
`,
tpi_sort_icon_3d_rotate_shape = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 96c38.4 0 73.7 13.5 101.3 36.1l-32.6 32.6c-4.6 4.6-5.9 11.5-3.5 17.4s8.3 9.9 14.8 9.9l112 0c8.8 0 16-7.2 16-16l0-112c0-6.5-3.9-12.3-9.9-14.8s-12.9-1.1-17.4 3.5l-34 34C363.4 52.6 312.1 32 256 32c-10.9 0-21.5 .8-32 2.3l0 64.9c10.3-2.1 21-3.2 32-3.2zM132.1 154.7l32.6 32.6c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-112c0-8.8-7.2-16-16-16L64 48c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l34 34C52.6 148.6 32 199.9 32 256c0 10.9 .8 21.5 2.3 32l64.9 0c-2.1-10.3-3.2-21-3.2-32c0-38.4 13.5-73.7 36.1-101.3zM477.7 224l-64.9 0c2.1 10.3 3.2 21 3.2 32c0 38.4-13.5 73.7-36.1 101.3l-32.6-32.6c-4.6-4.6-11.5-5.9-17.4-3.5s-9.9 8.3-9.9 14.8l0 112c0 8.8 7.2 16 16 16l112 0c6.5 0 12.3-3.9 14.8-9.9s1.1-12.9-3.5-17.4l-34-34C459.4 363.4 480 312.1 480 256c0-10.9-.8-21.5-2.3-32zM256 416c-38.4 0-73.7-13.5-101.3-36.1l32.6-32.6c4.6-4.6 5.9-11.5 3.5-17.4s-8.3-9.9-14.8-9.9L64 320c-8.8 0-16 7.2-16 16l0 112c0 6.5 3.9 12.3 9.9 14.8s12.9 1.1 17.4-3.5l34-34C148.6 459.4 199.9 480 256 480c10.9 0 21.5-.8 32-2.3l0-64.9c-10.3 2.1-21 3.2-32 3.2z"></path>
</svg>
`,
tpi_sort_icon_3d_pallet = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M144 256h352c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H384v128l-64-32-64 32V0H144c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16zm480 128c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v64H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h608c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-48v-64h48zm-336 64H128v-64h160v64zm224 0H352v-64h160v64z"></path>
</svg>
`,
tpi_sort_icon_3d_rotate = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"></path>
</svg>
`,
tpi_sort_icon_wdh_height = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
    <defs>
        <linearGradient id="gradHeight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ccff00; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#faff00; stop-opacity:1" />
        </linearGradient>
    </defs>
    <path fill="url(#gradHeight)" stroke="url(#gradHeight)" stroke-width="0" d="M214.059 377.941H168V134.059h46.059c21.382 0 32.09-25.851 16.971-40.971L144.971 7.029c-9.373-9.373-24.568-9.373-33.941 0L24.971 93.088c-15.119 15.119-4.411 40.971 16.971 40.971H88v243.882H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.568 9.373 33.941 0l86.059-86.059c15.12-15.119 4.412-40.971-16.97-40.971z"/>
</svg>
`,
tpi_sort_icon_wdh_width = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradWidth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ff0000; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFA600; stop-opacity:1" />
        </linearGradient>
    </defs>
    <path fill="url(#gradWidth)" stroke="url(#gradWidth)" stroke-width="0" d="M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z"></path>
</svg>
`,
tpi_sort_icon_wdh_length = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
    <defs>
        <linearGradient id="gradLength" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#0000ff; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00ffcc; stop-opacity:1" />
        </linearGradient>
    </defs>
    <path fill="url(#gradLength)" stroke="url(#gradLength)" stroke-width="0" d="M214.059 377.941H168V134.059h46.059c21.382 0 32.09-25.851 16.971-40.971L144.971 7.029c-9.373-9.373-24.568-9.373-33.941 0L24.971 93.088c-15.119 15.119-4.411 40.971 16.971 40.971H88v243.882H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.568 9.373 33.941 0l86.059-86.059c15.12-15.119 4.412-40.971-16.97-40.971z"/>
</svg>
`,
tpi_sort_icon_wdh_weight = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradWeight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FF9100; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffcc00; stop-opacity:1" />
        </linearGradient>
    </defs>    
    <path fill="url(#gradWeight)" stroke="url(#gradWeight)" stroke-width="0" d="M224 96a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm122.5 32c3.5-10 5.5-20.8 5.5-32c0-53-43-96-96-96s-96 43-96 96c0 11.2 1.9 22 5.5 32L120 128c-22 0-41.2 15-46.6 36.4l-72 288c-3.6 14.3-.4 29.5 8.7 41.2S33.2 512 48 512l416 0c14.8 0 28.7-6.8 37.8-18.5s12.3-26.8 8.7-41.2l-72-288C433.2 143 414 128 392 128l-45.5 0z"></path>
</svg>
`,
tpi_sort_icon_person = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
</svg>
`,
tpi_sort_icon_label = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 64H257.6L76.5 251.6c-8 8-12.3 18.5-12.5 29-.3 11.3 3.9 22.6 12.5 31.2l123.7 123.6c8 8 20.8 12.5 28.8 12.5s22.8-3.9 31.4-12.5L448 256V96l-32-32zm-30.7 102.7c-21.7 6.1-41.3-10-41.3-30.7 0-17.7 14.3-32 32-32 20.7 0 36.8 19.6 30.7 41.3-2.9 10.3-11.1 18.5-21.4 21.4z"></path>
</svg>
`,
tpi_sort_icon_bag = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" fill="currentColor" stroke="currentColor">
    <path d="M20.37,17.65a16.777,16.777,0,0,0-2.01-5.54,17.037,17.037,0,0,0-3.74-4.55l-.1-.08a.121.121,0,0,1-.02-.15l1.49-2.59a1.12,1.12,0,0,0,0-1.12,1.092,1.092,0,0,0-.97-.55H8.98a1.1,1.1,0,0,0-.97.55,1.12,1.12,0,0,0,0,1.12l1.5,2.59a.124.124,0,0,1-.03.15l-.09.08A17.327,17.327,0,0,0,3.63,17.65a4.051,4.051,0,0,0-.04.48,2.8,2.8,0,0,0,2.8,2.8H17.62a2.782,2.782,0,0,0,2.13-.99A2.834,2.834,0,0,0,20.37,17.65ZM8.88,4.24a.1.1,0,0,1,0-.12.106.106,0,0,1,.1-.05h6.04a.143.143,0,0,1,.11.05.163.163,0,0,1,0,.12l-1.59,2.8H10.46Zm5.09,4.08a16.436,16.436,0,0,1,5.42,9.5,1.817,1.817,0,0,1-.4,1.47,1.786,1.786,0,0,1-1.37.64H6.39a1.805,1.805,0,0,1-1.8-1.8,1.628,1.628,0,0,1,.03-.31,16.286,16.286,0,0,1,5.42-9.5l.32-.28h3.28Z"></path>
</svg>
`,
tpi_sort_icon_polybox = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M225.6,62.64l-88-48.17a19.91,19.91,0,0,0-19.2,0l-88,48.17A20,20,0,0,0,20,80.19v95.62a20,20,0,0,0,10.4,17.55l88,48.17a19.89,19.89,0,0,0,19.2,0l88-48.17A20,20,0,0,0,236,175.81V80.19A20,20,0,0,0,225.6,62.64ZM128,36.57,200,76,128,115.4,56,76ZM44,96.79l72,39.4v76.67L44,173.44Zm96,116.07V136.19l72-39.4v76.65Z"></path>
</svg>
`,
tpi_sort_icon_cart = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.756 5.345c-.191-.219-.466-.345-.756-.345h-13.819l-.195-1.164c-.08-.482-.497-.836-.986-.836h-2.25c-.553 0-1 .447-1 1s.447 1 1 1h1.403l1.86 11.164.045.124.054.151.12.179.095.112.193.13.112.065c.116.047.238.075.367.075h11.001c.553 0 1-.447 1-1s-.447-1-1-1h-10.153l-.166-1h11.319c.498 0 .92-.366.99-.858l1-7c.041-.288-.045-.579-.234-.797zm-1.909 1.655l-.285 2h-3.562v-2h3.847zm-4.847 0v2h-3v-2h3zm0 3v2h-3v-2h3zm-4-3v2h-3l-.148.03-.338-2.03h3.486zm-2.986 3h2.986v2h-2.653l-.333-2zm7.986 2v-2h3.418l-.285 2h-3.133z"></path>
    <circle cx="8.5" cy="19.5" r="1.5">
    </circle><circle cx="17.5" cy="19.5" r="1.5"></circle>
</svg>
`,
tpi_sort_icon_pallet = `
<svg class="tpi-infi--icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg">
    <path d="M144 256h352c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H384v128l-64-32-64 32V0H144c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16zm480 128c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v64H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h608c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-48v-64h48zm-336 64H128v-64h160v64zm224 0H352v-64h160v64z"></path>
</svg>
`,
tpi_sort_icon_courier = `
<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
</svg>`,
tpi_sort_icon_chevron_right =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20c-.802 0-1.555-.312-2.122-.879-.566-.566-.878-1.32-.878-2.121s.312-1.555.879-2.122l2.878-2.878-2.878-2.879c-.567-.566-.879-1.32-.879-2.121s.312-1.555.879-2.122c1.133-1.132 3.109-1.133 4.243.001l7.121 7.121-7.122 7.121c-.566.567-1.319.879-2.121.879zm0-14c-.268 0-.518.104-.707.292-.189.19-.293.441-.293.708s.104.518.293.707l4.292 4.293-4.292 4.293c-.189.189-.293.439-.293.707s.104.518.293.707c.378.379 1.037.378 1.414.001l5.708-5.708-5.708-5.707c-.189-.189-.439-.293-.707-.293z"></path>
</svg>
`,
tpi_sort_icon_chevron_left =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" baseProfile="tiny" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 20c-.802 0-1.555-.312-2.122-.879l-7.121-7.121 7.122-7.121c1.133-1.133 3.11-1.133 4.243 0 .566.566.878 1.32.878 2.121s-.312 1.555-.879 2.122l-2.878 2.878 2.878 2.879c.567.566.879 1.32.879 2.121s-.312 1.555-.879 2.122c-.566.566-1.319.878-2.121.878zm-6.415-8l5.708 5.707c.378.378 1.037.377 1.414 0 .189-.189.293-.439.293-.707s-.104-.518-.293-.707l-4.292-4.293 4.292-4.293c.189-.189.293-.44.293-.707s-.104-.518-.293-.707c-.378-.379-1.037-.378-1.414-.001l-5.708 5.708z"></path>
</svg>
`,
tpi_sort_icon_histry_option_auto_load =`
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path>
    <path d="m216.32 334.44 114.45-69.14a10.89 10.89 0 0 0 0-18.6l-114.45-69.14a10.78 10.78 0 0 0-16.32 9.31v138.26a10.78 10.78 0 0 0 16.32 9.31z"></path>
</svg>
`,
tpi_sort_icon_histry_option_highlight_operations = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
    <path d="M12.5 5.5l4 4"></path>
    <path d="M4.5 13.5l4 4"></path>
    <path d="M21 15v4h-8l4 -4z"></path>
</svg>
`,
tpi_sort_icon_histry_option_split_days = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M216,152a8,8,0,0,1-8,8H136v52.69l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,212.69V160H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,152ZM48,112H208a8,8,0,0,0,0-16H136V43.31l18.34,18.35a8,8,0,0,0,11.32-11.32l-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L120,43.31V96H48a8,8,0,0,0,0,16Z"></path>
</svg>
`,
tpi_sort_icon_histry_manipulation_icons = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg">
    <path d="M160 144h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V160c0-8.837 7.163-16 16-16m564.314-25.333 181.019 181.02c6.248 6.248 6.248 16.378 0 22.627l-181.02 181.019c-6.248 6.248-16.378 6.248-22.627 0l-181.019-181.02c-6.248-6.248-6.248-16.378 0-22.627l181.02-181.019c6.248-6.248 16.378-6.248 22.627 0M160 544h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V560c0-8.837 7.163-16 16-16m400 0h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H560c-8.837 0-16-7.163-16-16V560c0-8.837 7.163-16 16-16"></path>
</svg>
`,
tpi_sort_icon_histry_background = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8l4 -4"></path>
    <path d="M14 4l-10 10"></path>
    <path d="M4 20l16 -16"></path>
    <path d="M20 10l-10 10"></path>
    <path d="M20 16l-4 4"></path>
</svg>
`,
tpi_sort_icon_histry_extra_grid = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18"></path>
    <path d="M3 12h18"></path>
    <path d="M3 18h18"></path>
    <path d="M6 3v18"></path>
    <path d="M12 3v18"></path>
    <path d="M18 3v18"></path>
</svg>
`,
tpi_sort_icon_histry_option_empty_cells = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M21 19.1H3V5h18v14.1zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
    <path fill="none" d="M21 19.1H3V5h18v14.1zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
    <path d="M14.59 8 12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41z"></path>
</svg>
`,
tpi_sort_icon_histry_option_lots = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke-linejoin="round" stroke-width="32" d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62z"></path>
    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 56v120a32 32 0 0 0 32 32h120m-232 80h160m-160 80h160"></path>
</svg>
`,
tpi_sort_icon_histry_option_autoscroll = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path d="M144,16H112A64.07,64.07,0,0,0,48,80v96a64.07,64.07,0,0,0,64,64h32a64.07,64.07,0,0,0,64-64V80A64.07,64.07,0,0,0,144,16Zm48,160a48.05,48.05,0,0,1-48,48H112a48.05,48.05,0,0,1-48-48V80a48.05,48.05,0,0,1,48-48h32a48.05,48.05,0,0,1,48,48ZM136,83.31v89.38l10.34-10.35a8,8,0,0,1,11.32,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,172.69V83.31L109.66,93.66A8,8,0,0,1,98.34,82.34l24-24a8,8,0,0,1,11.32,0l24,24a8,8,0,0,1-11.32,11.32Z"></path>
</svg>
`,
tpi_sort_icon_histry_option_stats = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <path d="M899.4 638.2h-27.198c-2.2-.6-4.2-1.6-6.4-2-57.2-8.8-102.4-56.4-106.2-112.199-4.401-62.4 31.199-115.2 89.199-132.4 7.6-2.2 15.6-3.8 23.399-5.8h27.2c1.8.6 3.4 1.6 5.4 1.8 52.8 8.6 93 46.6 104.4 98.6.8 4 2 8 3 12v27.2c-.6 1.8-1.6 3.6-1.8 5.4-8.4 52-45.4 91.599-96.801 103.6-5 1.2-9.6 2.6-14.2 3.8zM130.603 385.8l27.202.001c2.2.6 4.2 1.6 6.4 1.8 57.6 9 102.6 56.8 106.2 113.2 4 62.2-32 114.8-90.2 131.8-7.401 2.2-15 3.8-22.401 5.6h-27.2c-1.8-.6-3.4-1.6-5.2-2-52-9.6-86-39.8-102.2-90.2-2.2-6.6-3.4-13.6-5.2-20.4v-27.2c.6-1.8 1.6-3.6 1.8-5.4 8.6-52.2 45.4-91.6 96.8-103.6 4.8-1.201 9.4-2.401 13.999-3.601zm370.801.001h27.2c2.2.6 4.2 1.6 6.4 2 57.4 9 103.6 58.6 106 114.6 2.8 63-35.2 116.4-93.8 131.4-6.2 1.6-12.4 3-18.6 4.4h-27.2c-2.2-.6-4.2-1.6-6.4-2-57.4-8.8-103.601-58.6-106.2-114.6-3-63 35.2-116.4 93.8-131.4 6.4-1.6 12.6-3 18.8-4.4z"></path>
</svg>
`,
tpi_sort_icon_histry_option_unknown = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
    <path d="M12 16v.01"></path>
    <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
</svg>
`
;

(function () {

    const preview_urlPattern = /^https:\/\/hubs\.market\.yandex\.ru\/sorting-center\/\d+\/sortables\/\d+/;
    if (!preview_urlPattern.test(location.href)) return;

    // Функция выполнения запроса
    function fetchSortableData() {
        const path = location.pathname;
        const matches = path.match(/\/sorting-center\/(\d+)\/sortables\/(\d+)/);
        if (!matches) return;
        
        const scId = matches[1];
        const sortableId = matches[2];

        const url = `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/sortables/get-sortable-by-id?id=${sortableId}`;
        
        // Пробуем получить токен разными способами
        let token = null;
        
        if (typeof window.tpiUserTOKEN !== 'undefined' && window.tpiUserTOKEN) {
            token = window.tpiUserTOKEN;
        }
        
        if (!token) {
            try {
                token = localStorage.getItem('tpiUserTOKEN');
            } catch(e) {}
        }
        
        if (!token) {
            try {
                token = sessionStorage.getItem('tpiUserTOKEN');
            } catch(e) {}
        }
        
        if (!token) {
            token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        }
        
        if (!token) return;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            credentials: 'include',
            referrerPolicy: 'strict-origin-when-cross-origin'
        })
        .then(response => {
            if (!response.ok) return;
            return response.json();
        })
        .then(data => {
            if (data && (data.type === "PLACE" || data.type === "ZASYL" || data.type === "ORPHAN_PALLET")) {
                replaceGroupingDirection(data);
                addOrderNumberBlock(data, scId);
                fetchSupportTickets(data, scId, token);
                
                // Сохраняем barcode в глобальную переменную для использования в истории
                window.currentSortableBarcode = data.barcode || '';
                
                if (data.weightAndDimensions) {
                    currentSortableDimensions = {
                        width: data.weightAndDimensions.width || 300,
                        height: data.weightAndDimensions.height || 300,
                        length: data.weightAndDimensions.length || 300,
                        weight: data.weightAndDimensions.weight || 0,
                    };
                }
                sortableType = data.type;
                insert3DViewer();
            }
        })
        .catch(() => {});
    }
    
    function replaceGroupingDirection(data) {
        const firstCard = document.querySelector('.tpi-sort-info-card-item');
        if (!firstCard) return;

        // Находим div, который идет после заголовка (это контейнер для всех полей)
        const fieldsContainer = firstCard.children[1]; // второй ребенок (индекс 1)
        if (!fieldsContainer) return;

        // Удаляем старый оригинальный блок с направлением группировки
        const originalGroupingRow = fieldsContainer.querySelector('div.mez-flex.mez-flex-row.mez-gap-\\[16px\\]:has(span[data-i18n-key="pages.sortable-item:main-info.grouping-directions.label"])');
        if (originalGroupingRow) {
            originalGroupingRow.remove();
        }

        // Удаляем все существующие кастомные блоки (чтобы не дублировались)
        const oldCustoms = fieldsContainer.querySelectorAll('.tpi-sort-card-custom-data-item-wrapper');
        oldCustoms.forEach(block => block.remove());

        // Определяем текст направления
        let directionText = 'Не указаны';
        if (data.groupingDirections && data.groupingDirections.length > 0) {
            directionText = data.groupingDirections[0].readableName;
        }

        // Создаем новый кастомный блок
        const groupBlock = document.createElement('div');
        groupBlock.className = 'tpi-sort-card-custom-data-item-wrapper';
        groupBlock.innerHTML = `
            <div class="tpi-sort-card-custom-data-item-title">
                <icon class="tpi-sort-card-custom-data-item-icon">${tpi_sort_icon_group}</icon>
                <p class="tpi-sort-card-custom-data-item-text">Направления группировки</p>
            </div>
            <div class="tpi-sort-card-custom-data-item-content">
                <p class="tpi-sort-card-custom-data-item-text">${directionText}</p>
            </div>
        `;

        // Вставляем в конец fieldsContainer
        fieldsContainer.appendChild(groupBlock);
    }


    // Функция для добавления блока с номером заказа
    function addOrderNumberBlock(data, scId) {
        if (!data.externalOrderId) return;

        const firstCard = document.querySelector('.tpi-sort-info-card-item');
        if (!firstCard) return;

        const fieldsContainer = firstCard.children[1];
        if (!fieldsContainer) return;

        // Проверяем, нет ли уже такого блока
        const existing = Array.from(fieldsContainer.querySelectorAll('.tpi-sort-card-custom-data-item-wrapper')).find(block =>
            block.querySelector('.tpi-sort-card-custom-data-item-text')?.textContent.includes('Номер заказа')
        );
        if (existing) return;

        const orderBlock = document.createElement('div');
        orderBlock.className = 'tpi-sort-card-custom-data-item-wrapper';
        orderBlock.innerHTML = `
            <div class="tpi-sort-card-custom-data-item-title">
                <icon class="tpi-sort-card-custom-data-item-icon">${tpi_sort_icon_order_number}</icon>
                <p class="tpi-sort-card-custom-data-item-text">Номер заказа</p>
            </div>
            <div class="tpi-sort-card-custom-data-item-content">
                <a class="tpi-sort-card-custom-data-item-link" target="_blank" href="https://logistics.market.yandex.ru/sorting-center/${scId}/orders/${data.externalOrderId}">${data.externalOrderId}</a>
                <button class="tpi-sort-card-custom-data-copy" tpi-tooltip-data="Скопировать номер заказа">
                    <icon class="tpi-sort-card-custom-data-copy-icon">${tpi_sort_icon_copy_single}</icon>
                </button>
            </div>
        `;

        // Добавляем обработчик клика для кнопки копирования
        const copyButton = orderBlock.querySelector('.tpi-sort-card-custom-data-copy');
        copyButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Предотвращаем всплытие события
            
            // Находим ближайшую ссылку с номером заказа
            const linkElement = this.closest('.tpi-sort-card-custom-data-item-content')
                .querySelector('.tpi-sort-card-custom-data-item-link');
            
            if (linkElement) {
                const orderNumber = linkElement.textContent;
                
                // Копируем в буфер обмена
                navigator.clipboard.writeText(orderNumber).then(() => {
                    // Показываем уведомление об успешном копировании
                    tpiNotification.show(
                        "Номер заказа скопирован", 
                        "success", 
                        `Заказ ${orderNumber} успешно скопирован в буфер обмена`
                    );
                }).catch(err => {
                    console.error('Ошибка копирования:', err);
                    tpiNotification.show(
                        "Ошибка копирования", 
                        "error", 
                        "Не удалось скопировать номер заказа"
                    );
                });
            }
        });

        fieldsContainer.appendChild(orderBlock);
    }

    // Функция для запроса обращений в ТП
    function fetchSupportTickets(data, scId, token) {
        const searchQueries = [];
        
        if (data.externalOrderId) {
            const match = data.externalOrderId.match(/\d+/);
            if (match) {
                searchQueries.push(match[0]);
            }
        }
        
        if (data.barcode) {
            searchQueries.push(data.barcode);
        }
        
        if (searchQueries.length === 0) return;
        
        // Сразу добавляем блок с лоадером
        addSupportBlockWithLoader(scId);
        
        let attempts = 0;
        
        function tryFetch(query) {
            const url = `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/chatterbox/get-support-tickets-list?platformType=SORTING_CENTER&query=${encodeURIComponent(query)}`;
            
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': token
                },
                credentials: 'include'
            })
            .then(response => response.ok ? response.json() : null)
            .then(data => {
                const tickets = data && data.tickets ? data.tickets : [];
                
                if (tickets.length > 0) {
                    updateSupportBlock(tickets, scId);
                } else {
                    attempts++;
                    if (attempts < searchQueries.length) {
                        tryFetch(searchQueries[attempts]);
                    } else {
                        updateSupportBlock([], scId);
                    }
                }
            })
            .catch(() => {
                attempts++;
                if (attempts < searchQueries.length) {
                    tryFetch(searchQueries[attempts]);
                } else {
                    updateSupportBlock([], scId);
                }
            });
        }
        
        tryFetch(searchQueries[0]);
    }

    // Функция для добавления блока с лоадером
    function addSupportBlockWithLoader(scId) {
        const firstCard = document.querySelector('.tpi-sort-info-card-item');
        if (!firstCard) return;

        const fieldsContainer = firstCard.children[1];
        if (!fieldsContainer) return;

        // Проверяем, нет ли уже блока обращений
        const existing = fieldsContainer.querySelector('.tpi-sort-card-custom-data-item-wrapper[data-support-block="true"]');
        if (existing) return;

        const supportBlock = document.createElement('div');
        supportBlock.className = 'tpi-sort-card-custom-data-item-wrapper';
        supportBlock.setAttribute('data-support-block', 'true');
        supportBlock.innerHTML = `
            <div class="tpi-sort-card-custom-data-item-title">
                <icon class="tpi-sort-card-custom-data-item-icon">${tpi_sort_icon_support}</icon>
                <p class="tpi-sort-card-custom-data-item-text">Обращения в ТП</p>
            </div>
            <div class="tpi-sort-card-custom-data-item-content">
                <div class="tpi-sort-card-custom-data-item-loader"></div>
            </div>
        `;

        fieldsContainer.appendChild(supportBlock);
    }

    // Функция для обновления блока с результатами
    function updateSupportBlock(tickets, scId) {
        const firstCard = document.querySelector('.tpi-sort-info-card-item');
        if (!firstCard) return;

        const fieldsContainer = firstCard.children[1];
        if (!fieldsContainer) return;

        const supportBlock = fieldsContainer.querySelector('.tpi-sort-card-custom-data-item-wrapper[data-support-block="true"]');
        if (!supportBlock) return;

        const contentDiv = supportBlock.querySelector('.tpi-sort-card-custom-data-item-content');
        if (!contentDiv) return;

        let contentHtml = '';
        if (tickets && tickets.length > 0) {
            contentHtml = tickets.map(ticket => `
                <a class="tpi-sort-card-custom-data-item-link" target="_blank" href="https://hubs.market.yandex.ru/sorting-center/${scId}/support/${ticket.ticketId}">${ticket.shortTicketId || ticket.ticketId}</a>
            `).join('');
        } else {
            contentHtml = '<p class="tpi-sort-card-custom-data-item-text">Отсутствуют</p>';
        }
        contentDiv.innerHTML = contentHtml;
    }
    // Функция для получения токена
    function getToken() {
        if (typeof window.tpiUserTOKEN !== 'undefined' && window.tpiUserTOKEN) {
            return window.tpiUserTOKEN;
        }
        
        try {
            const lsToken = localStorage.getItem('tpiUserTOKEN');
            if (lsToken) {
                window.tpiUserTOKEN = lsToken;
                return lsToken;
            }
        } catch(e) {}
        
        try {
            const ssToken = sessionStorage.getItem('tpiUserTOKEN');
            if (ssToken) {
                window.tpiUserTOKEN = ssToken;
                return ssToken;
            }
        } catch(e) {}
        
        const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (metaToken) {
            window.tpiUserTOKEN = metaToken;
            return metaToken;
        }
        
        return null;
    }

    // Основная функция запуска
    function start() {
        let token = getToken();
        
        if (token) {
            fetchSortableData();
        } else {
            const tokenObserver = new MutationObserver(() => {
                token = getToken();
                if (token) {
                    tokenObserver.disconnect();
                    fetchSortableData();
                }
            });
            
            tokenObserver.observe(document.head, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['content']
            });
            
            let attempts = 0;
            const tokenInterval = setInterval(() => {
                attempts++;
                token = getToken();
                
                if (token) {
                    clearInterval(tokenInterval);
                    tokenObserver.disconnect();
                    fetchSortableData();
                } else if (attempts > 50) {
                    clearInterval(tokenInterval);
                    tokenObserver.disconnect();
                }
            }, 100);
        }
    }

    tpi_makeFavIcon()
    function addTooltipsWrapper(){
        const tpiTooltips = document.createElement('div')
        tpiTooltips.className = 'tpi-tooltip-by-sheva_r6'
        document.querySelector('body').appendChild(tpiTooltips)
        initTooltips()
    }

    const preview_observer = new MutationObserver(() => {
        const preview_title = document.querySelector(
            'span[data-i18n-key="pages.sortable-item:main-info.title"]'
        );

        if (preview_title) {
            preview_observer.disconnect();

            addTooltipsWrapper();
            makeSortablesPretier(preview_title);
            start();
            initAnomalyObserver();
            initHistoryStatusObserver();
            initParentSortableObserver();
        }
    });

    preview_observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    function makeSortablesPretier(preview_title) {
        const preview_wrapper =
            preview_title.parentElement
            ?.parentElement
            ?.parentElement;

        if (!preview_wrapper) return;

        preview_wrapper.classList.add('tpi-sort-info-cards-wrapper');

        [...preview_wrapper.children].forEach(el => {
            if (el.tagName === 'DIV') {
                el.classList.add('tpi-sort-info-card-item');
            }
        });

        addSortLabelIcons();
        adjustLabelColumnsWidth();
    }


    function addSortLabelIcons() {
        const card = document.querySelector(
            '.tpi-sort-info-card-item span[data-i18n-key="pages.sortable-item:main-info.title"]'
        )?.closest('.tpi-sort-info-card-item');
        
        if (!card) return;

        const titleSpan = card.querySelector(
            'span[data-i18n-key="pages.sortable-item:main-info.title"]'
        );
        
        if (titleSpan && !titleSpan.classList.contains('tpi-sort-info-card-item-title-wrapper')) {
            const titleText = titleSpan.textContent;
            titleSpan.classList.add('tpi-sort-info-card-item-title-wrapper');
            titleSpan.innerHTML = `<icon class="tpi-sort-card-item-title-icon">${tpi_sort_icon_title || ''}</icon><p class="tpi-sort-card-item-title-text">${titleText}</p>`;
        }

        const labels = card.querySelectorAll(
            'span[data-i18n-key^="pages.sortable-item:main-info"]'
        );

        labels.forEach(span => {
            if (span.dataset.i18nKey === "pages.sortable-item:main-info.title") return;
            if (span.classList.contains('tpi-sort-label-title')) return;

            const wrapper = span.parentElement;
            if (!wrapper) return;

            wrapper.classList.add('tpi-sort-label-wrapper');
            span.classList.add('tpi-sort-label-title');

            const icon = document.createElement('icon');
            icon.classList.add('tpi-sort-label-icon');
            icon.innerHTML = getIconForKey(span.dataset.i18nKey);

            span.before(icon);
        });
    }

    // Функция для изменения ширины колонок с mez-basis-1/3 на mez-basis-1/2
    function adjustLabelColumnsWidth() {
        // Используем селектор :has для точного поиска карточек
        const cards = document.querySelectorAll('.tpi-sort-info-card-item:has(span[data-i18n-key="pages.sortable-item:main-info.title"])');
        
        if (cards.length === 0) {
            return;
        }
        
        
        cards.forEach((card, index) => {
            const basisElements = card.querySelectorAll('.mez-basis-1\\/3');
            
            basisElements.forEach((element, elemIndex) => {
                element.classList.remove('mez-basis-1/3');
                element.classList.add('mez-basis-1/2');
            });
        });
    }

    function getIconForKey(key) {
        const icons = {
            "pages.sortable-item:main-info.cell.label": tpi_sort_icon_cell || "",
            "pages.sortable-item:main-info.type.label": tpi_sort_icon_type || "",
            "pages.sortable-item:main-info.date-and-time.label": tpi_sort_icon_date || "",
            "pages.sortable-item:main-info.status.label": tpi_sort_icon_status || "",
            "pages.sortable-item:main-info.stage.label": tpi_sort_icon_stage || "",
            "pages.sortable-item:main-info.grouping-directions.label": tpi_sort_icon_group || "",
            "pages.sortable-item:main-info.inner-count.label": tpi_sort_icon_inner_sortables || ""
        };
        return icons[key] || "";
    }
})();

// B-
// B-
// B-               THREE JS
// B-
// B-


// ==============================================
//   ТОЧНАЯ КОПИЯ логики concept-3d-three.js.html
// ==============================================

let threeContext = null; // хранит THREE, scene, camera и т.д.

async function loadThreeBundle() {
    if (threeContext && threeContext.THREE) return threeContext;
    const bundleUrl = chrome.runtime.getURL('libs/three/three-bundle.js');
    const script = document.createElement('script');
    script.src = bundleUrl;
    script.type = 'module';
    await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
    const module = await import(bundleUrl);
    const THREE = module.THREE;
    const OrbitControls = module.OrbitControls;
    threeContext = { THREE, OrbitControls };
    return threeContext;
}

//B- Основная функция инициализации 3D сцены
//B- Создает коробку с пасхальными текстами, паллету, линейки и золотое яйцо
async function init3DFromConcept(container, startWidth = 300, startHeight = 300, startDepth = 300) {
    const { THREE, OrbitControls } = await loadThreeBundle();
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 5000);
    camera.position.set(600, 300, 800);
    camera.lookAt(0, 150, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = false;
    renderer.setClearColor(0xfbfbfb);
    renderer.physicallyCorrectLights = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    
    const hemiLight = new THREE.HemisphereLight(0xfbfbfb, 0xfbfbfb, 1.0);
    scene.add(hemiLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.5);
    sunLight.position.set(2, 20, 2);
    scene.add(sunLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-4, 3, -4);
    scene.add(fillLight);
    
    const cubeGroup = new THREE.Group();
    const palletGroup = new THREE.Group();
    const rulersGroup = new THREE.Group();
    scene.add(cubeGroup);
    scene.add(palletGroup);
    scene.add(rulersGroup);
    
    const gridHelper = new THREE.GridHelper(2000, 20, 0x777777, 0x999999);
    gridHelper.position.y = 0;
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 612" fill="#00000044">
        <path d="M612,553.586v32.107c0,5.911-4.792,10.702-10.702,10.702H10.702C4.792,596.396,0,591.604,0,585.693v-32.107   c0-5.91,4.792-10.702,10.702-10.702h590.596C607.208,542.884,612,547.675,612,553.586z M122.021,491.431h53.512   c11.821,0,21.405-9.583,21.405-21.404V202.131h34.823c16.478,0,26.776-17.839,18.536-32.109L167.305,26.305   c-8.24-14.268-28.834-14.267-37.073,0.001L47.255,170.023c-8.239,14.27,2.059,32.107,18.537,32.107h34.825v267.896   C100.617,481.848,110.2,491.431,122.021,491.431z M443.104,491.431h53.512c11.821,0,21.404-9.583,21.404-21.404V202.131h34.827   c16.478,0,26.776-17.839,18.535-32.109L488.39,26.305c-8.239-14.268-28.834-14.267-37.072,0.001l-82.977,143.717   c-8.239,14.27,2.06,32.107,18.536,32.107h34.821v267.896C421.698,481.848,431.282,491.431,443.104,491.431z"/>
    </svg>`;
    const base64SVG = btoa(unescape(encodeURIComponent(svgString)));
    const iconImage = new Image();
    iconImage.src = 'data:image/svg+xml;base64,' + base64SVG;
    
    function createIconSprite(size) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (iconImage.complete) ctx.drawImage(iconImage, 0, 0, 128, 128);
        else iconImage.onload = () => updateAllIcons();
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        const geometry = new THREE.PlaneGeometry(size, size);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { isIcon: true };
        return mesh;
    }
    
    function updateAllIcons() {
        cubeGroup.children.forEach(child => {
            if (child.userData && child.userData.isIcon) {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(iconImage, 0, 0, 128, 128);
                child.material.map = new THREE.CanvasTexture(canvas);
                child.material.needsUpdate = true;
            }
        });
    }
    
    const eggMessages = [
        'Что-то загружаем',
        'Ильяшенко - черт ;)',
        'Продам гараж',
        'Дима устал придумывать текст',
        'Делаем всё сразом',
        'Обращаемся к коленям',
        'Ищем 47 шк на заказе',
        'Вырубаем свет на СЦ',
        'Делаем так, чтобы ЛХ опоздали',
        'Сканируем каждый шк на заказе',
        'Подметаем заказы в мусорку',
        'Находим второй шк',
        'Ждём пока Матыцин уедет с СЦ',
        'Отгружаем все с баланса СЦ',
        'Чанган - лучшая машина в мире',
        'Депортируем Иззата домой',
        'Несем брак к столу',
        'Брат два щека',
        'Mitsubishi Lancer X',
        'Коллеги, я устал',
        'До самоуничтожения - 3 секунды',
        'Брат дай чуаркод по братски',
        'Коллеги, трахнем по чайку ?',
        'Утеря – Михаил Санин',
        'Включаем дуйчики на двойку',
        'Стрижём Ильяшенко',
        'Идём на четвертый склад',
        'Забираем у Валеры чайник',
        'Играем в муравьёв',
        'QR код возле ворот, на улице',
        'Ищем на СЦ, вернёмся с ОС',
        'Кидаем аномалии в хранение',
        'Покупаем новые джогеры',
        'Ищем третьего за стол',
        'Переупаковал 5 заказов - устал',
        'Делаем жёсткий ППС',
        'Делаем ППС по братски',
        'Олени не прошли в плановую ТС',
        'iPhone - говно',
        'Высматриваем шкоду по камерам',
        '5 градусов жары',
        'Прячем колонку от Ильяшенко',
        'Не пикаца брат',
        'Еврики- это наш чай с сахаром'
    ];

    function getRandomEggMessage() {
        return eggMessages[Math.floor(Math.random() * eggMessages.length)];
    }

    function createTextSprite(message, maxWidthPx = 512, fontSize = 52, textColor = '#ffffff', outlineColor = '#000000', outlineWidth = 5) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        function wrapText(text, maxWidth) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine ? currentLine + ' ' + word : word;
                ctx.font = `bold ${fontSize}px "Segoe UI", "Arial"`;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && currentLine.length > 0) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);
            return lines;
        }
        
        ctx.font = `bold ${fontSize}px "Segoe UI", "Arial"`;
        const lines = wrapText(message, maxWidthPx - 40);
        const lineHeight = fontSize * 1.2;
        const textHeight = lines.length * lineHeight;
        
        canvas.width = maxWidthPx;
        canvas.height = textHeight + 40;
        
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px "Segoe UI", "Arial"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        lines.forEach((line, index) => {
            const y = canvas.height / 2 - (lines.length - 1) * lineHeight / 2 + index * lineHeight;
            
            for (let dx = -outlineWidth; dx <= outlineWidth; dx++) {
                for (let dy = -outlineWidth; dy <= outlineWidth; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    ctx.fillStyle = outlineColor;
                    ctx.fillText(line, canvas.width / 2 + dx, y + dy);
                }
            }
            ctx.fillStyle = textColor;
            ctx.fillText(line, canvas.width / 2, y);
        });
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        const geometry = new THREE.PlaneGeometry(1, 1);
        const sprite = new THREE.Mesh(geometry, material);
        
        sprite.userData = {
            isTextSprite: true,
            originalWidth: canvas.width,
            originalHeight: canvas.height,
            message: message
        };
        
        return sprite;
    }

    function scaleTextToWall(sprite, wallWidth, wallHeight, targetCoverage = 0.7) {
        if (!sprite.userData?.isTextSprite) return;
        
        const originalW = sprite.userData.originalWidth;
        const originalH = sprite.userData.originalHeight;
        const aspect = originalW / originalH;
        
        const minWallDim = Math.min(wallWidth, wallHeight);
        const targetSize = minWallDim * targetCoverage;
        
        let scaleX, scaleY;
        if (aspect > 1) {
            scaleX = targetSize;
            scaleY = targetSize / aspect;
        } else {
            scaleY = targetSize;
            scaleX = targetSize * aspect;
        }
        
        sprite.scale.set(scaleX, scaleY, 1);
    }

    function createEasterEgg(w, h, d, cam, rndr) {
        const eggGroup = new THREE.Group();
        
        const eggSize = Math.min(w, d) * 0.12;
        const eggHeight = eggSize * 1.2;
        
        const eggGeometry = new THREE.SphereGeometry(eggSize / 1.8, 64, 64);
        const eggMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffcc33,
            metalness: 0.95,
            roughness: 0.2,
            emissive: 0xff6600,
            emissiveIntensity: 0.15
        });
        
        const egg = new THREE.Mesh(eggGeometry, eggMaterial);
        egg.scale.set(0.9, 1.35, 0.9);
        egg.castShadow = true;
        egg.receiveShadow = false;
        
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.4 });
        const glowGeometry = new THREE.SphereGeometry(eggSize / 1.6, 32, 32);
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.scale.set(1.0, 1.4, 1.0);
        
        eggGroup.add(egg);
        eggGroup.add(glow);
        
        eggGroup.position.set(0, eggHeight / 1.2, 0);
        eggGroup.userData = { isEasterEgg: true, isClicked: false };
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        function onMouseClick(event) {
            if (eggGroup.userData.isClicked) return;
            
            const rect = rndr.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, cam);
            const intersects = raycaster.intersectObject(egg, true);
            
            if (intersects.length > 0) {
                eggGroup.userData.isClicked = true;
                
                const originalY = eggGroup.position.y;
                const originalScale = { x: egg.scale.x, y: egg.scale.y, z: egg.scale.z };
                const startTime = performance.now();
                
                function animateEgg() {
                    const now = performance.now();
                    const elapsed = now - startTime;
                    const duration = 500;
                    let t = Math.min(1, elapsed / duration);
                    
                    const jumpHeight = Math.sin(t * Math.PI) * 30;
                    eggGroup.position.y = originalY + jumpHeight;
                    egg.rotation.y = t * Math.PI * 2;
                    
                    const scaleMulti = 1 + Math.sin(t * Math.PI) * 0.25;
                    egg.scale.set(originalScale.x * scaleMulti, originalScale.y * scaleMulti, originalScale.z * scaleMulti);
                    
                    if (t < 1) {
                        requestAnimationFrame(animateEgg);
                    } else {
                        eggGroup.position.y = originalY;
                        egg.scale.set(originalScale.x, originalScale.y, originalScale.z);
                        egg.rotation.y = 0;
                    }
                }
                
                requestAnimationFrame(animateEgg);
                
                if (typeof tpiNotification !== 'undefined' && tpiNotification.show) {
                    tpiNotification.show("Пасхалка найдена!", "egg", `1 из 1 — Вы нашли золотое яйцо в коробке! <span><br>«А кто тут спрятался ?)»</span>`);
                }
            }
        }
        
        window.addEventListener('click', onMouseClick);
        eggGroup.userData.cleanup = () => window.removeEventListener('click', onMouseClick);
        
        return eggGroup;
    }

    function createCubeWithIcons(w, h, d) {
        while(cubeGroup.children.length) cubeGroup.remove(cubeGroup.children[0]);
        
        const outerMaterial = new THREE.MeshPhongMaterial({ color: 0xb78d5a, shininess: 18 });
        const innerMaterial = new THREE.MeshPhongMaterial({ color: 0x3d3d3d, shininess: 18, side: THREE.BackSide });

        const geometry = new THREE.BoxGeometry(w, h, d);
        const cube = new THREE.Mesh(geometry, outerMaterial);
        cube.castShadow = true;
        cube.position.y = h / 2;
        cubeGroup.add(cube);

        const innerSize = 0.98;
        const innerGeometry = new THREE.BoxGeometry(w * innerSize, h * innerSize, d * innerSize);
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
        innerCube.castShadow = false;
        innerCube.position.y = h / 2;
        cubeGroup.add(innerCube);
        
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x5d3a1a }));
        line.position.y = h / 2;
        cubeGroup.add(line);
        
        const baseMargin = 15;
        const baseIconSize = 50;
        const minRequired = baseIconSize + 2 * baseMargin;
        const scaleFactor = Math.min(1, Math.min(h, w, d) / minRequired);
        const iconSize = Math.max(15, baseIconSize * scaleFactor);
        const margin = Math.max(4, baseMargin * scaleFactor);
        const epsilon = 0.5;
        const textEpsilon = Math.min(w, h, d) * 0.05;
        
        const iconLeft = createIconSprite(iconSize);
        iconLeft.position.set(-w/2 - epsilon, h - margin - iconSize/2, -d/2 + margin + iconSize/2);
        iconLeft.rotation.y = -Math.PI/2;
        cubeGroup.add(iconLeft);
        
        const iconRight = createIconSprite(iconSize);
        iconRight.position.set(w/2 + epsilon, h - margin - iconSize/2, d/2 - margin - iconSize/2);
        iconRight.rotation.y = Math.PI/2;
        cubeGroup.add(iconRight);
        
        const iconFront = createIconSprite(iconSize);
        iconFront.position.set(-w/2 + margin + iconSize/2, h - margin - iconSize/2, d/2 + epsilon);
        iconFront.rotation.y = 0;
        cubeGroup.add(iconFront);
        
        const iconBack = createIconSprite(iconSize);
        iconBack.position.set(w/2 - margin - iconSize/2, h - margin - iconSize/2, -d/2 - epsilon);
        iconBack.rotation.y = Math.PI;
        cubeGroup.add(iconBack);
        
        const texts = [
            getRandomEggMessage(),
            getRandomEggMessage(),
            getRandomEggMessage(),
            getRandomEggMessage()
        ];
        
        const textLeft = createTextSprite(texts[0], 512, 52, '#ffffff', '#000000', 5);
        textLeft.position.set(-w/2 + textEpsilon, h/2, 0);
        textLeft.rotation.y = Math.PI / 2;
        textLeft.scale.set(-1, 1, 1);
        scaleTextToWall(textLeft, h, d, 0.7);
        cubeGroup.add(textLeft);
        
        const textRight = createTextSprite(texts[1], 512, 52, '#ffffff', '#000000', 5);
        textRight.position.set(w/2 - textEpsilon, h/2, 0);
        textRight.rotation.y = -Math.PI / 2;
        scaleTextToWall(textRight, h, d, 0.7);
        cubeGroup.add(textRight);
        
        const textFront = createTextSprite(texts[2], 512, 52, '#ffffff', '#000000', 5);
        textFront.position.set(0, h/2, d/2 - textEpsilon);
        textFront.rotation.y = -Math.PI;
        scaleTextToWall(textFront, w, h, 0.7);
        cubeGroup.add(textFront);
        
        const textBack = createTextSprite(texts[3], 512, 52, '#ffffff', '#000000', 5);
        textBack.position.set(0, h/2, -d/2 + textEpsilon);
        textBack.rotation.y = 0;
        scaleTextToWall(textBack, w, h, 0.7);
        cubeGroup.add(textBack);
        
        if (h > 80) {
            const easterEgg = createEasterEgg(w, h, d, camera, renderer);
            easterEgg.position.y = 40;
            cubeGroup.add(easterEgg);
        }
    }
    
    function createPallet() {
        while(palletGroup.children.length) palletGroup.remove(palletGroup.children[0]);
        const palletColor = 0x8B5A2B;
        const woodMaterial = new THREE.MeshPhongMaterial({ color: palletColor, shininess: 8 });
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x5d3a1a });
        const width = 1200, depth = 800, boardThick = 22, legHeight = 145, legWidth = 145, legDepth = 145;
        const totalHeight = legHeight + boardThick * 2;
        
        function addBoard(geo, posX, posY, posZ) {
            const board = new THREE.Mesh(geo, woodMaterial);
            board.position.set(posX, posY, posZ);
            palletGroup.add(board);
            const edgesGeo = new THREE.EdgesGeometry(geo);
            const line = new THREE.LineSegments(edgesGeo, edgeMaterial);
            line.position.set(posX, posY, posZ);
            palletGroup.add(line);
        }
        
        const topY = totalHeight - boardThick/2;
        for (let i = 0; i < 5; i++) {
            const z = -depth/2 + depth/6 * (i+1);
            const geo = new THREE.BoxGeometry(width, boardThick, boardThick * 4.5);
            addBoard(geo, 0, topY, z);
            const nailPositions = [
                [-width/2 + 30, topY + boardThick/2.5, z - boardThick*2.25 + 15],
                [ width/2 - 30, topY + boardThick/2.5, z - boardThick*2.25 + 15],
                [-width/2 + 30, topY + boardThick/2.5, z + boardThick*2.25 - 15],
                [ width/2 - 30, topY + boardThick/2.5, z + boardThick*2.25 - 15]
            ];
            nailPositions.forEach(pos => {
                const nailGeo = new THREE.CylinderGeometry(4, 4, 8, 8);
                const nailMat = new THREE.MeshStandardMaterial({ color: 0x555555, emissive: 0x111111 });
                const nail = new THREE.Mesh(nailGeo, nailMat);
                nail.position.set(pos[0], pos[1], pos[2]);
                palletGroup.add(nail);
            });
        }
        
        const bottomY = boardThick/2;
        [-depth/3, 0, depth/3].forEach(z => {
            const geo = new THREE.BoxGeometry(width, boardThick, boardThick * 4.5);
            addBoard(geo, 0, bottomY, z);
        });
        
        const crossY = totalHeight - boardThick - boardThick/2;
        [-width/2.25, 0, width/2.25].forEach(x => {
            const geo = new THREE.BoxGeometry(boardThick * 5.5, boardThick, depth * 0.8);
            addBoard(geo, x, crossY, 0);
        });
        
        const legY = boardThick + legHeight/2.5;
        const legXPos = [-width/2.25, 0, width/2.25];
        const legZPos = [-depth/3, 0, depth/3];
        legXPos.forEach(x => {
            legZPos.forEach(z => {
                const geo = new THREE.BoxGeometry(legWidth * 0.7, legHeight * 0.85, legDepth * 0.7);
                addBoard(geo, x, legY, z);
            });
        });
        palletGroup.position.y = 0;
    }
    
    function createRulers(w, h, d, yOffset) {
        while(rulersGroup.children.length) rulersGroup.remove(rulersGroup.children[0]);
        const offset = 10;
        const textOffset = 5;
        const colors = { x: 0xff0000, y: 0x00ff00, z: 0x0000ff };
        
        function addRuler(points, color, value, corner1, corner2, labelOffset, normalDir) {
            const start = points[0], end = points[1];
            const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
            const lineMat = new THREE.LineBasicMaterial({ color });
            rulersGroup.add(new THREE.Line(lineGeo, lineMat));
            rulersGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([corner1, start]), lineMat));
            rulersGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([corner2, end]), lineMat));
            
            const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
            mid.add(labelOffset);
            mid.add(normalDir.clone().multiplyScalar(textOffset));
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
            ctx.font = 'bold 160px "Segoe UI"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value + ' см', 512, 256);
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(240, 120, 1);
            sprite.position.copy(mid);
            rulersGroup.add(sprite);
        }
        
        const xStart = new THREE.Vector3(-w/2, yOffset + h, d/2 + offset);
        const xEnd = new THREE.Vector3(w/2, yOffset + h, d/2 + offset);
        addRuler([xStart, xEnd], colors.x, (w/10).toFixed(0),
            new THREE.Vector3(-w/2, yOffset + h, d/2),
            new THREE.Vector3(w/2, yOffset + h, d/2),
            new THREE.Vector3(0, 30, 0), new THREE.Vector3(0, 0, 1));
        
        const zStart = new THREE.Vector3(w/2 + offset, yOffset + h, -d/2);
        const zEnd = new THREE.Vector3(w/2 + offset, yOffset + h, d/2);
        addRuler([zStart, zEnd], colors.z, (d/10).toFixed(0),
            new THREE.Vector3(w/2, yOffset + h, -d/2),
            new THREE.Vector3(w/2, yOffset + h, d/2),
            new THREE.Vector3(0, 30, 0), new THREE.Vector3(1, 0, 0));
        
        const yStart = new THREE.Vector3(w/2 + offset, yOffset, d/2 + offset);
        const yEnd = new THREE.Vector3(w/2 + offset, yOffset + h, d/2 + offset);
        addRuler([yStart, yEnd], colors.y, (h/10).toFixed(0),
            new THREE.Vector3(w/2, yOffset, d/2),
            new THREE.Vector3(w/2, yOffset + h, d/2),
            new THREE.Vector3(30, 0, 30), new THREE.Vector3(1, 0, 1).normalize());
    }
    
    let currentWidth = startWidth, currentHeight = startHeight, currentDepth = startDepth;
    function updateAll(palletVisible = true, rulersVisible = true) {
        const yOffset = palletVisible ? 190 : 0;
        createCubeWithIcons(currentWidth, currentHeight, currentDepth);
        cubeGroup.position.y = yOffset;
        palletGroup.visible = palletVisible;
        if (rulersVisible) createRulers(currentWidth, currentHeight, currentDepth, yOffset);
        else while(rulersGroup.children.length) rulersGroup.remove(rulersGroup.children[0]);
        controls.target.set(0, yOffset + currentHeight/2, 0);
    }
    
    createPallet();
    createCubeWithIcons(currentWidth, currentHeight, currentDepth);
    const yOffset = 190;
    cubeGroup.position.y = yOffset;
    palletGroup.visible = true;
    createRulers(currentWidth, currentHeight, currentDepth, yOffset);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = -1.2;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 50;
    controls.maxDistance = 2500;
    controls.enablePan = false;
    controls.target.set(0, 190 + currentHeight/2, 0);
    controls.maxPolarAngle = Math.PI / 2.2;

    const canvasElement = renderer.domElement;
    canvasElement.style.cursor = 'grab';
    let isDragging = false;

    controls.addEventListener('start', () => {
        isDragging = true;
        canvasElement.style.cursor = 'grabbing';
    });

    controls.addEventListener('end', () => {
        isDragging = false;
        canvasElement.style.cursor = 'grab';
    });

    canvasElement.addEventListener('mouseleave', () => {
        if (isDragging) {
            canvasElement.style.cursor = 'grab';
        }
    });
    
    let frames = 0, lastTime = performance.now();
    const fpsSpan = document.getElementById('tpi-3d-fps');
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000 && fpsSpan) {
            fpsSpan.textContent = 'FPS: ' + Math.round((frames * 1000) / (now - lastTime));
            frames = 0;
            lastTime = now;
        }
    }
    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);
    
    return {
        setSize(w, h, d) {
            currentWidth = w;
            currentHeight = h;
            currentDepth = d;
            const palletVisible = palletGroup.visible;
            const rulersVisible = rulersGroup.children.length > 0;
            updateAll(palletVisible, rulersVisible);
        },
        setPalletVisible(v) { updateAll(v, rulersGroup.children.length > 0); },
        setRulersVisible(v) { updateAll(palletGroup.visible, v); },
        setAutoRotate(v) { controls.autoRotate = v; },
        getSize() {
            return { width: currentWidth, height: currentHeight, depth: currentDepth };
        },
        renderer: renderer,
        scene: scene,
        camera: camera,
        controls
    };
}

// Вставка 3D в карточку ВГХ
async function insert3DViewer() {
    if (is3DInserted) return;
    
    let card = null;
    let attempts = 0;
    while (!card && attempts < 20) {
        const allCards = document.querySelectorAll('.tpi-sort-info-card-item');
        for (const c of allCards) {
            if (c.querySelector('span[data-i18n-key="pages.sortable-item:weight-and-size-info.title"]')) {
                card = c;
                break;
            }
        }
        if (!card) {
            await new Promise(r => setTimeout(r, 200));
            attempts++;
        }
    }
    
    if (!card) {
        return;
    }
    
    const titleSpan = card.querySelector('span[data-i18n-key="pages.sortable-item:weight-and-size-info.title"]');
    if (!titleSpan) return;
    
    if (!titleSpan.classList.contains('tpi-sort-info-card-item-title-wrapper')) {
        const titleText = 'ВГХ в 3D';
        titleSpan.classList.add('tpi-sort-info-card-item-title-wrapper');
        titleSpan.innerHTML = `<icon class="tpi-sort-card-item-title-icon">${tpi_sort_icon_title_3d || ''}</icon><p class="tpi-sort-card-item-title-text">${titleText}</p>`;
    }
    
    const fieldsContainer = card.children[1];
    if (!fieldsContainer) return;
    
    // Очищаем контейнер и вставляем 3D модель
    fieldsContainer.innerHTML = '';
    
    // Создаём контейнер для 3D сцены
    const container = document.createElement('div');
    container.className = 'tpi-sort-3d-preview-scene'
    container.id = 'tpi-3d-viewer';
    
    // FPS счётчик
    const fpsDiv = document.createElement('div');
    fpsDiv.className = 'tpi-sort-3d-preview-fps'
    fpsDiv.id = 'tpi-3d-fps';
    fpsDiv.textContent = 'FPS: 60';
    container.appendChild(fpsDiv);
    
    fieldsContainer.appendChild(container);
    
    
    // Размеры (умножаем на 10, так как original в см, а модель в мм)
    const width = currentSortableDimensions.width * 10;
    const height = currentSortableDimensions.height * 10;
    const depth = currentSortableDimensions.length * 10;
    const weight = currentSortableDimensions.weight;
    
    const proetionDataControlsWrapper = document.createElement('div')
    proetionDataControlsWrapper.className = 'tpi-sort-3d-preview-controlsData-wrapper'

    // Панель управления под моделью
    const wdhData = document.createElement('div');
    wdhData.className = 'tpi-sort-3d-preview-data'
    wdhData.innerHTML = `
        <div class="tpi-sort-3d-preview-data-item" wdh-data="height">
            <icon>${tpi_sort_icon_wdh_height}</icon>
            <div class="tpi-sort-3d-preview-data-title">Высота:</div>
            <div class="tpi-sort-3d-preview-data-item-variable">${height / 10 + "см"}</div>
        </div>
        <div class="tpi-sort-3d-preview-data-item" wdh-data="width">
            <icon>${tpi_sort_icon_wdh_width}</icon>
            <div class="tpi-sort-3d-preview-data-title">Ширина:</div>
            <div class="tpi-sort-3d-preview-data-item-variable">${width / 10 + "см"}</div>
        </div>
        <div class="tpi-sort-3d-preview-data-item" wdh-data="length">
            <icon>${tpi_sort_icon_wdh_length}</icon>
            <div class="tpi-sort-3d-preview-data-title">Длина:</div>
            <div class="tpi-sort-3d-preview-data-item-variable">${depth / 10 + "см"}</div>
        </div>
        <div class="tpi-sort-3d-preview-data-item" wdh-data="weight">
            <icon>${tpi_sort_icon_wdh_weight}</icon>
            <div class="tpi-sort-3d-preview-data-title">Вес:</div>
            <div class="tpi-sort-3d-preview-data-item-variable">${weight + "кг"}</div>
        </div>
    `;
    proetionDataControlsWrapper.appendChild(wdhData);
    
    // Панель управления под моделью
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'tpi-sort-3d-preview-controls'
    controlsDiv.innerHTML = `
        <label class="tpi-sort-3d-preview-contorls-label" tpi-tooltip-data="Убрать / Отобразить паллет">
            <input type="checkbox" id="tpi-pallet-check" checked>
            <div class="tpi-sort-3d-preview-controls-item">
                <icon>${tpi_sort_icon_3d_pallet}</icon>
            </div>
        </label>
        <label class="tpi-sort-3d-preview-contorls-label" tpi-tooltip-data="Убрать / Отобразить линейки размеров">
            <input type="checkbox" id="tpi-rulers-check" checked>
            <div class="tpi-sort-3d-preview-controls-item">
                <icon>${tpi_sort_icon_3d_ruler}</icon>
            </div>
        </label>
        <label class="tpi-sort-3d-preview-contorls-label" tpi-tooltip-data="Включить / Выключить автовращение">
            <input type="checkbox" id="tpi-rotate-check" checked>
            <div class="tpi-sort-3d-preview-controls-item">
                <icon>${tpi_sort_icon_3d_rotate}</icon>
            </div>
        </label>
    `;
    
    // Кнопка "Поменять местами"
    const swapButton = document.createElement('button');
    swapButton.className = 'tpi-sort-3d-preview-controls-item'
    swapButton.setAttribute('tpi-tooltip-data','Повернуть пропорции')
    swapButton.innerHTML = `<icon>${tpi_sort_icon_3d_rotate_shape}</icon>`;
    controlsDiv.appendChild(swapButton);
    proetionDataControlsWrapper.appendChild(controlsDiv);
    fieldsContainer.appendChild(proetionDataControlsWrapper)

    // Инициализируем 3D сцену
    current3DInstance = await init3DFromConcept(container, width, height, depth);
    
    // Функция плавного изменения размеров
    function animateSizeChange(start, end, duration, onUpdate) {
        if (currentAnimationId) {
            cancelAnimationFrame(currentAnimationId);
            currentAnimationId = null;
        }
        
        const finalW = end.width;
        const finalH = end.height;
        const finalD = end.depth;
        const startTime = performance.now();
        const startW = start.width;
        const startH = start.height;
        const startD = start.depth;
        
        function step(now) {
            const elapsed = now - startTime;
            let t = Math.min(1, elapsed / duration);
            const easeOutBack = (x) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            };
            const eased = easeOutBack(t);
            const w = startW + (finalW - startW) * eased;
            const h = startH + (finalH - startH) * eased;
            const d = startD + (finalD - startD) * eased;
            onUpdate(w, h, d);
            if (t < 1) {
                currentAnimationId = requestAnimationFrame(step);
            } else {
                currentAnimationId = null;
            }
        }
        currentAnimationId = requestAnimationFrame(step);
    }
    
    // Флаг для блокировки кнопки анимации
    let isAnimating = false;
    
    // Обработчик кнопки обмена размерами
    swapButton.addEventListener('click', () => {
        if (isAnimating) return;
        const old = current3DInstance.getSize();
        const newDim = {
            width: old.height,
            height: old.depth,
            depth: old.width
        };
        isAnimating = true;
        animateSizeChange(old, newDim, 500, (w, h, d) => {
            current3DInstance.setSize(w, h, d);
        });
        setTimeout(() => { isAnimating = false; }, 520);
    });
            
    // Обработчики чекбоксов
    document.getElementById('tpi-pallet-check').addEventListener('change', (e) => {
        if (current3DInstance) current3DInstance.setPalletVisible(e.target.checked);
    });
    document.getElementById('tpi-rulers-check').addEventListener('change', (e) => {
        if (current3DInstance) current3DInstance.setRulersVisible(e.target.checked);
    });
    document.getElementById('tpi-rotate-check').addEventListener('change', (e) => {
        if (current3DInstance) current3DInstance.setAutoRotate(e.target.checked);
    });
    
    is3DInserted = true;
}

// !
// !
// ! Anomaly
// !
// !

function initAnomalyObserver() {
    let processed = false;
    
    const anomalyObserver = new MutationObserver(() => {
        if (processed) return;
        
        const anomalyTitleSpan = document.querySelector('span[data-i18n-key="pages.sortable-item:anomaly-info.title"]');
        
        if (anomalyTitleSpan && !anomalyTitleSpan.classList.contains('tpi-sort-info-card-item-title-wrapper')) {
            const titleText = anomalyTitleSpan.textContent;
            if (titleText && titleText.trim() !== '') {
                anomalyTitleSpan.classList.add('tpi-sort-info-card-item-title-wrapper');
                anomalyTitleSpan.innerHTML = `<icon class="tpi-sort-card-item-title-icon">${tpi_sort_icon_title_anomaly}</icon><p class="tpi-sort-card-item-title-text">${titleText}</p>`;
                processed = true;
                anomalyObserver.disconnect(); // Отключаем observer после успешной обработки
            }
        }
    });
    
    anomalyObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// D-
// D-
// D- Status HISTORY
// D-
// D-

function styleHistoryStatusBlock() {
    const historyTitleSpan = document.querySelector('span[data-i18n-key="pages.sortable-item:events-table.title"]');
    
    if (!historyTitleSpan) return;
    
    if (!historyTitleSpan.classList.contains('tpi-sort-status-histroy-title')) {
        historyTitleSpan.classList.add('tpi-sort-status-histroy-title');
    }
    
    let historyBlock = historyTitleSpan.parentElement;
    let foundTable = false;
    
    while (historyBlock && !foundTable) {
        const table = historyBlock.querySelector('table');
        if (table) {
            foundTable = true;
            if (!historyBlock.classList.contains('tpi-sort-histroy-status-block')) {
                historyBlock.classList.add('tpi-sort-histroy-status-block');
            }
            if (!table.classList.contains('tpi-sort-history-status-table')) {
                table.classList.add('tpi-sort-history-status-table');
            }
            break;
        }
        historyBlock = historyBlock.parentElement;
    }
    
    if (foundTable) {
        return true;
    }
    return false;
}

//B- Фуобработка расширенных статусов в таблице истории
function processExtendedStatusInHistory() {
    const statusSpans = document.querySelectorAll('span[data-i18n-key^="common.sorting-center:stage-"]');
    let processedCount = 0;
    
    statusSpans.forEach(span => {
        span.className = 'tpi-sort-extanded-status-title'
        const historyTable = span.closest('table');
        if (!historyTable) return;
        
        const headers = historyTable.querySelectorAll('th');
        let isHistoryTable = false;
        for (const th of headers) {
            if (th.textContent.includes('Расширенный статус') || 
                th.querySelector('[data-i18n-key="pages.sortable-item:events-table.titles.stage"]')) {
                isHistoryTable = true;
                break;
            }
        }
        
        if (!isHistoryTable) return;
        
        const wrapper = span.parentElement;
        if (!wrapper) return;
        
        if (wrapper.querySelector('.tpi-sort-extanded-status-icon')) {
            return;
        }
        
        if (!wrapper.classList.contains('tpi-sort-extanded-status-wrapper')) {
            wrapper.classList.add('tpi-sort-extanded-status-wrapper');
        }
        
        const i18nKey = span.dataset.i18nKey;
        let extendedStatus = '';
        let direction = '';
        
        if (i18nKey === 'common.sorting-center:stage-FIRST_ACCEPT_DIRECT') {
            extendedStatus = 'first-accept-complete';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-FIRST_ACCEPT_RETURN') {
            extendedStatus = 'first-accept-complete';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-FINAL_ACCEPT_DIRECT') {
            extendedStatus = 'second-accept-complete';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-FINAL_ACCEPT_RETURN') {
            extendedStatus = 'second-accept-complete';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-PRE_SORTED_DIRECT') {
            extendedStatus = 'predsort-complete';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-PRE_SORTED_RETURN') {
            extendedStatus = 'predsort-complete';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-AWAITING_DIRECT') {
            extendedStatus = 'waiting-accept';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-AWAITING_RETURN') {
            extendedStatus = 'waiting-accept';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-KEEPED_DIRECT') {
            extendedStatus = 'on-hran';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-KEEPED_RETURN') {
            extendedStatus = 'on-hran';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-AWAITING_ACCEPTANCE_BY_COURIER_DIRECT') {
            extendedStatus = 'awaiting-courier-accept';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-CONSOLIDATED') {
            extendedStatus = 'consolidated';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-DELETED') {
            extendedStatus = 'deleted';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-CANCELLED') {
            extendedStatus = 'canceled';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-KEEPED_DIRECT') {
            extendedStatus = 'on-hran';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-KEEPED_RETURN') {
            extendedStatus = 'on-hran';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-LABEL_CREATED_DIRECT' || i18nKey === 'common.sorting-center:stage-LOT_CREATED_WITH_COURIER_DIRECT') {
            extendedStatus = 'orphan-lot-created';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-LABEL_CREATED_RETURN' || i18nKey === 'common.sorting-center:stage-LOT_CREATED_WITH_COURIER_RETURN') {
            extendedStatus = 'orphan-lot-created';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-SORTING_IN_LOT_DIRECT' || i18nKey === 'common.sorting-center:stage-SORTING_IN_LOT_KEEPED_DIRECT') {
            extendedStatus = 'lot-filling';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-SORTING_IN_LOT_RETURN' || i18nKey === 'common.sorting-center:stage-SORTING_IN_LOT_KEEPED_RETURN') {
            extendedStatus = 'lot-filling';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-PACKED_KEEPED_DIRECT') {
            extendedStatus = 'lot-packed-for-hran';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-NOT_ACCEPTED_BY_COURIER_DIRECT') {
            extendedStatus = 'not-accept-by-courier';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-PREPARED_DIRECT') {
            extendedStatus = 'loaded-in-vehicle';
            direction = 'any';
        } else if (i18nKey === 'common.sorting-center:stage-SHIPPED_DIRECT') {
            extendedStatus = 'shipped';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-SHIPPED_RETURN') {
            extendedStatus = 'shipped';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-SHIPPED_DIRECT_REPLACED') {
            extendedStatus = 'shipped-and-replaced';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-SHIPPED_RETURN_REPLACED') {
            extendedStatus = 'shipped-and-replaced';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-SORTED_DIRECT') {
            extendedStatus = 'ready-to-shipment';
            direction = 'forward';
        } else if (i18nKey === 'common.sorting-center:stage-SORTED_RETURN') {
            extendedStatus = 'ready-to-shipment';
            direction = 'return';
        } else if (i18nKey === 'common.sorting-center:stage-AWAITING_SORT_DIRECT') {
            extendedStatus = 'for-sort';
            direction = 'forward';
        }
        else {
            extendedStatus = i18nKey.replace('common.sorting-center:stage-', '').toLowerCase();
            direction = '';
        }
        
        const icon = document.createElement('icon');
        icon.className = 'tpi-sort-extanded-status-icon';
        if (extendedStatus) {
            icon.setAttribute('sto-extended-status', extendedStatus);
        }
        if (direction) {
            icon.setAttribute('tpi-sto-status-direction', direction);
        }
        
        wrapper.insertBefore(icon, wrapper.firstChild);
        processedCount++;
    });
    
    if (processedCount > 0) {
    }
    
    return processedCount;
}

function initHistoryStatusObserver() {
    let historyProcessed = false;
    let extendedStatusProcessed = false;
    let usersProcessed = false;
    let observer = null;
    
    // Запускаем обновление имен пользователей и курьеров параллельно
    const waitForTableAndUpdate = async () => {
        let table = document.querySelector('.tpi-sort-history-status-table');
        if (!table) {
            for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 200));
                table = document.querySelector('.tpi-sort-history-status-table');
                if (table) break;
            }
        }
        if (table) {
            // Запускаем оба запроса параллельно
            await Promise.all([
                updateHistoryWithUserNames(),
                updateCourierNamesInHistory()
            ]);
            usersProcessed = true;
        }
    };
    
    waitForTableAndUpdate();
    
    function checkAndProcess() {
        if (!historyProcessed) {
            historyProcessed = styleHistoryStatusBlock();
        }
        
        const processed = processExtendedStatusInHistory();
        if (processed === 0 && !extendedStatusProcessed) {
            const statusSpans = document.querySelectorAll('span[data-i18n-key^="common.sorting-center:stage-"]');
            let hasStatuses = false;
            for (const span of statusSpans) {
                const table = span.closest('table');
                if (table) {
                    const headers = table.querySelectorAll('th');
                    for (const th of headers) {
                        if (th.textContent.includes('Расширенный статус') || 
                            th.querySelector('[data-i18n-key="pages.sortable-item:events-table.titles.stage"]')) {
                            hasStatuses = true;
                            break;
                        }
                    }
                }
                if (hasStatuses) break;
            }
            if (hasStatuses) {
                extendedStatusProcessed = true;
            }
        } else if (processed > 0) {
            const remainingSpans = document.querySelectorAll('span[data-i18n-key^="common.sorting-center:stage-"]');
            let hasUnprocessed = false;
            for (const span of remainingSpans) {
                const wrapper = span.parentElement;
                if (wrapper && !wrapper.querySelector('.tpi-sort-extanded-status-icon')) {
                    const table = span.closest('table');
                    if (table) {
                        const headers = table.querySelectorAll('th');
                        for (const th of headers) {
                            if (th.textContent.includes('Расширенный статус') || 
                                th.querySelector('[data-i18n-key="pages.sortable-item:events-table.titles.stage"]')) {
                                hasUnprocessed = true;
                                break;
                            }
                        }
                    }
                    if (hasUnprocessed) break;
                }
            }
            if (!hasUnprocessed) {
                extendedStatusProcessed = true;
            }
        }
        
        if (historyProcessed && extendedStatusProcessed && usersProcessed && observer) {
            observer.disconnect();
        }
    }
    
    checkAndProcess();
    
    if (!historyProcessed || !extendedStatusProcessed) {
        observer = new MutationObserver(() => {
            checkAndProcess();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

//D-
//D-
//D- Пользователи в текст
//D-
//D-

async function fetchUserNames(encryptedIds, scId, token) {
    if (!encryptedIds || encryptedIds.length === 0) return {};
    
    const userNames = {};
    
    // Отправляем отдельный запрос для каждого encryptedId
    for (const encryptedId of encryptedIds) {
        const encodedId = encodeURIComponent(encryptedId);
        const url = `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/personal/get-bulk?platformType=SORTING_CENTER&ids=${encodedId}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': token
                },
                credentials: 'include'
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            // Парсим ответ
            if (typeof data === 'object' && data !== null) {
                // Если ответ в виде { "encryptedId": "Имя" }
                for (const [key, value] of Object.entries(data)) {
                    if (value && typeof value === 'string') {
                        userNames[key] = value;
                    }
                }
            }
            
            // Небольшая задержка между запросами
            await new Promise(r => setTimeout(r, 100));
            
        } catch (error) {
            console.warn(`Ошибка получения имени для ID:`, error);
        }
    }
    
    return userNames;
}
// Функция для получения истории статусов через API
async function fetchSortableHistory() {
    const path = location.pathname;
    const matches = path.match(/\/sorting-center\/(\d+)\/sortables\/(\d+)/);
    if (!matches) return null;
    
    const scId = matches[1];
    const sortableId = matches[2];
    
    // Получаем токен
    let token = null;
    if (typeof window.tpiUserTOKEN !== 'undefined' && window.tpiUserTOKEN) {
        token = window.tpiUserTOKEN;
    }
    if (!token) {
        try {
            token = localStorage.getItem('tpiUserTOKEN');
        } catch(e) {}
    }
    if (!token) {
        try {
            token = sessionStorage.getItem('tpiUserTOKEN');
        } catch(e) {}
    }
    if (!token) return null;
    
    const url = `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/sortables/get-history?id=${sortableId}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-Token': token
            },
            credentials: 'include'
        });
        
        if (!response.ok) return null;
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка получения истории:', error);
        return null;
    }
}

async function updateHistoryWithUserNames() {
    // Ждем появления таблицы с увеличенным таймаутом
    let historyTable = null;
    for (let i = 0; i < 50; i++) {
        historyTable = document.querySelector('.tpi-sort-history-status-table');
        if (historyTable) break;
        await new Promise(r => setTimeout(r, 200));
    }
    if (!historyTable) {
        return;
    }
    
    // Ждем появления заголовков и находим колонку "Пользователь" (с повторными попытками)
    let userColumnIndex = -1;
    for (let attempt = 0; attempt < 30; attempt++) {
        const headers = historyTable.querySelectorAll('thead th');
        for (let idx = 0; idx < headers.length; idx++) {
            const th = headers[idx];
            const titleSpan = th.querySelector('span[data-i18n-key="pages.sortable-item:events-table.titles.user"]');
            if (titleSpan || th.innerText.includes('Пользователь')) {
                userColumnIndex = idx;
                break;
            }
        }
        if (userColumnIndex !== -1) break;
        await new Promise(r => setTimeout(r, 300));
    }
    
    if (userColumnIndex === -1) {
        return;
    }
    
    // Функция для поиска глаз и установки лоадеров
    const findAndSetLoaders = () => {
        const eyeIcons = historyTable.querySelectorAll(`tbody tr td:nth-child(${userColumnIndex + 1}) svg[aria-label="icon-eye"]`);
        if (eyeIcons.length === 0) return false;
        
        let hasNewLoaders = false;
        eyeIcons.forEach(eyeIcon => {
            const userCell = eyeIcon.closest('td');
            if (userCell && !userCell.querySelector('.tpi-sort-user-link-loader')) {
                userCell.innerHTML = '<span class="tpi-sort-user-link-loader"></span>';
                hasNewLoaders = true;
            }
        });
        return hasNewLoaders;
    };
    
    // Ждем появления глаз (до 15 секунд)
    let loadersSet = false;
    for (let i = 0; i < 75; i++) {
        const result = findAndSetLoaders();
        if (result) {
            loadersSet = true;
            break;
        }
        await new Promise(r => setTimeout(r, 200));
    }
    
    if (!loadersSet) {
        return;
    }
    
    // Получаем данные истории через API
    const historyData = await fetchSortableHistory();
    if (!historyData || !Array.isArray(historyData)) {
        return;
    }
    
    // Получаем scId
    const path = location.pathname;
    const matches = path.match(/\/sorting-center\/(\d+)\/sortables\/(\d+)/);
    if (!matches) return;
    const scId = matches[1];
    
    // Собираем все encrypted ID пользователей
    const encryptedIds = [];
    const userByRowIndex = new Map();
    
    historyData.forEach((item, index) => {
        if (item.user && item.user.encryptedPersonalFullNameId) {
            encryptedIds.push(item.user.encryptedPersonalFullNameId);
            userByRowIndex.set(index, {
                encryptedId: item.user.encryptedPersonalFullNameId,
                uid: item.user.uid
            });
        }
    });
    
    if (encryptedIds.length === 0) {
        return;
    }
    
    // Получаем токен
    let token = null;
    if (typeof window.tpiUserTOKEN !== 'undefined' && window.tpiUserTOKEN) {
        token = window.tpiUserTOKEN;
    }
    if (!token) {
        try {
            token = localStorage.getItem('tpiUserTOKEN');
        } catch(e) {}
    }
    if (!token) {
        try {
            token = sessionStorage.getItem('tpiUserTOKEN');
        } catch(e) {}
    }
    if (!token) return;
    
    // Получаем имена пользователей
    const userNames = await fetchUserNames(encryptedIds, scId, token);
    
    // Обновляем ячейки
    const rows = historyTable.querySelectorAll('tbody tr');
    let updatedCount = 0;
    
    rows.forEach((row, rowIndex) => {
        if (userByRowIndex.has(rowIndex)) {
            const userData = userByRowIndex.get(rowIndex);
            const userName = userNames[userData.encryptedId];
            const uid = userData.uid;
            
            const cells = row.querySelectorAll('td');
            if (cells.length > userColumnIndex) {
                const userCell = cells[userColumnIndex];
                
                if (userName && uid) {
                    userCell.innerHTML = `
                        <div class="tpi-sort-user-link-wrapper">
                            <a class="tpi-sort-user-link" href="https://hubs.market.yandex.ru/sorting-center/${scId}/users/${uid}" target="_blank">
                                <icon>${tpi_sort_icon_person}</icon>
                                <p class="tpi-sort-user-link-text">${userName}</p>
                            </a>
                        </div>
                    `;
                    updatedCount++;
                }
            }
        }
    });
    
}

//D-
//D-
//D- Расшифровка курьера
//D-
//D-

async function fetchCourierNames(encryptedIds, scId, token) {
    if (!encryptedIds || encryptedIds.length === 0) return {};
    
    const courierNames = {};
    
    for (const encryptedId of encryptedIds) {
        const encodedId = encodeURIComponent(encryptedId);
        const url = `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/personal/get-bulk?platformType=SORTING_CENTER&ids=${encodedId}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': token
                },
                credentials: 'include'
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            if (typeof data === 'object' && data !== null) {
                for (const [key, value] of Object.entries(data)) {
                    if (value && typeof value === 'string') {
                        courierNames[key] = value;
                    }
                }
            }
            
            await new Promise(r => setTimeout(r, 100));
            
        } catch (error) {
            console.error(`Ошибка получения имени курьера:`, error);
        }
    }
    
    return courierNames;
}

// Функция для обновления имен курьеров в таблице
async function updateCourierNamesInHistory() {
    // Ждем появления таблицы
    let historyTable = document.querySelector('.tpi-sort-history-status-table');
    if (!historyTable) {
        for (let i = 0; i < 50; i++) {
            historyTable = document.querySelector('.tpi-sort-history-status-table');
            if (historyTable) break;
            await new Promise(r => setTimeout(r, 200));
        }
    }
    if (!historyTable) {
        return;
    }
    
    // Находим индекс колонки "Курьер"
    let courierColumnIndex = -1;
    for (let attempt = 0; attempt < 30; attempt++) {
        const headers = historyTable.querySelectorAll('thead th');
        for (let idx = 0; idx < headers.length; idx++) {
            const th = headers[idx];
            const titleSpan = th.querySelector('span[data-i18n-key="pages.sortable-item:events-table.titles.courier"]');
            if (titleSpan || th.innerText.includes('Курьер')) {
                courierColumnIndex = idx;
                break;
            }
        }
        if (courierColumnIndex !== -1) break;
        await new Promise(r => setTimeout(r, 300));
    }
    
    if (courierColumnIndex === -1) {
        return;
    }
    
    // Функция для поиска и установки лоадеров (аналогично пользователям)
    const findAndSetCourierLoaders = () => {
        const courierCells = historyTable.querySelectorAll(`tbody tr td:nth-child(${courierColumnIndex + 1})`);
        let hasNewLoaders = false;
        
        courierCells.forEach(courierCell => {
            // Проверяем наличие иконки глаза в ячейке
            const eyeIcon = courierCell.querySelector('svg[aria-label="icon-eye"]');
            // Также проверяем, что ячейка не пустая и не содержит уже загруженные данные
            const hasLoader = courierCell.querySelector('.tpi-sort-courier-link-loader');
            const hasContent = courierCell.querySelector('.tpi-sort-courier-data-wrapper');
            
            if (eyeIcon && !hasLoader && !hasContent) {
                courierCell.innerHTML = '<span class="tpi-sort-courier-link-loader"></span>';
                hasNewLoaders = true;
            }
        });
        return hasNewLoaders;
    };
    
    // Ждем появления глаз и устанавливаем лоадеры (до 15 секунд)
    let loadersSet = false;
    for (let i = 0; i < 75; i++) {
        const result = findAndSetCourierLoaders();
        if (result) {
            loadersSet = true;
            break;
        }
        await new Promise(r => setTimeout(r, 200));
    }
    
    if (!loadersSet) {
        // Не возвращаемся, а продолжаем - возможно данные уже загружены
    }
    
    // Получаем данные истории через API
    const historyData = await fetchSortableHistory();
    if (!historyData || !Array.isArray(historyData)) {
        return;
    }
    
    // Получаем scId
    const path = location.pathname;
    const matches = path.match(/\/sorting-center\/(\d+)\/sortables\/(\d+)/);
    if (!matches) return;
    const scId = matches[1];
    
    // Собираем все encrypted ID курьеров из destinationName
    const encryptedIds = [];
    const courierByRowIndex = new Map();
    
    historyData.forEach((item, index) => {
        if (item.destinationName && item.destinationName.encryptedPersonalFullNameId) {
            encryptedIds.push(item.destinationName.encryptedPersonalFullNameId);
            courierByRowIndex.set(index, {
                encryptedId: item.destinationName.encryptedPersonalFullNameId
            });
        }
    });
    
    if (encryptedIds.length === 0) {
        return;
    }
    
    // Получаем токен
    let token = null;
    if (typeof window.tpiUserTOKEN !== 'undefined' && window.tpiUserTOKEN) {
        token = window.tpiUserTOKEN;
    }
    if (!token) {
        try {
            token = localStorage.getItem('tpiUserTOKEN');
        } catch(e) {}
    }
    if (!token) {
        try {
            token = sessionStorage.getItem('tpiUserTOKEN');
        } catch(e) {}
    }
    if (!token) return;
    
    // Получаем имена курьеров
    const courierNames = await fetchCourierNames(encryptedIds, scId, token);
    
    // Обновляем ячейки
    const rows = historyTable.querySelectorAll('tbody tr');
    let updatedCount = 0;
    
    rows.forEach((row, rowIndex) => {
        if (courierByRowIndex.has(rowIndex)) {
            const courierData = courierByRowIndex.get(rowIndex);
            const courierName = courierNames[courierData.encryptedId];
            
            const cells = row.querySelectorAll('td');
            if (cells.length > courierColumnIndex) {
                const courierCell = cells[courierColumnIndex];
                
                if (courierName) {
                    courierCell.innerHTML = `
                        <div class="tpi-sort-courier-data-wrapper">
                            <icon>${tpi_sort_icon_courier}</icon>
                            <p class="tpi-sort-courier-data-text">${courierName}</p>
                        </div>
                    `;
                    updatedCount++;
                }
            }
        }
    });
    
}

//D-
//D-
//D-    Лоты, карты итд
//D-
//D-

function getParentSortableIcon(text) {
    if (!text) return tpi_sort_icon_label;
    
    const upperText = text.toUpperCase();
    
    if (upperText.startsWith('F1254')) {
        return tpi_sort_icon_label;
    }
    if (upperText.startsWith('F6254')) {
        return tpi_sort_icon_bag;
    }
    if (upperText.startsWith('F3000')) {
        return tpi_sort_icon_polybox;
    }
    if (upperText.startsWith('CART-')) {
        return tpi_sort_icon_cart;
    }
    if (upperText.startsWith('PALLET-')) {
        return tpi_sort_icon_pallet;
    }
    
    return tpi_sort_icon_label;
}

function extractExtraCode(text) {
    if (!text) return null;
    
    const upperText = text.toUpperCase();
    if (upperText.startsWith('F1254') || 
        upperText.startsWith('F3000') || 
        upperText.startsWith('F6254')) {
        // Берем последние 5 символов
        return text.slice(-5);
    }
    return null;
}

function processParentSortableColumn() {
    // Находим таблицу истории статусов
    const historyTable = document.querySelector('.tpi-sort-history-status-table');
    if (!historyTable) return 0;
    
    // Находим индекс колонки "Родительское грузоместо"
    let parentColumnIndex = -1;
    const headers = historyTable.querySelectorAll('thead th');
    
    for (let idx = 0; idx < headers.length; idx++) {
        const th = headers[idx];
        const titleSpan = th.querySelector('span[data-i18n-key="pages.sortable-item:events-table.titles.parentSortable"]');
        if (titleSpan || th.innerText.includes('Родительское грузоместо')) {
            parentColumnIndex = idx;
            break;
        }
    }
    
    if (parentColumnIndex === -1) {
        return 0;
    }
    
    let processedCount = 0;
    const rows = historyTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length <= parentColumnIndex) return;
        
        const parentCell = cells[parentColumnIndex];
        if (!parentCell) return;
        
        // Ищем ссылку в ячейке
        const link = parentCell.querySelector('a');
        if (!link) return;
        
        // Проверяем, не обработана ли уже эта ячейка
        if (parentCell.querySelector('.tpi-sort-parent-sortable-link')) return;
        
        const href = link.getAttribute('href');
        const linkText = link.textContent.trim();
        
        // Создаем новую ссылку
        const newLink = document.createElement('a');
        newLink.href = href;
        newLink.className = 'tpi-sort-parent-sortable-link';
        newLink.target = '_blank';
        
        // Добавляем иконку
        const icon = document.createElement('icon');
        icon.className = 'tpi-sort-parent-sortable-link-icon';
        icon.innerHTML = getParentSortableIcon(linkText);
        newLink.appendChild(icon);
        
        // Создаем контейнер для текста
        const textWrapper = document.createElement('p');
        textWrapper.className = 'tpi-sort-parent-sortable-link-text';
        
        // Извлекаем основной текст
        let mainText = linkText;
        const extraCode = extractExtraCode(linkText);
        
        if (extraCode) {
            // Убираем последние 5 символов из основного текста
            mainText = linkText.slice(0, -5);
            textWrapper.appendChild(document.createTextNode(mainText));
            
            const extraSpan = document.createElement('span');
            extraSpan.className = 'tpi-sort-parent-sortable-link-text-extra';
            extraSpan.textContent = extraCode;
            textWrapper.appendChild(extraSpan);
        } else {
            textWrapper.textContent = linkText;
        }
        
        newLink.appendChild(textWrapper);
        
        // Заменяем старую ссылку на новую
        parentCell.innerHTML = '';
        parentCell.appendChild(newLink);
        processedCount++;
    });
    
    if (processedCount > 0) {
    }
    
    return processedCount;
}

// Добавляем observer для отслеживания появления таблицы и обработки родительских грузомест
function initParentSortableObserver() {
    let processed = false;
    
    const parentObserver = new MutationObserver(() => {
        if (processed) return;
        
        const historyTable = document.querySelector('.tpi-sort-history-status-table');
        if (historyTable) {
            const result = processParentSortableColumn();
            if (result > 0) {
                processed = true;
                parentObserver.disconnect();
            }
        }
    });
    
    parentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Также пробуем обработать сразу, если таблица уже есть
    const existingTable = document.querySelector('.tpi-sort-history-status-table');
    if (existingTable) {
        processParentSortableColumn();
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//A- Ёбаная история сканлогов, которую так хочет обратно Тимур, ёбаный в рот столько переписывать я ебал в роооооот !
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function() {
    // ---------- Вспомогательные функции ----------
    function getHistoryExcelURL() {
        const path = location.pathname;
        const match = path.match(/\/sorting-center\/(\d+)\/sortables\/(\d+)/);
        if (!match) return null;
        const scId = match[1];
        const sortableId = match[2];
        return `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/sortables/download-sortable-history?id=${sortableId}`;
    }

    function getSortableName() {
        if (window.currentSortableBarcode) return window.currentSortableBarcode;
        const sortableRaw = document.querySelector(".diman__sortable")?.innerText;
        if (!sortableRaw) return "null";
        return sortableRaw.replace(/Грузоместо №/g, '').trim();
    }

    function formatExcelDate(excelDate) {
        if (typeof excelDate !== 'number') return { date: '', time: '' };
        const utcMs = (excelDate - 25569) * 86400 * 1000;
        const d = new Date(utcMs);
        return {
            date: `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`,
            time: `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}`
        };
    }

    // ---------- Генерация таблицы ----------
    function generateTableHTML(data, showNotification = true) {
        if (!data || !data.length) {
            return `<div class="diman__scanLog__block">
                        <div class="diman__scanLog__topTableWrapper">
                            <div class="diman__scanLog__topTable">
                                <span class="diman__scanLog__block-title">История грузоместа: <span>${getSortableName()}</span></span>
                            </div>
                        </div>
                        <table style="width:100%"><tbody><tr><td class="diman__scanLog__null">Нет записей в истории</td></tr></tbody></table>
                        <div class="diman__scanLog__bottomTableWrapper"><div class="diman__scanLog__bottomTable">${getOperationStatistics(data)}</div></div>
                    </div>`;
        }

        const header = data[0] || [];
        const rows = data.slice(1);
        if (rows.length === 0) {
            return `<div class="diman__scanLog__block">
                        <div class="diman__scanLog__topTableWrapper">
                            <div class="diman__scanLog__topTable">
                                <span class="diman__scanLog__block-title">История грузоместа: <span>${getSortableName()}</span></span>
                            </div>
                        </div>
                        <table style="width:100%"><tbody><tr><td class="diman__scanLog__null">Нет записей в истории</td></tr></tbody></table>
                        <div class="diman__scanLog__bottomTableWrapper"><div class="diman__scanLog__bottomTable">${getOperationStatistics(data)}</div></div>
                    </div>`;
        }

        const datetimeIndex = header.findIndex(cell => cell?.toString().trim().toLowerCase().includes("дата") || cell?.toString().trim().toLowerCase().includes("время"));
        const operationIndex = header.findIndex(cell => cell?.toString().trim() === "Флоу");
        const zoneIndex = header.findIndex(cell => cell?.toString().trim() === "Зона");
        const resultIndex = header.findIndex(cell => cell?.toString().trim() === "Результат");
        const userIndex = header.findIndex(cell => cell?.toString().trim() === "Кладовщик");
        const operationTypeIndex = header.findIndex(cell => cell?.toString().trim() === "Операция");

        const emptyColumns = new Array(header.length).fill(true);
        for (let colIndex = 0; colIndex < header.length; colIndex++) {
            if ([datetimeIndex, operationIndex, userIndex, zoneIndex].includes(colIndex)) {
                emptyColumns[colIndex] = false;
                continue;
            }
            for (const row of rows) {
                if (row[colIndex] !== undefined && row[colIndex] !== null && row[colIndex] !== '') {
                    emptyColumns[colIndex] = false;
                    break;
                }
            }
        }

        let html = `<div class="diman__scanLog__block">
            <div class="diman__scanLog__topTableWrapper">
                <div class="diman__scanLog__topTable">
                    <span class="diman__scanLog__block-title">История грузоместа: <span>${getSortableName()}</span></span>
                </div>
            </div>
            <table class="diman__scanLog__table">
                <thead class="diman__scanLog__thead">
                    <tr class="diman__scanLog__thead__tr">
                        <th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__info">
                            <div class="diman__scanLog__th__info diman__scanLog__th__date">Дата</div>
                            <div class="diman__scanLog__th__info diman__scanLog__th__time">Время</div>
                            <div class="diman__scanLog__th__info diman__scanLog__th__icon" is-icons-showed="true">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" fill-rule="evenodd" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M160 144h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V160c0-8.837 7.163-16 16-16m564.314-25.333 181.019 181.02c6.248 6.248 6.248 16.378 0 22.627l-181.02 181.019c-6.248 6.248-16.378 6.248-22.627 0l-181.019-181.02c-6.248-6.248-6.248-16.378 0-22.627l181.02-181.019c6.248-6.248 16.378-6.248 22.627 0M160 544h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H160c-8.837 0-16-7.163-16-16V560c0-8.837 7.163-16 16-16m400 0h304c8.837 0 16 7.163 16 16v304c0 8.837-7.163 16-16 16H560c-8.837 0-16-7.163-16-16V560c0-8.837 7.163-16 16-16"></path></svg>
                            </div>
                            <div class="diman__scanLog__th__shadow"></div>
                        </th>`;
        if (operationIndex !== -1) html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other">Флоу</th>`;
        if (userIndex !== -1) html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other">Кладовщик</th>`;
        if (zoneIndex !== -1) html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other">Зона</th>`;
        for (let colIndex = 0; colIndex < header.length; colIndex++) {
            if (![datetimeIndex, operationIndex, userIndex, zoneIndex].includes(colIndex)) {
                const cell = header[colIndex];
                const hiddenAttr = emptyColumns[colIndex] ? ' tpi-scanlog-hidden-column' : '';
                html += `<th class="diman__scanLog__thead__tr__th diman__scanLog__th__stickySection__other"${hiddenAttr}>${cell !== undefined ? cell : ''}</th>`;
            }
        }
        html += `<tr></thead><tbody class="diman__scanLog__tbody" is-background-showed="true" is-tr-bordered="true">`;

        let lastDate = null;
        for (const row of rows) {
            let date = '', time = '', currentRowDate = '';
            if (datetimeIndex !== -1 && row[datetimeIndex] !== undefined) {
                const formatted = formatExcelDate(row[datetimeIndex]);
                date = formatted.date;
                time = formatted.time;
                currentRowDate = date;
            }
            const operationCell = operationIndex !== -1 ? row[operationIndex]?.toString().trim() : undefined;
            const userCell = userIndex !== -1 ? row[userIndex]?.toString().trim() : undefined;
            const resultCell = resultIndex !== -1 ? row[resultIndex]?.toString().trim() : undefined;
            const operationTypeCell = operationTypeIndex !== -1 ? row[operationTypeIndex]?.toString().trim() : undefined;

            let rowAttr = '';
            let iconAttr = '';

            // Полная подсветка (как в sortablesScanlog.js)
            if (userCell === "sc-robot-ship-ta-SortingCenter[82]") {
                rowAttr += ' dimanUser="pi-bot" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="robot-shipped"';
            } else if (resultCell === "Ошибка") {
                rowAttr += ' dimanOpertaion="error" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="error"';
            } else if (operationCell === "Сортировка" || operationCell === "sc.display.flow.COLLECT") {
                rowAttr += ' dimanOpertaion="sort" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="sort"';
            } else if (operationCell === "Предсортировка посылок" || operationCell === "Предсортировка по группам") {
                rowAttr += ' dimanOpertaion="predsort" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="predsort"';
            } else if (operationCell === "[*] Отгрузка заказов" || operationCell === "Отгрузка на средней миле"|| operationCell === "Отгрузка на последней миле" || operationCell === "sc.display.flow.SC_SHIPMENT" || operationCell === "Отгрузка возвратов мерчу") {
                rowAttr += ' dimanOpertaion="otgruzka" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="shipped"';
            } else if (operationCell === "[*] Отгрузка возвратов") {
                rowAttr += ' dimanOpertaion="otgruzka-voz" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="shipped"';
            } else if (operationCell === "[*] Подготовка к отгрузке") {
                rowAttr += ' dimanOpertaion="podgotovkakotgruzke" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="ready to shipp"';
            } else if (operationCell === "Инфоскан") {
                rowAttr += ' dimanOpertaion="infoscan" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="infoscan"';
            } else if (operationCell === "Приемка возвратов от курьера") {
                rowAttr += ' dimanOpertaion="courier return accept" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="return"';
            } else if (operationCell === "Приемка палет по первому сканированию") {
                rowAttr += ' dimanOpertaion="first pallet accept" coloredRow="true"';
            } else if (operationCell === "Приемка лотов") {
                rowAttr += ' dimanOpertaion="accept-lot" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="accept-lot"';
            } else if (operationCell === "[*] Инвентаризация") {
                rowAttr += ' dimanOpertaion="inventoryzation" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="inventoryzation"';
            } else if (operationCell === "Перемещение лотов") {
                rowAttr += ' dimanOpertaion="moved-lot" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="moved-lot"';
            } else if (operationCell === "[*] Подготовка лотов") {
                rowAttr += ' dimanOpertaion="ready-lot" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="ready-lot"';
            } else if (operationCell === "sc.display.flow.PRE_DAMAGED_SORT") {
                rowAttr += ' dimanOpertaion="damaged-predamaged-sort" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="damaged-predamaged-sort"';
            } else if (operationCell === "sc.display.flow.DAMAGED_FORM") {
                if (operationTypeCell === "sc.display.operation.GET") {
                    rowAttr += ' dimanOpertaion="damaged-get" coloredRow="true"';
                    iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="damaged-get"';
                } else if (operationTypeCell === "sc.display.operation.UPLOAD_FILE") {
                    rowAttr += ' dimanOpertaion="damaged-upload-file" coloredRow="true"';
                    iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="damaged-upload-file"';
                } else if (operationTypeCell === "sc.display.operation.CREATE") {
                    rowAttr += ' dimanOpertaion="damaged-create" coloredRow="true"';
                    iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="damaged-create"';
                } else {
                    rowAttr += ' dimanOpertaion="damaged-unknown" coloredRow="true"';
                    iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="damaged-unknown"';
                }
            }
             else {
                rowAttr += ' dimanOpertaion="unknown-operation" coloredRow="true"';
                iconAttr += ' class="diman__scanLog__td__i__icon" diman__tableOpertaionIcon="unknown-operation"';
            }

            if (lastDate && currentRowDate && currentRowDate !== lastDate) rowAttr += ' brakeday="true"';

            html += `<tr${rowAttr}>
                <td class="diman__scanLog__tbody__td diman__scanLog__td__stickySection__info">
                    <div class="diman__scanLog__td__info diman__scanLog__td__date">${date}</div>
                    <div class="diman__scanLog__td__info diman__scanLog__td__time">${time}</div>
                    <div class="diman__scanLog__td__info diman__scanLog__td__icon" is-icons-showed="true"><i${iconAttr}>i</i></div>
                    </div><div class="diman__scanLog__td__shadow"></div>
                </td>`;
            if (operationIndex !== -1) html += `<td class="diman__scanLog__tbody__td">${operationCell !== undefined ? operationCell : ''}</td>`;
            if (userIndex !== -1) html += `<td class="diman__scanLog__tbody__td diman__table__short">${userCell !== undefined ? userCell : ''}</td>`;
            if (zoneIndex !== -1) html += `<td class="diman__scanLog__tbody__td diman__table__short">${row[zoneIndex] !== undefined ? row[zoneIndex] : ''}</td>`;
            for (let colIndex = 0; colIndex < header.length; colIndex++) {
                if (![datetimeIndex, operationIndex, userIndex, zoneIndex].includes(colIndex)) {
                    const cell = row[colIndex];
                    const hiddenAttr = emptyColumns[colIndex] ? ' tpi-scanlog-hidden-column' : '';
                    html += `<td class="diman__scanLog__tbody__td"${hiddenAttr}>${cell !== undefined ? cell : ''}</td>`;
                }
            }
            html += `</tr>`;
            lastDate = currentRowDate;
        }
        html += `</tbody></table><div class="diman__scanLog__bottomTableWrapper"><div class="diman__scanLog__bottomTable">${getOperationStatistics(data)}</div></div></div>`;

        return html;
    }

    function getOperationStatistics(data) {
        const operationCounts = {};
        const operationPriority = ["sort", "predsort", "error", "infoscan", "ready-lot", "ready to shipp", "return", "inventoryzation", "accept-lot", "moved-lot", "shipped", "robot-shipped", "damaged-get", "damaged-upload-file", "damaged-create"];
        const tooltipMap = {
            "sort": "Сортировка",
            "predsort": "Предсортировка",
            "error": "Ошибка",
            "infoscan": "Инфоскан",
            "ready-lot": "Подготовка лотов",
            "ready to shipp": "Подготовка к отгрузке",
            "return": "Приемка возвратов от курьера",
            "inventoryzation": "Инвентаризация",
            "accept-lot": "Приемка лотов",
            "moved-lot": "Перемещение лотов",
            "shipped": "Отгрузка",
            "robot-shipped": "Отгрузка, робот",
            "damaged-get": "Оформление брака (получение)",
            "damaged-upload-file": "Оформление брака (загрузка файла)",
            "damaged-create": "Оформление брака (создание)"
        };
        if (data && data.length > 1) {
            const header = data[0];
            const rows = data.slice(1);
            const operationIndex = header.findIndex(cell => cell?.toString().trim() === "Флоу");
            const resultIndex = header.findIndex(cell => cell?.toString().trim() === "Результат");
            const userIndex = header.findIndex(cell => cell?.toString().trim() === "Кладовщик");
            const operationTypeIndex = header.findIndex(cell => cell?.toString().trim() === "Операция");
            rows.forEach(row => {
                const operationCell = operationIndex !== -1 ? row[operationIndex]?.toString().trim() : undefined;
                const resultCell = resultIndex !== -1 ? row[resultIndex]?.toString().trim() : undefined;
                const userCell = userIndex !== -1 ? row[userIndex]?.toString().trim() : undefined;
                let operationType = '';
                if (resultCell === "Ошибка") {
                    operationType = "error";
                } else if (operationCell === "Сортировка" || operationCell === "sc.display.flow.COLLECT") {
                    operationType = "sort";
                } else if (operationCell === "Предсортировка посылок" || operationCell === "Предсортировка по группам") {
                    operationType = "predsort";
                } else if (operationCell === "Инфоскан") {
                    operationType = "infoscan";
                } else if (operationCell === "[*] Подготовка лотов") {
                    operationType = "ready-lot";
                } else if (operationCell === "[*] Подготовка к отгрузке") {
                    operationType = "ready to shipp";
                } else if (operationCell === "[*] Отгрузка заказов" || operationCell === "Отгрузка на средней миле" || operationCell === "[*] Отгрузка возвратов" || operationCell === "sc.display.flow.SC_SHIPMENT") {
                    operationType = "shipped";
                } else if (operationCell === "Приемка возвратов от курьера") {
                    operationType = "return";
                } else if (operationCell === "[*] Инвентаризация") {
                    operationType = "inventoryzation";
                } else if (operationCell === "Приемка лотов") {
                    operationType = "accept-lot";
                } else if (operationCell === "Перемещение лотов") {
                    operationType = "moved-lot";
                } else if (userCell === "sc-robot-ship-ta-SortingCenter[82]") {
                    operationType = "robot-shipped";
                }
                if (operationType) {
                    operationCounts[operationType] = (operationCounts[operationType] || 0) + 1;
                }
            });
        }
        const htmlParts = ['<div class="diman__sncaLog__totalOpertaion-title">Операции:</div>'];
        operationPriority.forEach(op => {
            if (operationCounts[op]) {
                const tooltip = tooltipMap[op] || op;
                htmlParts.push(`<div class="diman__sncaLog__totalOpertaion-item" tpi-tooltip-data="${tooltip}"><i diman__tableopertaionicon="${op}" class="diman__scanLog__td__i__icon">i</i><p>${operationCounts[op]}</p></div>`);
            }
        });
        return htmlParts.join('');
    }

    // ---------- Настройки ----------
    function scanLogCheckLoadSettings() {
        const option2 = document.querySelector('#dimanHistoryLog-option-2');
        const option3 = document.querySelector('#dimanHistoryLog-option-3');
        const option4 = document.querySelector('#dimanHistoryLog-option-4');
        const option5 = document.querySelector('#dimanHistoryLog-option-5');
        const option6 = document.querySelector('#dimanHistoryLog-option-6');
        const option7 = document.querySelector('#dimanHistoryLog-option-7');
        const option9 = document.querySelector('#dimanHistoryLog-option-9');
        if (option2) {
            const setColorScheme = () => {
                const coloredRow = document.querySelectorAll('tr[coloredrow]');
                coloredRow.forEach(tr => tr.setAttribute('coloredrow', option2.checked));
            };
            setColorScheme();
            option2.addEventListener("change", setColorScheme);
        }
        if (option3) {
            const brakeDay = () => {
                const brakeRows = document.querySelectorAll('tr[brakeday]');
                brakeRows.forEach(tr => tr.setAttribute('brakeday', option3.checked));
            };
            brakeDay();
            option3.addEventListener("change", brakeDay);
        }
        if (option4) {
            const setIcons = () => {
                const iconColumn = document.querySelectorAll('div[is-icons-showed]');
                iconColumn.forEach(elem => elem.setAttribute('is-icons-showed', option4.checked));
            };
            setIcons();
            option4.addEventListener("change", setIcons);
        }
        if (option5) {
            const setBackground = () => {
                const table = document.querySelectorAll('tbody[is-background-showed]');
                table.forEach(elem => elem.setAttribute('is-background-showed', option5.checked));
            };
            setBackground();
            option5.addEventListener("change", setBackground);
        }
        if (option6) {
            const setBordered = () => {
                const table = document.querySelectorAll('tbody[is-tr-bordered]');
                table.forEach(elem => elem.setAttribute('is-tr-bordered', option6.checked));
            };
            setBordered();
            option6.addEventListener("change", setBordered);
        }
        if (option7) {
            const hideEmptyColumns = () => {
                const table = document.querySelectorAll('table *[tpi-scanlog-hidden-column]');
                table.forEach(elem => elem.setAttribute('tpi-scanlog-hidden-column', option7.checked));
            };
            hideEmptyColumns();
            option7.addEventListener("change", hideEmptyColumns);
        }
        if (option9) {
            const scrollToTable = () => {
                if (option9.checked) {
                    const tableSettings = document.querySelector(".diman__scanLogSettings");
                    if (tableSettings) {
                        const offset = -30;
                        const offsetPosition = tableSettings.getBoundingClientRect().top + window.pageYOffset + offset;
                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                }
            };
            scrollToTable();
            option9.addEventListener("change", () => { if (option9.checked) scrollToTable(); });
        }
    }

    // ---------- Загрузка сканлогов лотов (с авторизацией через куки) ----------
    async function loadAdditionalScanLogs(mainContainer) {
        const linksMap = new Map();
        const excludedPrefixes = ['CART', 'PALLET', 'DRP'];
        
        const path = location.pathname;
        const scMatch = path.match(/\/sorting-center\/(\d+)\//);
        const scId = scMatch ? scMatch[1] : '21972131';
        
        // Правильный endpoint для скачивания истории грузоместа (лота)
        const historyUrlTemplate = `https://hubs.market.yandex.ru/api/gateway/logpoint/${scId}/sortables/download-sortable-history?id=`;

        // Получаем токен
        let token = null;
        if (typeof window.tpiUserTOKEN !== 'undefined' && window.tpiUserTOKEN) {
            token = window.tpiUserTOKEN;
        }
        if (!token) {
            try { token = localStorage.getItem('tpiUserTOKEN'); } catch(e) {}
        }
        if (!token) {
            try { token = sessionStorage.getItem('tpiUserTOKEN'); } catch(e) {}
        }
        if (!token) {
            token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        }

        const parentLinks = document.querySelectorAll('a.tpi-sort-parent-sortable-link');
        
        parentLinks.forEach(link => {
            const text = link.textContent.trim();
            const isExcluded = excludedPrefixes.some(prefix => text.startsWith(prefix));
            if (isExcluded) return;
            
            const href = link.getAttribute('href');
            const match = href.match(/\/sortables\/(\d+)/);
            if (!match) return;
            
            const sortableId = match[1];
            if (!linksMap.has(text)) {
                linksMap.set(text, { url: `${historyUrlTemplate}${sortableId}`, sortableId });
            }
        });

        if (linksMap.size === 0) return;

        const blocks = [];
        for (const [text, { url }] of linksMap.entries()) {
            try {
                const headers = {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                    headers['X-CSRF-Token'] = token;
                }
                
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: headers
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                
                const html = generateTableHTML(data, false);
                const block = document.createElement('div');
                block.className = 'diman__scanLog__block diman__scanLog__additional-block';
                block.style.display = 'none';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const innerContent = tempDiv.querySelector('.diman__scanLog__block')?.innerHTML || html;
                block.innerHTML = innerContent;
                
                const topTable = block.querySelector('.diman__scanLog__topTable');
                if (topTable) {
                    topTable.innerHTML = `
                        <span class="diman__scanLog__block-title">Сканлог: <span>${text}</span></span>
                        <div class="diman__scanLog__nav-container">
                            <button class="diman__scanLog__nav prev">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z"/></svg>
                            </button>
                            <span class="diman__scanLog__counter">1 из ${linksMap.size}</span>
                            <button class="diman__scanLog__nav next">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/></svg>
                            </button>
                        </div>
                    `;
                }
                mainContainer.appendChild(block);
                blocks.push(block);
            } catch (error) {
                console.error(`Ошибка загрузки сканлога для "${text}":`, error);
                if (typeof tpiNotification !== 'undefined') {
                    tpiNotification.show("Сканлог Лота", "error", `Ошибка загрузки ${text}`);
                }
            }
        }

        let currentIndex = 0;
        const switchBlock = (newIndex) => {
            blocks.forEach(block => block.style.display = 'none');
            if (blocks[newIndex]) {
                blocks[newIndex].style.display = 'block';
                currentIndex = newIndex;
                blocks.forEach(block => {
                    const counter = block.querySelector('.diman__scanLog__counter');
                    if (counter) counter.textContent = `${newIndex + 1} из ${blocks.length}`;
                });
            }
        };
        blocks.forEach((block, index) => {
            const prevBtn = block.querySelector('.prev');
            const nextBtn = block.querySelector('.next');
            if (prevBtn) prevBtn.addEventListener('click', () => switchBlock((currentIndex - 1 + blocks.length) % blocks.length));
            if (nextBtn) nextBtn.addEventListener('click', () => switchBlock((currentIndex + 1) % blocks.length));
        });
        if (blocks.length > 0) switchBlock(0);
    }

    // ---------- Автозагрузка основной истории ----------
    async function historyAutoPreload(settingsDiv, button, buttonText, force = false) {
        try {
            const option1 = document.querySelector('#dimanHistoryLog-option-1');
            if (!force && !option1?.checked) return;
            const excelUrl = getHistoryExcelURL();
            if (!excelUrl) throw new Error("URL не найден");
            button.disabled = true;
            buttonText.innerHTML = `<div class="diman__scanLog__activeButton__text">Загрузка</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="diman__scanLog__activeButton__icon"><circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>`;
            const response = await fetch(excelUrl, { credentials: 'include' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const html = generateTableHTML(data);
            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'diman__scanLog__wrapper';
            wrapperDiv.innerHTML = html;
            settingsDiv.insertAdjacentElement('afterend', wrapperDiv);
            button.setAttribute('scanLog', 'shown');
            buttonText.innerHTML = `<div class="diman__scanLog__activeButton__text">Скрыть сканлог</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="diman__scanLog__activeButton__icon"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>`;
            scanLogCheckLoadSettings();
            button.disabled = false;
            if (document.querySelector('#dimanHistoryLog-option-8').checked) {
                try {
                    await loadAdditionalScanLogs(wrapperDiv);
                } catch (err) { console.log(err); }
            }
        } catch (error) {
            console.error("Автозагрузка истории:", error);
            buttonText.innerHTML = `<div class="diman__scanLog__activeButton__text">Ошибка ❌</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>`;
        }
    }

    // ---------- Основная функция вставки кнопки ----------
    function insertHistoryButton() {
        // 1. Находим заголовок
        const titleSpan = document.querySelector('span[data-i18n-key="pages.sortable-item:events-table.title"]');
        if (!titleSpan) return false;

        // 2. Поднимаемся на 3 уровня вверх (div❤)
        let targetDiv = titleSpan.parentElement?.parentElement?.parentElement;
        if (!targetDiv || targetDiv.tagName !== 'DIV') return false;

        // 3. Проверяем, не добавлен ли уже блок
        let settingsDiv = targetDiv.parentNode?.querySelector('.diman__scanLogSettings');
        if (!settingsDiv) {
            // Создаём блок настроек
            settingsDiv = document.createElement('div');
            settingsDiv.className = 'diman__scanLogSettings';

            // Вставляем ПЕРЕД targetDiv
            targetDiv.parentNode.insertBefore(settingsDiv, targetDiv);

            // Создаём и вставляем <hr> сразу после settingsDiv
            const hr = document.createElement('hr');
            hr.className = 'mez-border-none mez-p-0 mez-bg-themeBorderDefault mez-h-[1px] mez-w-full';
            targetDiv.parentNode.insertBefore(hr, settingsDiv.nextSibling);
        }

        // Если кнопка уже есть, выходим
        if (settingsDiv.querySelector('.diman__scanLog__activeButton')) return true;

        // 4. Создаём кнопку
        const button = document.createElement('button');
        button.className = 'diman__scanLog__activeButton';
        button.setAttribute('scanLog', 'hidden');
        const buttonText = document.createElement('div');
        buttonText.className = 'diman__scanLog__activeButton__text_bugged';
        buttonText.innerHTML = `<div class="diman__scanLog__activeButton__text">Показать сканлог</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>`;
        button.appendChild(buttonText);
        settingsDiv.appendChild(button);

        // 5. Создаём панель с чекбоксами
        const options = document.createElement('div');
        options.className = 'diman__scanLogSettings__options';
        options.innerHTML = `<div class="diman__scanLogSettings__options__container"><div class="diman__scanLogSettings__options__description">Настройки применяются ко всем грузоместам</div></div><div class="diman__scanLogSettings__options__container diman__scanLogSettings__options__container__scrollbar" id="dimanHistoryLog-checkboxes-container"></div>`;
        settingsDiv.appendChild(options);
        const checkboxesContainer = options.querySelector('#dimanHistoryLog-checkboxes-container');
        const checkboxConfigs = [
            { id: "dimanHistoryLog-option-1", label: "Автозагрузка истории", defaultChecked: false },
            { id: "dimanHistoryLog-option-2", label: "Подсветка операций", defaultChecked: true },
            { id: "dimanHistoryLog-option-3", label: "Разделение дней", defaultChecked: true },
            { id: "dimanHistoryLog-option-4", label: "Иконки манипуляций", defaultChecked: true },
            { id: "dimanHistoryLog-option-5", label: "Задний фон таблицы", defaultChecked: true },
            { id: "dimanHistoryLog-option-6", label: "Сетка таблицы", defaultChecked: true },
            { id: "dimanHistoryLog-option-7", label: "Скрывать пустые столбцы", defaultChecked: false },
            { id: "dimanHistoryLog-option-8", label: "Сканлог лотов", defaultChecked: false },
            { id: "dimanHistoryLog-option-9", label: "Автоскролл к истории", defaultChecked: false },
            { id: "dimanHistoryLog-option-10", label: "Статистика операций", defaultChecked: true }
        ];
        checkboxConfigs.forEach(({ id, label, defaultChecked }) => {
            const saved = localStorage.getItem(id);
            const isChecked = saved !== null ? saved === "true" : defaultChecked;
            const wrapper = document.createElement('label');
            wrapper.className = 'diman__scanLog__checkBox__container';
            wrapper.innerHTML = `<input type="checkbox" class="diman__scanLog__checkBox__input" id="${id}" ${isChecked ? "checked" : ""}><div class="diman__scanLog__checkBox__pin"></div><div class="diman__scanLog__checkBox__text">${label}</div><icon class="tpi-sort-scanlog-option-icon">${historyLogIcon(id)}</icon>`;
            checkboxesContainer.appendChild(wrapper);
            wrapper.querySelector('input').addEventListener('change', (e) => localStorage.setItem(id, e.target.checked));
        });

        // 6. Обработчик клика по кнопке
        button.addEventListener('click', async () => {
            const state = button.getAttribute('scanLog');
            if (state === 'hidden') {
                 await historyAutoPreload(settingsDiv, button, buttonText, true);
            } else {
                const wrapper = document.querySelector('.diman__scanLog__wrapper');
                if (wrapper) wrapper.remove();
                const additionalContainers = document.querySelectorAll('.diman__scanLog__additional-block');
                additionalContainers.forEach(container => container.remove());
                button.setAttribute('scanLog', 'hidden');
                buttonText.innerHTML = `<div class="diman__scanLog__activeButton__text">Показать сканлог</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="diman__scanLog__activeButton__icon"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>`;
            }
        });

        // 7. Применяем сохранённые настройки отображения
        scanLogCheckLoadSettings();

        // 8. Автоматическая загрузка, если чекбокс включён
        const autoLoadCheckbox = document.querySelector('#dimanHistoryLog-option-1');
        if (autoLoadCheckbox && autoLoadCheckbox.checked) {
            setTimeout(() => {
                if (button.getAttribute('scanLog') === 'hidden') {
                    historyAutoPreload(settingsDiv, button, buttonText).catch(console.error);
                }
            }, 500);
        }

        function historyLogIcon(id){
            if(id == 'dimanHistoryLog-option-1'){
                return tpi_sort_icon_histry_option_auto_load
            } else if(id == 'dimanHistoryLog-option-2'){
                return tpi_sort_icon_histry_option_highlight_operations
            } else if(id == 'dimanHistoryLog-option-3'){
                return tpi_sort_icon_histry_option_split_days
            } else if(id == 'dimanHistoryLog-option-4'){
                return tpi_sort_icon_histry_manipulation_icons
            } else if(id == 'dimanHistoryLog-option-5'){
                return tpi_sort_icon_histry_background
            } else if(id == 'dimanHistoryLog-option-6'){
                return tpi_sort_icon_histry_extra_grid
            } else if(id == 'dimanHistoryLog-option-7'){
                return tpi_sort_icon_histry_option_empty_cells
            } else if(id == 'dimanHistoryLog-option-8'){
                return tpi_sort_icon_histry_option_lots
            } else if(id == 'dimanHistoryLog-option-9'){
                return tpi_sort_icon_histry_option_autoscroll
            } else if(id == 'dimanHistoryLog-option-10'){
                return tpi_sort_icon_histry_option_stats
            } else{
                return tpi_sort_icon_histry_option_unknown
            }
        }

        return true;
    }

    // ---------- Запуск ----------
    let observer = null;
    let interval = null;
    function startWatching() {
        if (observer) observer.disconnect();
        if (interval) clearInterval(interval);
        insertHistoryButton();
        observer = new MutationObserver(() => {
            if (document.querySelector('span[data-i18n-key="pages.sortable-item:events-table.title"]')) {
                insertHistoryButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        interval = setInterval(() => {
            const titleSpan = document.querySelector('span[data-i18n-key="pages.sortable-item:events-table.title"]');
            if (titleSpan) {
                const container = titleSpan.closest('.mez-flex.mez-flex-col') || titleSpan.closest('[class*="mez-flex"][class*="mez-flex-col"]');
                if (container) {
                    const settingsDiv = container.querySelector('.diman__scanLogSettings');
                    const button = settingsDiv ? settingsDiv.querySelector('.diman__scanLog__activeButton') : null;
                    if (!button) insertHistoryButton();
                }
            }
        }, 2000);
    }
    startWatching();
})();

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

function tpi_makeFavIcon() {
    const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;

    function setFavicon(color) {
        let link = document.querySelector("link[rel='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = 'data:image/svg+xml,' + encodeURIComponent(favSvg.replace('currentColor', color));
    }

    function updateTheme() {
        const isDark = document.documentElement.classList.contains('dark') ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
        setFavicon(isDark ? '#ffffff' : '#212121');
        if (window.currentSortableBarcode) document.title = `ГМ | ${window.currentSortableBarcode}`;
    }

    updateTheme();
    new MutationObserver(updateTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    let _barcode = window.currentSortableBarcode;
    Object.defineProperty(window, 'currentSortableBarcode', {
        configurable: true,
        get() { return _barcode; },
        set(v) { _barcode = v; if (v) document.title = `ГМ | ${v}`; updateTheme(); }
    });
}


let settingsArrowsInited = false;
let arrowsRetryTimeout = null;

function initSettingsArrows() {
    const settingsContainer = document.querySelector('.diman__scanLogSettings__options__container__scrollbar');
    if (!settingsContainer) return;

    if (document.querySelector('.tpi-sort-options-arrow')) {
        updateArrowsState();
        return;
    }

    // Очищаем предыдущий таймаут повторной попытки
    if (arrowsRetryTimeout) clearTimeout(arrowsRetryTimeout);

    const arrowLeft = document.createElement('div');
    arrowLeft.className = 'tpi-sort-options-arrow';
    arrowLeft.setAttribute('data-move', 'left');
    arrowLeft.setAttribute('tpi-sort-current-state', 'hidden');
    arrowLeft.innerHTML = tpi_sort_icon_chevron_left;

    const arrowRight = document.createElement('div');
    arrowRight.className = 'tpi-sort-options-arrow';
    arrowRight.setAttribute('data-move', 'right');
    arrowRight.setAttribute('tpi-sort-current-state', 'hidden');
    arrowRight.innerHTML = tpi_sort_icon_chevron_right;

    settingsContainer.parentElement?.appendChild(arrowLeft);
    settingsContainer.parentElement?.appendChild(arrowRight);

    arrowLeft.addEventListener('click', () => {
        if (arrowLeft.getAttribute('tpi-sort-current-state') === 'hidden') return;
        settingsContainer.scrollLeft -= 180;
    });
    arrowRight.addEventListener('click', () => {
        if (arrowRight.getAttribute('tpi-sort-current-state') === 'hidden') return;
        settingsContainer.scrollLeft += 180;
    });

    settingsContainer.addEventListener('scroll', updateArrowsState);
    window.addEventListener('resize', updateArrowsState);
    settingsArrowsInited = true;

    // Немедленно обновляем состояние стрелок
    updateArrowsState();

    enableHorizontalScrollWithDrag(settingsContainer);

    // Через 2 секунды проверяем, на месте ли стрелки
    arrowsRetryTimeout = setTimeout(() => {
        const leftArrow = document.querySelector('.tpi-sort-options-arrow[data-move="left"]');
        const rightArrow = document.querySelector('.tpi-sort-options-arrow[data-move="right"]');
        if (!leftArrow || !rightArrow) {
            // Если стрелок нет, пробуем вставить снова
            settingsArrowsInited = false;
            initSettingsArrows();
        } else {
            // Если есть, просто обновляем состояние (на случай изменения размеров)
            updateArrowsState();
        }
        arrowsRetryTimeout = null;
    }, 2000);
}

function updateArrowsState() {
    const container = document.querySelector('.diman__scanLogSettings__options__container__scrollbar');
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const leftArrow = document.querySelector('.tpi-sort-options-arrow[data-move="left"]');
    const rightArrow = document.querySelector('.tpi-sort-options-arrow[data-move="right"]');
    if (leftArrow) {
        leftArrow.setAttribute('tpi-sort-current-state', container.scrollLeft <= 2 ? 'hidden' : 'visible');
    }
    if (rightArrow) {
        rightArrow.setAttribute('tpi-sort-current-state', container.scrollLeft >= maxScroll - 2 ? 'hidden' : 'visible');
    }
}

const settingsObserver = new MutationObserver(() => {
    const container = document.querySelector('.diman__scanLogSettings__options__container__scrollbar');
    if (container && !document.querySelector('.tpi-sort-options-arrow')) {
        initSettingsArrows();
    } else if (container) {
        // Если стрелки уже есть, просто обновляем состояние
        updateArrowsState();
    }
});
settingsObserver.observe(document.body, { childList: true, subtree: true });

function enableHorizontalScrollWithDrag(container) {
    if (!container) return;

    const onWheel = (e) => {
        if (e.shiftKey) return;
        e.preventDefault();
        container.scrollLeft += e.deltaY;
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        startScrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        container.scrollLeft = startScrollLeft - dx;
        e.preventDefault();
    };

    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.userSelect = '';
    };

    const onMouseLeave = () => {
        if (isDragging) onMouseUp();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseLeave);

    container.style.cursor = 'grab';

    container._scrollHandlers = { onWheel, onMouseDown, onMouseMove, onMouseUp, onMouseLeave };
}