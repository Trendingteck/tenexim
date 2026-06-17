const SESSION_SECRET = process.env.SESSION_SECRET || 'tenexim-sovereign-os-super-secret-key-32-chars-long';

function bufToHex(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = ArrayBuffer.isView(buffer)
        ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
        : new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBuf(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes.buffer;
}

async function getAESKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const pwBytes = encoder.encode(SESSION_SECRET);
    const keyHash = await globalThis.crypto.subtle.digest('SHA-256', pwBytes);
    return await globalThis.crypto.subtle.importKey(
        'raw',
        keyHash,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt a JSON session payload into an AES-256-GCM token (Edge-compatible)
 */
export async function encryptPayload(payload: any, expiryMs: number): Promise<string> {
    const key = await getAESKey();
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    
    const data = JSON.stringify({
        ...payload,
        expiresAt: Date.now() + expiryMs
    });
    const encodedData = new TextEncoder().encode(data);

    const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
    );

    return bufToHex(iv) + ':' + bufToHex(encryptedBuffer);
}

/**
 * Decrypt and validate AES-256-GCM token payload (Edge-compatible)
 */
export async function decryptPayload(token: string): Promise<any | null> {
    try {
        const parts = token.split(':');
        if (parts.length !== 2) return null;

        const ivHex = parts[0];
        const encryptedHex = parts[1];
        if (!ivHex || !encryptedHex) return null;

        const iv = new Uint8Array(hexToBuf(ivHex));
        const encryptedBuffer = hexToBuf(encryptedHex);

        const key = await getAESKey();

        const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encryptedBuffer
        );

        const decryptedText = new TextDecoder().decode(decryptedBuffer);
        const parsed = JSON.parse(decryptedText);

        if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
            return null; // Expired
        }

        return parsed;
    } catch (error) {
        return null; // Decryption failure
    }
}
