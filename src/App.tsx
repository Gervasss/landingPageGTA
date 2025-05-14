import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { logoData } from "./logo";
import "./styles.css"

export default function App() {
const heroRef = useRef<HTMLElement>(null);
const heroImgContainerRef = useRef<HTMLDivElement>(null);
const heroImgLogoRef = useRef<HTMLDivElement>(null);
const heroImgCopyRef = useRef<HTMLDivElement>(null);
const fadeOverlayRef = useRef<HTMLDivElement>(null);
const svgOverlayRef = useRef<HTMLDivElement>(null);
const logoContainerRef = useRef<HTMLDivElement>(null);
const logoMaskRef = useRef<SVGPathElement>(null);
const overlayCopyRef = useRef<HTMLDivElement>(null);
const overlayyCopyRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const initialOverlayScale = 750;

    const updateLogoMask = () => {
      const logoContainer = logoContainerRef.current;
      const logoMask = logoMaskRef.current;
      if (!logoContainer || !logoMask) return;

      const logoDimensions = logoContainer.getBoundingClientRect();
      const logoBoundingBox = logoMask.getBBox();

      const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
      const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
      const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

      const logoHorizontalPosition =
        logoDimensions.left +
        (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
        logoBoundingBox.x * logoScaleFactor;
      const logoVerticalPosition =
        logoDimensions.top +
        (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -
        logoBoundingBox.y * logoScaleFactor;

      logoMask.setAttribute(
        "transform",
        `translate(${logoHorizontalPosition}, ${logoVerticalPosition}) scale(${logoScaleFactor})`
      );
    };

    const logoMask = logoMaskRef.current;
    if (logoMask) {
      logoMask.setAttribute("d", logoData);
    }

    updateLogoMask();

    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const scrollProgress = self.progress;

        const fadeOpacity = 1 - scrollProgress * (1 / 0.15);
        if (scrollProgress <= 0.15) {
          gsap.set([heroImgLogoRef.current, heroImgCopyRef.current], {
            opacity: fadeOpacity,
          });
        } else {
          gsap.set([heroImgLogoRef.current, heroImgCopyRef.current], {
            opacity: 0,
          });
        }

        if (scrollProgress <= 0.85) {
          const normalizedProgress = scrollProgress * (1 / 0.85);
          const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress;
          const overlayScale =
            initialOverlayScale *
            Math.pow(1 / initialOverlayScale, normalizedProgress);

          let fadeOverlayOpacity = 0;
          if (scrollProgress >= 0.25) {
            fadeOverlayOpacity = Math.min(
              1,
              (scrollProgress - 0.25) * (1 / 0.4)
            );
          }

          gsap.set(heroImgContainerRef.current, {
            scale: heroImgContainerScale,
          });
          gsap.set(svgOverlayRef.current, {
            scale: overlayScale,
          });
          gsap.set(fadeOverlayRef.current, {
            opacity: fadeOverlayOpacity,
          });
        }

        if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
          const overlayCopyRevealProgress = (scrollProgress - 0.6) * (1 / 0.25);

          const gradientSpread = 100;
          const gradientBottomPosition = 240 - overlayCopyRevealProgress * 280;
          const gradientTopPosition = gradientBottomPosition - gradientSpread;
          const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress;

          const overlayCopy = overlayCopyRef.current;
          if (overlayCopy) {
            overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #e66461 ${gradientBottomPosition}%, #e66461 100%)`;
            overlayCopy.style.backgroundClip = "text";
          }

          gsap.set(overlayCopy, {
            scale: overlayCopyScale,
            opacity: overlayCopyRevealProgress,
          });
        } else if (scrollProgress < 0.6) {
          gsap.set(overlayCopyRef.current, {
            opacity: 0,
          });
        }
      },
    });

    window.addEventListener("resize", () => {
      updateLogoMask();
      ScrollTrigger.refresh();
    });

    return () => {
      trigger.kill();
      window.removeEventListener("resize", updateLogoMask);
    };
  }, []);

  return (
    <div>

    
    <section className="hero" ref={heroRef}>
      <div className="hero-img-container" ref={heroImgContainerRef}>
        <img src="src/assets/hero-img-layer-1.jpg" alt="" />
        <div className="hero-img-logo" ref={heroImgLogoRef}>
          <img src="src/assets/hero-img-logo.png" alt="" />
        </div>
        <div className="hero-img-copy" ref={heroImgCopyRef}>
          <p>Scroll para baixo para revelar</p>
        </div>
      </div>

      <div className="fade-overlay" ref={fadeOverlayRef}></div>

      <div className="overlay" ref={svgOverlayRef}>
        <svg width="100%" height="100%">
          <defs>
            <mask id="logoRevealMask">
              <rect width="100%" height="100%" fill="white" />
              <path id="logoMask" ref={logoMaskRef}></path>
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="#111117"
            mask="url(#logoRevealMask)"
          />
        </svg>
      </div>

      <div className="logo-container" ref={logoContainerRef}></div>

      <div className="overlay-copy" ref={overlayCopyRef}>
        <h1>Feito <br/>
            por   <br/>
          Gervas</h1>
      </div>
      
    </section>
    <section>
      <div className="overlay-copy-f" ref={overlayyCopyRef}>
        <h1>outras infos.</h1>
      </div>
    </section>
    <section className="outro">
      <p>mais infos</p>
    </section>
    </div>
  );
}

