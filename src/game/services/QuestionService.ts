import Phaser from "phaser";
import QuestionDTO from "../dto/QuestionDTO";
import WorksheetDTO, { TableData } from "../dto/WorksheetDTO";

export default class QuestionService {
    // Tạo các câu hỏi loại "table"
    createTableQuestions(count: number): QuestionDTO[] {
        const questions: QuestionDTO[] = [];
        for (let i = 0; i < count; i++) {
            const table = this.generateTableDataForExercise1();
            questions.push(new QuestionDTO("table", { table }));
        }
        return questions;
    }

    // Tạo các câu hỏi loại "fraction"
    createFractionQuestions(count: number): QuestionDTO[] {
        const questions: QuestionDTO[] = [];
        for (let i = 0; i < count; i++) {
            const fraction1 = this.generateFraction();
            const isEquivalent = Math.random() > 0.5;
            let fraction2: [number, number];
            if (isEquivalent) {
                fraction2 = this.generateEquivalentFraction(fraction1);
            } else {
                fraction2 = this.generateNonEquivalentFraction(fraction1);
            }
            questions.push(
                new QuestionDTO("fraction", {
                    fraction1: `${fraction1[0]}/${fraction1[1]}`,
                    fraction2: `${fraction2[0]}/${fraction2[1]}`,
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
            questions.push(
                new QuestionDTO("variable", {
                    fraction1: `${fraction1[0]}/${fraction1[1]}`,
                    fraction2: isFirstVariable
                        ? `${variable}/${fraction2[1]}`
                        : `${fraction2[0]}/${variable}`,
                    variable,
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

    // Tạo phân số không tương đương
    private generateNonEquivalentFraction(
        fraction: [number, number]
    ): [number, number] {
        let numerator: number, denominator: number;
        do {
            numerator = Phaser.Math.Between(1, 10);
            denominator = Phaser.Math.Between(1, 10);
        } while (numerator / denominator === fraction[0] / fraction[1]);
        return [numerator, denominator];
    }
}
