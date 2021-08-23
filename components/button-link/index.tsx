import Link from "next/link";
import cn from "clsx";

function ButtonLink({ href = "/", className, children }) {
  return (
    <Link href={href}>
      <a
        className={`bg-white p-2 rounded uppercase text-sm font-bold text-center ${className}`}
      >
        {children}
      </a>
    </Link>
  );
}

export default ButtonLink;
