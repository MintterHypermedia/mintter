import {useRouter} from 'next/router'
import Link from 'components/link'

export function MainNav() {
  const router = useRouter()
  return (
    <div className="mx-4 flex items-center">
      <NavItem href="/library" active={router.pathname.startsWith('/library/')}>
        Library
      </NavItem>
      <NavItem
        href="/settings"
        active={router.pathname.startsWith('/settings')}
      >
        Settings
      </NavItem>
    </div>
  )
}

export function NavItem({
  children,
  href,
  active = false,
  className = '',
  ...props
}) {
  return (
    <Link
      href={href}
      className={`mx-2 text-md font-semibold hover:bg-background-muted transition duration-200 ${className} ${
        active ? 'text-primary' : 'text-heading'
      }`}
      {...props}
    >
      {children}
    </Link>
  )
}
