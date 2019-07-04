import { SearchRequest } from '@bitclave/base-client-js';
import * as React from 'react';
import SearchRequestHolder from '../holders/SearchRequestHolder';
import AbstractList, { AbstractProperties } from './AbstractList';

interface Properties extends AbstractProperties<SearchRequest> {
}

export default class SearchRequestList extends AbstractList<Properties, SearchRequest> {

    bindHolder(dataItem: SearchRequest, position: number): Object {
        return (
            <SearchRequestHolder
                selected={!!this.state.selected && dataItem.id === this.state.selected.id}
                onClick={(model: SearchRequest, target: React.Component) => this.onClick(model, target)}
                model={dataItem}
                key={position}
            />
        );
    }

}
