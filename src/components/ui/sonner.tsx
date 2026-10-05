import { Toaster as Sonner, type ToasterProps } from "sonner"

// The shop is light-only (Corporate Trust design system), so toasts are too.
function Toaster(props: ToasterProps) {
  return <Sonner theme="light" className="toaster group" {...props} />
}

export { Toaster }
