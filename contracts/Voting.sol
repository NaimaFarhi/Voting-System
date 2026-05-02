// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Voting System
/// @author You
/// @notice A simple voting contract where an admin manages candidates and voting periods
contract Voting {

    // ─── Data Structures ───────────────────────────────────────────────

    /// @notice Represents a candidate in the election
    struct Candidate {
        string name;       // Candidate's display name
        uint voteCount;    // Total votes received
    }

    // ─── State Variables ────────────────────────────────────────────────

    /// @notice Address of the contract deployer (admin)
    address public admin;

    /// @notice Whether voting is currently open
    bool public votingOpen;

    /// @notice Dynamic list of all candidates
    Candidate[] public candidates;

    /// @notice Tracks which addresses have already voted
    mapping(address => bool) public hasVoted;

    // ─── Constructor ────────────────────────────────────────────────────

    /// @notice Sets the deployer as admin and initializes voting as closed
    constructor() {
        admin = msg.sender;
        votingOpen = false;
    }

    // ─── Modifiers ──────────────────────────────────────────────────────

    /// @notice Restricts function access to admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    /// @notice Restricts function access to when voting is open
    modifier whenOpen() {
        require(votingOpen, "Voting is currently closed");
        _;
    }

    // ─── Admin Functions ────────────────────────────────────────────────

    /// @notice Adds a new candidate (only before or between voting sessions)
    /// @param name The candidate's name
    function addCandidate(string memory name) public onlyAdmin {
        // Prevent adding empty names
        require(bytes(name).length > 0, "Candidate name cannot be empty");
        candidates.push(Candidate(name, 0));
    }

    /// @notice Opens the voting session
    function openVoting() public onlyAdmin {
        require(!votingOpen, "Voting is already open");
        votingOpen = true;
    }

    /// @notice Closes the voting session
    function closeVoting() public onlyAdmin {
        require(votingOpen, "Voting is already closed");
        votingOpen = false;
    }

    // ─── Voter Functions ────────────────────────────────────────────────

    /// @notice Casts a vote for a candidate by index
    /// @param candidateIndex Index of the candidate in the candidates array
    function vote(uint candidateIndex) public whenOpen {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate index");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
    }

    // ─── View Functions (free to call, no gas) ──────────────────────────

    /// @notice Returns a candidate's name and vote count by index
    /// @param index Candidate index
    /// @return name The candidate's name
    /// @return voteCount Total votes for that candidate
    function getCandidate(uint index) public view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Invalid candidate index");
        Candidate storage candidate = candidates[index];
        return (candidate.name, candidate.voteCount);
    }

    /// @notice Returns the total number of candidates
    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }
}