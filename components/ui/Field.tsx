import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes } from 'react'

export function Label({ className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`block font-label text-xs font-semibold text-neutral-600 mb-1.5 ${className}`} {...props} />
}

const inputBase =
  'w-full rounded-lg border-neutral-200 focus:border-primary focus:ring-primary font-body text-sm px-3 py-2 text-text bg-neutral-50/50 focus:outline-none focus:ring-2'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputBase} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputBase} resize-none ${className}`} {...props} />
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${inputBase} ${className}`} {...props} />
}
