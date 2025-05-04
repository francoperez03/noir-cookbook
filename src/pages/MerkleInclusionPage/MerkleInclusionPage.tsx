import { useState } from "react";
import TicketInput from "../../components/TicketInput/TicketInput";
// import TreeViewer from "../../components/TreeViewer/TreeViewer";
// import ClaimForm from "../../components/ClaimForm/ClaimForm";
// import ClaimVerifier from "../../components/ClaimVerifier/ClaimVerifier";
// import { MerkleTreeData, ProofData } from "../../types"; // tipos auxiliares

export default function MerkleTicketPage() {
  const [email, setEmail] = useState("");
  const [leaf, setLeaf] = useState<string | null>(null);
  // const [treeData, setTreeData] = useState<MerkleTreeData | null>(null);
  // const [proof, setProof] = useState<ProofData | null>(null);

  return (
    <div className="merkle-ticket-page">
      {/* Paso 1: Ingreso de email */}
      <TicketInput
        onHashGenerated={(userEmail, generatedLeaf) => {
          setEmail(userEmail);
          setLeaf(generatedLeaf);
        }}
      />

      {/* Paso 2: Mostrar Árbol (se habilita cuando hay un leaf generado) */}
      {/* {leaf && (
        <TreeViewer
          currentLeaf={leaf}
          onTreeGenerated={(tree) => setTreeData(tree)}
        />
      )} */}

      {/* Paso 3: Generar prueba de inclusión (se habilita si hay árbol y leaf) */}
      {/* {leaf && treeData && (
        <ClaimForm
          email={email}
          leaf={leaf}
          tree={treeData}
          onProofGenerated={(p) => setProof(p)}
        />
      )} */}

      {/* Paso 4: Verificar prueba (solo si ya se generó una prueba) */}
      {/* {proof && treeData && (
        <ClaimVerifier
          proof={proof}
          root={treeData.root}
          onReset={() => setProof(null)}
        />
      )} */}
    </div>
  );
}
