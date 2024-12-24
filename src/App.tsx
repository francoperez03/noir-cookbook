import { useState } from "react";
import Hero from "./components/Hero/Hero";
import ProofForm from "./components/ProofForm/ProofForm";
import VerifyProof from "./components/VerifyProof/VerifyProof";
import "./App.css";
import "./components/Hero/Hero.css";
import "./components/ProofForm/ProofForm.css";
import { ProofData } from "@aztec/bb.js";
import ProofInput from "./components/ProofInput/ProofInput";

function App() {
  const [proof, setProof] = useState<ProofData | null>(null);

  return (
    <div className="app-container">
      {/* Hero at the top */}
      <div className="hero">
        <Hero />
      </div>

      {/* Form and Input side by side */}
      <div className="main-content">
        <div className="left-section">
          <ProofForm onProofGenerated={(newProof) => setProof(newProof)} />
        </div>
        <div className="right-section">
          <ProofInput proof={proof} onProofChange={(newProof) => setProof(newProof)} />
          <VerifyProof proof={proof} />
        </div>
      </div>
    </div>
  );
}

export default App;
