// This service simulates a backend authentication server.
// In a real application, this logic would live on a Node.js server,
// and the client would interact with it via fetch() calls to API endpoints.

// --- Simulated Database Schema (for LiteSQL/SQLite) ---
//
// CREATE TABLE users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   username TEXT NOT NULL UNIQUE,
//   hashed_password TEXT NOT NULL,
//   salt TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
//
// CREATE TABLE karma (
//    user_id INTEGER,
//    score INTEGER NOT NULL,
//    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    FOREIGN KEY(user_id) REFERENCES users(id)
// );

// --- Utility Functions ---

// Converts a string to an ArrayBuffer
const _textToArrayBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

// Converts an ArrayBuffer to a Base64 string
const _arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// --- Hashing and Salting ---

/**
 * Generates a random salt.
 * @returns {Uint8Array} A 16-byte salt.
 */
const _generateSalt = (): Uint8Array => {
  return window.crypto.getRandomValues(new Uint8Array(16));
};

/**
 * Hashes a password with a given salt using SHA-256.
 * @param {string} password - The password to hash.
 * @param {Uint8Array} salt - The salt to use.
 * @returns {Promise<string>} The Base64 encoded hash.
 */
const _hashPassword = async (password: string, salt: Uint8Array): Promise<string> => {
  const passwordBuffer = _textToArrayBuffer(password);
  // We concatenate salt and password to prevent rainbow table attacks.
  const combinedBuffer = new Uint8Array(salt.length + passwordBuffer.length);
  combinedBuffer.set(salt);
  combinedBuffer.set(passwordBuffer, salt.length);

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', combinedBuffer);
  return _arrayBufferToBase64(hashBuffer);
};

// --- Mock JWT Generation and Verification ---

/**
 * Generates a mock JWT.
 * @param {object} payload - The payload to include in the token.
 * @returns {string} The mock JWT string.
 */
const _generateToken = (payload: object): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  // In a real JWT, this signature would be a crypto hash of the header, payload, and a secret key.
  const mockSignature = btoa('mock-signature');
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

/**
 * Verifies and decodes a mock JWT. Checks for expiration.
 * @param {string} token - The token to verify.
 * @returns {Promise<object | null>} The decoded payload if valid, otherwise null.
 */
export const verifyToken = async (token: string): Promise<object | null> => {
    try {
        const [, payloadB64] = token.split('.');
        if (!payloadB64) return null;

        const payload = JSON.parse(atob(payloadB64));
        // Check if the token has expired (valid for 1 hour).
        const isExpired = Date.now() > payload.exp;
        
        return isExpired ? null : payload;
    } catch (error) {
        console.error("Token verification failed", error);
        return null;
    }
};

// --- Public API ---

/**
 * Registers a new user.
 * @param {string} username - The desired username.
 * @param {string} password - The user's password.
 */
export const signup = async (username: string, password: string): Promise<void> => {
  const users = JSON.parse(localStorage.getItem('mayashakti_users') || '[]');
  const userExists = users.some((u: any) => u.username.toLowerCase() === username.toLowerCase());

  if (userExists) {
    throw new Error('A user with this name already exists.');
  }

  const salt = _generateSalt();
  const hashedPassword = await _hashPassword(password, salt);
  
  // Storing salt as a Base64 string for easier JSON serialization
  const saltB64 = _arrayBufferToBase64(salt);

  users.push({ username, hashedPassword, salt: saltB64 });
  localStorage.setItem('mayashakti_users', JSON.stringify(users));
};

/**
 * Logs in a user.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<{token: string}>} An object containing the JWT.
 */
export const login = async (username: string, password: string): Promise<{ token: string }> => {
  const users = JSON.parse(localStorage.getItem('mayashakti_users') || '[]');
  const user = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    throw new Error('Invalid username or password.');
  }

  // Convert the stored Base64 salt back to an ArrayBuffer
  const saltBytes = Uint8Array.from(atob(user.salt), c => c.charCodeAt(0));
  const hashedPassword = await _hashPassword(password, saltBytes);

  if (hashedPassword !== user.hashedPassword) {
    throw new Error('Invalid username or password.');
  }

  const token = _generateToken({
    username: user.username,
    // Token expires in 1 hour
    exp: Date.now() + 60 * 60 * 1000, 
  });

  return { token };
};