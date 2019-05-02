import React from 'react';
import ReactDOM from 'react-dom'; 
import "./login.less";
import './components/lib.js';
import Nav from "./components/nav.js";

class Page extends React.Component{
    componentDidMount() {
        this.setState({
            login : {
                username : {value : '' , error : false},
                passwd : {value : '' , error : false}
            },
            register:{
                username : {value : '' , error : false} ,
                passwd : {value : '' , error : false},
                confirm : {value : '' , error : false},
                company : {value : '' , error : false}
            },
            type : 'login'
        })
    }
    input(item , e){
        item.error = false;
        item.value = e.target.value.trim().slice(0 , 20);
        this.setState(this.state);
    }
    check(){

    }
    register(){
        let self = this;
        let register = this.state.register;
        if(register.username.value == ''){
            register.username.error = 'has-error';
            register.username.errorText = '请输入用户名';
            self.setState(self.state);
            return;
        }
        if(register.passwd.value == ''){
            register.passwd.error = 'has-error';
            register.passwd.errorText = '请输入密码';
            self.setState(self.state);
            return;
        }
        if(register.confirm.value != register.passwd.value ){
            register.confirm.error = 'has-error';
            register.confirm.errorText = '两次密码输入不一致';
            self.setState(self.state);
            return;
        }
        if(register.company.value == ''){
            register.company.error = 'has-error';
            register.company.errorText = '请输入公司名称';
            self.setState(self.state);
            return;
        }

        lib.post('http://maria.eat163.com/maria/register.json' , {
            username : register.username.value , 
            passwd : register.passwd.value , 
            company : register.company.value
        } , function(json){
            if(json.code == 0){
                lib.alert('注册成功' , '恭喜你，帐号：<span>'+self.state.register.username.value+'</span>注册成功，请使用该帐号进行登陆！');
                self.setState({
                    type : 'login'
                })
            }
            else if(json.code == 1062){
                register.username.error = 'has-error';
                register.username.errorText = '用户名' + register.username.value + '已存在';
                self.setState(self.state);
            }
            else{
                lib.alert('注册失败' , '<span>错误码：' + json.code + '</span>');
            }
        })
    }
    login(){
        let self = this;
        let login = this.state.login;
        if(login.username.value == ''){
            login.username.error = 'has-error';
            login.username.errorText = '请输入用户名';
            self.setState(self.state);
            return;
        }
        if(login.passwd.value == ''){
            login.passwd.error = 'has-error';
            login.passwd.errorText = '请输入密码';
            self.setState(self.state);
            return;
        }
        lib.post('http://maria.eat163.com/maria/login.json', {
            username : login.username.value ,
            passwd : login.passwd.value 
        } , function(json){
            if(json.code == 0){
                window.location = './index.htm';
            }
            else if(json.code == 1){
                login.username.error = 'has-error';
                login.username.errorText = '用户名不存在！';
                self.setState(self.state);
            }
            else if(json.code == 2){
                login.passwd.error = 'has-error';
                login.passwd.errorText = '密码错误！';
                self.setState(self.state);
            }
            console.log(json);
        })
    }
    changeType(type){
        this.setState({type : type});
    }
    keyUp(e){
        var code = e.keyCode;
        if(code == 13){
            this.login();
        }
    }
    render(){
        let self = this;
        if(!this.state){
            return <div />
        }
        let login = this.state.login;
        let register = this.state.register;
        return (
            <div>
                <Nav />
                <div className='bg' style={{'backgroundImage' : 'url("http://yixingcc.oss-cn-beijing.aliyuncs.com/1538763257023-521.jpg")'}}></div>
                <div className='mask'></div>
                <div className='box'>
                    <div className='box-bg'></div>
                    <div className={'hd ' + this.state.type}>
                        <div onClick={this.changeType.bind(self , 'register')}>注册</div>
                        <div onClick={this.changeType.bind(self , 'login')}>登陆</div>
                    </div>
                    <div className='bd'>
                        {
                            this.state.type == 'login' ? 
                            (
                                <div>
                                    <div className={"form-group " + login.username.error}>
                                        <label>用户名</label>
                                        <input className="form-control" placeholder="姓名" value={login.username.value} 
                                        onChange={this.input.bind(self , login.username )} />
                                        <div>{login.username.errorText}</div>
                                    </div>
                                    <div className={"form-group " + login.passwd.error}>
                                        <label>密码</label>
                                        <input type='password' className="form-control" onKeyUp={this.keyUp.bind(this)} placeholder="密码" value={login.passwd.value} 
                                        onChange={this.input.bind(self , login.passwd )} />
                                        <div>{login.passwd.errorText}</div>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={this.login.bind(this)}>登陆</button>
                                </div>
                            )
                            :
                            (
                                <div>
                                    <div className={"form-group " + register.username.error}>
                                        <label >用户名</label>
                                        <input className="form-control"  placeholder="请使用真实姓名注册" value={register.username.value} 
                                        onChange={this.input.bind(self , register.username )} />
                                        <div>{register.username.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.passwd.error}>
                                        <label >密码</label>
                                        <input type='password' className="form-control" placeholder="密码" value={register.passwd.value} 
                                        onChange={this.input.bind(self , register.passwd )} />
                                        <div>{register.passwd.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.confirm.error}>
                                        <label >确认密码</label>
                                        <input type='password' className="form-control" placeholder="密码" value={register.confirm.value} 
                                        onChange={this.input.bind(self , register.confirm )} />
                                        <div>{register.confirm.errorText}</div>
                                    </div>
                                    <div className={"form-group " + register.company.error}>
                                        <label >公司</label>
                                        <input className="form-control"  placeholder="公司名" value={register.company.value} 
                                        onChange={this.input.bind(self , register.company )} />
                                        <div>{register.company.errorText}</div>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={this.register.bind(this)}>注册</button>
                                </div>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
};

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);

