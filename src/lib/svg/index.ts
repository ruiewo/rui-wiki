/** svgは512*512固定 */
export function createSvgSymbols() {
  const symbols = Object.entries({
    editSvg,
    addSvg,
    closeSvg,
    deleteSvg,
    downloadSvg,
    saveSvg,
    save2Svg,
    settingSvg,
  })
    .map(
      ([id, svg]) => `<symbol id="${id}" viewBox="0 0 512 512">${svg}</symbol>`
    )
    .join("");

  document.body.insertAdjacentHTML(
    "beforeend",
    `<svg aria-hidden="true" style="display: none;"><defs>${symbols}</defs></svg>`
  );
}

const editSvg =
  `<path d="M422.002,6.017C315.33,20.736,213.205,220.861,162.939,313.486c-12.641,23.297,9.422,35.406,22.422,13.125 c9.344-16.016,32.109-62.5,44.422-60.094c58.797,9.797,90.156-28.547,67.891-52.672c74.797,1.531,111.875-39.609,90.656-64.609 c22.313,7.063,55.078,6.031,83.766-9.609C533.33,106.22,529.627-8.827,422.002,6.017z"></path>` +
  `<path d="M409.189,207.048c-9.719,9.141-27.031,22.141-41.547,27.813v207.062c-0.016,4.609-1.781,8.531-4.781,11.563 c-3.031,3-6.953,4.766-11.547,4.781H65.361c-4.594-0.016-8.531-1.781-11.563-4.781c-3-3.031-4.766-6.953-4.781-11.563V155.986 c0.016-4.594,1.781-8.531,4.781-11.563c3.031-3,6.969-4.766,11.563-4.781h160.391c11.234-17.125,22.734-33.578,34.484-49.016	H65.361c-17.969-0.016-34.469,7.344-46.219,19.141c-11.781,11.75-19.156,28.25-19.141,46.219v285.937 c-0.016,17.969,7.359,34.469,19.141,46.234c11.75,11.781,28.25,19.156,46.219,19.141h285.953 c17.953,0.016,34.453-7.359,46.219-19.141c11.781-11.766,19.156-28.266,19.141-46.234V206.017 C416.674,206.017,414.002,202.517,409.189,207.048z"></path>`;

const addSvg =
  `<path d="M359.244,224.004h-59.988c-6.217,0-11.258-5.043-11.258-11.258v-59.992c0-6.215-5.039-11.254-11.256-11.254 h-41.486c-6.217,0-11.258,5.039-11.258,11.254v59.992c0,6.215-5.039,11.258-11.256,11.258h-59.988 c-6.219,0-11.258,5.039-11.258,11.258v41.484c0,6.215,5.039,11.258,11.258,11.258h59.988c6.217,0,11.256,5.039,11.256,11.258 v59.984c0,6.219,5.041,11.258,11.258,11.258h41.486c6.217,0,11.256-5.039,11.256-11.258v-59.984 c0-6.219,5.041-11.258,11.258-11.258h59.988c6.217,0,11.258-5.043,11.258-11.258v-41.484 C370.502,229.043,365.461,224.004,359.244,224.004z"></path>` +
  `<path d="M256,0C114.613,0,0,114.617,0,256c0,141.387,114.613,256,256,256c141.383,0,256-114.613,256-256 C512,114.617,397.383,0,256,0z M256,448c-105.871,0-192-86.129-192-192c0-105.867,86.129-192,192-192c105.867,0,192,86.133,192,192 C448,361.871,361.867,448,256,448z"></path>`;

const closeSvg = `<polygon points="511.998,70.682 441.315,0 256.002,185.313 70.685,0 0.002,70.692 185.316,256.006 0.002,441.318 70.69,512 256.002,326.688 441.315,512 511.998,441.318 326.684,256.006"></polygon>`;

const deleteSvg =
  `<path d="M88.594,464.731C90.958,491.486,113.368,512,140.234,512h231.523c26.858,0,49.276-20.514,51.641-47.269 l25.642-335.928H62.952L88.594,464.731z M329.183,221.836c0.357-5.876,5.4-10.349,11.277-9.992 c5.877,0.357,10.342,5.409,9.993,11.277l-10.129,202.234c-0.357,5.876-5.4,10.342-11.278,9.984 c-5.876-0.349-10.349-5.4-9.992-11.269L329.183,221.836z M245.344,222.474c0-5.885,4.772-10.648,10.657-10.648 c5.885,0,10.656,4.763,10.656,10.648v202.242c0,5.885-4.771,10.648-10.656,10.648c-5.885,0-10.657-4.763-10.657-10.648V222.474z M171.531,211.844c5.876-0.357,10.92,4.116,11.278,9.992l10.137,202.234c0.357,5.869-4.116,10.92-9.992,11.269 c-5.869,0.357-10.921-4.108-11.278-9.984l-10.137-202.234C161.182,217.253,165.654,212.201,171.531,211.844z"></path>` +
  `<path d="M439.115,64.517c0,0-34.078-5.664-43.34-8.479c-8.301-2.526-80.795-13.566-80.795-13.566l-2.722-19.297 C310.388,9.857,299.484,0,286.642,0h-30.651H225.34c-12.825,0-23.728,9.857-25.616,23.175l-2.721,19.297 c0,0-72.469,11.039-80.778,13.566c-9.261,2.815-43.357,8.479-43.357,8.479C62.544,67.365,55.332,77.172,55.332,88.38v21.926h200.66 h200.676V88.38C456.668,77.172,449.456,67.365,439.115,64.517z M276.318,38.824h-40.636c-3.606,0-6.532-2.925-6.532-6.532 s2.926-6.532,6.532-6.532h40.636c3.606,0,6.532,2.925,6.532,6.532S279.924,38.824,276.318,38.824z"></path>`;

