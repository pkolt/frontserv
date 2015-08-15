# frontserv

  Simple static http-server for frontend.

## Installation

```bash
$ npm install frontserv -g
```

## Quick Start

```bash
$ frontserv
```

## Usage

### Root dir (--dir, -d)

```bash
$ frontserv --dir /home/user/www-data
```

  Default: current dir

### Host (--host, -H)

```bash
$ frontserv --host 192.168.1.34
```

  Default: localhost

### Port (--port, -p)

```bash
$ frontserv --port 8080
```

  Default: 8000

### Autoindex (--autoindex)

  Show list of files in the directory.

```bash
$ frontserv --autoindex
```

### Version (--version, -v)

```bash
$ frontserv --version
```

### Help (--help, -h)

```bash
$ frontserv --help
```

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

  [MIT](LICENSE.md)
