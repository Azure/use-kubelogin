import * as crypto from 'crypto';
import * as fs from 'fs';

export async function sha256File(file: string): Promise<string> {
  const hasher = crypto.createHash('sha256').setEncoding('hex');

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .on('error', reject)
      .pipe(hasher)
      .once('finish', () => {
        hasher.end();
        resolve(hasher.read());
      });
  });
}
