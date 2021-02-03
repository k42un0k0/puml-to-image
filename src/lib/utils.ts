import fs from "fs";
export const IS_WINDOWS = process.platform === "win32";

export const readdirRecursively = (dir: string) => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  let dirs: string[] = [];
  let files: string[] = [];
  for (const dirent of dirents) {
    if (dirent.isDirectory()) dirs = dirs.concat(`${dir}/${dirent.name}`);
    if (dirent.isFile()) files = files.concat(`${dir}/${dirent.name}`);
  }
  for (const d of dirs) {
    files = files.concat(readdirRecursively(d));
  }
  return files;
};
