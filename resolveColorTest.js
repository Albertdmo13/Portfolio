const color = "var(--accent-color)";
const match = color.match(/var\(([^)]+)\)/);
console.log(match ? match[1] : null);
