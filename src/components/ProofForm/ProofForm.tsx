import { useState } from 'react';
import { CompiledCircuit, Noir } from '@noir-lang/noir_js';
import circuit from '../../../circuit/target/circuit.json';
import { UltraHonkBackend } from '@aztec/bb.js';
import './ProofForm.css';

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

function ProofForm() {
  const [balance, setBalance] = useState(100);
  const [payment, setPayment] = useState(80);
  const [limit, setLimit] = useState(200);
  const [feeRate, setFeeRate] = useState(10);
  const [status, setStatus] = useState<string | null>(null);

  async function handleCreateProof(): Promise<void> {
    try {
      setStatus(null); // Reset status before starting
      const params = { balance, payment, limit, fee_rate: feeRate };
      const noir = new Noir(circuit as CompiledCircuit);
      const backend = new UltraHonkBackend(circuit.bytecode);

      const { witness } = await noir.execute(params);
      const proof = await backend.generateProof(witness);

      setStatus("¡Prueba creada correctamente!");
      console.log({ witness });
      console.log({ proof });
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Hello Noir</h1>
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
      <button onClick={handleCreateProof} className="form-button">
        Crear Prueba
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
