
import * as mobx from 'mobx';
import RootStore from './rootStore';

const { observable, action, } = mobx;

class MenuStore {
    static className:string = 'menuStore';

    constructor(root:any){
        this.root = root  
    }
    root:any

    /* 
     * 游戏难度：1为简单，2为中等，3为困难
    */
    @observable gameDifficulty:number = 1

    @action changeDifficulty(value:number){
        this.gameDifficulty = value
    }
}

export default MenuStore;