import React from 'react';
import ReactDOM from 'react-dom'; 
import './nav.less';
import Dialog from "./dialog.js";
class Nav extends React.Component{
	componentDidMount(){
		let user = lib.getUser();
		let menu = [{
			href : 'index.htm' ,
            title : '首页'
		}]
		if(this.props.data){
			menu = menu.concat(this.props.data);
		}
		if(user.type < 2){
            menu.push({
                href : 'config.htm' ,
                title : '<span>&#xe648;</span>新增配置'
            });
        }
        if(user.type == 0){
        	menu.push({
                href : 'user.htm' ,
                title : '系统管理'
            });
        }

		for(var i=0; i<menu.length; i++){
			if(!menu[i].href){
				menu[i].href = window.location.href;
				menu[i].active = 'active';
			}
			else if(window.location.href.split('/').reverse()[0] == menu[i].href){
				menu[i].active = 'active';
			}
		}

		this.setState({
			user : lib.getUser() , 
			menu : menu
		})
	}
	logOut(){
		lib.get('login.php?method=logout' , {} , function(){
			window.location = 'login.htm';
		})
	}
	render() {
		if(!this.state){
			return (<div />)
		}
		let data = this.state.menu;

		return (
			<div>
				<div className='hd'>
					<div className='nav-panel'>
						<div className='nav'>
							<div className='logo'>
								<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="" height="20" />
								Maria
							</div>
							<ul className='menu'>
								{
									data.map(function(item , index){
										return (
											<li key={index} className={item.active}><a href={item.href} dangerouslySetInnerHTML={{__html : item.title}} ></a></li>	
										)
									})
								}
							</ul>
							<ul className='user'>
								<li><a className='login'>{this.state.user.username}</a></li>
								<li><a className='login-out' onClick={this.logOut}>退出</a></li>
							</ul>
						</div>
					</div>
				</div>
				<Dialog></Dialog>
			</div>
		);
	}
}

export default Nav


