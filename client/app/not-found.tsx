import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, Compass, MapPin } from "lucide-react"

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="max-w-md w-full mx-auto text-center space-y-8">
        {/* Decorative elements */}
        <div className="relative h-48 w-48 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-full bg-blue-500/10 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-36 w-36 rounded-full bg-blue-500/20 animate-pulse [animation-delay:150ms]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-blue-500/30 animate-pulse [animation-delay:300ms]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-12 w-12 text-blue-500 animate-spin-slow" />
          </div>

          {/* Floating elements */}
          <div className="absolute top-0 right-0 animate-float">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="absolute bottom-0 left-0 animate-float-delayed">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
          <p className="text-muted-foreground">
            Oops! It seems you've ventured into uncharted territory. The page you're looking for doesn't exist or has
            been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-6 space-y-4">
          <Button asChild size="lg" className="px-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground">If you believe this is an error, please contact support.</p>
        </div>
      </div>

      {/* Decorative dots */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 h-2 w-2 rounded-full bg-blue-500/40"></div>
        <div className="absolute top-40 right-40 h-3 w-3 rounded-full bg-blue-500/30"></div>
        <div className="absolute bottom-32 left-1/4 h-2 w-2 rounded-full bg-blue-500/40"></div>
        <div className="absolute bottom-20 right-1/3 h-2 w-2 rounded-full bg-blue-500/30"></div>
      </div>
    </div>
  )
}
