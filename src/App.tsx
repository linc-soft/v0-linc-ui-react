import { useState } from 'react'
import { TextInput } from '@/components/linc-ui/TextInput/text-input'
import { Label } from '@/components/ui/label'

// ─────────────────────────────────────────────
// 演示区块
// ─────────────────────────────────────────────

interface DemoSectionProps {
  title: string
  description: string
  badge: string
  children: React.ReactNode
}

function DemoSection({
  title,
  description,
  badge,
  children,
}: DemoSectionProps) {
  return (
    <section className="border-border bg-card flex flex-col gap-5 rounded-xl border p-6">
      <div className="flex items-start gap-3">
        <span className="bg-primary/10 text-primary border-primary/20 mt-0.5 inline-flex shrink-0 items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
          {badge}
        </span>
        <div>
          <h2 className="text-foreground text-base leading-tight font-semibold">
            {title}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

interface FieldRowProps {
  label: string
  hint?: string
  children: React.ReactNode
  value?: string
}

function FieldRow({ label, hint, children, value }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-foreground text-sm font-medium">{label}</Label>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      <div className="flex flex-col gap-1">{children}</div>
      {value !== undefined && (
        <div className="mt-1 flex flex-wrap gap-2">
          <code className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs">
            <span className="text-foreground/40">值：</span>
            <span className="text-foreground">
              {value || <em className="opacity-40">（空）</em>}
            </span>
          </code>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 演示 1：基础输入
// ─────────────────────────────────────────────

function BasicDemo() {
  const [value, setValue] = useState('')

  return (
    <DemoSection
      badge="basic"
      title="基础输入"
      description="支持 placeholder、disabled、clearable 等基础属性。"
    >
      <FieldRow label="普通输入框">
        <TextInput placeholder="请输入内容" />
      </FieldRow>

      <FieldRow label="禁用状态">
        <TextInput disabled placeholder="禁用状态" />
      </FieldRow>

      <FieldRow label="可清除">
        <TextInput
          clearable
          placeholder="输入后可清除"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 2：标签类型
// ─────────────────────────────────────────────

function LabelDemo() {
  return (
    <DemoSection
      badge="label"
      title="标签类型"
      description="支持 inner（浮动标签）、left（左侧标签）、top（顶部标签）三种类型。"
    >
      <FieldRow label="浮动标签 (inner)">
        <TextInput label="用户名" labelType="inner" placeholder="请输入用户名" />
      </FieldRow>

      <FieldRow label="左侧标签 (left)">
        <TextInput
          label="姓名"
          labelType="left"
          labelWidth="100px"
          labelAlign="right"
          placeholder="请输入姓名"
        />
      </FieldRow>

      <FieldRow label="顶部标签 (top)">
        <TextInput label="邮箱" labelType="top" placeholder="请输入邮箱" />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 3：验证功能
// ─────────────────────────────────────────────

function ValidationDemo() {
  return (
    <DemoSection
      badge="validation"
      title="验证功能"
      description="支持自定义验证规则，多种验证触发模式。"
    >
      <FieldRow label="密码（实时验证）" hint="至少6个字符，必须包含数字">
        <TextInput
          label="密码"
          labelType="top"
          type="password"
          rules={[
            (value) => value.length >= 6 || '至少需要6个字符',
            (value) => /\d+/.test(value) || '必须包含数字',
          ]}
          placeholder="请输入密码"
        />
      </FieldRow>

      <FieldRow label="邮箱（延迟验证）" hint="lazyRules=true，失焦后验证">
        <TextInput
          label="邮箱"
          labelType="top"
          lazyRules
          rules={[
            (value) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '邮箱格式不正确',
          ]}
          placeholder="请输入邮箱"
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 4：前缀后缀
// ─────────────────────────────────────────────

function AffixDemo() {
  return (
    <DemoSection
      badge="affix"
      title="前缀/后缀"
      description="支持内部前缀后缀和外部插槽。"
    >
      <FieldRow label="价格输入">
        <TextInput prefix="$" suffix="USD" placeholder="0.00" />
      </FieldRow>

      <FieldRow label="搜索框（外部插槽）">
        <TextInput
          before={<span className="text-sm">🔍</span>}
          append={<span className="cursor-pointer text-sm">搜索</span>}
          placeholder="输入搜索内容"
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 5：长度限制
// ─────────────────────────────────────────────

function LengthLimitDemo() {
  return (
    <DemoSection
      badge="length"
      title="长度限制"
      description="支持字符数和字节数限制，自动显示计数器。"
    >
      <FieldRow label="字符限制" hint="maxlength=10">
        <TextInput maxlength={10} placeholder="最多10个字符" />
      </FieldRow>

      <FieldRow label="字节限制" hint="maxlengthB=10，UTF-8编码">
        <TextInput
          maxlengthB={10}
          encoding="utf-8"
          placeholder="最多10字节（中文约3个字符）"
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 6：受控模式
// ─────────────────────────────────────────────

function ControlledDemo() {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(value)
  }

  return (
    <DemoSection
      badge="controlled"
      title="受控模式 & 表单集成"
      description="TextInput 支持受控模式，与 react-hook-form 等表单库兼容。"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldRow label="受控输入">
          <TextInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入内容"
          />
        </FieldRow>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
          >
            提交
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('')
              setSubmitted(null)
            }}
            className="border-border bg-background text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            重置
          </button>
        </div>

        {submitted !== null && (
          <div className="border-border bg-muted/50 rounded-md border px-4 py-3">
            <p className="text-muted-foreground mb-1 text-xs">
              表单提交的值：
            </p>
            <code className="text-foreground font-mono text-sm break-all">
              {submitted || '（空）'}
            </code>
          </div>
        )}
      </form>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-background min-h-screen font-sans">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
        {/* 页头 */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold">
              TextInput
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              v1.0.0
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-bold text-balance">
            文本输入组件
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
            基于 Input
            组件扩展，支持验证、Label多形态、长度限制、前缀后缀及自定义颜色等功能。
          </p>
        </header>

        {/* 演示区块 */}
        <BasicDemo />
        <LabelDemo />
        <ValidationDemo />
        <AffixDemo />
        <LengthLimitDemo />
        <ControlledDemo />
      </div>
    </div>
  )
}
