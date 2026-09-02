import { useEffect, useRef, useState, type TouchEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    title: "SEU PRÓXIMO VEÍCULO ESTÁ AQUI",
    cta: "VER ESTOQUE",
    to: "/estoque",
    image:
      "https://images.pexels.com/photos/4173191/pexels-photo-4173191.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Entrega de chave de veículo em showroom automotivo",
    position: "center",
  },
  {
    title: "ACEITAMOS O SEU VEÍCULO NA TROCA",
    cta: "AVALIAR VEÍCULO",
    to: "/servicos",
    image:
      "https://images.pexels.com/photos/36729882/pexels-photo-36729882.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Negociação entre consultor e cliente em concessionária com veículo ao fundo",
    position: "center",
  },
  {
    title: "FINANCIE SEU PRÓXIMO VEÍCULO",
    cta: "SIMULAR FINANCIAMENTO",
    to: "/servicos",
    image:
      "https://images.pexels.com/photos/4173196/pexels-photo-4173196.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Cliente e consultor analisando documentação em showroom automotivo",
    position: "center",
  },
] as const;

const AUTO_ADVANCE_MS = 6500;

export function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  const previous = () => {
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  };

  const next = () => {
    setActiveIndex((current) => (current + 1) % SLIDES.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;
    if (distance < 0) next();
    else previous();
  };

  return (
    <section
      aria-label="Destaques Gomes Motors"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="relative min-h-[520px] touch-pan-y sm:min-h-[570px] lg:min-h-[610px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((slide, index) => (
          <article
            key={slide.title}
            aria-hidden={index !== activeIndex}
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${SLIDES.length}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              width={1920}
              height={1080}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: slide.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-end px-4 pb-20 pt-28 sm:min-h-[570px] sm:px-6 sm:pb-24 lg:min-h-[610px] lg:px-8 lg:pb-28">
              <div className="max-w-3xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:text-sm">
                  Gomes Motors
                </p>
                <h1 className="max-w-3xl text-4xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <Link
                  to={slide.to}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className="mt-7 inline-flex items-center gap-2 rounded-sm border border-gold bg-gold px-6 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}

        <div className="absolute bottom-6 left-0 right-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2" aria-label="Selecionar destaque">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Ir para destaque ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === activeIndex ? "w-10 bg-gold" : "w-5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-white">
            <span className="mr-2 hidden text-xs font-medium tracking-[0.18em] sm:inline">
              {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Destaque anterior"
              onClick={previous}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/30 bg-black/20 transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Próximo destaque"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/30 bg-black/20 transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
