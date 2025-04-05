import CheatsheetDTO from "./CheatsheetDTO";

export default class ClassDTO {
    private _id: string;
    private _title: string;
    private _cheatsheets: CheatsheetDTO[];

    constructor(id: string, title: string, cheatsheets: CheatsheetDTO[]) {
        this._id = id;
        this._title = title;
        this._cheatsheets = cheatsheets;
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

    public get cheatsheets(): CheatsheetDTO[] {
        return this._cheatsheets;
    }

    public set cheatsheets(value: CheatsheetDTO[]) {
        this._cheatsheets = value;
    }
}
