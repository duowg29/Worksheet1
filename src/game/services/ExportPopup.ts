import Phaser from "phaser";
import { BasePopup } from "mct-common";
import { GraphicsButton } from "mct-common";

export default class ExportPopup extends BasePopup {
    private onExportCallback: (fileName: string, format: string) => void;
    private fileNameInput: Phaser.GameObjects.DOMElement;
    private selectedFormat: string = "PDF"; // Định dạng mặc định
    private formatButtons: GraphicsButton[] = []; // Lưu trữ các nút định dạng

    constructor(onExportCallback: (fileName: string, format: string) => void) {
        super("ExportPopup");
        this.onExportCallback = onExportCallback;
    }

    preload() {
        // Tải hình ảnh nếu cần (tương tự các popup khác)
        this.load.image("button_cancel", "assets/images/MCT_button_cancel.png");
    }

    create() {
        const width = 500;
        const height = 400;

        // Tạo popup với tiêu đề "Export" và nội dung "Chọn định dạng và đặt tên file"
        this.createPopup(
            width,
            height,
            "Export",
            "Chọn định dạng và đặt tên file"
        );

        // Tạo các nút chọn định dạng (PDF, PNG, JPG)
        const formats = ["PDF", "PNG", "JPG"];
        this.formatButtons = []; // Reset mảng nút định dạng
        formats.forEach((format, index) => {
            const button = new GraphicsButton({
                scene: this,
                x: -100 + index * 100,
                y: -height / 2 + 160,
                width: 80,
                height: 40,
                text: format,
                fontStyle: "Nunito",
                fontSize: 16,
                textColor:
                    format === this.selectedFormat ? "#ffffff" : "#1E90FF",
                padding: 5,
                backgroundColor:
                    format === this.selectedFormat ? "#1E90FF" : "#ffffff",
                shape: "rectangle",
                borderRadius: 5,
                cursor: "pointer",
            });

            // Lưu định dạng vào data của button để truy cập sau này
            button.setData("format", format);

            // Tắt interactive mặc định và tự quản lý sự kiện
            button.disableInteractive();
            button.setInteractive({ useHandCursor: true });

            button.on("pointerover", () => {
                button.setAlpha(0.7);
            });

            button.on("pointerout", () => {
                button.setAlpha(1);
            });

            button.on("pointerup", () => {
                // Cập nhật định dạng được chọn
                this.selectedFormat = button.getData("format");
                // Cập nhật giao diện các nút định dạng
                this.updateFormatButtons();
            });

            this.formatButtons.push(button); // Lưu nút vào mảng
            this.popupContainer.add(button);
        });

        // Tạo trường nhập tên file (di chuyển xuống dưới các nút định dạng)
        this.fileNameInput = this.add
            .dom(0, -height / 2 + 220, "input", {
                type: "text",
                placeholder: "Nhập tên file",
                fontSize: "16px",
                padding: "10px",
                width: "200px",
                border: "2px solid #1E90FF",
                borderRadius: "5px",
            })
            .setOrigin(0.5);

        // Tạo nút "Hủy"
        const cancelButton = new GraphicsButton({
            scene: this,
            x: -100,
            y: height / 2 - 60,
            width: 120,
            height: 40,
            text: "Hủy",
            fontStyle: "Nunito",
            fontSize: 16,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#FF0000", // Màu đỏ cho nút "Hủy"
            shape: "rectangle",
            borderRadius: 10,
            cursor: "pointer",
        });

        cancelButton.disableInteractive();
        cancelButton.setInteractive({ useHandCursor: true });

        cancelButton.on("pointerover", () => {
            cancelButton.setAlpha(0.7);
        });

        cancelButton.on("pointerout", () => {
            cancelButton.setAlpha(1);
        });

        cancelButton.on("pointerup", () => {
            this.closePopup();
        });

        // Tạo nút "Export"
        const exportButton = new GraphicsButton({
            scene: this,
            x: 100,
            y: height / 2 - 60,
            width: 120,
            height: 40,
            text: "Export",
            fontStyle: "Nunito",
            fontSize: 16,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#1E90FF", // Màu xanh cho nút "Export"
            shape: "rectangle",
            borderRadius: 10,
            cursor: "pointer",
        });

        exportButton.disableInteractive();
        exportButton.setInteractive({ useHandCursor: true });

        exportButton.on("pointerover", () => {
            exportButton.setAlpha(0.7);
        });

        exportButton.on("pointerout", () => {
            exportButton.setAlpha(1);
        });

        exportButton.on("pointerup", () => {
            const fileName =
                (this.fileNameInput.node as HTMLInputElement).value ||
                "worksheet";
            this.onExportCallback(fileName, this.selectedFormat);
            this.closePopup();
        });

        this.popupContainer.add([
            this.fileNameInput,
            cancelButton,
            exportButton,
        ]);
    }

    private updateFormatButtons(): void {
        this.formatButtons.forEach((button) => {
            const format = button.getData("format"); // Lấy định dạng từ data
            const buttonText = (button as any)
                .buttonText as Phaser.GameObjects.Text;
            const buttonGraphics = (button as any)
                .buttonGraphics as Phaser.GameObjects.Graphics;

            if (!buttonText || !buttonGraphics) {
                console.warn(
                    "buttonText hoặc buttonGraphics không tồn tại trên GraphicsButton",
                    button
                );
                return;
            }

            if (format === this.selectedFormat) {
                buttonText.setColor("#ffffff");
                buttonGraphics.clear();
                buttonGraphics.fillStyle(0x1e90ff, 1);
                buttonGraphics.fillRoundedRect(-40, -20, 80, 40, 5);
            } else {
                buttonText.setColor("#1E90FF");
                buttonGraphics.clear();
                buttonGraphics.fillStyle(0xffffff, 1);
                buttonGraphics.fillRoundedRect(-40, -20, 80, 40, 5);
            }
            button.setAlpha(1); // Reset hiệu ứng hover
        });
    }
}
