'use client';

import Link from 'next/link';
import { Book, FileText } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-provider';
import { toast } from 'sonner';


import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
        <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b w-full',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-border'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="w-full max-w-[2520px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary"
          >
            <Book className="h-5 w-5" />
            <span>BlogApp</span>
          </Link>
        </div>
        <nav className="flex items-center gap-2 md:gap-5">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Blog Posts</span>
          </Link>

          <Link
            href="/blog-editor"
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/blog-editor" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Add Blog</span>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Signed in as<br /><strong>{user.email}</strong>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  localStorage.removeItem("token");
                  toast.success("Logged out successfully");
                  router.push("/login");
                  setTimeout(() => {
                    window.location.reload();
                  }, 200);
                }}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">Login</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/login')}>
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/register')}>
                  Register
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
