# TextInput 组件文档

TextInput 是一个功能强大的文本输入组件，支持掩码输入、验证、长度限制、多种标签样式和自定义插槽等功能。

## 目录

- [组件概述](#组件概述)
- [Props 属性](#props-属性)
- [Methods 方法](#methods-方法)
- [Events 事件](#events-事件)
- [Slots 插槽](#slots-插槽)
- [使用示例](#使用示例)

---

## 组件概述

TextInput 组件提供了丰富的输入功能，包括：

- **掩码输入**：支持自定义掩码格式，自动格式化用户输入
- **验证功能**：内置验证系统，支持多种验证触发模式
- **长度限制**：支持字符数和字节数限制
- **多种标签样式**：支持浮动标签、左侧标签、顶部标签
- **前后缀支持**：支持内部前后缀和外部插槽
- **清除按钮**：可选的清除功能
- **IME支持**：完美支持日文等输入法
- **主题定制**：支持自定义颜色和样式

---

## Props 属性

### 基础属性

- **className** (`string`): 自定义类名
- **value** (`string`): 当前值（受控模式）
- **defaultValue** (`string`): 默认值（非受控模式）
- **placeholder** (`string`): 占位符文本
- **disabled** (`boolean`): 是否禁用
- **readOnly** (`boolean`): 是否只读
- **type** (`string`): 输入框类型，默认为 `"text"`

### 掩码相关属性

- **mask** (`string`): 掩码模式字符串，如 `"(###) ###-####"` 表示电话号码格式。令牌字符（如 `#`、`A`、`W`）为可变输入位，其余字符为固定分隔符。

- **tokens** (`MaskTokenMap`): 自定义令牌映射，会与内置令牌合并。可扩展或覆盖内置令牌。

- **fillMask** (`boolean`): 是否启用填充掩码功能。启用后，输入内容不足掩码长度时，用 `fillChar` 填充剩余位置。默认为 `false`。

- **fillChar** (`string`): 填充字符，仅在 `fillMask=true` 时生效。默认为 `"_"`。

- **reverseFill** (`boolean`): 是否启用反向填充掩码功能。启用后，用户输入从掩码右侧开始填充（右对齐）。需同时启用 `fillMask`。默认为 `false`。

- **unmaskedValue** (`boolean`): 是否绑定未掩码值（纯净值）。当设为 true 时，`onChange` 回调的第二个参数提供去除掩码后的纯净值。默认为 `false`。

**内置令牌**：

- `#`：数字（0-9）
- `A`：字母（A-Z，a-z）
- `W`：字母或数字（0-9，A-Z，a-z）

**自定义令牌示例**：

```typescript
const customTokens = {
  'X': {
    pattern: /[0-9A-Fa-f]/,
    transform: (char) => char.toUpperCase()
  }
}
```

### 验证相关属性

- **rules** (`ValidationRule[]`): 校验规则数组。每个规则是一个函数，返回 true 表示通过，返回 string 表示错误消息。

- **error** (`boolean`): 外部控制的错误状态。设置为 true 时显示错误样式。

- **errorMessage** (`string`): 错误提示信息。仅在 error 为 true 时显示。

- **noErrorIcon** (`boolean`): 是否隐藏默认的错误提示图标。默认为 `false`。

- **hint** (`string`): 辅助说明文本，显示在输入框下方。当出现 error-message 时自动隐藏。

- **lazyRules** (`boolean | 'ondemand'`): 验证触发模式。默认为 `false`。

  - `false`：每次值变化时都触发验证（默认）
  - `true`：仅在首次失焦后触发验证
  - `'ondemand'`：仅在手动调用 `validate()` 时触发验证

**验证规则示例**：

```typescript
const rules = [
  (value) => value.length >= 6 || '至少需要6个字符',
  (value) => /\d+/.test(value) || '必须包含数字'
]
```

### Label 相关属性

- **label** (`string`): 标签文本内容

- **labelType** (`'inner' | 'left' | 'top'`): 标签类型。默认为 `"top"`。

  - `inner`：浮动标签，输入框获得焦点或有值时，会在输入字段上方"浮动"显示
  - `left`：固定显示在TextInput的左侧，Label和Input间无间距
  - `top`：固定显示在TextInput的上方，Label和Input间无间距

- **labelWidth** (`number | string`): 标签宽度。仅在 `labelType="left"` 时生效，其他类型下此设置将被忽略。可以是数字（转为px）或字符串（如 "100px"、"10rem" 等）。默认为 auto（根据内容自动调整）。

- **labelAlign** (`'left' | 'right' | 'center' | 'justify'`): 标签文字对齐方式。仅在 `labelType="left"` 时生效，其他类型下此设置将被忽略。默认为 `"left"`。

  - `left`：居左对齐（默认）
  - `right`：居右对齐
  - `center`：居中对齐
  - `justify`：分散对齐

### 前缀/后缀相关属性

- **prefix** (`React.ReactNode`): 输入框内部前缀内容。显示在输入框内部左侧，通常用于货币符号、单位等。

- **suffix** (`React.ReactNode`): 输入框内部后缀内容。显示在输入框内部右侧，通常用于单位、图标等。

### 插槽相关属性

- **before** (`React.ReactNode`): 输入框外部前置插槽。显示在输入框外部左侧，通常用于按钮、选择器等。

- **append** (`React.ReactNode`): 输入框外部后置插槽。显示在输入框外部右侧，通常用于按钮、单位选择器等。

### 长度限制相关属性

- **maxlength** (`number`): 最大字符数限制。限制输入内容的最大字符数（按字符计算，非字节）。

- **maxlengthB** (`number`): 最大字节数限制。限制输入内容的最大字节数（中文等字符按2-4字节计算）。配合 encoding 属性指定编码格式。

- **encoding** (`'utf-8' | 'shift-jis' | 'gbk'`): 字节编码格式，用于 maxlengthB 计算。默认为 `"utf-8"`。

  - `utf-8`：UTF-8 编码（默认），ASCII 1字节，中文/日文 3字节
  - `shift-jis`：Shift-JIS 编码（日文），ASCII 1字节，日文假名/汉字 2字节
  - `gbk`：GBK 编码（中文），ASCII 1字节，中文 2字节

- **hideCounter** (`boolean`): 是否隐藏字符/字节计数器。

  - 当设置了 maxlength 或 maxlengthB 时，默认显示计数器
  - 设置为 true 时强制隐藏计数器
  - 未设置 maxlength 和 maxlengthB 时，默认不显示计数器

  默认为 `false`（当设置了 maxlength 或 maxlengthB 时）。

### 颜色相关属性

- **color** (`string`): 主题颜色。用于控件获得焦点时的边框颜色，以及 Label（labelType 为 inner 或 top 时）的文字颜色。支持任意 CSS 颜色值（如 "#3b82f6"、"rgb(59,130,246)"、"blue"）。

- **bgColor** (`string`): 输入框背景色。支持任意 CSS 颜色值。

- **labelColor** (`string`): Label 背景色。仅在 `labelType="left"` 时生效，其他类型下此设置将被忽略。支持任意 CSS 颜色值。

### 宽度相关属性

- **inputWidth** (`number | string`): 输入框宽度。可以是数字（转为px）或字符串（如 "200px"、"50%"、"10rem" 等）。注意：此属性控制的是内部 input 元素的宽度，而非整个 TextInput 组件的宽度。

### 清除按钮相关属性

- **clearable** (`boolean`): 是否显示清除按钮。设置为 true 时，在输入框右侧显示清除图标，点击可清空输入内容。默认为 `false`。

- **onClear** (`() => void`): 清除按钮点击回调。当用户点击清除按钮清空输入内容时触发。

### 回调函数

- **onChange** (`React.ChangeEventHandler<HTMLInputElement>`): 值变化回调

- **onValueChange** (`(maskedValue: string, unmasked: string) => void`): 值变化回调（提供掩码值和纯净值）

  - `maskedValue`：掩码格式的展示值
  - `unmasked`：去除掩码的纯净值（仅在 mask 存在时有意义）

- **onFocus** (`React.FocusEventHandler<HTMLInputElement>`): 获得焦点回调

- **onBlur** (`React.FocusEventHandler<HTMLInputElement>`): 失去焦点回调

- **onKeyDown** (`React.KeyboardEventHandler<HTMLInputElement>`): 键盘按下回调

---

## Methods 方法

通过 ref 可以访问以下方法：

### validate()

手动触发验证，返回验证结果。

**返回值**：

- `true`：验证通过
- `false`：验证失败

**示例**：

```typescript
const inputRef = useRef<TextInputRef>(null)

const handleSubmit = () => {
  const isValid = inputRef.current?.validate()
  if (isValid) {
    // 提交表单
  }
}
```

### resetValidation()

重置验证状态，清除错误提示。

**示例**：

```typescript
const inputRef = useRef<TextInputRef>(null)

const handleReset = () => {
  inputRef.current?.resetValidation()
}
```

### getValue()

获取当前输入值。

**返回值**：当前输入的值

**示例**：

```typescript
const inputRef = useRef<TextInputRef>(null)

const handleGetValue = () => {
  const value = inputRef.current?.getValue()
  console.log(value)
}
```

### focus()

聚焦输入框。

**示例**：

```typescript
const inputRef = useRef<TextInputRef>(null)

const handleFocus = () => {
  inputRef.current?.focus()
}
```

### blur()

失焦输入框。

**示例**：

```typescript
const inputRef = useRef<TextInputRef>(null)

const handleBlur = () => {
  inputRef.current?.blur()
}
```

---

## Events 事件

### onChange

当输入值变化时触发。

**参数**：

- `e: React.ChangeEvent<HTMLInputElement>` - 原生 change 事件

**示例**：

```typescript
<TextInput
  onChange={(e) => {
    console.log('Value:', e.target.value)
  }}
/>
```

### onValueChange

当输入值变化时触发，提供掩码值和纯净值。

**参数**：

- `maskedValue: string` - 掩码格式的展示值
- `unmasked: string` - 去除掩码的纯净值

**示例**：

```typescript
<TextInput
  mask="(###) ###-####"
  onValueChange={(masked, unmasked) => {
    console.log('Masked:', masked)    // "(123) 456-7890"
    console.log('Unmasked:', unmasked) // "1234567890"
  }}
/>
```

### onFocus

当输入框获得焦点时触发。

**参数**：

- `e: React.FocusEvent<HTMLInputElement>` - 原生 focus 事件

**示例**：

```typescript
<TextInput
  onFocus={(e) => {
    console.log('Focused')
  }}
/>
```

### onBlur

当输入框失去焦点时触发。

**参数**：

- `e: React.FocusEvent<HTMLInputElement>` - 原生 blur 事件

**示例**：

```typescript
<TextInput
  onBlur={(e) => {
    console.log('Blurred')
  }}
/>
```

### onKeyDown

当键盘按键被按下时触发。

**参数**：

- `e: React.KeyboardEvent<HTMLInputElement>` - 原生 keydown 事件

**示例**：

```typescript
<TextInput
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed')
    }
  }}
/>
```

### onClear

当用户点击清除按钮时触发。

**示例**：

```typescript
<TextInput
  clearable
  onClear={() => {
    console.log('Cleared')
  }}
/>
```

---

## Slots 插槽

### prefix

输入框内部前缀内容，显示在输入框内部左侧。

**用途**：货币符号、单位、图标等

**示例**：

```typescript
<TextInput
  prefix="$"
  placeholder="0.00"
/>
```

### suffix

输入框内部后缀内容，显示在输入框内部右侧。

**用途**：单位、图标、百分比符号等

**示例**：

```typescript
<TextInput
  suffix="%"
  placeholder="0"
/>
```

### before

输入框外部前置插槽，显示在输入框外部左侧。

**用途**：按钮、选择器、图标等

**示例**：

```typescript
<TextInput
  before={<Button>搜索</Button>}
  placeholder="搜索内容"
/>
```

### append

输入框外部后置插槽，显示在输入框外部右侧。

**用途**：按钮、单位选择器、图标等

**示例**：

```typescript
<TextInput
  append={<Button>提交</Button>}
  placeholder="输入内容"
/>
```

---

## 使用示例

### 基础使用

```typescript
<TextInput
  placeholder="请输入用户名"
/>
```

### 掩码输入 - 电话号码

```typescript
<TextInput
  mask="(###) ###-####"
  placeholder="电话号码"
/>
```

### 掩码输入 - 日期

```typescript
<TextInput
  mask="####/##/##"
  placeholder="YYYY/MM/DD"
/>
```

### 填充掩码

```typescript
<TextInput
  mask="###-###-###"
  fillMask={true}
  fillChar="0"
  placeholder="___-___-___"
/>
```

### 反向填充掩码

```typescript
<TextInput
  mask="###-###-###"
  fillMask={true}
  fillChar="0"
  reverseFill={true}
  placeholder="___-___-___"
/>
```

### 验证功能

```typescript
<TextInput
  label="密码"
  labelType="top"
  type="password"
  rules={[
    (value) => value.length >= 6 || '至少需要6个字符',
    (value) => /\d+/.test(value) || '必须包含数字'
  ]}
/>
```

### 延迟验证

```typescript
<TextInput
  label="邮箱"
  labelType="top"
  lazyRules={true}
  rules={[
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '邮箱格式不正确'
  ]}
/>
```

### 浮动标签

```typescript
<TextInput
  label="用户名"
  labelType="inner"
  placeholder="请输入用户名"
/>
```

### 左侧标签

```typescript
<TextInput
  label="姓名"
  labelType="left"
  labelWidth="100px"
  labelAlign="right"
  placeholder="请输入姓名"
/>
```

### 前缀和后缀

```typescript
<TextInput
  prefix="$"
  suffix="USD"
  placeholder="0.00"
/>
```

### 外部插槽

```typescript
<TextInput
  before={<Button>搜索</Button>}
  append={<Button>提交</Button>}
  placeholder="输入内容"
/>
```

### 长度限制

```typescript
<TextInput
  maxlength={10}
  placeholder="最多10个字符"
/>
```

### 字节限制

```typescript
<TextInput
  maxlengthB={10}
  encoding="utf-8"
  placeholder="最多10字节"
/>
```

### 清除按钮

```typescript
<TextInput
  clearable
  placeholder="输入内容"
  onClear={() => console.log('Cleared')}
/>
```

### 受控模式

```typescript
const [value, setValue] = useState('')

<TextInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="受控输入框"
/>
```

### 自定义颜色

```typescript
<TextInput
  color="#3b82f6"
  bgColor="#f8fafc"
  labelColor="#1e40af"
  label="自定义颜色"
  labelType="top"
/>
```

### 自定义令牌

```typescript
const customTokens = {
  'X': {
    pattern: /[0-9A-Fa-f]/,
    transform: (char) => char.toUpperCase()
  }
}

<TextInput
  mask="XXXX-XXXX-XXXX-XXXX"
  tokens={customTokens}
  placeholder="XXXX-XXXX-XXXX-XXXX"
/>
```

### 完整示例

```typescript
import { TextInput } from '@/components/linc-ui/TextInput'
import { useRef, useState } from 'react'

function Example() {
  const inputRef = useRef<TextInputRef>(null)
  const [phone, setPhone] = useState('')

  const handleSubmit = () => {
    const isValid = inputRef.current?.validate()
    if (isValid) {
      console.log('Valid phone:', phone)
    }
  }

  return (
    <div>
      <TextInput
        ref={inputRef}
        label="电话号码"
        labelType="top"
        mask="(###) ###-####"
        fillMask={true}
        fillChar="_"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        rules={[
          (value) => value.replace(/\D/g, '').length === 10 || '请输入完整的电话号码'
        ]}
        clearable
        placeholder="(___) ___-____"
      />
      <button onClick={handleSubmit}>提交</button>
    </div>
  )
}
```

---

## 类型定义

### MaskToken

```typescript
interface MaskToken {
  pattern: RegExp
  transform?: (char: string) => string
}
```

### MaskTokenMap

```typescript
type MaskTokenMap = Record<string, MaskToken>
```

### ValidationRule

```typescript
type ValidationRule = (value: string) => boolean | string
```

### TextInputRef

```typescript
interface TextInputRef {
  validate: () => boolean
  resetValidation: () => void
  getValue: () => string
  focus: () => void
  blur: () => void
}
```

---

## 注意事项

1. **掩码输入**：使用掩码时，非法字符会被自动过滤，不会影响输入状态
2. **受控模式**：使用 `value` 属性时，组件进入受控模式，必须通过 `onChange` 更新值
3. **验证触发**：`lazyRules` 可以优化性能，避免频繁验证
4. **IME输入**：组件完美支持日文等输入法，IME组合过程中不会触发验证
5. **光标位置**：掩码输入时，光标会自动定位到正确的令牌位置
6. **填充字符**：当 `fillChar` 设置为数字字符（如 "0"）时，非法输入不会导致自动填充

---

## 更新日志

### v1.0.0
- 初始版本发布
- 支持掩码输入
- 支持验证功能
- 支持多种标签样式
- 支持前后缀和插槽
- 支持长度限制
- 支持IME输入
- 支持清除按钮
