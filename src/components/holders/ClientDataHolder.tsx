import { Button, Input } from 'antd';
import * as React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { ClientData } from '../../models/ClientData';
import { AbstractProperties, AbstractState, default as AbstractHolder } from './AbstractHolder';

interface Properties extends AbstractProperties<ClientData> {
    onGrandClick: (pk: string, clientData: ClientData) => void
}

interface State extends AbstractState {
    pk: string
}

export class ClientDataHolder extends AbstractHolder<Properties, ClientData, State> {

    public bindModel(model: ClientData): object {
        return (
            <Row>
                <Col className="client-data-item-field" xs="2" sm="2">{model.key.toString()}</Col>
                <Col className="client-data-item-field" xs="2" sm="1">{model.type.toString()}</Col>
                <Col className="client-data-item-field" xs="2" sm="3" style={{'overflowWrap': 'break-word'}}>
                    {model.fieldData ? `${model.fieldData.to.toString()} (${model.fieldData.root})` : ''}
                </Col>
                <Col className="client-data-item-field" xs="6" sm="4">
                    <Input
                        value={this.state.pk}
                        onChange={(e) => this.setState({pk: e.target.value})}
                        placeholder="public key"
                    />
                    <Button onClick={() => this.props.onGrandClick(this.state.pk, model)}>
                        Share
                    </Button>
                </Col>
            </Row>
        );
    }
}
