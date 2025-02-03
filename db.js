const {MongoClient}=require('mongodb');

let dbcoonection;

module.exports={
    connectToDb:(cb)=>{
        MongoClient.connect('mongodb://0.0.0.0:27017/bookstore')
        .then(Client=>{
            dbcoonection= Client.db();
            cb();
        })
        .catch(error=>{
            console.log(error);
            cb(error);
        })
    },
    getDb:()=>dbcoonection
}
