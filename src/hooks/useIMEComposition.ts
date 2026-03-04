import * as React from "react"

/**
 * useIMEComposition 返回值
 */
export interface UseIMECompositionReturn {
  /** 是否正在 IME 组合中 */
  isComposing: boolean
  /** IME 组合状态 ref（用于在回调中访问最新状态） */
  isComposingRef: React.RefObject<boolean>
  /** IME 组合开始事件处理函数 */
  handleCompositionStart: () => void
  /** IME 组合结束事件处理函数 */
  handleCompositionEnd: (callback: () => void) => void
}

/**
 * IME 组合状态 Hook
 * 用于处理日文、中文等输入法的组合输入
 *
 * @example
 * ```tsx
 * const { isComposing, handleCompositionStart, handleCompositionEnd } = useIMEComposition()
 *
 * <input
 *   onCompositionStart={handleCompositionStart}
 *   onCompositionEnd={(e) => handleCompositionEnd(() => {
 *     // 组合结束后的处理逻辑
 *   })}
 * />
 * ```
 */
export function useIMEComposition(): UseIMECompositionReturn {
  // 使用 ref 存储最新状态（供回调中访问）
  const isComposingRef = React.useRef(false)
  // 使用 state 触发重新渲染
  const [isComposing, setIsComposing] = React.useState(false)

  // 处理 IME 组合开始事件
  const handleCompositionStart = React.useCallback(() => {
    isComposingRef.current = true
    setIsComposing(true)
  }, [])

  // 处理 IME 组合结束事件
  const handleCompositionEnd = React.useCallback((callback: () => void) => {
    isComposingRef.current = false
    setIsComposing(false)
    // 组合结束后，触发回调处理
    callback()
  }, [])

  return {
    isComposing,
    isComposingRef,
    handleCompositionStart,
    handleCompositionEnd,
  }
}
