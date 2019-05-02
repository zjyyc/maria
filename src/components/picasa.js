import React from 'react';
import ReactDOM from 'react-dom'; 
import './picasa.less';
import Pagination from './pagination';
class Picasa extends React.Component{
	componentDidMount(){
		let self = this;
		let data = this.props.data;
		data.current = 1;
		data.size = 120;
        data.pics = JSON.parse(data.pics || '[]');
		this.setState(data);
		document.addEventListener('dragleave',function(e){e.preventDefault();});
        document.addEventListener('drop',function(e){e.preventDefault();});
        document.addEventListener('dragenter',function(e){e.preventDefault();});
        document.addEventListener('dragover',function(e){e.preventDefault();});
        setTimeout(function(){
        	var picasa = $('.picasa')[0];
        	picasa.addEventListener('dragenter' , function(e){
        		e.preventDefault();
        		$('.drag-drop').show();
        	} , false)
        	picasa.addEventListener('dragover' , function(e){
        		e.preventDefault();
        		$('.drag-drop').show();
        	} , false)
        	$('.drag-drop')[0].addEventListener('dragleave' , function(e){
        		e.preventDefault();
        		$('.drag-drop').hide();
        	} , false)
        	picasa.addEventListener('drop' , function(e){
        		e.preventDefault();
        		$('.drag-drop').hide();
        		self.run(e.dataTransfer.files);
        	} , false)
        } , 300);
	}
	componentWillReceiveProps(props){
		this.setState(this.props.data);
	}
	upload(){
		var self = this;
		var pics = this.state.pics;
		var pic = null;
		for(var i=0; i<pics.length; i++){
			if(pics[i].status == 0){
				pic = pics[i];
				pic.status = 0.001;
				break;
			}
		}
		if(!pic){
			return;
		}
		var file = pic.file;
		var data = new FormData();
		var key = new Date().getTime() % 100000000 + '' + parseInt(Math.random() * 1000)  + '.' + file.name.split('.').reverse()[0].toLocaleLowerCase();
        data.append('key' , key);
        data.append('policy' , 'eyJleHBpcmF0aW9uIjoiMjA2Ni0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==');
        data.append('OSSAccessKeyId' , 'LTAImRM0DKxCPkdL');
        data.append('signature' , 'sjudNgSMRQr5fJlqMBmX78Mhy80=');
        data.append('success_action_status' , '200');
        data.append('file', file);
        $.ajax({
		    url: 'https://img99.oss-cn-zhangjiakou.aliyuncs.com/',
		    type: 'POST',
		    cache: false,
		    data: data,
		    processData: false,
		    contentType: false,
		    xhr:function(){
		    	var xhr = $.ajaxSettings.xhr(); 
		    	if(xhr.upload){ 
                    xhr.upload.addEventListener('progress',function(e){
                    	pic.status = e.loaded / e.total;
                    	if(pic.status == 1){
                    		pic.status = 0.999;
                    	}
                    	self.setState({pics : self.state.pics});
                   		// console.log(pic.status);
                    }, false);   
                }  
		    	return xhr;
		    },
		}).done(function(res) {
			self.state.finishNum++;
			pic.status = 1;
			pic.src = 'http://x.eat163.com/' + key ;
			self.setState({pics : self.state.pics});
			self.upload();
			self.updatePics();
		}).fail(function(res) {
			console.log(res);
		}); 
	}
	updatePics(){
		let finished = true;
		let b = [];
		for(var i=0; i<this.state.pics.length; i++){
			if(this.state.pics[i].status == 1){
				b.push(this.state.pics[i]);
			}
			else{
				finished = false;
			}
		}
		if(finished || this.state.finishNum >= 10){
			this.state.finishNum = 0;
			// console.log('update pics');
			lib.post('/maria/update-config-pics.json' , {
				pics : JSON.stringify(b) ,
				id : this.state.id
			} , function(json){
				console.log(json);
			} , true);
		}
	}

