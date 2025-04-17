import React, { useEffect, useState } from "react";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import "./ProofVerifier.css";
import { useTranslation } from "react-i18next";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
import { CompiledCircuit } from "@noir-lang/noir_js";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

type ProofVerifierProps = {
  proof: ProofData | null;
  acir: { program: CompiledCircuit } | null;
  onProofChange: (proof: ProofData | null) => void;
};

function ProofVerifier({ proof, acir, onProofChange }: ProofVerifierProps) {
  const { t } = useTranslation("proofVerifier");
  const [inputValue, setInputValue] = useState<string>(
    proof ? JSON.stringify([...proof.proof]) : ""
  );
  const [publicInputs, setPublicInputs] = useState<{ [key: string]: number }>({
    payment: 100,
    limit: 300,
    fee_rate: 10,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setInputValue(value);

    try {
      const parsedArray = new Uint8Array(JSON.parse(value));
      if (proof) {
        onProofChange({
          publicInputs: proof.publicInputs!,
          proof: parsedArray,
        });
      }
    } catch (error) {
      console.error("Error analyzing the input", error);
    }
  }

  function handlePublicInputChange(name: string, value: string) {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) || value === "") {
      setPublicInputs((prev) => ({ ...prev, [name]: numericValue }));
    }
  }

  useEffect(() => {
    setInputValue(proof ? JSON.stringify([...proof.proof]) : "");
  }, [proof]);

  async function handleVerifyProof(): Promise<void> {
    if (!proof) {
      setStatus(t("noProof"));
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      if (acir) {
        const acidCircuit = acir.program as CompiledCircuit;
        const backend = new UltraHonkBackend(acidCircuit.bytecode);

        const isValid = await backend.verifyProof({
          publicInputs: Object.values(publicInputs).map((value) =>
            value.toString()
          ),
          proof: proof.proof,
        });

        setStatus(isValid ? t("successMessage") : t("invalidProof"));
      }
    } catch (error) {
      setStatus(
        `${t("errorPrefix")}: ${
          error instanceof Error ? error.message : t("unknownError")
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }

  const hasPublicInputs = acir?.program.abi.parameters.some(
    (param) => param.visibility === "public"
  );

  return (
    <div className="proof-verifier-container">
      <h1 className="proof-verifier-title">{t("title")}</h1>
      <p className="proof-verifier-explanation">{t("explanation")}</p>

      {hasPublicInputs ? (
        <h2 className="proof-verifier-public-inputs">{t("publicInputs")}</h2>
      ) : (
        <h2 className="proof-verifier-no-public-inputs">
          {t("noPublicInputs")}
        </h2>
      )}

      {hasPublicInputs &&
        acir?.program.abi.parameters
          .filter((param) => param.visibility === "public")
          .map((param) => (
            <div key={param.name} className="form-group">
              <label className="form-label" htmlFor={param.name}>
                {t(`parameters.${param.name}`)}
              </label>
              <input
                id={param.name}
                type="text"
                value={publicInputs[param.name] || ""}
                onChange={(e) =>
                  handlePublicInputChange(param.name, e.target.value)
                }
                className="form-input"
              />
            </div>
          ))}

      <h2 className="proof-verifier-subtitle">{t("subtitle")}</h2>

      <div className="proof-input-container">
        <textarea
          className="proof-input-textarea"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t("placeholder")}
        />
      </div>

      <div className="verify-container">
        <button
          onClick={handleVerifyProof}
          className="verify-button"
          disabled={!proof || isLoading}
        >
          {isLoading ? t("verifying") : t("verify")}
        </button>
        {status && (
          <div
            className={`verify-status ${
              status.startsWith(t("invalidProof")) ? "error" : "success"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProofVerifier;
