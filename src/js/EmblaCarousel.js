import React, { useState, useEffect, useCallback } from "react";
import { PrevButton, NextButton } from "./EmblaCarouselButtons";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { mediaByIndex } from "../media";
import { Thumb } from "./EmblaCarouselThumb";
import "../css/embla.css";

const EmblaCarousel = ({ slides }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportRef, embla] = useEmblaCarousel(
    {
      axis: "y",
      skipSnaps: false
    },
    [WheelGesturesPlugin({ forceWheelAxis: "y" })]
  );

  const [thumbViewportRef, emblaThumbs] = useEmblaCarousel(
    {
      axis: "y",
      selectedClass: "",
      dragFree: true
    },
    [WheelGesturesPlugin({ forceWheelAxis: "y" })]
  );

  const onThumbClick = useCallback(
    (index) => {
      if (!embla || !emblaThumbs) return;
      if (emblaThumbs.clickAllowed()) embla.scrollTo(index);
    },
    [embla, emblaThumbs]
  );

  const onScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);
  // const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  // const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  // const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  // const onSelect = useCallback(() => {
  //   if (!embla) return;
  // }, [embla]);

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbs) return;
    setSelectedIndex(embla.selectedScrollSnap());
    emblaThumbs.scrollTo(embla.selectedScrollSnap());
  }, [embla, emblaThumbs, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    embla.on("scroll", onScroll);
    onSelect();
  }, [embla, onSelect, onScroll]);

  return (
    <div>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {slides.map((index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__inner">
                  <img
                    className="embla__slide__img"
                    src={mediaByIndex(index)}
                    alt="A cool cat."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="embla__progress">
          <div
            className="embla__progress__bar"
            style={{ transform: `translateX(${scrollProgress}%)` }}
          />
        </div>
        <div className="embla embla--thumb">
          <div className="embla__viewport" ref={thumbViewportRef}>
            <div className="embla__container__carousel embla__container--thumb">
              {slides.map((index) => (
                <Thumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  imgSrc={mediaByIndex(index)}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
