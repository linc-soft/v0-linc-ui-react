import type { Meta, StoryObj } from '@storybook/react'
import {
  SearchIcon,
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  DollarSignIcon,
  CopyIcon,
} from 'lucide-react'
import { useState } from 'react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'

/**
 * `InputGroup` 是增强型输入框容器组件，支持在输入框前后添加图标、文字、按钮等附加元素。
 *
 * 子组件：
 * - `InputGroup`：根容器，负责边框、聚焦和错误状态
 * - `InputGroupAddon`：附加元素容器，align 属性控制位置（inline-start/inline-end/block-start/block-end）
 * - `InputGroupText`：文本或图标展示元素（不可交互）
 * - `InputGroupButton`：可点击按钮元素，支持 xs/sm/icon-xs/icon-sm 四种尺寸
 * - `InputGroupInput`：内部输入框（替代原生 Input）
 * - `InputGroupTextarea`：内部多行文本框
 *
 * ### 使用方式
 * ```tsx
 * <InputGroup>
 *   <InputGroupAddon align="inline-start">
 *     <InputGroupText><SearchIcon /></InputGroupText>
 *   </InputGroupAddon>
 *   <InputGroupInput placeholder="搜索..." />
 * </InputGroup>
 * ```
 */
const meta = {
  title: 'UI/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'InputGroup 是带附加元素的输入框容器，支持图标、文本、按钮的前缀/后缀，以及 block 方向的顶部/底部附加区域。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '自定义 CSS 类名',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '搜索框（前缀图标）',
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <SearchIcon />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="搜索..." />
    </InputGroup>
  ),
}

export const WithSuffix: Story = {
  name: '后缀文本',
  parameters: {
    docs: {
      description: {
        story: '使用 align="inline-end" 将附加元素放在输入框末尾。',
      },
    },
  },
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="0.00" type="number" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>元</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithPrefixAndSuffix: Story = {
  name: '前后缀组合',
  parameters: {
    docs: {
      description: { story: '同时添加前缀和后缀元素。' },
    },
  },
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="金额" type="number" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithEmailPrefix: Story = {
  name: '邮箱前缀',
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="email-input">邮箱</Label>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <AtSignIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id="email-input"
          type="email"
          placeholder="example@domain.com"
        />
      </InputGroup>
    </div>
  ),
}

export const PasswordToggle: Story = {
  name: '密码可见切换',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '使用 InputGroupButton 在末尾添加可点击的切换按钮。',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [visible, setVisible] = useState(false)
    return (
      <div className="flex w-80 flex-col gap-2">
        <Label htmlFor="pwd">密码</Label>
        <InputGroup>
          <InputGroupInput
            id="pwd"
            type={visible ? 'text' : 'password'}
            placeholder="请输入密码"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? '隐藏密码' : '显示密码'}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    )
  },
}

export const WithCopyButton: Story = {
  name: '带复制按钮',
  parameters: {
    docs: {
      description: { story: 'InputGroupButton 的 sm 尺寸适合放置文字按钮。' },
    },
  },
  render: () => (
    <InputGroup>
      <InputGroupInput
        defaultValue="https://example.com/share/abc123"
        readOnly
        className="text-muted-foreground"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="sm"
          onClick={() =>
            navigator.clipboard.writeText('https://example.com/share/abc123')
          }
        >
          <CopyIcon />
          复制
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const BlockAddon: Story = {
  name: 'Block 附加（顶部/底部）',
  parameters: {
    docs: {
      description: {
        story:
          'align="block-start"/"block-end" 将附加元素放在输入框上方/下方，形成堆叠布局。',
      },
    },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>用户名</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="请输入用户名" />
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="请输入备注..." />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground text-xs">
            最多 200 字
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithTextarea: Story = {
  name: '多行文本框',
  parameters: {
    docs: {
      description: {
        story: 'InputGroupTextarea 替代 InputGroupInput 实现多行输入。',
      },
    },
  },
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="inline-start" className="self-start pt-3">
        <InputGroupText>备注</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="请输入备注内容..." />
    </InputGroup>
  ),
}

export const ErrorState: Story = {
  name: '错误状态',
  parameters: {
    docs: {
      description: {
        story:
          '通过 InputGroupInput 的 aria-invalid 触发 InputGroup 整体的错误样式。',
      },
    },
  },
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <AtSignIcon />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        type="email"
        defaultValue="invalid-email"
        aria-invalid="true"
      />
    </InputGroup>
  ),
}
