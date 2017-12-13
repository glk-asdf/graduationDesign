$(function(){
	//////////初始化
	var dataglk=[],rank=[],tempdata=[],message=[],usersglk=[];
	
	$.get({
		url:'/lunwen/php/getdatabase.php'
	}).done(function(data){
		localStorage.dataglk=data;
		dataglk=JSON.parse(data);
		rank=JSON.parse(data);
		amc=dataglk.length;
		$('.player').show();
		$.get({
			url:'/lunwen/php/gettempdata.php'
		}).done(function(data){
			localStorage.tempdata=data;
			tempdata=JSON.parse(data);
			$.get({
				url:'/lunwen/php/getmessage.php'
			}).done(function(data){
				localStorage.message=data;
				message=JSON.parse(data);
				render();
			})

		}).fail(function(){
			console.log(0);
		})
	}).fail(function(){
		console.log(0);
	})

	/////////////菜单	
	$('.content > li').hide().eq(0).show()
	$('.menubar li').on('click',function(){
		for (var i = 0,j; i < 5; i++) {
			j=5-$('.menubar li').index(this)+i
			$('.menubar li:eq('+i+')').removeClass().addClass('menuclc'+j)

		};
		$('.content > li').hide().eq($('.menubar li').index(this)).show()
	})
	$('.chap').on('click',function(){
		for (var i = 0,b=0; i < usersglk.length; i++) {
			usersglk[i].piao='no';
			$.get({
				url:'/lunwen/php/updatapiao.php',
				data:{name:usersglk[i].name,piao:'no'}
			}).done(function(){
				b++;
				if (b===usersglk.length) {
					alert('用户已重置')
				};
				
				console.log(1);

			}).fail(function(){
				console.log(0);
			})
			
		};
		for (var i = 0,c=0; i < dataglk.length; i++) {
			dataglk[i].piao=0;
			$.get({
				url:'/lunwen/php/updataglk.php',
				data:{name:dataglk[i].name,piao:0}
			}).done(function(){
				c++;
				if (c===dataglk.length) {
					alert('已投票数已重置')
					render();
				};
				
				console.log(1);
			}).fail(function(){
				console.log(0);
			})
		};
	})
	///////////////渲染
	function render(){
		rank.sort(function(a,b){
			return parseInt(a.piao)<parseInt(b.piao);
		})
		$('.library').empty();
		$('.rank').empty();
		$('.passdel').empty();
		$('.message').empty();
		$.grep(dataglk,function(v,i){
			$('.library').append('<li data-src="'+v.src+'" data-name="'+v.name+'" data-piao="'+v.piao+'"><span>'+v.name+'</span><span>'+v.duration+'</span></li>')
		})
		// console.log(rank,dataglk)
		$.grep(rank,function(v,i){
			$('.rank').append('<li data-src="'+v.src+'" data-name="'+v.name+'" data-piao="'+v.piao+'"><span>'+v.name+'</span><span>'+v.duration+'</span><span>'+v.piao+'</span></li>')
		})
		if (tempdata.length) {
			$.grep(tempdata,function(v,i){
				$('.passdel').append('<li data-name="'+v.name+'"><span>'+v.name+'</span><span>'+v.duration+'</span><span class="pass">通过</span><span class="mcdel">删除</span></li>')
			})
		}else{
			$('.passdel').text('无上传音乐');
		}
		if (message.length) {
			$.grep(message,function(v,i){
				$('.message').append('<li><span>'+v.title+'</span><p>'+v.content+'</p></li>')
			})
		}else{
			$('.message').text('无留言');
		}
		
		// if (!audio.paused) {
		// 	if (lmc==='dataglk') {
		// 		$('.library li:eq('+imc+')').css('background','#BFD6D6');
		// 	}else{
		// 		$('.rank li:eq('+imc+')').css('background','#BFD6D6');
		// 	}
		// };
		///////上传音乐处理
		$('.passdel li').on('click','.pass',function(){
			passa=$('.passdel li').index($(this).closest('li'));
			tempsrc=audio.src;
			volume=audio.volume;
			audio.src='../'+tempdata[passa].src;
			audio.play();
			audio.volume=0;
			passt=true;		
		})
		$('.passdel li').on('click','.mcdel',function(){
			passa=$('.passdel li').index($(this).closest('li'));
			$.get({
				url:'/lunwen/php/deltempdata.php',
				data:{name:tempdata[passa].name}
			}).done(function(){
				$.get({
					url:'/lunwen/php/delmusic.php',
					data:{name:'../'+tempdata[passa].src}
				}).done(function(){
					tempdata=$.map(tempdata,function(v,i){
						return i!=passa;
					})
					localStorage.tempdata=JSON.stringify(tempdata);
					render();
				})
				
			}).fail(function(){
				console.log(0);
			})
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
		$('.passdel li').on('dblclick',function(){
			var a=$('.passdel li').css('background','none').index($(this).closest('li'));
			$(this).closest('li').css('background','#BFD6D6');
			tempsrc=audio.src;
			tempname=$('.mcti').text();
			audio.src='../'+tempdata[a].src;
			audio.play();
			$('.mcti').text(tempdata[a].name);
			$('.play').hide();
			$('.pause').show();
		});
	}
	
	
	
	/////////////留言板
	$('.messdel').on('click',function(){
		$.grep(message,function(v,i){
			$.get({
				url:'/lunwen/php/delmessage.php',
				data:{asd:v.title}
			}).done(function(){
				console.log(1)
				if (i===message.length-1) {
					message.length=0;
					localStorage.message=message;
					render();
			}
			})
		})
	})
	////////////用户管理
	var cat=[];
	$('.dealwith li').hide().eq(0).show();
	$('.manage li').css('background','none').eq(0).css('background','#0577fb');
	$('.manage li').on('click',function(){
		var a=$.inArray(this,$('.manage li'));
		$('.dealwith li').hide().eq(a).show();
		$('.manage li').css('background','none').eq(a).css('background','#0577fb');
	})
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
			cat=$.grep(usersglk,function(v){
			return v.name===a;
		})
			if (!cat.length) {
				alert('用户名不存在')
				return;
			}else if (cat[0].manage==='manage') {
				if (cat[0].password===b) {
					$('.sign').hide();
				};
				
			}else{
				alert('用户不是管理员')
			}
		})
	})
	$('.butid').on('click',function(){
		var a=parseInt($('.startid').val());
		var b=parseInt($('.endid').val());
		if (!a || !b) {
			alert('填写有误');
			return; 
		};
		for (var i = a,n,c=a; i <= b; i++) {
			n=''+i;
			$.get({
				url:'/lunwen/php/addusersglk.php',
				data:{name:n,password:n,manage:''}
			}).done(function(){
				c++;
				console.log(1)
				if (c===b) {
					alert('添加成功')
				};
			})
			usersglk.push({name:n,password:n,manage:''})
		};

	})
	$('.butid2').on('click',function(){
		var a=$('.userid').val();
		var b=$('.passwordid').val();
		if (!a || !b) {
			alert('填写有误');
			return; 
		}else if (a!=='gsxy') {
			alert('不具有资格');
			return;
		};
		usersglk.push({name:a,password:b,manage:'manage'})
		$.get({
			url:'/lunwen/php/addusersglk.php',
			data:{name:a,password:b,manage:'manage'}
		}).done(function(){
			console.log(1)
					alert('添加成功')
		})
	})
	$('.butid3').on('click',function(){
		var a=$('.userid2').val();
		var b=$('.passwordid2').val();
		var c=$.grep(usersglk,function(v){
			return v.name===a;
		})
		if (!a || !b || !c.length) {
			alert('填写有误');
			return; 
		}else if (c.name!==cat[0].name && cat[0].name!=='gsxy') {
			alert('不具有资格');
			return;
		};
		var d=$.inArray(c[0],usersglk);
		usersglk[d].name=a;
		usersglk[d].password=b;
		$.get({
			url:'/lunwen/php/updatausersglk.php',
			data:{name:a,password:b}
		}).done(function(){
			console.log(1)
					alert('修改成功')
		})
	})
	$('.butid4').on('click',function(){
		var a=parseInt($('.startid2').val());
		var b=parseInt($('.endid2').val());
		if (!a || !b) {
			alert('填写有误');
			return; 
		};
		for (var i = a,n,c; i <= b; i++) {
			n=''+i;
			c=$.grep(usersglk,function(v){
				return v.name===n;
			})
			if (!c.length) {
				alert('用户名不存在');
				return; 
			};
		}
		for (var i = a,n,c=a; i <= b; i++) {
			n=''+i;
			usersglk=$.grep(usersglk,function(v){
				return v.name!==n;
			})
			$.get({
				url:'/lunwen/php/delusersglk.php',
				data:{name:n}
			}).done(function(){
				c++;
				console.log(1)
				if (c===b) {
					alert('删除成功')
				};
			})
		};

	})
	$('.butid5').on('click',function(){
		if (cat[0].name!=='gsxy') {
			alert('不具有资格');
			return;
		};
		var a=$('.userid3').val();
		var c=$.grep(usersglk,function(v){
			return v.name===a;
		})
		if (!a || !c.length) {
			alert('填写有误');
			return; 
		}else if (a==='gsxy') {
			alert('此账户不可删');
			return;
		};
		usersglk=$.grep(usersglk,function(v){
			return v.name!==a;
		})
		$.get({
			url:'/lunwen/php/delusersglk.php',
			data:{name:a}
		}).done(function(){
			console.log(1)
					alert('删除成功')

		})
	})
	// console.log(rank,database)
	//////////播放器
	audio=document.querySelector('audio');
	var imc=0,amc,lmc='dataglk',frandom=false,loop=false,ran,volume=1,tempsrc,tempname,passa,passt;
	function catmusic(i){
		console.log(i)
		audio.src='../'+( lmc==='dataglk' ? dataglk[i].src : rank[i].src);
		audio.play();
		$('.play').hide();
		$('.pause').show();
		$('.library,.rank,.passdel').find('li').css('background','none');
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
		if (passt) {
			tempdata[passa].duration=fen+':'+miao;
			$.get({
				url:'/lunwen/php/adddatabase.php',
				data:tempdata[passa]
			}).done(function(){
				$.get({
					url:'/lunwen/php/deltempdata.php',
					data:{name:tempdata[passa].name}
				}).done(function(){
					dataglk.push(tempdata[passa]);
					localStorage.dataglk=JSON.stringify(dataglk);
					rank.push(tempdata[passa]);
					tempdata=$.grep(tempdata,function(v,i){
						return i!=passa;
					})
					localStorage.tempdata=JSON.stringify(tempdata);
					audio.src=tempsrc;
					audio.volume=volume;
					audio.pause();
					passt=false;
					render();
				}).fail(function(){
					console.log(0);
				})
			}).fail(function(){
				console.log(0);
			})
		};
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
			if (tempname) {
				audio.src=tempsrc;
				$('.mcti').text(tempname);
				tempname='';
			};
			$('.passdel li').css('background','none');
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