import type { Meta, StoryObj } from '@storybook/react'
import { CircleIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

/**
 * `Badge` 是小型标签组件，用于状态标记、分类展示或数量提示。
 *
 * 支持 `asChild` 模式，可将样式应用到 `<a>` 等元素上实现可点击标签。
 *
 * ### 使用方式
 * ```tsx
 * import { Badge } from '@/components/ui/badge'
 *
 * <Badge variant="default">新功能</Badge>
 * ```
 */
const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '标签/徽章组件，支持 6 种变体：default、secondary、destructive、outline、ghost、link。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: '标签外观变体',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description: '启用后将样式渗透到子元素',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: '标签内容',
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    children: '标签',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  args: {
    variant: 'default',
    children: '默认标签',
  },
}

export const AllVariants: Story = {
  name: '所有变体',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '展示全部 6 种外观变体。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  name: '带图标',
  parameters: {
    docs: {
      description: { story: '在标签内嵌入 SVG 图标，图标尺寸自动适配为 3 × 3。' },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge><CircleIcon className="fill-current" /> 在线</Badge>
      <Badge variant="secondary"><CircleIcon className="fill-current" /> 离线</Badge>
      <Badge variant="destructive"><CircleIcon className="fill-current" /> 错误</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  name: '状态标签场景',
  parameters: {
    docs: {
      description: { story: '典型的状态标记使用场景。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground w-20">订单状态</span>
        <Badge variant="default">已支付</Badge>
        <Badge variant="secondary">待处理</Badge>
        <Badge variant="destructive">已退款</Badge>
        <Badge variant="outline">已关闭</Badge>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground w-20">版本标记</span>
        <Badge variant="default">v2.0</Badge>
        <Badge variant="secondary">Beta</Badge>
        <Badge variant="destructive">Deprecated</Badge>
      </div>
    </div>
  ),
}

export const AsLink: Story = {
  name: '作为链接',
  parameters: {
    docs: {
      description: { story: '使用 asChild 将 Badge 样式应用到 <a> 标签，实现可点击标签。' },
    },
  },
  render: () => (
    <Badge asChild variant="outline">
      <a href="#" onClick={(e) => e.preventDefault()}>可点击标签</a>
    </Badge>
  ),
}
