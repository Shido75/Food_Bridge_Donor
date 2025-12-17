import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { TruckIcon, HeartIcon, UsersIcon, MapPinIcon, CheckCircleIcon, LeafIcon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2">
            <LeafIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <span className="text-lg font-bold sm:text-xl">FoodBridge</span>
          </div>
          <nav className="hidden items-center gap-4 md:flex lg:gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="#impact" className="text-sm font-medium transition-colors hover:text-primary">
              Impact
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="sm:size-default">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container grid gap-8 py-12 sm:gap-12 sm:py-16 md:grid-cols-2 md:items-center md:py-24 lg:py-32">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Live in Pune
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Bridge the Gap Between Food Surplus and Hunger
            </h1>
            <p className="text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
              Connect donors, NGOs, and delivery partners to rescue surplus food and serve communities in need.
              Together, we can end food waste and fight hunger.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/signup">Start Donating</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/auth/signup?role=ngo">I'm an NGO</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-primary" />
                <span>Zero Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-primary" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-primary" />
                <span>Verified NGOs</span>
              </div>
            </div>
          </div>
          <div className="relative order-first md:order-last">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
              <img
                src="/food-donation-volunteers-community-kitchen.jpg"
                alt="FoodBridge Platform"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -left-3 rounded-lg border bg-background p-3 shadow-lg sm:-bottom-4 sm:-left-4 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                  <HeartIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold sm:text-2xl">50K+</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">Meals Served</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 rounded-lg border bg-background p-3 shadow-lg sm:-right-4 sm:-top-4 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                  <LeafIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold sm:text-2xl">25K kg</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">Food Saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-b py-12 sm:py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Everything You Need to Make an Impact
            </h2>
            <p className="mt-3 text-pretty text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Our platform connects all stakeholders in the food donation ecosystem with powerful tools and real-time
              insights.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <HeartIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Donors</h3>
                <p className="text-muted-foreground">
                  List surplus food, track donations, and see the direct impact of your contributions to the community.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For NGOs</h3>
                <p className="text-muted-foreground">
                  Browse available donations, request specific items, and manage distribution to beneficiaries
                  efficiently.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TruckIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Delivery Partners</h3>
                <p className="text-muted-foreground">
                  Accept delivery requests, navigate optimized routes, and earn ratings while serving the community.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor every step of the donation journey from listing to delivery with live status updates.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircleIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Verified Organizations</h3>
                <p className="text-muted-foreground">
                  All NGOs and donors are verified to ensure food safety standards and reliable partnerships.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <LeafIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Impact Analytics</h3>
                <p className="text-muted-foreground">
                  Track your environmental impact with metrics on food saved, meals served, and CO2 emissions prevented.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b py-12 sm:py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              How FoodBridge Works
            </h2>
            <p className="mt-3 text-pretty text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Simple, efficient, and transparent - from surplus to service in just a few steps.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">Donor Lists Food</h3>
              <p className="text-sm text-muted-foreground">
                Restaurants, hostels, or hotels list surplus food with details about quantity, type, and pickup
                location.
              </p>
              {/* Connector line for desktop */}
              <div className="absolute left-full top-8 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">NGO Claims Food</h3>
              <p className="text-sm text-muted-foreground">
                Verified NGOs browse available donations and claim items that match their beneficiary needs.
              </p>
              <div className="absolute left-full top-8 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">Partner Delivers</h3>
              <p className="text-sm text-muted-foreground">
                A delivery partner accepts the request, picks up food from the donor, and delivers to the NGO.
              </p>
              <div className="absolute left-full top-8 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                4
              </div>
              <h3 className="mb-2 text-lg font-semibold">Impact Tracked</h3>
              <p className="text-sm text-muted-foreground">
                Everyone rates the experience, and the platform tracks the positive environmental and social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-12 sm:py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Making Real Impact in Pune
            </h2>
            <p className="mt-3 text-pretty text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Join our growing community of changemakers reducing food waste and fighting hunger.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-4xl font-bold text-primary">50K+</div>
              <div className="text-sm font-medium">Meals Served</div>
              <div className="mt-1 text-xs text-muted-foreground">To those in need</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-4xl font-bold text-primary">25K kg</div>
              <div className="text-sm font-medium">Food Rescued</div>
              <div className="mt-1 text-xs text-muted-foreground">From going to waste</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-4xl font-bold text-primary">200+</div>
              <div className="text-sm font-medium">Active Partners</div>
              <div className="mt-1 text-xs text-muted-foreground">Donors, NGOs & Drivers</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-4xl font-bold text-primary">15 tons</div>
              <div className="text-sm font-medium">CO₂ Prevented</div>
              <div className="mt-1 text-xs text-muted-foreground">Environmental impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-12 sm:py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Ready to Make a Difference?
            </h2>
            <p className="mt-3 text-pretty text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Join FoodBridge today and be part of the solution to food waste and hunger in Pune.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/signup?role=donor">Sign Up as Donor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/auth/signup?role=ngo">Sign Up as NGO</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/auth/signup?role=delivery_partner">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12">
        <div className="container">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <LeafIcon className="h-5 w-5 text-primary" />
                <span className="font-bold">FoodBridge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting surplus food with those who need it most. Making Pune hunger-free, one meal at a time.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/signup?role=donor" className="hover:text-foreground">
                    For Donors
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup?role=ngo" className="hover:text-foreground">
                    For NGOs
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup?role=delivery_partner" className="hover:text-foreground">
                    For Delivery Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">
                Pune, Maharashtra
                <br />
                India
              </p>
            </div>
          </div>
          <div className="mt-6 border-t pt-6 text-center text-xs text-muted-foreground sm:mt-8 sm:pt-8 sm:text-sm">
            © {new Date().getFullYear()} FoodBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
