import * as path from 'path';
import * as ncp from 'ncp';

const moveUrl = [
  '/src/keys'
];

const destinationUrl = 'dist';

export class MoveFile {

  constructor() {
    this.movefile();
  }

  movefile() {
    moveUrl.forEach((url) => {
      console.log(`copy "${path.join(url)}" => "${path.join(destinationUrl, url)}" ...`)
      ncp(path.join(__dirname, url), path.join(__dirname, destinationUrl, path.basename(url)), function (err) {
        if (err) {
          console.error('Move fail');
          console.error(err);
          return false;
        }
        console.error('Move success');
      });
    });
    console.log('Move Done!');
  }
}
module.exports = new MoveFile();
