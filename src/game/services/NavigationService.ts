export default class NavigationService {
    static setupKeyboardControls(
        scene: Phaser.Scene,
        changeCheatsheet: (direction: number) => void,
        scrollHeaders: (direction: number) => void
    ) {
        scene.input.keyboard?.on("keydown-LEFT", () => changeCheatsheet(-1));
        scene.input.keyboard?.on("keydown-RIGHT", () => changeCheatsheet(1));
        scene.input.keyboard?.on("keydown-UP", () => scrollHeaders(-1));
        scene.input.keyboard?.on("keydown-DOWN", () => scrollHeaders(1));
    }
}
