import {Link as RouterLink} from 'react-router-dom'

export default function DefaultLink({
  to,
  className = '',
  replace = false,
  children,
  ...props
}) {
  return (
    <RouterLink to={to} replace={replace} {...props}>
      {children}
    </RouterLink>
  )
}

export function Link({children, to, ...props}) {
  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  )
}
