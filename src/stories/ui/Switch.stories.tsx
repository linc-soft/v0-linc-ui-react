import type { Meta, StoryObj } from '@storybook/react'
import { action } from 'storybook/actions'
import { useState } from 'react'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

/**
 * `Switch` 是开关切换组件，基于 Radix UI Switch 封装。
 *
 * ### 使用方式
 * ```tsx
 * import { Switch } from '@/components/ui/switch'
 * import { Label } from '@/components/ui/label'
 *
 * <div className="flex items-center gap-2">
 *   <Switch id="notifications" />
 *   <Label htmlFor="notifications">开启通知</Label>
 * </div>
 * ```
 */
const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '开关组件，支持 sm/default 两种尺寸，提供受控/非受控模式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'default'],
      description: '开关尺寸',
      table: {
        type: { summary: "'sm' | 'default'" },
        defaultValue: { summary: 'default' },
      },
    },
    checked: {
      control: 'boolean',
      description: '受控模式下的选中状态',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: '非受控模式下的初始状态',
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
    onCheckedChange: {
      description: '状态改变回调',
      table: {
        type: { summary: '(checked: boolean) => void' },
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
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认',
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="switch-default" {...args} />
      <Label htmlFor="switch-default">开启通知</Label>
    </div>
  ),
}

export const AllSizes: Story = {
  name: '所有尺寸',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'sm 和 default 两种尺寸对比。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="switch-sm" size="sm" defaultChecked />
        <Label htmlFor="switch-sm">小尺寸 (sm)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-default" size="default" defaultChecked />
        <Label htmlFor="switch-default">默认尺寸 (default)</Label>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  name: '禁用状态',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="opacity-50">
          禁用（关闭）
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="opacity-50">
          禁用（开启）
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
      description: { story: '受控模式下通过外部状态管理开关值。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [enabled, setEnabled] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="controlled-switch"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Label htmlFor="controlled-switch">飞行模式</Label>
        </div>
        <p className="text-muted-foreground text-sm">
          状态：<strong>{enabled ? '已开启' : '已关闭'}</strong>
        </p>
      </div>
    )
  },
}

export const SettingsPanel: Story = {
  name: '设置面板场景',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '典型的设置列表场景，多个 Switch 独立控制不同选项。',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    })

    const toggle = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const items = [
      { key: 'notifications' as const, label: '消息通知' },
      { key: 'darkMode' as const, label: '深色模式' },
      { key: 'autoSave' as const, label: '自动保存' },
      { key: 'analytics' as const, label: '数据分析' },
    ]

    return (
      <div className="flex w-72 flex-col gap-4 rounded-lg border p-4">
        <h3 className="text-sm font-medium">系统设置</h3>
        {items.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="cursor-pointer">
              {label}
            </Label>
            <Switch
              id={key}
              checked={settings[key]}
              onCheckedChange={() => toggle(key)}
            />
          </div>
        ))}
      </div>
    )
  },
}
