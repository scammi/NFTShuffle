// Frameworks
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import _ from 'lodash';

// App Components
import { GLOBALS } from '../utils/globals';

export const _DEFAULT_CHAIN_ID = _.first([31337, 5]);

export const providerOptions = {
  injected: {
    package: null,
    display: {
      name: 'Browser',
      description: 'Connect with your Browser Wallet',
    },
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: GLOBALS.INFURA_APIKEY,
    },
  },
};

const initialState = {
  // Connected Wallet
  isConnected: false,
  wallet: '',

  // Web3-specific
  instance      : null,
  readProvider  : null,
  writeProvider : null,
  signer        : null,
  chainId       : _DEFAULT_CHAIN_ID,
  accounts      : [],
  connectedAccount : null,
};

export let web3Modal;

export const Web3Context = createContext(initialState);

export function useWeb3Context() {
  return useContext(Web3Context);
}

const Web3Reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'UPDATE_WEB3':
      newState = {
        ...state,
        ...action.payload,
      };
      if (!_.isEmpty(newState.accounts)) {
        newState.isConnected = true;
        newState.wallet = _.first(newState.accounts);
      } else {
        newState.isConnected = false;
        newState.wallet = '';
      }
      return newState;
    default:
      return state;
  }
};

export default function Provider({ children }) {
  const [ state, dispatch ] = useReducer(Web3Reducer, initialState);
  const connect = async (clearCache = false) => {
    return await _connectWeb3(dispatch, clearCache);
  };
  const disconnect = async () => _disconnectWeb3(dispatch);
  return (
    <Web3Context.Provider value={[ state, dispatch, connect, disconnect ]}>
      {children}
    </Web3Context.Provider>
  );
}

export function Updater() {
  const [ state, dispatch ] = useWeb3Context();

  useEffect(() => {
    web3Modal = new Web3Modal({
      // network: 'mainnet', // optional
      cacheProvider: true,
      disableInjectedProvider: false, // For MetaMask / Brave / Opera.
      providerOptions,
    });

    if (web3Modal.cachedProvider) {
      _connectWeb3(dispatch);
    }

    if (_.isEmpty(state.readProvider)) {
      const readProvider = ethers.getDefaultProvider(
        _DEFAULT_CHAIN_ID === 31337 ?
        'http://127.0.0.1:8545/' : _DEFAULT_CHAIN_ID, {
        // alchemy   : GLOBALS.ALCHEMY_APIKEY[_DEFAULT_CHAIN_ID],
        // etherscan : GLOBALS.ETHERSCAN_APIKEY,
        // infura    : GLOBALS.INFURA_APIKEY,
      });
      dispatch({ type: 'UPDATE_WEB3', payload: { readProvider } });
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (state.instance?.on) {
      const handleAccountsChanged = async (accounts) => {
        if (!_.isEmpty(accounts)) {
          const account = await _getConnectedAccount(state.instance);
          dispatch({ type: 'UPDATE_WEB3', payload: { ...account } });
        } else {
          _disconnectWeb3(dispatch);
        }
      };

      const handleChainChanged = (_hexChainId) => {
        dispatch({ type: 'UPDATE_WEB3', payload: { chainId: _hexChainId } });
      };

      const handleDisconnect = () => {
        _disconnectWeb3(dispatch);
      };

      state.instance.on('accountsChanged', handleAccountsChanged);
      state.instance.on('chainChanged', handleChainChanged);
      state.instance.on('disconnect', handleDisconnect);

      return () => {
        if (state.instance.removeListener) {
          state.instance.removeListener('accountsChanged', handleAccountsChanged);
          state.instance.removeListener('chainChanged', handleChainChanged);
          state.instance.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [ state, dispatch ]);

  return null;
}

const _getConnectedAccount = async (instance) => {
  const writeProvider = new ethers.providers.Web3Provider(instance);
  const accounts = await writeProvider.listAccounts();
  const network = await writeProvider.getNetwork();
  const signer = writeProvider.getSigner();
  const connectedAccount = _.first(accounts);
  return {
    writeProvider,
    signer,
    chainId: network.chainId,
    accounts,
    connectedAccount,
  };
};

const _connectWeb3 = async (dispatch, clearCache = true) => {
  if (clearCache) {
    await web3Modal.clearCachedProvider();
  }

  const instance = await web3Modal.connect();
  const account = await _getConnectedAccount(instance);

  dispatch({
    type: 'UPDATE_WEB3',
    payload: {
      instance,
      ...account,
    },
  });

  return account.connectedAccount;
};

const _disconnectWeb3 = async (dispatch) => {
  await web3Modal.clearCachedProvider();
  dispatch({
    type: 'UPDATE_WEB3',
    payload: {
      instance: null,
      writeProvider: null,
      signer: null,
      chainId: _DEFAULT_CHAIN_ID,
      accounts: [],
    },
  });
};
