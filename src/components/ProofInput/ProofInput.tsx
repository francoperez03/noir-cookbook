import React, { useEffect, useState } from "react";
import "./ProofInput.css";
import { ProofData } from "@aztec/bb.js";

type ProofInputProps = {
  proof: ProofData | null;
  onProofChange: (proof: ProofData | null) => void;
};

function ProofInput({ proof, onProofChange }: ProofInputProps) {
  const [inputValue, setInputValue] = useState<string>(proof ? JSON.stringify([...proof.proof]) : "");

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

  useEffect(() => {
    setInputValue(proof ? JSON.stringify([...proof.proof]) : "");
  }, [proof]);

  return (
    <div className="proof-input-container">
      <label className="proof-input-label">Enter Uint8Array Proof:</label>
      <textarea
        className="proof-input-textarea"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Aqui aparecerá la prueba en formato Uint8Array..."
      />
    </div>
  );
}

export default ProofInput;
