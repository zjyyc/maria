import React from 'react';
import ReactDOM from 'react-dom'; 
import "./config.less";
import Nav from "./components/nav.js";
import './components/lib.js';
class Page extends React.Component{ 
    componentDidMount() {
        let self = this;
        let user = lib.getUser(true);
        if(user.type > 1){
            alert('对不起，你没有权限访问该页面！');
            window.location = 'index.htm';
            return;
        }
        let id = lib.getParam('id');
        let menu;
        let tool = {
            delete : false ,
            save : false ,
            edit : false
        };
        if(id){
            tool.edit = true;
            menu = [{
                href : 'config.htm?id=' + id ,
                title : '更新配置'
            }];
            lib.get('http://maria.eat163.com/maria/get-config-by-id.json' , {id : id} , function(json){
                if(json.code == 1){
                    alert('对不起，找不到配置id=' + id + '的配置');
                    window.location = 'index.htm';
                }
                let data = json.data;
                if(user.type==0 || (user.username == data.author && user.type == 1)){
                    tool.delete = true;
                    tool.save = true;
                }
                data.config = JSON.parse(data.config);
                data.tool = tool;
                data.menu = menu;
                self.setState(data);
            })
        }
        else{
            if(user.type < 2){
                tool.save = true;
            }
            this.setState({
                id : 0 ,
                title : '' ,
                config : {
                    key : 'json_data' ,
                    name : '' ,
                    type : 'json' ,
                    list : []
                },
                menu : menu,
                tool : tool
            })
        }
    }
    add(item){
        if(item.type == 'select'){
            item.list.push({
                key : '' ,
                type : 'option' ,
                value : ''
            });
        }
        else{
            item.list.push({
                key : '' ,
                type : 'string' ,
                title : '' ,
                desc : '' ,
                list : []
            });
        }
        
        this.setState({config : this.state.config});
    }
    del(p , i){
        p.list.splice(i,1);
        this.setState({config : this.state.config});
    }
    input(item , key , e){
        item[key] = e.target.value.trim();
        this.setState({config : this.state.config});
    }
    inputTitle(e){
        let config = this.state.config;
        config.name = e.target.value;
        this.state.title = e.target.value;
        this.setState(this.state);
    }
    changeType(item , e){
        item.type = e.target.value;
        this.setState({config : this.state.config});
    }
    checkKey(list){
        let hash = {};
        for(var i=0; i<list.length; i++){
            var item = list[i];
            if(item.key == 'id'){
                lib.alert('保存失败' , '<span class="error">主键key不允许使用系统关键字id</span>');
                return false;
            }
            if(item.key == ''){
                lib.alert('保存失败' , '<span class="error">主键key不允许为空</span>');
                return false;
            }
            if(hash[item.key]){
                lib.alert('保存失败' , '<span class="error">同一层级主键key不允许重复</span>');
                return false;
            }
            if(item.type == 'select' && item.list.length == 0){
                lib.alert('保存失败' , '<span class="error">单选元素必须存在对应的子元素</span>');
                return false;
            }
            hash[item.key]=true;
            if(item.list){
                if(!this.checkKey(item.list)){
                    return false;
                }
            }
            
        }
        return true;
    }
    deleteConfig(){
        let self = this;
        lib.confirm('删除确认' , 
            '你确定要删除<span>' + self.state.title + '</span>这个配置吗？<br />删除后，将无法恢复！',
            '确认删除' , function(){
                lib.post('/maria/delete-config.json' , {
                    id : self.state.id , 
                    author : self.state.author
                } , function(){
                    lib.alert('删除成功' , '配置'+self.state.title+'删除成功' , function(){
                        window.location = 'index.htm';
                    })
                })
            })
    }
    editConfig(){
        window.open('edit-data.htm?id=' + this.state.id);
    }
    saveConfig(){
        let self = this;
        if(this.state.title == ''){
            return lib.alert('保存失败' , '<span class="error">数据标题不允许为空!</span>')
        }
        if(!this.checkKey(this.state.config.list)){
            return ;
        }
        let method = '/maria/insert-config.json';
        if(this.state.id != 0){
            method = '/maria/update-config.json';
        }
        lib.post(method , {
            id : this.state.id ,
            title : this.state.title , 
            config : JSON.stringify(this.state.config) ,
            author : this.state.author ,
            managers : this.state.managers || '',
            users : this.state.users 
        }, function(json){
            if(json.code == 0){
                if(self.state.id == 0){
                    lib.alert('保存成功' , '恭喜你，保存成功！' , function(){
                        window.location = 'config.htm?id=' + json.data.id;
                    });
                }
                else{
                    lib.alert('保存成功' , '恭喜你，保存成功！');
                }
            }
            else {
                lib.alert('提示' , "系统错误，请稍后再试");
            }

        });
    }
    
