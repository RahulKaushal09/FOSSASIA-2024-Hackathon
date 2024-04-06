// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ClimateActionProjects {
    struct Project {
        uint256 id;
        address payable owner;
        string name;
        string description;
        uint256 fundingGoal;
        uint256 currentFunding;
        uint256 milestoneTarget;
        bool approved;
        bool milestoneReached;
        uint256 CO2ReductionTarget;
    }

    address public admin;
    Project[] public projects;
    uint256 public nextProjectId;
    AggregatorV3Interface internal CO2DataFeed;

    event ProjectSubmitted(uint256 projectId, address owner);
    event ProjectFunded(uint256 projectId, uint256 amount);
    event ProjectApproved(uint256 projectId);

    constructor(address _CO2DataFeedAddress) {
        admin = msg.sender;

        CO2DataFeed = AggregatorV3Interface(_CO2DataFeedAddress);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function submitProject(
        string memory name,
        string memory description,
        uint256 fundingGoal,
        uint256 CO2ReductionTarget,
        uint256 milestoneTarget
    ) public {
        projects.push(
            Project(
                nextProjectId,
                payable(msg.sender),
                name,
                description,
                fundingGoal,
                0,
                milestoneTarget,
                false,
                false,
                CO2ReductionTarget
            )
        );
        emit ProjectSubmitted(nextProjectId, msg.sender);
        nextProjectId++;
    }

    function approveProject(uint256 projectId) public onlyAdmin {
        // require(projectId < nextProjectId, "Invalid project ID");
        projects[projectId].approved = true;
        emit ProjectApproved(projectId);
    }

    function fundProject(uint256 projectId) public payable {
        // require(projectId < nextProjectId, "Invalid project ID");
        Project storage project = projects[projectId];
        require(project.approved, "Project not approved");
        project.currentFunding += msg.value;
        if (project.currentFunding >= project.milestoneTarget) {
            project.milestoneReached = true;
        }
        emit ProjectFunded(projectId, msg.value);
    }

    function getProjectsCount() public view returns (uint) {
        return projects.length;
    }

    function getCurrentCO2Level() public view returns (int) {
        (, int CO2Level, , , ) = CO2DataFeed.latestRoundData();
        return CO2Level;
    }

    // Add more functions as needed
}
