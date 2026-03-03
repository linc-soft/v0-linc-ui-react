import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { TrashIcon, TriangleAlertIcon, InfoIcon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

/**
 * `AlertDialog` 是确认对话框组件，基于 Radix UI AlertDialog 封装。
 *
 * 使用场景：需要用户确认的不可逆操作（如删除、退出、重置）。
 *
 * 子组件：
 * - `AlertDialog`：根组件
 * - `AlertDialogTrigger`：触发按钮
 * - `AlertDialogContent`：对话框内容（支持 default/sm 两种尺寸）
 * - `AlertDialogHeader`：头部区域
 * - `AlertDialogMedia`：头部媒体区域（图标/图片）
 * - `AlertDialogTitle`：对话框标题
 * - `AlertDialogDescription`：描述文字
 * - `AlertDialogFooter`：底部操作区
 * - `AlertDialogAction`：确认按钮（基于 Button）
 * - `AlertDialogCancel`：取消按钮（默认 outline 变体）
 *
 * ### 注意事项
 * - `AlertDialogAction` 和 `AlertDialogCancel` 都接受 `variant` 和 `size` 属性
 * - 对话框关闭时焦点会自动返回到触发元素
 */
const meta = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '确认对话框组件，基于 Radix UI AlertDialog。内置 AlertDialogMedia、Header、Footer 结构，支持 default/sm 两种内容尺寸。',
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
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认（删除确认）',
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon />
          删除账号
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除账号？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作无法撤销。您的账号、数据和个人信息将被永久删除，且无法恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction variant="destructive">确认删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const SmallSize: Story = {
  name: '小尺寸 (sm)',
  parameters: {
    docs: {
      description: {
        story:
          'AlertDialogContent 的 size="sm" 适用于简短确认操作，宽度更窄并自动使用两列底部按钮布局。',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">小型对话框</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>确认退出？</AlertDialogTitle>
          <AlertDialogDescription>未保存的更改将丢失。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>留下</AlertDialogCancel>
          <AlertDialogAction variant="destructive">退出</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const WithMedia: Story = {
  name: '带媒体图标',
  parameters: {
    docs: {
      description: {
        story:
          'AlertDialogMedia 在对话框头部显示图标区域，提升视觉表达力。sm 尺寸下居中显示，default 尺寸下与文字并列。',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <TriangleAlertIcon />
          危险操作
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlertIcon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>危险操作</AlertDialogTitle>
          <AlertDialogDescription>
            此操作将重置所有配置为出厂默认值，且无法恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction variant="destructive">确认重置</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const WithMediaDefault: Story = {
  name: '带媒体图标（Default 尺寸）',
  parameters: {
    docs: {
      description: {
        story:
          'Default 尺寸下，AlertDialogMedia 与标题/描述并列排布（sm 断点后）。',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <InfoIcon />
          信息提示
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <InfoIcon className="text-primary" />
          </AlertDialogMedia>
          <AlertDialogTitle>功能说明</AlertDialogTitle>
          <AlertDialogDescription>
            此功能仅对订阅用户开放，升级后可立即解锁所有高级功能。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>稍后再说</AlertDialogCancel>
          <AlertDialogAction>立即升级</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const CustomActionVariants: Story = {
  name: '自定义操作按钮变体',
  parameters: {
    docs: {
      description: {
        story:
          'AlertDialogAction 和 AlertDialogCancel 均支持 Button 的全部 variant 和 size。',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button>自定义按钮变体</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>发布确认</AlertDialogTitle>
          <AlertDialogDescription>
            发布后内容将对所有用户可见，请确认内容已审核无误。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost">暂不发布</AlertDialogCancel>
          <AlertDialogAction variant="default">立即发布</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
