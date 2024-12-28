import { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { toHexString } from "../../utils/MerkleTreeUtils";
import { useTranslation } from "react-i18next";
import "./MerkleTree.css";

type MerkleTreeProps = {
  merkleTree: { root: Uint8Array; levels: Uint8Array[][] } | null;
  highlightedHashes: Uint8Array[];
  pathToRoot: Uint8Array[];
};

function MerkleTree({ merkleTree, highlightedHashes, pathToRoot }: MerkleTreeProps) {
  const { t } = useTranslation("merkle");
  const [copiedNode, setCopiedNode] = useState<string | null>(null);

  const isHighlighted = (hash: Uint8Array) =>
    highlightedHashes.some((highlighted) => toHexString(highlighted) === toHexString(hash));

  const isPathToRoot = (hash: Uint8Array) =>{
    const result = pathToRoot.some((pathHash) => {
      const result2 = toHexString(pathHash) === toHexString(hash)
      return result2
    });
    return result
  }
  

  const handleCopyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedNode(hash);
      setTimeout(() => setCopiedNode(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  const shortenHash = (hash: string) => `${hash.slice(0, 5)}...${hash.slice(-4)}`;

  if (!merkleTree) {
    return <p>{t("emptyTree")}</p>;
  }

  return (
    <div className="tree-visualization">
      <div className="tree-root">
        <h3>{t("treeRoot")}</h3>
        <p>{merkleTree ? toHexString(merkleTree.root) : t("emptyTree")}</p>
      </div>
  
      {/* Levels of the Merkle Tree from top (root) to bottom (leaves) */}
      <div className="tree-levels">
        {merkleTree.levels
          .slice()
          .reverse()
          .map((level, levelIndex) => (
            <div key={levelIndex} className="tree-level">
              <div className="level-nodes">
                {level.map((hash, hashIndex) => {
                  const fullHash = toHexString(hash);
                  return (
                    <div
                      key={hashIndex}
                      className={`node ${
                        isHighlighted(hash) ? "highlighted" : isPathToRoot(hash) ? "path-to-root" : ""
                      }`}
                    >
                      <div className="tooltip-container">
                        <span className="tooltip">{fullHash}</span>
                        {shortenHash(fullHash)}
                        {copiedNode === fullHash ? (
                          <Check className="clipboard-icon copied" size={16} />
                        ) : (
                          <Clipboard
                            className="clipboard-icon"
                            size={16}
                            onClick={() => handleCopyToClipboard(fullHash)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
  
  
}

export default MerkleTree;
