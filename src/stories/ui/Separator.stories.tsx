import type { Meta, StoryObj } from '@storybook/react'

import { Separator } from '@/components/ui/separator'

/**
 * `Separator` 是分隔线组件，基于 Radix UI Separator 封装。
 *
 * 支持水平和垂直两个方向，纯视觉分隔时设置 `decorative={true}`。
 *
 * ### 使用方式
 * ```tsx
 * import { Separator } from '@/components/ui/separator'
 *
 * <Separator orientation="horizontal" />
 * ```
 */
const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '分隔线组件，支持 horizontal（水平）和 vertical（垂直）两个方向。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '分隔线方向',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    decorative: {
      control: 'boolean',
      description: '是否仅作装饰（纯视觉分隔时为 true，屏幕阅读器会忽略）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  name: '水平分隔线',
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Vertical: Story = {
  name: '垂直分隔线',
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="h-8 flex items-center">
        <Story />
      </div>
    ),
  ],
}

export const ContentDivider: Story = {
  name: '内容间分隔',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '在文字内容之间插入水平分隔线，提升视觉层次。' },
    },
  },
  render: () => (
    <div className="w-72 flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium">用户信息</p>
        <p className="text-sm text-muted-foreground">张三 / admin@example.com</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium">账号设置</p>
        <p className="text-sm text-muted-foreground">修改密码、关联账号</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm text-destructive">注销账号</p>
      </div>
    </div>
  ),
}

export const InlineVertical: Story = {
  name: '行内垂直分隔',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '在导航链接或按钮组之间插入垂直分隔线。' },
    },
  },
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="cursor-pointer hover:underline">首页</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="cursor-pointer hover:underline">产品</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="cursor-pointer hover:underline">文档</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="cursor-pointer hover:underline">关于</span>
    </div>
  ),
}
