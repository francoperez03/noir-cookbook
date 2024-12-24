import { useState } from "react";
import Hero from "./components/Hero/Hero";
import ProofForm from "./components/ProofForm/ProofForm";
import "./App.css";
import "./components/Hero/Hero.css";
import "./components/ProofForm/ProofForm.css";
import { ProofData } from "@aztec/bb.js";
import CircuitCompiler from "./components/CircuitCompiler/CircuitCompiler";
import { CompiledCircuit } from "@noir-lang/noir_js";
import ProofVerifier from "./components/ProofVerifier/ProofVerifier";

function App() {
  const [proof, setProof] = useState<ProofData | null>(null);
  const [acir, setAcir] = useState<object | null>(null);

  return (
    <div className="app-container">
      <div className="hero">
        <Hero />
      </div>

      <CircuitCompiler
        mainUrl="/circuit/src/main.nr"
        nargoTomlUrl="/circuit/Nargo.toml"
        onCompile={(compiledAcir) => setAcir(compiledAcir)}
      />

      <div className="main-content">
        <div className="form-section">
          <ProofForm onProofGenerated={(newProof) => setProof(newProof)} acir={acir as { program: CompiledCircuit }} />
        </div>
        {proof && (
          <ProofVerifier proof={proof} acir={acir as { program: CompiledCircuit }} onProofChange={(updatedProof) => setProof(updatedProof)} />
        )}
      </div>
    </div>
  );
}

export default App;
