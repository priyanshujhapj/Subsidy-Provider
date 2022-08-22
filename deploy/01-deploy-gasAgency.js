const { network, ethers } = require("hardhat")
const { networkConfig, gasStation } = require("../helper.hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const args = [
        networkConfig[chainId]["vrfCoordinatorV2"],
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["subscriptionId"],
        networkConfig[chainId]["callbackGasLimit"],
        gasStation,
    ]

    const gasAgency = await deploy ("GasAgency", {
        from: deployer,
        args: args,
        log: true,
        blockConfirmations: network.config.blockConfirmations || 1,
    })

    const GasAgency = await ethers.getContractAt("GasAgency", gasAgency.address, deployer)
    console.log()
    await GasAgency.requestForCard("Bob", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    const requestId = (await GasAgency.requestCounter()).toString()
    console.log(requestId)
}
