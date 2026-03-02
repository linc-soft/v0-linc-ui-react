import * as React from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// 掩码令牌定义
// ─────────────────────────────────────────────

/** 内置掩码令牌映射表 */
export const DEFAULT_MASK_TOKENS: MaskTokenMap = {
  "#": { pattern: /\d/ },           // 数字
  A: { pattern: /[a-zA-Z]/ },      // 字母
  N: { pattern: /[a-zA-Z0-9]/ },   // 字母或数字
  X: { pattern: /[0-9a-fA-F]/ },   // 十六进制
  "?": { pattern: /\w/ },           // 任意单词字符
}

export interface MaskToken {
  /** 匹配该位置合法字符的正则 */
  pattern: RegExp
  /** 可选：将输入字符转为大写 */
  transform?: (char: string) => string
}

export type MaskTokenMap = Record<string, MaskToken>

// ─────────────────────────────────────────────
// 核心掩码工具函数
// ─────────────────────────────────────────────

/**
 * 判断掩码中某个位置是否为"令牌位"（可变输入区域）
 */
function isTokenPosition(mask: string, index: number, tokens: MaskTokenMap): boolean {
  return mask[index] !== undefined && mask[index] in tokens
}

/**
 * 将原始用户字符序列按掩码格式化为展示字符串。
 *
 * @param rawChars   用户已输入的实际字符数组（不含固定分隔符）
 * @param mask       掩码模式字符串，如 "(###) ###-####"
 * @param tokens     令牌定义映射
 * @param fillChar   填充字符（当 fillMask=true 时使用）
 * @param fillMask   是否启用填充到掩码长度
 * @param reverseFill 是否从右向左填充
 * @returns 格式化后的展示值
 */
function applyMask(
  rawChars: string[],
  mask: string,
  tokens: MaskTokenMap,
  fillChar: string,
  fillMask: boolean,
  reverseFill: boolean,
): string {
  // 统计掩码中令牌位总数
  const tokenPositions: number[] = []
  for (let i = 0; i < mask.length; i++) {
    if (isTokenPosition(mask, i, tokens)) tokenPositions.push(i)
  }

  const totalTokens = tokenPositions.length

  // 处理反向填充：将用户字符右对齐
  let alignedChars: (string | null)[]
  if (reverseFill) {
    alignedChars = Array(totalTokens).fill(null)
    const startIdx = totalTokens - rawChars.length
    rawChars.forEach((ch, i) => {
      const pos = startIdx + i
      if (pos >= 0) alignedChars[pos] = ch
    })
  } else {
    alignedChars = rawChars.slice(0, totalTokens).map((c) => c) as (string | null)[]
    // 若不足则补 null
    while (alignedChars.length < totalTokens) alignedChars.push(null)
  }

  let result = ""
  let tokenIdx = 0

  for (let i = 0; i < mask.length; i++) {
    if (isTokenPosition(mask, i, tokens)) {
      const ch = alignedChars[tokenIdx]
      if (ch !== null && ch !== undefined) {
        result += ch
      } else if (fillMask) {
        result += fillChar.charAt(0) || "_"
      }
      tokenIdx++
    } else {
      // 固定分隔符：仅在有内容填充时展示（或 fillMask 时始终展示）
      const hasMoreInput = reverseFill
        ? alignedChars.some((c) => c !== null)
        : tokenIdx < rawChars.length || (fillMask && tokenIdx < totalTokens)

      if (fillMask || hasMoreInput) {
        result += mask[i]
      }
    }
  }

  return result
}

/**
 * 从格式化值中提取未掩码值（仅用户实际输入字符）
 */
function extractUnmasked(
  maskedValue: string,
  mask: string,
  tokens: MaskTokenMap,
): string {
  let result = ""
  for (let i = 0; i < mask.length && i < maskedValue.length; i++) {
    if (isTokenPosition(mask, i, tokens) && maskedValue[i] !== undefined) {
      result += maskedValue[i]
    }
  }
  return result
}

/**
 * 将用户粘贴或键入的原始文本解析为符合掩码令牌的字符数组
 */
