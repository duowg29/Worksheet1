import Phaser from "phaser";
import WorksheetDTO from "../dto/WorksheetDTO";
import HeaderView from "./HeaderView";
import ExerciseView from "./ExerciseView";
import GamePlayScene from "../scenes/GamePlayScene";
import QuestionView from "./QuestionView";
import ExerciseDTO from "../dto/ExerciseDTO";
import {
    borderStyles,
    defaultBorderStyle,
    BorderStyle,
} from "../view/BorderService";
import { GraphicsButton } from "mct-common";
import ExportPopup from "../services/ExportPopup";

export default class WorksheetView {
    private scene: GamePlayScene;
    private worksheetHeight: number = 0;
    private worksheetContainer: Phaser.GameObjects.Container | null = null;
    private buttonContainer: Phaser.GameObjects.Container | null = null;
    private questionViews: QuestionView[] = []; // Lưu trữ các QuestionView để quản lý đáp án
    private showAnswers: boolean = false; // Trạng thái hiển thị đáp án
    private border: Phaser.GameObjects.Graphics | null = null; // Lưu trữ đối tượng border để cập nhật
    private currentBorderStyleIndex: number = 0; // Chỉ số của kiểu khung hiện tại
    private showAnswersButton: GraphicsButton | null = null; // Lưu trữ nút "Show Answers"
    private showAnswersButtonText: string = "Show Answers"; // Lưu trữ text hiện tại của nút "Show Answers"

    constructor(scene: GamePlayScene) {
        this.scene = scene;
    }

