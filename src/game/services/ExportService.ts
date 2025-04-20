import { jsPDF } from "jspdf";
import WorksheetScene from "../scenes/WorksheetScene";

export default class ExportService {
    private scene: WorksheetScene;

    constructor(scene: WorksheetScene) {
        this.scene = scene;
    }

    exportToPDF(): void {
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
                const borderOffsetX = this.scene.scale.width * 0.01;
                const borderOffsetY = this.scene.scale.height * 0.01;

                // Lấy chiều cao của khung từ WorksheetScene
                const totalHeight = this.scene.getWorksheetHeight();

                // Tọa độ và kích thước của khung màu đen (bên trong đường viền)
                const containerX = borderOffsetX;
                const containerY = borderOffsetY;
                const containerWidth = this.scene.scale.width * 0.98;
                const containerHeight = totalHeight;

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
}
