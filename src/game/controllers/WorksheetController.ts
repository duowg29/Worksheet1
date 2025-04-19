import Phaser from "phaser";
import { jsPDF } from "jspdf";
import WorksheetDTO, { TableData } from "../dto/WorksheetDTO";
import ExerciseDTO from "../dto/ExerciseDTO";
import QuestionDTO from "../dto/QuestionDTO";
import WorksheetScene from "../scenes/WorksheetScene";

export default class WorksheetController {
    private scene: WorksheetScene;
    private worksheet: WorksheetDTO | null = null;

    constructor(scene: WorksheetScene) {
        this.scene = scene;
    }

    createWorksheet(): WorksheetDTO {
        const exercises: ExerciseDTO[] = [];

        // Bài 1: Write two equivalent ratios (6 câu, mỗi câu có 1 bảng 3x2)
        const exercise1Questions: QuestionDTO[] = [];
        for (let i = 0; i < 6; i++) {
            const table = this.generateTableDataForExercise1();
            exercise1Questions.push(new QuestionDTO("table", { table }));
        }
        exercises.push(
            new ExerciseDTO("Write two equivalent ratios", exercise1Questions)
        );

        // Bài 2: Determine whether the ratios are equivalent (6 câu)
        const exercise2Questions: QuestionDTO[] = [];
        for (let i = 0; i < 6; i++) {
            const fraction1 = this.generateFraction();
            const isEquivalent = Math.random() > 0.5;
            let fraction2: [number, number];
            if (isEquivalent) {
                fraction2 = this.generateEquivalentFraction(fraction1);
            } else {
                fraction2 = this.generateNonEquivalentFraction(fraction1);
            }
            exercise2Questions.push(
                new QuestionDTO("fraction", {
                    fraction1: `${fraction1[0]}/${fraction1[1]}`,
                    fraction2: `${fraction2[0]}/${fraction2[1]}`,
                })
            );
        }
        exercises.push(
            new ExerciseDTO(
                "Determine whether the ratios are equivalent",
                exercise2Questions
            )
        );

        // Bài 3: Use equivalent ratios to find the unknown value (6 câu)
        const exercise3Questions: QuestionDTO[] = [];
        const variables = ["x", "y", "z", "r", "s", "t"];
        for (let i = 0; i < 6; i++) {
            const fraction1 = this.generateFraction();
            const fraction2 = this.generateEquivalentFraction(fraction1);
            const variable = variables[i];
            const isFirstVariable = Math.random() > 0.5;
            exercise3Questions.push(
                new QuestionDTO("variable", {
                    fraction1: `${fraction1[0]}/${fraction1[1]}`,
                    fraction2: isFirstVariable
                        ? `${variable}/${fraction2[1]}`
                        : `${fraction2[0]}/${variable}`,
                    variable,
                })
            );
        }
        exercises.push(
            new ExerciseDTO(
                "Use equivalent ratios to find the unknown value",
                exercise3Questions
            )
        );

        this.worksheet = new WorksheetDTO("", "", "", "", exercises);
        return this.worksheet;
    }

    exportToPDF(): void {
        if (!this.worksheet) return;

        const container = this.scene.getWorksheetContainer();
        const buttonContainer = this.scene.getButtonContainer();
        if (!container) {
            console.error("Worksheet container not found");
            return;
        }

        // Ẩn buttonContainer trước khi chụp ảnh
        if (buttonContainer) {
            buttonContainer.setVisible(false);
        }

        this.scene.game.renderer.snapshot(
            (snapshot: Phaser.Display.Color | HTMLImageElement) => {
                if (!(snapshot instanceof HTMLImageElement)) {
                    console.error(
                        "Snapshot is not an HTMLImageElement:",
                        snapshot
                    );
                    // Khôi phục buttonContainer nếu có lỗi
                    if (buttonContainer) {
                        buttonContainer.setVisible(true);
                    }
                    return;
                }

                // Tính toán tọa độ và kích thước của khung màu đen
                const borderOffsetX = this.scene.scale.width * 0.01; // Khoảng cách từ mép trái/phải của đường viền
                const borderOffsetY = this.scene.scale.height * 0.01; // Khoảng cách từ mép trên của đường viền

                // Lấy chiều cao của khung từ WorksheetScene
                const totalHeight = this.scene.getWorksheetHeight();

                // Tọa độ và kích thước của khung màu đen (bên trong đường viền)
                const containerX = borderOffsetX; // Điều chỉnh để loại bỏ viền đen
                const containerY = borderOffsetY; // Điều chỉnh để loại bỏ viền đen
                const containerWidth = this.scene.scale.width * 0.98; // Trừ đi độ dày viền ở cả hai bên
                const containerHeight = totalHeight; // Trừ đi độ dày viền ở trên và dưới

                // Tạo canvas để cắt nội dung bên trong khung màu đen
                const canvas = document.createElement("canvas");
                canvas.width = containerWidth;
                canvas.height = containerHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    console.error("Cannot get canvas context");
                    // Khôi phục buttonContainer nếu có lỗi
                    if (buttonContainer) {
                        buttonContainer.setVisible(true);
                    }
                    return;
                }

                // Cắt nội dung từ snapshot
                ctx.drawImage(
                    snapshot,
                    containerX,
                    containerY,
                    containerWidth,
                    containerHeight,
                    0,
                    0,
                    containerWidth,
                    containerHeight
                );

                // Tạo PDF từ canvas
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: "a4",
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 20;
                const maxHeightPerPage = pageHeight - margin * 2;

                const imgWidth = pageWidth - margin * 2;
                const imgHeight = (containerHeight * imgWidth) / containerWidth;

                let remainingHeight = imgHeight;
                let yOffset = 0;

                while (remainingHeight > 0) {
                    const heightToDraw = Math.min(
                        remainingHeight,
                        maxHeightPerPage
                    );
                    const clipHeight =
                        (heightToDraw * containerWidth) / imgWidth;

                    const pageCanvas = document.createElement("canvas");
                    pageCanvas.width = containerWidth;
                    pageCanvas.height = clipHeight;
                    const pageCtx = pageCanvas.getContext("2d");
                    if (pageCtx) {
                        pageCtx.drawImage(
                            canvas,
                            0,
                            yOffset,
                            containerWidth,
                            clipHeight,
                            0,
                            0,
                            containerWidth,
                            clipHeight
                        );
                        pdf.addImage(
                            pageCanvas.toDataURL("image/png"),
                            "PNG",
                            margin,
                            margin,
                            imgWidth,
                            heightToDraw
                        );
                    }

                    remainingHeight -= heightToDraw;
                    yOffset += clipHeight;

                    if (remainingHeight > 0) {
                        pdf.addPage();
                    }
                }

                pdf.save("equivalent_ratios_worksheet.pdf");

                // Khôi phục buttonContainer sau khi chụp ảnh
                if (buttonContainer) {
                    buttonContainer.setVisible(true);
                }
            }
        );
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