	run(fileList){
		this.state.finishNum = 0;
		var pics = [];
		for(var i=0; i<fileList.length; i++){
			var file = fileList[i];
			//file.name
			var localSrc = window.URL.createObjectURL(fileList[i]);
			var pic = {
				status : 0,
				src : localSrc,
				file : file,
				name : file.name
			};
			pic.type = (file.type.indexOf('image') > -1 ? 'image' : 'other');
			if(file.size > 50 * 1000 * 1000){
				lib.alert('温馨提示' , '上传的文件不能大于<span>50M</span>，大于<span>10M</span>的文件将被自动过滤');
				continue;
			}
			pics.push(pic);
		}
		this.state.pics = pics.concat(this.state.pics);
		this.setState({
			pics : this.state.pics ,
			current : 1
		});
		this.upload();
		this.upload();
		this.upload();
	}
	selectFiles(e){
		this.run(e.target.files);
	}
	goPage(i){
		this.setState({
			current : i
		})
	}
	copy(src){
		var self = this;
		var input = $('.picasa .copy')[0];
		input.value = src;
		input.select();
		document.execCommand("Copy");
		$('.picasa .tips').show();
		self.state.tipEnd = new Date().getTime() + 2000;
		setTimeout(function(){
			if(new Date().getTime() > self.state.tipEnd){
				$('.picasa .tips').hide();
			}
		} , 2200);
	}
	changeSize(e){
		this.setState({
			size : e.target.value
		})
	}
	render(){
		let self = this;
		if(!this.state){
			return (<div />);
		}
		let pageSize = 100;
		let total = parseInt((this.state.pics.length - 1) / pageSize) + 1;
		let pics = this.state.pics.slice(this.state.current * pageSize - pageSize , this.state.current  * pageSize);
		return (
			<div className='picasa' >
				<div className='hd'>
					相册
					<button type="button" className="btn btn-primary" >
						<input type="file" name="file" multiple="multiple" onChange={this.selectFiles} />
						<span>&#xe649;</span>上传图片
					</button>					
					<select className="form-control type" defaultValue={this.state.size} onChange={this.changeSize}>
                        <option value='80'>小图片</option>
                        <option value='120'>中等图片</option>
                        <option value='160'>大图片</option>
                        <option value='200'>超大图片</option>
                    </select>
                    <div className='close' title='关闭相册' onClick={this.props.hidePicasa}>&#xe659;</div>
				</div>
				<div className='bd' style={{bottom : total < 2 ? '0' : '50px'}}>
					<div className='tips'>复制成功</div>
					{
						pics.map(function(pic){
							let src = pic.src;
							if(pic.status == 1){
								src += '?x-oss-process=image/resize,m_fill,h_200,w_200';
								return (
									<div className={'pic ' + pic.type} style={{
										'background-image' : 'url('+(src)+')' ,
										'width' : self.state.size + 'px' ,
										'height' : self.state.size + 'px'
									}} onClick={self.copy.bind(null , pic.src)}>
										{
											pic.type == 'other' ? <div className='name'>{pic.name}</div> : ''
										}
										<div className='mask'></div>
										<div className='tip'>点击复制</div>
									</div>
								)
							}
							else{
								return (
									<div className={'pic ' + pic.type}  style={{'background-image' : 'url('+ pic.src + ')'}} >
										{
											pic.type == 'other' ? <div className='name'>{pic.name}</div> : ''
										}
										<div className="upload-mask" style={{height : (1-pic.status)*100 + '%'}}></div>
									</div>
								)
							}
							
						})
					}
					<div style={{clear:'both'}}></div>
				</div>
				{
					total < 2 ? '' : (
						<div className='ft'>
							<Pagination goPage={this.goPage} data={{current : this.state.current ,total : total}}></Pagination>
						</div>
					)
				}
				<div className='drag-drop'></div>
				<input className='copy' />
			</div>
		);
	}
};

export default Picasa


