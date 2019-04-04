import * as React from 'react';
import Pair from '../../models/Pair';
import PairItemHolder from '../holders/PairItemHolder';
import AbstractList, { AbstractProperties } from './AbstractList';

interface Properties extends AbstractProperties<Pair<string, string>> {
    onDeleteClick: ((key: string) => void) | null;
}

export default class SimplePairList extends AbstractList<Properties, Pair<string, string>> {

    bindHolder(dataItem: Pair<string, string>, position: number): Object {
        return (
            <PairItemHolder
                name={dataItem.key}
                value={dataItem.value}
                onDeleteClick={this.getDeleteCallBack(dataItem)}
                key={position}
            />
        );
    }

    private getDeleteCallBack(dataItem: Pair<string, string>): ((key: string) => void) | null {
        const {onDeleteClick} = this.props;
        if (onDeleteClick) {
            return () => onDeleteClick(dataItem.key);
        } else {
            return null;
        }

    }
}
