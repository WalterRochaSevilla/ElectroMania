type Primitives = string | number | boolean | Date;

export abstract class ValueObject<T extends Primitives> {
    readonly value: T;
    public constructor(value: T) {
        this.value = value;
    }
    private isDefined(value: T){
        if(value === null || value === undefined){
            throw Error('Value most be defined');
        }
    }
}