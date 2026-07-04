import { cn } from "@/lib/utils";
import { ChevronRight, Ellipsis } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={item.label + index}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {isLast || !item.href ? (
              <span className={cn(isLast && "font-medium text-foreground")}>{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

function BreadcrumbSkeleton({ count = 2 }: { count?: number }) {
  const items: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    if (i > 0) items.push(<ChevronRight key={`sep-${i}`} className="h-4 w-4 text-muted-foreground" />);
    items.push(
      <div key={`item-${i}`} className="h-4 w-20 animate-pulse rounded bg-muted-foreground/20" />,
    );
  }
  return <div className="flex items-center gap-1">{items}</div>;
}

export { Breadcrumb, BreadcrumbSkeleton };
export type { BreadcrumbItem };
