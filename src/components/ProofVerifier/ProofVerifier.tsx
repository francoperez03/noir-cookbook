import React, { useEffect, useState } from "react";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import "./ProofVerifier.css";

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
  const [inputValue, setInputValue] = useState<string>(proof ? JSON.stringify([...proof.proof]) : "");
  const [publicInputs, setPublicInputs] = useState<{ [key: string]: number }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setInputValue(value);

    try {
      const parsedArray = new Uint8Array(JSON.parse(value));
      if (proof) {
        onProofChange({ publicInputs: proof.publicInputs!, proof: parsedArray });
      }
    } catch (error) {
      console.error("Error analyzing the input", error);
    }
  }

  function handlePublicInputChange(name: string, value: number) {
    setPublicInputs((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    setInputValue(proof ? JSON.stringify([...proof.proof]) : "");
  }, [proof]);

  async function handleVerifyProof(): Promise<void> {
    if (!proof) {
      setStatus("There is no proof to verify.");
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      if (acir) {
        const acidCircuit = acir.program as CompiledCircuit;
        const backend = new UltraHonkBackend(acidCircuit.bytecode);

        const isValid = await backend.verifyProof({
          publicInputs: Object.values(publicInputs).map((value) => value.toString()),
          proof: proof.proof,
        });

        setStatus(isValid ? "¡Prueba verificada correctamente!" : "Prueba inválida.");
      }
    } catch (error) {
      setStatus(`Verification error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="proof-verifier-container">
      <h1 className="proof-verifier-title">Paso 3: Verificá</h1>
      <h2 className="proof-verifier-subtitle">Prueba</h2>

      <div className="proof-input-container">
        <textarea
          className="proof-input-textarea"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Aqui aparecerá la prueba en formato Uint8Array..."
        />
      </div>

      {acir?.program.abi.parameters
        .filter((param) => param.visibility === "public")
        .map((param) => (
          <div key={param.name} className="form-group">
            <label>
              {param.name.charAt(0).toUpperCase() + param.name.slice(1)}:
              <input
                type="number"
                value={publicInputs[param.name] || ""}
                onChange={(e) => handlePublicInputChange(param.name, Number(e.target.value))}
                className="form-input"
              />
            </label>
          </div>
        ))}

      <div className="verify-container">
        <button onClick={handleVerifyProof} className="verify-button" disabled={!proof || isLoading}>
          {isLoading ? "Verificando..." : "Verificar Prueba"}
        </button>
        {status && (
          <div className={`verify-status ${status.startsWith("Prueba inválida") ? "error" : "success"}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProofVerifier;
