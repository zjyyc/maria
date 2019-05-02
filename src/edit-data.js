import React from 'react';
import ReactDOM from 'react-dom'; 
import "./edit-data.less";
import Nav from "./components/nav.js";
import Picasa from "./components/picasa.js";
import Editor from "./components/editor/editor.js";
import './components/lib.js';
  
class Page extends React.Component{
    componentDidMount() {
        let self = this;
        let user = lib.getUser(true);
        let id = lib.getParam('id');
        let menu = [{
            title : '编辑数据'
        }]
        if(id){
            lib.get('/maria/get-config-by-id.json' , {id : id} , function(json){
                let data = json.data;
                let config = JSON.parse(data.config);
                self.setState({
                    id : data.id , 
                    config :  config,
                    title : data.title , 
                    data : JSON.parse(data.data || (config.type == 'array[json]' ? '[]' : '{}')) ,
                    author : data.author ,
                    managers : data.managers ,
                    users : data.users ,
                    version : data.version ,
                    relative_ids : data.relative_ids ,
                    parent_id : data.parent_id ,
                    picasa:{
                        id : data.id ,
                        pics : data.pics
                    },
                    menu : menu,
                    hasManagerPower : user.type == 0 || (json.data.author + ',' + json.data.managers).indexOf(user.username) > -1 ,
                    hasPower : user.type == 0 || (json.data.author + ',' + json.data.managers + ',' + json.data.users).indexOf(user.username) > -1
                });
                // console.log(self.state);
            })
        }
        else{
            alert('数据不存在' );
        }
    }
    save(method){
        let self = this;
        lib.post('/maria/save-data.json' , {
            id : this.state.id , 
            data : JSON.stringify(this.state.data) ,
            users : this.state.author + ',' + this.state.managers + ',' +this.state.users ,
            version : this.state.version 
        },function(json){
            if(json.code == 0){
                self.state.version++;
                if(method == 'publish-data'){
                    lib.confirm('发布成功' , '恭喜你，数据发布成功！' , '查看数据' , self.gotoData);
                }
                else{
                    lib.alert('保存成功' , '恭喜你，数据保存成功！');
                }
                
            }
            else if(json.code == 1){
                lib.confirm('保存失败!' , json.msg , '点击刷新' , function(){
                    window.location.reload();
                })
            }
            else{
                lib.alert('保存失败!' , json.msg);
            }
        })
    }
    gotoData(){
        // var filename = this.state.id;
        // if(this.state.parent_id){
        //     filename = this.state.parent_id + '-mix';
        // }
        window.open('http://data.eat163.com/' + this.state.id + '.js');
    }
    showPicasa(){
        $('.picasa').show();
        $('.container').addClass('left');
        if($('.edit-array-json table').length > 0){
            let width = document.body.clientWidth / 2 + $('.edit-array-json table').width();
            $('.edit-array-json').width(width);
        }
    }
    hidePicasa(){
        $('.picasa').hide();
        $('.container').removeClass('left');
        $('.edit-array-json').css({width : 'auto'});
    }
    render(){
        let self = this;
        if(!this.state){
            return (<div />)
        }
        return (
            <div> 
                <Nav data={this.state.menu}></Nav>
                <div className="container">
                    <Editor data={this.state} ></Editor>
                </div>
                <div className='fixed-tool'>
                    <div className='title'>工具栏</div>
                    {this.state.hasManagerPower ? (<div className='button' style={{color: '#684CFF'}} onClick={function(){window.location = 'edit-data-user.htm?id=' + self.state.id}}><span style={{'font-size' : '20px'}}>&#xe68c;</span><div>用 户</div></div>) : ''}
                    {this.state.hasPower ? (<div className='button' style={{color: '#EA4CFF'}} onClick={this.showPicasa}><span>&#xe649;</span><div>相 册</div></div>) : ''}
                    {this.state.hasPower ? (<div className='button'  onClick={this.save.bind(self , 'save-data')} style={{color:'#684CFF'}}><span>&#xe65c;</span><div>保 存</div></div>) : ''}
                    {this.state.hasPower ? (<div className='button' style={{color: '#f50'}} onClick={this.save.bind(this , 'publish-data')}><span>&#xec09;</span><div>发 布</div></div>) : ''}
                    <div className='button' style={{color: '#EA4CFF'}} onClick={this.gotoData.bind(self)}><span>&#xe63e;</span><div >数 据</div></div>
                </div>
                <Picasa data={this.state.picasa} hidePicasa={this.hidePicasa}></Picasa> 
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

