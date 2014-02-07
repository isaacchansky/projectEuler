// TODO: write function to grab & parse actual problem from euler & dump it into a readme file.

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var langExt = ['.js','.rb','.py','.clj','.scala','.hs'];
var eulerRoot = 'http://projecteuler.net/problem=';

if(process.argv.length != 3){
    console.log("to scaffold a new project set, run:\n\tnode scaffold.js [number of problem]");
    process.exit();
}

var projNum = process.argv[2];

console.log('scaffolding out project euler problem set #'+projNum);

console.log('creating folder...');

fs.exists('./problem'+projNum, function(exists){
    if(exists){
        console.log("looks like you've already started that one.");
    }else{
        fs.mkdir('./problem'+projNum);

        langExt.forEach(function(ext){
            fs.writeFile('./problem'+projNum+'/problem'+projNum+ext, '', function(err){
                if(err) {
                    console.log(err);
                }else{
                    console.log('created '+ext+' file');
                }
            });
        });

        console.log('pulling problem from projecteuler.net...');
        request(eulerRoot+projNum, function(err, resp, body){
            if(!err){
                var $ = cheerio.load(body);
                var content = '';
                content += '##'+$('h2').text()+'\n';
                content += $('.problem_content').text()+'\n\n';
                content+= '[link to problem]('+eulerRoot+projNum+')';
                fs.writeFile(
                    './problem'+projNum+'/problem'+projNum+'.md',
                    content,
                    function(err){
                        if(!err){
                            console.log('created description markdown file');
                        }
                    }
                );
            }
        });

    }
});

