import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';

import {
  seedTransactions,
  selectTransactions,
} from '@stores/reducers/transactionReducers';
import type { AppDispatch, RootState } from '@stores/reducers/store';
import { DUMMY_TRANSACTIONS, SEED_SAMPLE_DATA } from '@utils/dummyData';

/**
 * Fills an empty store with the sample transactions so the home screen and
 * lists can be tested. Remounts after every cold start; "Clear data" in the
 * profile empties the store until the app is restarted.
 */
const SampleDataLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();

  useEffect(() => {
    const isEmpty = selectTransactions(store.getState()).length === 0;

    if (__DEV__ && SEED_SAMPLE_DATA && isEmpty) {
      dispatch(seedTransactions(DUMMY_TRANSACTIONS));
    }
  }, [dispatch, store]);

  return null;
};

export default SampleDataLoader;
