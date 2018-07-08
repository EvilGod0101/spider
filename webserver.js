/* *这一段代码的目的是创建一个临时data文件夹，存储我们爬虫后的结果，完整代码如下* */
//表示使用JS严格模式
"use strict"
//这个语法是JS定义变量的用法，JS可以把多个变量一起定义，这一点如同C和Java
var porrt,server,service,
    system = require('system');
//这里表明引入一个fs，fs是文件系统API
var fs = require('fs');
//意思是得到完整的  ./data 路径
var root = fs.absolute("./data")
//如果上边的路径不存在，则使用下列代码创建此文件夹，并把当前工作目录换成 root文件夹，最后我们输出workingDirectory这个信息
fs.makeDirectory(root)
fs.changeWorkingDirectory(root);
console.log('workingDirectory:'+ root);

/* *接下来的这段代码的意思就是创建一个webserver* */
//require 是js依赖其他库的一种用法，在这里var page是创建一个页面实例的意思。所以接下来我们可以通过page打开页面
var page = require('webpage').create();
//这个代码的意思是读取命令行的参数，这里需要两个参数：第一个是当前webserver.js的文件名，第二个是端口号。
// 所以在这里面如果传入的参数不等于2的时候，我们就输出一些信息提示需要输入portnumber。如果不对的话，我们就退出phantom;如果对的话,我们就得到当前的port
if (system.args.length != 2){
    console.log('Usage:serverkeeppalive.js<portnumber>');
    phantom.exit(1);
} else{
    //下面是一个数组，取得数组的第一个值，ards[0]是这个webserver这个文件
    var port;
    port = system.args[1];
    //然后我们使用如下代码
    server = require('webserver').create();
}

/* *这里我们定义一个新的方法：server.listen
*   作用：创建一个监听窗口，创建一个http的server出去
*   所以第一个参数是port，这个port是从命令行参数中获取得到的，它的回调函数会接受所有请求并响应请求信息
*   我们可以看到service的回调函数中的两个参数：request和response，这两个参数我们在Spring boot中也提到过，遵守的都是http规范*
*   */

service = server.listen(port,function (request,response) {
    //这里我呢吧首创一个变量：
    //  我们请求Url，从post传入一个变量url，来获取我们当时想要 爬虫 的url地址，
    //  然后我们在reponse.headers中给他输入两个信息：
    var requestUrl = request.post.url;
    response.headers = {
        //第一个不需要缓存
        //第二个是设定我们的网页输出内容是网页，并且它的字符集是utf-8
        'Cache':'no-cache',
        'Content-Type':'text/html;charset=utf-8'
    };
    //如果我们接收到requestUrl的值，就使用page这个实例进行open
    if (requestUrl){
        page.open(requestUrl,function (status) {
            // 这段代码的意思是 打开一个网页，然后接受一个回调函数，
            // 这里我们打开你传递的一个网页地址，
            // 并且我们会对这个结果进行回调
            // 如果这个状态 不等于 success的话，我们就要打印 请求失败
            if (status !== 'success'){
                console.log('FALL to load the address');
                return;
            }
            //如果成功了，则使用下列代码：得到请求网页的源码，然后我们把网页源码写到一个文件夹中
            body = page.content;
            // fs.write()写入，接受3个参数，第一个是path，第二个是内容，第三个w是写入的意思。
            // 这里固定写法，path地址写的是'./'+requestUrl ,body和path的内容可以更换。
            // 将body打印到response中，结束这个请求，如果没有传递requestUrl的话，执行下面的else{}
            fs.write("demo.html",body,'w');
            response.write(body);
            response.close();
        });
    }else{
        var body = 'no spider url';
        response.write(body);
        response.close();
    }
});

//如果sevice创建成功，打印 'WebServer running on port'+port
if (service){
    console.log('Web server running on port' + port);
}else {//如果没有成功我们就打印错误信息，同时把进程退出
    console.log('Error:Counld not create web server on port' + port)
    phantom.exit();
}