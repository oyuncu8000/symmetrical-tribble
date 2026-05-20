import useEmblaCarousel from "embla-carousel-react";
import { FilmCard } from "./FilmCard";
import { SliderData } from "@/data/content";

interface SliderProps {
  data: SliderData;
}

export function Slider({ data }: SliderProps) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps"
  });

  return (
    <div className="mb-10 w-full pl-8 md:pl-16">
      <h2 className="text-2xl font-bold mb-4 font-['Bebas_Neue'] tracking-wider text-foreground flex items-center gap-2">
        {data.title}
      </h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pr-16 py-4">
          {data.cards.map((card, i) => (
            <FilmCard key={i} card={card} isSpecial={data.type === "special"} />
          ))}
        </div>
      </div>
    </div>
  );
}
