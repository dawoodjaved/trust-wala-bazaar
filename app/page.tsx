"use client";

import { motion } from "framer-motion";
import { Star, FileText, Layers, Maximize2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SpringAnimated } from "@/components/ui/spring-animated";
import { AnimatedSVG } from "@/components/ui/animated-svg";
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
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[rgba(10,15,13,0.8)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)] px-16 flex items-center justify-between">
        <div className="text-2xl font-bold text-white">TrustWala Bazaar</div>
        <div className="flex items-center gap-8">
          <Link href="#about" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
            About
          </Link>
          <Link href="#features" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
            Features
          </Link>
          <Link href="#why-trustwala" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
            Why TrustWala
          </Link>
          <Link href="/home" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{
        background: "radial-gradient(ellipse 800px 600px at center top, #1a221e 0%, #0a0f0d 60%)"
      }}>
        {/* Spotlight Effect */}
        <div 
          className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200, 217, 111, 0.15) 0%, transparent 70%)"
          }}
        />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-16 text-center">
          {/* Hero Illustration - Floating above with Spring Animation */}
          <SpringAnimated
            from={{ opacity: 0, y: -50, scale: 0.8 }}
            to={{ opacity: 0.2, y: 0, scale: 1 }}
            delay={300}
            className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-96 h-96 pointer-events-none"
          >
            <AnimatedSVG
              duration={3000}
              delay={500}
              className="w-full h-full"
            >
              <ShoppingAppSVG />
            </AnimatedSVG>
          </SpringAnimated>
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[72px] font-bold text-white leading-[1.1] tracking-[-0.02em]"
          >
            Pakistan&apos;s Most Trusted
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-[72px] font-bold text-white leading-[1.1] tracking-[-0.02em] mt-2"
          >
            AI-Enriched Marketplace
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[18px] text-[#9ca3af] mt-6 max-w-[600px] mx-auto leading-[1.6]"
          >
            Buy and sell with confidence. AI-powered fraud detection, trust scores, and secure transactions for mobiles, laptops, electronics, cars, and more.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex gap-4 justify-center mt-10"
          >
            <Link href="/home">
              <button
                className="px-9 py-[14px] bg-[#c8d96f] text-[#0a0f0d] text-base font-semibold rounded-[30px] transition-all duration-300 hover:scale-105"
                style={{
                  boxShadow: "0 0 30px rgba(200, 217, 111, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(200, 217, 111, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(200, 217, 111, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)";
                }}
              >
                Start Buying
              </button>
            </Link>
            <Link href="/listings/create">
              <button
                className="px-9 py-[14px] bg-transparent border-2 border-[rgba(200,217,111,0.3)] text-[#c8d96f] text-base font-semibold rounded-[30px] transition-all duration-300 hover:scale-105 hover:border-[#c8d96f]"
              >
                Start Selling
              </button>
            </Link>
          </motion.div>
          
          {/* 5-Star Rating Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-[60px] flex flex-col items-center"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#fbbf24] text-[#fbbf24]" />
              ))}
            </div>
            <p className="text-sm text-[#e5e7eb] mt-3">Trusted by thousands of buyers and sellers</p>
            
            {/* Stats */}
            <div className="mt-12 flex items-center gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#c8d96f]">10K+</div>
                <div className="text-sm text-[#9ca3af] mt-1">Verified Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#c8d96f]">50K+</div>
                <div className="text-sm text-[#9ca3af] mt-1">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#c8d96f]">92%</div>
                <div className="text-sm text-[#9ca3af] mt-1">Fraud Detection</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Left Overlay */}
      <section id="about" className="relative py-[120px] px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 gap-16 items-start">
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-[420px] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px] border border-[rgba(200,217,111,0.15)] rounded-2xl p-12"
          >
            <div className="text-[11px] tracking-[0.1em] text-[#c8d96f] font-semibold uppercase mb-4">
              ABOUT TRUSTWALA
            </div>
            <h2 className="text-[32px] font-bold text-white leading-[1.3] mb-6">
              Revolutionizing Pakistan&apos;s marketplace with AI-powered trust and security.
            </h2>
            <p className="text-[15px] text-[#9ca3af] leading-[1.8]">
              TrustWala Bazaar is Pakistan&apos;s most trusted AI-enriched marketplace platform, solving critical trust and fraud challenges that plague online marketplaces. Built with advanced machine learning and multi-layer verification, we achieve 92% fraud detection accuracy through CNIC verification, video face recognition, and AI pattern analysis. Our transparent trust score algorithm enables users to understand scoring decisions, building unprecedented marketplace confidence.
            </p>
          </motion.div>
          
          {/* Right Side - 3D Marketplace Illustration with Animation */}
          <SpringAnimated
            from={{ opacity: 0, x: 50, scale: 0.9 }}
            to={{ opacity: 1, x: 0, scale: 1 }}
            delay={200}
            className="flex items-center justify-center"
          >
            <div className="relative w-full h-[500px]">
              <AnimatedSVG
                duration={2500}
                delay={400}
                className="w-full h-full rounded-2xl"
                style={{ filter: 'brightness(0.9) saturate(1.2)' }}
              >
                <OnlineShoppingSVG />
              </AnimatedSVG>
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(200,217,111,0.1)] to-transparent rounded-2xl pointer-events-none" />
            </div>
          </SpringAnimated>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[120px] px-16 bg-[#0a0f0d]">
        <div className="max-w-[1440px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-[11px] tracking-[0.1em] text-[#c8d96f] font-semibold uppercase mb-4">
            FEATURES
          </div>
          <h2 className="text-[36px] font-bold text-white">
            Why Choose TrustWala Bazaar
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Card 1: AI-Powered Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#111614] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[rgba(200,217,111,0.3)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-20 h-20 mb-6 flex items-center justify-center">
              <SpringAnimated
                from={{ opacity: 0, scale: 0.5, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={100}
                className="w-full h-full flex items-center justify-center bg-[rgba(200,217,111,0.1)] rounded-xl"
              >
                <AnimatedSVG
                  alt="AI Technology"
                  duration={2000}
                  delay={300}
                  className="w-16 h-16"
                >
                  <AIIllustrationSVG />
                </AnimatedSVG>
              </SpringAnimated>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Recommendations</h3>
            <p className="text-sm text-[#9ca3af]">Get personalized product suggestions based on your preferences and browsing history.</p>
          </motion.div>
          
          {/* Card 2: Fraud Detection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-[#111614] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[rgba(200,217,111,0.3)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-20 h-20 mb-6 flex items-center justify-center">
              <SpringAnimated
                from={{ opacity: 0, scale: 0.5, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={200}
                className="w-full h-full flex items-center justify-center bg-[rgba(200,217,111,0.1)] rounded-xl"
              >
                <AnimatedSVG
                  alt="Security Shield"
                  duration={2000}
                  delay={400}
                  className="w-16 h-16"
                >
                  <SecuritySVG />
                </AnimatedSVG>
              </SpringAnimated>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fraud Detection</h3>
            <p className="text-sm text-[#9ca3af]">CNIC verification, video verification, and AI-powered fraud detection for maximum safety.</p>
          </motion.div>
          
          {/* Card 3: Voice & Visual Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-[#111614] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[rgba(200,217,111,0.3)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-20 h-20 mb-6 flex items-center justify-center">
              <SpringAnimated
                from={{ opacity: 0, scale: 0.5, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={300}
                className="w-full h-full flex items-center justify-center bg-[rgba(200,217,111,0.1)] rounded-xl"
              >
                <AnimatedSVG
                  alt="Voice Search"
                  duration={2000}
                  delay={500}
                  className="w-16 h-16"
                >
                  <VoiceSearchSVG />
                </AnimatedSVG>
              </SpringAnimated>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice & Visual Search</h3>
            <p className="text-sm text-[#9ca3af]">Search using voice (Urdu/English) or upload images to find similar products.</p>
          </motion.div>

          {/* Card 4: Trust Score System */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-[#111614] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[rgba(200,217,111,0.3)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-20 h-20 mb-6 flex items-center justify-center">
              <SpringAnimated
                from={{ opacity: 0, scale: 0.5, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={400}
                className="w-full h-full flex items-center justify-center bg-[rgba(200,217,111,0.1)] rounded-xl"
              >
                <AnimatedSVG
                  alt="Analytics"
                  duration={2000}
                  delay={600}
                  className="w-16 h-16"
                >
                  <AnalyticsSVG />
                </AnimatedSVG>
              </SpringAnimated>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Trust Score System</h3>
            <p className="text-sm text-[#9ca3af]">AI-calculated trust scores for sellers and products with transparent explanations.</p>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="why-trustwala" className="py-[120px] px-16 bg-[#0a0f0d]">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-[11px] tracking-[0.1em] text-[#c8d96f] font-semibold uppercase mb-4">
              SOLUTIONS
            </div>
            <h2 className="text-[48px] font-bold text-white">
              TrustWala for your marketplace needs
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#111614] border border-[rgba(200,217,111,0.15)] rounded-2xl p-8 text-center"
            >
              <SpringAnimated
                from={{ opacity: 0, scale: 0, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={100}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(200,217,111,0.1)] flex items-center justify-center"
              >
                <AnimatedSVG
                  duration={2000}
                  delay={300}
                  className="w-20 h-20"
                >
                  <OnlineShoppingSVG />
                </AnimatedSVG>
              </SpringAnimated>
              <h3 className="text-xl font-semibold text-white mb-2">Buyers</h3>
              <p className="text-sm text-[#9ca3af]">Find verified products with AI recommendations and secure transactions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-[#111614] border border-[rgba(200,217,111,0.15)] rounded-2xl p-8 text-center"
            >
              <SpringAnimated
                from={{ opacity: 0, scale: 0, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={200}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(200,217,111,0.1)] flex items-center justify-center"
              >
                <AnimatedSVG
                  duration={2000}
                  delay={400}
                  className="w-20 h-20"
                >
                  <BusinessDealSVG />
                </AnimatedSVG>
              </SpringAnimated>
              <h3 className="text-xl font-semibold text-white mb-2">Sellers</h3>
              <p className="text-sm text-[#9ca3af]">Build trust scores, get verified, and reach more customers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-[#111614] border border-[rgba(200,217,111,0.15)] rounded-2xl p-8 text-center"
            >
              <SpringAnimated
                from={{ opacity: 0, scale: 0, rotate: -180 }}
                to={{ opacity: 1, scale: 1, rotate: 0 }}
                delay={300}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(200,217,111,0.1)] flex items-center justify-center"
              >
                <AnimatedSVG
                  duration={2000}
                  delay={500}
                  className="w-20 h-20"
                >
                  <SecuritySVG />
                </AnimatedSVG>
              </SpringAnimated>
              <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
              <p className="text-sm text-[#9ca3af]">Multi-layer fraud detection and escrow protection</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom Feature Cards */}
      <section className="py-[120px] px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Card A: AI-Powered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10 relative overflow-hidden"
          >
            <SpringAnimated
              from={{ opacity: 0, scale: 0.5, rotate: -90 }}
              to={{ opacity: 0.1, scale: 1, rotate: 0 }}
              delay={100}
              className="absolute top-0 right-0 w-32 h-32"
            >
              <AnimatedSVG
                duration={2000}
                delay={200}
                className="w-full h-full"
              >
                <AIIllustrationSVG />
              </AnimatedSVG>
            </SpringAnimated>
            <Sparkles className="w-8 h-8 text-[#c8d96f] mb-6 relative z-10" />
            <h3 className="text-[28px] font-semibold text-white mb-4 relative z-10">AI-Powered Platform</h3>
            <p className="text-[15px] text-[#9ca3af] leading-[1.6] relative z-10">Advanced machine learning for recommendations, fraud detection, and trust scoring</p>
          </motion.div>
          
          {/* Card B: Offline Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10 relative overflow-hidden"
          >
            <SpringAnimated
              from={{ opacity: 0, scale: 0.5, rotate: -90 }}
              to={{ opacity: 0.1, scale: 1, rotate: 0 }}
              delay={200}
              className="absolute top-0 right-0 w-32 h-32"
            >
              <AnimatedSVG
                duration={2000}
                delay={300}
                className="w-full h-full"
              >
                <MobileAppsSVG />
              </AnimatedSVG>
            </SpringAnimated>
            <Layers className="w-8 h-8 text-[#c8d96f] mb-6 relative z-10" />
            <h3 className="text-[28px] font-semibold text-white mb-4 relative z-10">Offline-First PWA</h3>
            <p className="text-[15px] text-[#9ca3af] leading-[1.6] relative z-10">Full functionality without internet connectivity - perfect for Pakistan&apos;s connectivity challenges</p>
          </motion.div>
          
          {/* Card C: Multilingual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10 relative overflow-hidden"
          >
            <SpringAnimated
              from={{ opacity: 0, scale: 0.5, rotate: -90 }}
              to={{ opacity: 0.1, scale: 1, rotate: 0 }}
              delay={300}
              className="absolute top-0 right-0 w-32 h-32"
            >
              <AnimatedSVG
                duration={2000}
                delay={400}
                className="w-full h-full"
              >
                <TranslatorSVG />
              </AnimatedSVG>
            </SpringAnimated>
            <Maximize2 className="w-8 h-8 text-[#c8d96f] mb-6 relative z-10" />
            <h3 className="text-[28px] font-semibold text-white mb-4 relative z-10">Multilingual Support</h3>
            <p className="text-[15px] text-[#9ca3af] leading-[1.6] relative z-10">Urdu/English voice search, RTL layout, and accessibility features</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
