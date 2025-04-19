import Phaser from "phaser";
import jsPDF from "jspdf";
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

        // Bài 1: Write two equivalent ratios (3 câu, mỗi câu có 2 bảng)
        const exercise1Questions: QuestionDTO[] = [];
        for (let i = 0; i < 3; i++) {
            const table1 = this.generateTableData();
            const table2 = this.generateEquivalentTableData(table1);
            exercise1Questions.push(
                new QuestionDTO("table", { table1, table2 })
            );
        }
        exercises.push(
            new ExerciseDTO("Write two equivalent ratios", exercise1Questions)
        );

        // Bài 2: Determine whether the ratios are equivalent (6 câu)
        const exercise2Questions: QuestionDTO[] = [];
        for (let i = 0; i < 6; i++) {
            const ratio1Nums = this.generateRatio();
            const isEquivalent = Math.random() > 0.5;
            let ratio2Nums: [number, number];
            if (isEquivalent) {
                ratio2Nums = this.generateEquivalentRatio(ratio1Nums);
            } else {
                ratio2Nums = this.generateNonEquivalentRatio(ratio1Nums);
            }
            exercise2Questions.push(
                new QuestionDTO("ratio", {
                    ratio1: `${ratio1Nums[0]} and ${ratio1Nums[1]}`,
                    ratio2: `${ratio2Nums[0]} and ${ratio2Nums[1]}`,
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
            const ratio1Nums = this.generateRatio();
            const ratio2Nums = this.generateEquivalentRatio(ratio1Nums);
            const variable = variables[i];
            const isFirstVariable = Math.random() > 0.5;
            exercise3Questions.push(
                new QuestionDTO("variable", {
                    ratio1: `${ratio1Nums[0]}:${ratio1Nums[1]}`,
                    ratio2: isFirstVariable
                        ? `${variable}:${ratio2Nums[1]}`
                        : `${ratio2Nums[0]}:${variable}`,
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
        if (!container) {
            console.error("Worksheet container not found");
            return;
        }

        // Chụp toàn bộ scene trước
        this.scene.game.renderer.snapshot(
            (snapshot: Phaser.Display.Color | HTMLImageElement) => {
                if (!(snapshot instanceof HTMLImageElement)) {
                    console.error(
                        "Snapshot is not an HTMLImageElement:",
                        snapshot
                    );
                    return;
                }

                // Lấy kích thước và vị trí của container
                const bounds = container.getBounds();
                const containerX = bounds.x;
                const containerY = bounds.y;
                const containerWidth = bounds.width;
                const containerHeight = bounds.height;

                // Tạo canvas tạm để cắt khu vực của worksheetContainer
                const canvas = document.createElement("canvas");
                canvas.width = containerWidth;
                canvas.height = containerHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    console.error("Cannot get canvas context");
                    return;
                }

                // Cắt khu vực của worksheetContainer từ ảnh chụp toàn bộ scene
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

                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: "a4",
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 20;
                const maxHeightPerPage = pageHeight - margin * 2;

                // Tính tỷ lệ để nội dung vừa với chiều rộng trang A4
                const imgWidth = pageWidth - margin * 2;
                const imgHeight = (containerHeight * imgWidth) / containerWidth;

                // Chia nội dung thành nhiều trang nếu cần
                let remainingHeight = imgHeight;
                let yOffset = 0;

                while (remainingHeight > 0) {
                    const heightToDraw = Math.min(
                        remainingHeight,
                        maxHeightPerPage
                    );
                    const clipHeight =
                        (heightToDraw * containerWidth) / imgWidth;

                    // Tạo canvas tạm để cắt phần ảnh cần vẽ trên trang hiện tại
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
            }
        );
    }

    private generateTableData(): TableData {
        const topLeft = Phaser.Math.Between(1, 10);
        const bottomLeft = Phaser.Math.Between(1, 10);
        const multiplier = Phaser.Math.Between(2, 5);
        return {
            topLeft,
            topRight: topLeft * multiplier,
            bottomLeft,
            bottomRight: bottomLeft * multiplier,
        };
    }

    private generateEquivalentTableData(table1: TableData): TableData {
        const multiplier = Phaser.Math.Between(2, 5);
        return {
            topLeft: table1.topLeft * multiplier,
            topRight: table1.topRight * multiplier,
            bottomLeft: table1.bottomLeft * multiplier,
            bottomRight: table1.bottomRight * multiplier,
        };
    }

    private generateRatio(): [number, number] {
        const num1 = Phaser.Math.Between(1, 10);
        const num2 = Phaser.Math.Between(1, 10);
        return [num1, num2];
    }

    private generateEquivalentRatio(ratio: [number, number]): [number, number] {
        const multiplier = Phaser.Math.Between(2, 5);
        return [ratio[0] * multiplier, ratio[1] * multiplier];
    }

    private generateNonEquivalentRatio(
        ratio: [number, number]
    ): [number, number] {
        let num1: number, num2: number;
        do {
            num1 = Phaser.Math.Between(1, 10);
            num2 = Phaser.Math.Between(1, 10);
        } while (num1 / num2 === ratio[0] / ratio[1]);
        return [num1, num2];
    }
}