    up(list , i){
        let temp = list[i];
        list[i] = list[i-1];
        list[i-1] = temp;
        this.setState({config : this.state.config});
    }
    down(list , i){
        let temp = list[i];
        list[i] = list[i+1];
        list[i+1] = temp;
        this.setState({config : this.state.config});
    }
    renderList(p , index){
        let self = this;
        let list = p.list;
        if(!list){
            return ;
        }
        return (
            <div>
                {
                    list.map(function(item , i){
                        var html = '';
                        var f3 = '';
                        if(item.type == 'select'){
                            f3 = (<input className="form-control desc" placeholder="默认值" value={item.defaultValue} onInput={self.input.bind(self , item , 'defaultValue')}/>);
                        }
                        else if(item.type == 'array[json]'){
                            f3 = (<input className="form-control desc" title="关联子集key，用于用户编辑表格，显示对应行的标题" placeholder="关联子集key" value={item.relative} onInput={self.input.bind(self , item , 'relative')}/>);
                        }
                        else if(item.type == 'string' || item.type=='array' || item.type=='json'){
                            f3 = (<input className="form-control desc" placeholder="描述" value={item.desc} onInput={self.input.bind(self , item , 'desc')}/>);
                        }
                        if(item.type == 'option'){
                                html = (
                                <div className={'node level-' + index}>
                                    <input className="form-control key " placeholder="key" value={item.key} onInput={self.input.bind(self , item , 'key')} />
                                    <input className="form-control name" placeholder="value" value={item.value} onInput={self.input.bind(self , item , 'value')}/>
                                    <div className='op'>
                                        <div className='del' onClick={self.del.bind(self , p , i)}>&#xe7ee;</div>
                                        {
                                            i > 0 ? (<div className='up' title='上移' onClick={self.up.bind(self , list , i)}>&#xe645;</div>) : ''
                                        }
                                        {
                                            i < list.length - 1 ? (<div className='down' title='下移' onClick={self.down.bind(self , list , i)}>&#xe644;</div>) : ''
                                        }
                                    </div>
                                </div>
                            );
                        }
                        else{
                            html = (
                                <div className={'node level-' + index}>
                                    <input className="form-control key " placeholder="key" value={item.key} onInput={self.input.bind(self , item , 'key')} />
                                    <select className="form-control type" onChange={self.changeType.bind(self , item )} value={item.type}>
                                        <option value='string'>字符串</option>
                                        <option value='select'>单选</option>
                                        <option value='array'>数组</option>
                                        <option value='json'>对象</option>
                                        <option value='array[json]'>数组[对象]</option>
                                    </select>
                                    <input className="form-control name" placeholder="名字" value={item.name} onInput={self.input.bind(self , item , 'name')}/>
                                    {f3}
                                    <div className='op'>
                                        <div className='del' onClick={self.del.bind(self , p , i)}>&#xe7ee;</div>
                                        {
                                            (item.type == 'select' || item.type == 'json' || item.type == 'array[json]') 
                                            ? (<div className='add' onClick={self.add.bind(self , item)}>&#xe6d8;</div>) 
                                            : ''
                                        }
                                        {
                                            i > 0 ? (<div className='up' title='上移' onClick={self.up.bind(self , list , i)}>&#xe645;</div>) : ''
                                        }
                                        {
                                            i < list.length - 1 ? (<div className='down' title='下移' onClick={self.down.bind(self , list , i)}>&#xe644;</div>) : ''
                                        }
                                    </div>
                                    
                                </div>
                            );
                        }
                        
                        return (
                            <div>
                                {html}
                                {self.renderList(item , index + 1)}
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    render(){
        let self = this;
        if(!this.state){
            return (<div />)
        }
        let config = this.state.config;
        let tool = this.state.tool;
        return (
            <div>
                <Nav data={this.state.menu}></Nav>
                <div className="container">
                    <div className="form-group">
                        <label >标题</label>
                        <input className="form-control"  placeholder="标题" value={this.state.title} onInput={self.inputTitle.bind(this)}  />
                    </div>
                    <div className="form-group">
                        <label>管理人员</label>
                        <input className="form-control"  placeholder="多个用户用,线隔开" value={this.state.managers} onInput={self.input.bind(this , this.state , 'managers')}  />
                    </div>
                    <div className="form-group">
                        <label>用户列表</label>
                        <input className="form-control"  placeholder="多个用户用,线隔开" value={this.state.users} onInput={self.input.bind(this , this.state , 'users')}  />
                    </div>
                    <div className="form-group">
                        <label >变量名称</label>
                        <input className="form-control"  placeholder="标题" value={config.key} onInput={self.input.bind(this , config , 'key')}  />
                    </div>
                    <div className="form-group">
                        <label >数据类型</label>
                        <select className="form-control type" onChange={self.input.bind(this , config , 'type')} value={config.type} >
                            <option value='json'>对象</option>
                            <option value='array[json]'>数组[对象]</option>
                        </select>
                        <input style={{width : '380px' , 'margin-left' : '20px'}} className="form-control" placeholder="关联子集key" title='关联子集key，用于用户编辑表格，显示对应行的标题' 
                        value={config.relative} onInput={self.input.bind(this , config , 'relative')}  />
                    </div>
                    
                    <div className='config'>
                        <h3>数据定义</h3>
                        {this.renderList(config , 0)}
                        <button type="button" className="btn btn-primary" onClick={this.add.bind(this , config)}>添加</button>
                    </div>
                </div>
                <div className='fixed-tool'>
                    <div className='icon'></div>
                    <div className='title'>工具栏</div>
                    {tool.delete ? (<div className='button' onClick={this.deleteConfig.bind(this)} ><span style={{'font-size' : '20px'}}>&#xe600;</span><div dangerouslySetInnerHTML={{__html : '删&nbsp;除'}} ></div></div>) : ''}
                    {tool.save ? (<div className='button' onClick={this.saveConfig.bind(this)} style={{color:'#8d7afb'}}><span>&#xe65c;</span><div dangerouslySetInnerHTML={{__html : '保&nbsp;存'}} ></div></div>) : ''}
                    {tool.edit ? (<div className='button' onClick={this.editConfig.bind(this)} style={{color:'#f50'}}><span style={{'font-size' : '20px'}}>&#xec09;</span><div  >数 据</div></div>) : ''}
                </div>
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

