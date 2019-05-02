window.lib={
	urlPrefix : '' ,
	getParam(p){
	    var strs  = window.location.search.substring(1);
	    var json = {};
	    var b = strs.split('&')
	    for(var i=0; i<b.length; i++){
	        json[b[i].split('=')[0]] = b[i].split('=')[1];
	    }
	    return json[p];
	},
	getUser(flag){
		let user = {};
		try{
			let b = document.cookie.split(';');
			for(var i=0;i<b.length;i++){
				let key = b[i].split('=')[0].trim();
				let value = b[i].split('=')[1].trim();
				if(key == 'user'){
					return JSON.parse(decodeURIComponent(atob(decodeURIComponent(value))));
				}				 
			}
		}
		catch(e){
			if(flag){
				window.location = 'login.htm';
			}
			else {
				return {}
			}
		}
		if(flag){
			window.location = 'login.htm';
		}
		else {
			return {}
		}
	},
	get(url , data , fn , flag){
		if(!flag){
			$('.waiting').show();
		}
		
		$.get(this.urlPrefix + url , data , function(json){
			if(json.code == -1001){
				window.location = 'login.htm';
			}
			else if(json.code == -11){
				lib.alert('操作失败' , json.msg , function(){
					window.location = 'index.htm';
				})
			}
			$('.waiting').hide();
			fn(json);
		} , 'json');
	},
	post(url , data , fn , flag){
		if(!flag){
			$('.waiting').show();
		}
		$.post(this.urlPrefix + url , data , function(json){
			if(json.code == -1001){
				window.location = 'login.htm';
			}
			else if(json.code == -11){
				lib.alert('操作失败' , json.msg , function(){
					window.location = 'index.htm';
				})
			}
			$('.waiting').hide();
			fn(json);
		} , 'json');
	},

	alert(title , content ,  fn){
		$('.waiting').hide();
		$('#dialog .modal-title').html(title);
		$('#dialog .modal-body p').html(content);
		$('#dialog .btn-primary').hide();
		if(fn){
			$('#dialog .btn-default').click(function(){
				$('#dialog').hide();
				$('#dialog .btn-primary').unbind();
				fn();
			});
		}
		$('#dialog').show();
	},
	confirm(title , content , okText , fn){
		$('.waiting').hide();
		$('#dialog .modal-title').html(title);
		$('#dialog .modal-body p').html(content);
		$('#dialog .btn-primary').html(okText || '确定');
		$('#dialog .btn-primary').show();
		$('#dialog .btn-primary').click(function(){
			$('#dialog').hide();
			$('#dialog .btn-primary').unbind();
			fn();
		});
		$('#dialog').show();
	},
	wait(){
		$('.waiting').show();
	}
}

setTimeout(function(){
	$('input , textarea').attr('spellcheck' , false)
} , 2000);

