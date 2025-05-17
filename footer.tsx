import { Link } from "wouter";
import PawIcon from "../ui/paw-icon";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-lighter pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="text-primary w-8 h-8 flex items-center justify-center">
                <PawIcon className="text-2xl" />
              </div>
              <span className="text-xl font-bold text-primary">
                Cat<span className="text-cream-DEFAULT">munitty</span>
              </span>
            </Link>
            <p className="text-cream-dark mb-4">
              Platform patungan untuk pangan kucing terlantar. Bersama kita bisa membuat perbedaan.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark rounded-full flex items-center justify-center text-cream-DEFAULT hover:bg-primary hover:text-white transition text-sm"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark rounded-full flex items-center justify-center text-cream-DEFAULT hover:bg-primary hover:text-white transition text-sm"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark rounded-full flex items-center justify-center text-cream-DEFAULT hover:bg-primary hover:text-white transition text-sm"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Jelajahi</h4>
            <ul className="space-y-2 text-cream-dark">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-primary transition">
                  Kampanye
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-primary transition">
                  Donasi
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-primary transition">
                  Jadi Relawan
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Program</h4>
            <ul className="space-y-2 text-cream-dark">
              <li>
                <Link href="/campaigns?category=feeding" className="hover:text-primary transition">
                  Feeding Program
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=healthcare" className="hover:text-primary transition">
                  Perawatan Medis
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=shelter" className="hover:text-primary transition">
                  Shelter Mini
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=sterilization" className="hover:text-primary transition">
                  Sterilisasi
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=education" className="hover:text-primary transition">
                  Edukasi
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=adoption" className="hover:text-primary transition">
                  Adopsi
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Kontak</h4>
            <ul className="space-y-3 text-cream-dark">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-1" />
                <span>Jl. Ketintang, Kampus Unesa, Surabaya</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0 mt-1" />
                <span>info@catmunitty.org</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 mt-1" />
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-medium pt-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="text-cream-dark text-sm">
            &copy; {new Date().getFullYear()} Catmunitty. Hak Cipta Dilindungi.
          </div>
          <div className="flex gap-4 text-cream-dark text-sm">
            <Link href="/privacy-policy" className="hover:text-primary transition">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-primary transition">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
