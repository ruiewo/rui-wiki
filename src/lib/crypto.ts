type CryptoState = {
  salt: Uint8Array;
  iv: Uint8Array;
};

declare global {
  interface Window {
    ruiwiki: {
      cryptoState?: CryptoState;
    };
  }
}

type Crypto = {
  encrypt: (text: string) => Promise<string>;
  decrypt: (text: string) => Promise<string>;
};

let crypto: Crypto | null = null;

function update(key?: CryptoKey, salt?: Uint8Array, iv?: Uint8Array) {
  if (!key || !salt || !iv) {
    window.ruiwiki.cryptoState = undefined;

    crypto = {
      encrypt: async (text: string) => text,
      decrypt: async (text: string) => text,
    };
    return;
  }

  window.ruiwiki.cryptoState = { salt, iv };

  crypto = {
    encrypt: (text: string) => encrypt(text, key, iv),
    decrypt: (text: string) => decrypt(text, key, iv),
  };
}

export const Crypto = {
  isEncrypted: () => !!window.ruiwiki.cryptoState,
  initialize: async (password?: string) => {
    if (!window.ruiwiki.cryptoState) {
      update();
      return;
    }

    if (!password) throw new Error("No password");
    const { salt, iv } = window.ruiwiki.cryptoState;
    const { key } = await generateKey(password, salt);

    update(key, salt, iv);
  },
  changePassword: async (password: string) => {
    if (!password) {
      update();
      return;
    }

    const { key, salt } = await generateKey(password);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    update(key, salt, iv);
  },
  encrypt: (text: string) => {
    if (crypto == null) throw new Error("not initialized");
    return crypto.encrypt(text);
  },
  decrypt: (text: string) => {
    if (crypto == null) throw new Error("not initialized");
    return crypto.decrypt(text);
  },
};

async function encrypt(text: string, key: CryptoKey, iv: Uint8Array) {
  const encoded = new TextEncoder().encode(text);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return new TextDecoder().decode(encrypted);
}

async function decrypt(text: string, key: CryptoKey, iv: Uint8Array) {
  const encoded = new TextEncoder().encode(text);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
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
  const digest = await window.crypto.subtle.digest("SHA-256", passPhrase);
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    digest,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return { key, salt };
}
