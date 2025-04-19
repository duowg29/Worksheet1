import { TableData } from "./WorksheetDTO";

export default class QuestionDTO {
    private type: "table" | "fraction" | "variable";
    private data: {
        table?: TableData;
        fraction1?: string;
        fraction2?: string;
        variable?: string;
    };

    constructor(
        type: "table" | "fraction" | "variable",
        data: {
            table?: TableData;
            fraction1?: string;
            fraction2?: string;
            variable?: string;
        }
    ) {
        this.type = type;
        this.data = data;
    }

    getType(): "table" | "fraction" | "variable" {
        return this.type;
    }

    getTable(): TableData | undefined {
        return this.data.table;
    }

    getFraction1(): string | undefined {
        return this.data.fraction1;
    }

    getFraction2(): string | undefined {
        return this.data.fraction2;
    }

    getVariable(): string | undefined {
        return this.data.variable;
    }
}
