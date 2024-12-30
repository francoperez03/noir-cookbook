import { useState } from "react";
import "./MerkleTreePage.css";
import {
  buildMerkleTree,
  getHashPath,
  getPathToRoot,
} from "../../utils/MerkleTreeUtils";
import { useTranslation } from "react-i18next";
import MerkleTree from "../../components/MerkleTree/MerkleTree";
import NodeCard from "../../components/NodeCard/NodeCard";

function MerkleTreePage() {
  const { t } = useTranslation("merkle");
  const [nodes, setNodes] = useState<string[]>([]);
  const [newNode, setNewNode] = useState<string>("");
  const [merkleTree, setMerkleTree] = useState<{
    root: Uint8Array;
    levels: Uint8Array[][];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedHashes, setHighlightedHashes] = useState<Uint8Array[]>([]);
  const [pathToRootHashes, setPathToRootHashes] = useState<Uint8Array[]>([]);

  async function handleAddNode() {
    if (newNode.trim() === "") return;

    setIsLoading(true);
    try {
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      const tree = await buildMerkleTree(updatedNodes);
      setMerkleTree(tree);
    } catch (error) {
      console.error(t("errorBuildingTree"), error);
    } finally {
      setIsLoading(false);
      setNewNode("");
    }
  }
  return (
    <div className="merkle-container">
      <h1 className="merkle-title">{t("title")}</h1>

      {/* Explicación general */}
      <p className="merkle-description">{t("introduction")}</p>

      {/* Uso específico */}
      <div className="merkle-use-case">
        <h2 className="section-title">{t("useCaseTitle")}</h2>
        <p className="use-case-description">{t("useCaseDescription")}</p>
      </div>

      <h2 className="section-title">{t("stepOneTitle")}</h2>
      <p className="step-description">{t("stepOneDescription")}</p>

      <div className="merkle-wrapper">
        <div className="merkle-left">
          <div className="add-node-container">
            <input
              type="text"
              value={newNode}
              onChange={(e) => setNewNode(e.target.value)}
              placeholder={t("enterNodeValue")}
              className="add-node-input"
              disabled={isLoading}
            />
            <button
              onClick={handleAddNode}
              className="add-node-button"
              disabled={isLoading}
            >
              {isLoading ? t("addingNode") : t("addNode")}
            </button>
          </div>
          <div className="nodes-list">
            <h3>{t("nodeValues")}</h3>
            {nodes.length > 0 ? (
              <div className="nodes-grid">
                {nodes.map((node, index) => {
                  const hashPath = getHashPath(index, merkleTree?.levels || []);
                  const pathToRoot = getPathToRoot(
                    index,
                    merkleTree?.levels || []
                  );

                  return (
                    <NodeCard
                      key={index}
                      node={node}
                      index={index}
                      hashPath={hashPath}
                      pathToRoot={pathToRoot}
                      onMouseEnter={() => {
                        setHighlightedHashes(hashPath);
                        setPathToRootHashes(pathToRoot);
                      }}
                      onMouseLeave={() => {
                        setHighlightedHashes([]);
                        setPathToRootHashes([]);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <p>{t("noNodesYet")}</p>
            )}
          </div>

        </div>

        <div className="merkle-right">
          <MerkleTree
            merkleTree={merkleTree}
            highlightedHashes={highlightedHashes}
            pathToRoot={pathToRootHashes}
          />
        </div>
      </div>
      {/* <h2 className="section-title">{t("stepTwoTitle")}</h2>
      <p className="step-description">{t("stepTwoDescription")}</p>
      <VerifyMerkleTree/> */}
    </div>
  );
}

export default MerkleTreePage;
