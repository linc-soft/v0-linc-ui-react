import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from '@/components/ui/combobox'

/**
 * `Combobox` 是可搜索下拉选择组件，基于 Base UI Combobox 封装。
 *
 * 支持以下功能：
 * - 单选/多选（通过 chips 模式）
 * - 实时搜索过滤
 * - 分组展示
 * - 空状态提示
 * - 可清除按钮
 *
 * 核心子组件：
 * - `Combobox`：根组件（Base UI Combobox.Root）
 * - `ComboboxInput`：搜索输入框（含触发器和清除按钮）
 * - `ComboboxContent`：弹出列表容器
 * - `ComboboxList`：列表内容区
 * - `ComboboxItem`：单个选项（自动处理选中状态和勾选图标）
 * - `ComboboxGroup` + `ComboboxLabel`：分组与标题
 * - `ComboboxEmpty`：无匹配结果时的空状态
 * - `ComboboxSeparator`：分组分隔线
 * - `ComboboxChips` + `ComboboxChip` + `ComboboxChipsInput`：多选 chip 模式
 *
 * ### 使用方式
 * ```tsx
 * <Combobox>
 *   <ComboboxInput placeholder="搜索..." />
 *   <ComboboxContent>
 *     <ComboboxList>
 *       <ComboboxItem value="react">React</ComboboxItem>
 *       <ComboboxItem value="vue">Vue</ComboboxItem>
 *     </ComboboxList>
 *     <ComboboxEmpty>没有找到匹配结果</ComboboxEmpty>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
const meta = {
  title: 'UI/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '可搜索下拉组件，基于 Base UI Combobox。支持单选、多选（chips 模式）、分组、空状态、可清除等特性。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '受控模式下的选中值（单选时为 string，多选时为 string[]）',
    },
    defaultValue: {
      control: 'text',
      description: '非受控模式下的初始值',
    },
    disabled: {
      control: 'boolean',
      description: '禁用 Combobox',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: '只读模式（仍可展开，但不可修改）',
    },
    onValueChange: {
      description: '选中值变化时的回调',
    },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const frameworks = [
  'React', 'Vue', 'Angular', 'Svelte', 'SolidJS',
  'Next.js', 'Nuxt', 'Remix', 'Astro', 'Vite',
]

export const Default: Story = {
  name: '基础单选',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('')
    return (
      <div className="flex flex-col items-center gap-3">
        <Combobox value={value} onValueChange={(v) => setValue(v as string)}>
          <ComboboxInput placeholder="搜索框架..." className="w-60" showClear={!!value} />
          <ComboboxContent>
            <ComboboxList>
              {frameworks.map((fw) => (
                <ComboboxItem key={fw} value={fw}>{fw}</ComboboxItem>
              ))}
            </ComboboxList>
            <ComboboxEmpty>没有找到匹配的框架</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
        <p className="text-sm text-muted-foreground">
          当前选择：<strong>{value || '未选择'}</strong>
        </p>
      </div>
    )
  },
}

export const WithGroups: Story = {
  name: '分组列表',
  parameters: {
    docs: {
      description: { story: '使用 ComboboxGroup + ComboboxLabel 对选项进行分类，ComboboxSeparator 作为组间分隔线。' },
    },
  },
  render: () => (
    <Combobox>
      <ComboboxInput placeholder="搜索技术栈..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>前端框架</ComboboxLabel>
            <ComboboxItem value="react">React</ComboboxItem>
            <ComboboxItem value="vue">Vue</ComboboxItem>
            <ComboboxItem value="angular">Angular</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>元框架</ComboboxLabel>
            <ComboboxItem value="nextjs">Next.js</ComboboxItem>
            <ComboboxItem value="nuxt">Nuxt</ComboboxItem>
            <ComboboxItem value="remix">Remix</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>构建工具</ComboboxLabel>
            <ComboboxItem value="vite">Vite</ComboboxItem>
            <ComboboxItem value="webpack">Webpack</ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
        <ComboboxEmpty>没有找到匹配结果</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  ),
}

export const MultipleChips: Story = {
  name: '多选（Chips 模式）',
  parameters: {
    docs: {
      description: { story: '通过 ComboboxChips 实现多选 chip 输入，每个选中项显示为可删除的标签。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [values, setValues] = useState<string[]>(['React', 'Vue'])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const anchor = useComboboxAnchor()

    return (
      <div className="flex flex-col gap-3 w-72">
        <Combobox
          multiple
          value={values}
          onValueChange={(v) => setValues(v as string[])}
        >
          <ComboboxChips ref={anchor} className="min-h-10">
            {values.map((v) => (
              <ComboboxChip key={v} value={v}>{v}</ComboboxChip>
            ))}
            <ComboboxChipsInput placeholder={values.length === 0 ? '选择框架...' : ''} />
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxList>
              {frameworks.map((fw) => (
                <ComboboxItem key={fw} value={fw}>{fw}</ComboboxItem>
              ))}
            </ComboboxList>
            <ComboboxEmpty>没有找到匹配结果</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
        <p className="text-sm text-muted-foreground">
          已选 {values.length} 项：{values.join(', ') || '无'}
        </p>
      </div>
    )
  },
}

export const WithClear: Story = {
  name: '可清除',
  parameters: {
    docs: {
      description: { story: 'ComboboxInput 的 showClear 属性显示清除按钮，点击后重置选中值。' },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('React')
    return (
      <Combobox value={value} onValueChange={(v) => setValue(v as string)}>
        <ComboboxInput
          placeholder="选择框架..."
          className="w-60"
          showClear={!!value}
        />
        <ComboboxContent>
          <ComboboxList>
            {frameworks.slice(0, 5).map((fw) => (
              <ComboboxItem key={fw} value={fw}>{fw}</ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
  },
}

export const WithDisabledItems: Story = {
  name: '禁用部分选项',
  render: () => (
    <Combobox>
      <ComboboxInput placeholder="选择套餐..." className="w-60" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxItem value="free">免费版</ComboboxItem>
          <ComboboxItem value="pro">专业版</ComboboxItem>
          <ComboboxItem value="enterprise" disabled>企业版（联系销售）</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

export const Disabled: Story = {
  name: '禁用状态',
  render: () => (
    <Combobox disabled defaultValue="React">
      <ComboboxInput placeholder="已禁用" className="w-60" />
      <ComboboxContent>
        <ComboboxList>
          {frameworks.map((fw) => (
            <ComboboxItem key={fw} value={fw}>{fw}</ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}
