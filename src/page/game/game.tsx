import * as React from 'react';
import { observer, inject } from 'mobx-react';
import gameStore from '../../store/gameStore';
import { toJS } from 'mobx';
import './game.less';
import { Button } from 'antd';
import { format } from 'path';

interface IGameProps {
    gameStore:any
}

interface IGameState {
    
}

interface ICell {
    mine: boolean,
    num: number,
    flag: boolean,
    showNum: boolean,
    bomb: boolean,
    used: boolean,
    question: boolean,
}

const formatColorNum=(num:number)=>{
    switch(num){
        case 1: return <span className='num' style={{backgroundColor:'#ff9912',color:'black'}}>{num}</span>;
        case 2: return <span className='num' style={{backgroundColor:'#40e0d0',color:'black'}}>{num}</span>;
        case 3: return <span className='num' style={{backgroundColor:'#87ceeb',color:'black'}}>{num}</span>;
        case 4: return <span className='num' style={{backgroundColor:'#d2691e',color:'black'}}>{num}</span>;
        case 5: return <span className='num' style={{backgroundColor:'#802a2a',color:'black'}}>{num}</span>;
        case 6: return <span className='num' style={{backgroundColor:'#a020f0',color:'black'}}>{num}</span>;
        case 7: return <span className='num' style={{backgroundColor:'#b0171f',color:'black'}}>{num}</span>;
        case 8: return <span className='num' style={{backgroundColor:'#fafff0',color:'black'}}>{num}</span>;
    }
    
}

@inject(gameStore.className)
@observer
class Game extends React.Component<IGameProps,IGameState>{

    componentWillMount(){
        this.props.gameStore.createNewGame();
    }
    
    formatStatus(cell:ICell){
        if(cell.bomb){
            return <i className='icon icon_mine'></i> 
        }else{
            if(cell.flag){
                return <i className='icon icon_flag'></i> 
            }else{
                if(cell.question){
                    return <i className='icon icon_question'></i> 
                }else{
                    if(cell.showNum && cell.num){
                        return formatColorNum(cell.num)
                    }else{
                        if(cell.used){
                            return <span className='used'></span>
                        }else{
                            return <span className='null'></span>
                        }
                    }
                }
            }
        }
        
    }

    render(){
        
        const { gameStore } = this.props;
        
        const { mineField, } = this.props.gameStore;
        return <div className='game_wrapper'>

            <div className='mine_field'>
                {
                    mineField.map((item:any,index:number)=>{
                        return <div className='tr' key={index}>
                            {
                                item.map((cell:ICell,idx:number)=>{
                                    return <div className='td' key={idx}
                                        onContextMenu={(e)=>{
                                            e.preventDefault();
                                            gameStore.setFlag(index,idx);
                                        }}
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            gameStore.sweepMine(index,idx);
                                        }}
                                        onDoubleClick={(e)=>{
                                            e.preventDefault();
                                            gameStore.doubleClick(index,idx);
                                        }}
                                    >
                                        { this.formatStatus(cell) }
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
            <Button onClick={()=>gameStore.createNewGame()}>重新开始</Button>
        </div>
    }
}

export default Game