const fs = require("fs")

async function asleep(interval, rInterval = 0){
	return new Promise(async function(res,rej){
		var addInterval = Math.random() * rInterval - (rInterval/2)
		setTimeout(function(){
			res()
		}, interval + addInterval)
	})

}
const watch = {
    file:(target,callback) => {
        let lastCompile = Date.now()
        const threshold = 100
        fs.watch(target,async function(){
            if( Date.now() - lastCompile < threshold ) return
            lastCompile = Date.now() 
            
            callback(fs.readFileSync(target,"utf-8"));
        })
    },
    json:(target,watchKey,callback) => {
        let value = ''
        async function execute(){
            await asleep(10)
            const raw = fs.readFileSync(target,"utf-8");
            
            const json = JSON.parse(raw)
            if(value !== json[watchKey]){
                value = json[watchKey]
                callback(value)
            }
        }
        watch.file(target,execute)
        return {trigger:() => execute()}
    }
}
module.exports = {watch}
