import { useCallback, useState } from "react";
import TicketInput from "../../components/TicketInput/TicketInput";
import TreeViewer from "../../components/TreeViewer/TreeViewer";
import ClaimForm from "../../components/ClaimForm/ClaimForm";
import CircuitCompiler from "../../components/CircuitCompiler/CircuitCompiler";
import { CompiledCircuit } from "@noir-lang/noir_js";
import { motion } from "framer-motion";

// import { MerkleTreeData, ProofData } from "../../types"; // tipos auxiliares
import "./MerkleInclusionPage.css";
import { ProofData } from "@aztec/bb.js";
import ClaimVerifier from "../../components/ClaimVerifier/ClaimVerifier";
export type MerkleProof = {
  leaf: string;
  hashPath: string[];
  directions: boolean[];
  root: string;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.8,
      ease: "easeOut",
    },
  }),
};

const steps = [
  {
    title: "You Bought a Ticket",
    text: "But this isn't stored on a server. Not even on a database. Your identity remains off-chain.",
  },
  {
    title: "It's Part of the Merkle Tree",
    text: "Your email is transformed into a leaf and committed inside a public Merkle Tree. The tree is visible to everyone — but no one knows who owns each leaf.",
  },
  {
    title: "Prove Without Revealing",
    text: "You’ll generate a zero-knowledge proof that your leaf exists in the tree — without revealing your email. No accounts. No tracking. Just cryptographic truth.",
  },
];


export default function MerkleTicketPage() {
  const [email, setEmail] = useState("");
  const [leaf, setLeaf] = useState<string | null>(null);
  const [acir, setAcir] = useState<object | null>(null);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [treeData, setTreeData] = useState<MerkleProof | null>(null);
  const onLeafCreated = useCallback((tree: MerkleProof) => {
    setTreeData(tree);
  }, []);

  return (
    <div className="merkle-ticket-page">
<motion.div
  className="intro-sequence"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {steps.map((step, i) => (
    <motion.div
      key={i}
      className="intro-step"
      variants={itemVariants}
      custom={i}
    >
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </motion.div>
  ))}
</motion.div>

      <TicketInput
        onHashGenerated={(userEmail, generatedLeaf) => {
          setEmail(userEmail);
          setLeaf(generatedLeaf);
        }}
      />

      {email && (
        <TreeViewer
          currentLeaf={email}
          onLeafCreated={onLeafCreated}
        />
      )}

      {leaf && <CircuitCompiler
        mainUrl="/circuit/src/merkle.nr"
        nargoTomlUrl="/circuit/Nargo.toml"
        onCompile={(compiledAcir) => setAcir(compiledAcir)}
      />}

      {leaf && treeData && acir && (
        <ClaimForm
          acir={acir as { program: CompiledCircuit }}
          leaf={leaf}
          root={treeData.root}
          hashPath={treeData.hashPath}
          directions={treeData.directions}
          onProofGenerated={(proofData) => {setProof(proofData)}}
        />
      )}

      {proof && treeData && (
        <ClaimVerifier
          proof={proof}
          acir={acir as { program: CompiledCircuit }}
          onProofChange={() => {}}
        />
      )}
    </div>
  );
}
