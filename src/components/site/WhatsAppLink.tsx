import type { AnchorHTMLAttributes, MouseEventHandler } from "react";

import { trackAnalytics } from "@/lib/analytics";
import { criarWhatsAppUrl } from "@/lib/vehicle-utils";

type WhatsAppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  message: string;
  vehicleId?: string;
  intent?: string;
  metadata?: Record<string, unknown>;
};

export function WhatsAppLink({ message, vehicleId, intent, metadata, children, ...props }: WhatsAppLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    trackAnalytics({
      eventName: "whatsapp_click",
      ...(vehicleId ? { vehicleId } : {}),
      metadata: {
        ...metadata,
        ...(intent ? { intent } : {}),
      },
    });
  };

  return (
    <a
      {...props}
      href={criarWhatsAppUrl(message)}
      target={props.target ?? "_blank"}
      rel={props.rel ?? "noreferrer"}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
