import { toHexString } from "../../utils/MerkleTreeUtils";
import { useTranslation } from "react-i18next";
import "./NodeCard.css";
import { memo } from "react";

type NodeCardProps = {
  node: string;
  index: number;
  hashPath: Uint8Array[];
  pathToRoot: Uint8Array[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};
const NodeCard = memo(
function NodeCard({
  node,
  index,
  hashPath,
  onMouseEnter,
  onMouseLeave,
}: NodeCardProps) {
  const { t } = useTranslation("merkle");

  return (
    <div
      className="node-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h4>
        {t("node")}: {node}
      </h4>
      <p>
        <strong>{t("hash")}:</strong> {toHexString(hashPath[0] || new Uint8Array())}
      </p>
      <p>
        <strong>{t("index")}:</strong> {index}
      </p>
      <div>
        <strong>{t("hashPath")}:</strong>
        {hashPath.map((hash, pathIndex) => (
          <div key={pathIndex}>{toHexString(hash)}</div>
        ))}
      </div>
    </div>
  );
}

)
export default NodeCard;
