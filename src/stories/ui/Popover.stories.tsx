import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { SettingsIcon } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * `Popover` 是弹出层组件，基于 Radix UI Popover 封装。
 *
 * 由以下子组件组成：
 * - `Popover`：根组件，管理开关状态
 * - `PopoverTrigger`：触发元素（点击时显示/隐藏弹出层）
 * - `PopoverContent`：弹出层内容容器（默认宽度 w-72）
 * - `PopoverHeader`：弹出层头部（可选）
 * - `PopoverTitle`：弹出层标题
 * - `PopoverDescription`：弹出层描述文字
 * - `PopoverAnchor`：自定义定位锚点
 *
 * ### 使用方式
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>打开</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>标题</PopoverTitle>
 *       <PopoverDescription>描述</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '弹出层组件，基于 Radix UI Popover。支持四方向定位，内置 PopoverHeader/Title/Description 结构子组件。',
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
    onOpenChange: {
      description: '显示/隐藏状态变化时的回调',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">打开弹出层</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>弹出层标题</PopoverTitle>
          <PopoverDescription>
            这里是弹出层的描述内容，可以放置任意信息。
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}

export const AllSides: Story = {
  name: '四方向弹出',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '通过 PopoverContent 的 side 属性控制弹出方向。' },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-32">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side}>
            <p className="text-sm">从 {side} 方向弹出</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

export const WithForm: Story = {
  name: '包含表单',
  parameters: {
    docs: {
      description: { story: '弹出层内可以放置表单元素，实现内联编辑功能。' },
    },
  },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SettingsIcon />
          编辑信息
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>编辑资料</PopoverTitle>
          <PopoverDescription>
            修改您的个人信息，完成后点击保存。
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="popover-name">姓名</Label>
            <Input id="popover-name" defaultValue="张三" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="popover-email">邮箱</Label>
            <Input
              id="popover-email"
              type="email"
              defaultValue="zhangsan@example.com"
            />
          </div>
          <Button className="mt-2">保存更改</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const CustomAlign: Story = {
  name: '对齐方式',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'PopoverContent 的 align 属性控制弹出层与触发器的对齐方式：start/center/end。',
      },
    },
  },
  render: () => (
    <div className="flex gap-4">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {align}
            </Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-40">
            <p className="text-center text-sm">align: {align}</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}
