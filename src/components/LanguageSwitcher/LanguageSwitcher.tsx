import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button className="language-toggle" onClick={toggleLanguage}>
      {i18n.language === "en" ? "Español" : "English"}
    </button>
  );
}

export default LanguageSwitcher;
