# 🗳️ Voting System — Blockchain Mini Project

A decentralized voting application built on Ethereum using Solidity smart contracts, Truffle, Ganache, and Web3.js.

> **EMSI — Blockchain Course | 2025-2026**
> Team: Farhi Naima, Anejjar Rachida, Redouani Mohamed Reda
> Supervisor: M. Khalid EL KHADIRI

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Running Tests](#running-tests)

---

## Overview

This project is a decentralized voting DApp (Decentralized Application) where:

- An **admin** (account 0) can add candidates, open/close voting sessions, and view live results.
- **Voters** (any other account) can cast a single vote during an open session.
- All rules are enforced by a Solidity smart contract — no double voting, no voting outside open sessions, no unauthorized admin actions.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Solidity ^0.8.0 | Smart contract language |
| Truffle v5.11.5 | Compile, deploy, and test smart contracts |
| Ganache v7.9.2 | Local Ethereum blockchain simulator |
| Web3.js v1.10.0 | JavaScript library to interact with Ethereum |
| Node.js v18 | JavaScript runtime |
| Docker | Containerized dev environment |
| VS Code Dev Containers | Portable development setup |

---

## Prerequisites

You only need **two things** installed on your machine:

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — make sure it is running
2. **[Visual Studio Code](https://code.visualstudio.com/)** with the **[Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)** (by Microsoft)

That's it. Node.js, Truffle, and Ganache are all installed automatically inside the container.

---

## Setup & Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/NaimaFarhi/Voting-System.git
cd Voting-System
```

### Step 2 — Open in VS Code

```bash
code .
```

### Step 3 — Reopen in Container

When VS Code opens, you will see a popup in the bottom-right corner:

> *"Folder contains a Dev Container configuration file. Reopen folder to develop in a container."*

Click **"Reopen in Container"**.

If you don't see the popup, press `Ctrl+Shift+P` and search for:
```
Dev Containers: Reopen in Container
```

> ⏳ The first time this runs, Docker will download the Node.js image and install Truffle and Ganache. This takes 2–5 minutes. Subsequent launches are instant.

### Step 4 — Verify the installation

Once the container is ready, open a terminal inside VS Code (`Ctrl+ù` `) and run:

```bash
node -v && truffle version && ganache --version
```

You should see something like:

```
v18.20.8
Truffle v5.11.5 (core: 5.11.5)
Ganache v7.9.2
Solidity v0.5.16 (solc-js)
Node v18.20.8
Web3.js v1.10.0
ganache v7.9.2
```

✅ You are ready.

---

## Running the Project

You will need **3 terminal tabs** open simultaneously. Open them inside VS Code with `Ctrl+Shift+ù `.

### Terminal 1 — Start Ganache

```bash
ganache --port 8545 --mnemonic "mesh just quarter drum obvious often safe hand genuine pizza clay vivid"
```

> ⚠️ Always use this exact mnemonic. It ensures the same wallet addresses are generated every time, so the admin address never changes.

Leave this terminal running. You should see a list of 10 accounts with 1000 ETH each.

---

### Terminal 2 — Deploy the smart contract

```bash
cd voting-system
truffle migrate --network development --reset
npm run copy-abi
```

**What this does:**
- `truffle migrate` — compiles `Voting.sol` and deploys it to Ganache
- `npm run copy-abi` — copies the contract address and ABI to `client/contracts/Voting.json` so the frontend can read it automatically

You should see output like:
```
Deploying 'Voting'
> contract address: 0x...
> gas used: 1023575
```

---

### Terminal 3 — Start the frontend

```bash
cd voting-system
npx serve client
```

Open your browser and go to:

```
http://localhost:3000
```

---

## How It Works

### Login

On the homepage, select a Ganache account from the dropdown:

- **Account 0** → redirected to the **Admin Panel**
- **Any other account** → redirected to the **Voter Page**

### Admin Panel

- Add candidates by typing a name and clicking "Add Candidate"
- Click **"Open Voting"** to allow voters to vote
- Watch results update in real time
- Click **"Close Voting"** to end the session
- Click **"Logout"** to return to the homepage

### Voter Page

- Select a candidate and click **"Submit Vote"**
- Once voted, the form disappears and a confirmation is shown
- If the session is closed, a waiting message is displayed
- Each account can only vote **once** — enforced by the smart contract

---

## Project Structure

```
Voting-System/
├── .devcontainer/
│   └── devcontainer.json        # Docker dev environment config
├── voting-system/
│   ├── contracts/
│   │   └── Voting.sol           # Solidity smart contract
│   ├── migrations/
│   │   └── 2_deploy_voting.js   # Truffle deployment script
│   ├── test/
│   │   └── voting.test.js       # Automated tests (19 tests)
│   ├── scripts/
│   │   └── interact.js          # CLI interaction script
│   ├── client/
│   │   ├── index.html           # Landing page / account selection
│   │   ├── admin.html           # Admin panel
│   │   ├── voter.html           # Voter page
│   │   └── contracts/
│   │       └── Voting.json      # Generated ABI + contract address
│   ├── truffle-config.js        # Truffle configuration
│   └── package.json             # Dependencies + npm scripts
└── README.md
```

---

## Running Tests

Make sure Ganache is running (Terminal 1), then in a new terminal:

```bash
cd voting-system
truffle test --network development
```

Expected output:

```
Contract: Voting
  Deployment
    ✔ should set the deployer as admin
    ✔ should initialize voting as closed
    ✔ should initialize with zero candidates
  addCandidate
    ✔ should allow admin to add a candidate
    ✔ should store the candidate name correctly
    ✔ should initialize candidate vote count to zero
    ✔ should reject empty candidate name
    ✔ should reject non-admin from adding a candidate
  openVoting / closeVoting
    ✔ should allow admin to open voting
    ✔ should allow admin to close voting
    ✔ should reject non-admin from opening voting
    ✔ should reject opening voting when already open
    ✔ should reject closing voting when already closed
  vote
    ✔ should allow a voter to cast a vote
    ✔ should mark voter as having voted
    ✔ should reject double voting
    ✔ should reject voting when voting is closed
    ✔ should reject invalid candidate index
    ✔ should correctly tally votes for multiple voters

19 passing (2s)
```

---

## ⚠️ Important Notes

- **Always use the fixed mnemonic** when starting Ganache. If you start Ganache without it, new random accounts are generated and the admin address will change.
- **Run `npm run copy-abi` after every redeployment.** If you reset and redeploy the contract, the frontend needs the updated contract address.
- **Do not commit `node_modules/` or `build/`** — they are in `.gitignore`. Run `npm install` after cloning if needed.
- The admin is always **Account 0** — the first account in the Ganache list.