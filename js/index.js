$(function(){
	//////////
	var usersglk=[],cab=[{piao:'no'}],changep=false;
	var dataglk,rank,mcname={};
	$.get({
		url:'/lunwen/php/getusersglk.php'
	}).done(function(data){
		usersglk=JSON.parse(data);
		$('.signuser').on('click',function(){
			var a=$('.user').val();
			var b=$('.password').val();
			if (!a || !b) {
				alert('填写有误');
				return; 
			};
			if (changep) {
				if (cab[0].name!==a) {
					alert('用户名错误')
					return;
				}else{
					$.get({
						url:'/lunwen/php/updatausersglk.php',
						data:{name:a,password:b}
					}).done(function(){
						$('.sign').hide();
						alert('修改成功');
					})
					
				}
			}else{
				cab=$.grep(usersglk,function(v){
					return v.name===a;
				})
				if (!cab.length) {
					alert('用户名不存在')
					return;
				}else if (cab[0].password===b) {
					render();
					$('.sign').hide();
				}else{
					alert('密码不正确')
				}
			}
			
		})
	})
	
		//////////初始化


		$.get({
			url:'/lunwen/php/getdatabase.php'
		}).done(function(data){
			localStorage.dataglk=data;
			dataglk=JSON.parse(data);
			rank=JSON.parse(data);
			render();
			amc=dataglk.length;
			$('.player').show();
			$.grep(dataglk,function(v){
				mcname[v.name]=true;
			})

		}).fail(function(){
			console.log(0);
		})
	/////////////菜单
	$('.content > li').hide().eq(0).show()
	$('.menubar li').on('mousedown',function(e){
		for (var i = 0,j; i < 4; i++) {
			j=4-$('.menubar li').index(this)+i;
			$('.menubar li:eq('+i+')').removeClass().addClass('menuclc'+j);

		};
		$('.content > li').hide().eq($('.menubar li').index(this)).show();
		e.preventDefault();
	})
	///////////////渲染
	function render(){
		rank.sort(function(a,b){
			return parseInt(a.piao)<parseInt(b.piao);
		})
		$('.library').empty();
		$('.rank').empty();
		if (cab[0].piao==='yes') {			
			$('.caption:eq(0)').html('<li><span>歌名</span><span>时长</span><span>票数</span></li>')
			$('.caption:eq(1)').html('<li><span>歌名</span><span>时长</span>')
			$.grep(dataglk,function(v,i){
				$('.library').append('<li data-src="'+v.src+'" data-name="'+v.name+'" data-piao="'+v.piao+'"><span>'+v.name+'</span><span>'+v.duration+'</span></li>')
			})
			// console.log(rank,dataglk)
			$.grep(rank,function(v,i){
				$('.rank').append('<li data-src="'+v.src+'" data-name="'+v.name+'" data-piao="'+v.piao+'"><span>'+v.name+'</span><span>'+v.duration+'</span><span>'+v.piao+'</span></li>')
			})
		}else{
			$.grep(dataglk,function(v,i){
				$('.library').append('<li data-src="'+v.src+'" data-name="'+v.name+'" data-piao="'+v.piao+'"><span>'+v.name+'</span><span>'+v.duration+'</span><span class="vote">投票</span></li>')
			})
			// console.log(rank,dataglk)
			$.grep(rank,function(v,i){
				$('.rank').append('<li data-src="'+v.src+'" data-name="'+v.name+'" data-piao="'+v.piao+'"><span>'+v.name+'</span><span>'+v.duration+'</span><span class="vote">投票</span><span>'+v.piao+'</span></li>')
			})
		}
		
		if (!audio.paused) {
			if (lmc==='dataglk') {
				$('.library li:eq('+imc+')').css('background','#BFD6D6');
			}else{
				$('.rank li:eq('+imc+')').css('background','#BFD6D6');
			}
		};
		/////////////投票
		$('.content .vote').on('click',function(){
			var a=$(this).parent();
			var index=$.inArray($.grep(dataglk,function(v){
				return v.name===a.attr('data-name');
			})[0],dataglk);
			console.log(a,index,dataglk)
			dataglk[index].piao++;
			cab[0].piao='yes';
			localStorage.dataglk=JSON.stringify(dataglk);
			rank=JSON.parse(localStorage.dataglk);
			$('.caption:eq(0)').html('<li><span>歌名</span><span>时长</span><span>票数</span></li>')
			$('.caption:eq(1)').html('<li><span>歌名</span><span>时长</span>')
			$.get({
				url:'/lunwen/php/updatapiao.php',
				data:{name:cab[0].name,piao:'yes'}
			}).done(function(){
				console.log(1);

			}).fail(function(){
				console.log(0);
			})
			$.get({
				url:'/lunwen/php/updataglk.php',
				data:{name:dataglk[index].name,piao:dataglk[index].piao}
			}).done(function(){
				console.log(1);
			}).fail(function(){
				console.log(0);
			})
			render()
		})
		///////////

		$('.library li').on('dblclick',function(){
			var a=$('.library li').index($(this).closest('li'));
			console.log(1);
			if (a===imc && lmc==='dataglk') {
				return ;
			};
			lmc='dataglk';
			catmusic(a);
		});
		$('.rank li').on('dblclick',function(){
			var a=$('.rank li').index($(this).closest('li'));
			if (a===imc && lmc==='rank') {
				return ;
			};
			lmc='rank';
			catmusic(a);
		});
	}
	
	///////上传音乐
	// $('.menubar').find('li:eq(2)').on('click',function(){
	// 	$.get({
	// 		url:'/lunwen/php/gettempdata.php'
	// 	}).done(function(data){
	// 		console.log(1)
	// 		var tempdata=JSON.parse(data);
	// 		$.grep(tempdata,function(v){
	// 			mcname[v.name]=true;
	// 		})
	// 	}).fail(function(){
	// 		console.log(0);
	// 	})
	// })
	var tempmc={duration:'未知',piao:0};
	// audio.onloadstart=function(){

	// }
	$('.upload :file').on('change',function(){
		tempmc.name=$(':file').val().split('\\').pop();
		// audio.src=a;
	})
	$('.submit').on('mousedown',function(){
		// $(this).text('上传中');
		$.get({
			url:'/lunwen/php/gettempdata.php'
		}).done(function(data){
			var tempdata=JSON.parse(data);
			$.grep(tempdata,function(v){
				mcname[v.name]=true;
			})
			var a=$('.upload :text').val(),type,same;
			for (var i = 0; i < tempmc.name.length; i++) {
				if ( tempmc.name.charCodeAt(i) > 255 ) {
					type=true;
				};
			};
			do{
				same=Math.floor(Math.random()*9000)+1000;
				if (a) {
					type=$(':file').val().split('.').pop();
					tempmc.name='g'+same+a+'.'+type;
				}else if(type){
					type=$(':file').val().split('.').pop();
					tempmc.name='g'+same+'.'+type;
				}
			}while(mcname[tempmc.name])
			mcname.name=true;
			$('form').attr('action','php/shangchuan.php?name='+tempmc.name)
			tempmc.src='music/'+tempmc.name;
			console.log(tempmc.name,tempmc.src);
			// tempmc.duration=Math.floor(audio.duration / 60) + ':' + audio.duration % 60;
			$.get({
				url:'/lunwen/php/addtempdata.php',
				data:tempmc
			}).done(function(){
				console.log(1);
				$(':submit').trigger('click');
			}).fail(function(){
				console.log(0);
			})
			
		}).fail(function(){
			console.log(0);
		})
		// $('.upload li:eq(4)').val('上传中。。。')
		// console.log($(':file').val(),tempmc)
	})
	/////////////留言板
	$('.liuyan').on('click',function(){
		var a=$('.message :text').val();
		var b=$('.message textarea').val();
		if (a && b) {
			// console.log(a,b)
			$.get({
				url:'/lunwen/php/addmessage.php',
				data:{title:a,content:b}
			}).done(function(){
				alert('上传成功')
				console.log(1);
			}).fail(function(){
				console.log(0);
			})
		}else{
			alert('有信息未填')
		}
	})
	////////////sign
	
	$('.chap').on('click',function(){
		$('.sign').show();
		$('.signuser').val('修改');
		changep=true;
	})
	// console.log(rank,database)
	//////////播放器
	audio=document.querySelector('audio');
	var imc=0,amc,lmc='dataglk',frandom=false,loop=false,ran,volume=1;
	function catmusic(i){
		console.log(i)
		audio.src= lmc==='dataglk' ? dataglk[i].src : rank[i].src;
		audio.play();
		$('.play').hide();
		$('.pause').show();
		$('.library,.rank').find('li').css('background','none');
		if (lmc==='dataglk') {
			$('.mcti').text(dataglk[i].name);
			$('.library li:eq('+i+')').css('background','#BFD6D6');
		}else{
			$('.mcti').text(rank[i].name);
			$('.rank li:eq('+i+')').css('background','#BFD6D6');
		}
		imc=i;
	}
	audio.onplaying=function(){
		var shichang=Math.floor(audio.duration)
		var fen=Math.floor(shichang / 60)
		var miao=shichang % 60
		// console.log(shichang,fen,miao)
		$('.tlength span:eq(1)').text(fen+':'+miao)
	}
	audio.ontimeupdate=function(){		
		var shichang=Math.floor(audio.duration)
		var bofangc=Math.floor(audio.currentTime)
		var fen=Math.floor(bofangc / 60)
		var miao=bofangc % 60
		// console.log(shichang,fen,miao)
		$('.tlength span:eq(0)').text(fen+':'+miao)
		var a=(bofangc * 100) / shichang;
		$('.timepl').width(a);
		$('.timepl2').css('left',a);
	}
	audio.onended=function(){
		if (loop) {
			audio.loop=loop;
		}else if (frandom) {
			do{
				ran=Math.floor(Math.random()*amc);
			}while(ran===imc);
			catmusic(ran);
		}else{
			imc++;
			if (imc===amc) {
				imc=0;
			};
			catmusic(imc);
		}
	}
	$('.play').on('click',function(){
		audio.play();
		$('.play').hide();
		$('.pause').show();
		if (lmc==='dataglk') {
			$('.library li:eq('+imc+')').css('background','#BFD6D6');
		}else{
			$('.rank li:eq('+imc+')').css('background','#BFD6D6');
		}		
	})
	$('.pause').on('click',function(){
		audio.pause();
		$(this).hide();
		$('.play').show();
	})
	$('.premc').on('click',function(){
		if (frandom) {
			do{
				ran=Math.floor(Math.random()*amc);
			}while(ran===imc);
			catmusic(ran);
		}else{
			imc--;
			if (imc<0) {
				imc=amc-1;
			};
			catmusic(imc);
		}
	})
	$('.nextmc').on('click',function(){
		if (frandom) {
			do{
				ran=Math.floor(Math.random()*amc);
			}while(ran===imc);
			catmusic(ran);
		}else{
			imc++;
			if (imc===amc) {
				imc=0;
			};
			catmusic(imc);
		}
	})
	$('.forall').on('click',function(){
		loop=true;
		audio.loop=true;
		$('.for1').show();
		$(this).hide();
	})
	$('.for1').on('click',function(){
		loop=false;
		audio.loop=false;
		frandom=true;
		$(this).hide();
		$('.frandom').show();
	})
	$('.frandom').on('click',function(){
		frandom=false;
		$(this).hide();
		$('.forall').show();
	})
	$('.mute').on('click',function(){
		volume=audio.volume;
		$('.volumea').width(0);
		$('.volumeb').css('left',0);
		$(this).hide();
		$('.mute2').show();
		audio.volume=0;
		// console.log(audio.volume);
	})
	$('.mute2').on('click',function(){
		var a=volume*71+'px';
		$('.volumea').width(a);
		$('.volumeb').css('left',a);
		$(this).hide();
		$('.mute').show();
		audio.volume=volume;
		// console.log(audio.volume);
	})
	$('.volume').on('mousedown',function(e){
		var a=e.offsetX,b=e.pageX;
		console.log(e.target,$('.volumeb').is(e.target))
		if ($('.volumeb').is(e.target)) {
			a=parseInt($('.volumeb').css('left'));
		};
		$('.volumea').width(a);
		$('.volumeb').css('left',a);
		audio.volume=a / 71;
		if (!a) {
			$('.mute').hide();
			$('.mute2').show();
		}else{
			$('.mute2').hide();
			$('.mute').show();
		}
		console.log(a,audio.volume);
		$(document).on('mousemove',function(e){
			var c=a+e.pageX-b;
			if (c>71 || c<0) {
				return;
			};
			$('.volumea').width(c);
			$('.volumeb').css('left',c);
			b=e.pageX;
			a=c;
			if (!a) {
				$('.mute').hide();
				$('.mute2').show();
			}else{
				$('.mute2').hide();
				$('.mute').show();
			}
			audio.volume=a / 71;
		// console.log(a,audio.volume);
		})
		$(document).on('mouseup',function(){
			$(document).off('mousemove').off('mouseup');
		})
	})

	$('.timele').on('mousedown',function(e){
		var a=e.offsetX,b=e.pageX;
		console.log(e.target,$('.timepl2').is(e.target))
		if ($('.timepl2').is(e.target)) {
			a=parseInt($('.timepl2').css('left'));
		};
		$('.timepl').width(a);
		$('.timepl2').css('left',a);
		audio.currentTime=Math.floor(audio.duration)*a / 100;
		console.log(a,audio.volume);
		$(document).on('mousemove',function(e){
			var c=a+e.pageX-b;
			if (c>100 || c<0) {
				return;
			};
			$('.timepl').width(c);
			$('.timepl2').css('left',c);
			b=e.pageX;
			a=c;
			audio.currentTime=Math.floor(audio.duration)*a / 100;
		// console.log(a,audio.volume);
		})
		$(document).on('mouseup',function(){
			$(document).off('mousemove').off('mouseup');
		})
	})

	// $('.delmic').on('click',function(){
	// 	$.get('/lunwen/php/delmusic.php',{name:'../music/asd.mp3'},function(a){
	// 		console.log(a)
	// 	})
	// })
// $.get('/lunwen/php/changename.php',{name:'../music/ai.mp3',newname:'../music/123.mp3'})
})