import type { Meta, StoryObj } from '@storybook/react'
import { UserIcon } from 'lucide-react'

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar'

/**
 * `Avatar` 是用户头像组件，由 Radix UI Avatar 封装。
 *
 * 包含以下子组件：
 * - `AvatarImage`：头像图片，图片加载失败时自动显示 Fallback
 * - `AvatarFallback`：图片加载失败时的占位内容
 * - `AvatarBadge`：头像右下角状态徽章
 * - `AvatarGroup`：头像组（叠加展示多个头像）
 * - `AvatarGroupCount`：头像组的额外数量提示
 *
 * ### 使用方式
 * ```tsx
 * import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
 *
 * <Avatar>
 *   <AvatarImage src="/avatar.png" alt="用户头像" />
 *   <AvatarFallback>张三</AvatarFallback>
 * </Avatar>
 * ```
 */
const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '用户头像组件，支持 sm/default/lg 三种尺寸，提供图片加载失败的 Fallback 机制，以及 AvatarBadge 状态标记和 AvatarGroup 头像组功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'default', 'lg'],
      description: '头像尺寸：sm(24px) / default(32px) / lg(40px)',
      table: {
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    size: 'default',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认（带图片）',
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="用户头像" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  name: 'Fallback（无图片）',
  parameters: {
    docs: {
      description: { story: '图片地址无效时自动显示 AvatarFallback 内容。' },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/invalid-url.png" alt="用户头像" />
      <AvatarFallback>张三</AvatarFallback>
    </Avatar>
  ),
}

export const AllSizes: Story = {
  name: '所有尺寸',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'sm(24px)、default(32px)、lg(40px) 三种尺寸对比。',
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="头像" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="头像" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="头像" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithBadge: Story = {
  name: '带状态徽章',
  parameters: {
    docs: {
      description: {
        story: 'AvatarBadge 在头像右下角显示状态指示点，支持自定义颜色和图标。',
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-6">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="头像" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-500" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>李四</AvatarFallback>
        <AvatarBadge className="bg-yellow-500" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
        <AvatarBadge className="bg-gray-400" />
      </Avatar>
    </div>
  ),
}

export const Group: Story = {
  name: '头像组',
  parameters: {
    docs: {
      description: {
        story:
          'AvatarGroup 将多个头像叠加展示，配合 AvatarGroupCount 显示剩余数量。',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="用户1" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>

      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="用户1" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  ),
}

export const FallbackWithIcon: Story = {
  name: 'Fallback 带图标',
  parameters: {
    docs: {
      description: { story: 'Fallback 内容可以使用图标代替文字缩写。' },
    },
  },
  render: () => (
    <Avatar size="lg">
      <AvatarFallback>
        <UserIcon className="size-5" />
      </AvatarFallback>
    </Avatar>
  ),
}
