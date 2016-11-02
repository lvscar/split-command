# SplitCommand
a framework for write split command line application

## Background
As your Node command line application became more functional day by day, the size of the application, the dependence number of npm package both  
endure inevitable expansion. The situation make your application hard to install.

When intruduce new Node command line application to user, we wish that our application can be installed as soon as possible. In some of case, easy to install and easy to use is more critical then powerful.

SplitCommand try to solve this dilemma.

If your Node command line application is versatile, we encourage you to ship the application as multi-part. At first just let user install a small but crucial core application. The core application don't need to declare dependence of every sub command explicitly in `package.json`, this means some part of your application don't need downloaded at the time main application is installed.  With the help of SplitCommand some sub commands you specified can be installed when they be used first time.

## Usage

### Step.1 package.json configuration
In the package.json file of your core application, add a "splitCommands" section like following example. The "splitCommands" section should as top layer property of the package.json file JSON structure:

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

The `up` and `down` are "split" sub command of main application,their real name of executable command are described using `exec` field and their install command are described using `install` field.

If the executable command name of your main application is "my-app". User can type following cmd

```shell
$my-app up arg1 arg2 
```

instead of


```shell
$my-app-above-part arg1 arg2 
```

### Step.2 main application entry code

Beside package.json configuration , you need add 2 lines to your code for enabling SplitCommand.

```javascript
var projectPackageJSON = require('../package.json');  // configuration file of your project 
require('split-command')(projectPackageJSON);

```

We demonstrate an example of combining `yargs` and `split-command`:

```
var yargs = require('yargs');
var splitCommand = require('split-command');

var argv = yargs
    .usage('\nUsage: $0 coreCommand'                      // normal sub command in your main application
           + '\nUsage: $0 up(split cmd) '                 // split command 
           + '\nUsage: $0 down(split cmd) '               // another split command       
          )
    .command('coreCommand' , 'internal core feature')
    .command('up' ,  'some cool feature suitable lazy install')
    .command('down' ,'another cool feature suitable lazy install too')    
    .argv  ;


(function argvProcess(){
    if (argv._[0] === 'coreCommand') {    
        console.log("coreCommand running....")             // any awesome logic  of your normal sub command
    }
    var projectPackageJSON = require('../package.json');  // configuration file of your project     
    var isSplitCommandMatched = splitCommand(projectPackageJSON); // let's split command do the rest
})()
```

After package.json configuration and code added,your command line application became a versatile but separable one. When user install the application,they don't need to download implementation code and lib of the `up` and `down` sub command. They will be installed when the `up` and `down` sub command used for the first time.

The split sub commands should be write as normal Node command line application. When they used with `splitCommand` these command line arguments after main application's sub command became their full arguments.

## TODO

* ~~windows support~~
* check the version of sub application
* auto install sub application


## Release History
* 161102(0.0.6): add windows support & document update
* 161101(0.0.4): remove dependence of yargs
* 161027(0.0.3): first version

