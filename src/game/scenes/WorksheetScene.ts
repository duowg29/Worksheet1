import Phaser from "phaser";
import WorksheetController from "../controllers/WorksheetController";
import WorksheetDTO from "../dto/WorksheetDTO";
import ExerciseDTO from "../dto/ExerciseDTO";

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

    constructor() {
        super({ key: "WorksheetScene" });
    }

    preload(): void {
        // Tải font trước khi render
        loadFont();
    }

    create(): void {
        this.worksheetController = new WorksheetController(this);
        this.createWorksheet();

        // Tạo buttonContainer để chứa các nút (nằm ngoài phần được in)
        this.buttonContainer = this.add.container(0, 0);

        // Thêm nút "Create Worksheet"
        const createButton = this.add
            .text(
                this.scale.width - 350,
                this.scale.height - 70,
                "Create Worksheet",
                {
                    fontFamily: "Roboto",
                    fontSize: "18px",
                    color: "#ffffff",
                    backgroundColor: "#4A90E2",
                    padding: { left: 20, right: 20, top: 10, bottom: 10 },
                    fixedWidth: 160,
                    fixedHeight: 49,
                    align: "center",
                }
            )
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerdown", () => this.createWorksheet());

        // Thêm nút "Export"
        const exportButton = this.add
            .text(this.scale.width - 170, this.scale.height - 70, "Export", {
                fontFamily: "Roboto",
                fontSize: "18px",
                color: "#ffffff",
                backgroundColor: "#4A90E2",
                padding: { left: 20, right: 20, top: 10, bottom: 10 },
                fixedWidth: 160,
                fixedHeight: 49,
                align: "center",
            })
            .setInteractive()
            .setOrigin(0.5, 0.5)
            .on("pointerdown", () => this.worksheetController.exportToPDF());

        // Thêm các nút vào buttonContainer
        this.buttonContainer.add([createButton, exportButton]);
    }

    public getWorksheetContainer(): Phaser.GameObjects.Container | null {
        return this.worksheetContainer;
    }

    private createWorksheet(): void {
        if (this.worksheetContainer) {
            this.worksheetContainer.destroy();
        }

        this.worksheetContainer = this.add.container(0, 0);

        let yOffset = 40;

        // Khai báo worksheet với kiểu WorksheetDTO
        const worksheet: WorksheetDTO =
            this.worksheetController.createWorksheet();

        // Vẽ thông tin đầu trang
        this.drawHeader(yOffset);
        yOffset += 100; // Tăng khoảng cách sau header

        // Vẽ tiêu đề
        this.worksheetContainer.add(
            this.add
                .text(this.scale.width / 2, yOffset, "EQUIVALENT RATIOS", {
                    fontFamily: "Roboto",
                    fontSize: "32px",
                    color: "#000",
                    fontStyle: "bold",
                })
                .setOrigin(0.5, 0)
        );
        yOffset += 80; // Tăng khoảng cách sau tiêu đề

        // Vẽ các bài tập
        worksheet.exercises.forEach((exercise: ExerciseDTO, index: number) => {
            yOffset = this.drawExercise(exercise, index + 1, yOffset);
            yOffset += 60; // Tăng khoảng cách giữa các bài tập
        });

        // Đảm bảo container nằm trong tầm nhìn
        this.worksheetContainer.setPosition(0, 0);

        // Thêm border quanh phần được in
        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(5, 5, this.scale.width - 10, yOffset + 20); // Chiều cao border bao gồm toàn bộ nội dung
        this.worksheetContainer.add(border);
    }

    private drawHeader(yOffset: number): void {
        const xStart = 70;
        const labelWidth = 80;
        const fieldWidth = 200;
        const lineHeight = 24;

        // Name
        this.worksheetContainer!.add(
            this.add
                .text(xStart, yOffset, "Name:", {
                    fontFamily: "Roboto",
                    fontSize: "18px",
                    color: "#000",
                })
                .setOrigin(0, 0)
        );
        this.drawLine(xStart + labelWidth, yOffset + lineHeight, fieldWidth);

        // Teacher
        this.worksheetContainer!.add(
            this.add
                .text(
                    xStart + labelWidth + fieldWidth + 70,
                    yOffset,
                    "Teacher:",
                    {
                        fontFamily: "Roboto",
                        fontSize: "18px",
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth * 2 + fieldWidth + 70,
            yOffset + lineHeight,
            fieldWidth
        );

        // Score
        this.worksheetContainer!.add(
            this.add
                .text(xStart, yOffset + lineHeight + 10, "Score:", {
                    fontFamily: "Roboto",
                    fontSize: "18px",
                    color: "#000",
                })
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth,
            yOffset + lineHeight * 2 + 10,
            fieldWidth
        );

        // Date
        this.worksheetContainer!.add(
            this.add
                .text(
                    xStart + labelWidth + fieldWidth + 70,
                    yOffset + lineHeight + 10,
                    "Date:",
                    {
                        fontFamily: "Roboto",
                        fontSize: "18px",
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth * 2 + fieldWidth + 70,
            yOffset + lineHeight * 2 + 10,
            fieldWidth
        );
    }

    private drawExercise(
        exercise: ExerciseDTO,
        exerciseNumber: number,
        yOffset: number
    ): number {
        // Vẽ tiêu đề bài tập
        this.worksheetContainer!.add(
            this.add
                .text(70, yOffset, `${exerciseNumber}. ${exercise.title}`, {
                    fontFamily: "Roboto",
                    fontSize: "20px",
                    color: "#000",
                    fontStyle: "bold",
                })
                .setOrigin(0, 0)
        );
        yOffset += 50; // Tăng khoảng cách sau tiêu đề bài tập

        let maxYOffset = yOffset; // Theo dõi yOffset lớn nhất để tránh chồng lấn

        // Vẽ các câu hỏi
        exercise.questions.forEach((question, index) => {
            if (question.type === "table") {
                // Bài 1: Bảng 2x2
                const tableWidth = 70;
                const tableHeight = 70;
                const xStart = 70 + (index % 3) * 250; // Căn chỉnh đều các bảng
                const yStart = yOffset + Math.floor(index / 3) * 120;

                this.worksheetContainer!.add(
                    this.add
                        .text(xStart - 30, yStart, `${index + 1})`, {
                            fontFamily: "Roboto",
                            fontSize: "18px",
                            color: "#000",
                        })
                        .setOrigin(0, 0)
                );

                // Bảng 1
                this.drawTable(
                    xStart,
                    yStart,
                    tableWidth,
                    tableHeight,
                    question.table1!
                );
                // Bảng 2
                this.drawTable(
                    xStart + 120,
                    yStart,
                    tableWidth,
                    tableHeight,
                    question.table2!
                );

                // Cập nhật yOffset lớn nhất
                const tableSectionHeight = yStart + tableHeight + 20;
                maxYOffset = Math.max(maxYOffset, tableSectionHeight);

                if (index % 3 === 2) {
                    yOffset += 120; // Tăng yOffset sau mỗi hàng 3 bảng
                }
            } else if (question.type === "ratio") {
                // Bài 2: Tỷ lệ
                const xStart = 70;
                const yStart = yOffset + index * 50; // Tăng khoảng cách giữa các câu hỏi

                this.worksheetContainer!.add(
                    this.add
                        .text(
                            xStart,
                            yStart,
                            `${index + 7}) ${question.ratio1} ______ ${
                                question.ratio2
                            }`,
                            {
                                fontFamily: "Roboto",
                                fontSize: "18px",
                                color: "#000",
                            }
                        )
                        .setOrigin(0, 0)
                );
                this.drawLine(xStart + 120, yStart + 24, 80);

                // Cập nhật yOffset lớn nhất
                maxYOffset = Math.max(maxYOffset, yStart + 50);
            } else if (question.type === "variable") {
                // Bài 3: Biến số
                const xStart = 70;
                const yStart = yOffset + index * 50; // Tăng khoảng cách giữa các câu hỏi

                this.worksheetContainer!.add(
                    this.add
                        .text(
                            xStart,
                            yStart,
                            `${index + 13}) ${question.ratio1} = ${
                                question.ratio2
                            } ______ =`,
                            {
                                fontFamily: "Roboto",
                                fontSize: "18px",
                                color: "#000",
                            }
                        )
                        .setOrigin(0, 0)
                );
                this.drawLine(xStart + 180, yStart + 24, 80);

                // Cập nhật yOffset lớn nhất
                maxYOffset = Math.max(maxYOffset, yStart + 50);
            }
        });

        // Trả về yOffset lớn nhất để đảm bảo không chồng lấn
        return maxYOffset;
    }

    private drawTable(
        x: number,
        y: number,
        width: number,
        height: number,
        data: {
            topLeft: number;
            topRight: number;
            bottomLeft: number;
            bottomRight: number;
        }
    ): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.strokeRect(x, y, width, height);
        graphics.strokeLineShape(
            new Phaser.Geom.Line(x, y + height / 2, x + width, y + height / 2)
        );
        graphics.strokeLineShape(
            new Phaser.Geom.Line(x + width / 2, y, x + width / 2, y + height)
        );

        this.worksheetContainer!.add(graphics);

        this.worksheetContainer!.add(
            this.add
                .text(x + width / 4, y + height / 4, data.topLeft.toString(), {
                    fontFamily: "Roboto",
                    fontSize: "16px",
                    color: "#000",
                })
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + (3 * width) / 4,
                    y + height / 4,
                    data.topRight.toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: "16px",
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + width / 4,
                    y + (3 * height) / 4,
                    data.bottomLeft.toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: "16px",
                        color: "#000",
                    }
                )
                .setOrigin(0.5, 0.5)
        );
        this.worksheetContainer!.add(
            this.add
                .text(
                    x + (3 * width) / 4,
                    y + (3 * height) / 4,
                    data.bottomRight.toString(),
                    {
                        fontFamily: "Roboto",
                        fontSize: "16px",
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
}
