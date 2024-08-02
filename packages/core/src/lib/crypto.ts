import { EncryptParams } from './store';

type Crypto = {
  encrypt: (text: string) => Promise<string>;
  decrypt: (text: string) => Promise<string>;
};

export const crypto: Crypto = {
  encrypt: async (text: string) => text,
  decrypt: async (text: string) => text,
};

export async function checkPassword(
  password: string,
  params: EncryptParams
): Promise<Crypto | null> {
  const salt = fromBase64(params.salt);
  const iv = fromBase64(params.iv);

  const { key } = await generateKey(password, salt);
  const decrypted = await decrypt(params.fragment, key, iv);

  const succeed = decrypted === params.salt + params.iv;
  if (succeed) {
    return {
      encrypt: (text: string) => encrypt(text, key, iv),
      decrypt: (text: string) => decrypt(text, key, iv),
    };
  }

  return null;
}

export async function updatePassword(password: string) {
  const { key, salt } = await generateKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const crypto = {
    encrypt: (text: string) => encrypt(text, key, iv),
    decrypt: (text: string) => decrypt(text, key, iv),
  };

  const saltStr = toBase64(salt);
  const ivStr = toBase64(iv);

  const encryptParams = {
    salt: saltStr,
    iv: ivStr,
    fragment: await crypto.encrypt(saltStr + ivStr),
  };

  return { crypto, encryptParams };
}

async function encrypt(text: string, key: CryptoKey, iv: Uint8Array) {
  const encoded = new TextEncoder().encode(text);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  return toBase64(encrypted);
}

async function decrypt(base64: string, key: CryptoKey, iv: Uint8Array) {
  const encoded = fromBase64(base64);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  return new TextDecoder().decode(decrypted);
}

async function generateKey(
  password: string,
  salt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16))
) {
  const passPhrase = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', passPhrase);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
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
    ['encrypt', 'decrypt']
  );

  return { key, salt };
}

function toBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}
