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

function ClaimVerifier({ proof, acir }: ClaimVerifierProps) {
  const { t } = useTranslation("proofVerifier");
  const [publicInput, setPublicInput] = useState<string>("");


  const [status, setStatus] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (proof?.publicInputs?.[0]) {
      setPublicInput(proof.publicInputs[0]);
    }
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
          publicInputs: [publicInput],
          proof: proof.proof,
        });
        console.log({ isValid })
        setStatus(isValid ? t("successMessage") : t("invalidProof"));

        setShowResult(true);
        setTimeout(() => {
          setShowResult(false);
        }, 1000);
      }
    } catch (error) {
      console.log({ error })

      setStatus(
        `${t("errorPrefix")}: ${error instanceof Error ? error.message : t("unknownError")
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="proof-verifier-container">
      <h2 className="verifier-title">Final Step: Verify Your Proof</h2>
      <p className="verifier-intro">
        To verify your ticket, you only need the inputs everyone knows: the <strong>Merkle root</strong> and your <strong>ZK proof</strong>.
        <br /><br />
        That’s all. No identity, no secrets — just public data and math.
        <br /><br />
        Hit <strong>Run Verification</strong> to see if your proof holds.
      </p>

      <div className="verifier-diagram">
        <div className="verifier-inputs">
          <motion.div className="verifier-box input-box" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="label">Merkle Root</span>
            <input
              className="value"
              type="text"
              spellCheck={false}
              value={publicInput}
              onChange={(e) => setPublicInput(e.target.value)}
            />
          </motion.div>
          <motion.div className="verifier-box input-box" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="label">ZK Proof</span>
            <code className="value">[...{proof?.proof?.length} bytes]</code>
          </motion.div>
        </div>

        <div className="verifier-core-wrapper">
          {/* Verifier */}
          <motion.div
            className="verifier-box verifier-core"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="label">Verifier</span>
            <button className="verify-button" onClick={handleVerifyProof} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Run Verification"}
            </button>
          </motion.div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                key={status}
                className={`verifier-result ${status === t("successMessage") ? "ok" : "nok"}`}
                initial={{
                  opacity: 0,
                  x: -50,
                  scale: 0.6,
                  filter: "blur(6px)",
                  transformOrigin: "left center"
                }}
                animate={{
                  opacity: 1,
                  x: 60,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }
                }}
                exit={{
                  opacity: 0,
                  x: 90,
                  scale: 0.9,
                  filter: "blur(6px)",
                  transition: {
                    duration: 0.5,
                    ease: "easeInOut"
                  }
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  transform: "translateY(-50%)"
                }}
              >
                {status === t("successMessage") ? "Valid Proof" : "Invalid Proof"}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );

}

export default ClaimVerifier;




