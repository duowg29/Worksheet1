import Phaser from "phaser";
import QuestionDTO from "../dto/QuestionDTO";
import WorksheetDTO, { TableData } from "../dto/WorksheetDTO";

export default class QuestionService {
    // Tạo các câu hỏi loại "table"
    createTableQuestions(count: number): QuestionDTO[] {
        const questions: QuestionDTO[] = [];
        for (let i = 0; i < count; i++) {
            const table = this.generateTableDataForExercise1();
            // Tính toán đáp án cho bài tập 1: Tìm 2 tỷ lệ tương đương
            const ratio = table.topLeft / table.bottomLeft;
            const multiplier1 = Phaser.Math.Between(2, 5);
            let multiplier2 = Phaser.Math.Between(2, 5);
            while (multiplier1 === multiplier2) {
                multiplier2 = Phaser.Math.Between(2, 5);
            }
            const answer = {
                topMiddle: table.topLeft * multiplier1,
                topRight: table.topLeft * multiplier2,
                bottomMiddle: table.bottomLeft * multiplier1,
                bottomRight: table.bottomLeft * multiplier2,
            };
            questions.push(new QuestionDTO("table", { table, answer }));
        }
        return questions;
    }

    // Tạo các câu hỏi loại "fraction"
    createFractionQuestions(count: number): QuestionDTO[] {
        const questions: QuestionDTO[] = [];
        for (let i = 0; i < count; i++) {
            const fraction1 = this.generateFraction();
            let fraction2: [number, number];
            // Tạo phân số thứ hai ngẫu nhiên, không cần kiểm tra tương đương
            do {
                fraction2 = this.generateFraction();
            } while (
                fraction1[0] === fraction2[0] &&
                fraction1[1] === fraction2[1]
            ); // Đảm bảo hai phân số không giống hệt nhau

            // So sánh giá trị của hai phân số
            const value1 = fraction1[0] / fraction1[1];
            const value2 = fraction2[0] / fraction2[1];
            let answer: string;
            if (value1 > value2) {
                answer = ">";
            } else if (value1 < value2) {
                answer = "<";
            } else {
                answer = "=";
            }

            questions.push(
                new QuestionDTO("fraction", {
                    fraction1: `${fraction1[0]}/${fraction1[1]}`,
                    fraction2: `${fraction2[0]}/${fraction2[1]}`,
                    answer,
                })
            );
        }
        return questions;
    }

    // Tạo các câu hỏi loại "variable"
    createVariableQuestions(count: number): QuestionDTO[] {
        const questions: QuestionDTO[] = [];
        const variables = ["x", "y", "z", "r", "s", "t"];
        for (let i = 0; i < count; i++) {
            const fraction1 = this.generateFraction();
            const fraction2 = this.generateEquivalentFraction(fraction1);
            const variable = variables[i];
            const isFirstVariable = Math.random() > 0.5;

            // Tính đáp án bằng cách nhân chéo để tránh lỗi floating-point
            let answer: number;
            if (isFirstVariable) {
                // Trường hợp: variable/fraction2[1] = fraction1[0]/fraction1[1]
                // variable / fraction2[1] = fraction1[0] / fraction1[1]
                // variable = (fraction1[0] * fraction2[1]) / fraction1[1]
                answer = (fraction1[0] * fraction2[1]) / fraction1[1];
            } else {
                // Trường hợp: fraction2[0]/variable = fraction1[0]/fraction1[1]
                // fraction2[0] / variable = fraction1[0] / fraction1[1]
                // variable = (fraction1[1] * fraction2[0]) / fraction1[0]
                answer = (fraction1[1] * fraction2[0]) / fraction1[0];
            }

            questions.push(
                new QuestionDTO("variable", {
                    fraction1: `${fraction1[0]}/${fraction1[1]}`,
                    fraction2: isFirstVariable
                        ? `${variable}/${fraction2[1]}`
                        : `${fraction2[0]}/${variable}`,
                    variable,
                    answer: answer.toString(),
                })
            );
        }
        return questions;
    }

    // Tạo dữ liệu cho bảng 3x2 của Bài 1 (chỉ điền 2 ô đầu tiên)
    private generateTableDataForExercise1(): TableData {
        const topLeft = Phaser.Math.Between(1, 10);
        const bottomLeft = Phaser.Math.Between(1, 10);
        return {
            topLeft,
            topMiddle: "",
            topRight: "",
            bottomLeft,
            bottomMiddle: "",
            bottomRight: "",
        };
    }

    // Tạo một phân số ngẫu nhiên
    private generateFraction(): [number, number] {
        const numerator = Phaser.Math.Between(1, 10);
        const denominator = Phaser.Math.Between(1, 10);
        return [numerator, denominator];
    }

    // Tạo phân số tương đương
    private generateEquivalentFraction(
        fraction: [number, number]
    ): [number, number] {
        const multiplier = Phaser.Math.Between(2, 5);
        return [fraction[0] * multiplier, fraction[1] * multiplier];
    }
}
