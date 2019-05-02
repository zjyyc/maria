import React from 'react';
import ReactDOM from 'react-dom'; 
import "./index.less";
import './components/lib.js';
import Nav from "./components/nav.js";
  
class Page extends React.Component{ 
    componentDidMount() {
        let self = this;
        let user = lib.getUser(true); 
        lib.get('http://maria.eat163.com/maria/get-config-list.json' , {} , function(json){
            console.log(json);
            self.setState({
                list : json.data , 
                user : user
            })
        });  
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
                                <th className='title'>标题</th>
                                <th className='time'>时间</th>
                                <th className='author'>作者</th>
                                <th className='managers'>管理员</th>
                                <th className='users'>用户</th>
                                <th className='edit'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map(function(item){
                                    if(user.type > 1 && (item.managers + ',' +item.users).indexOf(user.username) == -1){
                                        return;
                                    }
                                    return (
                                        <tr>
                                            <td className='title'><a href={'edit-data.htm?id=' + item.id}></a>{item.title}</td>
                                            <td className='time'><a href={'edit-data.htm?id=' + item.id}></a>{item.gmt_time.slice(0,10)}</td>
                                            <td className='author'><a href={'edit-data.htm?id=' + item.id}></a>{item.author}</td>
                                            <td className='managers'><a href={'edit-data.htm?id=' + item.id}></a>{item.managers}</td>
                                            <td className='users'><a href={'edit-data.htm?id=' + item.id}></a>{item.users}</td>
                                            {
                                                user.type == 0 || (user.username == item.author) ? (<td className='edit'><a href={'config.htm?id=' + item.id}></a><span>&#xe61b;</span>编辑配置</td>) :
                                                <td className='edit'><a href={'edit-data.htm?id=' + item.id}></a></td>
                                            }
                                            
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