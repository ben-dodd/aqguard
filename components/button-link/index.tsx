import Link from 'next/link'

function ButtonLink({ href = '/', className, children }) {
  return (
    (<Link
      href={href}
      className={`bg-white p-2 rounded uppercase text-sm font-bold text-center ${className}`}>

      {children}

    </Link>)
  );
}

export default ButtonLink
