
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    // mainnet,
    // holesky,
    // sepolia,
    // optimism,
    optimismSepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: 'f8a6524307e28135845a9fe5811fcaa2',
    chains: [
        // mainnet,
        // holesky
        // sepolia,
        // optimism,
        optimismSepolia
    ],
    ssr: true,
});