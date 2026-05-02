/**
 * interact.js
 * A script to interact with the deployed Voting contract.
 * Run with: truffle exec scripts/interact.js --network development
 */

// Truffle injects `artifacts` and `web3` globally — no imports needed

const Voting = artifacts.require("Voting");

module.exports = async function (callback) {
  try {
    // ─── Setup ────────────────────────────────────────────────────────

    // Get all available Ganache accounts
    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0];   // Deployer = admin
    const voter1 = accounts[1];  // First voter
    const voter2 = accounts[2];  // Second voter

    // Connect to the already-deployed contract instance
    const voting = await Voting.deployed();

    console.log("Contract address:", voting.address);
    console.log("Admin account:", admin);

    // ─── Add Candidates ───────────────────────────────────────────────

    console.log("\n--- Adding candidates ---");

    // Only admin can call this
    await voting.addCandidate("Alice", { from: admin });
    await voting.addCandidate("Bob", { from: admin });
    await voting.addCandidate("Charlie", { from: admin });

    const count = await voting.getCandidateCount();
    console.log("Total candidates:", count.toString());

    // ─── Open Voting ──────────────────────────────────────────────────

    console.log("\n--- Opening voting ---");
    await voting.openVoting({ from: admin });
    console.log("Voting is open:", await voting.votingOpen());

    // ─── Cast Votes ───────────────────────────────────────────────────

    console.log("\n--- Casting votes ---");

    // voter1 votes for candidate 0 (Alice)
    await voting.vote(0, { from: voter1 });
    console.log("voter1 voted for Alice");

    // voter2 votes for candidate 1 (Bob)
    await voting.vote(1, { from: voter2 });
    console.log("voter2 voted for Bob");

    // ─── Read Results ─────────────────────────────────────────────────

    console.log("\n--- Results ---");
    for (let i = 0; i < count; i++) {
      const candidate = await voting.getCandidate(i);
      console.log(`${candidate.name}: ${candidate.voteCount.toString()} votes`);
    }

    // ─── Close Voting ─────────────────────────────────────────────────

    console.log("\n--- Closing voting ---");
    await voting.closeVoting({ from: admin });
    console.log("Voting is open:", await voting.votingOpen());

  } catch (error) {
    console.error("Error:", error.message);
  }

  // Required by truffle exec — signals the script is done
  callback();
};