function parseRawInput(
  input: string,
  mask: string,
  tokens: MaskTokenMap,
): string[] {
  const tokenPositions: number[] = []
  for (let i = 0; i < mask.length; i++) {
    if (isTokenPosition(mask, i, tokens)) tokenPositions.push(i)
  }

  const result: string[] = []
  let maskTokenIdx = 0

  for (let i = 0; i < input.length && maskTokenIdx < tokenPositions.length; i++) {
    const ch = input[i]
    const maskPos = tokenPositions[maskTokenIdx]
    const tokenKey = mask[maskPos]
    const token = tokens[tokenKey]

    if (token && token.pattern.test(ch)) {
      result.push(token.transform ? token.transform(ch) : ch)
      maskTokenIdx++
    }
  }
  return result
}

// ─────────────────────────────────────────────
// 光标工具函数
// ─────────────────────────────────────────────

/**
 * 根据当前 rawChars 数量，计算在掩码字符串中的光标位置（下一个令牌位）
 */
function getCursorPosition(
  rawCount: number,
  mask: string,
  tokens: MaskTokenMap,
): number {
  let count = 0
  for (let i = 0; i < mask.length; i++) {
    if (isTokenPosition(mask, i, tokens)) {
      if (count === rawCount) return i
      count++
    }
  }
  return mask.length
}

// ─────────────────────────────────────────────
// TextInput Props
// ─────────────────────────────────────────────

export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange"> {
  /**
   * 掩码模式字符串。
   * 令牌字符（如 `#`、`A`、`N`）为可变输入位，其余字符为固定分隔符。
   * 示例：`"(###) ###-####"` 表示电话号码格式
   */
  mask?: string

  /**
   * 自定义令牌映射，会与内置令牌合并。
   * 可扩展或覆盖内置令牌。
   */
  tokens?: MaskTokenMap

  /**
   * 是否启用填充掩码功能。
   * 启用后，输入内容不足掩码长度时，用 `fillChar` 填充剩余位置。
   * @default false
   */
  fillMask?: boolean

  /**
   * 填充字符，仅在 `fillMask=true` 时生效。
   * @default "_"
   */
  fillChar?: string

  /**
   * 是否启用反向填充掩码功能。
   * 启用后，用户输入从掩码右侧开始填充（右对齐）。
   * 需同时启用 `fillMask`。
   * @default false
   */
  reverseFill?: boolean

  /**
   * 是否绑定未掩码值（纯净值）。
   * 当设为 true 时，`onChange` 回调的第二个参数提供去除掩码后的纯净值。
   * @default false
   */
  unmaskedValue?: boolean

  /**
   * 当前值（受控模式）。
   * 若启用 `unmaskedValue`，此处应传入未掩码值；否则传入掩码格式值。
   */
  value?: string

  /**
   * 默认值（非受控模式）。
   */
  defaultValue?: string

  /**
   * 值变化回调。
   * @param maskedValue   掩码格式的展示值
   * @param unmasked      去除掩码的纯净值（仅在 mask 存在时有意义）
   */
  onValueChange?: (maskedValue: string, unmasked: string) => void

  /** 原生 onChange，兼容表单库（如 react-hook-form） */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

