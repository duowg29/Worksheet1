import Phaser from "phaser";
import QuestionDTO from "../dto/QuestionDTO";

export default class QuestionView {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private answerObjects: Phaser.GameObjects.Text[] = []; // Lưu trữ các đối tượng văn bản của đáp án

    constructor(scene: Phaser.Scene, container: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.container = container;
    }

    // Hiển thị hoặc ẩn đáp án
    toggleAnswers(show: boolean): void {
        this.answerObjects.forEach((obj) => obj.setVisible(show));
    }

    drawTableQuestion(
        x: number,
        y: number,
        questionNumber: number,
        question: QuestionDTO,
        width: number,
        height: number
    ): void {
        this.container.add(
            this.scene.add
                .text(
                    x - this.scene.scale.width * 0.03,
                    y,
                    `${questionNumber})`,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );

        const tableData = question.getTable();
        if (tableData) {
            this.drawTable3x2(x, y, width, height, tableData, question);
        } else {
            console.warn(
                `Table data is undefined for question ${questionNumber}`
            );
        }
    }

    drawFractionQuestion(
        x: number,
        y: number,
        questionNumber: number,
        question: QuestionDTO
    ): void {
        const fraction1 = question.getFraction1() || "";
        const fraction2 = question.getFraction2() || "";

        const [numerator1, denominator1] = fraction1
            .split("/")
            .map((val) => val || "");
        const [numerator2, denominator2] = fraction2
            .split("/")
            .map((val) => val || "");

        this.container.add(
            this.scene.add
                .text(
                    x,
                    y - this.scene.scale.height * 0.01,
                    `${questionNumber})`,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );

        const fraction1X = x + this.scene.scale.width * 0.05;
        this.container.add(
            this.scene.add
                .text(
                    fraction1X,
                    y - this.scene.scale.height * 0.01,
                    numerator1,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction1X - this.scene.scale.width * 0.015,
            y,
            this.scene.scale.width * 0.03
        );
        this.container.add(
            this.scene.add
                .text(
                    fraction1X,
                    y + this.scene.scale.height * 0.01,
                    denominator1,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );

        this.container.add(
            this.scene.add
                .text(fraction1X + this.scene.scale.width * 0.04, y, "and", {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        const fraction2X = fraction1X + this.scene.scale.width * 0.08;
        this.container.add(
            this.scene.add
                .text(
                    fraction2X,
                    y - this.scene.scale.height * 0.01,
                    numerator2,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction2X - this.scene.scale.width * 0.015,
            y,
            this.scene.scale.width * 0.03
        );
        this.container.add(
            this.scene.add
                .text(
                    fraction2X,
                    y + this.scene.scale.height * 0.01,
                    denominator2,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );

        this.drawLine(
            fraction2X + this.scene.scale.width * 0.03,
            y + this.scene.scale.height * 0.01,
            this.scene.scale.width * 0.04
        );

        // Hiển thị đáp án (ban đầu ẩn)
        const answerText = this.scene.add
            .text(
                fraction2X + this.scene.scale.width * 0.05,
                y,
                question.getAnswer(),
                {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#FF0000", // Màu đỏ để phân biệt đáp án
                }
            )
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.container.add(answerText);
        this.answerObjects.push(answerText);
    }

    drawVariableQuestion(
        x: number,
        y: number,
        questionNumber: number,
        question: QuestionDTO
    ): void {
        const fraction1 = question.getFraction1() || "";
        const fraction2 = question.getFraction2() || "";
        const variable = question.getVariable() || "";

        const [numerator1, denominator1] = fraction1
            .split("/")
            .map((val) => val || "");
        const [numerator2, denominator2] = fraction2
            .split("/")
            .map((val) => val || "");

        this.container.add(
            this.scene.add
                .text(
                    x,
                    y - this.scene.scale.height * 0.01,
                    `${questionNumber})`,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );

        const fraction1X = x + this.scene.scale.width * 0.06;
        this.container.add(
            this.scene.add
                .text(
                    fraction1X,
                    y - this.scene.scale.height * 0.01,
                    numerator1,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction1X - this.scene.scale.width * 0.015,
            y,
            this.scene.scale.width * 0.03
        );
        this.container.add(
            this.scene.add
                .text(
                    fraction1X,
                    y + this.scene.scale.height * 0.01,
                    denominator1,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );

        this.container.add(
            this.scene.add
                .text(fraction1X + this.scene.scale.width * 0.03, y, "=", {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        const fraction2X = fraction1X + this.scene.scale.width * 0.06;
        this.container.add(
            this.scene.add
                .text(
                    fraction2X,
                    y - this.scene.scale.height * 0.01,
                    numerator2,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction2X - this.scene.scale.width * 0.015,
            y,
            this.scene.scale.width * 0.03
        );
        this.container.add(
            this.scene.add
                .text(
                    fraction2X,
                    y + this.scene.scale.height * 0.01,
                    denominator2,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );

        const variableX = fraction2X + this.scene.scale.width * 0.04;
        this.container.add(
            this.scene.add
                .text(variableX, y, variable, {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.container.add(
            this.scene.add
                .text(variableX + this.scene.scale.width * 0.02, y, "=", {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            variableX + this.scene.scale.width * 0.03,
            y + this.scene.scale.height * 0.005,
            this.scene.scale.width * 0.04
        );

        // Hiển thị đáp án (ban đầu ẩn)
        const answerText = this.scene.add
            .text(
                variableX + this.scene.scale.width * 0.05,
                y - this.scene.scale.height * 0.005,
                question.getAnswer(),
                {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#FF0000", // Màu đỏ để phân biệt đáp án
                }
            )
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.container.add(answerText);
        this.answerObjects.push(answerText);
    }

    private drawTable3x2(
        x: number,
        y: number,
        width: number,
        height: number,
        data: {
            topLeft: number | string;
            topMiddle?: number | string;
            topRight?: number | string;
            bottomLeft: number | string;
            bottomMiddle?: number | string;
            bottomRight?: number | string;
        },
        question: QuestionDTO
    ): void {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.strokeRect(x, y, width * 3, height * 2);
        graphics.strokeLineShape(
            new Phaser.Geom.Line(x, y + height, x + width * 3, y + height)
        );
        graphics.strokeLineShape(
            new Phaser.Geom.Line(x + width, y, x + width, y + height * 2)
        );
        graphics.strokeLineShape(
            new Phaser.Geom.Line(
                x + width * 2,
                y,
                x + width * 2,
                y + height * 2
            )
        );

        this.container.add(graphics);

        this.container.add(
            this.scene.add
                .text(x + width / 2, y + height / 2, data.topLeft.toString(), {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.018}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        const answer = question.getAnswer();
        // Hiển thị đáp án (ban đầu ẩn)
        const topMiddleText = this.scene.add
            .text(
                x + width * 1.5,
                y + height / 2,
                answer.topMiddle.toString(),
                {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.018}px`,
                    color: "#FF0000", // Màu đỏ để phân biệt đáp án
                }
            )
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.container.add(topMiddleText);
        this.answerObjects.push(topMiddleText);

        const topRightText = this.scene.add
            .text(x + width * 2.5, y + height / 2, answer.topRight.toString(), {
                fontFamily: "Nunito",
                fontSize: `${this.scene.scale.width * 0.018}px`,
                color: "#FF0000",
            })
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.container.add(topRightText);
        this.answerObjects.push(topRightText);

        this.container.add(
            this.scene.add
                .text(
                    x + width / 2,
                    y + height * 1.5,
                    data.bottomLeft.toString(),
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.018}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );

        const bottomMiddleText = this.scene.add
            .text(
                x + width * 1.5,
                y + height * 1.5,
                answer.bottomMiddle.toString(),
                {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.018}px`,
                    color: "#FF0000",
                }
            )
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.container.add(bottomMiddleText);
        this.answerObjects.push(bottomMiddleText);

        const bottomRightText = this.scene.add
            .text(
                x + width * 2.5,
                y + height * 1.5,
                answer.bottomRight.toString(),
                {
                    fontFamily: "Nunito",
                    fontSize: `${this.scene.scale.width * 0.018}px`,
                    color: "#FF0000",
                }
            )
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.container.add(bottomRightText);
        this.answerObjects.push(bottomRightText);
    }

    private drawLine(x: number, y: number, length: number): void {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x + length, y);
        graphics.strokePath();
        this.container.add(graphics);
    }
}
