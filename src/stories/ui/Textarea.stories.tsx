import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

/**
 * `Textarea` 是多行文本输入框，使用 CSS `field-sizing: content` 实现内容自适应高度。
 *
 * ### 使用方式
 * ```tsx
 * import { Textarea } from '@/components/ui/textarea'
 *
 * <Textarea placeholder="请输入多行内容" rows={4} />
 * ```
 */
const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '多行文本输入框，支持原生 textarea 全部属性，内置聚焦、错误、禁用状态，高度随内容自动增长（field-sizing: content）。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: '初始显示行数',
      table: {
        type: { summary: 'number' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    'aria-invalid': {
      control: 'boolean',
      description: '错误状态',
    },
    onChange: {
      description: '值变化回调',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLTextAreaElement>) => void' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    onChange: fn(),
    placeholder: '请输入内容...',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  args: {
    placeholder: '请输入多行文本...',
  },
}

export const WithLabel: Story = {
  name: '带标签',
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="textarea-desc">描述</Label>
      <Textarea id="textarea-desc" placeholder="请输入详细描述..." />
    </div>
  ),
}

export const WithDefaultValue: Story = {
  name: '带默认内容',
  args: {
    defaultValue:
      '这是一段默认填充的文本内容。\n支持换行显示。\n随内容增长自动调整高度。',
  },
}

export const ErrorState: Story = {
  name: '错误状态',
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="textarea-error">反馈内容</Label>
      <Textarea
        id="textarea-error"
        aria-invalid="true"
        defaultValue="内容过短"
      />
      <p className="text-destructive text-sm">反馈内容不得少于 20 个字符</p>
    </div>
  ),
}

export const Disabled: Story = {
  name: '禁用状态',
  args: {
    disabled: true,
    defaultValue: '此内容不可编辑',
  },
}

export const CustomRows: Story = {
  name: '指定行数',
  args: {
    rows: 6,
    placeholder: '展示 6 行高度...',
  },
}
