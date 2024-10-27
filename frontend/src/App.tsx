// src/App.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';
import axios from 'axios';
import Header from "@/components/Header";
import Menu from '@/components/Menu';
import Login from '@/components/Login';
import MyCollection from '@/components/MyCollection';
import MyBooster from '@/components/MyBooster';
import Collections from '@/components/Collections';

type Canceler = () => void;

interface Card {
    id: string;
    name: string;
    illustration: string;
}

const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>();
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncaught error', error));
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current();
        cancelerRef.current = undefined;
      }
    };
  }, dependencies);
};

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>();
  const [contract, setContract] = useState<main.Main>();

  useAffect(async () => {
    const details_ = await ethereum.connect('metamask');
    if (!details_) return;
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) return;
    setContract(contract_);
  }, []);

  return useMemo(() => {
    if (!details || !contract) return;
    return { details, contract };
  }, [details, contract]);
};

export const App = () => {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<Card[]>([]); // Collection state for NFTs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<string>('all'); // Default view is 'all'

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet?.contract) return; // Wait for the contract to be ready

      const ownedNFTs = ["ru1-4", "mcd19-5"]; // Mock NFT IDs
      const nftPromises = ownedNFTs.map(id => axios.get(`http://localhost:3001/api/nft/${id}`));

      try {
        setLoading(true); // Set loading state
        const nftData = await Promise.all(nftPromises);
        console.log('NFT data fetched:', nftData);
        setNfts(nftData.map(response => response.data));
      } catch (error) {
        console.error('Error fetching NFT data:', error);
        setError('Error fetching NFT data');
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchNFTs();
  }, [wallet]);

  // Function to add cards to the collection
  const addToCollection = (cards: Card[]) => {
    setNfts(prevNfts => [...prevNfts, ...cards]);
  };

  return (
    <div className={styles.body}>
        <Header />
        <Menu onSelect={setView} />
        <Login account={wallet?.details?.account || null} /> {/* Ensure it passes null if undefined */}
        {loading && <p>Loading NFTs...</p>}
        {error && <p>{error}</p>}
        
        {view === 'all' && <Collections collections={['Collection 1', 'Collection 2']} />}
        {view === 'myCollection' && <MyCollection nfts={nfts} />}
        {view === 'booster' && <MyBooster addToCollection={addToCollection} />} {/* Pass addToCollection to MyBooster */}
    </div>
  );
};

export default App;
