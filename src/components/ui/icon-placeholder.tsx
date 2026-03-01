import * as React from "react"

import * as HugeIcons from "hugeicons-react"

type HugeIconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string
    color?: string
    strokeWidth?: string | number
  }
>

export type IconPlaceholderProps = {
  /** Icon name from lucide-react (kept for API compatibility, not rendered) */
  lucide?: string
  /** Icon name from @tabler/icons-react (kept for API compatibility, not rendered) */
  tabler?: string
  /** Icon name from hugeicons-react - the active icon library */
  hugeicons?: string
  /** Icon name from @phosphor-icons/react (kept for API compatibility, not rendered) */
  phosphor?: string
  /** Icon name from remixicon-react (kept for API compatibility, not rendered) */
  remixicon?: string
} & React.SVGProps<SVGSVGElement>

/**
 * Renders a Huge Icon by name.
 *
 * Pass the icon name via the `hugeicons` prop. All other icon-library props
 * (lucide, tabler, phosphor, remixicon) are accepted for API compatibility
 * but are intentionally stripped before the SVG is rendered.
 *
 * All remaining props (className, role, aria-label, data-*, etc.) are
 * forwarded to the underlying SVG element rendered by hugeicons-react.
 */
function IconPlaceholder({ hugeicons, ...fullProps }: IconPlaceholderProps) {
  // Strip non-SVG icon-library props so they are not forwarded to the DOM
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lucide, tabler, phosphor, remixicon, ...props } = fullProps

  if (!hugeicons) return null

  const Icon = (HugeIcons as Record<string, unknown>)[
    hugeicons
  ] as HugeIconComponent | undefined

  if (!Icon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[IconPlaceholder] Unknown hugeicons icon: "${hugeicons}". ` +
          `Make sure the name matches an export from hugeicons-react.`
      )
    }
    return null
  }

  return <Icon {...props} />
}

export { IconPlaceholder }
