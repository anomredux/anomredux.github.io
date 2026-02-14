import { useEffect } from 'react'

/**
 * Analytics integration via environment variables.
 *
 * Set in .env or GitHub Actions secrets:
 *   VITE_ANALYTICS_PROVIDER=plausible|umami
 *   VITE_ANALYTICS_ID=<domain or website-id>
 *   VITE_ANALYTICS_SRC=<optional custom script URL>
 *
 * Examples:
 *   Plausible Cloud:
 *     VITE_ANALYTICS_PROVIDER=plausible
 *     VITE_ANALYTICS_ID=anomredux.github.io
 *
 *   Umami Cloud:
 *     VITE_ANALYTICS_PROVIDER=umami
 *     VITE_ANALYTICS_ID=your-website-id
 *     VITE_ANALYTICS_SRC=https://your-umami.vercel.app/script.js
 */

const PROVIDER = import.meta.env.VITE_ANALYTICS_PROVIDER as string | undefined
const ID = import.meta.env.VITE_ANALYTICS_ID as string | undefined
const SRC = import.meta.env.VITE_ANALYTICS_SRC as string | undefined

export function Analytics() {
  useEffect(() => {
    if (!PROVIDER || !ID) return

    const script = document.createElement('script')
    script.async = true
    script.defer = true

    if (PROVIDER === 'plausible') {
      script.src = SRC ?? 'https://plausible.io/js/script.js'
      script.setAttribute('data-domain', ID)
    } else if (PROVIDER === 'umami') {
      script.src = SRC ?? 'https://cloud.umami.is/script.js'
      script.setAttribute('data-website-id', ID)
    } else {
      return
    }

    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
