const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEY_PATH = process.env.KEY_PATH || path.join(__dirname, '.encryption_key');
const ALGORITHM = 'aes-256-cbc';

// 确保加密密钥存在
function ensureEncryptionKey() {
  try {
    if (!fs.existsSync(KEY_PATH)) {
      // 生成随机密钥并保存
      const key = crypto.randomBytes(32).toString('hex');
      fs.writeFileSync(KEY_PATH, key, { mode: 0o600 }); // 仅所有者可读写
      return key;
    } else {
      // 读取现有密钥
      return fs.readFileSync(KEY_PATH, 'utf8');
    }
  } catch (error) {
    console.error('Error managing encryption key:', error);
    throw new Error('Failed to ensure encryption key');
  }
}

// 加密文本
function encrypt(text) {
  try {
    const key = Buffer.from(ensureEncryptionKey(), 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // 将IV和加密后的文本一起存储
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// 解密文本
function decrypt(encryptedText) {
  try {
    const key = Buffer.from(ensureEncryptionKey(), 'hex');
    
    // 分离IV和加密后的文本
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

module.exports = {
  encrypt,
  decrypt
};