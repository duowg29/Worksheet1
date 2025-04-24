import Phaser from "phaser";
import WorksheetDTO from "../dto/WorksheetDTO";
import HeaderView from "./HeaderView";
import ExerciseView from "./ExerciseView";
import GamePlayScene from "../scenes/GamePlayScene";
import QuestionView from "./QuestionView";
import ExerciseDTO from "../dto/ExerciseDTO";

export default class WorksheetView {
    private scene: GamePlayScene;
    private worksheetHeight: number = 0;
    private worksheetContainer: Phaser.GameObjects.Container | null = null;
    private buttonContainer: Phaser.GameObjects.Container | null = null;
    private questionViews: QuestionView[] = []; // Lưu trữ các QuestionView để quản lý đáp án
    private showAnswers: boolean = false; // Trạng thái hiển thị đáp án

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
        const border = this.scene.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(
            this.scene.scale.width * 0.01,
            this.scene.scale.height * 0.01,
            this.scene.scale.width * 0.98,
            yOffset + this.scene.scale.height * 0.02
        );
        this.worksheetContainer!.add(border);

        // Lưu chiều cao của khung
        this.worksheetHeight = yOffset + this.scene.scale.height * 0.02;

        // Tạo các nút responsive
        this.createButtons();
    }

    private createButtons(): void {
        // Tính toán kích thước và padding responsive dựa trên màn hình
        const isSmallScreen = this.scene.scale.width < 480;
        const fontSize = isSmallScreen ? "12px" : "16px";
        const paddingShowAnswers = isSmallScreen
            ? { left: 8, right: 8, top: 5, bottom: 5 }
            : { left: 15, right: 15, top: 10, bottom: 10 };
        const paddingCreate = isSmallScreen
            ? { left: 10, right: 10, top: 5, bottom: 5 }
            : { left: 20, right: 20, top: 10, bottom: 10 };
        const paddingExport = isSmallScreen
            ? { left: 8, right: 8, top: 5, bottom: 5 }
            : { left: 15, right: 15, top: 10, bottom: 10 };
        const buttonWidthShowAnswers = isSmallScreen
            ? this.scene.scale.width * 0.3
            : this.scene.scale.width * 0.2;
        const buttonWidthCreate = isSmallScreen
            ? this.scene.scale.width * 0.35
            : this.scene.scale.width * 0.18;
        const buttonWidthExport = isSmallScreen
            ? this.scene.scale.width * 0.2
            : this.scene.scale.width * 0.1;
        const buttonHeight = isSmallScreen
            ? this.scene.scale.width * 0.1
            : this.scene.scale.width * 0.06;
        const buttonXShowAnswers = isSmallScreen
            ? this.scene.scale.width * 0.4
            : this.scene.scale.width * 0.5;
        const buttonXCreate = isSmallScreen
            ? this.scene.scale.width * 0.65
            : this.scene.scale.width * 0.75;
        const buttonXExport = isSmallScreen
            ? this.scene.scale.width * 0.9
            : this.scene.scale.width * 0.92;

        // Tạo nút "Show Answers"
        const showAnswersButton = this.scene.add
            .text(
                buttonXShowAnswers,
                this.scene.scale.height * 0.95,
                this.showAnswers ? "Hide Answers" : "Show Answers",
                {
                    fontFamily: "Roboto",
                    fontSize: fontSize,
                    color: "#1E90FF",
                    padding: paddingShowAnswers,
                    fixedWidth: buttonWidthShowAnswers,
                    fixedHeight: buttonHeight,
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);

        const showAnswersButtonBackground = this.scene.add.graphics();
        showAnswersButtonBackground.fillStyle(0xffffff, 1);
        showAnswersButtonBackground.lineStyle(2, 0x1e90ff, 1);
        showAnswersButtonBackground.fillRoundedRect(
            buttonXShowAnswers - buttonWidthShowAnswers / 2,
            this.scene.scale.height * 0.95 - buttonHeight / 2,
            buttonWidthShowAnswers,
            buttonHeight,
            10
        );
        showAnswersButtonBackground.strokeRoundedRect(
            buttonXShowAnswers - buttonWidthShowAnswers / 2,
            this.scene.scale.height * 0.95 - buttonHeight / 2,
            buttonWidthShowAnswers,
            buttonHeight,
            10
        );
        showAnswersButtonBackground
            .setInteractive(
                new Phaser.Geom.Rectangle(
                    buttonXShowAnswers - buttonWidthShowAnswers / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthShowAnswers,
                    buttonHeight
                ),
                Phaser.Geom.Rectangle.Contains
            )
            .on("pointerup", () => {
                this.showAnswers = !this.showAnswers;
                showAnswersButton.setText(
                    this.showAnswers ? "Hide Answers" : "Show Answers"
                );
                this.questionViews.forEach((view) =>
                    view.toggleAnswers(this.showAnswers)
                );
            })
            .on("pointerover", () => {
                showAnswersButton.setStyle({ color: "#40C4FF" });
                showAnswersButtonBackground.clear();
                showAnswersButtonBackground.fillStyle(0xffffff, 1);
                showAnswersButtonBackground.lineStyle(2, 0x40c4ff, 1);
                showAnswersButtonBackground.fillRoundedRect(
                    buttonXShowAnswers - buttonWidthShowAnswers / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthShowAnswers,
                    buttonHeight,
                    10
                );
                showAnswersButtonBackground.strokeRoundedRect(
                    buttonXShowAnswers - buttonWidthShowAnswers / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthShowAnswers,
                    buttonHeight,
                    10
                );
            })
            .on("pointerout", () => {
                showAnswersButton.setStyle({ color: "#1E90FF" });
                showAnswersButtonBackground.clear();
                showAnswersButtonBackground.fillStyle(0xffffff, 1);
                showAnswersButtonBackground.lineStyle(2, 0x1e90ff, 1);
                showAnswersButtonBackground.fillRoundedRect(
                    buttonXShowAnswers - buttonWidthShowAnswers / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthShowAnswers,
                    buttonHeight,
                    10
                );
                showAnswersButtonBackground.strokeRoundedRect(
                    buttonXShowAnswers - buttonWidthShowAnswers / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthShowAnswers,
                    buttonHeight,
                    10
                );
            });

        // Tạo nút "Create Worksheet"
        const createButton = this.scene.add
            .text(
                buttonXCreate,
                this.scene.scale.height * 0.95,
                "Create Worksheet",
                {
                    fontFamily: "Roboto",
                    fontSize: fontSize,
                    color: "#ffffff",
                    padding: paddingCreate,
                    fixedWidth: buttonWidthCreate,
                    fixedHeight: buttonHeight,
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);

        const createButtonBackground = this.scene.add.graphics();
        createButtonBackground.fillStyle(0x1e90ff, 1);
        createButtonBackground.fillRoundedRect(
            buttonXCreate - buttonWidthCreate / 2,
            this.scene.scale.height * 0.95 - buttonHeight / 2,
            buttonWidthCreate,
            buttonHeight,
            10
        );
        createButtonBackground
            .setInteractive(
                new Phaser.Geom.Rectangle(
                    buttonXCreate - buttonWidthCreate / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthCreate,
                    buttonHeight
                ),
                Phaser.Geom.Rectangle.Contains
            )
            .on("pointerdown", () => {
                this.scene.createWorksheet();
                this.showAnswers = false; // Reset trạng thái hiển thị đáp án
                showAnswersButton.setText("Show Answers");
            })
            .on("pointerover", () => {
                createButtonBackground.clear();
                createButtonBackground.fillStyle(0x40c4ff, 1);
                createButtonBackground.fillRoundedRect(
                    buttonXCreate - buttonWidthCreate / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthCreate,
                    buttonHeight,
                    10
                );
            })
            .on("pointerout", () => {
                createButtonBackground.clear();
                createButtonBackground.fillStyle(0x1e90ff, 1);
                createButtonBackground.fillRoundedRect(
                    buttonXCreate - buttonWidthCreate / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthCreate,
                    buttonHeight,
                    10
                );
            });

        // Tạo nút "Export"
        const exportButton = this.scene.add
            .text(buttonXExport, this.scene.scale.height * 0.95, "Export", {
                fontFamily: "Roboto",
                fontSize: fontSize,
                color: "#1E90FF",
                padding: paddingExport,
                fixedWidth: buttonWidthExport,
                fixedHeight: buttonHeight,
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        const exportButtonBackground = this.scene.add.graphics();
        exportButtonBackground.fillStyle(0xffffff, 1);
        exportButtonBackground.lineStyle(2, 0x1e90ff, 1);
        exportButtonBackground.fillRoundedRect(
            buttonXExport - buttonWidthExport / 2,
            this.scene.scale.height * 0.95 - buttonHeight / 2,
            buttonWidthExport,
            buttonHeight,
            10
        );
        exportButtonBackground.strokeRoundedRect(
            buttonXExport - buttonWidthExport / 2,
            this.scene.scale.height * 0.95 - buttonHeight / 2,
            buttonWidthExport,
            buttonHeight,
            10
        );
        exportButtonBackground
            .setInteractive(
                new Phaser.Geom.Rectangle(
                    buttonXExport - buttonWidthExport / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthExport,
                    buttonHeight
                ),
                Phaser.Geom.Rectangle.Contains
            )
            .on("pointerdown", () =>
                this.scene.getWorksheetController().exportToPDF()
            )
            .on("pointerover", () => {
                exportButton.setStyle({ color: "#40C4FF" });
                exportButtonBackground.clear();
                exportButtonBackground.fillStyle(0xffffff, 1);
                exportButtonBackground.lineStyle(2, 0x40c4ff, 1);
                exportButtonBackground.fillRoundedRect(
                    buttonXExport - buttonWidthExport / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthExport,
                    buttonHeight,
                    10
                );
                exportButtonBackground.strokeRoundedRect(
                    buttonXExport - buttonWidthExport / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthExport,
                    buttonHeight,
                    10
                );
            })
            .on("pointerout", () => {
                exportButton.setStyle({ color: "#1E90FF" });
                exportButtonBackground.clear();
                exportButtonBackground.fillStyle(0xffffff, 1);
                exportButtonBackground.lineStyle(2, 0x1e90ff, 1);
                exportButtonBackground.fillRoundedRect(
                    buttonXExport - buttonWidthExport / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthExport,
                    buttonHeight,
                    10
                );
                exportButtonBackground.strokeRoundedRect(
                    buttonXExport - buttonWidthExport / 2,
                    this.scene.scale.height * 0.95 - buttonHeight / 2,
                    buttonWidthExport,
                    buttonHeight,
                    10
                );
            });

        this.buttonContainer!.add([
            showAnswersButtonBackground,
            showAnswersButton,
            createButtonBackground,
            createButton,
            exportButtonBackground,
            exportButton,
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
