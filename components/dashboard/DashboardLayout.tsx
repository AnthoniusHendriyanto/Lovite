import type { ReactNode } from 'react'
import type { Wedding } from '@/types'
import { signOut } from '@/app/(auth)/actions'
import Sidebar from './Sidebar'

type DashboardLayoutProps = {
  children: ReactNode
  wedding?: Pick<Wedding, 'couple_names' | 'status'> | null
  avatarUrl?: string | null
}

export default function DashboardLayout({ children, wedding, avatarUrl }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-10 bg-white/80 backdrop-blur-md border-b border-stone-200 flex justify-between items-center px-8 h-16">
          <div className="flex items-center gap-4">
            <h2 className="font-headline text-xl text-text">
              {wedding?.couple_names ?? 'Raka & Nadia'} — Pernikahan
            </h2>
            {wedding?.status && (
              <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-full font-label uppercase tracking-wider">
                {wedding.status === 'published' ? 'Published' : 'Draft'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 cursor-pointer active:opacity-70 group">
            <div className="text-right hidden md:block">
              <p className="font-body text-sm font-medium text-text group-hover:text-primary transition-colors">
                {wedding?.couple_names ?? 'Raka & Nadia'}
              </p>
              <p className="font-label text-xs text-stone-500">Couple</p>
            </div>
            {avatarUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-200">
                <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-headline font-semibold">
                {(wedding?.couple_names ?? 'R').charAt(0)}
              </div>
            )}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-label text-stone-400 hover:text-primary transition-colors"
              title="Keluar"
            >
              Keluar
            </button>
          </form>
        </header>
        <main className="mt-16 p-8 max-w-7xl w-full mx-auto flex-1">{children}</main>
      </div>
    </div>
  )
}
