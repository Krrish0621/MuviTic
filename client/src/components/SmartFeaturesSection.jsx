import {
  Armchair,
  BellRing,
  BrainCircuit,
  CalendarClock,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import BlurCircle from "./BlurCircle";

const features = [
  {
    title: "AI Movie Match",
    text: "Mood-based picks use ratings, genres, runtime and story signals to surface the right film faster.",
    icon: BrainCircuit,
  },
  {
    title: "Smart Seat Flow",
    text: "A clearer booking path shows selected seats and estimated total before checkout.",
    icon: Armchair,
  },
  {
    title: "Admin Scheduling",
    text: "Search TMDB, pick any movie, add smart time slots and publish shows from one command panel.",
    icon: CalendarClock,
  },
  {
    title: "Secure Payments",
    text: "Stripe checkout stays connected to your existing booking backend.",
    icon: CreditCard,
  },
  {
    title: "Login Protected",
    text: "Clerk keeps user bookings, favorites and admin access guarded.",
    icon: ShieldCheck,
  },
  {
    title: "Email Ready",
    text: "Your existing mail flow can keep customers updated after booking events.",
    icon: BellRing,
  },
];

const SmartFeaturesSection = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <BlurCircle top="140px" right="-120px" size="22rem" opacity={0.12} />

      <div className="cinema-container">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/55">
              Platform Upgrade
            </p>
            <h2 className="mt-2 max-w-2xl text-4xl font-black md:text-5xl">
              Built for discovery, bookings and real cinema operations.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            MuviTic now feels sharper on both sides: movie lovers get smarter
            choices, while admins get faster publishing tools.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-panel rounded-3xl p-6 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartFeaturesSection;
