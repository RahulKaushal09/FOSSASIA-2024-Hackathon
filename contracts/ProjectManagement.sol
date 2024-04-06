// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectManagement {
    struct Project {
        uint256 id;
        address payable owner;
        string name;
        string description;
        uint256 fundingGoal;
        string environmentalImpact;
        bool approved;
        uint256 currentFunding;
        uint256 milestoneTarget;
        bool milestoneReached;
    }

    address public admin;
    Project[] public projects;
    uint256 public nextProjectId;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function submitProject(
        string memory name,
        string memory description,
        uint256 fundingGoal,
        string memory environmentalImpact,
        uint256 milestoneTarget
    ) public {
        projects.push(
            Project(
                nextProjectId,
                payable(msg.sender),
                name,
                description,
                fundingGoal,
                environmentalImpact,
                false, // Initially, projects are not approved
                0, // Initial funding is 0
                milestoneTarget,
                false // Milestone not reached at the start
            )
        );
        nextProjectId++;
    }

    function approveProject(uint256 projectId) public onlyAdmin {
        Project storage project = projects[projectId];
        project.approved = true;
    }

    function contributeToFunding(uint256 projectId) public payable {
        Project storage project = projects[projectId];
        require(project.approved, "Project must be approved before funding");
        project.currentFunding += msg.value;
        if (project.currentFunding >= project.milestoneTarget) {
            project.milestoneReached = true;
        }
    }

    // Additional functionality can be added as needed, e.g., for managing milestones
}
