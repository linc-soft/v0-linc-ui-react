import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MailIcon, LoaderIcon, TrashIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * `Button` 是基础交互按钮组件，支持多种外观变体和尺寸。
 *
 * 基于 Radix UI Slot 实现 `asChild` 模式，可与任意元素组合使用。
 *
 * ### 使用方式
 * ```tsx
 * import { Button } from '@/components/ui/button'
 *
 * <Button variant="default" size="default" onClick={() => {}}>
 *   点击我
 * </Button>
 * ```
 *
 * ### 注意事项
 * - `asChild` 为 `true` 时，组件会将样式渗透到子元素，子元素必须是单一 React 元素
 * - `disabled` 状态下 `pointer-events` 被禁用，无法触发点击事件
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '基础按钮组件，支持 6 种外观变体（default/destructive/outline/secondary/ghost/link）和 8 种尺寸（default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg）。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '按钮外观变体',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
      description: '按钮尺寸',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description: '启用后将样式渗透到子元素（使用 Radix Slot）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    children: {
      control: 'text',
      description: '按钮内容（插槽）',
    },
    onClick: {
      description: '点击事件回调',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    onClick: fn(),
    children: '按钮',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ---- 默认 ----

export const Default: Story = {
  name: '默认',
  args: {
    variant: 'default',
    size: 'default',
    children: '默认按钮',
  },
}

// ---- 所有变体 ----

export const AllVariants: Story = {
  name: '所有变体',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '展示全部 6 种外观变体。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

// ---- 所有尺寸 ----

export const AllSizes: Story = {
  name: '所有尺寸',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '展示全部 8 种尺寸。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon-xs"><PlusIcon /></Button>
      <Button size="icon-sm"><PlusIcon /></Button>
      <Button size="icon"><PlusIcon /></Button>
      <Button size="icon-lg"><PlusIcon /></Button>
    </div>
  ),
}

// ---- 带图标 ----

export const WithIcon: Story = {
  name: '带图标',
  parameters: {
    docs: {
      description: { story: '图标放在文字前后均可，SVG 尺寸由 CSS 自动适配。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button><MailIcon /> 发送邮件</Button>
      <Button variant="destructive"><TrashIcon /> 删除</Button>
      <Button variant="outline"><PlusIcon /> 新增</Button>
    </div>
  ),
}

// ---- 加载状态 ----

export const Loading: Story = {
  name: '加载状态',
  parameters: {
    docs: {
      description: { story: '通过 disabled 和旋转图标模拟加载中状态。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled><LoaderIcon className="animate-spin" /> 加载中...</Button>
      <Button variant="outline" disabled><LoaderIcon className="animate-spin" /> 提交中</Button>
    </div>
  ),
}

// ---- 禁用状态 ----

export const Disabled: Story = {
  name: '禁用状态',
  parameters: {
    docs: {
      description: { story: 'disabled 属性禁用按钮，opacity 降至 50%，点击事件不触发。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Default 禁用</Button>
      <Button variant="destructive" disabled>Destructive 禁用</Button>
      <Button variant="outline" disabled>Outline 禁用</Button>
    </div>
  ),
}

// ---- Destructive 变体 ----

export const Destructive: Story = {
  name: 'Destructive',
  args: {
    variant: 'destructive',
    children: '删除账号',
  },
}

// ---- Outline 变体 ----

export const Outline: Story = {
  name: 'Outline',
  args: {
    variant: 'outline',
    children: '取消操作',
  },
}

// ---- Ghost 变体 ----

export const Ghost: Story = {
  name: 'Ghost',
  args: {
    variant: 'ghost',
    children: '更多选项',
  },
}

// ---- Icon 按钮 ----

export const IconButton: Story = {
  name: 'Icon 按钮',
  args: {
    size: 'icon',
    variant: 'outline',
    children: <MailIcon />,
    'aria-label': '发送邮件',
  },
}
