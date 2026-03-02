import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

/**
 * `RadioGroup` 是单选框组组件，基于 Radix UI RadioGroup 封装。
 *
 * 由以下子组件组成：
 * - `RadioGroup`：根组件，管理选中值
 * - `RadioGroupItem`：单个单选框，需配合 `Label` 使用
 *
 * ### 使用方式
 * ```tsx
 * <RadioGroup defaultValue="option1">
 *   <div className="flex items-center gap-2">
 *     <RadioGroupItem value="option1" id="r1" />
 *     <Label htmlFor="r1">选项一</Label>
 *   </div>
 *   <div className="flex items-center gap-2">
 *     <RadioGroupItem value="option2" id="r2" />
 *     <Label htmlFor="r2">选项二</Label>
 *   </div>
 * </RadioGroup>
 * ```
 */
const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '单选框组组件，基于 Radix UI RadioGroup。支持垂直/水平排列、禁用状态和受控/非受控模式。',
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
      description: '非受控模式下的初始值',
    },
    disabled: {
      control: 'boolean',
      description: '禁用整个单选组',
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
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '布局方向（影响键盘导航，不影响视觉布局）',
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名，默认为 "grid gap-3"',
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认（垂直）',
  render: (args) => (
    <RadioGroup defaultValue="comfortable" {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">默认</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">舒适</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">紧凑</Label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  name: '水平排列',
  parameters: {
    docs: {
      description: { story: '通过自定义 className 将单选框排列为水平方向。' },
    },
  },
  render: (args) => (
    <RadioGroup defaultValue="react" className="flex gap-6" {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="react" id="h-react" />
        <Label htmlFor="h-react">React</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="vue" id="h-vue" />
        <Label htmlFor="h-vue">Vue</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="angular" id="h-angular" />
        <Label htmlFor="h-angular">Angular</Label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  name: '禁用状态',
  render: (args) => (
    <RadioGroup defaultValue="yes" disabled {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yes" id="d-yes" />
        <Label htmlFor="d-yes" className="opacity-50">是</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="no" id="d-no" />
        <Label htmlFor="d-no" className="opacity-50">否</Label>
      </div>
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  name: '受控模式',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '受控模式下通过外部状态管理选中值。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('standard')
    return (
      <div className="flex flex-col gap-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="economy" id="c-economy" />
            <Label htmlFor="c-economy">经济版 ¥9.9/月</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="standard" id="c-standard" />
            <Label htmlFor="c-standard">标准版 ¥29.9/月</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="premium" id="c-premium" />
            <Label htmlFor="c-premium">尊享版 ¥99/月</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          当前选择：<strong>{value}</strong>
        </p>
      </div>
    )
  },
}

export const DisabledItem: Story = {
  name: '禁用部分选项',
  parameters: {
    docs: {
      description: { story: '通过 RadioGroupItem 的 disabled 属性禁用单个选项。' },
    },
  },
  render: (args) => (
    <RadioGroup defaultValue="monthly" {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="pay-monthly" />
        <Label htmlFor="pay-monthly">按月付费</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yearly" id="pay-yearly" />
        <Label htmlFor="pay-yearly">按年付费（节省 20%）</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="lifetime" id="pay-lifetime" disabled />
        <Label htmlFor="pay-lifetime" className="opacity-50">终身授权（暂不可用）</Label>
      </div>
    </RadioGroup>
  ),
}
