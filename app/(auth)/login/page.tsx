import { signIn } from '../actions'
import { Input, Label } from '@/components/ui/Field'
import Button from '@/components/ui/Button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-alt flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <h1 className="font-headline text-4xl font-bold text-primary">ByMean</h1>
          <p className="text-sm text-stone-500 mt-1">Masuk ke akun kamu</p>
        </div>
        <form action={signIn} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          {searchParams.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {searchParams.error}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input name="email" id="email" type="email" required placeholder="kamu@email.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input name="password" id="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full rounded-full">Masuk</Button>
        </form>
        <p className="text-sm text-stone-500 text-center mt-4">
          Belum punya akun?{' '}
          <a href="/register" className="text-primary font-medium hover:text-primary-dark">Daftar</a>
        </p>
      </div>
    </div>
  )
}
