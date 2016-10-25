const yargs = require('yargs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

function checkCmdExists(commandName) {
    var promiseData = {promise: null,resolver: null,rejecter: null}
    promiseData.promise = new Promise(function (resolve, reject) {
        promiseData.resolver = resolve
        promiseData.rejecter = reject
    })    
    var child = exec(`command -v ${commandName}`,
        function (error, stdout, stderr) {
            if (error) {
                promiseData.rejecter()                
            }
            promiseData.resolver()                        
        });
    return promiseData.promise
}

function forkRun(cmdExec ,argList){
    var childP = spawn(cmdExec ,argList);
    childP.stdout.pipe(process.stdout);
    childP.stderr.pipe(process.stderr);
    
    childP.on('close', (code) => {
        process.exit();        
    });
    
    childP.on('exit', function () {
        process.exit();
    });
}

module.exports = function(execCmd,installCmd ) {
    
    if ((!execCmd) || (!installCmd)){
        var argv = yargs.argv
        var cmd = argv._[0]                    
        var splitCmds = require('../../package.json').splitCommands

        if (!splitCmds[cmd]){
            return
        }
        
        if (! execCmd){
            execCmd = splitCmds[cmd].exec
        }
        if (!installCmd ){
            installCmd = splitCmds[cmd].install
        }
        
        if ((!execCmd) || (!installCmd)){
            console.error("can't read split command configuration in your package.json")
            process.exit()                
        }
    }
    
    checkCmdExists(execCmd).then(function(){
        forkRun(execCmd,argv._.slice(1))            
    }).catch(function(){
        console.log(`please run:\n  ${installCmd}\nto install this command first`)
    })            
}


