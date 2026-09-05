import Link from "next/link";
import { CalendarDays, Phone } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Persistent mobile conversion bar. Most HVAC traffic is mobile and urgent,
 * so the phone number should never be more than one thumb-reach away.
 */
export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
      <div className="grid grid-cols-2 gap-2 p-2.5">
        <a href={site.phone.href} className="btn btn-cool !py-3.5 text-sm">
          <Phone size={16} /> Call Now
        </a>
        <Link href="/schedule" className="btn btn-primary !py-3.5 text-sm">
          <CalendarDays size={16} /> Book
        </Link>
      </div>
    </div>
  );
}
