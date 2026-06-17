import crypto from 'node:crypto';

/**
 * Generates an ultra-secure password digest using standard PBKDF2 (SHA-512)
 * matching existing database parameters to maintain zero-downtime backwards compatibility.
 */
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

/**
 * Validates a plaintext password against a stored PBKDF2 shadow hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}
