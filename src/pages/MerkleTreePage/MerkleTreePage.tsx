import { useState } from "react";
import "./MerkleTreePage.css";
import { buildMerkleTree, toHexString } from "../../utils/MerkleTreeUtils";

function MerkleTreePage() {
  const [nodes, setNodes] = useState<string[]>([]);
  const [newNode, setNewNode] = useState<string>("");
  const [merkleTree, setMerkleTree] = useState<{ root: Uint8Array; levels: Uint8Array[][] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddNode() {
    if (newNode.trim() === "") return;

    setIsLoading(true);
    try {
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      const tree = await buildMerkleTree(updatedNodes);
      setMerkleTree(tree);
    } catch (error) {
      console.error("Error building Merkle Tree:", error);
    } finally {
      setIsLoading(false);
      setNewNode("");
    }
  }

  return (
    <div className="merkle-tree-page">
      <h1 className="merkle-title">Creador de Merkle Tree</h1>

      <div className="add-node-container">
        <input
          type="text"
          value={newNode}
          onChange={(e) => setNewNode(e.target.value)}
          placeholder="Ingrese el valor de la hoja"
          className="add-node-input"
          disabled={isLoading}
        />
        <button onClick={handleAddNode} className="add-node-button" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir hoja"}
        </button>
      </div>

      <div className="nodes-list">
        <h3>Valor de las hojas:</h3>
        {nodes.length > 0 ? (
          <ul>
            {nodes.map((node, index) => (
              <li key={index}>{node}</li>
            ))}
          </ul>
        ) : (
          <p>Ingresá un valor</p>
        )}
      </div>

      <div className="tree-root">
        <h3>Raíz del árbol:</h3>
        <p>{merkleTree ? toHexString(merkleTree.root) : "De momento el arbol está vacio"}</p>
      </div>

      {merkleTree && (
        <div className="tree-visualization">
          <h3>Arbol generado:</h3>
          <div className="tree-levels">
            {merkleTree.levels.map((level, levelIndex) => (
              <div key={levelIndex} className="tree-level">
                <h4>Nivel {levelIndex}</h4>
                <div className="level-nodes">
                  {level.map((hash, hashIndex) => (
                    <div key={hashIndex} className="node">
                      {toHexString(hash)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MerkleTreePage;
