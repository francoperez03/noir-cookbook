import { useState } from "react";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import "./ClaimForm.css";
import { t } from "i18next";

interface ClaimFormProps {
  leaf: string;
  root: string;
  hashPath: string[];
  directions: boolean[];
  acir: { program: CompiledCircuit };
  onProofGenerated: (proof: ProofData) => void;
}

export default function ClaimForm({
  leaf,
  root,
  hashPath,
  directions,
  acir,
  onProofGenerated
}: ClaimFormProps) {
  const [inputs, setInputs] = useState({
    leaf,
    root,
    hash_path: hashPath,
    selector: directions
  });

  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proofOutput, setProofOutput] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateProof = async () => {
    setStatus(null);
    setIsLoading(true);

    try {
      const parsedInputs = {
        leaf: "0x0b6423c65de8971f0643ab09e384b6009ccf91afc59eb82b3f762d3b068f3be6",
        path: [
          "0x2c89cbf002f98b27bed8c22279d920ec121130909ccb798b59e775f567f2eef6",
          "0x232cffccaefe9c394f4aada19e5b0599b85de274e62074a686431b608c468c94"
        ],
        selector: [true, true],
        root: "0x0a75936c9198aa238464d75b9f441788683d16a315c428c60160c24566d010a9"
      };

      const noir = new Noir(acir.program);
      const backend = new UltraHonkBackend(acir.program.bytecode);
      const { witness } = await noir.execute(parsedInputs);
      const generatedProof = await backend.generateProof(witness);

      setProofOutput(JSON.stringify(generatedProof, null, 2));
      onProofGenerated(generatedProof);
      setStatus("Proof generated successfully!");
    } catch (e) {
      console.error(e);
      setStatus("Failed to generate proof");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="claim-form-container">
      <h2 className="claim-form-title">Claim Your Entry</h2>
      <p className="claim-form-description">
        This form will generate a ZK proof for your Merkle inclusion.
      </p>

      <div className="form-group">
        <label>Leaf</label>
        <input
          type="text"
          value={inputs.leaf}
          onChange={e => handleChange("leaf", e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Root</label>
        <input
          type="text"
          value={inputs.root}
          onChange={e => handleChange("root", e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Hash Path (comma-separated)</label>
        <textarea
          value={inputs.hash_path.join(",")}
          onChange={e =>
            setInputs(prev => ({
              ...prev,
              hash_path: e.target.value.split(",")
            }))
          }
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Selector (comma-separated booleans)</label>
        <input
          type="text"
          value={inputs.selector.join(",")}
          onChange={e =>
            setInputs(prev => ({
              ...prev,
              selector: e.target.value.split(",").map(s => s.trim() === "true")
            }))
          }
          className="form-input"
        />
      </div>

      <button
        onClick={handleGenerateProof}
        className="claim-form-button"
        disabled={isLoading}
      >
        {isLoading ? "⏳ Generating..." : "Generate Proof"}
      </button>

      {proofOutput && (
        <div className="claim-proof-output">
          <h2 className="claim-form-title">Generated Proof</h2>
          <pre>{proofOutput}</pre>
        </div>
      )}
                

      {status && <div className={`claim-form-status ${
            status.startsWith(t("errorPrefix")) ? "error" : "success"
          }`}>{status}</div>}
    </div>
  );
}
