import {
  Activity, BadgeCheck, Calculator, ClipboardCheck, GraduationCap, Handshake, Landmark,
  MessageSquareText, PiggyBank, PoundSterling, ShieldAlert, Users, Workflow, type LucideIcon,
} from 'lucide-react'

export const fnIcon: Record<string, LucideIcon> = {
  operations: Workflow,
  hr: Users,
  learning: GraduationCap,
  risk: ShieldAlert,
  finance: PoundSterling,
  lending: Landmark,
  savings: PiggyBank,
  audit: ClipboardCheck,
  accounts: Calculator,
  procurement: Handshake,
  quality: BadgeCheck,
  'customer-insights': MessageSquareText,
}

export function FnIcon({ id, size = 14 }: { id?: string | null; size?: number }) {
  const I = (id && fnIcon[id]) || Activity
  return <I size={size} aria-hidden="true" />
}