// ─────────────────────────────────────────────
// TextInput 组件
// ─────────────────────────────────────────────

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      mask,
      tokens: customTokens,
      fillMask = false,
      fillChar = "_",
      reverseFill = false,
      unmaskedValue = false,
      value: valueProp,
      defaultValue,
      onValueChange,
      onChange,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    // 合并令牌
    const tokens = React.useMemo<MaskTokenMap>(
      () => ({ ...DEFAULT_MASK_TOKENS, ...customTokens }),
      [customTokens],
    )

    // 内部 rawChars 状态（用户实际输入的有效字符数组）
    const [rawChars, setRawChars] = React.useState<string[]>(() => {
      if (!mask) return []
      const initVal = valueProp ?? defaultValue ?? ""
      // 若 unmaskedValue，initVal 就是纯净值；否则从掩码格式中提取
      if (unmaskedValue) {
        return parseRawInput(initVal, mask, tokens)
      }
      return parseRawInput(extractUnmasked(initVal, mask, tokens), mask, tokens)
    })

    // 是否受控
    const isControlled = valueProp !== undefined
    const inputRef = React.useRef<HTMLInputElement>(null)
    const composedRef = useComposedRef(ref, inputRef)

    // 计算当前掩码展示值
    const maskedDisplay = React.useMemo(() => {
      if (!mask) return rawChars.join("")
      return applyMask(rawChars, mask, tokens, fillChar, fillMask, reverseFill)
    }, [mask, rawChars, tokens, fillChar, fillMask, reverseFill])

    // 计算未掩码值
    const unmasked = React.useMemo(() => {
      if (!mask) return maskedDisplay
      return rawChars.join("")
    }, [mask, rawChars, maskedDisplay])

    // 受控模式：外部 value 变化时同步 rawChars
    React.useEffect(() => {
      if (!isControlled || !mask) return
      const newRaw = unmaskedValue
        ? parseRawInput(valueProp!, mask, tokens)
        : parseRawInput(extractUnmasked(valueProp!, mask, tokens), mask, tokens)
      // 仅在内容确实不同时更新，避免光标抖动
      if (newRaw.join("") !== rawChars.join("")) {
        setRawChars(newRaw)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueProp, mask, unmaskedValue])

    // 处理 input onChange
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!mask) {
          // 无掩码：普通输入框行为
          onChange?.(e)
          onValueChange?.(e.target.value, e.target.value)
          return
        }

        const input = e.target.value
        const newRaw = parseRawInput(input, mask, tokens)

        if (!isControlled) {
          setRawChars(newRaw)
        }

        const newMasked = applyMask(newRaw, mask, tokens, fillChar, fillMask, reverseFill)
        const newUnmasked = newRaw.join("")

        // 触发回调
        onValueChange?.(newMasked, newUnmasked)

        // 构造合成事件供表单库使用
        if (onChange) {
          const syntheticEvent = Object.assign({}, e, {
            target: Object.assign({}, e.target, {
              value: unmaskedValue ? newUnmasked : newMasked,
            }),
          }) as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }

        // 延迟设置光标位置
        requestAnimationFrame(() => {
          if (inputRef.current) {
            const cursorPos = getCursorPosition(newRaw.length, mask, tokens)
            inputRef.current.setSelectionRange(cursorPos, cursorPos)
          }
        })
      },
      [mask, tokens, isControlled, fillChar, fillMask, reverseFill, unmaskedValue, onChange, onValueChange],
    )

    // 处理 Backspace / Delete 键以精准删除掩码中的用户字符
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e)
        if (!mask) return

        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault()

          if (e.key === "Backspace") {
            const newRaw = rawChars.slice(0, -1)
            if (!isControlled) setRawChars(newRaw)

            const newMasked = applyMask(newRaw, mask, tokens, fillChar, fillMask, reverseFill)
            const newUnmasked = newRaw.join("")
            onValueChange?.(newMasked, newUnmasked)

            if (onChange && inputRef.current) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value",
              )?.set
              nativeInputValueSetter?.call(inputRef.current, unmaskedValue ? newUnmasked : newMasked)
              inputRef.current.dispatchEvent(new Event("input", { bubbles: true }))
            }

            requestAnimationFrame(() => {
              if (inputRef.current) {
                const cursorPos = getCursorPosition(newRaw.length, mask, tokens)
                inputRef.current.setSelectionRange(cursorPos, cursorPos)
              }
            })
          }
        }
      },
      [mask, tokens, rawChars, isControlled, fillChar, fillMask, reverseFill, unmaskedValue, onChange, onValueChange, onKeyDown],
    )

    // 无掩码：降级为标准 Input
    if (!mask) {
      return (
        <input
          ref={composedRef}
          data-slot="input"
          className={cn(inputBaseClass, className)}
          value={valueProp}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          {...props}
        />
      )
    }

    return (
      <input
        ref={composedRef}
        data-slot="input"
        data-mask={mask}
        className={cn(inputBaseClass, className)}
        value={maskedDisplay}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)

TextInput.displayName = "TextInput"

// ─────────────────────────────────────────────
// 样式常量
// ─────────────────────────────────────────────

const inputBaseClass = [
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
  "dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
  "transition-[color,box-shadow] outline-none",
  "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
].join(" ")

// ─────────────────────────────────────────────
// 辅助 Hook：合并多个 ref
// ─────────────────────────────────────────────

function useComposedRef<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return React.useCallback(
    (node: T) => {
      refs.forEach((ref) => {
        if (!ref) return
        if (typeof ref === "function") {
          ref(node)
        } else {
          ;(ref as React.MutableRefObject<T>).current = node
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )
}

export { TextInput }
