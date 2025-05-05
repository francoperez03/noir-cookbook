import { useState } from "react";
import './TicketInput.css'
import { hashEmailPedersen } from "../../utils/EmailHasher";
export default function TicketInput({ onHashGenerated }: { onHashGenerated: (hash: string, hash2: string) => void }) {
  const [email, setEmail] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = '0x' + (await hashEmailPedersen(email)).toString(16)
      setHash(result);
      onHashGenerated(email, result);
    } catch (err) {
      console.error("Failed to hash:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ticket-container">
      <h2>🎟️ Get Your Ticket</h2>
      <p>Enter your email to claim a ticket hash.</p>
      <div className="input-row">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Hash"}
        </button>
      </div>
      {hash && (
        <div className="hash-display">
          <strong>🔐 Your Ticket Hash:</strong>
          <code>{hash}</code>
        </div>
      )}
    </div>
  );
}
