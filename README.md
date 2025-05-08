# 🛠️ Noir Cookbook: Learn-by-Building ZK Circuits

This is a hands-on guide for developers exploring **zero-knowledge proofs** with [Noir](https://noir-lang.org). Instead of abstract math or formal theory, we focus on **real use cases**, modern tooling, and showing how cryptography can be approachable and powerful.

---

## 🔍 What Is This?

This project is part of a curated collection of privacy-based interactions — such as **proving you own a ticket without revealing your identity**, **executing private payments**, and more. Each demo is designed to teach a core pattern in zk through interaction and code.

Our first module simulates a private transaction validation circuit:

- You provide a balance, a payment amount, a spending limit, and a fee rate.
- The circuit calculates the fee and validates:
  - That you have enough balance.
  - That you stay under your spending limit.

---

## ✨ Goals

- Help developers understand how **ZK circuits** work.
- Show how to **interact with circuits** using TypeScript.
- Provide **real examples** where privacy adds product value.
- Make privacy **feel like regular programming**.

---

## ⚙️ Requirements

Make sure you have [`noirup`](https://github.com/noir-lang/noirup) installed to manage Noir versions:

```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
```

Then install Noir:

```bash
noirup --nightly
```

---

## 🧪 Run a Circuit Locally

Create and compile a Noir project:

```bash
nargo new circuit
cd circuit
nargo compile
```

You’ll get a `target/` directory with the compiled circuit (ACIR).

---

## 🖥️ Integrating Noir with a Web App

Install the necessary packages:

```bash
npm install \
  @noir-lang/noir_wasm@1.0.0-beta.0 \
  @noir-lang/noir_js@1.0.0-beta.0 \
  @aztec/bb.js@0.63.1
```

Run the frontend:

```bash
npm run dev
```

Then open your browser and check the dev console after clicking "Generate Proof" — you should see the witness and, optionally, the proof.

---

## 🧠 How It Works (Under the Hood)

- A **ZK circuit** is compiled from `main.nr` using `nargo`.
- The frontend uses `noir_js` and `bb.js` to:
  - Load the ACIR circuit.
  - Execute it with custom inputs.
  - Generate a witness.
  - Generate a proof.
  - (Optionally) Verify the proof using the verifier module.

---

## 💡 Developer Tips

- Treat your Noir circuit like a backend service: clean, isolated, and testable.
- Always test and compile with `nargo` before integrating into your app.
- Use `console.log` on the frontend to inspect witness or proof data for debugging.
- You can extend this app by adding circuits for other use cases (e.g., membership checks, hidden balances, anonymous voting, etc.).

---

## 🧭 What’s Next?

We’re building a growing library of zk examples — from basic primitives to full private applications.

Next use cases may include:

- ✅ Private ticketing
- 💸 Private payments with attached notes
- 🎯 Anonymous eligibility checks
- 🧾 Merkle inclusion proofs

---

## 🧵 Version Info

- Noir version: `1.0.0-beta.0`
- Tooling: TypeScript, Vite, React
- Compatible with `noir_js`, `noir_wasm`, and `bb.js`

---

## 👋 Contributing

Have ideas for other zk use cases to showcase? Want to improve the visuals or tooling?  
We’d love to hear from you. Open an issue or fork this repo.

---

> This cookbook is part of a platform for onboarding developers into the world of private-by-default applications.  
> Privacy isn’t magic. It’s just smart software — and you can build it.