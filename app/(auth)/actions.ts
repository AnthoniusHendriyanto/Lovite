'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = createClient()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=Kredensial salah')

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = createClient()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const displayName = String(formData.get('displayName'))

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  })
  if (error) redirect('/register?error=Gagal mendaftar, coba lagi')

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}
