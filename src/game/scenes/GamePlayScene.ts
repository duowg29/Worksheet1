import Phaser from "phaser";
import ClassDTO from "../dto/ClassDTO";
import DataService from "../services/DataService";
import UIService from "../services/UIService";
import NavigationService from "../services/NavigationService";
import CardService from "../services/CardService";
import CardDTO from "../dto/CardDTO";
import MenuContentScene from "./MenuContentScene";
export default class GamePlayScene extends Phaser.Scene {
    private classes: ClassDTO[] = [];
    private currentClassIndex: number = 0;
    private currentCheatsheetIndex: number = 0;
    private scrollIndex: number = 0;

    private classButtons: Phaser.GameObjects.Text[] = [];
    private cheatsheetNameText!: Phaser.GameObjects.Text;
    private cards: Phaser.GameObjects.Container[] = [];
    private maxCardsPerPage: number = 6;
    private upButton!: Phaser.GameObjects.Text;
    private downButton!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "GamePlayScene" });
    }

    preload(): void {
        this.load.json("cheatsheets", "assets/cheatsheets.json");
    }

    create(): void {
        this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0xe6f0fa)
            .setOrigin(0);

        const jsonData = this.cache.json.get("cheatsheets");
        this.classes = DataService.loadClasses(jsonData);

        this.classButtons = UIService.createClassButtons(
            this,
            this.classes,
            this.currentClassIndex,
            (index: number) => {
                this.currentClassIndex = index;
                this.currentCheatsheetIndex = 0;
                this.scrollIndex = 0;
                UIService.updateClassButtons(
                    this.classButtons,
                    this.currentClassIndex
                );
                this.updatePage();
            }
        );

        this.classButtons.forEach((button) => {
            button.setStyle({
                fontSize: `${this.scale.width * 0.02}px`,
                color: "#fff",
                backgroundColor: "#7f8c8d",
                padding: { left: 15, right: 15, top: 8, bottom: 8 },
            });
            button.on("pointerover", () => {
                button.setBackgroundColor("#95a5a6");
                button.setScale(1.05);
            });
            button.on("pointerout", () => {
                button.setBackgroundColor(
                    this.classButtons.indexOf(button) === this.currentClassIndex
                        ? "#3498db"
                        : "#7f8c8d"
                );
                button.setScale(1);
            });
        });

        this.cheatsheetNameText = this.add
            .text(this.scale.width * 0.5, this.scale.height * 0.13, "", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#2c3e50",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        NavigationService.setupKeyboardControls(
            this,
            (dir) => this.changeCheatsheet(dir),
            (dir) => this.scrollPage(dir)
        );

        this.upButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.4, "▲", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#fff",
                backgroundColor: "#3498db",
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000",
                    blur: 4,
                    stroke: true,
                    fill: true,
                },
            })
            .setInteractive()
            .setOrigin(0.5)
            .on("pointerover", () => {
                this.upButton.setBackgroundColor("#2980b9");
            })
            .on("pointerout", () => {
                this.upButton.setBackgroundColor("#3498db");
            })
            .on("pointerdown", () => this.scrollPage(-1));

        this.downButton = this.add
            .text(this.scale.width * 0.95, this.scale.height * 0.6, "▼", {
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#fff",
                backgroundColor: "#3498db",
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000",
                    blur: 4,
                    stroke: true,
                    fill: true,
                },
            })
            .setInteractive()
            .setOrigin(0.5)
            .on("pointerover", () => {
                this.downButton.setBackgroundColor("#2980b9");
            })
            .on("pointerout", () => {
                this.downButton.setBackgroundColor("#3498db");
            })
            .on("pointerdown", () => this.scrollPage(1));

        this.events.on("card-selected", (cardDTO: CardDTO) => {
            console.log("Card selected:", cardDTO.header);

            const selectedCheatsheet = this.classes[
                this.currentClassIndex
            ].cheatsheets.find(
                (sheet) => String(sheet.id) === String(cardDTO.id)
            );

            if (selectedCheatsheet) {
                this.scene.start("MenuContentScene", {
                    cheatsheet: selectedCheatsheet,
                    currentClassIndex: this.currentClassIndex,
                    classes: this.classes,
                });
            }
        });

        this.updatePage();
    }

    private changeCheatsheet(direction: number): void {
        this.currentCheatsheetIndex = Phaser.Math.Wrap(
            this.currentCheatsheetIndex + direction,
            0,
            this.classes[this.currentClassIndex].cheatsheets.length
        );
        this.scrollIndex = 0;
        this.updatePage();
    }

    private scrollPage(direction: number): void {
        const currentClass = this.classes[this.currentClassIndex];
        const totalCheatsheets = currentClass.cheatsheets.length;

        this.scrollIndex = Phaser.Math.Clamp(
            this.scrollIndex + direction * this.maxCardsPerPage,
            0,
            Math.max(0, totalCheatsheets - this.maxCardsPerPage)
        );

        this.updatePage();
    }

    private updatePage(): void {
        const currentClass = this.classes[this.currentClassIndex];
        const cheatsheets = currentClass.cheatsheets;

        this.cheatsheetNameText.setText(
            cheatsheets[this.currentCheatsheetIndex].name
        );

        this.cards.forEach((card) => card.destroy());
        this.cards = [];

        const cheatsheetsToShow = cheatsheets.slice(
            this.scrollIndex,
            Math.min(
                this.scrollIndex + this.maxCardsPerPage,
                cheatsheets.length
            )
        );

        cheatsheetsToShow.forEach((cheatsheet, index) => {
            const cardId = `card${this.scrollIndex + index + 1}`;
            const cardDTO = new CardDTO(
                String(cheatsheet.id),
                cheatsheet.name,
                cardId
            );

            const row = Math.floor(index / 2);
            const col = index % 2;

            const cardX = this.scale.width * (0.3 + col * 0.4);
            const cardY = this.scale.height * (0.3 + row * 0.2);

            const card = CardService.createCard(this, cardX, cardY, cardDTO);

            card.list.forEach((child: any) => {
                if (child instanceof Phaser.GameObjects.Rectangle) {
                    child.setFillStyle(0xffffff, 0.95);
                    child.setStrokeStyle(2, 0x3498db);
                } else if (child instanceof Phaser.GameObjects.Text) {
                    child.setColor("#34495e");
                    child.setShadow(1, 1, "#000", 2, true, true);
                }
            });

            card.setInteractive()
                .on("pointerup", () => {
                    console.log(
                        `Card selected: ${cardDTO.header} (ID: ${cardDTO.id})`
                    );
                    this.events.emit("card-selected", cardDTO);
                })
                .on("pointerover", () => {
                    this.tweens.add({
                        targets: card,
                        scale: 1.05,
                        duration: 200,
                        ease: "Power2",
                    });
                    card.list.forEach((child: any) => {
                        if (child instanceof Phaser.GameObjects.Rectangle) {
                            child.setFillStyle(0xe6f0fa, 1);
                        }
                    });
                })
                .on("pointerout", () => {
                    this.tweens.add({
                        targets: card,
                        scale: 1,
                        duration: 200,
                        ease: "Power2",
                    });
                    card.list.forEach((child: any) => {
                        if (child instanceof Phaser.GameObjects.Rectangle) {
                            child.setFillStyle(0xffffff, 0.95);
                        }
                    });
                });

            this.cards.push(card);
        });
    }
}
