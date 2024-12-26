import { useState } from "react";
import CircuitCompiler from "../../components/CircuitCompiler/CircuitCompiler";
import ProofForm from "../../components/ProofForm/ProofForm";
import ProofVerifier from "../../components/ProofVerifier/ProofVerifier";
import { ProofData } from "@aztec/bb.js";
import { CompiledCircuit } from "@noir-lang/noir_js";
import Hero from "../../components/Hero/Hero";

function ProofsPage() {
  const [proof, setProof] = useState<ProofData | null>(null);
  const [acir, setAcir] = useState<object | null>(null);

  return (
    <div className="proofs-page">
      <Hero />
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
          <ProofVerifier
            proof={proof}
            acir={acir as { program: CompiledCircuit }}
            onProofChange={(updatedProof) => setProof(updatedProof)}
          />
        )}
      </div>
    </div>
  );
}

export default ProofsPage;
