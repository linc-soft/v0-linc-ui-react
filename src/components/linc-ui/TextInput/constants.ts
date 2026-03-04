/**
 * TextInput 组件常量定义
 */

import type { MaskTokenMap } from "./types"

/** 内置掩码令牌映射表 */
export const DEFAULT_MASK_TOKENS: MaskTokenMap = {
  "#": { pattern: /\d/ },
  A: { pattern: /[a-zA-Z]/ },
  W: { pattern: /[a-zA-Z0-9]/ },
}
