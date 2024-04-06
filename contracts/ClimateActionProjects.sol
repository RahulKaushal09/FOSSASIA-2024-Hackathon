// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ClimateActionProjects {
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
        Project memory newProject = Project({
            id: nextProjectId,
            owner: payable(msg.sender),
            name: name,
            description: description,
            fundingGoal: fundingGoal,
            environmentalImpact: environmentalImpact,
            approved: false,
            currentFunding: 0,
            milestoneTarget: milestoneTarget,
            milestoneReached: false
        });
        projects.push(newProject);
        nextProjectId++;
    }

    function approveProject(uint256 projectId) public onlyAdmin {
        Project storage project = projects[projectId];
        // project.name = "approved";
        project.approved = true;
    }

    function contributeToFunding(uint256 projectId) public payable {
        Project storage project = projects[projectId];
        require(project.approved, "Project must be approved before funding");
        // Transfer the funds directly to the project owner's address
        project.owner.transfer(msg.value);
        project.currentFunding += msg.value;
        if (project.currentFunding >= project.milestoneTarget) {
            project.milestoneReached = true;
        }
    }

    function getProjectsCount() public view returns (uint) {
        return projects.length;
    }

    // AggregatorV3Interface internal priceFeed;

    // // Chainlink VRF variables
    // bytes32 internal keyHash;
    // uint256 internal fee;

    // // Constructor
    // constructor(
    //     address _priceFeed,
    //     address _vrfCoordinator,
    //     address _link,
    //     bytes32 _keyHash,
    //     uint256 _fee
    // ) VRFConsumerBase(_vrfCoordinator, _link) {
    //     priceFeed = AggregatorV3Interface(_priceFeed);
    //     keyHash = _keyHash;
    //     fee = _fee;
    // }

    // // Example function to request randomness
    // function getRandomNumber() public returns (bytes32 requestId) {
    //     require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
    //     return requestRandomness(keyHash, fee);
    // }

    // // Chainlink VRF callback function
    // function fulfillRandomness(
    //     bytes32 requestId,
    //     uint256 randomness
    // ) internal override {
    //     // Use 'randomness' for fair project highlighting
    // }

    // // Example function to get the latest price from Chainlink Data Feed
    // function getLatestPrice() public view returns (int) {
    //     (, int price, , , ) = priceFeed.latestRoundData();
    //     return price;
    // }
}
