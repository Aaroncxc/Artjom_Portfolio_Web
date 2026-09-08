import {
  ChipsLayout,
  FactsLayout,
  FeatureLayout,
  GalleryLayout,
  HeroLayout,
  MosaicLayout,
  PartnersLayout,
  SplitLayout,
  TimelineLayout,
  TriptychLayout,
} from '@/components/intro/layouts';
import type { IntroLang, IntroSlideDef } from '@/lib/introCopy';

export function IntroSlideView({
  slide,
  lang,
  exportMode = false,
}: {
  slide: IntroSlideDef;
  lang: IntroLang;
  exportMode?: boolean;
}) {
  switch (slide.layout) {
    case 'hero':
      return <HeroLayout slide={slide} lang={lang} exportMode={exportMode} />;
    case 'timeline':
      return (
        <TimelineLayout slide={slide} lang={lang} exportMode={exportMode} />
      );
    case 'facts':
      return <FactsLayout slide={slide} lang={lang} exportMode={exportMode} />;
    case 'split':
      return <SplitLayout slide={slide} lang={lang} exportMode={exportMode} />;
    case 'gallery':
      return (
        <GalleryLayout slide={slide} lang={lang} exportMode={exportMode} />
      );
    case 'feature':
      return (
        <FeatureLayout slide={slide} lang={lang} exportMode={exportMode} />
      );
    case 'triptych':
      return (
        <TriptychLayout slide={slide} lang={lang} exportMode={exportMode} />
      );
    case 'chips':
      return <ChipsLayout slide={slide} lang={lang} exportMode={exportMode} />;
    case 'partners':
      return (
        <PartnersLayout slide={slide} lang={lang} exportMode={exportMode} />
      );
    case 'mosaic':
      return <MosaicLayout slide={slide} lang={lang} exportMode={exportMode} />;
    default:
      return <SplitLayout slide={slide} lang={lang} exportMode={exportMode} />;
  }
}
