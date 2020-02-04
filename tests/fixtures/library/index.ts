import path from 'path'
// import os from 'os'

// const libfactorialFile = os.platform() === 'win32'
//   ? 'libfactorial.dll'
//   : 'libfactorial.so'

export const FIXTURE_LIB_FACTORIAL_FILE = path.join(
  __dirname,
  'libfactorial', // libfactorialFile,
)
