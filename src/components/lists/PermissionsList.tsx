import { FieldData } from '@bitclave/base-client-js';
import * as React from 'react';
import PermissionHolder from '../holders/PermissionHolder';

interface Properties {
    data: Array<FieldData>;
    accountPk: string;
    onAcceptClick: ((request: FieldData) => void) | null;
    onRevokeClick: ((request: FieldData) => void) | null;
}

export default class PermissionsList extends React.Component<Properties, {}> {

    render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    bindItems() {
        const {data, onAcceptClick, onRevokeClick} = this.props;
        const result: Array<Object> = [];
        let item: object;

        data.forEach((value: FieldData, index: number) => {
            item = (
                <PermissionHolder
                    model={value}
                    accountPk={this.props.accountPk}
                    onAcceptClick={onAcceptClick == null ? null : () => onAcceptClick(value)}
                    onRevokeClick={onRevokeClick == null ? null : () => onRevokeClick(value)}
                    key={index}
                />
            );
            result.push(item);
        });

        return result;
    }

}
