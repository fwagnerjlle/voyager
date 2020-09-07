/**
 * Method to get js default modules
 * @param files
 * @param isArray
 * @returns {*}
 */

const getJsModules = (files, isArray = false) => {
  const modules = isArray ? [] : {};
  files.keys().forEach((key) => {
    if (key === './index.js') return;
    if (isArray) files(key).default.map(r => modules.push(r));
    else modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
  });
  return modules;
};

export default { getJsModules };
