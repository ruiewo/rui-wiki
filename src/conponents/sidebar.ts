export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

function createLayout() {
  const html =
    '<div id="container">' +
    '<div id="contents">' +
    '</div>' +
    '<div id="sidebar">' +
    '</div>' +
    '</div>';
  const layout = document.createElement('div');
  layout.id = 'layout';
  document.body.appendChild(layout);
  return layout;
}

function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  sidebar.innerHTML =
    '<h1>RuiWiki</h1>' + '<button id="sidebar-button">count is 0</button>';

  document.body.appendChild(sidebar);
  return sidebar;
}
