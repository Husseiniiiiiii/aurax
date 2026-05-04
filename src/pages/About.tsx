import {
  Award,
  Gem,
  Globe,
  HeartHandshake,
  Sparkles,
  Users,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

export default function About() {
  const { t } = useLanguage();

  const values: {
    Icon: typeof Gem;
    titleKey: TranslationKey;
    descKey: TranslationKey;
  }[] = [
    {
      Icon: Gem,
      titleKey: "about.value1Title",
      descKey: "about.value1Desc",
    },
    {
      Icon: HeartHandshake,
      titleKey: "about.value2Title",
      descKey: "about.value2Desc",
    },
    {
      Icon: Globe,
      titleKey: "about.value3Title",
      descKey: "about.value3Desc",
    },
    {
      Icon: Award,
      titleKey: "about.value4Title",
      descKey: "about.value4Desc",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-10">
      <section className="text-center max-w-3xl mx-auto">
        <div className="text-xs font-bold tracking-widest text-aurax-500 uppercase">
          {t("about.eyebrow")}
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-black">
          {t("about.title")}
        </h1>
        <p className="mt-4 text-aurax-500 leading-relaxed">{t("about.desc")}</p>
      </section>

      <section className="mt-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="card overflow-hidden aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop"
            alt="Aurax Store"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="chip">
            <Sparkles className="h-3.5 w-3.5" />
            {t("about.visionChip")}
          </span>
          <h2 className="mt-4 text-3xl font-black">{t("about.visionTitle")}</h2>
          <p className="mt-4 text-aurax-600 dark:text-aurax-300 leading-relaxed">
            {t("about.visionDesc")}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { Icon: Users, v: "12K+", l: t("about.statsCustomer") },
              { Icon: Gem, v: "500+", l: t("about.statsProducts") },
              { Icon: Award, v: "4.9", l: t("about.statsRating") },
            ].map(({ Icon, v, l }, i) => (
              <div key={i} className="card p-4 text-center">
                <Icon className="h-5 w-5 mx-auto text-aurax-500" />
                <div className="mt-2 text-xl font-black silver-text">{v}</div>
                <div className="text-xs text-aurax-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-widest text-aurax-500 uppercase">
            {t("about.valuesEyebrow")}
          </div>
          <h2 className="mt-1 text-3xl md:text-4xl font-black">
            {t("about.valuesTitle")}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="card p-6 hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="h-12 w-12 grid place-items-center rounded-xl bg-noir-gradient text-aurax-100 ring-1 ring-aurax-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-extrabold text-lg">{t(titleKey)}</h3>
              <p className="mt-2 text-sm text-aurax-500 leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