    createWorksheet(worksheet: WorksheetDTO): void {
        if (this.worksheetContainer) {
            this.worksheetContainer.destroy();
        }

        this.worksheetContainer = this.scene.add.container(0, 0);
        this.buttonContainer = this.scene.add.container(0, 0);
        this.questionViews = []; // Reset danh sách QuestionView
        this.showAnswers = false; // Reset trạng thái hiển thị đáp án
        this.currentBorderStyleIndex = 0; // Reset chỉ số kiểu khung
        this.showAnswersButtonText = "Show Answers"; // Reset text của nút

        let yOffset = this.scene.scale.height * 0.03;

        // Vẽ header
        const headerView = new HeaderView(this.scene, this.worksheetContainer!);
        yOffset = headerView.drawHeader(yOffset);
        yOffset += this.scene.scale.height * 0.03;

        // Vẽ tiêu đề "Equivalent Ratios"
        this.worksheetContainer!.add(
            this.scene.add
                .text(
                    this.scene.scale.width * 0.5,
                    yOffset,
                    "Equivalent Ratios",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scene.scale.width * 0.035}px`,
                        color: "#000",
                        fontStyle: "bold",
                    }
                )
                .setOrigin(0.5, 0)
        );
        yOffset += this.scene.scale.height * 0.05;

        // Vẽ các bài tập
        worksheet
            .getExercises()
            .forEach((exercise: ExerciseDTO, index: number) => {
                const exerciseView = new ExerciseView(
                    this.scene,
                    this.worksheetContainer!
                );
                yOffset = exerciseView.drawExercise(
                    exercise,
                    index + 1,
                    yOffset
                );
                // Thu thập QuestionView từ ExerciseView để quản lý hiển thị/ẩn đáp án
                const questionView = exerciseView.getQuestionView();
                this.questionViews.push(questionView);

                if (index < worksheet.getExercises().length - 1) {
                    yOffset += this.scene.scale.height * 0.04;
                    this.drawHorizontalLine(yOffset);
                    yOffset += this.scene.scale.height * 0.03;
                }
            });

        this.worksheetContainer.setPosition(0, 0);

        // Vẽ border
        this.drawBorder(yOffset);

        // Lưu chiều cao của khung
        this.worksheetHeight = yOffset + this.scene.scale.height * 0.02;

        // Tạo các nút
        this.createButtons();
    }

    private drawBorder(yOffset: number): void {
        // Xóa border cũ nếu có
        if (this.border) {
            this.border.destroy();
        }

        // Lấy kiểu khung hiện tại
        const style = borderStyles[this.currentBorderStyleIndex];

        // Vẽ border mới
        this.border = this.scene.add.graphics();
        this.border.lineStyle(style.lineWidth, style.lineColor, 1);

        if (style.cornerRadius && style.cornerRadius > 0) {
            this.border.strokeRoundedRect(
                this.scene.scale.width * 0.01,
                this.scene.scale.height * 0.01,
                this.scene.scale.width * 0.98,
                yOffset + this.scene.scale.height * 0.02,
                style.cornerRadius
            );
        } else {
            this.border.strokeRect(
                this.scene.scale.width * 0.01,
                this.scene.scale.height * 0.01,
                this.scene.scale.width * 0.98,
                yOffset + this.scene.scale.height * 0.02
            );
        }

        this.worksheetContainer!.add(this.border);
    }

    private addButtonAnimation(button: GraphicsButton): void {
        if (this.scene.tweens) {
            this.scene.tweens.add({
                targets: button,
                scale: 0.9,
                duration: 100,
                yoyo: true,
            });
        } else {
            console.warn("Scene tweens are not available for animation.");
        }
    }

    private createShowAnswersButton(
        x: number,
        y: number,
        width: number,
        height: number,
        fontSize: number
    ): GraphicsButton {
        const button = new GraphicsButton({
            scene: this.scene,
            x: x,
            y: y,
            width: width,
            height: height,
            text: this.showAnswersButtonText,
            fontStyle: "Roboto",
            fontSize: fontSize,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#1E90FF",
            shape: "rectangle",
            borderRadius: 10,
            cursor: "pointer",
        });

        // Tắt interactive mặc định của GraphicsButton để tránh xung đột
        button.disableInteractive();

        // Gắn sự kiện trực tiếp lên button
        button.setInteractive({ useHandCursor: true });

        button.on("pointerover", () => {
            button.setAlpha(0.7);
        });

        button.on("pointerout", () => {
            button.setAlpha(1);
        });

        button.on("pointerup", () => {
            this.showAnswers = !this.showAnswers;
            this.showAnswersButtonText = this.showAnswers
                ? "Hide Answers"
                : "Show Answers";
            // Xóa nút cũ
            this.showAnswersButton?.destroy();
            // Tạo nút mới với text đã cập nhật
            this.showAnswersButton = this.createShowAnswersButton(
                x,
                y,
                width,
                height,
                fontSize
            );
            // Thêm nút mới vào buttonContainer
            this.buttonContainer!.add(this.showAnswersButton);
            this.questionViews.forEach((view) =>
                view.toggleAnswers(this.showAnswers)
            );
            // Thêm animation cho nút
            this.addButtonAnimation(this.showAnswersButton);
        });

        return button;
    }

    private createButtons(): void {
        // Các giá trị kích thước và vị trí đã được định nghĩa sẵn
        const fontSize = 16;
        const buttonWidthShowAnswers = this.scene.scale.width * 0.15;
        const buttonWidthCreate = this.scene.scale.width * 0.18;
        const buttonWidthExport = this.scene.scale.width * 0.1;
        const buttonWidthChangeBorder = this.scene.scale.width * 0.2;
        const buttonWidthResetBorder = this.scene.scale.width * 0.15;
        const buttonHeight = this.scene.scale.width * 0.06;
        const buttonXShowAnswers = this.scene.scale.width * 0.35;
        const buttonXCreate = this.scene.scale.width * 0.15;
        const buttonXExport = this.scene.scale.width * 0.75;
        const buttonXChangeBorder = this.scene.scale.width * 0.57;
        const buttonXResetBorder = this.scene.scale.width * 0.9;
        const buttonY = this.scene.scale.height * 0.95;

        // Tạo nút "Show Answers" bằng GraphicsButton
        this.showAnswersButton = this.createShowAnswersButton(
            buttonXShowAnswers,
            buttonY,
            buttonWidthShowAnswers,
            buttonHeight,
            fontSize
        );

        // Tạo nút "Create Worksheet" bằng GraphicsButton
        const createButton = new GraphicsButton({
            scene: this.scene,
            x: buttonXCreate,
            y: buttonY,
            width: buttonWidthCreate,
            height: buttonHeight,
            text: "Create Worksheet",
            fontStyle: "Roboto",
            fontSize: fontSize,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#1E90FF",
            shape: "rectangle",
            borderRadius: 10,
            cursor: "pointer",
        });

        // Tắt interactive mặc định và tự quản lý sự kiện
        createButton.disableInteractive();
        createButton.setInteractive({ useHandCursor: true });

        createButton.on("pointerover", () => {
            createButton.setAlpha(0.7);
        });

        createButton.on("pointerout", () => {
            createButton.setAlpha(1);
        });

        createButton.on("pointerup", () => {
            this.scene.createWorksheet();
            this.showAnswers = false; // Reset trạng thái hiển thị đáp án
            this.showAnswersButtonText = "Show Answers";
            // Xóa nút "Show Answers" cũ
            this.showAnswersButton?.destroy();
            // Tạo nút "Show Answers" mới với text đã cập nhật
            this.showAnswersButton = this.createShowAnswersButton(
                buttonXShowAnswers,
                buttonY,
                buttonWidthShowAnswers,
                buttonHeight,
                fontSize
            );
            // Thêm nút mới vào buttonContainer
            this.buttonContainer!.add(this.showAnswersButton);
            // Thêm animation cho nút
            this.addButtonAnimation(createButton);
        });

        // Tạo nút "Export" bằng GraphicsButton
        const exportButton = new GraphicsButton({
            scene: this.scene,
            x: buttonXExport,
            y: buttonY,
            width: buttonWidthExport,
            height: buttonHeight,
            text: "Export",
            fontStyle: "Roboto",
            fontSize: fontSize,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#1E90FF",
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
            // Xóa scene ExportPopup cũ nếu tồn tại
            const existingPopup = this.scene.scene.get("ExportPopup");
            if (existingPopup) {
                this.scene.scene.remove("ExportPopup");
            }

            // Tạo scene ExportPopup mới
            const exportPopup = new ExportPopup(
                (fileName: string, format: string) => {
                    const worksheetController =
                        this.scene.getWorksheetController();
                    if (format === "PDF") {
                        worksheetController.exportToPDF(fileName);
                    } else if (format === "PNG" || format === "JPG") {
                        worksheetController.exportToImage(
                            fileName,
                            format as "PNG" | "JPG"
                        );
                    } else {
                        console.error(`Unsupported format: ${format}`);
                    }
                }
            );
            this.scene.scene.add("ExportPopup", exportPopup, true);

            // Thêm animation cho nút
            this.addButtonAnimation(exportButton);
        });

        // Tạo nút "Change Border Style" bằng GraphicsButton
        const changeBorderButton = new GraphicsButton({
            scene: this.scene,
            x: buttonXChangeBorder,
            y: buttonY,
            width: buttonWidthChangeBorder,
            height: buttonHeight,
            text: "Change Border Style",
            fontStyle: "Roboto",
            fontSize: fontSize,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#1E90FF",
            shape: "rectangle",
            borderRadius: 10,
            cursor: "pointer",
        });

        changeBorderButton.disableInteractive();
        changeBorderButton.setInteractive({ useHandCursor: true });

        changeBorderButton.on("pointerover", () => {
            changeBorderButton.setAlpha(0.7);
        });

        changeBorderButton.on("pointerout", () => {
            changeBorderButton.setAlpha(1);
        });

        changeBorderButton.on("pointerup", () => {
            this.currentBorderStyleIndex =
                (this.currentBorderStyleIndex + 1) % borderStyles.length;
            this.drawBorder(
                this.worksheetHeight - this.scene.scale.height * 0.02
            );
            // Thêm animation cho nút
            this.addButtonAnimation(changeBorderButton);
        });

        // Tạo nút "Reset Border" bằng GraphicsButton
        const resetBorderButton = new GraphicsButton({
            scene: this.scene,
            x: buttonXResetBorder,
            y: buttonY,
            width: buttonWidthResetBorder,
            height: buttonHeight,
            text: "Reset Border",
            fontStyle: "Roboto",
            fontSize: fontSize,
            textColor: "#ffffff",
            padding: 10,
            backgroundColor: "#1E90FF",
            shape: "rectangle",
            borderRadius: 10,
            cursor: "pointer",
        });

        resetBorderButton.disableInteractive();
        resetBorderButton.setInteractive({ useHandCursor: true });

        resetBorderButton.on("pointerover", () => {
            resetBorderButton.setAlpha(0.7);
        });

        resetBorderButton.on("pointerout", () => {
            resetBorderButton.setAlpha(1);
        });

        resetBorderButton.on("pointerup", () => {
            this.currentBorderStyleIndex = 0;
            this.drawBorder(
                this.worksheetHeight - this.scene.scale.height * 0.02
            );
            // Thêm animation cho nút
            this.addButtonAnimation(resetBorderButton);
        });

        // Thêm các nút vào buttonContainer
        this.buttonContainer!.add([
            this.showAnswersButton,
            createButton,
            exportButton,
            changeBorderButton,
            resetBorderButton,
        ]);
    }

    private drawHorizontalLine(y: number): void {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.beginPath();
        graphics.moveTo(this.scene.scale.width * 0.05, y);
        graphics.lineTo(this.scene.scale.width * 0.95, y);
        graphics.strokePath();

        if (this.worksheetContainer) {
            this.worksheetContainer.add(graphics);
        } else {
            console.warn(
                "Worksheet container is null, cannot add horizontal line graphics"
            );
        }
    }

    getWorksheetContainer(): Phaser.GameObjects.Container | null {
        return this.worksheetContainer;
    }

    getButtonContainer(): Phaser.GameObjects.Container | null {
        return this.buttonContainer;
    }

    getWorksheetHeight(): number {
        return this.worksheetHeight;
    }
}
