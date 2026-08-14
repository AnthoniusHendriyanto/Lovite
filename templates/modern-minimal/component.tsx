import type { InvitationData } from '@/types'
import InvitationShell from '@/components/invitation/InvitationShell'

export default function ModernMinimalTemplate({
  data,
  guestName,
}: {
  data: InvitationData
  guestName?: string
}) {
  return <InvitationShell data={data} guestName={guestName} />
}