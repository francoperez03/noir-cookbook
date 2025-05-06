import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { hashEmailPedersen } from "../../utils/EmailHasher";
import "./TicketInput.css";

type Props = {
  onHashGenerated: (email: string, hash: string) => void;
};

export default function TicketInput({ onHashGenerated }: Props) {
  const [email, setEmail] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hashRef = useRef<HTMLDivElement | null>(null);

  /* anima la tarjeta al montar */
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        y: 40,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  /* anima la aparición del hash */
  useEffect(() => {
    if (hash && hashRef.current) {
      gsap.fromTo(
        hashRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [hash]);

  async function handleGenerate() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = "0x" + (await hashEmailPedersen(email)).toString(16);
      setHash(result);
      onHashGenerated(email, result);
    } catch (err) {
      console.error("Failed to hash:", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="ticket-container" ref={containerRef}>
<h2 className="ticket-title">Find your place</h2>
<p className="ticket-sub">
Enter your email to search the tree and claim your ticket.
</p>
      <div className="input-row">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : "Generate Hash"}
        </button>
      </div>

      {hash && (
        <div
          className={`hash-display ${hash ? "show" : ""}`}
          ref={hashRef}
        >
          <strong>Your Ticket Hash:</strong>
          <code>{hash}</code>
        </div>
      )}

    </div>
  );
}
