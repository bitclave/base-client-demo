import { FieldData } from '@bitclave/base-client-js';
import * as React from 'react';
import { Button } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

interface Prop {
    model: FieldData;
    accountPk: string;
    onAcceptClick: (() => void) | null;
    onRevokeClick: (() => void) | null;
}

export default class PermissionHolder extends React.Component<Prop, {}> {

    render() {
        return (
            <small>
                <Row>
                    <Col className="client-data-item-field" xs="5">{this.prepareFromTo()}</Col>

                    <Col className="client-data-item-field" xs="2">
                        Requested:
                        <br/>
                        <div>{this.props.model.key}</div>
                    </Col>
                    <Col className="client-data-item-field" xs="3">
                        Accepted:
                        <br/>
                        {this.prepareResponseFields()}
                    </Col>

                    {this.prepareAcceptButton()}
                </Row>
            </small>
        );
    }

    private prepareFromTo() {
        const result = [];
        const {from, to} = this.props.model;

        if (from && from !== this.props.accountPk) {
            result.push(<div key="from">from: {from}</div>);
        }

        if (to && to !== this.props.accountPk) {
            result.push(<div key="to">to: {to}</div>);
        }

        return result;
    }

    private prepareResponseFields() {
        const responseData = this.props.model.value;
        return <div>{responseData ? responseData : 'not granted or client not has field'}</div>;
    }

    private prepareAcceptButton() {
        const {model, onAcceptClick, onRevokeClick} = this.props;

        if (onAcceptClick === null || onRevokeClick === null || this.props.accountPk !== model.to) {
            return;
        }

        if (model.value) {
            return (
                <Col className="client-data-item-field" xs="auto">
                    <Button color="danger" onClick={() => {
                        if (onRevokeClick) {
                            onRevokeClick();
                        }
                    }
                    }>
                        Revoke
                    </Button>
                </Col>
            );
        }

        return (
            <Col className="client-data-item-field" xs="auto">
                <Button color="success" onClick={() => {
                    if (onAcceptClick) {
                        onAcceptClick();
                    }
                }
                }>
                    Accept
                </Button>
            </Col>
        );
    }
}
