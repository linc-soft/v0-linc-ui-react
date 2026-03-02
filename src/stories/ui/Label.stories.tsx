import type { Meta, StoryObj } from '@storybook/react'
import { InfoIcon } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * `Label` 是表单标签组件，基于 Radix UI Label 封装。
 *
 * 通过 `htmlFor` 与表单控件 `id` 关联，点击标签时会聚焦到对应控件。
 *
 * ### 使用方式
 * ```tsx
 * import { Label } from '@/components/ui/label'
 *
 * <Label htmlFor="email">邮箱地址</Label>
 * <Input id="email" type="email" />
 * ```
 *
 * ### 注意事项
 * - 支持在标签内嵌入图标（SVG 图标会自动适配尺寸）
 * - 当父元素包含 `data-disabled=true` 时，标签自动变为禁用外观
 */
const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '表单标签组件，基于 Radix UI Label。支持图标嵌入，与 disabled 父元素联动。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '标签内容（插槽）',
    },
    htmlFor: {
      control: 'text',
      description: '关联的表单控件 id',
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    children: '表单标签',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
}

export const WithInput: Story = {
  name: '与 Input 关联',
  parameters: {
    docs: {
      description: { story: '通过 htmlFor/id 关联，点击标签自动聚焦到输入框。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="label-input">用户名</Label>
      <Input id="label-input" placeholder="请输入用户名" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  name: '与 Checkbox 关联',
  parameters: {
    docs: {
      description: { story: '点击标签文字可触发复选框状态切换。' },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-checkbox" />
      <Label htmlFor="label-checkbox">记住我的登录状态</Label>
    </div>
  ),
}

export const WithIcon: Story = {
  name: '带图标',
  parameters: {
    docs: {
      description: { story: '在标签内嵌入图标，图标尺寸自动适配。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="label-icon-input">
        <InfoIcon className="text-muted-foreground" />
        帮助说明
      </Label>
      <Input id="label-icon-input" placeholder="请输入内容" />
    </div>
  ),
}

export const Required: Story = {
  name: '必填标识',
  parameters: {
    docs: {
      description: { story: '通过自定义内容在标签旁添加必填星号标识。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="required-input">
        邮箱地址
        <span className="text-destructive">*</span>
      </Label>
      <Input id="required-input" type="email" placeholder="请输入邮箱" />
    </div>
  ),
}
