import Phaser from "phaser";
import ContentDTO from "../dto/ContentDTO";

export default class DetailContentScene extends Phaser.Scene {
    private headerTitleText!: Phaser.GameObjects.Text;
    private contentText!: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.Rectangle;
    private container!: Phaser.GameObjects.Container;
    private cheatsheet: any;

    constructor() {
        super({ key: "DetailContentScene" });
    }

    init(data: any): void {
        const { header } = data;
        this.cheatsheet = data.cheatsheet;
        console.log("Received header:", header);
        this.createContent(header);
    }

    preload(): void {}

    createContent(header: any): void {
        if (!header || !header.contents) {
            console.error("Header or header.contents is undefined");
            return;
        }

        this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0xe6f0fa)
            .setOrigin(0);

        this.container = this.add.container(
            this.scale.width * 0.5,
            this.scale.height * 0.5
        );

        this.background = this.add
            .rectangle(
                0,
                0,
                this.scale.width * 0.5,
                this.scale.height * 0.7,
                0xffffff,
                0.95
            )
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x3498db);
        this.container.add(this.background);

        this.headerTitleText = this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.07,
                header.title,
                {
                    fontFamily: "Arial",
                    fontSize: `${this.scale.width * 0.06}px`,
                    color: "#2c3e50",
                    fontStyle: "bold",
                    align: "center",
                    shadow: {
                        offsetX: 2,
                        offsetY: 2,
                        color: "#000",
                        blur: 4,
                        stroke: true,
                        fill: true,
                    },
                }
            )
            .setOrigin(0.5);

        const contentString = header.contents
            .map((content: ContentDTO) => content.text)
            .join("\n\n");

        this.contentText = this.add
            .text(0, 0, contentString, {
                fontFamily: "Arial",
                fontSize: `${this.scale.width * 0.02}px`,
                color: "#34495e",
                align: "center",
                wordWrap: {
                    width: this.scale.width * 0.45,
                    useAdvancedWrap: true,
                },
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    color: "#000",
                    blur: 2,
                    stroke: true,
                    fill: true,
                },
            })
            .setOrigin(0.5);
        this.container.add(this.contentText);

        if (header.image) {
            const { path, x, y, width, height, rotation } = header.image;
            this.load.image(path, path);
            this.load.once("complete", () => {
                this.add
                    .image(x, y, path)
                    .setOrigin(0.5)
                    .setDisplaySize(width, height)
                    .setRotation(Phaser.Math.DegToRad(rotation));
            });
            this.load.start();
        }

        const backButton = this.add
            .text(this.scale.width * 0.03, this.scale.height * 0.03, "Back", {
                fontFamily: "Arial",
                fontSize: `${this.scale.width * 0.03}px`,
                color: "#fff",
                backgroundColor: "#e74c3c",
                padding: { left: 15, right: 15, top: 8, bottom: 8 },
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
            .setOrigin(0)
            .on("pointerover", () => {
                backButton.setBackgroundColor("#c0392b");
                backButton.setScale(1.1);
            })
            .on("pointerout", () => {
                backButton.setBackgroundColor("#e74c3c");
                backButton.setScale(1);
            })
            .on("pointerup", () => {
                this.scene.stop("DetailContentScene");
                this.scene.start("MenuContentScene", {
                    cheatsheet: this.cheatsheet,
                });
            });
    }
}
