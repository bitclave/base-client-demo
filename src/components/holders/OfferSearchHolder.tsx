import { OfferResultAction, OfferSearch, OfferSearchResultItem } from '@bitclave/base-client-js';
import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import AbstractHolder, { AbstractProperties, AbstractState } from './AbstractHolder';

interface Properties extends AbstractProperties<OfferSearch> {
    onComplainClick: Function;
    onGrantAccessClick: Function;
    state: OfferResultAction;
}

export default class OfferSearchHolder extends AbstractHolder<Properties, OfferSearch, AbstractState> {

    public bindModel(model: OfferSearch): object {
        const state = this.props.state;

        return (
            <Row>
                <Col className="client-data-item-field" xs="2" sm="3">
                    status: {state}
                </Col>
                <Col className="client-data-item-field" xs="6" sm="3">
                    {this.getComplainButton(model, state)}
                </Col>
                <Col className="client-data-item-field" xs="6" sm="3">
                    {this.getGrantAccessButton(model, state)}
                </Col>
            </Row>
        );
    }

    private getComplainButton(model: OfferSearch, state: OfferResultAction): object {
        return (
            <Button
                disabled={state !== OfferResultAction.NONE}
                className="m-2"
                color="danger"
                size="sm"
                onClick={() => this.props.onComplainClick(model)}
            >
                Complain (misrepresentation)
            </Button>
        );
    }

    private getGrantAccessButton(model: OfferSearch, state: OfferResultAction): object {
        return (
            <Button
                className="m-2"
                color="success"
                size="sm"
                onClick={() => this.props.onGrantAccessClick(model)}
            >
                Grant access
            </Button>
        );
    }

}
