import { useTranslation } from "react-i18next";
import "./Hero.css";
const Hero = () => {
  const { t } = useTranslation("hero");

  return (
    <div className="hero-container dark-theme">
      <h1 className="hero-title">{t("title")}</h1>
      <p className="hero-description">{t("description1")}</p>
      <p className="hero-description">{t("description2")}</p>
      
      <div className="hero-explanation">
        <h2 className="section-title">{t("circuitExplanation")}</h2>
        
        <div className="section-content">
          <h3 className="subsection-title">1. {t("circuitInputs")}</h3>
          <ul className="input-list">
            <li>
              <code className="code-tag">balance</code>: {t("balanceDescription")}
            </li>
            <li>
              <code className="code-tag">payment</code>: {t("paymentDescription")}
            </li>
            <li>
              <code className="code-tag">limit</code>: {t("limitDescription")}
            </li>
            <li>
              <code className="code-tag">fee_rate</code>: {t("feeRateDescription")}
            </li>
          </ul>

          <h3 className="subsection-title">2. {t("circuitLogic")}</h3>
          <ul className="logic-list">
            <li>
              <p>{t("feeCalculation")} (<code className="code-tag">fee</code>) {t("feeFormula")}</p>
              <div className="formula-container">
                fee = payment × fee_rate / 100
              </div>
            </li>
            <li>
              <p>{t("totalPaymentCalculation")} (<code className="code-tag">total_payment</code>)</p>
              <div className="formula-container">
                total_payment = payment + fee
              </div>
            </li>
            <li>
              <p>{t("assertConditions")} <code className="code-tag">assert</code></p>
              <ul className="conditions-list">
                <li>
                  <p>{t("balanceCondition")}</p>
                  <div className="formula-container">
                    balance ≥ total_payment
                  </div>
                </li>
                <li>
                  <p>{t("limitCondition")}</p>
                  <div className="formula-container">
                    total_payment ≤ limit
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hero;