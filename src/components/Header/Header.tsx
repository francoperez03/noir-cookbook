import "./Header.css";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

type HeaderProps = {
  activeTab: "proofs" | "merkleTree";
  onTabChange: (tab: "proofs" | "merkleTree") => void;
};

function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <div className="header-container">
      <div className="tabs-container">
        <button
          className={`header-tab ${activeTab === "proofs" ? "active" : ""}`}
          onClick={() => onTabChange("proofs")}
        >
          Proofs
        </button>
        <button
          className={`header-tab ${activeTab === "merkleTree" ? "active" : ""}`}
          onClick={() => onTabChange("merkleTree")}
        >
          Merkle Tree
        </button>
      </div>
      <LanguageSwitcher />
    </div>
  );
}

export default Header;
