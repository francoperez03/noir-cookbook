import { useCallback, useState } from "react";
import TicketInput from "../../components/TicketInput/TicketInput";
import TreeViewer from "../../components/TreeViewer/TreeViewer";
import ClaimForm from "../../components/ClaimForm/ClaimForm";
import CircuitCompiler from "../../components/CircuitCompiler/CircuitCompiler";
import { CompiledCircuit } from "@noir-lang/noir_js";
// import TreeViewer from "../../components/TreeViewer/TreeViewer";
// import ClaimForm from "../../components/ClaimForm/ClaimForm";
// import ClaimVerifier from "../../components/ClaimVerifier/ClaimVerifier";
// import { MerkleTreeData, ProofData } from "../../types"; // tipos auxiliares

export type MerkleProof = {
  leaf: string;
  hashPath: string[];
  directions: boolean[];
  root: string;
};


export default function MerkleTicketPage() {
  const [email, setEmail] = useState("");
  const [leaf, setLeaf] = useState<string | null>(null);
  const [acir, setAcir] = useState<object | null>(null);

  const [treeData, setTreeData] = useState<MerkleProof | null>(null);
  const onLeafCreated = useCallback((tree: MerkleProof) => {
    setTreeData(tree);
  }, []);

  return (
    <div className="merkle-ticket-page">
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

      {/* Paso 3: Generar prueba de inclusión (se habilita si hay árbol y leaf) */}
      {leaf && treeData && acir &&(
        <ClaimForm
          acir={acir as { program: CompiledCircuit }}
          leaf={leaf}
          root={treeData.root}
          hashPath={treeData.hashPath}
          directions={treeData.directions}
          onProofReady={(newProof) => setTreeData(newProof)}
          // proof={treeData}
        />
      )}

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
