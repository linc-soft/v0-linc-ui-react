/**
 * TextInput 组件类型定义
 */

// ─────────────────────────────────────────────
// 掩码令牌定义
// ─────────────────────────────────────────────

export interface MaskToken {
  /** 匹配该位置合法字符的正则 */
  pattern: RegExp
  /** 可选：将输入字符转为大写 */
  transform?: (char: string) => string
}

export type MaskTokenMap = Record<string, MaskToken>

// ─────────────────────────────────────────────
// 字节编码类型
// ─────────────────────────────────────────────

/**
 * 字节编码格式类型
 * - utf-8: UTF-8 编码（默认），ASCII 1字节，中文/日文 3字节
 * - shift-jis: Shift-JIS 编码（日文），ASCII 1字节，日文假名/汉字 2字节
 * - gbk: GBK 编码（中文），ASCII 1字节，中文 2字节
 */
export type ByteEncoding = "utf-8" | "shift-jis" | "gbk"

// ─────────────────────────────────────────────
// 验证相关类型
// ─────────────────────────────────────────────

import type { ValidationRule as ValidationRuleBase } from "@/hooks"

// 重新导出验证规则类型，保持 API 兼容
export type ValidationRule = ValidationRuleBase<string>

/**
 * 验证触发模式
 * - true: 仅在首次失焦后触发验证
 * - 'ondemand': 仅在手动调用 validate() 时触发验证
 * - false: 每次值变化时都触发验证（默认）
 */
export type LazyRules = boolean | "ondemand"

// ─────────────────────────────────────────────
// Label 类型
// ─────────────────────────────────────────────

/**
 * Label类型
 * - inner: 输入框获得焦点后，会在输入字段上方"浮动"显示的文本标签
 * - left: 固定显示在TextInput的左侧，Label和Input间无间距
 * - top: 固定显示在TextInput的上方，Label和Input间无间距
 */
export type LabelType = "inner" | "left" | "top"

// ─────────────────────────────────────────────
// TextInput Ref
// ─────────────────────────────────────────────

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
  /** 聚焦输入框 */
  focus: () => void
  /** 失焦输入框 */
  blur: () => void
}

// ─────────────────────────────────────────────
// TextInput Props
// ─────────────────────────────────────────────

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

  /**
   * 输入框宽度。
   * 可以是数字（转为px）或字符串（如 "200px"、"50%"、"10rem" 等）。
   * 注意：此属性控制的是内部 input 元素的宽度，而非整个 TextInput 组件的宽度。
   */
  inputWidth?: number | string

  /**
   * 是否显示清除按钮。
   * 设置为 true 时，在输入框右侧显示清除图标，点击可清空输入内容。
   * @default false
   */
  clearable?: boolean

  /**
   * 清除按钮点击回调。
   * 当用户点击清除按钮清空输入内容时触发。
   */
  onClear?: () => void
}
