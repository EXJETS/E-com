import {
  AirVent,
  Building2,
  Flame,
  Gauge,
  Siren,
  Snowflake,
  Thermometer,
  Wind,
  Wrench,
} from "lucide-react";

const map = {
  "ac-repair": Wrench,
  "ac-installation": Snowflake,
  "ac-maintenance": Gauge,
  "heating-repair": Flame,
  "heating-installation": Thermometer,
  "indoor-air-quality": Wind,
  ductwork: AirVent,
  "smart-thermostats": Thermometer,
  "emergency-hvac": Siren,
  "commercial-hvac": Building2,
} as const;

export default function ServiceIcon({
  slug,
  size = 22,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const Icon = map[slug as keyof typeof map] ?? Wrench;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
