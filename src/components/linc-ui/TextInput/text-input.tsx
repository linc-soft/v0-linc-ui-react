import * as React from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// 掩码令牌定义
// ─────────────────────────────────────────────

/** 内置掩码令牌映射表 */
export const DEFAULT_MASK_TOKENS: MaskTokenMap = {
  "#": { pattern: /\d/ },
  A: { pattern: /[a-zA-Z]/ },
  W: { pattern: /[a-zA-Z0-9]/ },
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

/**
 * 字节编码格式类型
 * - utf-8: UTF-8 编码（默认），ASCII 1字节，中文/日文 3字节
 * - shift-jis: Shift-JIS 编码（日文），ASCII 1字节，日文假名/汉字 2字节
 * - gbk: GBK 编码（中文），ASCII 1字节，中文 2字节
 */
export type ByteEncoding = "utf-8" | "shift-jis" | "gbk"

/**
 * 计算字符串的字节长度
 * @param str 输入字符串
 * @param encoding 编码格式，默认 utf-8
 */
function getByteLength(str: string, encoding: ByteEncoding = "utf-8"): number {
  if (encoding === "utf-8") {
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
function truncateByBytes(str: string, maxBytes: number, encoding: ByteEncoding = "utf-8"): string {
  let result = ""
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

// ─────────────────────────────────────────────
// TextInput Props
// ─────────────────────────────────────────────

/**
 * 校验规则函数类型
 * @param value 当前输入值
 * @returns true 表示验证通过，string 表示错误消息
 */
export type ValidationRule = (value: string) => boolean | string

/**
 * 验证触发模式
 * - true: 仅在首次失焦后触发验证
 * - 'ondemand': 仅在手动调用 validate() 时触发验证
 * - false: 每次值变化时都触发验证（默认）
 */
export type LazyRules = boolean | "ondemand"

/**
 * Label类型
 * - inner: 输入框获得焦点后，会在输入字段上方"浮动"显示的文本标签
 * - left: 固定显示在TextInput的左侧，Label和Input间无间距
 * - top: 固定显示在TextInput的上方，Label和Input间无间距
 */
export type LabelType = "inner" | "left" | "top"

/**
 * TextInput 组件暴露的实例方法
 */
export interface TextInputRef {
  /** 手动触发验证，返回验证结果 */
  validate: () => boolean
  /** 重置验证状态 */
  resetValidation: () => void
  /** 获取当前输入值 */
  getValue: () => string
}

export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "prefix"> {
  /**
   * 掩码模式字符串。
   * 令牌字符（如 `#`、`A`、`W`）为可变输入位，其余字符为固定分隔符。
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

  // ─────────────────────────────────────────────
  // 验证相关属性
  // ─────────────────────────────────────────────

  /**
   * 校验规则数组。
   * 每个规则是一个函数，返回 true 表示通过，返回 string 表示错误消息。
   */
  rules?: ValidationRule[]

  /**
   * 外部控制的错误状态。
   * 设置为 true 时显示错误样式。
   */
  error?: boolean

  /**
   * 错误提示信息。
   * 仅在 error 为 true 时显示。
   */
  errorMessage?: string

  /**
   * 是否隐藏默认的错误提示图标。
   * @default false
   */
  noErrorIcon?: boolean

  /**
   * 辅助说明文本，显示在输入框下方。
   * 当出现 error-message 时自动隐藏。
   */
  hint?: string

  /**
   * 验证触发模式。
   * - true: 仅在首次失焦后触发验证
   * - 'ondemand': 仅在手动调用 validate() 时触发验证
   * - false: 每次值变化时都触发验证（默认）
   * @default false
   */
  lazyRules?: LazyRules

  // ─────────────────────────────────────────────
  // Label相关属性
  // ─────────────────────────────────────────────

  /**
   * 标签文本内容
   */
  label?: string

  /**
   * 标签类型
   * - inner: 浮动标签，输入框获得焦点或有值时，会在输入字段上方"浮动"显示
   * - left: 固定显示在TextInput的左侧，Label和Input间无间距
   * - top: 固定显示在TextInput的上方，Label和Input间无间距
   * @default "top"
   */
  labelType?: LabelType

  /**
   * 标签宽度。
   * 仅在 labelType="left" 时生效，其他类型下此设置将被忽略。
   * 可以是数字（转为px）或字符串（如 "100px"、"10rem" 等）。
   * @default auto（根据内容自动调整）
   */
  labelWidth?: number | string

  /**
   * 标签文字对齐方式。
   * 仅在 labelType="left" 时生效，其他类型下此设置将被忽略。
   * - left: 居左对齐（默认）
   * - right: 居右对齐
   * - center: 居中对齐
   * - justify: 分散对齐
   * @default "left"
   */
  labelAlign?: "left" | "right" | "center" | "justify"

  // ─────────────────────────────────────────────
  // 前缀/后缀相关属性
  // ─────────────────────────────────────────────

  /**
   * 输入框内部前缀内容。
   * 显示在输入框内部左侧，通常用于货币符号、单位等。
   */
  prefix?: React.ReactNode

  /**
   * 输入框内部后缀内容。
   * 显示在输入框内部右侧，通常用于单位、图标等。
   */
  suffix?: React.ReactNode

  // ─────────────────────────────────────────────
  // 插槽相关属性
  // ─────────────────────────────────────────────

  /**
   * 输入框外部前置插槽。
   * 显示在输入框外部左侧，通常用于按钮、选择器等。
   */
  before?: React.ReactNode

  /**
   * 输入框外部后置插槽。
   * 显示在输入框外部右侧，通常用于按钮、单位选择器等。
   */
  append?: React.ReactNode

  // ─────────────────────────────────────────────
  // 长度限制相关属性
  // ─────────────────────────────────────────────

  /**
   * 最大字符数限制。
   * 限制输入内容的最大字符数（按字符计算，非字节）。
   */
  maxlength?: number

  /**
   * 最大字节数限制。
   * 限制输入内容的最大字节数（中文等字符按2-4字节计算）。
   * 配合 encoding 属性指定编码格式。
   */
  maxlengthB?: number

  /**
   * 字节编码格式，用于 maxlengthB 计算。
   * - utf-8: UTF-8 编码（默认），ASCII 1字节，中文/日文 3字节
   * - shift-jis: Shift-JIS 编码（日文），ASCII 1字节，日文假名/汉字 2字节
   * - gbk: GBK 编码（中文），ASCII 1字节，中文 2字节
   * @default "utf-8"
   */
  encoding?: ByteEncoding

  // ─────────────────────────────────────────────
  // 颜色相关属性
  // ─────────────────────────────────────────────

  /**
   * 主题颜色。
   * 用于控件获得焦点时的边框颜色，以及 Label（labelType 为 inner 或 top 时）的文字颜色。
   * 支持任意 CSS 颜色值（如 "#3b82f6"、"rgb(59,130,246)"、"blue"）。
   */
  color?: string

  /**
   * 输入框背景色。
   * 支持任意 CSS 颜色值。
   */
  bgColor?: string

  /**
   * Label 背景色。
   * 仅在 labelType="left" 时生效，其他类型下此设置将被忽略。
   * 支持任意 CSS 颜色值。
   */
  labelColor?: string
}

// ─────────────────────────────────────────────
// TextInput 组件
// ─────────────────────────────────────────────

const TextInput = React.forwardRef<TextInputRef, TextInputProps>(
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
      // 验证相关属性
      rules,
      error: errorProp,
      errorMessage: errorMessageProp,
      noErrorIcon = false,
      hint,
      lazyRules = false,
      // Label相关属性
      label,
      labelType = "inner",
      labelWidth,
      labelAlign = "left",
      // 前缀/后缀相关属性
      prefix,
      suffix,
      // 插槽相关属性
      before,
      append,
      // 长度限制相关属性
      maxlength,
      maxlengthB,
      encoding = "utf-8",
      // 颜色相关属性
      color,
      bgColor,
      labelColor,
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

    // ─────────────────────────────────────────────
    // Focus状态（用于inner类型的浮动标签）
    // ─────────────────────────────────────────────

    const [isFocused, setIsFocused] = React.useState(false)

    // ─────────────────────────────────────────────
    // IME 组合状态（用于日文等输入法）
    // ─────────────────────────────────────────────

    const isComposingRef = React.useRef(false)

    // ─────────────────────────────────────────────
    // 验证状态管理
    // ─────────────────────────────────────────────

    // 内部错误状态
    const [internalError, setInternalError] = React.useState(false)
    // 内部错误消息
    const [internalErrorMessage, setInternalErrorMessage] = React.useState<string>("")
    // 是否已经失焦过（用于 lazyRules）
    const [hasBlurred, setHasBlurred] = React.useState(false)

    // 计算当前值（用于验证）
    const currentValue = React.useMemo(() => {
      if (!mask) return valueProp ?? defaultValue ?? ""
      return rawChars.join("")
    }, [mask, rawChars, valueProp, defaultValue])

    // 执行验证逻辑
    const runValidation = React.useCallback(
      (value: string): { isValid: boolean; message: string } => {
        if (!rules || rules.length === 0) {
          return { isValid: true, message: "" }
        }

        for (const rule of rules) {
          const result = rule(value)
          if (result !== true) {
            return { isValid: false, message: typeof result === "string" ? result : "验证失败" }
          }
        }

        return { isValid: true, message: "" }
      },
      [rules],
    )

    // 验证函数（暴露给外部）
    const validate = React.useCallback((): boolean => {
      const { isValid, message } = runValidation(currentValue)
      setInternalError(!isValid)
      setInternalErrorMessage(message)
      return isValid
    }, [currentValue, runValidation])

    // 重置验证状态
    const resetValidation = React.useCallback(() => {
      setInternalError(false)
      setInternalErrorMessage("")
      setHasBlurred(false)
    }, [])

    // 获取当前值
    const getValue = React.useCallback(() => currentValue, [currentValue])

    // 暴露方法给父组件
    React.useImperativeHandle(ref, () => ({
      validate,
      resetValidation,
      getValue,
    }), [validate, resetValidation, getValue])

    // 合并后的错误状态（优先使用外部传入的 error）
    const hasError = errorProp ?? internalError
    // 合并后的错误消息（优先使用外部传入的 errorMessage）
    const displayErrorMessage = errorMessageProp ?? internalErrorMessage
    // 是否显示错误消息
    const showErrorMessage = hasError && displayErrorMessage
    // 是否显示 hint（有错误消息时隐藏）
    const showHint = hint && !showErrorMessage

    // 计算当前掩码展示值
    const maskedDisplay = React.useMemo(() => {
      if (!mask) return rawChars.join("")
      return applyMask(rawChars, mask, tokens, fillChar, fillMask, reverseFill)
    }, [mask, rawChars, tokens, fillChar, fillMask, reverseFill])

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

    // 处理验证触发时机
    const shouldValidateOnChange = React.useMemo(() => {
      if (lazyRules === "ondemand") return false
      if (lazyRules === true) return hasBlurred
      return true // lazyRules === false
    }, [lazyRules, hasBlurred])

    // 处理 input onChange
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // IME 组合过程中不执行长度限制，等组合完成后再处理
        if (isComposingRef.current) {
          onChange?.(e)
          onValueChange?.(e.target.value, e.target.value)
          return
        }

        if (!mask) {
          // 无掩码：普通输入框行为
          let newValue = e.target.value

          // 应用maxlength限制
          if (maxlength !== undefined && newValue.length > maxlength) {
            newValue = newValue.slice(0, maxlength)
          }

          // 应用maxlengthB限制（字节限制）
          if (maxlengthB !== undefined && getByteLength(newValue, encoding) > maxlengthB) {
            newValue = truncateByBytes(newValue, maxlengthB, encoding)
          }

          // 更新输入框值（如果被截断）
          if (newValue !== e.target.value && inputRef.current) {
            inputRef.current.value = newValue
          }

          onChange?.(e)
          onValueChange?.(newValue, newValue)

          // 值变化时触发验证
          if (shouldValidateOnChange && rules && rules.length > 0) {
            const { isValid, message } = runValidation(newValue)
            setInternalError(!isValid)
            setInternalErrorMessage(message)
          }
          return
        }

        const input = e.target.value

        // 当fillMask启用时，需要从输入中提取用户实际输入的字符
        // 比较输入值和当前掩码展示值，找出新增的字符
        let newRaw: string[]
        if (fillMask) {
          // 找出输入值中与当前掩码值不同的部分
          const currentMasked = maskedDisplay
          let addedChar = ''

          // 找出输入值中比当前值多的字符
          for (let i = 0; i < input.length; i++) {
            if (i >= currentMasked.length || input[i] !== currentMasked[i]) {
              // 检查是否是有效的令牌字符
              const ch = input[i]
              const tokenIdx = rawChars.length

              // 找到对应的令牌位置
              const tokenPositions: number[] = []
              for (let j = 0; j < mask.length; j++) {
                if (isTokenPosition(mask, j, tokens)) tokenPositions.push(j)
              }

              if (tokenIdx < tokenPositions.length) {
                const maskPos = tokenPositions[tokenIdx]
                const tokenKey = mask[maskPos]
                const token = tokens[tokenKey]

                if (token && token.pattern.test(ch)) {
                  addedChar = token.transform ? token.transform(ch) : ch
                  break
                }
              }
            }
          }

          // 如果找到了新增字符，添加到rawChars
          if (addedChar) {
            newRaw = [...rawChars, addedChar]
          } else {
            // 没有找到新增字符，可能是在删除或替换
            newRaw = parseRawInput(input, mask, tokens)
          }
        } else {
          newRaw = parseRawInput(input, mask, tokens)
        }

        // 应用maxlength限制（字符数）
        if (maxlength !== undefined && newRaw.length > maxlength) {
          newRaw = newRaw.slice(0, maxlength)
        }

        // 应用maxlengthB限制（字节数）
        const newUnmaskedRaw = newRaw.join("")
        if (maxlengthB !== undefined && getByteLength(newUnmaskedRaw, encoding) > maxlengthB) {
          newRaw = truncateByBytes(newUnmaskedRaw, maxlengthB, encoding).split("")
        }

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

        // 值变化时触发验证
        if (shouldValidateOnChange && rules && rules.length > 0) {
          const { isValid, message } = runValidation(newUnmasked)
          setInternalError(!isValid)
          setInternalErrorMessage(message)
        }

        // 延迟设置光标位置
        requestAnimationFrame(() => {
          if (inputRef.current) {
            if (reverseFill) {
              inputRef.current.setSelectionRange(mask.length, mask.length)
            } else {
              const cursorPos = getCursorPosition(newRaw.length, mask, tokens)
              inputRef.current.setSelectionRange(cursorPos, cursorPos)
            }
          }
        })
      },
      [mask, tokens, isControlled, fillChar, fillMask, reverseFill, unmaskedValue, onChange, onValueChange, maskedDisplay, rawChars, shouldValidateOnChange, rules, runValidation, maxlength, maxlengthB, encoding],
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

            // 删除时触发验证
            if (shouldValidateOnChange && rules && rules.length > 0) {
              const { isValid, message } = runValidation(newUnmasked)
              setInternalError(!isValid)
              setInternalErrorMessage(message)
            }

            requestAnimationFrame(() => {
              if (inputRef.current) {
                if (reverseFill) {
                  inputRef.current.setSelectionRange(mask.length, mask.length)
                } else {
                  const cursorPos = getCursorPosition(newRaw.length, mask, tokens)
                  inputRef.current.setSelectionRange(cursorPos, cursorPos)
                }
              }
            })
          }
        }
      },
      [mask, tokens, rawChars, isControlled, fillChar, fillMask, reverseFill, unmaskedValue, onChange, onValueChange, onKeyDown, shouldValidateOnChange, rules, runValidation],
    )

    // 处理失焦事件
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)

        // 标记已失焦（用于 lazyRules）
        if (lazyRules === true && !hasBlurred) {
          setHasBlurred(true)
          // 首次失焦时触发验证
          if (rules && rules.length > 0) {
            const { isValid, message } = runValidation(currentValue)
            setInternalError(!isValid)
            setInternalErrorMessage(message)
          }
        }

        // 调用外部 onBlur
        props.onBlur?.(e)
      },
      [lazyRules, hasBlurred, rules, runValidation, currentValue, props],
    )

    // 处理聚焦事件
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        props.onFocus?.(e)
      },
      [props],
    )

    // 处理 IME 组合开始事件
    const handleCompositionStart = React.useCallback(() => {
      isComposingRef.current = true
    }, [])

    // 处理 IME 组合结束事件
    const handleCompositionEnd = React.useCallback(
      (e: React.CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false
        // 组合结束后，触发一次 change 处理来执行长度限制
        const inputElement = e.target as HTMLInputElement
        const syntheticEvent = {
          target: inputElement,
          currentTarget: inputElement,
        } as React.ChangeEvent<HTMLInputElement>
        handleChange(syntheticEvent)
      },
      [handleChange],
    )

    // 输入框样式（包含错误状态和自定义颜色）
    const inputClassName = React.useMemo(() => {
      const errorClasses = hasError
        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
        : ""
      return cn(inputBaseClass, errorClasses, className)
    }, [hasError, className])

    // 输入框内联样式（背景色）
    const inputStyle: React.CSSProperties = React.useMemo(() => ({
      backgroundColor: bgColor,
      // 使用 CSS 变量控制 focus 时的边框颜色
      "--input-focus-color": color,
    } as React.CSSProperties), [bgColor, color])

    // 判断是否有值（用于inner类型的浮动标签）
    const hasValue = mask ? rawChars.length > 0 : !!(valueProp ?? defaultValue)

    // 计算输入框的动态样式类
    const getInputDynamicClasses = React.useCallback(() => {
      const classes: string[] = []

      // prefix相关：左侧padding
      if (prefix) {
        classes.push("pl-8")
      }

      // suffix相关：右侧padding
      if (suffix) {
        classes.push("pr-8")
      }

      // inner类型浮动标签
      if (labelType === "inner" && label) {
        classes.push("pt-2 pb-1")
      }

      // left类型标签
      if (labelType === "left" && label) {
        classes.push("rounded-l-none")
      }

      // before插槽：去除左圆角
      if (before) {
        classes.push("rounded-l-none")
      }

      // append插槽：去除右圆角
      if (append) {
        classes.push("rounded-r-none")
      }

      return classes
    }, [prefix, suffix, labelType, label, before, append])

    // 渲染底部提示信息（错误消息和hint）
    const renderHints = () => (
      <>
        {showErrorMessage && (
          <p className="mt-1.5 text-sm text-destructive flex items-center gap-1.5">
            {!noErrorIcon && <ErrorIcon className="h-4 w-4 shrink-0" />}
            {displayErrorMessage}
          </p>
        )}
        {showHint && (
          <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
        )}
      </>
    )

    // 渲染prefix
    const renderPrefix = () => {
      if (!prefix) return null
      return (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
          {prefix}
        </span>
      )
    }

    // 渲染suffix
    const renderSuffix = () => {
      if (!suffix) return null
      return (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm">
          {suffix}
        </span>
      )
    }

    // 渲染输入框主体（带prefix、suffix）
    const renderInputContent = (inputElement: React.ReactNode) => (
      <>
        {renderPrefix()}
        {inputElement}
        {renderSuffix()}
      </>
    )

    // 渲染inner类型的浮动标签
    const renderInnerLabel = () => {
      if (!label) return null
      // 当有placeholder、聚焦或有值时，Label浮动显示
      const shouldFloat = isFocused || hasValue || !!props.placeholder
      // 有prefix时，label需要偏移
      const labelLeftClass = prefix ? "left-10" : "left-3"
      // 标签的颜色样式（不管浮动状态，始终应用 color）
      const labelStyle: React.CSSProperties = color && !hasError ? { color } : {}
      return (
        <label
          className={cn(
            "absolute transition-all duration-200 pointer-events-none origin-left",
            labelLeftClass,
            shouldFloat
              ? "top-0 -translate-y-1/2 text-xs bg-background px-1 text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            hasError && shouldFloat && "text-destructive"
          )}
          style={labelStyle}
        >
          {label}
        </label>
      )
    }

    // 渲染left类型的标签
    const renderLeftLabel = () => {
      if (!label) return null

      // 将 textAlign 转换为 justifyContent（flex 容器使用）
      const justifyMap = {
        left: "flex-start",
        right: "flex-end",
        center: "center",
        justify: "center",
      } as const

      // 计算 label 样式（仅在 labelType="left" 时生效）
      const labelStyle: React.CSSProperties = {
        width: labelWidth
          ? typeof labelWidth === "number"
            ? `${labelWidth}px`
            : labelWidth
          : undefined,
        justifyContent: justifyMap[labelAlign],
        backgroundColor: labelColor,
        color: color && !hasError ? color : undefined,
      }

      // justify 对齐：使用额外的 span 包裹文字并设置宽度
      const labelContent = labelAlign === "justify" && labelWidth ? (
        <span
          className="inline-block"
          style={{
            width: "100%",
            textAlign: "justify",
            textAlignLast: "justify",
          }}
        >
          {label}
        </span>
      ) : (
        label
      )

      return (
        <label
          className={cn(
            "flex items-center h-9 px-3 text-sm whitespace-nowrap",
            "bg-muted border border-input rounded-l-md",
            "text-foreground"
          )}
          style={labelStyle}
        >
          {labelContent}
        </label>
      )
    }

    // 渲染top类型的标签
    const renderTopLabel = () => {
      if (!label) return null
      const labelStyle: React.CSSProperties = color && !hasError ? { color } : {}
      return (
        <label
          className={cn(
            "block text-sm font-medium mb-1.5",
            hasError ? "text-destructive" : "text-foreground"
          )}
          style={labelStyle}
        >
          {label}
        </label>
      )
    }

    // 渲染before插槽
    const renderBefore = () => {
      if (!before) return null
      return (
        <>
          {before}
        </>
      )
    }

    // 渲染append插槽
    const renderAppend = () => {
      if (!append) return null
      return (
        <>
          {append}
        </>
      )
    }

    // 根据labelType渲染输入框（考虑before和append）
    const renderWithLabel = (inputElement: React.ReactNode) => {
      // 构建输入框容器（包含before、输入框、append）
      const renderInputWrapper = () => {
        const inputBox = (
          <div className="relative flex-1">
            {labelType === "inner" && renderInnerLabel()}
            {renderInputContent(inputElement)}
          </div>
        )

        // 没有before和append
        if (!before && !append) {
          if (labelType === "left" && label) {
            return (
              <div className="flex">
                {renderLeftLabel()}
                {inputBox}
              </div>
            )
          }
          return inputBox
        }

        // 有before或append
        return (
          <div className="flex">
            {before && !label && renderBefore()}
            {labelType === "left" && label && renderLeftLabel()}
            {before && labelType === "left" && label && renderBefore()}
            {before && label && labelType !== "left" && renderBefore()}
            {inputBox}
            {append && renderAppend()}
          </div>
        )
      }

      // 组装完整内容
      const content = (
        <>
          {labelType === "top" && renderTopLabel()}
          {renderInputWrapper()}
          {renderHints()}
        </>
      )

      return content
    }

    // 无掩码：降级为标准 Input
    if (!mask) {
      return (
        <div className="w-full">
          {renderWithLabel(
            <input
              ref={inputRef}
              data-slot="input"
              className={cn(inputClassName, getInputDynamicClasses())}
              style={inputStyle}
              value={valueProp}
              defaultValue={defaultValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              aria-invalid={hasError}
              placeholder={props.placeholder}
              {...props}
            />
          )}
        </div>
      )
    }

    return (
      <div className="w-full">
        {renderWithLabel(
          <input
            ref={inputRef}
            data-slot="input"
            data-mask={mask}
            className={cn(inputClassName, getInputDynamicClasses())}
            style={inputStyle}
            value={maskedDisplay}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            aria-invalid={hasError}
            placeholder={props.placeholder}
            {...props}
          />
        )}
      </div>
    )
  },
)

TextInput.displayName = "TextInput"

// ─────────────────────────────────────────────
// 错误图标组件
// ─────────────────────────────────────────────

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

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
  // 支持自定义 focus 颜色（通过 CSS 变量 --input-focus-color）
  "focus-visible:border-[var(--input-focus-color,inherit)] focus-visible:ring-[color-mix(in_srgb,var(--input-focus-color)_50%,transparent)]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
].join(" ")

export { TextInput }
