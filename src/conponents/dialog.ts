const root = document.getElementById('root')!;

function createLoginDom() {
  const html =
    `<div class="loginDialog">` +
    `<div class="appIcon"></div>` +
    `<div class="input"><input type="text" id="nameInput" placeholder="User Name"></div>` +
    `<div class="input"><input type="password" id="passwordInput" placeholder="Password"></div>` +
    `<div class="buttons"><button type=""button id="loginButton" class="shrinkButton">Log in</button></div>` +
    `<div class="link"><span id="registerLink">create new account?</span></div>` +
    `</div>`;

  root.innerHTML = html;

  const loginButton = document.getElementById('loginButton')!;
  loginButton.onclick = () => {
    const name = (document.getElementById('nameInput') as HTMLInputElement)
      .value;
    const password = (
      document.getElementById('passwordInput') as HTMLInputElement
    ).value;

    const succeed = authApi.login(name, password);
    if (!succeed) {
      console.log('login failed.');
    }
  };

  document.getElementById('registerLink')!.onclick = () => {
    createRegisterDom();
  };

  // todo remove
  (document.getElementById('nameInput') as HTMLInputElement).value = 'Owner';
  (document.getElementById('passwordInput') as HTMLInputElement).value =
    'b2OWNNU|ED9F';
}
