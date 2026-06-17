import { IMG_BASE } from './axios'

export function imgUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `${IMG_BASE}${url}`
  return url
}
