import menuStore from './menuStore';
import gameStore from './gameStore';

class RootStore {
    
    constructor(){
        this.menuStore = new menuStore(this)
        this.gameStore = new gameStore(this)
    }

    menuStore:any
    gameStore:any
}

export default new RootStore()