/**
 * voting.test.js
 * Tests for the Voting smart contract.
 * Run with: truffle test --network development
 */

const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  // Use specific accounts for clarity
  const admin  = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];

  // Fresh contract instance before each test
  let voting;
  beforeEach(async () => {
    voting = await Voting.new({ from: admin });
  });

  // ─── Deployment ───────────────────────────────────────────────────
  describe("Deployment", () => {
    it("should set the deployer as admin", async () => {
      const contractAdmin = await voting.admin();
      assert.equal(contractAdmin, admin, "Admin should be the deployer");
    });

    it("should initialize voting as closed", async () => {
      const isOpen = await voting.votingOpen();
      assert.equal(isOpen, false, "Voting should be closed on deploy");
    });

    it("should initialize with zero candidates", async () => {
      const count = await voting.getCandidateCount();
      assert.equal(count, 0, "Should have no candidates on deploy");
    });
  });

  // ─── Add Candidate ────────────────────────────────────────────────
  describe("addCandidate", () => {
    it("should allow admin to add a candidate", async () => {
      await voting.addCandidate("Alice", { from: admin });
      const count = await voting.getCandidateCount();
      assert.equal(count, 1, "Should have 1 candidate");
    });

    it("should store the candidate name correctly", async () => {
      await voting.addCandidate("Alice", { from: admin });
      const candidate = await voting.getCandidate(0);
      assert.equal(candidate.name, "Alice", "Candidate name should be Alice");
    });

    it("should initialize candidate vote count to zero", async () => {
      await voting.addCandidate("Alice", { from: admin });
      const candidate = await voting.getCandidate(0);
      assert.equal(candidate.voteCount, 0, "Vote count should start at 0");
    });

    it("should reject empty candidate name", async () => {
      try {
        await voting.addCandidate("", { from: admin });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert on empty name");
      }
    });

    it("should reject non-admin from adding a candidate", async () => {
      try {
        await voting.addCandidate("Alice", { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert for non-admin");
      }
    });
  });

  // ─── Open / Close Voting ──────────────────────────────────────────
  describe("openVoting / closeVoting", () => {
    it("should allow admin to open voting", async () => {
      await voting.openVoting({ from: admin });
      const isOpen = await voting.votingOpen();
      assert.equal(isOpen, true, "Voting should be open");
    });

    it("should allow admin to close voting", async () => {
      await voting.openVoting({ from: admin });
      await voting.closeVoting({ from: admin });
      const isOpen = await voting.votingOpen();
      assert.equal(isOpen, false, "Voting should be closed");
    });

    it("should reject non-admin from opening voting", async () => {
      try {
        await voting.openVoting({ from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert for non-admin");
      }
    });

    it("should reject opening voting when already open", async () => {
      await voting.openVoting({ from: admin });
      try {
        await voting.openVoting({ from: admin });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert if already open");
      }
    });

    it("should reject closing voting when already closed", async () => {
      try {
        await voting.closeVoting({ from: admin });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert if already closed");
      }
    });
  });

  // ─── Voting ───────────────────────────────────────────────────────
  describe("vote", () => {
    beforeEach(async () => {
      // Set up: add candidates and open voting before each vote test
      await voting.addCandidate("Alice", { from: admin });
      await voting.addCandidate("Bob",   { from: admin });
      await voting.openVoting({ from: admin });
    });

    it("should allow a voter to cast a vote", async () => {
      await voting.vote(0, { from: voter1 });
      const candidate = await voting.getCandidate(0);
      assert.equal(candidate.voteCount, 1, "Alice should have 1 vote");
    });

    it("should mark voter as having voted", async () => {
      await voting.vote(0, { from: voter1 });
      const hasVoted = await voting.hasVoted(voter1);
      assert.equal(hasVoted, true, "Voter1 should be marked as voted");
    });

    it("should reject double voting", async () => {
      await voting.vote(0, { from: voter1 });
      try {
        await voting.vote(0, { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert on double vote");
      }
    });

    it("should reject voting when voting is closed", async () => {
      await voting.closeVoting({ from: admin });
      try {
        await voting.vote(0, { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert when voting closed");
      }
    });

    it("should reject invalid candidate index", async () => {
      try {
        await voting.vote(99, { from: voter1 });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "Should revert for invalid index");
      }
    });

    it("should correctly tally votes for multiple voters", async () => {
      await voting.vote(0, { from: voter1 });
      await voting.vote(0, { from: voter2 });
      await voting.vote(1, { from: voter3 });

      const alice = await voting.getCandidate(0);
      const bob   = await voting.getCandidate(1);

      assert.equal(alice.voteCount, 2, "Alice should have 2 votes");
      assert.equal(bob.voteCount,   1, "Bob should have 1 vote");
    });
  });
});