import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useExchangeRate } from '@deriv/hooks';
import { useStores } from 'Stores';
import { buy_sell } from 'Constants/buy-sell';
import { localize, Localize } from 'Components/i18next';
import { generateEffectiveRate } from 'Utils/format-value';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './advertiser-page-row.scss';

const AdvertiserPageRow = ({ row: advert }) => {
    const { advertiser_page_store, buy_sell_store, general_store } = useStores();
    const { getRate } = useExchangeRate();
    const {
        client: { currency },
    } = useStore();
    const {
        effective_rate,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        payment_method_names,
        price_display,
        rate_type,
        rate,
    } = advert;
    const { showModal } = useModalManagerContext();

    const is_buy_advert = advertiser_page_store.counterparty_type === buy_sell.BUY;
    const is_my_advert = advertiser_page_store.advertiser_details_id === general_store.advertiser_id;

    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate,
        local_currency,
        exchange_rate: getRate(local_currency),
        market_rate: effective_rate,
    });

    const showAdForm = () => {
        buy_sell_store.setSelectedAdState(advert);
        showModal({
            key: 'BuySellModal',
        });
    };

    if (isMobile()) {
        return (
            <Table.Row className='advertiser-page-adverts__table-row'>
                <Table.Cell className='advertiser-page__cell'>
                    <Text size='xxs'>
                        <Localize
                            i18n_default_text='Rate (1 {{currency}})'
                            values={{
                                currency,
                            }}
                        />
                    </Text>
                    <Text as='div' color='profit-success' weight='bold'>
                        {display_effective_rate} {local_currency}
                    </Text>
                    <div className='advertiser-page__cell-limit'>
                        <Text size='xxs'>
                            <Localize
                                i18n_default_text='Limits {{min_order_amount_limit_display}}-{{max_order_amount_limit_display}} {{currency}}'
                                values={{
                                    min_order_amount_limit_display,
                                    max_order_amount_limit_display,
                                    currency,
                                }}
                            />
                        </Text>
                    </div>
                    <div className='advertiser-page__payment-methods-list'>
                        {payment_method_names
                            ? payment_method_names.map((payment_method, key) => {
                                  return (
                                      <div className='advertiser-page__payment-method' key={key}>
                                          <Text line_height='l' size='xxxs'>
                                              {payment_method}
                                          </Text>
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                </Table.Cell>
                {is_my_advert ? (
                    <Table.Cell />
                ) : (
                    <Table.Cell className='advertiser-page-adverts__button'>
                        <Button primary large onClick={showAdForm} is_disabled={general_store.is_barred}>
                            {is_buy_advert ? localize('Buy') : localize('Sell')} {currency}
                        </Button>
                    </Table.Cell>
                )}
            </Table.Row>
        );
    }

    return (
        <Table.Row className='advertiser-page-adverts__table-row'>
            <Table.Cell>{`${min_order_amount_limit_display}-${max_order_amount_limit_display} ${currency}`}</Table.Cell>
            <Table.Cell>
                <Text color='profit-success' size='xs' weight='bold'>
                    {display_effective_rate} {local_currency}
                </Text>
            </Table.Cell>
            <Table.Cell>
                <div className='advertiser-page__payment-methods-list'>
                    {payment_method_names
                        ? payment_method_names.map((payment_method, key) => {
                              return (
                                  <div className='advertiser-page__payment-method' key={key}>
                                      <Text size='xs' line_height='l'>
                                          {payment_method}
                                      </Text>
                                  </div>
                              );
                          })
                        : null}
                </div>
            </Table.Cell>
            {is_my_advert ? (
                <Table.Cell />
            ) : (
                <Table.Cell className='advertiser-page-adverts__button'>
                    <Button is_disabled={general_store.is_barred} onClick={showAdForm} primary small>
                        {is_buy_advert ? localize('Buy') : localize('Sell')} {currency}
                    </Button>
                </Table.Cell>
            )}
        </Table.Row>
    );
};

AdvertiserPageRow.displayName = 'AdvertiserPageRow';

AdvertiserPageRow.propTypes = {
    advert: PropTypes.object,
    row: PropTypes.object,
};

export default observer(AdvertiserPageRow);
