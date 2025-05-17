import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "./mobile-menu";
import PawIcon from "../ui/paw-icon";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  Menu,
  LogOut 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const routes = [
    { path: "/", label: "Beranda" },
    { path: "/campaigns", label: "Kampanye" },
    { path: "/donate", label: "Donasi" },
    { path: "/volunteer", label: "Relawan" },
    { path: "/transparency", label: "Transparansi" },
    { path: "/about", label: "Tentang" },
    { path: "/contact", label: "Kontak" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-dark bg-opacity-95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-primary w-10 h-10 flex items-center justify-center">
            <PawIcon className="text-3xl" />
          </div>
          <span className="text-2xl font-bold font-poppins text-primary">
            Cat<span className="text-cream-DEFAULT">munitty</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link 
              key={route.path}
              href={route.path}
              className={`${
                isActive(route.path) 
                  ? "text-primary" 
                  : "text-cream-DEFAULT hover:text-primary"
              } transition font-medium`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        
        {/* CTA Button & User Menu */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="default" className="bg-primary hover:bg-primary-dark rounded-full px-6">
            <Link href="/donate">Donasi Sekarang</Link>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-2">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-dark-lighter border-dark-medium">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-dark-medium" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="text-cream-DEFAULT hover:text-primary">
              <Link href="/auth">Masuk</Link>
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-xl text-cream-DEFAULT"
          aria-label="Toggle mobile menu"
        >
          <Menu />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        routes={routes}
      />
    </header>
  );
}
