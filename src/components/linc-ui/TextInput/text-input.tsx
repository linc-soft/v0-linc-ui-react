import * as React from "react"
import { cn } from "@/lib/utils"
import { getByteLength, truncateByBytes } from "@/lib/bytes"
import { DEFAULT_MASK_TOKENS } from "./constants"
import { ErrorIcon, ClearIcon } from "../Icons"
import { useValidation, useIMEComposition } from "@/hooks"
import type {
  MaskTokenMap,
  TextInputRef,
  TextInputProps,
} from "./types"

// 重新导出类型和常量，保持 API 兼容
export type {
  MaskToken,
  MaskTokenMap,
  ByteEncoding,
  ValidationRule,
  LazyRules,
  LabelType,
  TextInputRef,
  TextInputProps,
} from "./types"
export { DEFAULT_MASK_TOKENS } from "./constants"

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
      hideCounter,
      // 颜色相关属性
      color = "Primary",
      bgColor = "White",
      labelColor = "Primary",
      // 宽度相关属性
      inputWidth,
      // 清除按钮
      clearable = false,
      onClear,
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
    // 前缀区域容器 ref（用于动态计算 padding）
    const prefixContainerRef = React.useRef<HTMLSpanElement>(null)
    // 后缀区域容器 ref（用于动态计算 padding）
    const suffixContainerRef = React.useRef<HTMLDivElement>(null)
    // 左侧 padding 状态（根据 prefix 区域宽度动态计算）
    const [leftPadding, setLeftPadding] = React.useState(0)
    // 右侧 padding 状态（根据 suffix 区域宽度动态计算）
    const [rightPadding, setRightPadding] = React.useState(0)

    // ─────────────────────────────────────────────
    // Focus状态（用于inner类型的浮动标签）
    // ─────────────────────────────────────────────

    const [isFocused, setIsFocused] = React.useState(false)

    // ─────────────────────────────────────────────
    // IME 组合状态（用于日文等输入法）
    // ─────────────────────────────────────────────

    const { isComposingRef, handleCompositionStart } = useIMEComposition()

    // ─────────────────────────────────────────────
    // 验证状态管理
    // ─────────────────────────────────────────────

    // 计算当前值（用于验证）
    const currentValue = React.useMemo(() => {
      if (!mask) return valueProp ?? defaultValue ?? ""
      return rawChars.join("")
    }, [mask, rawChars, valueProp, defaultValue])

    // 将 lazyRules 转换为 trigger
    const validationTrigger = React.useMemo(() => {
      if (lazyRules === "ondemand") return "manual"
      if (lazyRules === true) return "onBlur"
      return "immediate"
    }, [lazyRules])

    const {
      error: internalError,
      errorMessage: internalErrorMessage,
      validate: validateValue,
      reset,
      markBlurred,
      shouldValidate,
    } = useValidation({ rules, trigger: validationTrigger })

    // 在值变化时执行验证
    const validateOnChange = React.useCallback(
      (value: string) => {
        if (shouldValidate() && rules && rules.length > 0) {
          validateValue(value)
        }
      },
      [shouldValidate, rules, validateValue]
    )

    // 验证函数（暴露给外部，使用当前值）
    const validate = React.useCallback((): boolean => {
      return validateValue(currentValue)
    }, [validateValue, currentValue])

    // 重置验证状态
    const resetValidation = React.useCallback(() => {
      reset()
    }, [reset])

    // 获取当前值
    const getValue = React.useCallback(() => currentValue, [currentValue])

    // 暴露方法给父组件
    // 聚焦输入框
    const focus = React.useCallback(() => {
      inputRef.current?.focus()
    }, [])

    // 失焦输入框
    const blur = React.useCallback(() => {
      inputRef.current?.blur()
    }, [])

    // 暴露方法给父组件
    React.useImperativeHandle(ref, () => ({
      validate,
      resetValidation,
      getValue,
      focus,
      blur,
    }), [validate, resetValidation, getValue, focus, blur])

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
          validateOnChange(newValue)
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
        validateOnChange(newUnmasked)

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
      [mask, tokens, isControlled, fillChar, fillMask, reverseFill, unmaskedValue, onChange, onValueChange, maskedDisplay, rawChars, validateOnChange, maxlength, maxlengthB, encoding, isComposingRef],
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
            validateOnChange(newUnmasked)

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
      [mask, tokens, rawChars, isControlled, fillChar, fillMask, reverseFill, unmaskedValue, onChange, onValueChange, onKeyDown, validateOnChange],
    )

    // 处理失焦事件
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        // 标记已失焦并触发首次验证（用于 lazyRules === true）
        if (lazyRules === true) {
          markBlurred()
          if (rules && rules.length > 0) {
            validateValue(currentValue)
          }
        }
        // 调用外部 onBlur
        props.onBlur?.(e)
      },
      [lazyRules, markBlurred, rules, validateValue, currentValue, props],
    )

    // 处理聚焦事件
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        props.onFocus?.(e)
      },
      [props],
    )

    // 处理 IME 组合结束事件
    const handleCompositionEnd = React.useCallback(
      (e: React.CompositionEvent<HTMLInputElement>) => {
        // 先重置 IME 组合状态，确保 handleChange 能正确执行长度限制
        isComposingRef.current = false
        // 触发一次 change 处理来执行长度限制
        const inputElement = e.target as HTMLInputElement
        const syntheticEvent = {
          target: inputElement,
          currentTarget: inputElement,
        } as React.ChangeEvent<HTMLInputElement>
        handleChange(syntheticEvent)
      },
      [handleChange, isComposingRef],
    )

    // 输入框样式（包含错误状态和自定义颜色）
    const inputClassName = React.useMemo(() => {
      const errorClasses = hasError
        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
        : ""
      return cn(inputBaseClass, errorClasses, className)
    }, [hasError, className])

    // 输入框内联样式（背景色、动态右侧padding）
    const inputStyle: React.CSSProperties = React.useMemo(() => ({
      backgroundColor: bgColor,
      // 使用 CSS 变量控制 focus 时的边框颜色
      "--input-focus-color": color,
      // 动态右侧 padding（根据 suffix 区域宽度计算）
      paddingRight: rightPadding > 0 ? `${rightPadding}px` : undefined,
      // 动态左侧 padding（根据 prefix 区域宽度计算）
      paddingLeft: leftPadding > 0 ? `${leftPadding}px` : undefined,
    } as React.CSSProperties), [bgColor, color, rightPadding, leftPadding])

    // 输入框容器样式（宽度）
    const inputBoxStyle: React.CSSProperties = React.useMemo(() => ({
      width: inputWidth
        ? typeof inputWidth === "number"
          ? `${inputWidth}px`
          : inputWidth
        : undefined,
      flex: inputWidth ? "none" : undefined,
    }), [inputWidth])

    // 判断是否有值（用于inner类型的浮动标签）
    const hasValue = mask ? rawChars.length > 0 : !!(valueProp ?? defaultValue)

    // 动态计算右侧 padding（根据 suffix 区域宽度）
    React.useLayoutEffect(() => {
      const container = suffixContainerRef.current
      const showClear = clearable && hasValue
      if (container) {
        // 获取容器宽度（包含清除按钮 + suffix）
        const width = container.offsetWidth
        // 清除按钮和 suffix 之间的间距（margin 不计入 offsetWidth）
        const gapBetweenClearAndSuffix = showClear && suffix ? 5 : 0
        // padding = 容器宽度 + 间距 + 左侧额外间距
        setRightPadding(width + gapBetweenClearAndSuffix + 8)
      } else {
        setRightPadding(0)
      }

      // 动态计算左侧 padding（根据 prefix 区域宽度）
      const prefixContainer = prefixContainerRef.current
      if (prefixContainer) {
        const prefixWidth = prefixContainer.offsetWidth
        setLeftPadding(prefixWidth + 16)
      } else {
        setLeftPadding(0)
      }
    }, [suffix, clearable, hasValue, prefix])

    // 计算输入框的动态样式类
    const getInputDynamicClasses = React.useCallback(() => {
      const classes: string[] = []

      // 左侧padding：由 ref 动态计算 prefix 区域宽度
      // 这里设置最小 padding，实际值通过 prefixContainerRef 动态调整
      if (prefix) {
        classes.push("pl-3")
      }

      // 右侧padding：由 ref 动态计算 suffix 区域宽度
      // 这里设置最小 padding，实际值通过 suffixContainerRef 动态调整
      if (suffix || (clearable && hasValue)) {
        classes.push("pr-3")
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
    }, [prefix, suffix, labelType, label, before, append, clearable, hasValue])

    // ─────────────────────────────────────────────
    // 字符/字节计数器
    // ─────────────────────────────────────────────

    // 计算当前值（用于计数器显示）
    const counterValue = React.useMemo(() => {
      if (mask) {
        return rawChars.join("")
      }
      return valueProp ?? defaultValue ?? ""
    }, [mask, rawChars, valueProp, defaultValue])

    // 计数器显示逻辑
    const hasLengthLimit = maxlength !== undefined || maxlengthB !== undefined
    const showCounter = hasLengthLimit && !hideCounter

    // 优先使用 maxlengthB（字节数限制）
    const useByteCounter = maxlengthB !== undefined
    const counterCurrent = useByteCounter
      ? getByteLength(counterValue, encoding)
      : counterValue.length
    const counterMax = useByteCounter ? maxlengthB! : maxlength!

    // 渲染底部区域（错误消息/hint 和 计数器在同一行）
    const renderFooter = () => {
      const hasFooterContent = showErrorMessage || showHint || showCounter
      if (!hasFooterContent) return null

      return (
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {showErrorMessage && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                {!noErrorIcon && <ErrorIcon className="h-4 w-4 shrink-0" />}
                {displayErrorMessage}
              </p>
            )}
            {showHint && (
              <p className="text-sm text-muted-foreground">{hint}</p>
            )}
          </div>
          {showCounter && (
            <p
              className={cn(
                "text-sm shrink-0",
                counterCurrent > counterMax ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {counterCurrent}/{counterMax}
            </p>
          )}
        </div>
      )
    }

    // 渲染prefix
    const renderPrefix = () => {
      if (!prefix) return null
      return (
        <span
          ref={prefixContainerRef}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm whitespace-nowrap"
        >
          {prefix}
        </span>
      )
    }

    // 渲染suffix
    const renderSuffix = () => {
      if (!suffix) return null
      return (
        <span className="text-muted-foreground pointer-events-none text-sm whitespace-nowrap">
          {suffix}
        </span>
      )
    }

    // 处理清除按钮点击
    const handleClear = React.useCallback(() => {
      if (!mask) {
        // 无掩码模式：直接清空
        if (inputRef.current) {
          inputRef.current.value = ""
        }
        onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
        onValueChange?.("", "")
      } else {
        // 有掩码模式：清空 rawChars
        if (!isControlled) {
          setRawChars([])
        }
        const newMasked = applyMask([], mask, tokens, fillChar, fillMask, reverseFill)
        onValueChange?.(newMasked, "")

        if (onChange && inputRef.current) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value",
          )?.set
          nativeInputValueSetter?.call(inputRef.current, unmaskedValue ? "" : newMasked)
          inputRef.current.dispatchEvent(new Event("input", { bubbles: true }))
        }
      }

      // 触发 onClear 回调
      onClear?.()

      // 清除后聚焦输入框
      inputRef.current?.focus()
    }, [mask, tokens, fillChar, fillMask, reverseFill, isControlled, unmaskedValue, onChange, onValueChange, onClear])

    // 渲染清除按钮
    const renderClearButton = () => {
      if (!clearable || !hasValue) return null
      return (
        <button
          type="button"
          tabIndex={-1}
          className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer shrink-0 p-0"
          onClick={handleClear}
          aria-label="清除"
        >
          <ClearIcon className="h-4 w-4" />
        </button>
      )
    }

    // 渲染右侧区域（清除按钮 + suffix，使用 flex 布局）
    const renderSuffixArea = () => {
      const showClear = clearable && hasValue
      if (!suffix && !showClear) return null

      return (
        <div
          ref={suffixContainerRef}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
        >
          {showClear && <div className="mr-[2px]">{renderClearButton()}</div>}
          {renderSuffix()}
        </div>
      )
    }

    // 渲染输入框主体（带prefix、suffixArea）
    const renderInputContent = (inputElement: React.ReactNode) => (
      <>
        {renderPrefix()}
        {inputElement}
        {renderSuffixArea()}
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
        // inputBox 内部包含输入框区域和 footer
        // 输入框区域单独包裹，确保清除按钮正确定位
        const inputBox = (
          <div className="flex-1" style={inputBoxStyle}>
            {/* 输入框区域：relative 定位，清除按钮相对于此定位 */}
            <div className="relative">
              {labelType === "inner" && renderInnerLabel()}
              {renderInputContent(inputElement)}
            </div>
            {/* footer 放在输入框下方，宽度由 inputBoxStyle 控制 */}
            {renderFooter()}
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
