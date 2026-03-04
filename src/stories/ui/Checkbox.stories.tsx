import type { Meta, StoryObj } from '@storybook/react'
import { action } from 'storybook/actions'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

/**
 * `Checkbox` 是复选框组件，基于 Radix UI Checkbox 封装。
 *
 * ### 使用方式
 * ```tsx
 * import { Checkbox } from '@/components/ui/checkbox'
 * import { Label } from '@/components/ui/label'
 *
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">同意服务条款</Label>
 * </div>
 * ```
 *
 * ### 注意事项
 * - `checked` 可以是 `true | false | 'indeterminate'`，支持不确定状态
 * - 通过 `onCheckedChange` 接收状态变化，参数为 `boolean | 'indeterminate'`
 */
const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '复选框组件，基于 Radix UI Checkbox。支持受控/非受控模式、不确定状态（indeterminate）和禁用状态。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'radio',
      options: [true, false, 'indeterminate'],
      description: '选中状态：true / false / "indeterminate"（不确定）',
      table: {
        type: { summary: "boolean | 'indeterminate'" },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: '非受控模式下的初始选中状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: '是否必填（用于表单验证）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      description: '选中状态改变时的回调',
      table: {
        type: { summary: "(checked: boolean | 'indeterminate') => void" },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    onCheckedChange: action('onCheckedChange'),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="default-checkbox" {...args} />
      <Label htmlFor="default-checkbox">接受服务条款</Label>
    </div>
  ),
}

export const Checked: Story = {
  name: '已选中',
  args: {
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="checked-checkbox" {...args} />
      <Label htmlFor="checked-checkbox">已选中状态</Label>
    </div>
  ),
}

export const Indeterminate: Story = {
  name: '不确定状态',
  args: {
    checked: 'indeterminate',
  },
  parameters: {
    docs: {
      description: {
        story: '当子项部分选中时使用 indeterminate 状态（常见于树形结构）。',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="indeterminate-checkbox" {...args} />
      <Label htmlFor="indeterminate-checkbox">部分选中（不确定状态）</Label>
    </div>
  ),
}

export const Disabled: Story = {
  name: '禁用状态',
  parameters: {
    docs: {
      description: { story: '禁用后无法交互，透明度降低。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked" className="opacity-50">
          禁用未选中
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled checked />
        <Label htmlFor="disabled-checked" className="opacity-50">
          禁用已选中
        </Label>
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  name: '受控模式',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '受控模式下通过 checked 和 onCheckedChange 管理状态。',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <Label htmlFor="controlled">受控复选框</Label>
        </div>
        <p className="text-muted-foreground text-sm">
          当前状态：<strong>{checked ? '已选中' : '未选中'}</strong>
        </p>
      </div>
    )
  },
}

export const GroupExample: Story = {
  name: '复选框组示例',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '实际场景中的多选组，展示全选/全不选/不确定三种状态联动。',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState([
      { id: 'react', label: 'React', checked: true },
      { id: 'vue', label: 'Vue', checked: false },
      { id: 'angular', label: 'Angular', checked: true },
    ])

    const allChecked = items.every((i) => i.checked)
    const anyChecked = items.some((i) => i.checked)
    const parentState = allChecked ? true : anyChecked ? 'indeterminate' : false

    const toggle = (id: string) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
      )
    }

    const toggleAll = () => {
      setItems((prev) => prev.map((i) => ({ ...i, checked: !allChecked })))
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="all"
            checked={parentState}
            onCheckedChange={toggleAll}
          />
          <Label htmlFor="all" className="font-medium">
            全选框架
          </Label>
        </div>
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => toggle(item.id)}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
