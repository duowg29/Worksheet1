export interface BorderStyle {
    lineWidth: number;
    lineColor: number;
    cornerRadius?: number;
}

export const borderStyles: BorderStyle[] = [
    // Mẫu 1: Mặc định (giống giao diện ban đầu)
    {
        lineWidth: 2,
        lineColor: 0x000000,
        cornerRadius: 0,
    },
    // Mẫu 2: Đường viền dày, màu xanh dương
    {
        lineWidth: 4,
        lineColor: 0x1e90ff,
        cornerRadius: 10,
    },
    // Mẫu 3: Đường viền màu đỏ, bo góc nhỏ
    {
        lineWidth: 2,
        lineColor: 0xff0000,
        cornerRadius: 5,
    },
    // Mẫu 4: Đường viền mỏng, màu tím, bo góc lớn
    {
        lineWidth: 1,
        lineColor: 0x800080,
        cornerRadius: 15,
    },
];

// Lưu trữ giao diện mặc định để reset
export const defaultBorderStyle: BorderStyle = borderStyles[0];
