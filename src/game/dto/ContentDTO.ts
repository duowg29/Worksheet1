export default class ContentDTO {
    private _id: string;
    private _text: string;

    constructor(id: string, text: string) {
        this._id = id;
        this._text = text;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        this._text = value;
    }
}
