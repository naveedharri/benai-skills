import { Separator } from "@/components/ui/separator"

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "GitHub", href: "#" },
]

export function FooterSimple() {
  return (
    <footer className="border-t bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-semibold text-foreground">YourBrand</p>
            <p className="text-sm text-muted-foreground mt-1">Building the future, one step at a time.</p>
          </div>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
