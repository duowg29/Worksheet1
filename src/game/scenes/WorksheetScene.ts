import Phaser from "phaser";
import WorksheetController from "../controllers/WorksheetController";
import WorksheetDTO from "../dto/WorksheetDTO";
import ExerciseDTO from "../dto/ExerciseDTO";
import QuestionDTO from "../dto/QuestionDTO";

// Tải font Roboto từ Google Fonts
const loadFont = () => {
    const link = document.createElement("link");
    link.href =
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
};

export default class WorksheetScene extends Phaser.Scene {
    private worksheetController: WorksheetController;
    private worksheetContainer: Phaser.GameObjects.Container | null = null;
    private buttonContainer: Phaser.GameObjects.Container | null = null;
    private worksheetHeight: number = 0; // Thêm thuộc tính để lưu chiều cao của khung

    constructor() {
        super({ key: "WorksheetScene" });
    }

    preload(): void {
        loadFont();
    }

    create(): void {
        this.worksheetController = new WorksheetController(this);
        this.createWorksheet();

        this.buttonContainer = this.add.container(0, 0);

        const createButton = this.add
            .text(
                this.scale.width * 0.78,
                this.scale.height * 0.95,
                "Create Worksheet",
                {
                    fontFamily: "Roboto",
                    fontSize: "18px",
                    color: "#ffffff",
                    backgroundColor: "#4A90E2",
                    padding: { left: 20, right: 20, top: 10, bottom: 10 },
                    fixedWidth: this.scale.width * 0.15,
                    fixedHeight: this.scale.height * 0.04,
                    align: "center",
                }
            )
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerdown", () => this.createWorksheet());

        const exportButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.95, "Export", {
                fontFamily: "Roboto",
                fontSize: "18px",
                color: "#ffffff",
                backgroundColor: "#4A90E2",
                padding: { left: 20, right: 20, top: 10, bottom: 10 },
                fixedWidth: this.scale.width * 0.15,
                fixedHeight: this.scale.height * 0.04,
                align: "center",
            })
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerdown", () => this.worksheetController.exportToPDF());

