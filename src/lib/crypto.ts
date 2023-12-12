import { assertExist } from "./util";

type Crypto = {
  encrypt: (text: string) => Promise<string>;
  decrypt: (text: string) => Promise<string>;
};

let crypto: Crypto = {
  encrypt: async (text: string) => text,
  decrypt: async (text: string) => text,
};

export class CryptoService {
  static salt?: string;
  static iv?: string;

  static async initialize(salt?: string, iv?: string) {
    CryptoService.salt = salt;
    CryptoService.iv = iv;
  }

  static async checkPassword(password: string, encrypted: string) {
    assertExist(CryptoService.salt);
    assertExist(CryptoService.iv);

    const encoder = new TextEncoder();
    const salt = encoder.encode(CryptoService.salt);
    const iv = encoder.encode(CryptoService.iv);

    const { key } = await generateKey(password, salt);
    const decrypted = await decrypt(encrypted, key, iv);

    const succeed = decrypted === CryptoService.salt + CryptoService.iv;
    if (succeed) {
      crypto = {
        encrypt: (text: string) => encrypt(text, key, iv),
        decrypt: (text: string) => decrypt(text, key, iv),
      };
    }

    return succeed;
  }

  static async updatePassword(password: string) {
    const { key, salt } = await generateKey(password);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    crypto = {
      encrypt: (text: string) => encrypt(text, key, iv),
      decrypt: (text: string) => decrypt(text, key, iv),
    };

    const decoder = new TextDecoder();
    CryptoService.salt = decoder.decode(salt);
    CryptoService.iv = decoder.decode(iv);
  }

  static encrypt(text: string) {
    return crypto.encrypt(text);
  }
  static decrypt(text: string) {
    return crypto.decrypt(text);
  }
}

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
