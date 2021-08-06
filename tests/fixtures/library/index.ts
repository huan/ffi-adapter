import path from 'path'

const libfactorialFile = process.arch === 'x64'
  ? 'libfactorial-x64'
  : 'libfactorial-x86'

export const FIXTURE_LIB_FACTORIAL_FILE = path.join(
  __dirname,
  libfactorialFile,
)
