import type { Meta, StoryObj } from '@storybook/react'
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, BoldIcon, ItalicIcon, UnderlineIcon, ChevronDownIcon } from 'lucide-react'

import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
} from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

/**
 * `ButtonGroup` 是按钮组组件，将多个按钮/输入框/选择器组合成一个视觉整体。
 *
 * 由以下子组件组成：
 * - `ButtonGroup`：根容器，支持 horizontal/vertical 两个方向
 * - `ButtonGroupText`：文本标签元素（类似输入框的前缀/后缀标签）
 * - `ButtonGroupSeparator`：组内分隔线
 *
 * ### 使用方式
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="outline">按钮 A</Button>
 *   <Button variant="outline">按钮 B</Button>
 *   <Button variant="outline">按钮 C</Button>
 * </ButtonGroup>
 * ```
 *
 * ### 注意事项
 * - 内部元素的边框会自动合并，通过 CSS 负边距和圆角移除实现
 * - `ButtonGroupText` 内可以放置图标，尺寸自动适配
 */
const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ButtonGroup 将多个控件组合为视觉整体，支持 horizontal/vertical 方向，支持嵌入 Input、Select、ButtonGroupText。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '组合方向',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  args: {
    orientation: 'horizontal',
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '默认（按钮组）',
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">上一页</Button>
      <Button variant="outline">当前页</Button>
      <Button variant="outline">下一页</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  name: '垂直方向',
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">选项一</Button>
      <Button variant="outline">选项二</Button>
      <Button variant="outline">选项三</Button>
    </ButtonGroup>
  ),
}

export const IconButtons: Story = {
  name: '图标按钮组',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '常见的工具栏按钮组，使用 icon-sm 尺寸。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="左对齐">
          <AlignLeftIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="居中对齐">
          <AlignCenterIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="右对齐">
          <AlignRightIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="两端对齐">
          <AlignJustifyIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="加粗">
          <BoldIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="斜体">
          <ItalicIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="下划线">
          <UnderlineIcon />
        </Button>
      </ButtonGroup>
    </div>
  ),
}

export const WithText: Story = {
  name: '带文本标签',
  parameters: {
    docs: {
      description: { story: 'ButtonGroupText 作为前缀/后缀标签，与按钮或输入框组合使用。' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Input className="border-0 rounded-none shadow-none focus-visible:ring-0 w-48" placeholder="example.com" />
      </ButtonGroup>
      <ButtonGroup>
        <Input className="border-0 rounded-none shadow-none focus-visible:ring-0 w-36" placeholder="金额" type="number" />
        <ButtonGroupText>元</ButtonGroupText>
      </ButtonGroup>
    </div>
  ),
}

export const WithSelect: Story = {
  name: '与 Select 组合',
  parameters: {
    docs: {
      description: { story: 'ButtonGroup 内可以嵌入 SelectTrigger，实现下拉选择与按钮的组合。' },
    },
  },
  render: () => (
    <ButtonGroup>
      <Select defaultValue="cn">
        <SelectTrigger className="w-28 rounded-r-none border-r-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cn">+86</SelectItem>
          <SelectItem value="us">+1</SelectItem>
          <SelectItem value="uk">+44</SelectItem>
        </SelectContent>
      </Select>
      <Input className="border-0 rounded-l-none shadow-none focus-visible:ring-0 w-44 border border-input" placeholder="手机号码" />
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  name: '带分隔线',
  parameters: {
    docs: {
      description: { story: 'ButtonGroupSeparator 在按钮之间插入分隔线，用于视觉上的分组。' },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="outline">复制</Button>
      <Button variant="outline">粘贴</Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  ),
}
