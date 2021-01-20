import React, { useState } from 'react';
import { Dialog, Text } from '@blueprintjs/core';
import Rsk3 from '@rsksmart/rsk3';
import { useDispatch, useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../../selectors';
import { actions } from '../../slice';
import { useAccount } from '../../../../hooks/useAccount';
import { csov_delegate } from '../../requests/csov';
import { useNtSoV_delegates } from '../../../../hooks/ntsov/useNtSoV_delegates';
import { useNtSoV_balanceOf } from '../../../../hooks/ntsov/useNtSoV_balanceOf';
import { fromWei, genesisAddress } from '../../../../../utils/helpers';

export function DelegationDialog() {
  const { showDelegationDialog } = useSelector(selectBlockChainProvider);
  const dispatch = useDispatch();

  const account = useAccount();
  const delegates = useNtSoV_delegates();
  const balance = useNtSoV_balanceOf(account);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleSubmit = async e => {
    e && e.preventDefault && e.preventDefault();
    setLoading(true);
    try {
      await csov_delegate(address.toLowerCase(), account);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const delegated =
    delegates.value.toLowerCase() !== genesisAddress.toLowerCase() &&
    delegates.value.toLowerCase() !== account.toLowerCase();

  return (
    <Dialog
      isOpen={showDelegationDialog}
      onClose={() => dispatch(actions.toggleDelagationDialog(false))}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      title="Delegate Voting Rights"
    >
      <div className="container pt-4">
        <form onSubmit={handleSubmit}>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Delegate to
          </label>

          {delegated && (
            <p className="mt-2 mb-3 text-sm">
              To delegate voting rights to yourself enter your own wallet
              address
            </p>
          )}

          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="stake-amount"
            type="text"
            placeholder="RSK wallet address"
            value={address}
            onChange={e => setAddress(e.currentTarget.value)}
          />

          <Text tagName="p" ellipsize className="mt-2 mb-3 text-sm">
            Your NTSOV: {Number(fromWei(balance.value)).toLocaleString()}
          </Text>
          <Text tagName="p" ellipsize className="mb-3 text-sm">
            Delegated to: {delegated ? delegates.value : 'Yourself'}
          </Text>

          <div className="text-right mt-3">
            <button
              type="submit"
              className={`bg-green-500 text-white px-4 py-2 rounded ${
                (!address ||
                  loading ||
                  !Rsk3.utils.isAddress((address || '').toLowerCase())) &&
                'opacity-50 cursor-not-allowed'
              }`}
              disabled={
                !address ||
                loading ||
                !Rsk3.utils.isAddress((address || '').toLowerCase())
              }
            >
              Delegate
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
