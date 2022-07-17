import url from "url";
import path from "path";

const getPath = (url2) => {
    console.log(process.cwd());
    const __filename = url.fileURLToPath(url2);
    const __dirname = path.dirname(__filename);
    return {__filename, __dirname}
}
export const {__filename, __dirname} = getPath(import.meta.url)
