import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Button, ArrowNudge } from "@/components/ui/button";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed header + constant spacer: compacting on scroll never shifts the page layout. */}
      <div aria-hidden className="h-16 md:h-20" />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-ink/10 bg-paper/88 backdrop-blur-md" : "border-b border-transparent bg-paper",
        )}
      >
        <div
          className={cn(
            "container-x flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo",
            scrolled ? "h-14 md:h-16" : "h-16 md:h-20",
          )}
        >
          <Link to="/" className="text-[0.95rem] text-ink" aria-label={`${site.name} — home`}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <NavLink to={item.href} className="group relative inline-flex h-10 items-center px-3.5 text-[0.95rem] font-medium text-ink">
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute inset-x-3.5 bottom-1.5 h-[1.5px] origin-left bg-ink transition-transform duration-500 ease-out-expo",
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                          )}
                        />
                        {isActive && (
                          <motion.span
                            layoutId="nav-dot"
                            aria-hidden
                            className="absolute right-1 top-2 size-1.5 rounded-full bg-orange"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {pathname !== "/contact" && (
              <Button asChild variant="lime" size={scrolled ? "sm" : "md"} className="hidden sm:inline-flex">
                <Link to="/contact">
                  Let’s Talk <ArrowNudge />
                </Link>
              </Button>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] transition-colors hover:bg-ink hover:text-paper md:hidden"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <Menu className="size-5" aria-hidden />
              Menu
            </button>
          </div>
        </div>

        <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </header>
    </>
  );
}
