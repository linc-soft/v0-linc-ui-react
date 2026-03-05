import type { Meta, StoryObj } from '@storybook/react'
import { action } from 'storybook/actions'
import { useRef, useState } from 'react'

import { TextInput } from '@/components/linc-ui/TextInput/text-input'
import type { TextInputRef } from '@/components/linc-ui/TextInput/types'

type TextInputStoryArgs = React.ComponentProps<typeof TextInput>

function ControlledModePreview(args: TextInputStoryArgs) {
  const [value, setValue] = useState('')
  return (
    <TextInput
      {...args}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        args.onChange?.(e)
      }}
      placeholder="受控输入框"
    />
  )
}

function MethodsDemoPreview(args: TextInputStoryArgs) {
  const ref = useRef<TextInputRef>(null)
  const [lastValue, setLastValue] = useState('')
  const [lastValid, setLastValid] = useState<boolean | null>(null)

  return (
    <div className="space-y-2">
      <TextInput
        {...args}
        ref={ref}
        label="方法演示"
        labelType="top"
        rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        placeholder="请输入至少3个字符"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => {
            const ok = ref.current?.validate() ?? false
            setLastValid(ok)
            action('validate')(ok)
          }}
        >
          validate
        </button>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => {
            ref.current?.resetValidation()
            action('resetValidation')()
          }}
        >
          resetValidation
        </button>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => {
            ref.current?.focus()
            action('focus')()
          }}
        >
          focus
        </button>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => {
            ref.current?.blur()
            action('blur')()
          }}
        >
          blur
        </button>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => {
            const v = ref.current?.getValue() ?? ''
            setLastValue(v)
            action('getValue')(v)
          }}
        >
          getValue
        </button>
      </div>
      <div className="text-muted-foreground text-xs">
        <div>
          lastValid: {lastValid === null ? '未执行' : String(lastValid)}
        </div>
        <div>lastValue: {lastValue || '(空)'}</div>
      </div>
    </div>
  )
}

const meta = {
  title: 'Linc-UI/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TextInput 支持验证、Label 多形态、长度/字节限制、清除按钮、颜色与插槽能力。以下故事按 README 使用示例组织。',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[460px]">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: '请输入内容',
    onChange: action('onChange'),
    onValueChange: action('onValueChange'),
    onFocus: action('onFocus'),
    onBlur: action('onBlur'),
    onKeyDown: action('onKeyDown'),
    onClear: action('onClear'),
  },
  argTypes: {
    label: { control: 'text', description: '标签文本' },
    labelType: {
      control: 'select',
      options: ['inner', 'left', 'top'],
      description: '标签类型',
    },
    labelWidth: { control: 'text', description: '左侧标签宽度' },
    labelAlign: {
      control: 'select',
      options: ['left', 'right', 'center', 'justify'],
      description: '左侧标签对齐',
    },
    maxlength: { control: 'number', description: '最大字符数' },
    maxlengthB: { control: 'number', description: '最大字节数' },
    encoding: {
      control: 'select',
      options: ['utf-8', 'shift-jis', 'gbk'],
      description: '字节编码',
    },
    hideCounter: { control: 'boolean', description: '隐藏计数器' },
    clearable: { control: 'boolean', description: '显示清除按钮' },
    color: { control: 'color', description: '主题颜色' },
    bgColor: { control: 'color', description: '输入框背景色' },
    labelColor: { control: 'color', description: '左侧标签背景色' },
    inputWidth: { control: 'text', description: '输入区域宽度' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    rules: { control: false },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    before: { control: false },
    append: { control: false },
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  name: '使用示例/基础使用',
  args: {
    placeholder: '请输入用户名',
  },
}

export const ValidationRules: Story = {
  name: '使用示例/验证功能',
  render: (args) => (
    <TextInput
      {...args}
      label="密码"
      labelType="top"
      type="password"
      rules={[
        (value) => value.length >= 6 || '至少需要6个字符',
        (value) => /\d+/.test(value) || '必须包含数字',
      ]}
      placeholder="请输入密码"
    />
  ),
}

export const LazyValidation: Story = {
  name: '使用示例/延迟验证',
  render: (args) => (
    <TextInput
      {...args}
      label="邮箱"
      labelType="top"
      lazyRules
      rules={[
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '邮箱格式不正确',
      ]}
      placeholder="请输入邮箱"
    />
  ),
}

export const FloatingLabel: Story = {
  name: '使用示例/浮动标签',
  args: {
    label: '用户名',
    labelType: 'inner',
    placeholder: '请输入用户名',
  },
}

export const LeftLabel: Story = {
  name: '使用示例/左侧标签',
  args: {
    label: '姓名',
    labelType: 'left',
    labelWidth: '100px',
    labelAlign: 'right',
    placeholder: '请输入姓名',
  },
}

export const PrefixOnly: Story = {
  name: '使用示例/前缀',
  args: {
    prefix: '$',
    placeholder: '0.00',
  },
}

export const SuffixOnly: Story = {
  name: '使用示例/后缀',
  args: {
    suffix: 'USD',
    placeholder: '0.00',
  },
}

export const PrefixAndSuffix: Story = {
  name: '使用示例/前缀+后缀',
  args: {
    prefix: '$',
    suffix: 'USD',
    placeholder: '0.00',
  },
}

export const OuterSlotBefore: Story = {
  name: '使用示例/外部插槽-before',
  render: (args) => (
    <TextInput
      {...args}
      before={<span onClick={action('beforeClick')}>搜索</span>}
      placeholder="输入内容"
    />
  ),
}

export const OuterSlotAppend: Story = {
  name: '使用示例/外部插槽-append',
  render: (args) => (
    <TextInput
      {...args}
      append={<span onClick={action('appendClick')}>提交</span>}
      placeholder="输入内容"
    />
  ),
}

export const OuterSlotBeforeAndAppend: Story = {
  name: '使用示例/外部插槽-before+append',
  render: (args) => (
    <TextInput
      {...args}
      before={<span onClick={action('beforeClick')}>搜索</span>}
      append={<span onClick={action('appendClick')}>提交</span>}
      placeholder="输入内容"
    />
  ),
}

export const MaxLengthLimit: Story = {
  name: '使用示例/长度限制',
  args: {
    maxlength: 10,
    placeholder: '最多10个字符',
  },
}

export const MaxByteLimit: Story = {
  name: '使用示例/字节限制',
  args: {
    maxlengthB: 10,
    encoding: 'utf-8',
    placeholder: '最多10字节',
  },
}

export const Clearable: Story = {
  name: '使用示例/清除按钮',
  args: {
    clearable: true,
    placeholder: '输入内容',
  },
}

export const ControlledMode: Story = {
  name: '使用示例/受控模式',
  render: (args) => <ControlledModePreview {...args} />,
}

export const CustomColor: Story = {
  name: '使用示例/自定义颜色',
  args: {
    color: '#3b82f6',
    bgColor: '#f8fafc',
    labelColor: '#1e40af',
    label: '自定义颜色',
    labelType: 'top',
    placeholder: '请输入内容',
  },
}

export const MethodsDemo: Story = {
  name: '方法演示/ref.validate-reset-focus-blur-getValue',
  render: (args) => <MethodsDemoPreview {...args} />,
}
