import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * `Input` 是基础文本输入框组件。
 *
 * ### 使用方式
 * ```tsx
 * import { Input } from '@/components/ui/input'
 *
 * <Input type="text" placeholder="请输入内容" />
 * ```
 *
 * ### 注意事项
 * - 通过 `aria-invalid` 属性触发错误样式，无需添加额外 class
 * - 支持所有原生 `<input>` 属性，包括 `type`、`placeholder`、`value`、`onChange` 等
 */
const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '基础输入框，继承全部原生 input 属性，内置聚焦、错误、禁用三种状态样式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'file'],
      description: '输入框类型',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
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
      description: '错误状态（触发红色边框和焦点环样式）',
      table: {
        type: { summary: 'boolean | "true" | "false" | "grammar" | "spelling"' },
      },
    },
    value: {
      control: 'text',
      description: '受控模式下的输入值',
    },
    onChange: {
      description: '值变化时的回调',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    onChange: fn(),
    placeholder: '请输入内容',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  args: {
    type: 'text',
    placeholder: '请输入文本',
  },
}

export const AllTypes: Story = {
  name: '所有类型',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '展示常见的 input type 类型。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Input type="text" placeholder="文本输入 (text)" />
      <Input type="password" placeholder="密码输入 (password)" />
      <Input type="email" placeholder="邮箱输入 (email)" />
      <Input type="number" placeholder="数字输入 (number)" />
      <Input type="tel" placeholder="电话输入 (tel)" />
      <Input type="url" placeholder="URL 输入 (url)" />
      <Input type="search" placeholder="搜索输入 (search)" />
      <Input type="file" />
    </div>
  ),
}

export const WithLabel: Story = {
  name: '带标签',
  parameters: {
    docs: {
      description: { story: '配合 Label 组件使用，通过 htmlFor/id 关联实现可访问性。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      <Label htmlFor="username">用户名</Label>
      <Input id="username" type="text" placeholder="请输入用户名" />
    </div>
  ),
}

export const ErrorState: Story = {
  name: '错误状态',
  parameters: {
    docs: {
      description: { story: '通过 aria-invalid 触发错误样式，边框和焦点环变为红色。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      <Label htmlFor="email-error">邮箱地址</Label>
      <Input
        id="email-error"
        type="email"
        defaultValue="invalid-email"
        aria-invalid="true"
      />
      <p className="text-sm text-destructive">请输入有效的邮箱地址</p>
    </div>
  ),
}

export const Disabled: Story = {
  name: '禁用状态',
  args: {
    disabled: true,
    value: '不可编辑的内容',
    placeholder: '',
  },
}

export const WithDefaultValue: Story = {
  name: '带默认值',
  args: {
    defaultValue: '已有内容',
    type: 'text',
  },
}
