// Make sure to import ethers.js in your HTML or here if you're using a module bundler
// const { ethers } = require('ethers');
const contractAddress = "0x7d76aC06C856f8cB88EdFf01c7D39D0044118415";
// Replace 'contractABI' with the actual ABI from your contract's JSON file
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
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
                "internalType": "string",
                "name": "environmentalImpact",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
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
                "name": "milestoneReached",
                "type": "bool"
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
                "internalType": "string",
                "name": "environmentalImpact",
                "type": "string"
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
        "name": "contributeToFunding",
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
    }
]
let provider, signer, contract;

async function connectContract() {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    await loadProjects();
}

async function submitProject() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const fundingGoal = ethers.utils.parseEther(document.getElementById('fundingGoal').value);
    const impact = document.getElementById('impact').value;
    const milestoneTarget = ethers.utils.parseEther(document.getElementById('milestoneTarget').value);

    try {
        const txResponse = await contract.submitProject(name, description, fundingGoal, impact, milestoneTarget);
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        // await contract.submitProject(name, description, fundingGoal, impact, milestoneTarget);
        await loadProjects();
    } catch (error) {
        console.error(error);
    }
}

async function approveProject() {
    const id = document.getElementById('approveId').value;

    try {
        const txResponse = await contract.approveProject(id);
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        await loadProjects();
    } catch (error) {
        console.error(error);
    }
}

async function fundProject() {
    const id = document.getElementById('fundId').value;
    const amount = ethers.utils.parseEther(document.getElementById('amount').value);

    try {
        const txResponse = await contract.contributeToFunding(id, { value: amount });
        const txReceipt = await txResponse.wait(); // Wait for the transaction to be mined
        // console.log(contract.projects(id).owner);
        await loadProjects();

    } catch (error) {
        console.error(error);
    }
}
async function loadProjects() {
    const projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = ""; // Clear current projects
    const count = await contract.getProjectsCount();

    for (let i = 0; i < count; i++) {

        const project = await contract.projects(i);
        // var approval = "Pending Approval"
        // if (project.approved == true) {
        //     approval = "approval"
        // }
        const projectElement = document.createElement("div");
        console.log(project.approved);
        projectElement.innerHTML = `
    <h4>ID : <strong>${project.id}</strong> </h4>
    
    <p>Name : <strong>${project.name}</strong> (${project.approved ? "approved" : "Pending Approval"})</p>
    <p>Description: ${project.description}</p>
    <p>Funding Goal: ${ethers.utils.formatEther(project.fundingGoal)} ETH</p>
    <p>Funded Currently: ${ethers.utils.formatEther(project.currentFunding)} ETH</p>
    <p>Environmental Impact: ${project.environmentalImpact}</p>
    <p>Milestone Target: ${ethers.utils.formatEther(project.milestoneTarget)} ETH</p>
    <hr>
`;

        projectsContainer.appendChild(projectElement);
    }
}

// Initial loading of projects

// loadProjects();
// Initialize the connection to the contract when the page loads

window.addEventListener('DOMContentLoaded', async () => {
    await connectContract();

});
