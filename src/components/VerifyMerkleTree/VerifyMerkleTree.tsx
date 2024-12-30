import React, { useState } from "react";
import "./VerifyMerkleTree.css";
import { useTranslation } from "react-i18next";

function VerifyMerkleTree() {
  const { t } = useTranslation("merkleVerifier");
  const [value, setValue] = useState<string>("");
  const [index, setIndex] = useState<number | string>("");
  const [hashPath, setHashPath] = useState<string>("");
  const [root, setRoot] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleVerify = () => {
    try {
      // Simulación de la lógica de verificación
      // const parsedHashPath = hashPath.split(",").map((hash) => hash.trim());
      // const belongs = computeMerkleTree(value, index, parsedHashPath, root); // Reemplaza con tu lógica real
      const belongs = true
      setVerificationResult(belongs ? t("verified") : t("notVerified"));
    } catch  {
      setVerificationResult(t("errorVerifying"));
    }
  };

  return (
    <div className="verify-merkle-tree-container">
      <h2 className="verify-title">{t("verifyTitle")}</h2>
      <p className="verify-explanation">{t("verifyExplanation")}</p>

      <div className="input-container">
        <label htmlFor="value">{t("valueLabel")}</label>
        <input
          type="text"
          id="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("valuePlaceholder")}
        />

        <label htmlFor="index">{t("indexLabel")}</label>
        <input
          type="number"
          id="index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          placeholder={t("indexPlaceholder")}
        />

        <label htmlFor="hashPath">{t("hashPathLabel")}</label>
        <textarea
          id="hashPath"
          value={hashPath}
          onChange={(e) => setHashPath(e.target.value)}
          placeholder={t("hashPathPlaceholder")}
        ></textarea>

        <label htmlFor="root">{t("rootLabel")}</label>
        <input
          type="text"
          id="root"
          value={root}
          onChange={(e) => setRoot(e.target.value)}
          placeholder={t("rootPlaceholder")}
        />
      </div>

      <button onClick={handleVerify} className="verify-button">
        {t("verifyButton")}
      </button>

      {verificationResult && (
        <div
          className={`verification-status ${
            verificationResult === t("verified") ? "success" : "error"
          }`}
        >
          {verificationResult}
        </div>
      )}
    </div>
  );
}

export default VerifyMerkleTree;
