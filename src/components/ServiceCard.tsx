import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceIcon from "./ServiceIcon";
import type { Service } from "@/lib/services";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card card-hover group flex flex-col p-6"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-tint text-cool-600 transition-colors group-hover:bg-cool-500 group-hover:text-white">
        <ServiceIcon slug={service.slug} />
      </span>
      <h3 className="h-card mt-5">{service.name}</h3>
      <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-body">{service.tagline}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cool-600">
        Learn more
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
