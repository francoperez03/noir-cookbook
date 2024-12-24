import { useState } from "react";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import circuit from "../../../circuit/target/circuit.json";
import "./VerifyProof.css";


import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

function VerifyProof({ proof }: { proof: ProofData | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleVerifyProof(): Promise<void> {
    if (!proof) {
      setStatus("There is no proof to verify.");
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const backend = new UltraHonkBackend(circuit.bytecode);
      const isValid = await backend.verifyProof(proof);

      setStatus(isValid ? "¡Prueba verificada correctamente!" : "Prueba inválida.");
    } catch (error) {
      setStatus(`Verification error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }
  console.log({status});
  return (
    <div className="verify-container">
      <h2 className="verify-title">Verificación de Prueba</h2>
      <button onClick={handleVerifyProof} className="verify-button" disabled={!proof || isLoading}>
        {isLoading ? "Verificando..." : "Verificar Prueba"}
      </button>
      {status && (
        <div className={`verify-status ${status.startsWith("Prueba inválida") ? "error" : "success"}`}>
          {status}
        </div>
      )}
    </div>
  );
}

export default VerifyProof;
