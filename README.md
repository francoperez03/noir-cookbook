# 🛠️ Noir Cookbook: Learn-by-Building ZK Circuits

This is a hands-on guide for developers exploring **zero-knowledge proofs** with [Noir](https://noir-lang.org). Instead of abstract math or formal theory, we focus on **real use cases**, modern tooling, and showing how cryptography can be approachable and powerful.

---

## 🔍 What Is This?

This project is part of a curated collection of privacy-based interactions — such as **proving you own a ticket without revealing your identity**, **executing private payments**, and more. Each demo is designed to teach a core pattern in zk through interaction and code.

### 🧩 Module 1: Private Payment Validation

Our first module simulates a private transaction validation circuit.  
You provide:

- A balance  
- A payment amount  
- A spending limit  
- A fee rate  

The circuit calculates the transaction fee and ensures two things:

- ✅ That you have enough balance to cover the payment and fee.  
- ✅ That the total payment doesn’t exceed the allowed limit.

This demonstrates how you can apply privacy to financial constraints — without revealing exact balances or spending patterns.

---

### 🌳 Module 2: Merkle Tree Ticket Proof

The second module walks through the full process of proving that your ticket is part of a public Merkle Tree — without revealing your identity.

You enter your email, and the platform:

- Hashes it privately as a Merkle leaf  
- Builds the full tree with other users  
- Generates a Merkle inclusion proof  
- Lets you verify the proof against a known root

This shows how **cryptographic commitments** can power private access systems — like tickets, credentials, or memberships — without user accounts or passwords.


---

## ✨ Goals

- Help developers understand how **ZK circuits** work.
- Show how to **interact with circuits** using TypeScript.
- Provide **real examples** where privacy adds product value.
- Make privacy **feel like regular programming**.

---


## 🖥️ Integrating Noir with a Web App

Install the necessary packages:

```bash
npm install
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

## 🧭 What’s Next?

We’re building a growing library of zk examples — from basic primitives to full private applications.

Next use cases may include:

- ✅ Anonymous voting proccess
- 💸 Private payments with attached notes

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