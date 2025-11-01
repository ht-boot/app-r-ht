import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 bg-green-500 text-white overflow-hidden rounded-full" />
        ),
        info: (
          <InfoIcon className="size-6 mr-5 bg-orange-400 text-white overflow-hidden rounded-full" />
        ),
        warning: (
          <InfoIcon className="size-5 bg-orange-400 text-white overflow-hidden rounded-full" />
        ),
        error: (
          <OctagonXIcon className="size-5 bg-red-500 text-white overflow-hidden rounded-full" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin" color="#059669" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
