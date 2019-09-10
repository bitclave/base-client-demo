import * as React from 'react';
import { ClientData } from '../../models/ClientData';
import { ClientDataHolder } from '../holders/ClientDataHolder';
import AbstractList, { AbstractProperties } from './AbstractList';

interface Properties extends AbstractProperties<ClientData> {
    onShareClick: (pk: string, item: ClientData) => void;
}

export class ClientDataList extends AbstractList<Properties, ClientData> {

    bindHolder(dataItem: ClientData, position: number): Object {
        return (
            <div key={`data-${position}`}>
                <ClientDataHolder
                    selected={false}
                    model={dataItem}
                    onClick={() => {}}
                    onGrandClick={(pk: string, data: ClientData) => this.props.onShareClick(pk, data)}/>
            </div>
        );
    }
}
