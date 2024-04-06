const ClimateActionProjects = artifacts.require("ClimateActionProjects");

module.exports = function (deployer) {
  const CO2DataFeedAddress = '0xCe3f7378aE409e1CE0dD6fFA70ab683326b73f04'; // Example address
  deployer.deploy(ClimateActionProjects, CO2DataFeedAddress);

  // deployer.deploy(ClimateActionProjects);
};
