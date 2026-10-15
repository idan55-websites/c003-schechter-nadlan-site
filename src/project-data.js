import records from './projects.json';
import {asset} from './assets.js';
export default records.map(project => ({
 ...project,
 images: project.images.map(asset),
 ...(project.media ? {media: project.media.map(item => ({...item, src: asset(item.src)}))} : {})
}));
