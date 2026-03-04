import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextInput } from '@/components/linc-ui/TextInput/text-input'
import type { TextInputRef } from '@/components/linc-ui/TextInput/types'

describe('TextInput', () => {
  // ─────────────────────────────────────────────
  // 基础渲染测试
  // ─────────────────────────────────────────────

  describe('基础渲染', () => {
    it('应该正确渲染输入框', () => {
      render(<TextInput />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('应该支持 placeholder 属性', () => {
      render(<TextInput placeholder="请输入内容" />)
      expect(screen.getByPlaceholderText('请输入内容')).toBeInTheDocument()
    })

    it('应该支持 disabled 属性', () => {
      render(<TextInput disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('应该支持 defaultValue 属性', () => {
      render(<TextInput defaultValue="初始值" />)
      expect(screen.getByDisplayValue('初始值')).toBeInTheDocument()
    })

    it('应该支持 className 属性', () => {
      render(<TextInput className="custom-class" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })
  })

  // ─────────────────────────────────────────────
  // 掩码输入测试
  // ─────────────────────────────────────────────

  describe('掩码输入', () => {
    it('应该正确渲染带有掩码的输入框', () => {
      render(<TextInput mask="###-###" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('data-mask', '###-###')
    })

    it('应该支持 fillMask 属性', () => {
      render(<TextInput mask="###-###" fillMask fillChar="_" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('data-mask', '###-###')
    })

    it('应该支持 reverseFill 属性', () => {
      render(<TextInput mask="###-###" fillMask reverseFill />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })
  })

  // ─────────────────────────────────────────────
  // 验证功能测试
  // ─────────────────────────────────────────────

  describe('验证功能', () => {
    it('应该在值变化时触发验证 (受控模式)', async () => {
      const onValueChange = vi.fn()

      const { rerender } = render(
        <TextInput
          value=""
          onValueChange={onValueChange}
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'ab')

      // 更新 value 以触发重新渲染
      rerender(
        <TextInput
          value="ab"
          onValueChange={onValueChange}
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )

      expect(screen.getByText('至少输入3个字符')).toBeInTheDocument()
    })

    it('验证通过时不显示错误消息', () => {
      render(
        <TextInput
          value="abc"
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )

      expect(screen.queryByText('至少输入3个字符')).not.toBeInTheDocument()
    })

    it('应该支持 lazyRules=true 延迟验证', async () => {
      const { rerender } = render(
        <TextInput
          value=""
          lazyRules
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )

      const input = screen.getByRole('textbox')

      // 输入时不验证
      await userEvent.type(input, 'ab')
      rerender(
        <TextInput
          value="ab"
          lazyRules
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )
      expect(screen.queryByText('至少输入3个字符')).not.toBeInTheDocument()

      // 失焦时验证
      fireEvent.blur(input)
      await waitFor(() => {
        expect(screen.getByText('至少输入3个字符')).toBeInTheDocument()
      })
    })

    it('应该支持外部控制错误状态', () => {
      render(<TextInput error errorMessage="外部错误" />)

      expect(screen.getByText('外部错误')).toBeInTheDocument()
    })

    it('应该支持 hint 提示文本', () => {
      render(<TextInput hint="请输入有效内容" />)

      expect(screen.getByText('请输入有效内容')).toBeInTheDocument()
    })

    it('应该通过 ref 暴露 validate 方法', async () => {
      const ref = { current: null as TextInputRef | null }

      render(
        <TextInput
          ref={ref}
          value=""
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )

      let isValid: boolean | undefined
      await act(async () => {
        isValid = ref.current?.validate()
      })
      expect(isValid).toBe(false)
    })

    it('应该通过 ref 暴露 resetValidation 方法', async () => {
      const ref = { current: null as TextInputRef | null }

      render(
        <TextInput
          ref={ref}
          value=""
          rules={[(v) => v.length >= 3 || '至少输入3个字符']}
        />
      )

      // 先触发验证产生错误
      await act(async () => {
        ref.current?.validate()
      })

      await waitFor(() => {
        expect(screen.getByText('至少输入3个字符')).toBeInTheDocument()
      })

      // 重置验证状态
      await act(async () => {
        ref.current?.resetValidation()
      })

      await waitFor(() => {
        expect(screen.queryByText('至少输入3个字符')).not.toBeInTheDocument()
      })
    })
  })

  // ─────────────────────────────────────────────
  // 清除按钮测试
  // ─────────────────────────────────────────────

  describe('清除按钮', () => {
    it('有值时应显示清除按钮 (受控模式)', () => {
      render(<TextInput clearable value="test" />)

      expect(screen.getByLabelText('清除')).toBeInTheDocument()
    })

    it('无值时不应显示清除按钮', () => {
      render(<TextInput clearable value="" />)

      expect(screen.queryByLabelText('清除')).not.toBeInTheDocument()
    })

    it('点击清除按钮应清空输入', async () => {
      const onClear = vi.fn()
      const onValueChange = vi.fn()

      render(
        <TextInput clearable value="test" onClear={onClear} onValueChange={onValueChange} />
      )

      const clearButton = screen.getByLabelText('清除')
      await userEvent.click(clearButton)

      expect(onClear).toHaveBeenCalled()
      expect(onValueChange).toHaveBeenCalledWith('', '')
    })
  })

  // ─────────────────────────────────────────────
  // 计数器测试
  // ─────────────────────────────────────────────

  describe('字符计数器', () => {
    it('设置 maxlength 时应显示计数器', () => {
      render(<TextInput maxlength={10} value="test" />)

      expect(screen.getByText('4/10')).toBeInTheDocument()
    })

    it('设置 maxlengthB 时应显示字节计数器', () => {
      render(<TextInput maxlengthB={10} value="测试" />)

      // UTF-8 编码下，中文每个字符3字节
      expect(screen.getByText('6/10')).toBeInTheDocument()
    })

    it('hideCounter=true 时应隐藏计数器', () => {
      render(<TextInput maxlength={10} hideCounter value="test" />)

      expect(screen.queryByText('4/10')).not.toBeInTheDocument()
    })
  })

  // ─────────────────────────────────────────────
  // 标签类型测试
  // ─────────────────────────────────────────────

  describe('标签类型', () => {
    it('labelType="top" 时标签应显示在上方', () => {
      render(<TextInput label="用户名" labelType="top" />)

      const label = screen.getByText('用户名')
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
    })

    it('labelType="left" 时标签应显示在左侧', () => {
      render(<TextInput label="用户名" labelType="left" />)

      const label = screen.getByText('用户名')
      expect(label).toBeInTheDocument()
    })

    it('labelType="inner" 时标签应浮动显示', async () => {
      render(<TextInput label="用户名" labelType="inner" />)

      const label = screen.getByText('用户名')
      expect(label).toBeInTheDocument()

      // 聚焦时标签应浮动
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)

      await waitFor(() => {
        expect(label).toHaveClass('top-0')
      })
    })

    it('labelType="inner" 有值时标签应保持浮动', () => {
      render(<TextInput label="用户名" labelType="inner" value="test" />)

      const label = screen.getByText('用户名')
      expect(label).toHaveClass('top-0')
    })

    it('应该支持 labelWidth 属性', () => {
      render(<TextInput label="用户名" labelType="left" labelWidth={100} />)

      const label = screen.getByText('用户名')
      expect(label.style.width).toBe('100px')
    })

    it('应该支持 labelAlign 属性', () => {
      render(<TextInput label="用户名" labelType="left" labelAlign="right" />)

      const label = screen.getByText('用户名')
      expect(label.style.justifyContent).toBe('flex-end')
    })
  })

  // ─────────────────────────────────────────────
  // 受控/非受控模式测试
  // ─────────────────────────────────────────────

  describe('受控/非受控模式', () => {
    it('非受控模式下应能正常输入', async () => {
      render(<TextInput />)

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'hello')

      expect(input).toHaveValue('hello')
    })

    it('受控模式下应由 value 控制输入值', () => {
      const onValueChange = vi.fn()

      const { rerender } = render(
        <TextInput value="initial" onValueChange={onValueChange} />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('initial')

      // 模拟外部更新 value
      rerender(<TextInput value="updated" onValueChange={onValueChange} />)
      expect(input).toHaveValue('updated')
    })

    it('应该正确触发 onValueChange 回调', async () => {
      const onValueChange = vi.fn()

      render(<TextInput onValueChange={onValueChange} />)

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'a')

      expect(onValueChange).toHaveBeenCalledWith('a', 'a')
    })
  })

  // ─────────────────────────────────────────────
  // 前缀/后缀测试
  // ─────────────────────────────────────────────

  describe('前缀/后缀', () => {
    it('应该正确显示 prefix', () => {
      render(<TextInput prefix="¥" />)

      expect(screen.getByText('¥')).toBeInTheDocument()
    })

    it('应该正确显示 suffix', () => {
      render(<TextInput suffix="元" />)

      expect(screen.getByText('元')).toBeInTheDocument()
    })

    it('应该正确显示 before 插槽', () => {
      render(<TextInput before={<span>前缀</span>} />)

      expect(screen.getByText('前缀')).toBeInTheDocument()
    })

    it('应该正确显示 append 插槽', () => {
      render(<TextInput append={<span>后缀</span>} />)

      expect(screen.getByText('后缀')).toBeInTheDocument()
    })
  })

  // ─────────────────────────────────────────────
  // Ref 方法测试
  // ─────────────────────────────────────────────

  describe('Ref 方法', () => {
    it('应该通过 ref 调用 focus 方法', async () => {
      const ref = { current: null as TextInputRef | null }

      render(<TextInput ref={ref} />)

      await waitFor(() => {
        ref.current?.focus()
      })

      const input = screen.getByRole('textbox')
      await waitFor(() => {
        expect(input).toHaveFocus()
      })
    })

    it('应该通过 ref 调用 blur 方法', () => {
      const ref = { current: null as TextInputRef | null }

      render(<TextInput ref={ref} />)

      const input = screen.getByRole('textbox')

      // 直接调用 blur 方法
      ref.current?.blur()

      // blur 方法应该被调用，输入框不应有焦点
      expect(input).not.toHaveFocus()
    })

    it('应该通过 ref 调用 getValue 方法 (受控模式)', async () => {
      const ref = { current: null as TextInputRef | null }

      // 受控模式：value 由外部控制
      render(<TextInput ref={ref} value="test" onValueChange={() => {}} />)

      await waitFor(() => {
        expect(ref.current?.getValue()).toBe('test')
      })
    })
  })

  // ─────────────────────────────────────────────
  // 事件回调测试
  // ─────────────────────────────────────────────

  describe('事件回调', () => {
    it('应该触发 onFocus 回调', () => {
      const onFocus = vi.fn()

      render(<TextInput onFocus={onFocus} />)

      const input = screen.getByRole('textbox')
      fireEvent.focus(input)

      expect(onFocus).toHaveBeenCalled()
    })

    it('应该触发 onBlur 回调', () => {
      const onBlur = vi.fn()

      render(<TextInput onBlur={onBlur} />)

      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      fireEvent.blur(input)

      expect(onBlur).toHaveBeenCalled()
    })

    it('应该触发 onKeyDown 回调', () => {
      const onKeyDown = vi.fn()

      render(<TextInput onKeyDown={onKeyDown} />)

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(onKeyDown).toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // Backspace 删除测试
  // ─────────────────────────────────────────────

  describe('Backspace 删除', () => {
    it('无掩码时应正常删除字符', async () => {
      render(<TextInput />)

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')
      await userEvent.keyboard('{Backspace}')

      expect(input).toHaveValue('tes')
    })
  })

  // ─────────────────────────────────────────────
  // 颜色相关测试
  // ─────────────────────────────────────────────

  describe('颜色属性', () => {
    it('应该支持 color 属性', () => {
      render(<TextInput color="#ff0000" />)

      const input = screen.getByRole('textbox')
      expect(input.style.getPropertyValue('--input-focus-color')).toBe('#ff0000')
    })

    it('应该支持 bgColor 属性', () => {
      render(<TextInput bgColor="#f0f0f0" />)

      const input = screen.getByRole('textbox')
      // 浏览器会将颜色值转换为 rgb 格式
      expect(input.style.backgroundColor).toBe('rgb(240, 240, 240)')
    })

    it('labelType="left" 时应支持 labelColor 属性', () => {
      render(<TextInput label="标签" labelType="left" labelColor="#e0e0e0" />)

      const label = screen.getByText('标签')
      // 浏览器会将颜色值转换为 rgb 格式
      expect(label.style.backgroundColor).toBe('rgb(224, 224, 224)')
    })
  })
})
