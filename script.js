var fs = require("fs");
var resolve = require("path").resolve;
var join = require("path").join;
var cp = require("os");

const ignore = ["node_modules"];

function start(path) {
    var lib = resolve(__dirname,path);
    runNpm(lib);
    console.log("done");
}


function runNpm(lib) {
    try {
        const type = fs.statSync(lib);
        if(type.isDirectory()){
            let fileNames = fs.readdirSync(lib);
            for (const i in fileNames) {
                var modPath = lib;
                const type1 = fs.statSync(join(lib,fileNames[i]));
                if(type1.isFile()){
                    if(fileNames[i]=="package.json"){
                        var npmCmd = os.platfrom().startsWith("win") 
                        ? "npm.cmd"
                        : "npm";
                        npmInstall(npmCmd, modPath);
                    }
                }else if(type1.isDirectory() && fileNames[i].slice(0,1) != "." && !ignore.includes(fileNames[i])){
                    runNpm(join(lib + "/" + fileNames[i]));
                }
            }
        }      
    } catch (error) {
        console.log(error);
    }
}

function npmInstall(npmCmd, modPath) {
    cp.spawnSync(npmCmd, ["i"],{
        env: process.env,
        cwd: modPath,
        stdio: "inherit"
    });
}

start("./");