        this.buttonContainer.add([createButton, exportButton]);
    }

    public getWorksheetContainer(): Phaser.GameObjects.Container | null {
        return this.worksheetContainer;
    }

    public getButtonContainer(): Phaser.GameObjects.Container | null {
        return this.buttonContainer;
    }

    public getWorksheetHeight(): number {
        return this.worksheetHeight;
    }

    private createWorksheet(): void {
        if (this.worksheetContainer) {
            this.worksheetContainer.destroy();
        }

        this.worksheetContainer = this.add.container(0, 0);

        let yOffset = this.scale.height * 0.03;

        const worksheet: WorksheetDTO =
            this.worksheetController.createWorksheet();

        this.drawHeader(yOffset);
        yOffset += this.scale.height * 0.08;

        this.worksheetContainer.add(
            this.add
                .text(this.scale.width * 0.5, yOffset, "Equivalent Ratios", {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.035}px`,
                    color: "#000",
                    fontStyle: "bold",
                })
                .setOrigin(0.5, 0)
        );
        yOffset += this.scale.height * 0.05;

        worksheet.exercises.forEach((exercise: ExerciseDTO, index: number) => {
            yOffset = this.drawExercise(exercise, index + 1, yOffset);
            if (index < worksheet.exercises.length - 1) {
                yOffset += this.scale.height * 0.02;
                this.drawHorizontalLine(yOffset);
                yOffset += this.scale.height * 0.03;
            }
        });

        this.worksheetContainer.setPosition(0, 0);

        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(
            this.scale.width * 0.01,
            this.scale.height * 0.01,
            this.scale.width * 0.98,
            yOffset + this.scale.height * 0.02
        );
        this.worksheetContainer.add(border);

        // Lưu chiều cao của khung
        this.worksheetHeight = yOffset + this.scale.height * 0.02;
    }

    private drawHeader(yOffset: number): void {
        const xStart = this.scale.width * 0.15;
        const labelWidth = this.scale.width * 0.1;
        const fieldWidth = this.scale.width * 0.25;
        const lineHeight = this.scale.height * 0.02;

        this.worksheetContainer!.add(
            this.add
                .text(xStart, yOffset, "Name:", {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0, 0)
        );
        this.drawLine(xStart + labelWidth, yOffset + lineHeight, fieldWidth);

        this.worksheetContainer!.add(
            this.add
                .text(
                    xStart + labelWidth + fieldWidth + this.scale.width * 0.05,
                    yOffset,
                    "Score:",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth * 2 + fieldWidth + this.scale.width * 0.05,
            yOffset + lineHeight,
            fieldWidth
        );

        this.worksheetContainer!.add(
            this.add
                .text(
                    xStart,
                    yOffset + lineHeight + this.scale.height * 0.01,
                    "Teacher:",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth,
            yOffset + lineHeight * 2 + this.scale.height * 0.01,
            fieldWidth
        );

        this.worksheetContainer!.add(
            this.add
                .text(
                    xStart + labelWidth + fieldWidth + this.scale.width * 0.05,
                    yOffset + lineHeight + this.scale.height * 0.01,
                    "Date:",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth * 2 + fieldWidth + this.scale.width * 0.05,
            yOffset + lineHeight * 2 + this.scale.height * 0.01,
            fieldWidth
        );
    }

    private drawExercise(
        exercise: ExerciseDTO,
        exerciseNumber: number,
        yOffset: number
    ): number {
        this.worksheetContainer!.add(
            this.add
                .text(
                    this.scale.width * 0.05,
                    yOffset,
                    `${exerciseNumber}. ${exercise.getTitle()}`,
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.025}px`,
                        color: "#000",
                        fontStyle: "bold",
                    }
                )
                .setOrigin(0, 0)
        );
        yOffset += this.scale.height * 0.04;

        let maxYOffset = yOffset;

        exercise.questions.forEach((question: QuestionDTO, index: number) => {
            if (question.getType() === "table") {
                const tableWidth = this.scale.width * 0.05;
                const tableHeight = this.scale.height * 0.03;
                const xStart =
                    this.scale.width * 0.05 +
                    (index % 3) * this.scale.width * 0.25;
                const yStart =
                    yOffset + Math.floor(index / 3) * this.scale.height * 0.08;

                this.worksheetContainer!.add(
                    this.add
                        .text(
                            xStart - this.scale.width * 0.03,
                            yStart,
                            `${index + 1})`,
                            {
                                fontFamily: "Roboto",
                                fontSize: `${this.scale.width * 0.02}px`,
                                color: "#000",
                            }
                        )
                        .setOrigin(0, 0)
                );

                const tableData = question.getTable();
                if (tableData) {
                    this.drawTable3x2(
                        xStart,
                        yStart,
                        tableWidth,
                        tableHeight,
                        tableData
                    );
                } else {
                    console.warn(
                        `Table data is undefined for question ${index + 1}`
                    );
                }

                const tableSectionHeight =
                    yStart + tableHeight + this.scale.height * 0.02;
                maxYOffset = Math.max(maxYOffset, tableSectionHeight);

                if (index % 3 === 2) {
                    yOffset += this.scale.height * 0.08;
                }
            } else if (question.getType() === "fraction") {
                const xStart =
                    this.scale.width * 0.05 +
                    (index % 3) * this.scale.width * 0.25;
                const yStart =
                    yOffset + Math.floor(index / 3) * this.scale.height * 0.05;

                this.drawFractionQuestion(xStart, yStart, index + 7, question);

                const sectionHeight = yStart + this.scale.height * 0.04;
                maxYOffset = Math.max(maxYOffset, sectionHeight);

                if (index % 3 === 2) {
                    yOffset += this.scale.height * 0.05;
                }
            } else if (question.getType() === "variable") {
                const xStart =
                    this.scale.width * 0.05 +
                    (index % 3) * this.scale.width * 0.25;
                const yStart =
                    yOffset + Math.floor(index / 3) * this.scale.height * 0.05;

                this.drawVariableQuestion(xStart, yStart, index + 13, question);

                const sectionHeight = yStart + this.scale.height * 0.04;
                maxYOffset = Math.max(maxYOffset, sectionHeight);

                if (index % 3 === 2) {
                    yOffset += this.scale.height * 0.05;
                }
            }
        });

        return maxYOffset;
    }

    private drawFractionQuestion(
        x: number,
        y: number,
        questionNumber: number,
        question: QuestionDTO
    ): void {
        const fraction1 = question.getFraction1() || "";
        const fraction2 = question.getFraction2() || "";

        // Tách tử số và mẫu số
        const [numerator1, denominator1] = fraction1
            .split("/")
            .map((val) => val || "");
        const [numerator2, denominator2] = fraction2
            .split("/")
            .map((val) => val || "");

        // Hiển thị số câu hỏi
        this.worksheetContainer!.add(
            this.add
                .text(x, y, `${questionNumber})`, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0, 0)
        );

        // Hiển thị phân số 1
        const fraction1X = x + this.scale.width * 0.03;
        this.worksheetContainer!.add(
            this.add
                .text(fraction1X, y - this.scale.height * 0.01, numerator1, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction1X - this.scale.width * 0.015,
            y,
            this.scale.width * 0.03
        );
        this.worksheetContainer!.add(
            this.add
                .text(fraction1X, y + this.scale.height * 0.01, denominator1, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        // Hiển thị "and"
        this.worksheetContainer!.add(
            this.add
                .text(fraction1X + this.scale.width * 0.03, y, "and", {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        // Hiển thị phân số 2
        const fraction2X = fraction1X + this.scale.width * 0.06;
        this.worksheetContainer!.add(
            this.add
                .text(fraction2X, y - this.scale.height * 0.01, numerator2, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction2X - this.scale.width * 0.015,
            y,
            this.scale.width * 0.03
        );
        this.worksheetContainer!.add(
            this.add
                .text(fraction2X, y + this.scale.height * 0.01, denominator2, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        // Hiển thị dấu "______"
        this.drawLine(
            fraction2X + this.scale.width * 0.03,
            y,
            this.scale.width * 0.04
        );
    }

    private drawVariableQuestion(
        x: number,
        y: number,
        questionNumber: number,
        question: QuestionDTO
    ): void {
        const fraction1 = question.getFraction1() || "";
        const fraction2 = question.getFraction2() || "";
        const variable = question.getVariable() || "";

        // Tách tử số và mẫu số
        const [numerator1, denominator1] = fraction1
            .split("/")
            .map((val) => val || "");
        const [numerator2, denominator2] = fraction2
            .split("/")
            .map((val) => val || "");

        // Hiển thị số câu hỏi
        this.worksheetContainer!.add(
            this.add
                .text(x, y, `${questionNumber})`, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0, 0)
        );

        // Hiển thị phân số 1
        const fraction1X = x + this.scale.width * 0.03;
        this.worksheetContainer!.add(
            this.add
                .text(fraction1X, y - this.scale.height * 0.01, numerator1, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction1X - this.scale.width * 0.015,
            y,
            this.scale.width * 0.03
        );
        this.worksheetContainer!.add(
            this.add
                .text(fraction1X, y + this.scale.height * 0.01, denominator1, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        // Hiển thị dấu "="
        this.worksheetContainer!.add(
            this.add
                .text(fraction1X + this.scale.width * 0.03, y, "=", {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        // Hiển thị phân số 2 (chứa biến)
        const fraction2X = fraction1X + this.scale.width * 0.06;
        this.worksheetContainer!.add(
            this.add
                .text(fraction2X, y - this.scale.height * 0.01, numerator2, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            fraction2X - this.scale.width * 0.015,
            y,
            this.scale.width * 0.03
        );
        this.worksheetContainer!.add(
            this.add
                .text(fraction2X, y + this.scale.height * 0.01, denominator2, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );

        // Hiển thị phần "r = _____"
        const variableX = fraction2X + this.scale.width * 0.04;
        this.worksheetContainer!.add(
            this.add
                .text(variableX, y, variable, {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(variableX + this.scale.width * 0.02, y, "=", {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.drawLine(
            variableX + this.scale.width * 0.03,
            y,
            this.scale.width * 0.04
        );
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
        }
    ): void {
        const graphics = this.add.graphics();
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

        this.worksheetContainer!.add(graphics);

        this.worksheetContainer!.add(
            this.add
                .text(x + width / 2, y + height / 2, data.topLeft.toString(), {
                    fontFamily: "Roboto",
                    fontSize: `${this.scale.width * 0.018}px`,
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + width * 1.5,
                    y + height / 2,
                    (data.topMiddle || "").toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.018}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + width * 2.5,
                    y + height / 2,
                    (data.topRight || "").toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.018}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + width / 2,
                    y + height * 1.5,
                    data.bottomLeft.toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.018}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + width * 1.5,
                    y + height * 1.5,
                    (data.bottomMiddle || "").toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.018}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + width * 2.5,
                    y + height * 1.5,
                    (data.bottomRight || "").toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scale.width * 0.018}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
    }

    private drawLine(x: number, y: number, length: number): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x + length, y);
        graphics.strokePath();
        this.worksheetContainer!.add(graphics);
    }

    private drawHorizontalLine(y: number): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.beginPath();
        graphics.moveTo(this.scale.width * 0.05, y);
        graphics.lineTo(this.scale.width * 0.95, y);
        graphics.strokePath();
        this.worksheetContainer!.add(graphics);
    }
}
