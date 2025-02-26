import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  // mainnet,
  // holesky,
  // sepolia,
  // optimism,
  optimismSepolia,
} from "wagmi/chains";

const { chains, publicClient } = configureChains(
  // [mainnet],
  // [holesky],
  // [sepolia],
  // [optimism],
  [optimismSepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId: "f8a6524307e28135845a9fe5811fcaa2",
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
