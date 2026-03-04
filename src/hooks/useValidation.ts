import * as React from 'react'

// ─────────────────────────────────────────────
// 类型定义
// ─────────────────────────────────────────────

/**
 * 验证规则函数
 * @param value 要验证的值
 * @returns true 表示验证通过，string 表示错误消息
 */
export type ValidationRule<T = unknown> = (value: T) => boolean | string

/**
 * 验证触发时机
 * - `immediate` - 立即验证（默认）
 * - `onBlur` - 首次失焦后开始验证
 * - `manual` - 仅手动触发验证
 */
export type ValidationTrigger = 'immediate' | 'onBlur' | 'manual'

/**
 * useValidation 配置选项
 */
export interface UseValidationOptions<T = unknown> {
  /** 验证规则数组 */
  rules?: ValidationRule<T>[]
  /** 验证触发时机 */
  trigger?: ValidationTrigger
  /** 初始错误状态 */
  initialError?: boolean
  /** 初始错误消息 */
  initialErrorMessage?: string
}

/**
 * useValidation 返回值
 */
export interface UseValidationReturn<T = unknown> {
  /** 当前错误状态 */
  error: boolean
  /** 当前错误消息 */
  errorMessage: string
  /** 是否已经失焦过（用于 trigger="onBlur"） */
  hasBlurred: boolean
  /** 执行验证并更新状态 */
  validate: (value: T) => boolean
  /** 仅执行验证逻辑（不更新状态） */
  runValidation: (value: T) => { isValid: boolean; message: string }
  /** 重置验证状态 */
  reset: () => void
  /** 设置错误状态 */
  setError: (error: boolean, message?: string) => void
  /** 标记已失焦（用于 trigger="onBlur"） */
  markBlurred: () => void
  /** 根据当前 trigger 判断是否应该验证 */
  shouldValidate: () => boolean
}

// ─────────────────────────────────────────────
// Hook 实现
// ─────────────────────────────────────────────

/**
 * 通用验证 Hook
 *
 * @example
 * ```tsx
 * const { error, errorMessage, validate, reset } = useValidation({
 *   rules: [
 *     (v) => v.length > 0 || "不能为空",
 *     (v) => v.length <= 10 || "最多10个字符",
 *   ],
 *   trigger: "onBlur",
 * })
 *
 * const handleChange = (value: string) => {
 *   validate(value)
 * }
 * ```
 */
export function useValidation<T = unknown>(
  options: UseValidationOptions<T> = {},
): UseValidationReturn<T> {
  const {
    rules = [],
    trigger = 'immediate',
    initialError = false,
    initialErrorMessage = '',
  } = options

  // 错误状态
  const [error, setErrorState] = React.useState(initialError)
  const [errorMessage, setErrorMessage] = React.useState(initialErrorMessage)
  // 失焦标记（用于 trigger="onBlur"）
  const [hasBlurred, setHasBlurred] = React.useState(false)

  // 执行验证逻辑（纯函数，不更新状态）
  const runValidation = React.useCallback(
    (value: T): { isValid: boolean; message: string } => {
      if (rules.length === 0) {
        return { isValid: true, message: '' }
      }

      for (const rule of rules) {
        const result = rule(value)
        if (result !== true) {
          return {
            isValid: false,
            message: typeof result === 'string' ? result : '验证失败',
          }
        }
      }

      return { isValid: true, message: '' }
    },
    [rules],
  )

  // 执行验证并更新状态
  const validate = React.useCallback(
    (value: T): boolean => {
      const { isValid, message } = runValidation(value)
      setErrorState(!isValid)
      setErrorMessage(message)
      return isValid
    },
    [runValidation],
  )

  // 重置状态
  const reset = React.useCallback(() => {
    setErrorState(false)
    setErrorMessage('')
    setHasBlurred(false)
  }, [])

  // 设置错误状态
  const setError = React.useCallback((err: boolean, msg: string = '') => {
    setErrorState(err)
    setErrorMessage(msg)
  }, [])

  // 标记失焦
  const markBlurred = React.useCallback(() => {
    setHasBlurred(true)
  }, [])

  // 判断是否应该验证
  const shouldValidate = React.useCallback(() => {
    switch (trigger) {
      case 'immediate':
        return true
      case 'onBlur':
        return hasBlurred
      case 'manual':
        return false
      default:
        return true
    }
  }, [trigger, hasBlurred])

  return {
    error,
    errorMessage,
    hasBlurred,
    validate,
    runValidation,
    reset,
    setError,
    markBlurred,
    shouldValidate,
  }
}
