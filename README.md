# SplitCommand
a framework for write separable command line application

## Background
As your Node command line application became more functional day by day, the size of the application, the dependence number of npm package both  
endure inevitable expansion. The situation make your application hard to install.

When intruduce our Node command line application to new user, we wish that our application can be installed as soon as possible. In some of case, easy to install and easy to use is more critical then powerful.

SplitCommand try to solve this dilemma.

If your Node command line application is versatile, we encourage you to ship the application as multi-part. At first just let user install a small but crucial core application. The core application don't need to declare dependence of other part explicitly in `package.json`, with the help of SplitCommand other part can be install when them first time be used.

## Usage

### No.1 package.json configuration
In the package.json file of your core application, add a "splitCommands" section like following example. The "splitCommands" section should as top layer property of the JSON structure:

```
  "splitCommands": {
      "up": {
          "exec":"my-app-above-part",
          "install": "npm install my-app-above-part -g"
      },
      "down":{
         "exec": "my-app-below-part",
          "install": "npm install my-app-below-part -g"         
      }
  }
```
### No.2 code example

```
var yargs = require('yargs');
var splitCommand = require('split-command');

var argv = yargs
    .usage('\nUsage: $0 coreCommand'
           + '\nUsage: $0 up(split cmd) '
           + '\nUsage: $0 down(split cmd) '                      
          )
    .command('coreCommand' , 'internal core feature')
    .command('up' ,  'some cool feature suitable lazy install')
    .command('down' ,'another cool feature suitable lazy install too')    
    .argv  ;


(function argvProcess(){
    if (argv._[0] === 'coreCommand') {    
        console.log("coreCommand running....")
    }
    splitCommand();
})()
```

After package.json configuration and code added,your command line application became a versatile but separable one. When user install the application,they don't need download implementation code and lib of the `up` and `down` sub command. They will be installed when the `up` and `down` sub command used for the first time.

The split part should be write as normal Node command line application. When they used with `splitCommand` these command line arguments after main application's sub command became their full arguments.

## TODO

* check the version of sub application
* auto install sub application
* windows support

## Release History
* 161026(0.0.1): first version

