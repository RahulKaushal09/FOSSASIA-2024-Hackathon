// Make sure to import ethers.js in your HTML or here if you're using a module bundler
// const { ethers } = require('ethers');
const contractAddress = "0x9561eFB425671AF8A7b244aD58EED0314756D3AD";
// Replace 'contractABI' with the actual ABI from your contract's JSON file
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_CO2DataFeedAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            }
        ],
        "name": "ProjectApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ProjectFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ProjectSubmitted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "nextProjectId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "projects",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "fundingGoal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentFunding",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "milestoneTarget",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "milestoneReached",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "CO2ReductionTarget",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "fundingGoal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "CO2ReductionTarget",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "milestoneTarget",
                "type": "uint256"
            }
        ],
        "name": "submitProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            }
        ],
        "name": "approveProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "projectId",
                "type": "uint256"
            }
        ],
        "name": "fundProject",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [],
        "name": "getProjectsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCurrentCO2Level",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]
let provider, signer, contract;
var value;

async function connectContract() {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    // await loadProjects();
}

async function submitProject() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const fundingGoal = document.getElementById("fundingGoal").value;
    const CO2ReductionTarget = document.getElementById("CO2ReductionTarget").value;
    const milestoneTarget = document.getElementById("milestoneTarget").value;

    try {
        const txResponse = await contract.submitProject(name, description, fundingGoal, CO2ReductionTarget, milestoneTarget);
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        // await contract.submitProject(name, description, fundingGoal, impact, milestoneTarget);
        // await loadProjects();
    } catch (error) {
        console.error(error);
    }
}
async function getCurrentCO2Level() {
    try {
        const level = await contract.getCurrentCO2Level();
        document.getElementById("co2Level").innerText = `Current CO2 Level: ${level}`;
    } catch (error) {
        console.error(error);
        console.error("Failed to get CO2 level:", error);
        alert(`Error: ${error.message}`); // Displaying the error message as an alert
    }
}


async function approveProject() {
    const id = value;

    try {
        const txResponse = await contract.approveProject(id);
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        await loadContentApproval();
        alert('Project approved successfully');
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.data.message}`);
    }
}

async function fundProject() {
    const id = value;
    const amount = document.getElementById('amount').value;

    try {
        const txResponse = await contract.fundProject(id, { value: amount });
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        // console.log(contract.projects(id).owner);
        await loadContentFund();
        project = await contract.projects(id);
        await showProjectDetails(project, "fund")

    } catch (error) {
        console.error(error);
    }
}
// async function loadProjects() {
//     const projectsContainer = document.querySelector('.projects');
//     // const detailsContainer = document.querySelector('.details-content');
//     projectsContainer.innerHTML = ""; // Clear current projects
//     const count = await contract.getProjectsCount();

//     for (let i = 0; i < count; i++) {

//         const project = await contract.projects(i);
//         const projectElement = createProjectCard(project);
//         projectsContainer.appendChild(projectElement);

//     }
// }
async function loadContentApproval() {
    const projectsContainer = document.querySelector('.projects-approval');
    // const detailsContainer = document.querySelector('.details-content');
    projectsContainer.innerHTML = ""; // Clear current projects
    const count = await contract.getProjectsCount();

    for (let i = 0; i < count; i++) {

        const project = await contract.projects(i);
        if (project.approved == false) {
            const projectElement = createProjectCard(project, "approval");
            projectsContainer.appendChild(projectElement);
        }

    }
}
async function loadContentFund() {
    const projectsContainer = document.querySelector('.projects-fund');
    // const detailsContainer = document.querySelector('.details-content');
    projectsContainer.innerHTML = ""; // Clear current projects
    const count = await contract.getProjectsCount();

    for (let i = 0; i < count; i++) {

        const project = await contract.projects(i);
        if (project.approved == true) {
            console.log(project);
            const projectElement = createProjectCard(project, "fund");
            projectsContainer.appendChild(projectElement);
        }

    }
}
function showProjectDetails(project, adminFor) {
    if (adminFor == "approval") {
        var detailsContainer = document.querySelector('.details-content-approval');
        detailsContainer.innerHTML = `
        <div class="project-info">
            <div class="form-group">
                <label>Project Name</label>
                <div class="form-control" id="projectNameDisplay">${project.name}</div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <div class="form-control" id="projectDescriptionDisplay">${project.description}</div>
            </div>
            <div class="form-group">
                <label>Funding Goal</label>
                <div class="form-control" id="fundingGoalDisplay">${project.fundingGoal} ETH</div>
            </div>
            <div class="form-group">
                <label>Funded Currently</label>
                <div class="form-control" id="fundingGoalDisplay">${project.currentFunding} ETH</div>
            </div>
            <div class="form-group">
                <label>CO2 Reduction Target</label>
                <div class="form-control" id="CO2ReductionTargetDisplay">${project.CO2ReductionTarget} </div>
            </div>
            <div class="form-group">
                <label>Milestone Target</label>
                <div class="form-control" id="milestoneTargetDisplay">${project.milestoneTarget} ETH</div>
            </div>
        </div>
    `;

    }
    else {
        var detailsContainer = document.querySelector('.details-content-fund');
        detailsContainer.innerHTML = `
        <div class="project-info">
            <div class="form-group">
                <label>Project Name</label>
                <div class="form-control" id="projectNameDisplay">${project.name}</div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <div class="form-control" id="projectDescriptionDisplay">${project.description}</div>
            </div>
            <div class="form-group">
                <label>Funding Goal</label>
                <div class="form-control" id="fundingGoalDisplay">${project.fundingGoal} ETH</div>
            </div>
            <div class="form-group">
                <label>Funded Currently</label>
                <div class="form-control" id="fundingGoalDisplay">${project.currentFunding} ETH</div>
            </div>
            <div class="form-group">
                <label>CO2 Reduction Target</label>
                <div class="form-control" id="CO2ReductionTargetDisplay">${project.CO2ReductionTarget}</div>
            </div>
            <div class="form-group">
                <label>Milestone Target</label>
                <div class="form-control" id="milestoneTargetDisplay">${project.milestoneTarget} ETH</div>
            </div>
            <div class="form-group">
                <label>Funding Amount:</label>
                <input class="form-control" type="number" id="amount" placeholder="Amount (ETH)">
            </div>
        </div>
    `;
    }
    selectProjectForApprovalOrFund(project.id);


}
function selectProjectForApprovalOrFund(projectId) {
    value = projectId; // Set the selected project ID in the approval input field
    // console.log(value);
}


function createProjectCard(project, adminFor) {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.setAttribute('data-id', project.id);
    card.innerHTML = `
        <h3>Name : <strong>${project.name}</strong> (${project.approved ? "approved" : "Pending Approval"})</h3>
        <p>Description: ${project.description}</p>
        <p>Funding Goal: ${project.fundingGoal} ETH</p>
        
    `;
    card.addEventListener('click', () => showProjectDetails(project, adminFor));
    return card;
}

// Initial loading of projects

// loadProjects();
// Initialize the connection to the contract when the page loads

window.addEventListener('DOMContentLoaded', async () => {
    await connectContract();
    // await getCurrentCO2Level();

});
