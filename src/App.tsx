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
  unmasked?: string
}

function FieldRow({ label, hint, children, value, unmasked }: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-foreground text-sm font-medium">{label}</Label>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      <div className="flex flex-col gap-1">{children}</div>
      {(value !== undefined || unmasked !== undefined) && (
        <div className="mt-1 flex flex-wrap gap-2">
          {value !== undefined && (
            <code className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs">
              <span className="text-foreground/40">掩码值：</span>
              <span className="text-foreground">
                {value || <em className="opacity-40">（空）</em>}
              </span>
            </code>
          )}
          {unmasked !== undefined && (
            <code className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs">
              <span className="text-foreground/40">纯净值：</span>
              <span className="text-foreground">
                {unmasked || <em className="opacity-40">（空）</em>}
              </span>
            </code>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// 演示 1：基础掩码
// ─────────────────────────────────────────────

function MaskDemo() {
  const [phone, setPhone] = useState({ masked: '', raw: '' })
  const [date, setDate] = useState({ masked: '', raw: '' })
  const [ip, setIp] = useState({ masked: '', raw: '' })
  const [card, setCard] = useState({ masked: '', raw: '' })

  return (
    <DemoSection
      badge="mask"
      title="基础掩码（mask）"
      description="通过掩码模式限制输入格式，固定字符自动插入，用户仅需输入可变区域内容。"
    >
      <FieldRow
        label="电话号码 (### #### ####)"
        value={phone.masked}
        unmasked={phone.raw}
      >
        <TextInput
          mask="###-####-####"
          fillMask={true}
          fillChar="#"
          placeholder="请输入手机号"
          onValueChange={(m, u) => setPhone({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow label="YYYY-MM-DD" value={date.masked} unmasked={date.raw}>
        <TextInput
          mask="####-##-##"
          placeholder="YYYY-MM-DD"
          onValueChange={(m, u) => setDate({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="IP 地址 (###.###.###.###)"
        value={ip.masked}
        unmasked={ip.raw}
      >
        <TextInput
          mask="###.###.###.###"
          placeholder="192.168.000.001"
          onValueChange={(m, u) => setIp({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="银行卡号 (#### #### #### ####)"
        value={card.masked}
        unmasked={card.raw}
      >
        <TextInput
          mask="#### #### #### ####"
          placeholder="请输入银行卡号"
          onValueChange={(m, u) => setCard({ masked: m, raw: u })}
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 2：填充掩码
// ─────────────────────────────────────────────

function FillMaskDemo() {
  const [v1, setV1] = useState({ masked: '', raw: '' })
  const [v2, setV2] = useState({ masked: '', raw: '' })
  const [v3, setV3] = useState({ masked: '', raw: '' })

  return (
    <DemoSection
      badge="fill-mask"
      title="填充掩码（fill-mask）"
      description="未输入的令牌位由指定填充字符占位，让用户直观看到仍需填写的区域。"
    >
      <FieldRow
        label="默认填充字符 _ （手机号格式）"
        hint='fillMask fillChar="_"'
        value={v1.masked}
        unmasked={v1.raw}
      >
        <TextInput
          mask="### #### ####"
          fillMask
          fillChar="_"
          placeholder=""
          onValueChange={(m, u) => setV1({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="自定义填充字符 * （密码样式）"
        hint='fillMask fillChar="*"'
        value={v2.masked}
        unmasked={v2.raw}
      >
        <TextInput
          mask="####-####-####"
          fillMask
          fillChar="*"
          placeholder=""
          onValueChange={(m, u) => setV2({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="自定义填充字符 0 （产品序列号）"
        hint='fillMask fillChar="0"'
        value={v3.masked}
        unmasked={v3.raw}
      >
        <TextInput
          mask="###-###-###"
          fillMask
          fillChar="0"
          placeholder=""
          onValueChange={(m, u) => setV3({ masked: m, raw: u })}
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 3：反向填充掩码
// ─────────────────────────────────────────────

function ReverseFillMaskDemo() {
  const [amount, setAmount] = useState({ masked: '', raw: '' })
  const [time, setTime] = useState({ masked: '', raw: '' })

  return (
    <DemoSection
      badge="reverse-fill-mask"
      title="反向填充掩码（reverse-fill-mask）"
      description="用户输入从掩码右侧开始填充，适合金额输入等需要右对齐的场景。"
    >
      <FieldRow
        label="金额输入（右对齐）"
        hint='fillMask reverseFill fillChar="0"'
        value={amount.masked}
        unmasked={amount.raw}
      >
        <TextInput
          mask="¥ ### ### ###.##"
          fillMask
          reverseFill
          fillChar="0"
          placeholder=""
          onValueChange={(m, u) => setAmount({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="时间输入（HH:MM:SS，右对齐）"
        hint='fillMask reverseFill fillChar="0"'
        value={time.masked}
        unmasked={time.raw}
      >
        <TextInput
          mask="##:##:##"
          fillMask
          reverseFill
          fillChar="0"
          placeholder=""
          onValueChange={(m, u) => setTime({ masked: m, raw: u })}
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 4：未掩码值 & 自定义令牌
// ─────────────────────────────────────────────

function UnmaskedValueDemo() {
  const [hex, setHex] = useState({ masked: '', raw: '' })
  const [code, setCode] = useState({ masked: '', raw: '' })
  const [license, setLicense] = useState({ masked: '', raw: '' })

  return (
    <DemoSection
      badge="unmasked-value"
      title="未掩码值 & 自定义令牌（unmasked-value）"
      description="onChange 和 onValueChange 均可获取去除掩码后的纯净数据，方便表单提交与验证。支持通过 tokens 扩展自定义令牌。"
    >
      <FieldRow
        label="十六进制颜色值（自定义令牌 H = 0-9 a-f A-F）"
        hint="tokens 提供 H：/[0-9a-fA-F]/"
        value={hex.masked}
        unmasked={hex.raw}
      >
        <TextInput
          mask="#HHHHHH"
          tokens={{ H: { pattern: /[0-9a-fA-F]/ } }}
          placeholder="#1a2b3c"
          onValueChange={(m, u) => setHex({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="验证码（6 位数字）"
        hint='mask="# - # - # - # - # - #" unmaskedValue'
        value={code.masked}
        unmasked={code.raw}
      >
        <TextInput
          mask="# - # - # - # - # - #"
          unmaskedValue
          placeholder="0 - 0 - 0 - 0 - 0 - 0"
          onValueChange={(m, u) => setCode({ masked: m, raw: u })}
        />
      </FieldRow>

      <FieldRow
        label="车牌号（自定义令牌 C = 省份字母）"
        hint="tokens={{ C: { pattern: /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁夏] } }}"
        value={license.masked}
        unmasked={license.raw}
      >
        <TextInput
          mask="C A #####"
          tokens={{
            C: {
              pattern:
                /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁夏]/,
            },
            A: { pattern: /[A-Za-z]/, transform: (c) => c.toUpperCase() },
          }}
          placeholder="粤 A 12345"
          onValueChange={(m, u) => setLicense({ masked: m, raw: u })}
        />
      </FieldRow>
    </DemoSection>
  )
}

// ─────────────────────────────────────────────
// 演示 5：受控 & 表单集成
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
      description="TextInput 支持受控模式，与 react-hook-form 等表单库兼容，onChange 提供纯净值供表单校验。"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldRow label="统一社会信用代码（18 位字母数字）">
          <TextInput
            mask="WWWWWWWWWWWWWWWWWW"
            value={value}
            unmaskedValue
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入 18 位统一社会信用代码"
            className="font-mono tracking-widest"
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
              表单提交的纯净值：
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
// 令牌参考表
// ─────────────────────────────────────────────

function TokenReference() {
  const tokens = [
    { token: '#', desc: '单个数字', pattern: '/\\d/' },
    { token: 'A', desc: '单个字母（大小写）', pattern: '/[a-zA-Z]/' },
    { token: 'W', desc: '字母或数字', pattern: '/[a-zA-Z0-9]/' },
  ]

  return (
    <section className="border-border bg-card rounded-xl border p-6">
      <h2 className="text-foreground mb-4 text-base font-semibold">
        内置掩码令牌一览
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-foreground pr-6 pb-2 text-left font-semibold">
                令牌
              </th>
              <th className="text-foreground pr-6 pb-2 text-left font-semibold">
                描述
              </th>
              <th className="text-foreground pb-2 text-left font-semibold">
                正则模式
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {tokens.map((t) => (
              <tr key={t.token}>
                <td className="py-2.5 pr-6">
                  <code className="bg-primary/10 border-primary/20 text-primary rounded border px-2 py-0.5 font-mono text-xs font-semibold">
                    {t.token}
                  </code>
                </td>
                <td className="text-foreground py-2.5 pr-6">{t.desc}</td>
                <td className="py-2.5">
                  <code className="text-muted-foreground font-mono text-xs">
                    {t.pattern}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
        其余字符均视为固定分隔符，自动插入并在用户输入时跳过。 可通过{' '}
        <code className="font-mono">tokens</code> prop
        传入自定义令牌进行扩展或覆盖。
      </p>
    </section>
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
            高级掩码输入组件
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
            基于基础 Input
            组件扩展，支持掩码格式化、填充掩码、反向填充掩码及未掩码值绑定四大核心功能。
          </p>
        </header>

        {/* 演示区块 */}
        <MaskDemo />
        <FillMaskDemo />
        <ReverseFillMaskDemo />
        <UnmaskedValueDemo />
        <ControlledDemo />
        <TokenReference />
      </div>
    </div>
  )
}
