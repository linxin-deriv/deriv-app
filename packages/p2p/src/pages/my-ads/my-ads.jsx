import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import TableError from 'Components/section-error';
import CreateAd from './create-ad.jsx';
import EditAd from './edit-ad.jsx';
import MyAdsTable from './my-ads-table.jsx';
import Verification from 'Components/verification';

const MyAdsState = ({ message }) => (
    <div className='my-ads__state'>
        <TableError message={message} className='section-error__table' size='xs' />
    </div>
);

const MyAds = () => {
    const { general_store, my_ads_store } = useStores();

    React.useEffect(() => {
        my_ads_store.setIsLoading(true);
        my_ads_store.setShowEditAdForm(false);
        my_ads_store.getAccountStatus();
        if (general_store.active_index !== 2) general_store.setActiveIndex(2);

        return () => {
            my_ads_store.setShowAdForm(false);
            general_store.setShouldShowPopup(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_ads_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (general_store.is_restricted) {
        return <MyAdsState message={localize('Deriv P2P cashier is unavailable in your country.')} />;
    }

    if (my_ads_store.error_message) {
        return <MyAdsState message={my_ads_store.error_message} />;
    }

    if (general_store.is_advertiser) {
        if (my_ads_store.show_ad_form) {
            return (
                <div className='my-ads'>
                    <CreateAd />
                </div>
            );
        } else if (my_ads_store.show_edit_ad_form) {
            return (
                <div className='my-ads'>
                    <EditAd />
                </div>
            );
        }

        return (
            <div className='my-ads'>
                <MyAdsTable />
            </div>
        );
    }

    return <Verification />;
};

MyAds.propTypes = {
    error_message: PropTypes.string,
    getAccountStatus: PropTypes.func,
    is_advertiser: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_restricted: PropTypes.bool,
    setIsLoading: PropTypes.func,
    show_ad_form: PropTypes.bool,
};

export default observer(MyAds);
