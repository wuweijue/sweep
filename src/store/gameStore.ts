import { observable, action, computed, set, get, autorun,  } from 'mobx';
import { message } from 'antd';
import { FormProvider } from 'antd/lib/form/context';

class GameStore {
    static className: string = 'gameStore'

    constructor(root: any) {
        this.root = root
    }
    root: any

    @observable mineField: any = []

    difficulty: number = 1

    mineMap: any = []

    mineNum: number = 0

    setUsedNum(){
        this.usedNum++;
        if(this.flagNum === this.mineNum && this.usedNum===this.mineField.length*this.mineField.length-this.mineNum){
            message.info('恭喜你获得胜利！')
        }
    }

    @action createNewGame() {
        this.difficulty = this.root.menuStore.gameDifficulty || 1;
        this.init();
    }

    @action init() {
        this.flagNum = 0;
        this.usedNum = 0;
        
        let length = this.difficulty === 1 ? 10 : (this.difficulty === 2 ? 20 : 40);
        let arrY = [];
        for (let i = 0; i < length; i++) {
            let arrX = new Array(length)
            for (let j = 0; j < arrX.length; j++) {
                arrX[j] = {
                    mine: false,
                    num: 0,
                    flag: false,
                    showNum: false,
                    bomb: false,
                    used: false,
                    question: false,
                }
            }
            arrY.push(arrX);
        }
        this.mineField = arrY;
        this.getMineMap();
        console.log(this.mineField)
    }

    mineList:any = []

    getMineMap() {
        let num = this.difficulty === 1 ? 10 : (this.difficulty === 2 ? 40 : 100)
        this.mineNum = num;
        let arr: string[] = [];
        for (let i = 0; i < num; i++) {
            let x = Math.floor(Math.random() * this.mineField.length)
            let y = Math.floor(Math.random() * this.mineField.length)
            if (arr.indexOf(x + ',' + y) < 0) {
                this.mineField[y][x].mine = true
                if (this.mineField[y + 1] && !this.mineField[y + 1][x].mine) {
                    this.mineField[y + 1][x].num++
                }
                if (this.mineField[y + 1] && this.mineField[y + 1][x + 1] && !this.mineField[y + 1][x + 1].mine) {
                    this.mineField[y + 1][x + 1].num++
                }
                if (this.mineField[y + 1] && this.mineField[y + 1][x - 1] && !this.mineField[y + 1][x - 1].mine) {
                    this.mineField[y + 1][x - 1].num++
                }
                if (this.mineField[y][x + 1] && !this.mineField[y][x + 1].mine) {
                    this.mineField[y][x + 1].num++
                }
                if (this.mineField[y][x - 1] && !this.mineField[y][x - 1].mine) {
                    this.mineField[y][x - 1].num++
                }
                if (this.mineField[y - 1] && !this.mineField[y - 1][x].mine) {
                    this.mineField[y - 1][x].num++
                }
                if (this.mineField[y - 1] && this.mineField[y - 1][x + 1] && !this.mineField[y - 1][x + 1].mine) {
                    this.mineField[y - 1][x + 1].num++
                }
                if (this.mineField[y - 1] && this.mineField[y - 1][x - 1] && !this.mineField[y - 1][x - 1].mine) {
                    this.mineField[y - 1][x - 1].num++
                }
                arr.push(x + ',' + y)
            } else {
                i--
            }

        }
        this.mineList = arr;

    }

    flagNum: number = 0

    usedNum: number = 0

    @action setFlag(y: number, x: number) {
        let key = this.mineField[y][x]
        if (key.used) {
            return
        }

        if (this.flagNum > this.mineNum) {
            message.info('棋子数量已经超过地雷数量！');
            return;
        }

        if (!key.flag && !key.question) {
            key.flag = true;
            this.flagNum++;
        } else if (!key.flag && key.question) {
            key.question = false;
        } else if (key.flag && !key.question) {
            key.question = true;
            key.flag = false;
            this.flagNum--;
        }
    }

    cleanSpace(y: number, x: number) {
        let key = this.mineField[y][x]
        if (key.used) {
            return;
        }
        key.used = true;
        this.setUsedNum();

        let direction:any[] = [
            {x:x,y:y+1},
            {x:x,y:y-1},
            {x:x+1,y:y},
            {x:x+1,y:y+1},
            {x:x+1,y:y-1},
            {x:x-1,y:y},
            {x:x-1,y:y+1},
            {x:x-1,y:y-1},
        ]
        let arr:any[] = [];

        const setArr = (key:any,x:number,y:number)=>{
            if(key){
                arr.push({key,x,y})
            }       
        }

        for(let i=0;i<direction.length;i++){
            let key = direction[i],{x,y} = key;
            try{           
                setArr(this.mineField[y][x],x,y);
            }catch{
                // continue;
            }
        }
   
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i];
            if (!key.key.mine && !key.key.num) {
                this.cleanSpace(key.y,key.x)
            } else if (!key.key.mine && key.key.num && !key.key.showNum) {
                key.key.showNum = true;
                key.key.used = true;
                this.setUsedNum();
            }
        }

    }

    @action sweepMine(y: number, x: number) {
        let key = this.mineField[y][x]
        if (key.used) {
            return;
        }
        if (key.mine) {
            key.bomb = true;
            message.error('游戏结束，你输了！');
            return;
        } else if (!key.num) {
            this.cleanSpace(y, x)
        } else if (key.num && !key.showNum) {
            key.showNum = true;
            key.used = true;
            this.setUsedNum();
        }

    }


    /**
     * @param y 雷区矩阵纵坐标
     * @param x 雷区矩阵横坐标
     * 当鼠标双击时，触发展开事件
     */
    @action doubleClick(y: number, x: number) {
        let key = this.mineField[y][x]
        if (!key.num || !key.showNum) {
            return;
        }
        let flag = 0;//周围的棋子数
        let direction:any[] = [
            {x:x,y:y+1},
            {x:x,y:y-1},
            {x:x+1,y:y},
            {x:x+1,y:y+1},
            {x:x+1,y:y-1},
            {x:x-1,y:y},
            {x:x-1,y:y+1},
            {x:x-1,y:y-1},
        ]
        let arr:any[] = [];

        const setArr = (key:any,x:number,y:number)=>{
            if(key){
                arr.push({key,x,y})
                key.flag && flag++
            }       
        }

        for(let i=0;i<direction.length;i++){
            let key = direction[i],{x,y} = key;
            try{           
                setArr(this.mineField[y][x],x,y);
                
            }catch{
                // continue;
            }
        }

        if (flag !== key.num) {
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            let key = arr[i];
            if (key.key.mine && !key.key.flag) {
                key.key.bomb = true;
                message.error('游戏结束，你输了！');
                return;
            }
            if (!key.key.flag && !key.key.used) {
                if (key.key.num) {
                    key.key.showNum = true;
                    key.key.used = true;
                    this.setUsedNum();
                } else {
                    this.cleanSpace(key.y, key.x)
                }
            }
        }
    }
}

export default GameStore;

