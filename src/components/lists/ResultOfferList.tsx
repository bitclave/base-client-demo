import { OfferSearchResultItem } from '@bitclave/base-client-js';
import * as React from 'react';
import OfferHolder from '../holders/OfferHolder';
import OfferSearchHolder from '../holders/OfferSearchHolder';
import AbstractList, { AbstractProperties } from './AbstractList';

interface Properties extends AbstractProperties<OfferSearchResultItem> {
    onComplainClick: (item: OfferSearchResultItem) => void;
    onGrantAccessClick: (item: OfferSearchResultItem) => void;
}

export default class ResultOfferList extends AbstractList<Properties, OfferSearchResultItem> {

    bindHolder(dataItem: OfferSearchResultItem, position: number): Object {
        return (
            <div>
                <OfferHolder
                    selected={false}
                    onClick={(model: OfferSearchResultItem, target: React.Component) => this.onClick(model, target)}
                    model={dataItem.offer}
                    key={`offer-${position}`}
                />
                <OfferSearchHolder
                    selected={false}
                    onClick={() => null}
                    onComplainClick={() => this.props.onComplainClick(dataItem)}
                    onGrantAccessClick={() => this.props.onGrantAccessClick(dataItem)}
                    model={dataItem.offerSearch}
                    key={`stat-${position}`}
                />
            </div>

        );
    }

}
