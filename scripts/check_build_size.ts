import * as path from 'path';
import * as stream from 'stream';
import * as archiver from 'archiver';

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

// ANSI colors for printing to terminal
enum Color {
  BgRed = '\x1b[41m',
  FgWhite = '\x1b[37m',
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
}

function colorize(text: string, ...colors: Color[]): string {
  return colors.join('') + text + Color.Reset;
}

function handleFinalArchiveSize(bytes: number): void {
  const kBytes = bytes / 1024;
  const kBytesString = kBytes.toFixed(2);
  const percentOfMax = ((kBytes / 13) * 100).toFixed(2);
  console.log(
    `Game has total size ${colorize(
      kBytesString + ' KB',
      Color.Bright,
    )}. That is ${colorize(percentOfMax + '%', Color.Bright)} of max size.`,
  );
  if (kBytes > 13) {
    console.error(
      colorize(
        '!!! Game is too large to submit !!!',
        Color.BgRed,
        Color.FgWhite,
        Color.Bright,
      ),
    );
    process.exit(1);
  }
}

function main() {
  const archive = archiver
    .create('zip', { zlib: { level: 9 } })
    .directory(DIST_DIR, false);
  archive.pipe(
    new stream.Writable({
      // Ignore the bytes of the archive
      write: (_chunk, _encoding, callback) => callback(),
      // Called when the archive is finished being written to
      final: () => handleFinalArchiveSize(archive.pointer()),
    }),
  );
  archive.finalize();
}
main();
