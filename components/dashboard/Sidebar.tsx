'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = { href: string; icon: string; label: string }

const mainNav: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/invitations', icon: 'auto_stories', label: 'Undangan' },
  { href: '/gallery', icon: 'palette', label: 'Template' },
  { href: '/guests', icon: 'group', label: 'Tamu' },
  { href: '/rsvp', icon: 'event_available', label: 'RSVP' },
  { href: '/messages', icon: 'chat', label: 'Ucapan' },
  { href: '/gifts', icon: 'payments', label: 'Amplop' },
  { href: '/analytics', icon: 'monitoring', label: 'Analitik' },
]

const bottomNav: NavItem[] = [
  { href: '/settings', icon: 'settings', label: 'Pengaturan' },
  { href: '/publish', icon: 'publish', label: 'Publikasikan' },
]

function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  return (
    <ul className="flex flex-col gap-1 w-full font-body text-sm font-medium">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-8 py-3 w-full active:scale-95 duration-200 transition-colors ${
                active
                  ? 'bg-surface-alt text-primary border-r-4 border-primary'
                  : 'text-text hover:bg-surface-alt'
              }`}
            >
              <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default function Sidebar() {
  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-stone-200 flex flex-col py-6 z-20">
      <div className="px-8 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
          </div>
          <div>
            <h1 className="font-headline text-2xl font-bold text-primary">ByMean</h1>
            <p className="text-xs text-stone-500 font-medium">Wedding Manager</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        <NavLinks items={mainNav} />
      </div>
      <div className="mt-auto pt-4 border-t border-stone-100 w-full">
        <NavLinks items={bottomNav} />
      </div>
    </nav>
  )
}
