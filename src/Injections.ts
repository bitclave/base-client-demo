import 'reflect-metadata';
import BaseManager from './manager/BaseManager';

class Creator<T> {
    private readonly creator: { new(): T; };

    constructor(creator: { new(): T }) {
        this.creator = creator;
    }

    public create(): T {
        return new this.creator();
    }
}

const mapDependencies = new Map<string, any | null>();
const mapSingleton = new Map<string, object>();

export enum Injections {
    BASE_MANAGER = 'BASE_MANAGER'
}

mapDependencies.set(Injections.BASE_MANAGER, new Creator<BaseManager>(BaseManager));

export const lazyInject = (qualifier: Injections) => {
    return (target: object, key: string, props?: any) => {
        props.initializer = (): any => {
            if (mapDependencies.has(qualifier) && !mapSingleton.has(qualifier)) {
                mapSingleton.set(qualifier, mapDependencies.get(qualifier).create());
            }
            return mapSingleton.get(qualifier);
        };
    };

};
