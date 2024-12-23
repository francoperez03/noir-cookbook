import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CompiledCircuit, Noir } from '@noir-lang/noir_js';
import circuit from '../circuit/target/circuit.json';
// import { UltraHonkBackend } from '@aztec/bb.js';

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);
function App() {

  async function handleCreateProof(): Promise<void> {
    const params = {
      balance: 100,
      payment: 80,
      limit: 200,
      fee_rate: 10,
    }
    const noir = new Noir(circuit as CompiledCircuit);
    // const backend = new UltraHonkBackend(circuit.bytecode);
    const { witness } = await noir.execute(params);
    console.log({witness})
  }

  return (
    <>
      <div>
        <a target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hello Noir</h1>
      <div className="card">
        <button onClick={handleCreateProof}>
          Create proof
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
