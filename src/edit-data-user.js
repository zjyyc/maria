import React from 'react';
import ReactDOM from 'react-dom'; 
import "./edit-data-user.less";
import Nav from "./components/nav.js";
import './components/lib.js';

class Page extends React.Component{
    componentDidMount() {
        let self = this;
        let user = lib.getUser(true);
        let id = lib.getParam('id');
        let menu = [{
            href : 'edit-data-user.htm?id=1' ,
            title : '用户管理'
        }]
        
        if(id){
            lib.get('/maria/get-config-by-id.json' , {id : id} , function(json){
                json.data.menu = menu;
                self.setState(json.data);
            })
        }
    }
    input( e){
        this.setState({users : e.target.value.trim()});
    }
    save(){
        let self = this;
        lib.post('/maria/update-data-user.json' , {
            id : this.state.id ,  
            managers : this.state.author + ',' + this.state.managers , 
            users : this.state.users
        } , function(json){
            if(json.code == 0){
                lib.confirm('保存成功' , '恭喜你，保存成功' , '数据编辑GO!' , function(){
                    window.location = 'edit-data.htm?id=' +  self.state.id;
                });
            }
        })
    }
    render(){
        let self = this;
        if(!this.state){
            return (<div />)
        }
        let user = this.state.user;
        return (
            <div>
                <Nav data={this.state.menu}></Nav>
                <div className="container">
                    <h3>乡韵有约 - 用户管理</h3>
                    <div className="form-group">
                        <label >管理员列表</label>
                        <input disabled className="form-control"  placeholder="用户列表，多个用户使用英文的逗号 ',' 隔开" value={this.state.managers}  />
                    </div>
                    <div className="form-group">
                        <label >用户列表</label>
                        <textarea className="form-control" rows="5" spellcheck='false' onInput={this.input.bind(this)}  placeholder="用户列表，多个用户使用英文的逗号 ',' 隔开" value={this.state.users}   />
                    </div>
                    <div style={{clear:'both'}}></div>
                    <button type="button" onClick={this.save.bind(this)} className="btn btn-primary" >保存</button>
                </div>
                
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

