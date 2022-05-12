module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let proxyOwner;

  const chainId = await getChainId();
  if (chainId == 4) {
    // rinkeby contract addresses
    proxyOwner = deployer.address;
  } else if (chainId == 43114 || chainId == 31337) {
    // multisig
    proxyOwner = "0x3876183b75916e20d2ADAB202D1A3F9e9bf320ad";
  }

  const rewardDistributorV2 = await deploy("RewardDistributorV2", {
    from: deployer,
    proxy: {
      owner: proxyOwner,
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: "DefaultProxyAdmin",
      execute: {
        init: {
          methodName: "initialize",
          args: [],
        },
      },
    },
    log: true,
  });
};

module.exports.tags = ["RewardDistributorV2"];