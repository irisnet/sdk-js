// Generated by https://quicktype.io

export interface Keystore {
    version: number;
    id:      string;
    address: string;
    crypto:  Crypto;
}

export interface Crypto {
    ciphertext:   string;
    cipherparams: Cipherparams;
    cipher:       string;
    kdf:          string;
    kdfparams:    Kdfparams;
    mac:          string;
}

export interface Cipherparams {
    iv: string;
}

export interface Kdfparams {
    dklen: number;
    salt:  string;
    c:     number;
    prf:   string;
}
