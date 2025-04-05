import ContentDTO from "./ContentDTO";

export default class HeaderDTO {
    private _id: string;
    private _title: string;
    private _contents: ContentDTO[];
    image: {
        path: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    } | null;

    constructor(
        id: string,
        title: string,
        contents: ContentDTO[],
        image: {
            path: string;
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        } | null
    ) {
        this._id = id;
        this._title = title;
        this._contents = contents;
        this.image = image;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get contents(): ContentDTO[] {
        return this._contents;
    }

    public set contents(value: ContentDTO[]) {
        this._contents = value;
    }
}
