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
  const [autoHighlight, setAutoHighlight] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAutoHighlight(false), 8000); // 10 segundos
    return () => clearTimeout(timer);
  }, []);

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

  if (!merkleTree) return <p></p>;

  const levels = merkleTree.levels;
  const rootHash = "0x" + toHexString(levels[levels.length - 1][0]);
  const leafHash = "0x" + toHexString(levels[0][levels[0].length - 1]);
  const hashPath = getHashPath(levels[0].length - 1, levels).map(
    (h) => "0x" + toHexString(h)
  );

  return (
    <div className="tree-visualization">
      <div className="tree-description">
        We’ve mapped every ticket to a leaf — including yours.
        Below, you’ll see the full Merkle Tree.
        <br />
        Your hashed ticket is already part of it. Can you find it?
      </div>
      <div className="tree-explanation">
      <h3 className="explanation-title"> Can you find your ticket?</h3>

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
                    (isLeaf && (hovered === "leaf" || autoHighlight)) ||
                    (isRoot && (hovered === "root" || autoHighlight)) ||
                    (isPath && (hovered === "path" || autoHighlight))
                  ) {
                    if (isLeaf) classes += " is-leaf has-label";
                    else if (isRoot) classes += " is-root has-label";
                    else if (isPath) classes += " is-path has-label";
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
                      {(isLeaf && (hovered === "leaf" || autoHighlight)) && (
                        <div className="ticket-label">This is your ticket</div>
                      )}
                      {(isPath && (hovered === "path" || autoHighlight)) && (
                        <div className="ticket-label">This is a sibling</div>
                      )}
                      {(isRoot && (hovered === "root" || autoHighlight)) && (
                        <div className="ticket-label">This is the root</div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

        <p className="explanation-subtitle">
          We need 4 elements to prove you're the ticket holder — one public, and three private.
          Hover over each one to reveal its role
        </p>

        <div className="explanation-cards">
          <div
            className="explanation-card"
            onMouseEnter={() => setHovered("leaf")}
            onMouseLeave={() => setHovered(null)}
          >
            <h4>Leaf (private)</h4>
            <p>The hashed version of your email. It lives quietly at the very bottom of the tree.</p>
          </div>

          <div
            className="explanation-card"
            onMouseEnter={() => setHovered("path")}
            onMouseLeave={() => setHovered(null)}
          >
            <h4>Hash Path (private)</h4>
            <p>Your leaf’s neighbors. They're used to climb up the tree and prove your inclusion.</p>
          </div>

          <div
            className="explanation-card"
            onMouseEnter={() => setHovered("path")}
            onMouseLeave={() => setHovered(null)}
          >
            <h4>Directions (private)</h4>
            <p>Instructions for each step: do you go left or right? It’s encoded in <code>[true, false]</code>.</p>
          </div>

          <div
            className="explanation-card"
            onMouseEnter={() => setHovered("root")}
            onMouseLeave={() => setHovered(null)}
          >
            <h4>Merkle Root (public)</h4>
            <p>The top of the tree — the final result. It’s public, and it confirms all valid tickets.</p>
          </div>
        </div>

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
