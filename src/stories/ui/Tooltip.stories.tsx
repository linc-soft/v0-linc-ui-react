import type { Meta, StoryObj } from '@storybook/react'
import { InfoIcon, HelpCircleIcon } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

/**
 * `Tooltip` 是提示气泡组件，基于 Radix UI Tooltip 封装。
 *
 * 由以下子组件组成：
 * - `TooltipProvider`：必须包裹在顶层，管理全局 `delayDuration`
 * - `Tooltip`：根组件，管理显示/隐藏状态
 * - `TooltipTrigger`：触发元素（hover/focus 时显示 Tooltip）
 * - `TooltipContent`：提示内容容器，支持 `side`（top/bottom/left/right）定位
 *
 * ### 使用方式
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger asChild>
 *       <Button>悬停我</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       <p>这是提示内容</p>
 *     </TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 *
 * ### 注意事项
 * - `TooltipTrigger` 使用 `asChild` 时，子元素必须能转发 ref
 * - `TooltipContent` 的 `sideOffset` 控制与触发元素的间距
 */
const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '提示气泡组件，基于 Radix UI Tooltip。支持四方向定位（top/bottom/left/right），默认无延迟（delayDuration=0）。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: '受控模式下的显示状态',
    },
    defaultOpen: {
      control: 'boolean',
      description: '非受控模式下的初始显示状态',
    },
    delayDuration: {
      control: { type: 'number', min: 0, max: 1000, step: 100 },
      description: '（在 TooltipProvider 上设置）hover 后显示的延迟毫秒数',
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认（悬停触发）',
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">悬停查看提示</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>这是提示内容</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const AllSides: Story = {
  name: '四方向定位',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '通过 TooltipContent 的 side 属性控制提示出现的方向。',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-32">
              上方 (top)
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">上方提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-32">
              下方 (bottom)
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">下方提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-32">
              左侧 (left)
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">左侧提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-32">
              右侧 (right)
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">右侧提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}

export const WithDelay: Story = {
  name: '自定义延迟',
  parameters: {
    docs: {
      description: {
        story:
          '通过 TooltipProvider 的 delayDuration 设置 hover 后显示的延迟（毫秒）。',
      },
    },
  },
  render: () => (
    <div className="flex gap-4">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">无延迟 (0ms)</Button>
          </TooltipTrigger>
          <TooltipContent>立即显示</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">延迟 500ms</Button>
          </TooltipTrigger>
          <TooltipContent>延迟 500ms 后显示</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}

export const OnIconButton: Story = {
  name: '图标按钮提示',
  parameters: {
    docs: {
      description: { story: '为图标按钮添加文字提示，增强可访问性。' },
    },
  },
  render: () => (
    <div className="flex gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="帮助">
              <HelpCircleIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>查看帮助文档</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="信息">
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>查看详细信息</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}

export const DefaultOpen: Story = {
  name: '默认展开',
  parameters: {
    docs: {
      description: {
        story: 'defaultOpen 为 true 时，Tooltip 在渲染后立即显示。',
      },
    },
  },
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button>默认展开</Button>
        </TooltipTrigger>
        <TooltipContent>我默认就显示</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
