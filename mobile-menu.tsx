import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserCircle } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  routes: { path: string; label: string }[];
}

export default function MobileMenu({ isOpen, onClose, routes }: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden px-4 py-4 bg-dark-lighter border-t border-dark-medium">
      <nav className="flex flex-col gap-4">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className="text-cream-DEFAULT hover:text-primary transition font-medium py-2"
            onClick={onClose}
          >
            {route.label}
          </Link>
        ))}
        
        {user ? (
          <>
            <Link
              href="/profile"
              className="text-cream-DEFAULT hover:text-primary transition font-medium py-2 flex items-center gap-2"
              onClick={onClose}
            >
              <UserCircle className="h-5 w-5" />
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="text-left text-destructive hover:text-destructive/80 transition font-medium py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="text-cream-DEFAULT hover:text-primary transition font-medium py-2"
            onClick={onClose}
          >
            Masuk / Daftar
          </Link>
        )}
        
        <Button asChild className="bg-primary hover:bg-primary-dark transition rounded-full mt-2">
          <Link href="/donate" onClick={onClose}>
            Donasi Sekarang
          </Link>
        </Button>
      </nav>
    </div>
  );
}
