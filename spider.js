//引入nodejs爬虫模块
const Crawler = require('crawler');

//实例化爬虫,并做相关配置
var c = new Crawler({
	rateLimit: 2000,
	maxConnections: 1,
	forceUTF8: true,
	//成功下载页面之后对该页面进行解析
	callback: function(error,result,done){
		if(error){
			console.log(error)
		}else{
			//获取网页中的jquery
			var $ = result.$;
			//遍历该页面所有的书籍条目
			$('ul.bang_list>li').each(function(index, item){
				var obj = {};
				//获取书名
				obj.name = $(item).find('div.name>a').text();
				//获取书籍图片
				obj.image = $(item).find('div.pic>a>img').attr('src');
				//获取作者
				obj.author = $(item).find('div.publisher_info>a').eq(0).text();
				//获取书籍链接
				obj.link = $(item).find('div.name>a').attr('href');
				//获取出版信息
				obj.publisher = $(item).find('div.publisher_info>a').eq(-1).text();
				//获取书籍价格
				obj.price = $(item).find('div.price>p').eq(0).find('span.price_n').text();
				
				console.log(obj);
			});
		}
	}
});

//当爬虫的调度队列为空后执行
c.on('drain',function(){
	console.log('爬虫执行完毕');
	db.disconnect(function(){
		console.log('数据库连接关闭')
	});
})

//将url放置到队列中等待页面的爬取
c.queue('http://bang.dangdang.com/books/bestsellers/01.00.00.00.00.00-recent7-0-0-1-1')
