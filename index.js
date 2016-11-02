'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

function generatePromiseWrapper() {
    var promiseData = { promise: null, resolver: null, rejecter: null };
    promiseData.promise = new _promise2.default(function (resolve, reject) {
        promiseData.resolver = resolve;
        promiseData.rejecter = reject;
    });
    return promiseData;
}

function checkCmdExistsUnix(commandName) {
    var promiseData = generatePromiseWrapper();
    var child = exec('command -v ' + commandName, function (error, stdout, stderr) {
        if (error) {
            promiseData.rejecter();
        }
        promiseData.resolver();
    });
    return promiseData.promise;
}

function checkCmdExistsWin(commandName) {
    var promiseData = generatePromiseWrapper();
    var child = exec('where.exe ' + commandName, function (error, stdout, stderr) {
        if (error) {
            promiseData.rejecter();
        }
        promiseData.resolver();
    });
    return promiseData.promise;
}

function forkRun(cmdExec, argList) {
    var childP = spawn(cmdExec, argList, { shell: true });
    childP.stdout.pipe(process.stdout);
    childP.stderr.pipe(process.stderr);

    childP.on('close', function (code) {
        process.exit();
    });

    childP.on('exit', function () {
        process.exit();
    });
}

module.exports = function (projectPackageJson, execCmd, installCmd) {

    if (!projectPackageJson || !projectPackageJson.splitCommands) {
        console.info("Please check your SplitCommand congifuration");
        return false;
    }

    var args, cmd, splitCmds;
    args = process.argv;
    if (!execCmd || !installCmd) {
        if (args.length > 2) {
            cmd = args[2];
            splitCmds = projectPackageJson.splitCommands;
        } else {
            return false;
        }

        if (!splitCmds[cmd]) {
            return false;
        }

        if (!execCmd) {
            execCmd = splitCmds[cmd].exec;
        }
        if (!installCmd) {
            installCmd = splitCmds[cmd].install;
        }

        if (!execCmd || !installCmd) {
            console.error("can't read split command configuration in your package.json");
            return false;
        }
    }

    var checkCmdExists;
    if (process.platform == "win32") {
        checkCmdExists = checkCmdExistsWin;
    } else {
        checkCmdExists = checkCmdExistsUnix;
    }

    return !!checkCmdExists(execCmd).then(function () {
        forkRun(execCmd, args.slice(3));
    }).catch(function () {
        console.log('please run:\n  ' + installCmd + '\nto install this command first');
    });
};