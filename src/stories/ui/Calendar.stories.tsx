import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

/**
 * `Calendar` 是日期选择组件，基于 `react-day-picker` 封装。
 *
 * ### 使用方式
 * ```tsx
 * import { Calendar } from '@/components/ui/calendar'
 * import { useState } from 'react'
 *
 * const [date, setDate] = useState<Date | undefined>()
 *
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 * />
 * ```
 *
 * ### 主要属性
 * - `mode`：选择模式，`single`（单选）、`multiple`（多选）、`range`（范围）
 * - `captionLayout`：标题布局，`label`（纯文字）、`dropdown`（年月下拉）、`dropdown-years`
 * - `showOutsideDays`：是否显示当前月之外的日期
 * - `buttonVariant`：导航按钮的 Button 变体
 * - `disabled`：禁用规则，可以是日期数组或函数
 */
const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '日历组件，基于 react-day-picker。支持单选/多选/范围三种模式，可选年月下拉导航，支持禁用日期规则。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range', 'default'],
      description: '日期选择模式',
      table: {
        type: { summary: "'single' | 'multiple' | 'range' | 'default'" },
        defaultValue: { summary: 'single' },
      },
    },
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      description: '标题布局方式',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'label' },
      },
    },
    showOutsideDays: {
      control: 'boolean',
      description: '是否显示当前月之外的日期',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    buttonVariant: {
      control: 'select',
      options: ['ghost', 'outline', 'secondary', 'default'],
      description: '导航按钮的 Button 变体',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'ghost' },
      },
    },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const SingleMode: Story = {
  name: '单选模式',
  parameters: {
    docs: {
      description: { story: 'mode="single" 每次只能选择一个日期。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <p className="text-sm text-muted-foreground">
          选中日期：<strong>{date ? date.toLocaleDateString('zh-CN') : '未选择'}</strong>
        </p>
      </div>
    )
  },
}

export const RangeMode: Story = {
  name: '范围选择模式',
  parameters: {
    docs: {
      description: { story: 'mode="range" 支持选择开始/结束日期区间，选中区间会高亮显示。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
        <p className="text-sm text-muted-foreground">
          {range?.from
            ? `${range.from.toLocaleDateString('zh-CN')} → ${range.to?.toLocaleDateString('zh-CN') ?? '选择结束日期'}`
            : '请点击选择开始日期'}
        </p>
      </div>
    )
  },
}

export const MultipleMode: Story = {
  name: '多选模式',
  parameters: {
    docs: {
      description: { story: 'mode="multiple" 允许选中多个不连续的日期。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dates, setDates] = useState<Date[] | undefined>([])
    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar mode="multiple" selected={dates} onSelect={setDates} />
        <p className="text-sm text-muted-foreground">
          已选 {dates?.length ?? 0} 个日期
        </p>
      </div>
    )
  },
}

export const WithDropdown: Story = {
  name: '下拉导航',
  parameters: {
    docs: {
      description: { story: 'captionLayout="dropdown" 显示年月下拉选择器，方便快速跳转。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
      />
    )
  },
}

export const WithDisabledDates: Story = {
  name: '禁用特定日期',
  parameters: {
    docs: {
      description: { story: '通过 disabled 属性禁用特定日期（如周末、节假日）。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState<Date | undefined>()
    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={[
            { dayOfWeek: [0, 6] }, // 禁用周末
          ]}
        />
        <p className="text-sm text-muted-foreground">周末日期已禁用（灰色）</p>
      </div>
    )
  },
}

export const HideOutsideDays: Story = {
  name: '隐藏月外日期',
  args: {
    showOutsideDays: false,
  },
  render: (args) => (
    <Calendar mode="single" {...args} />
  ),
}
