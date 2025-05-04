import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import ProofsPage from "./pages/ProofsPage/ProofsPage";
import Footer from "./components/Footer/Footer";
import MerkleInclusionPage from "./pages/MerkleInclusionPage/MerkleInclusionPage";
function App() {
  const [activeTab, setActiveTab] = useState<"proofs" | "merkleTree">("proofs");

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      {activeTab === "proofs" && <ProofsPage />}
      {activeTab === "merkleTree" && <MerkleInclusionPage />}
      <Footer />
    </div>
  );
}

export default App;
