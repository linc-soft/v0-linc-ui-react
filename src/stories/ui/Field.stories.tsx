import type { Meta, StoryObj } from '@storybook/react'

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

/**
 * `Field` 是表单字段结构组件系列，提供一致的标签/描述/错误信息布局。
 *
 * 核心组件：
 * - `FieldSet`：表单区块（fieldset），包含多个 FieldGroup
 * - `FieldLegend`：区块标题（legend）
 * - `FieldGroup`：字段组容器
 * - `Field`：单个字段容器，支持 vertical/horizontal/responsive 三种方向
 * - `FieldLabel`：字段标签（封装 Label）
 * - `FieldTitle`：字段标题文字（非 Label 标签，用于只读展示）
 * - `FieldContent`：字段内容区（描述 + 错误）
 * - `FieldDescription`：字段描述/提示文字
 * - `FieldError`：字段错误信息（支持 errors 数组）
 * - `FieldSeparator`：字段间分隔线（可选带文字）
 *
 * ### 注意事项
 * - `Field` 的 `data-invalid="true"` 会触发整体红色错误样式
 * - `FieldError` 通过 `errors` prop 接受验证错误数组
 */
const meta = {
  title: 'UI/Field',
  component: Field,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Field 系列组件提供标准表单字段结构，支持 vertical/horizontal/responsive 三种布局方向，内置错误状态和描述文字。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'responsive'],
      description: '字段布局方向',
      table: {
        type: { summary: "'vertical' | 'horizontal' | 'responsive'" },
        defaultValue: { summary: 'vertical' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '垂直布局（默认）',
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-default">用户名</FieldLabel>
      <Input id="field-default" placeholder="请输入用户名" />
      <FieldDescription>用户名将显示在您的公开主页上</FieldDescription>
    </Field>
  ),
}

export const Horizontal: Story = {
  name: '水平布局',
  args: {
    orientation: 'horizontal',
  },
  parameters: {
    docs: {
      description: { story: 'horizontal 方向下，标签与控件水平排列，标签自动占用剩余宽度。' },
    },
  },
  render: (args) => (
    <FieldGroup>
      <Field {...args}>
        <FieldLabel htmlFor="h-name">姓名</FieldLabel>
        <Input id="h-name" placeholder="请输入姓名" />
      </Field>
      <Field {...args}>
        <FieldLabel htmlFor="h-email">邮箱</FieldLabel>
        <Input id="h-email" type="email" placeholder="请输入邮箱" />
      </Field>
    </FieldGroup>
  ),
}

export const WithError: Story = {
  name: '错误状态',
  parameters: {
    docs: {
      description: { story: '通过 data-invalid 触发红色错误样式，FieldError 显示错误信息。' },
    },
  },
  render: () => (
    <FieldGroup>
      <Field data-invalid="true">
        <FieldLabel htmlFor="error-email">邮箱地址</FieldLabel>
        <Input id="error-email" type="email" defaultValue="not-an-email" aria-invalid="true" />
        <FieldError>请输入有效的邮箱地址</FieldError>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="error-pwd">密码</FieldLabel>
        <Input id="error-pwd" type="password" defaultValue="123" aria-invalid="true" />
        <FieldError errors={[{ message: '密码至少需要 8 个字符' }, { message: '密码必须包含大写字母' }]} />
      </Field>
    </FieldGroup>
  ),
}

export const CompleteForm: Story = {
  name: '完整表单示例',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '使用 FieldSet + FieldGroup + Field 构建完整的表单结构。' },
    },
  },
  render: () => (
    <FieldSet className="w-96">
      <FieldLegend>账号信息</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-username">用户名</FieldLabel>
          <Input id="form-username" placeholder="请输入用户名" />
          <FieldDescription>3-20 个字符，支持字母、数字和下划线</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="form-email">邮箱地址</FieldLabel>
          <Input id="form-email" type="email" placeholder="请输入邮箱" />
        </Field>
        <Field data-invalid="true">
          <FieldLabel htmlFor="form-pwd">密码</FieldLabel>
          <Input id="form-pwd" type="password" defaultValue="123" aria-invalid="true" />
          <FieldError>密码至少需要 8 个字符</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const WithCheckboxes: Story = {
  name: '复选框字段',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'FieldLabel 包裹 Field 时，点击标签区域可直接切换 Checkbox 状态（带边框卡片样式）。' },
    },
  },
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="cb-notifications">
          <FieldContent>
            <FieldTitle>消息通知</FieldTitle>
            <FieldDescription>接收系统消息和活动提醒</FieldDescription>
          </FieldContent>
          <Switch id="cb-notifications" />
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="cb-marketing">
          <FieldContent>
            <FieldTitle>营销邮件</FieldTitle>
            <FieldDescription>接收产品更新和促销信息</FieldDescription>
          </FieldContent>
          <Switch id="cb-marketing" defaultChecked />
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const WithSeparator: Story = {
  name: '带分隔线',
  parameters: {
    docs: {
      description: { story: 'FieldSeparator 在字段之间添加分隔线，支持可选的文字内容。' },
    },
  },
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="sep-name">姓名</FieldLabel>
        <Input id="sep-name" placeholder="请输入姓名" />
      </Field>
      <FieldSeparator>或</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="sep-email">邮箱</FieldLabel>
        <Input id="sep-email" type="email" placeholder="请输入邮箱" />
      </Field>
    </FieldGroup>
  ),
}

export const RadioGroupField: Story = {
  name: '单选框字段组',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '使用 FieldSet 包装 RadioGroup，提供一致的字段结构。' },
    },
  },
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">选择套餐</FieldLegend>
      <RadioGroup defaultValue="standard" className="gap-3">
        {[
          { value: 'basic', label: '基础版', desc: '¥9.9/月，适合个人用户' },
          { value: 'standard', label: '标准版', desc: '¥29.9/月，适合小团队' },
          { value: 'pro', label: '专业版', desc: '¥99/月，适合企业用户' },
        ].map(({ value, label, desc }) => (
          <div key={value} className="flex items-start gap-2">
            <RadioGroupItem value={value} id={`plan-${value}`} className="mt-0.5" />
            <Field>
              <FieldLabel htmlFor={`plan-${value}`}>{label}</FieldLabel>
              <FieldDescription>{desc}</FieldDescription>
            </Field>
          </div>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
}
