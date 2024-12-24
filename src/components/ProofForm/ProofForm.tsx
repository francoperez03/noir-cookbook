import { useState } from "react";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import "./ProofForm.css";

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
  const [balance, setBalance] = useState(100);
  const [payment, setPayment] = useState(80);
  const [limit, setLimit] = useState(200);
  const [feeRate, setFeeRate] = useState(10);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!acir) {
    return null;
  }

  async function handleCreateProof(): Promise<void> {
    setStatus(null);
    setIsLoading(true);
    onProofGenerated(null);

    try {
      if(acir){
        const params = { balance, payment, limit, fee_rate: feeRate };
        const acidCircuit = acir.program as CompiledCircuit;
        console.log(acidCircuit)
        const noir = new Noir(acidCircuit);
        const backend = new UltraHonkBackend(acidCircuit.bytecode);
        console.log('INSTANCIADO2');
  
        const { witness } = await noir.execute(params);
        console.log(witness);
        const generatedProof = await backend.generateProof(witness);
        console.log(generatedProof);
        onProofGenerated(generatedProof);
        setStatus("¡Prueba creada correctamente!");
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Paso 2: Probá</h1>
      <div className="form-group">
        <label>
          Balance:
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="form-input"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Payment:
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(Number(e.target.value))}
            className="form-input"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Limit:
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="form-input"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Fee Rate:
          <input
            type="number"
            value={feeRate}
            onChange={(e) => setFeeRate(Number(e.target.value))}
            className="form-input"
          />
        </label>
      </div>
      <button onClick={handleCreateProof} className="form-button" disabled={isLoading}>
        {isLoading ? "Creando prueba..." : "Crear Prueba"}
      </button>
      {status && (
        <div className={`form-status ${status.startsWith("Error") ? "error" : "success"}`}>
          {status}
        </div>
      )}
    </div>
  );
}

export default ProofForm;
