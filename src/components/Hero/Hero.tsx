import "./Hero.css";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation("hero");

  return (
    <div className="hero-container">
      <h1 className="hero-title">{t("title")}</h1>
      <p className="hero-description">{t("description1")}</p>
      <p className="hero-description">{t("description2")}</p>
    </div>
  );
}

export default Hero;
