import { useState, useRef } from "react";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import "./ProofForm.css";
import { useTranslation } from "react-i18next";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

interface ProofFormProps {
  onProofGenerated: (proof: ProofData | null) => void;
  acir: { program: CompiledCircuit } | null;
}

function ProofForm({ onProofGenerated, acir }: ProofFormProps) {
  const { t } = useTranslation("proofForm");
  const [inputs, setInputs] = useState<{ [key: string]: number }>({
    balance: 200,
    payment: 100,
    limit: 300,
    fee_rate: 10,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const compileButtonRef = useRef<HTMLDivElement>(null);

  if (!acir) {
    return null;
  }

  const handleInputChange = (name: string, value: string) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) || value === '') {
      setInputs((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  async function handleCreateProof(): Promise<void> {
    setStatus(null);
    setIsLoading(true);
    onProofGenerated(null);

    try {
      if (acir) {
        const acidCircuit = acir.program as CompiledCircuit;
        const params = inputs;
        const noir = new Noir(acidCircuit);
        const backend = new UltraHonkBackend(acidCircuit.bytecode);
        const { witness } = await noir.execute(params);
        const generatedProof = await backend.generateProof(witness);

        onProofGenerated(generatedProof);
        setStatus(t("successMessage"));
        handleScrollToDetails();
      }
    } catch (error) {
      setStatus(`${t("errorPrefix")}: ${error instanceof Error ? error.message : t("unknownError")}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleScrollToDetails = () => {
    if (compileButtonRef.current) {
      compileButtonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">{t("title")}</h1>
      <p className="form-explanation">{t("explanation")}</p>
      <p className="form-subtitle">{t("suggestedValues")}</p>
      <p>{t("exampleValues")}</p>
      {acir.program.abi.parameters.map((param) => (
        <div key={param.name} className="form-group">
          <label>
            {t(`parameters.${param.name}`)}:
            <input
              type="text"
              value={inputs[param.name] || 0}
              onChange={(e) => handleInputChange(param.name, e.target.value)}
              className="form-input"
            />
          </label>
        </div>
      ))}
      <button onClick={handleCreateProof} className="form-button" disabled={isLoading}>
        {isLoading ? t("creatingProof") : t("createProof")}
      </button>

      {status && (
        <div className={`form-status ${status.startsWith(t("errorPrefix")) ? "error" : "success"}`}>
          {status}
        </div>
      )}
      <div ref={compileButtonRef}>
        {/* Contenido adicional */}
      </div>
    </div>
  );
}

export default ProofForm;
