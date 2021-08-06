import ffi from 'ffi-napi'

console.info('Loading library...')

const libfactorial = ffi.Library(
  './libfactorial',
  {
    'factorial': [ 'uint64', [ 'int' ] ],
  },
)

console.info('Loading library done.')

if (process.argv.length < 3) {
  console.info('Arguments: ' + process.argv[0] + ' ' + process.argv[1] + ' <max>')
  process.exit()
}

var output = libfactorial.factorial(parseInt(process.argv[2]))

console.info('Your output: ' + output)
