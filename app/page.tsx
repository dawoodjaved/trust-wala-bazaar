import Link from "next/link";
import { Star, Layers, Maximize2, Sparkles } from "lucide-react";
import {
  ShoppingAppSVG,
  OnlineShoppingSVG,
  AIIllustrationSVG,
  SecuritySVG,
  VoiceSearchSVG,
  AnalyticsSVG,
  BusinessDealSVG,
  MobileAppsSVG,
  TranslatorSVG,
} from "@/components/ui/marketplace-illustrations";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-[rgba(10,15,13,0.8)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)] px-4 md:px-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 min-w-0" aria-label="TrustWala Bazaar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt="TrustWala Bazaar"
            width={48}
            height={48}
            className="h-10 w-10 md:h-12 md:w-12 rounded-xl object-cover shrink-0"
          />
          <span className="text-lg md:text-2xl font-bold text-white tracking-tight truncate">
            Trust<span className="text-[#c8d96f]">Wala</span> Bazaar
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors">
            About
          </Link>
          <Link href="#features" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors">
            Features
          </Link>
          <Link href="#why-trustwala" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors">
            Why TrustWala
          </Link>
          <Link href="/home" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors">
            Get Started
          </Link>
        </div>
        <Link
          href="/home"
          className="md:hidden text-sm font-semibold text-[#0a0f0d] bg-[#c8d96f] px-3 py-1.5 rounded-full"
        >
          Open app
        </Link>
      </nav>

      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20 px-4"
        style={{
          background: "radial-gradient(ellipse 800px 600px at center top, #1a221e 0%, #0a0f0d 60%)",
        }}
      >
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200, 217, 111, 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto md:px-16 text-center">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 pointer-events-none opacity-20 landing-fade">
            <ShoppingAppSVG />
          </div>

          <h1 className="text-4xl md:text-[72px] font-bold text-white leading-[1.1] tracking-[-0.02em] landing-fade">
            Pakistan&apos;s Most Trusted
          </h1>
          <h1
            className="text-4xl md:text-[72px] font-bold text-white leading-[1.1] tracking-[-0.02em] mt-2 landing-fade"
            style={{ animationDelay: "80ms" }}
          >
            AI-Enriched Marketplace
          </h1>

          <p
            className="text-base md:text-[18px] text-[#9ca3af] mt-6 max-w-[600px] mx-auto leading-[1.6] landing-fade"
            style={{ animationDelay: "140ms" }}
          >
            Buy and sell with confidence. Trust scores, seller verification, and safer transactions for mobiles,
            laptops, electronics, cars, and more.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10 landing-fade"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              href="/home"
              className="px-9 py-[14px] bg-[#c8d96f] text-[#0a0f0d] text-base font-semibold rounded-[30px] transition-transform duration-300 hover:scale-105"
              style={{
                boxShadow: "0 0 30px rgba(200, 217, 111, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              Start Buying
            </Link>
            <Link
              href="/listings/create"
              className="px-9 py-[14px] bg-transparent border-2 border-[rgba(200,217,111,0.3)] text-[#c8d96f] text-base font-semibold rounded-[30px] transition-all duration-300 hover:scale-105 hover:border-[#c8d96f]"
            >
              Start Selling
            </Link>
          </div>

          <div className="mt-[60px] flex flex-col items-center landing-fade" style={{ animationDelay: "280ms" }}>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#fbbf24] text-[#fbbf24]" />
              ))}
            </div>
            <p className="text-sm text-[#e5e7eb] mt-3">Built for safer buying and selling in Pakistan</p>

            <div className="mt-12 flex items-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#c8d96f]">5★</div>
                <div className="text-sm text-[#9ca3af] mt-1">Trust Scoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#c8d96f]">CNIC</div>
                <div className="text-sm text-[#9ca3af] mt-1">Seller Checks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#c8d96f]">Escrow</div>
                <div className="text-sm text-[#9ca3af] mt-1">Ready Flow</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative py-16 md:py-[120px] px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="w-full md:w-[420px] bg-[rgba(17,22,20,0.95)] border border-[rgba(200,217,111,0.15)] rounded-2xl p-8 md:p-12">
            <div className="text-[11px] tracking-[0.1em] text-[#c8d96f] font-semibold uppercase mb-4">
              ABOUT TRUSTWALA
            </div>
            <h2 className="text-2xl md:text-[32px] font-bold text-white leading-[1.3] mb-6">
              Revolutionizing Pakistan&apos;s marketplace with AI-powered trust and security.
            </h2>
            <p className="text-[15px] text-[#9ca3af] leading-[1.8]">
              TrustWala Bazaar is an AI-assisted marketplace built for Pakistan — combining seller verification
              (CNIC + video), transparent trust scores, listing fraud checks, and escrow-ready checkout so buyers
              and sellers can trade with clearer signals and less risk.
            </p>
          </div>

          <div className="relative w-full h-[280px] md:h-[500px]">
            <div className="w-full h-full rounded-2xl" style={{ filter: "brightness(0.9) saturate(1.2)" }}>
              <OnlineShoppingSVG />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(200,217,111,0.1)] to-transparent rounded-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-[120px] px-4 md:px-16 bg-[#0a0f0d]">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="mb-12">
            <div className="text-[11px] tracking-[0.1em] text-[#c8d96f] font-semibold uppercase mb-4">FEATURES</div>
            <h2 className="text-3xl md:text-[36px] font-bold text-white">Why Choose TrustWala Bazaar</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 w-full">
            {[
              {
                title: "AI-Powered Recommendations",
                body: "Get personalized product suggestions based on your preferences and browsing history.",
                Icon: AIIllustrationSVG,
              },
              {
                title: "Fraud Detection",
                body: "CNIC upload, video verification workflows, and AI-assisted listing risk checks.",
                Icon: SecuritySVG,
              },
              {
                title: "Voice & Visual Search",
                body: "Search using voice (Urdu/English) or upload images to find similar products.",
                Icon: VoiceSearchSVG,
              },
              {
                title: "Trust Score System",
                body: "AI-calculated trust scores for sellers and products with transparent explanations.",
                Icon: AnalyticsSVG,
              },
            ].map(({ title, body, Icon }) => (
              <div
                key={title}
                className="bg-[#111614] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[rgba(200,217,111,0.3)] transition-colors"
              >
                <div className="w-20 h-20 mb-6 flex items-center justify-center bg-[rgba(200,217,111,0.1)] rounded-xl">
                  <div className="w-16 h-16">
                    <Icon />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#9ca3af]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-trustwala" className="py-16 md:py-[120px] px-4 md:px-16 bg-[#0a0f0d]">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12">
            <div className="text-[11px] tracking-[0.1em] text-[#c8d96f] font-semibold uppercase mb-4">SOLUTIONS</div>
            <h2 className="text-3xl md:text-[48px] font-bold text-white">TrustWala for your marketplace needs</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Buyers",
                body: "Find verified products with AI recommendations and secure transactions",
                Icon: OnlineShoppingSVG,
              },
              {
                title: "Sellers",
                body: "Build trust scores, get verified, and reach more customers",
                Icon: BusinessDealSVG,
              },
              {
                title: "Security",
                body: "Listing fraud checks and escrow-ready checkout",
                Icon: SecuritySVG,
              },
            ].map(({ title, body, Icon }) => (
              <div
                key={title}
                className="bg-[#111614] border border-[rgba(200,217,111,0.15)] rounded-2xl p-8 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                  <div className="w-20 h-20">
                    <Icon />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#9ca3af]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-[120px] px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <AIIllustrationSVG />
            </div>
            <Sparkles className="w-8 h-8 text-[#c8d96f] mb-6 relative z-10" />
            <h3 className="text-2xl md:text-[28px] font-semibold text-white mb-4 relative z-10">AI-Powered Platform</h3>
            <p className="text-[15px] text-[#9ca3af] leading-[1.6] relative z-10">
              AI helpers for listing checks, recommendations, and transparent trust scoring
            </p>
          </div>

          <div className="bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <MobileAppsSVG />
            </div>
            <Layers className="w-8 h-8 text-[#c8d96f] mb-6 relative z-10" />
            <h3 className="text-2xl md:text-[28px] font-semibold text-white mb-4 relative z-10">Offline-First PWA</h3>
            <p className="text-[15px] text-[#9ca3af] leading-[1.6] relative z-10">
              Installable PWA with offline caching so browsing stays fast on flaky connections
            </p>
          </div>

          <div className="bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <TranslatorSVG />
            </div>
            <Maximize2 className="w-8 h-8 text-[#c8d96f] mb-6 relative z-10" />
            <h3 className="text-2xl md:text-[28px] font-semibold text-white mb-4 relative z-10">Multilingual Support</h3>
            <p className="text-[15px] text-[#9ca3af] leading-[1.6] relative z-10">
              Urdu/English voice search, RTL layout, and accessibility features
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
