#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <input> [options]')
  .positional('input', {
    describe: 'Input SVG file or directory',
    type: 'string'
  })
  .options({
    'output': {
      alias: 'o',
      describe: 'Output directory',
      type: 'string',
      default: 'output'
    },
    'format': {
      alias: 'f',
      describe: 'Output format (png/jpg)',
      choices: ['png', 'jpg'],
      default: 'png'
    },
    'quality': {
      alias: 'q',
      describe: 'Output quality (1-100)',
      type: 'number',
      default: 90
    },
    'width': {
      alias: 'w',
      describe: 'Resize width',
      type: 'number'
    },
    'height': {
      alias: 'h',
      describe: 'Resize height',
      type: 'number'
    }
  })
  .example('$0 image.svg', 'Convert single SVG to PNG')
  .example('$0 image.svg -f jpg', 'Convert to JPG')
  .example('$0 image.svg -w 800 -h 600', 'Convert and resize')
  .example('$0 ./svgs -o ./converted', 'Convert all SVGs in directory')
  .help()
  .argv;

async function convertImage(inputPath, outputPath, options) {
  try {
    let pipeline = sharp(inputPath);

    // Apply resizing if width or height is specified
    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width, options.height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      });
    }

    // Set output format and quality
    const formatOptions = options.format === 'jpg' 
      ? { quality: options.quality } 
      : { quality: options.quality, compressionLevel: 9 };
    
    pipeline = pipeline[options.format](formatOptions);

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Save the converted image
    await pipeline.toFile(outputPath);
    console.log(`✓ Converted: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function processPath(inputPath, options) {
  try {
    const stats = await fs.stat(inputPath);

    if (stats.isFile()) {
      if (!inputPath.toLowerCase().endsWith('.svg')) {
        console.warn(`⚠ Skipping non-SVG file: ${inputPath}`);
        return;
      }

      const fileName = path.basename(inputPath, '.svg');
      const outputPath = path.join(
        options.output,
        `${fileName}.${options.format}`
      );
      await convertImage(inputPath, outputPath, options);

    } else if (stats.isDirectory()) {
      const files = await fs.readdir(inputPath);
      
      for (const file of files) {
        if (file.toLowerCase().endsWith('.svg')) {
          const fullInputPath = path.join(inputPath, file);
          const fileName = path.basename(file, '.svg');
          const outputPath = path.join(
            options.output,
            `${fileName}.${options.format}`
          );
          await convertImage(fullInputPath, outputPath, options);
        }
      }
    }
  } catch (error) {
    console.error('Error processing path:', error.message);
  }
}

// Main execution
async function main() {
  if (!argv._[0]) {
    console.error('Error: Input path is required');
    process.exit(1);
  }

  try {
    await processPath(argv._[0], {
      output: argv.output,
      format: argv.format,
      quality: argv.quality,
      width: argv.width,
      height: argv.height
    });
    console.log('✨ Conversion complete!');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
