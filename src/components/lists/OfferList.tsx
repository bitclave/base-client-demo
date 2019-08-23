import { Offer } from '@bitclave/base-client-js';
import * as React from 'react';
import OfferHolder from '../holders/OfferHolder';
import AbstractList, { AbstractProperties } from './AbstractList';

interface Properties extends AbstractProperties<Offer> {
}

export default class OfferList extends AbstractList<Properties, Offer> {

    bindHolder(dataItem: Offer, position: number): Object {
        return (
            <OfferHolder
                selected={!!this.state.selected && dataItem.id === this.state.selected.id}
                onClick={(model: Offer, target: React.Component) => this.onClick(model, target)}
                model={dataItem}
                key={dataItem.id}
            />
        );
    }

}
