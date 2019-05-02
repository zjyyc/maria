import React from 'react';
import ReactDOM from 'react-dom'; 
import "./user.less";
import Nav from "./components/nav.js";
import './components/lib.js';

class Page extends React.Component{
    componentDidMount() {
        let self = this;
        let user = lib.getUser(true);
        
        lib.get('/maria/query-users.json' , {} , function(json){
            console.log(json);
            self.setState({
                list : json.data ,
                user : user
            })
        });
    }
    set(item , type){
        let self = this;
        lib.post('/maria/update-user.json' , {
            id : item.id ,
            type : type
        },function(json){
            if(json.code == 0){
                item.type = type;
                self.setState(self.state);
            }
        })
    }
    renderOp(user , item){
        if(user.type > 0){
            return <td />;
        }
        if(item.type == 1){
            return (<td className='op'><button type="button" className="btn btn-default" onClick={this.set.bind(this , item , 2)}>设为普通用户</button></td>)
        }
        else{
            return (<td className='op'><button type="button" className="btn btn-primary" onClick={this.set.bind(this , item , 1)}>设为管理员</button></td>)
        }
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
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className='username'>用户名</th>
                                <th className='company'>公司</th>
                                <th className='time'>创建时间</th>
                                <th className='type'>类型</th>
                                <th className='op'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map(function(item){
                                    if(item.type == 0){
                                        return;
                                    }
                                    return (
                                        <tr>
                                            <td className='username'>{item.username}</td>
                                            <td className='company'>{item.company}</td>
                                            <td className='time'>{item.gmt_time}</td>
                                            <td className='type'>{['超级管理员' , '管理员' , '普通用户'][item.type]}</td>
                                            {self.renderOp(user, item)}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

