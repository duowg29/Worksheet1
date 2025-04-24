import { TableData } from "./WorksheetDTO";

interface QuestionData {
    table?: TableData;
    fraction1?: string;
    fraction2?: string;
    variable?: string;
    answer?: any; // Đáp án: { topMiddle, topRight, bottomMiddle, bottomRight } cho table; "Yes"/"No" cho fraction; string cho variable
}

export default class QuestionDTO {
    private type: string;
    private data: QuestionData;

    constructor(type: string, data: QuestionData) {
        this.type = type;
        this.data = data;
    }

    getType(): string {
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

    getAnswer(): any {
        return this.data.answer;
    }
}
