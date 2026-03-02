import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

/**
 * `Spinner` 是加载指示器组件，基于 Lucide `Loader2Icon` 和 `animate-spin` 实现。
 *
 * 内置 `role="status"` 和 `aria-label="Loading"` 以支持无障碍访问。
 *
 * ### 使用方式
 * ```tsx
 * import { Spinner } from '@/components/ui/spinner'
 *
 * <Spinner className="size-6" />
 * ```
 *
 * ### 注意事项
 * - 通过 `className` 的 `size-*` 调整尺寸，默认为 `size-4`（16px）
 * - 通过 `className` 的 `text-*` 调整颜色，默认继承父元素颜色
 */
const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '加载动画组件，使用 SVG + CSS animation 实现旋转效果，支持任意尺寸和颜色定制。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '自定义类名，可控制尺寸（size-*）和颜色（text-*）',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'size-4 animate-spin' },
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
}

export const Sizes: Story = {
  name: '不同尺寸',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '通过 size-* 类控制尺寸。' },
    },
  },
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-3" />
        <span className="text-xs text-muted-foreground">size-3</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-4" />
        <span className="text-xs text-muted-foreground">size-4</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <span className="text-xs text-muted-foreground">size-6</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8" />
        <span className="text-xs text-muted-foreground">size-8</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-12" />
        <span className="text-xs text-muted-foreground">size-12</span>
      </div>
    </div>
  ),
}

export const Colors: Story = {
  name: '不同颜色',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '通过 text-* 类控制颜色。' },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6 text-foreground" />
        <span className="text-xs text-muted-foreground">默认</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6 text-primary" />
        <span className="text-xs text-muted-foreground">主色</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6 text-destructive" />
        <span className="text-xs text-muted-foreground">错误</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">静音</span>
      </div>
    </div>
  ),
}

export const InButton: Story = {
  name: '在按钮中',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '在按钮内嵌入 Spinner 表示加载状态。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>
        <Spinner />
        提交中...
      </Button>
      <Button variant="outline" disabled>
        <Spinner />
        加载中
      </Button>
      <Button variant="destructive" disabled>
        <Spinner />
        删除中
      </Button>
    </div>
  ),
}

export const FullPageLoading: Story = {
  name: '全屏加载',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '页面级加载状态的典型用法。' },
    },
  },
  render: () => (
    <div className="flex flex-col items-center justify-center gap-3 h-40 w-64 rounded-lg border">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm text-muted-foreground">数据加载中，请稍候...</p>
    </div>
  ),
}
