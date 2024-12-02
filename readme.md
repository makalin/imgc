# imgc-cli

`imgc-cli` is a lightweight and efficient command-line tool for converting and resizing SVG files to raster formats like PNG or JPG. It supports batch processing and various customization options.

## Features

- Convert SVG files to PNG or JPG formats.
- Resize images to custom dimensions.
- Batch processing for multiple files.
- Command-line interface for seamless integration into workflows.

## Requirements

- Node.js >= 14.x
- npm or yarn for dependency installation.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/imgc-cli.git
   cd imgc-cli
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Make the script executable:

   ```bash
   chmod +x imgc-cli.js
   ```

4. Optionally, link the CLI globally:

   ```bash
   npm link
   ```

## Usage

Run the script with the desired options:

```bash
imgc-cli <input> [options]
```

### Positional Arguments

- `<input>`: The SVG file or directory containing SVG files to process.

### Options

| Option         | Alias | Description                                      | Default            |
|----------------|-------|--------------------------------------------------|--------------------|
| `--output`     | `-o`  | Specify the output directory for processed files.| Current directory  |
| `--format`     | `-f`  | Set output format (`png` or `jpg`).              | `png`              |
| `--width`      | `-w`  | Set output image width.                          | Original size      |
| `--height`     | `-h`  | Set output image height.                         | Original size      |
| `--quality`    | `-q`  | Set output quality (for JPG format).             | 80                |

### Examples

1. Convert a single SVG file to PNG:

   ```bash
   imgc-cli input.svg --output ./output
   ```

2. Batch convert all SVG files in a directory to JPG:

   ```bash
   imgc-cli ./svgs --format jpg --output ./output
   ```

3. Resize and convert an SVG:

   ```bash
   imgc-cli input.svg --width 500 --height 500
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
