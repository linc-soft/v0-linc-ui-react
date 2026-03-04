import type { ByteEncoding } from '@/components/linc-ui/TextInput/types'

/**
 * 计算字符串的字节长度
 * @param str 输入字符串
 * @param encoding 编码格式，默认 utf-8
 */
export function getByteLength(
  str: string,
  encoding: ByteEncoding = 'utf-8',
): number {
  if (encoding === 'utf-8') {
    return new TextEncoder().encode(str).length
  }

  // Shift-JIS 和 GBK：ASCII 1字节，其他字符 2字节
  // 注意：这是简化实现，对于大多数字符是准确的
  let byteLength = 0
  for (const char of str) {
    const codePoint = char.codePointAt(0) ?? 0
    if (codePoint <= 0x7f) {
      // ASCII 字符
      byteLength += 1
    } else {
      // 非 ASCII 字符（中文、日文等）
      byteLength += 2
    }
  }
  return byteLength
}

/**
 * 根据最大字节数截取字符串
 * @param str 输入字符串
 * @param maxBytes 最大字节数
 * @param encoding 编码格式，默认 utf-8
 * @returns 不超过指定字节数的最长子串
 */
export function truncateByBytes(
  str: string,
  maxBytes: number,
  encoding: ByteEncoding = 'utf-8',
): string {
  let result = ''
  let currentBytes = 0

  for (const char of str) {
    const charBytes = getByteLength(char, encoding)
    if (currentBytes + charBytes > maxBytes) {
      break
    }
    result += char
    currentBytes += charBytes
  }

  return result
}
