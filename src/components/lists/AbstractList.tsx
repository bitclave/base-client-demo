import * as React from 'react';

export interface AbstractProperties<M> {
    data: Array<M>;
    onItemClick?: (item: M) => void;
    selectable?: boolean;
}

export interface AbstractState<M> {
    selected: M | undefined;
}

export default abstract class AbstractList<P extends AbstractProperties<M>, M>
    extends React.Component<P, AbstractState<M>> {

    constructor(props: Readonly<P>) {
        super(props);

        this.state = {
            selected: undefined
        }
    }

    public render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    protected bindItems(): Array<Object> {
        const {data} = this.props;
        const len: number = data.length;
        const result: Array<Object> = [];
        for (let i = 0; i < len; i++) {
            result.push(this.bindHolder(data[i], i));
        }

        return result;
    }

    protected onClick(item: M, target: React.Component) {
        if (this.props.onItemClick) {
            this.props.onItemClick(item);
        }

        if (this.props.selectable) {
            this.setState({selected: item})
        }
    }

    abstract bindHolder(dataItem: M, position: number): Object;

}
