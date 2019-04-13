import React from 'react';
import ReactDOM from 'react-dom';
import printMe from './print.js';
import './index.less';


class Clock extends React.Component{
    render(){
        return (
            <div>{this.props.count}</div>
        )
    }
}

class Page extends React.Component{
    componentWillMount(){
        this.setState({
            count : 1
        });
    }
    componentDidMount(){
        setInterval((function(){
            this.setState({
                count : this.state.count + 1
            })
        }).bind(this) , 1000);
    }
    render(){
        return <Clock count={this.state.count} />
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);