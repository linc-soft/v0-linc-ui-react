import * as React from 'react'
import { cn } from '@/lib/utils'
import { getByteLength, truncateByBytes } from '@/lib/bytes'
import { ErrorIcon, ClearIcon } from '../Icons'
import { useValidation, useIMEComposition } from '@/hooks'
import type { TextInputRef, TextInputProps } from './types'

// 重新导出类型，保持 API 兼容
export type {
  ByteEncoding,
  ValidationRule,
  LazyRules,
  LabelType,
  TextInputRef,
  TextInputProps,
} from './types'

// ─────────────────────────────────────────────
// TextInput 组件
// ─────────────────────────────────────────────

const TextInput = React.forwardRef<TextInputRef, TextInputProps>(
  (
    {
      className,
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
      labelType = 'inner',
      labelWidth,
      labelAlign = 'left',
      // 前缀/后缀相关属性
      prefix,
      suffix,
      // 插槽相关属性
      before,
      append,
      // 长度限制相关属性
      maxlength,
      maxlengthB,
      encoding = 'utf-8',
      hideCounter,
      // 颜色相关属性
      color = 'Primary',
      bgColor = 'White',
      labelColor = 'Primary',
      // 宽度相关属性
      inputWidth,
      // 清除按钮
      clearable = false,
      onClear,
      ...props
    },
    ref,
  ) => {
    // 是否受控
    const isControlled = valueProp !== undefined
    const [plainValue, setPlainValue] = React.useState<string>(
      () => valueProp ?? defaultValue ?? '',
    )
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
    const currentValue = isControlled ? (valueProp ?? '') : plainValue

    // 将 lazyRules 转换为 trigger
    const validationTrigger = React.useMemo(() => {
      if (lazyRules === 'ondemand') return 'manual'
      if (lazyRules === true) return 'onBlur'
      return 'immediate'
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
      [shouldValidate, rules, validateValue],
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
    React.useImperativeHandle(
      ref,
      () => ({
        validate,
        resetValidation,
        getValue,
        focus,
        blur,
      }),
      [validate, resetValidation, getValue, focus, blur],
    )

    // 合并后的错误状态（优先使用外部传入的 error）
    const hasError = errorProp ?? internalError
    // 合并后的错误消息（优先使用外部传入的 errorMessage）
    const displayErrorMessage = errorMessageProp ?? internalErrorMessage
    // 是否显示错误消息
    const showErrorMessage = hasError && displayErrorMessage
    // 是否显示 hint（有错误消息时隐藏）
    const showHint = hint && !showErrorMessage

    // 受控模式：外部 value 变化时同步
    React.useEffect(() => {
      if (!isControlled) return
      setPlainValue(valueProp ?? '')
    }, [isControlled, valueProp])

    // 处理 input onChange
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // IME 组合过程中不执行长度限制，等组合完成后再处理
        if (isComposingRef.current) {
          onChange?.(e)
          onValueChange?.(e.target.value)
          return
        }

        let newValue = e.target.value

        // 应用maxlength限制
        if (maxlength !== undefined && newValue.length > maxlength) {
          newValue = newValue.slice(0, maxlength)
        }

        // 应用maxlengthB限制（字节限制）
        if (
          maxlengthB !== undefined &&
          getByteLength(newValue, encoding) > maxlengthB
        ) {
          newValue = truncateByBytes(newValue, maxlengthB, encoding)
        }

        // 更新输入框值（如果被截断）
        if (newValue !== e.target.value && inputRef.current) {
          inputRef.current.value = newValue
        }

        onChange?.(e)
        onValueChange?.(newValue)

        if (!isControlled) {
          setPlainValue(newValue)
        }

        // 值变化时触发验证
        validateOnChange(newValue)
      },
      [
        maxlength,
        maxlengthB,
        encoding,
        onChange,
        onValueChange,
        isControlled,
        validateOnChange,
        isComposingRef,
      ],
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
        ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40'
        : ''
      return cn(inputBaseClass, errorClasses, className)
    }, [hasError, className])

    // 输入框内联样式（背景色、动态右侧padding）
    const inputStyle: React.CSSProperties = React.useMemo(
      () =>
        ({
          backgroundColor: bgColor,
          // 使用 CSS 变量控制 focus 时的边框颜色
          '--input-focus-color': color,
          // 动态右侧 padding（根据 suffix 区域宽度计算）
          paddingRight: rightPadding > 0 ? `${rightPadding}px` : undefined,
          // 动态左侧 padding（根据 prefix 区域宽度计算）
          paddingLeft: leftPadding > 0 ? `${leftPadding}px` : undefined,
        }) as React.CSSProperties,
      [bgColor, color, rightPadding, leftPadding],
    )

    // 输入框容器样式（宽度）
    const inputBoxStyle: React.CSSProperties = React.useMemo(
      () => ({
        width: inputWidth
          ? typeof inputWidth === 'number'
            ? `${inputWidth}px`
            : inputWidth
          : undefined,
        flex: inputWidth ? 'none' : undefined,
      }),
      [inputWidth],
    )

    // 判断是否有值（用于inner类型的浮动标签）
    const hasValue = isControlled ? !!valueProp : !!plainValue

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
        classes.push('pl-3')
      }

      // 右侧padding：由 ref 动态计算 suffix 区域宽度
      // 这里设置最小 padding，实际值通过 suffixContainerRef 动态调整
      if (suffix || (clearable && hasValue)) {
        classes.push('pr-3')
      }

      // inner类型浮动标签
      if (labelType === 'inner' && label) {
        classes.push('pt-2 pb-1')
      }

      // left类型标签
      if (labelType === 'left' && label) {
        classes.push('rounded-l-none')
      }

      // before插槽：去除左圆角
      if (before) {
        classes.push('rounded-l-none')
      }

      // append插槽：去除右圆角
      if (append) {
        classes.push('rounded-r-none')
      }

      return classes
    }, [prefix, suffix, labelType, label, before, append, clearable, hasValue])

    // ─────────────────────────────────────────────
    // 字符/字节计数器
    // ─────────────────────────────────────────────

    // 计数器显示逻辑
    const hasLengthLimit = maxlength !== undefined || maxlengthB !== undefined
    const showCounter = hasLengthLimit && !hideCounter

    // 优先使用 maxlengthB（字节数限制）
    const useByteCounter = maxlengthB !== undefined
    const counterCurrent = useByteCounter
      ? getByteLength(currentValue, encoding)
      : currentValue.length
    const counterMax = useByteCounter ? maxlengthB! : maxlength!

    // 渲染底部区域（错误消息/hint 和 计数器在同一行）
    const renderFooter = () => {
      const hasFooterContent = showErrorMessage || showHint || showCounter
      if (!hasFooterContent) return null

      return (
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            {showErrorMessage && (
              <p
                className="text-destructive flex items-center gap-1.5 overflow-hidden text-sm whitespace-nowrap"
                title={displayErrorMessage}
              >
                {!noErrorIcon && <ErrorIcon className="h-4 w-4 shrink-0" />}
                <span className="truncate">{displayErrorMessage}</span>
              </p>
            )}
            {showHint && (
              <p
                className="text-muted-foreground overflow-hidden text-sm text-ellipsis whitespace-nowrap"
                title={hint}
              >
                {hint}
              </p>
            )}
          </div>
          {showCounter && (
            <p
              className={cn(
                'shrink-0 text-sm',
                counterCurrent > counterMax
                  ? 'text-destructive'
                  : 'text-muted-foreground',
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
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm whitespace-nowrap"
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
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      if (!isControlled) {
        setPlainValue('')
      }
      onChange?.({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>)
      onValueChange?.('')

      // 触发 onClear 回调
      onClear?.()

      // 清除后聚焦输入框
      inputRef.current?.focus()
    }, [isControlled, onChange, onValueChange, onClear])

    // 渲染清除按钮
    const renderClearButton = () => {
      if (!clearable || !hasValue) return null
      return (
        <button
          type="button"
          tabIndex={-1}
          className="text-muted-foreground hover:text-foreground flex shrink-0 cursor-pointer items-center justify-center p-0 transition-colors duration-200"
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
          className="absolute top-1/2 right-[9px] flex -translate-y-1/2 items-center"
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
      const labelLeftClass = prefix ? 'left-10' : 'left-3'
      // 标签的颜色样式（不管浮动状态，始终应用 color）
      const labelStyle: React.CSSProperties =
        color && !hasError ? { color } : {}
      return (
        <label
          className={cn(
            'pointer-events-none absolute origin-left transition-all duration-200',
            labelLeftClass,
            shouldFloat
              ? 'bg-background text-primary top-0 -translate-y-1/2 px-1 text-xs'
              : 'text-muted-foreground top-1/2 -translate-y-1/2 text-sm',
            hasError && shouldFloat && 'text-destructive',
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
        left: 'flex-start',
        right: 'flex-end',
        center: 'center',
        justify: 'center',
      } as const

      // 计算 label 样式（仅在 labelType="left" 时生效）
      const labelStyle: React.CSSProperties = {
        width: labelWidth
          ? typeof labelWidth === 'number'
            ? `${labelWidth}px`
            : labelWidth
          : undefined,
        justifyContent: justifyMap[labelAlign],
        backgroundColor: labelColor,
        color: color && !hasError ? color : undefined,
      }

      // justify 对齐：使用额外的 span 包裹文字并设置宽度
      const labelContent =
        labelAlign === 'justify' && labelWidth ? (
          <span
            className="inline-block"
            style={{
              width: '100%',
              textAlign: 'justify',
              textAlignLast: 'justify',
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
            'flex h-9 items-center px-3 text-sm whitespace-nowrap',
            'bg-muted border-input rounded-l-md border',
            'text-foreground',
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
      const labelStyle: React.CSSProperties =
        color && !hasError ? { color } : {}
      return (
        <label
          className={cn(
            'mb-1.5 block text-sm font-medium',
            hasError ? 'text-destructive' : 'text-foreground',
          )}
          style={labelStyle}
        >
          {label}
        </label>
      )
    }

    // 渲染before插槽
    const renderBefore = ({
      roundedLeft,
      mergeLeft,
    }: {
      roundedLeft: boolean
      mergeLeft: boolean
    }) => {
      if (!before) return null
      return (
        <div
          className={cn(
            'border-input text-muted-foreground flex h-9 shrink-0 items-center border px-3 text-sm font-medium',
            hasError ? 'border-destructive' : '',
            mergeLeft ? 'border-l-0' : '',
            'border-r-0',
            roundedLeft ? 'rounded-l-md' : '',
          )}
          style={{ backgroundColor: bgColor }}
        >
          {before}
        </div>
      )
    }

    // 渲染append插槽
    const renderAppend = () => {
      if (!append) return null
      return (
        <div
          className={cn(
            'border-input text-muted-foreground flex h-9 shrink-0 items-center border px-3 text-sm font-medium',
            hasError ? 'border-destructive' : '',
            'rounded-r-md border-l-0',
          )}
          style={{ backgroundColor: bgColor }}
        >
          {append}
        </div>
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
              {labelType === 'inner' && renderInnerLabel()}
              {renderInputContent(inputElement)}
            </div>
            {/* footer 放在输入框下方，宽度由 inputBoxStyle 控制 */}
            {renderFooter()}
          </div>
        )

        // 没有before和append
        if (!before && !append) {
          if (labelType === 'left' && label) {
            return (
              <div className="flex items-start">
                {renderLeftLabel()}
                {inputBox}
              </div>
            )
          }
          return inputBox
        }

        // 有before或append
        return (
          <div className="flex items-start">
            {before &&
              !label &&
              renderBefore({ roundedLeft: true, mergeLeft: false })}
            {labelType === 'left' && label && renderLeftLabel()}
            {before &&
              labelType === 'left' &&
              label &&
              renderBefore({ roundedLeft: false, mergeLeft: true })}
            {before &&
              label &&
              labelType !== 'left' &&
              renderBefore({ roundedLeft: true, mergeLeft: false })}
            {inputBox}
            {append && renderAppend()}
          </div>
        )
      }

      // 组装完整内容
      const content = (
        <>
          {labelType === 'top' && renderTopLabel()}
          {renderInputWrapper()}
        </>
      )

      return content
    }

    return (
      <div className="w-full">
        {renderWithLabel(
          <input
            {...props}
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
          />,
        )}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'

// ─────────────────────────────────────────────
// 样式常量
// ─────────────────────────────────────────────

const inputBaseClass = [
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
  'dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs',
  'transition-[color,box-shadow] outline-none',
  'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  // 支持自定义 focus 颜色（通过 CSS 变量 --input-focus-color）
  'focus-visible:border-[var(--input-focus-color,inherit)] focus-visible:ring-[color-mix(in_srgb,var(--input-focus-color)_50%,transparent)]',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
].join(' ')

export { TextInput }
