// let password: string | null = null;

import { store } from './store';

// function setPassword(password: string) {
//   return password;
// }

// function init() {
//   if (!window.isSecureContext) {
//     throw new Error('Not Secure');
//   }

//   window.SubtleCrypto;

//   return {
//     encrypt: '',
//     decrypt: '',
//   };
// }

// export const crypto = {};

/*
  Store the calculated ciphertext and IV here, so we can decrypt the message later.
  */
let cipherText: ArrayBuffer;
let iv: Uint8Array;

/*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
function getMessageEncoding() {
  const message = store.sample;
  let enc = new TextEncoder();
  return enc.encode(message);
}

/*
  Get the encoded message, encrypt it and display a representation
  of the ciphertext in the "Ciphertext" element.
  */
async function encryptMessage(key: CryptoKey) {
  const encoded = getMessageEncoding();

  // The iv must never be reused with a given key.
  iv = window.crypto.getRandomValues(new Uint8Array(12));
  cipherText = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded,
  );

  const buffer = new Uint8Array(cipherText, 0, 5);
  const cipherTextValue = document.querySelector('.aes-gcm .ciphertext-value')!;
  cipherTextValue.classList.add('fade-in');
  cipherTextValue.addEventListener('animationend', () => {
    cipherTextValue.classList.remove('fade-in');
  });
  cipherTextValue.textContent = `${buffer}...[${cipherText.byteLength} bytes total]`;
}

/*
  Fetch the ciphertext and decrypt it.
  Write the decrypted message into the "Decrypted" box.
  */
async function decryptMessage(key: CryptoKey) {
  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    cipherText,
  );

  let dec = new TextDecoder();
  const decryptedValue = document.querySelector('.aes-gcm .decrypted-value')!;
  decryptedValue.classList.add('fade-in');
  decryptedValue.addEventListener('animationend', () => {
    decryptedValue.classList.remove('fade-in');
  });
  decryptedValue.textContent = dec.decode(decrypted);
}

/*
  Generate an encryption key, then set up event listeners
  on the "Encrypt" and "Decrypt" buttons.
  */
window.crypto.subtle
  .generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  )
  .then((key) => {
    const encryptButton = document.querySelector('.aes-gcm .encrypt-button');
    encryptButton.addEventListener('click', () => {
      encryptMessage(key);
    });

    const decryptButton = document.querySelector('.aes-gcm .decrypt-button');
    decryptButton.addEventListener('click', () => {
      decryptMessage(key);
    });
  });

async function generateKey(
  password: string,
  salt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16)),
) {
  const passPhrase = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', passPhrase);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  return { key, salt };
}

function encrypt(text: string) {
  //
}

type CryptoState = {
  salt: string;
  iv: Uint8Array;
};
function getCryptoState() {
  return { salt: 'salt', iv: 'iv' };
}

function saveCryptoState(state: CryptoState) {
  const stateStr = JSON.stringify(state);

  const html = `<input type="text" id="crypto-state" value=${stateStr} />`;
  return stateStr;
}

function isEncrypted() {
  return !!window.ruiwiki.cryptoState;
}
async function init(password: string) {
  if (isEncrypted()) {
    // show dialog
    const password = prompt('Enter password');
  }
  const { key, salt } = await generateKey(password);
}
declare global {
  interface Window {
    ruiwiki: {
      cryptoState?: CryptoState;
    };
  }
}

export const crypto = {
  isEncrypted: () => {
    const state = window.ruiwiki.cryptoState;
    return state.salt && state.iv;
  },
};

const hoge = (() => {})();
