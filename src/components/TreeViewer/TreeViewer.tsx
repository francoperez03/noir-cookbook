import { useState, useEffect } from "react";
import { Clipboard, Check } from "lucide-react";
import {
  toHexString,
  buildMerkleTree,
  getHashPath,
} from "../../utils/MerkleTreeUtils";
import "./TreeViewer.css";
import { MerkleProof } from "../../pages/MerkleInclusionPage/MerkleInclusionPage";

type MerkleTreeProps = {
  currentLeaf: string;
  onLeafCreated?: (proof: MerkleProof) => void;
};

function TreeViewer({ currentLeaf, onLeafCreated }: MerkleTreeProps) {
  const [merkleTree, setMerkleTree] = useState<{
    root: Uint8Array;
    levels: Uint8Array[][];
  } | null>(null);
  const [copiedNode, setCopiedNode] = useState<string | null>(null);
  const [hovered, setHovered] = useState<"leaf" | "path" | "root" | null>(null);

  useEffect(() => {
    async function computeTree() {
      const staticEmails = ["alpha@zk.com", "beta@zk.com", "gamma@zk.com"];
      const leaves = [...staticEmails, currentLeaf];
      const tree = await buildMerkleTree(leaves);
      setMerkleTree(tree);
  
      const levels = tree.levels;
      const leaf = "0x" + toHexString(levels[0][levels[0].length - 1]);
      const root = "0x" + toHexString(levels[levels.length - 1][0]);
      const hashPath = getHashPath(levels[0].length - 1, levels).map(
        (h) => "0x" + toHexString(h)
      );
      const directions = [true, true];
  
      onLeafCreated?.({ leaf, hashPath, directions, root });
    }
    computeTree();
  }, [currentLeaf, onLeafCreated]);
  

  const handleCopyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedNode(hash);
      setTimeout(() => setCopiedNode(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  const shortenHash = (hash: string) =>
    `${hash.slice(0, 7)}...${hash.slice(-4)}`;

  if (!merkleTree) return <p>Building Merkle tree...</p>;

  const levels = merkleTree.levels;
  const rootHash = "0x" + toHexString(levels[levels.length - 1][0]);
  const leafHash = "0x" + toHexString(levels[0][levels[0].length - 1]);
  const hashPath = getHashPath(levels[0].length - 1, levels).map(
    (h) => "0x" + toHexString(h)
  );

  return (
    <div className="tree-visualization">
      <div className="tree-root">
        <h3>🌲 Merkle Tree Root</h3>
      </div>

      <div className="tree-levels">
        {levels
          .slice()
          .reverse()
          .map((level, levelIndex) => (
            <div key={levelIndex} className="tree-level">
              <div className="level-nodes">
                {level.map((hash, hashIndex) => {
                  const fullHash = "0x" + toHexString(hash);
                  const isLeaf = fullHash === leafHash;
                  const isRoot =
                    levelIndex === 0 && hashIndex === level.length - 1;
                  const isPath = hashPath.includes(fullHash);

                  let classes = "node";
                  if (
                    (isLeaf && hovered === "leaf") ||
                    (isLeaf && hovered === null)
                  ) {
                    classes += " is-leaf has-label";
                  } else if (isRoot && hovered === "root") {
                    classes += " is-root";
                  } else if (isPath && hovered === "path") {
                    classes += " is-path";
                  }

                  return (
                    <div key={hashIndex} className={classes}>
                      <div className="hash-row">
                        <span>{shortenHash(fullHash)}</span>
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
                      {isLeaf && hovered === "leaf" && (
                        <div className="ticket-label">This is your ticket</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <div className="tree-explanation">
        <h3>🧠 How does this prove your ticket?</h3>
        <p>To verify that your leaf is part of the Merkle Tree, you need:</p>
        <ul>
          <li>
            <span
              onMouseEnter={() => setHovered("leaf")}
              onMouseLeave={() => setHovered(null)}
            >
              <strong>🌿 Leaf</strong>
            </span>
            : the hash of your email. It's the last node at the bottom.
          </li>
          <li>
            <span
              onMouseEnter={() => setHovered("path")}
              onMouseLeave={() => setHovered(null)}
            >
              <strong>🔁 Hash Path</strong>
            </span>
            : siblings at each level to recompute the root.
          </li>
          <li>
            <span
              onMouseEnter={() => setHovered("path")}
              onMouseLeave={() => setHovered(null)}
            >
              <strong>↔️ Path Directions</strong>
            </span>
            : e.g. <code>[true, true]</code>, left/right at each level.
          </li>
          <li>
            <span
              onMouseEnter={() => setHovered("root")}
              onMouseLeave={() => setHovered(null)}
            >
              <strong>🌳 Merkle Root</strong>
            </span>
            : the public root of the Merkle Tree.
          </li>
        </ul>

        <div className="example-proof">
          <strong>Example:</strong>
          <pre>{`{
  "leaf": "${leafHash}",
  "hashPath": [
    ${hashPath.map((h) => `"${h}"`).join(",\n    ")}
  ],
  "directions": [true, true],
  "root": "${rootHash}"
}`}</pre>
        </div>
      </div>
    </div>
  );
}

export default TreeViewer;
