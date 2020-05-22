import * as React from 'react';
import { inject, observer, } from 'mobx-react'
import { Button, Select, Form } from 'antd';
import './menu.less';
import menuStore from '../../store/menuStore'
import gameStore from '../../store/gameStore'

const { Option } = Select;

interface IMenuProps {
    menuStore:any
    gameStore:any
    history:any
}
 
interface IMenuState {

}

@observer
@inject(gameStore.className)
@inject(menuStore.className)
class Menu extends React.Component<IMenuProps,IMenuState> {

    componentWillMount(){
        
    }

    render(){
        const { menuStore, gameStore, } = this.props;
        console.log(this.props)
        return <div className='menu_wrapper'>
            <Form className='menu_form'>
                <h3 className='menu_form_title'>扫雷</h3>
                
                <Form.Item>
                    <Button className='menu_form_btn'  onClick={()=>{

                    }}>
                        继续游戏
                    </Button>
                </Form.Item>
                <Form.Item
                    label='难度选择'
                >
                    <Select
                        defaultValue={1}
                        onChange={(value)=>{
                            menuStore.changeDifficulty(value)
                        }}
                    >
                        <Option value={1} key={1}>简单 10*10</Option>
                        <Option value={2} key={2}>中等 20*20</Option>
                        <Option value={3} key={3}>困难 40*40</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button className='menu_form_btn' onClick={()=>{
                        
                        this.props.history.push('/game');
                    }}>
                        开始新游戏
                    </Button>
                </Form.Item>
                
                
            </Form>
        </div>
    }
}

export default Menu;