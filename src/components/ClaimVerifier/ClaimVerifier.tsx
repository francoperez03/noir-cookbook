import { useEffect, useState } from "react";
import { ProofData, UltraHonkBackend } from "@aztec/bb.js";
import "./ClaimVerifier.css";
import { useTranslation } from "react-i18next";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
import { CompiledCircuit } from "@noir-lang/noir_js";
import { AnimatePresence, motion } from "framer-motion";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

type ClaimVerifierProps = {
  proof: ProofData | null;
  acir: { program: CompiledCircuit } | null;
  onProofChange: (proof: ProofData | null) => void;
};

function ClaimVerifier({ proof, acir}: ClaimVerifierProps) {
  const { t } = useTranslation("proofVerifier");
  const [publicInputs, setInputValue] = useState<string>(
    proof ? JSON.stringify([...proof.proof]) : ""
  );

  const [status, setStatus] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setInputValue(proof ? JSON.stringify([...proof.proof]) : "");
  }, [proof]);

  async function handleVerifyProof(): Promise<void> {
    if (!proof) {
      setStatus(t("noProof"));
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      if (acir) {
        const acidCircuit = acir.program as CompiledCircuit;
        const backend = new UltraHonkBackend(acidCircuit.bytecode);

        const isValid = await backend.verifyProof({
          publicInputs: Object.values(publicInputs).map((value) =>
            value.toString()
          ),
          proof: proof.proof,
        });
        setStatus(isValid ? t("successMessage") : t("invalidProof"));

        setShowResult(true);
        setTimeout(() => {
          setShowResult(false);
        }, 1000);
      }
    } catch (error) {
      setStatus(
        `${t("errorPrefix")}: ${error instanceof Error ? error.message : t("unknownError")
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }


  const publicInput = proof?.publicInputs?.[0] || "";
  console.log(proof?.publicInputs)
  return (
    <div className="proof-verifier-container">
      <h2 className="verifier-title">Final Step: Verify Your Proof</h2>
      <p className="verifier-intro">
        You’ve generated a ZK proof showing your ticket exists in the Merkle Tree.
        Now it’s time to verify it. No identity, no password — just math.
      </p>

      <div className="verifier-diagram">
        <div className="verifier-row">
          <motion.div className="verifier-box input-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label">📥 Public Input (Root)</span>
            <code className="value">{publicInput}</code>
          </motion.div>
          <motion.div className="verifier-box input-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="label">🧾 ZK Proof</span>
            <code className="value">[...{proof?.proof?.length} bytes]</code>
          </motion.div>
        </div>

        <motion.div
          className="verifier-box verifier-core"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="label">🔐 Verifier</span>
          <button className="verify-button" onClick={handleVerifyProof} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Run Verification"}
          </button>
        </motion.div>
        <AnimatePresence>
          {showResult && (
            <motion.div
              key={status}
              className={`verifier-result ${status === "ok" ? "ok" : "nok"}`}
              initial={{
                opacity: 0,
                y: -30,
                scale: 0.9,
                filter: "blur(6px)"
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.9,
                filter: "blur(8px)",
                transition: {
                  duration: 0.6,
                  ease: "easeInOut"
                }
              }}
            >
              {status === "ok" ? "✅ Valid Proof" : "❌ Invalid Proof"}
            </motion.div>
          )}
        </AnimatePresence>


      </div>



    </div>
  );

}

export default ClaimVerifier;




