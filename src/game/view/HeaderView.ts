import Phaser from "phaser";

export default class HeaderView {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, container: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.container = container;
    }

    drawHeader(yOffset: number): number {
        const xStart = this.scene.scale.width * 0.05;
        const labelWidth = this.scene.scale.width * 0.1;
        const fieldWidth = this.scene.scale.width * 0.4;
        const lineHeight = this.scene.scale.height * 0.015;

        this.container.add(
            this.scene.add
                .text(xStart, yOffset, "Name:", {
                    fontFamily: "Roboto",
                    fontSize: `${this.scene.scale.width * 0.02}px`,
                    color: "#000",
                })
                .setOrigin(0, 0)
        );
        this.drawLine(xStart + labelWidth, yOffset + lineHeight, fieldWidth);

        this.container.add(
            this.scene.add
                .text(
                    xStart +
                        labelWidth +
                        fieldWidth +
                        this.scene.scale.width * 0.08,
                    yOffset,
                    "Score:",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart +
                labelWidth * 2 +
                fieldWidth +
                this.scene.scale.width * 0.05,
            yOffset + lineHeight,
            fieldWidth - this.scene.scale.width * 0.2
        );

        this.container.add(
            this.scene.add
                .text(
                    xStart,
                    yOffset + lineHeight + this.scene.scale.height * 0.01,
                    "Teacher:",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart + labelWidth,
            yOffset + lineHeight * 2 + this.scene.scale.height * 0.01,
            fieldWidth
        );

        this.container.add(
            this.scene.add
                .text(
                    xStart +
                        labelWidth +
                        fieldWidth +
                        this.scene.scale.width * 0.08,
                    yOffset + lineHeight + this.scene.scale.height * 0.01,
                    "Date:",
                    {
                        fontFamily: "Roboto",
                        fontSize: `${this.scene.scale.width * 0.02}px`,
                        color: "#000",
                    }
                )
                .setOrigin(0, 0)
        );
        this.drawLine(
            xStart +
                labelWidth * 2 +
                fieldWidth +
                this.scene.scale.width * 0.05,
            yOffset + lineHeight * 2 + this.scene.scale.height * 0.01,
            fieldWidth - this.scene.scale.width * 0.2
        );

        return yOffset + lineHeight * 2 + this.scene.scale.height * 0.01;
    }

    private drawLine(x: number, y: number, length: number): void {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x + length, y);
        graphics.strokePath();
        this.container.add(graphics);
    }
}
