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
  const [inputs, setInputs] = useState<{ [key: string]: number }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!acir) {
    return null;
  }

  const handleInputChange = (name: string, value: number) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  async function handleCreateProof(): Promise<void> {
    setStatus(null);
    setIsLoading(true);
    onProofGenerated(null);

    try {
      if(acir){
        const acidCircuit = acir.program as CompiledCircuit;
        const params = inputs;
        const noir = new Noir(acidCircuit);
        const backend = new UltraHonkBackend(acidCircuit.bytecode);
  
        const { witness } = await noir.execute(params);
        const generatedProof = await backend.generateProof(witness);
  
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
      <p className="form-subtitle">Valores sugeridos para el ejemplo base:</p>
      <p>balance: 200, payment: 100, limit: 300, fee_rate(%): 10</p>
      {acir.program.abi.parameters.map((param) => (
        <div key={param.name} className="form-group">
          <label>
            {param.name.charAt(0).toUpperCase() + param.name.slice(1)}:
            <input
              type="number"
              value={inputs[param.name] || 0}
              onChange={(e) => handleInputChange(param.name, Number(e.target.value))}
              className="form-input"
            />
          </label>
        </div>
      ))}
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
