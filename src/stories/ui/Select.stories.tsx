import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * `Select` 是下拉选择组件，基于 Radix UI Select 封装。
 *
 * 由以下子组件组成：
 * - `Select`：根组件，管理开关状态和选中值
 * - `SelectTrigger`：触发器按钮
 * - `SelectValue`：显示当前选中值的占位符
 * - `SelectContent`：下拉内容容器
 * - `SelectGroup`：选项分组
 * - `SelectLabel`：分组标题
 * - `SelectItem`：单个选项
 * - `SelectSeparator`：分组间分隔线
 *
 * ### 使用方式
 * ```tsx
 * <Select>
 *   <SelectTrigger className="w-48">
 *     <SelectValue placeholder="请选择" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">选项一</SelectItem>
 *     <SelectItem value="option2">选项二</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '下拉选择组件，基于 Radix UI Select。支持分组、分隔线、sm/default 两种触发器尺寸，以及禁用单个选项。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '受控模式下的选中值',
    },
    defaultValue: {
      control: 'text',
      description: '非受控模式下的初始选中值',
    },
    disabled: {
      control: 'boolean',
      description: '禁用整个 Select',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onValueChange: {
      description: '选中值变化时的回调',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    open: {
      control: 'boolean',
      description: '受控模式下的展开状态',
    },
    onOpenChange: {
      description: '展开/收起时的回调',
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="请选择水果" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">苹果</SelectItem>
        <SelectItem value="banana">香蕉</SelectItem>
        <SelectItem value="orange">橙子</SelectItem>
        <SelectItem value="mango">芒果</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  name: '带分组',
  parameters: {
    docs: {
      description: { story: '使用 SelectGroup + SelectLabel 对选项进行分类，SelectSeparator 作为分组间分隔线。' },
    },
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="请选择技术栈" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>前端框架</SelectLabel>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>后端框架</SelectLabel>
          <SelectItem value="nodejs">Node.js</SelectItem>
          <SelectItem value="django">Django</SelectItem>
          <SelectItem value="spring">Spring Boot</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const TriggerSizes: Story = {
  name: '触发器尺寸',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'SelectTrigger 支持 default（h-9）和 sm（h-8）两种尺寸。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Select>
        <SelectTrigger className="w-48" size="default">
          <SelectValue placeholder="Default 尺寸" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">选项 A</SelectItem>
          <SelectItem value="b">选项 B</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-48" size="sm">
          <SelectValue placeholder="Small 尺寸" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">选项 A</SelectItem>
          <SelectItem value="b">选项 B</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const WithDisabledItems: Story = {
  name: '禁用部分选项',
  parameters: {
    docs: {
      description: { story: '通过 SelectItem 的 disabled 属性禁用单个选项。' },
    },
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="请选择套餐" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">免费版</SelectItem>
        <SelectItem value="pro">专业版</SelectItem>
        <SelectItem value="enterprise" disabled>企业版（即将上线）</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  name: '禁用整体',
  args: {
    disabled: true,
    defaultValue: 'react',
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="已禁用" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithDefaultValue: Story = {
  name: '有初始值',
  args: {
    defaultValue: 'vue',
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="angular">Angular</SelectItem>
      </SelectContent>
    </Select>
  ),
}