const downloadSvg =
  `<path class="st0" d="M243.591,309.362c3.272,4.317,7.678,6.692,12.409,6.692c4.73,0,9.136-2.376,12.409-6.689l89.594-118.094 c3.348-4.414,4.274-8.692,2.611-12.042c-1.666-3.35-5.631-5.198-11.168-5.198H315.14c-9.288,0-16.844-7.554-16.844-16.84V59.777 c0-11.04-8.983-20.027-20.024-20.027h-44.546c-11.04,0-20.022,8.987-20.022,20.027v97.415c0,9.286-7.556,16.84-16.844,16.84 h-34.305c-5.538,0-9.503,1.848-11.168,5.198c-1.665,3.35-0.738,7.628,2.609,12.046L243.591,309.362z"></path>` +
  `<path class="st0" d="M445.218,294.16v111.304H66.782V294.16H0v152.648c0,14.03,11.413,25.443,25.441,25.443h461.118 c14.028,0,25.441-11.413,25.441-25.443V294.16H445.218z"></path>`;

const saveSvg =
  `<polygon points="335.644,414.285 53.466,414.285 53.466,132.107 291.098,132.107 344.564,78.64 0,78.64 0,467.751 389.106,467.751 389.106,441.018 389.106,323.746 335.644,377.213"></polygon>` +
  `<polygon points="158.903,163.312 103.914,218.311 193.434,307.822 248.423,362.82 303.412,307.822 512,99.247 457.002,44.249 248.431,252.823"></polygon>`;

const save2Svg =
  `<path d="M502.394,106.098L396.296,0h-15.162v121.49H130.866V0H60.27C26.987,0,0,26.987,0,60.271v391.458 C0,485.013,26.987,512,60.27,512h391.459C485.014,512,512,485.013,512,451.729V129.286 C512,120.591,508.542,112.256,502.394,106.098z M408.39,428.121H103.609V216.944H408.39V428.121z"></path>` +
  `<rect x="282.012" width="68.027" height="94.015"></rect>`;

const settingSvg = `<path d="M496,293.984c9.031-0.703,16-8.25,16-17.297v-41.375c0-9.063-6.969-16.594-16-17.313l-54.828-4.281 c-3.484-0.266-6.484-2.453-7.828-5.688l-18.031-43.516c-1.344-3.219-0.781-6.906,1.5-9.547l35.75-41.813 c5.875-6.891,5.5-17.141-0.922-23.547l-29.25-29.25c-6.406-6.406-16.672-6.813-23.547-0.922l-41.813,35.75 c-2.641,2.266-6.344,2.844-9.547,1.516l-43.531-18.047c-3.219-1.328-5.422-4.375-5.703-7.828l-4.266-54.813 C293.281,6.969,285.75,0,276.688,0h-41.375c-9.063,0-16.594,6.969-17.297,16.016l-4.281,54.813c-0.266,3.469-2.469,6.5-5.688,7.828 l-43.531,18.047c-3.219,1.328-6.906,0.75-9.563-1.516l-41.797-35.75c-6.875-5.891-17.125-5.484-23.547,0.922l-29.25,29.25 c-6.406,6.406-6.797,16.656-0.922,23.547l35.75,41.813c2.25,2.641,2.844,6.328,1.5,9.547l-18.031,43.516 c-1.313,3.234-4.359,5.422-7.813,5.688L16,218c-9.031,0.719-16,8.25-16,17.313v41.359c0,9.063,6.969,16.609,16,17.313l54.844,4.266 c3.453,0.281,6.5,2.484,7.813,5.703l18.031,43.516c1.344,3.219,0.75,6.922-1.5,9.563l-35.75,41.813 c-5.875,6.875-5.484,17.125,0.922,23.547l29.25,29.25c6.422,6.406,16.672,6.797,23.547,0.906l41.797-35.75 c2.656-2.25,6.344-2.844,9.563-1.5l43.531,18.031c3.219,1.344,5.422,4.359,5.688,7.844l4.281,54.813 c0.703,9.031,8.234,16.016,17.297,16.016h41.375c9.063,0,16.594-6.984,17.297-16.016l4.266-54.813 c0.281-3.484,2.484-6.5,5.703-7.844l43.531-18.031c3.203-1.344,6.922-0.75,9.547,1.5l41.813,35.75 c6.875,5.891,17.141,5.5,23.547-0.906l29.25-29.25c6.422-6.422,6.797-16.672,0.922-23.547l-35.75-41.813 c-2.25-2.641-2.844-6.344-1.5-9.563l18.031-43.516c1.344-3.219,4.344-5.422,7.828-5.703L496,293.984z M256,342.516 c-23.109,0-44.844-9-61.188-25.328c-16.344-16.359-25.344-38.078-25.344-61.203c0-23.109,9-44.844,25.344-61.172 c16.344-16.359,38.078-25.344,61.188-25.344c23.125,0,44.844,8.984,61.188,25.344c16.344,16.328,25.344,38.063,25.344,61.172 c0,23.125-9,44.844-25.344,61.203C300.844,333.516,279.125,342.516,256,342.516z"></path>`;
