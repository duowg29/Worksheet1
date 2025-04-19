import { TableData } from "./WorksheetDTO";

export default class QuestionDTO {
    type: "table" | "ratio" | "variable"; // Loại câu hỏi: bảng, tỷ lệ, hoặc biến số
    table1?: TableData; // Dùng cho bài 1
    table2?: TableData; // Dùng cho bài 1
    ratio1?: string; // Dùng cho bài 2 và 3
    ratio2?: string; // Dùng cho bài 2 và 3
    variable?: string; // Dùng cho bài 3 (biến số: x, y, z)

    constructor(
        type: "table" | "ratio" | "variable",
        options: {
            table1?: TableData;
            table2?: TableData;
            ratio1?: string;
            ratio2?: string;
            variable?: string;
        }
    ) {
        this.type = type;
        this.table1 = options.table1;
        this.table2 = options.table2;
        this.ratio1 = options.ratio1;
        this.ratio2 = options.ratio2;
        this.variable = options.variable;
    }
}
