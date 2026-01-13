"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Zap, BarChart3, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const problemContainerRef = useRef<HTMLDivElement>(null);
  const problemScrollRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const benefitsContainerRef = useRef<HTMLDivElement>(null);
  const benefitCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero staggered reveal
      if (heroHeadingRef.current) {
        const letters = heroHeadingRef.current.querySelectorAll("span");
        gsap.fromTo(
          letters,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
          }
        );
      }

      if (heroSubtitleRef.current) {
        gsap.fromTo(
          heroSubtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
          }
        );
      }

      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          opacity: 0.4,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Hero blur and scale on scroll
      if (heroHeadingRef.current) {
        gsap.to(heroHeadingRef.current, {
          scrollTrigger: {
            trigger: heroHeadingRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: 0.5,
          },
          filter: "blur(8px)",
          scale: 0.8,
          opacity: 0.3,
        });
      }

      // Horizontal scroll problem section
      if (problemScrollRef.current) {
        const problemCards = problemScrollRef.current.querySelectorAll(
          "[data-problem-card]"
        );
        const cardWidth = problemCards.length * 400;

        gsap.to(problemScrollRef.current, {
          scrollTrigger: {
            trigger: problemContainerRef.current,
            start: "top top",
            end: `+=${cardWidth}`,
            pin: true,
            scrub: 1,
            markers: false,
          },
          x: -cardWidth + window.innerWidth,
          ease: "none",
        });
      }

      // Feature parallax with scrub
      if (featureCardsRef.current) {
        const features =
          featureCardsRef.current.querySelectorAll("[data-feature]");
        features.forEach((feature, idx) => {
          gsap.to(feature, {
            scrollTrigger: {
              trigger: featureCardsRef.current,
              start: "top center",
              end: "bottom center",
              scrub: 1,
            },
            y: idx % 2 === 0 ? -50 : 50,
            ease: "none",
          });
        });
      }

      // Stacking cards animation
      if (benefitsContainerRef.current) {
        benefitCardsRef.current.forEach((card, idx) => {
          if (card) {
            gsap.to(card, {
              scrollTrigger: {
                trigger: benefitsContainerRef.current,
                start: `top+=${idx * 150} center`,
                end: `top+=${idx * 150 + 300} center`,
                scrub: 1,
              },
              y: idx === 0 ? 0 : -80 * idx,
              opacity: 1,
              ease: "power2.out",
            });
          }
        });
      }

      // Footer curtain reveal
      if (footerRef.current && contentWrapperRef.current) {
        const footerHeight = footerRef.current.offsetHeight;
        contentWrapperRef.current.style.marginBottom = `${footerHeight}px`;

        gsap.set(footerRef.current, { zIndex: -1 });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-zinc-950 text-white font-sans overflow-x-hidden">
      <div ref={contentWrapperRef}>
        {/* Hero Section */}

        <section className="relative w-full h-screen flex flex-col items-center justify-center px-4">
          {/* Full black background */}
          <div className="absolute inset-0 bg-black" />

          {/* Dotted background container with margin and rounded border */}
          <div className="absolute inset-8 md:inset-12 bg-gradient-radial from-zinc-900 via-zinc-950 to-black rounded-2xl overflow-hidden border border-zinc-800/50">
            {/* Dotted pattern */}
            <div
              className={cn(
                "absolute inset-0",
                "[background-size:20px_20px]",
                "[background-image:radial-gradient(#404040_1px,transparent_1px)]"
              )}
            />
          </div>

          {/* Badge - positioned to be inside the rounded container */}
          <div className="absolute top-20 left-16 flex items-center gap-2 text-xs tracking-widest uppercase z-20">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-zinc-400">Next Generation</span>
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center max-w-4xl">
            <h1
              ref={heroHeadingRef}
              className="text-7xl md:text-8xl font-bold leading-tight tracking-tight mb-6 text-pretty">
              {"Build the Web".split("").map((char, i) => (
                <span key={i}>{char}</span>
              ))}
              <br />
              {"Faster than Ever".split("").map((char, i) => (
                <span key={i + 20}>{char}</span>
              ))}
            </h1>

            <p
              ref={heroSubtitleRef}
              className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Ship production-ready experiences in half the time. Engineered for
              teams that refuse to compromise on quality or velocity.
            </p>

            <div className="flex gap-4 justify-center mb-16">
              <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 border border-zinc-700 rounded-full font-semibold hover:bg-zinc-900 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Problem Section - Horizontal Scroll */}
        <section
          ref={problemContainerRef}
          className="relative w-full bg-zinc-950 py-20">
          <div className="h-full">
            <div ref={problemScrollRef} className="flex gap-12 px-12">
              {[
                {
                  title: "Configuration Chaos",
                  desc: "Endless setup wizards and config files stealing precious dev time.",
                },
                {
                  title: "Deployment Anxiety",
                  desc: "Manual deploys, missing dependencies, production surprises at 2am.",
                },
                {
                  title: "Team Friction",
                  desc: "Context switching between tools, slow feedback loops, blocked deployments.",
                },
                {
                  title: "The Solution",
                  desc: "One platform. Unified workflows. Ship with confidence, deploy with peace.",
                  highlight: true,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  data-problem-card
                  className={`min-w-96 p-8 rounded-lg border flex flex-col justify-between ${
                    item.highlight
                      ? "bg-white text-black border-white"
                      : "bg-zinc-900 text-white border-zinc-800"
                  }`}>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p
                      className={
                        item.highlight ? "text-black/70" : "text-zinc-400"
                      }>
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-8">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        item.highlight ? "bg-black" : "bg-zinc-800"
                      }`}>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Showcase - Parallax */}

        {/* Benefits - Stacking Cards */}

        {/* CTA Section */}
      </div>

      {/* Fixed Footer with Curtain Reveal */}
    </div>
  );
}
