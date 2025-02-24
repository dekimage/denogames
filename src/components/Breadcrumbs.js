import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ startFromAccount = false }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs = [
    ...(startFromAccount
      ? [] // Skip Homepage if starting from account
      : [{ name: "Homepage", href: "/" }]),
    ...pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${pathSegments.slice(0, index + 1).join("/")}`,
      isCurrent: index === pathSegments.length - 1,
    })),
  ];

  return (
    <nav className="flex font-strike" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
            {breadcrumb.isCurrent ? (
              <span className="text-xs sm:text-base text-muted-foreground">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-gray hover:text-blue-400 text-xs sm:text-base"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
