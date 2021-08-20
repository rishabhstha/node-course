const express = require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task= require('./models/task')

const app= express()
const port=process.env.PORT || 3000

app.use(express.json())

//Writing new user
app.post('/users',async(req, res)=>{
    // console.log(req.body)
    // res.send('testing!')

    const user= new User(req.body)
    
     
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

    // const user= new User(req.body)
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
       
    // })
})

//Reading users endpoint
//gets all the users
app.get('/users',async(req,res)=>{
    try{
        const users=await User.find({})
        res.send(users)
    } catch (e){
        res.status(500).send()
    }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

//getting one user
app.get('/users/:id', async (req,res)=>{
    const _id= req.params.id
    // console.log(_id)
    try{
        const user= await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        if(e.name === 'CastError'){
            return res.status(404).send('Invalid id')
        }
       res.status(500).send(e)
    }
    // User.findById(_id).then((user)=>{
    //     // if(!user){
    //     //     return res.status(404).send(user)
    //     // }
    //   res.send(user)
    // }).catch((e)=>{
    //     if(e.name === 'CastError'){
    //         return res.status(404).send('Invalid id')
    //     }
    //     return res.status(500).send(e)
    // })
    
    // console.log(req.params)
})

//Update individual user by id
app.patch('/users/:id', async(req, res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
       return res.status(400).send({error: 'Invalid updates!'}) 
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e){
         if(e.name === 'CastError'){
        return res.status(404).send('Invalid id')
    }
         res.status(500).send(e)
    }
})

app.delete('/users/:id', async(req, res)=>{
    try{
        const user= await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch (e){
        res.status(500).send()
    }
})

//writing one task
app.post('/tasks',async (req, res)=>{

    const task= new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)     
    } catch (e){
        res.status(400).send(e)
    }

    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

// Create an endpoint for fetching all tasks
app.get('/tasks', async(req,res)=>{
    console.log("aye")

    try{
        const tasks= await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//Create an endpoint for fetching task by its id
app.get('/tasks/:id',async (req,res)=>{
    console.log("aye")
    const _id = req.params.id
    console.log(_id)
    try{
        const task= await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)

    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//Create an endpoint to allow for task updates
app.patch('/tasks/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  
        if(!task) {
            return res.status(404).send("Error: Task not found")
        }
        res.send(task)
    } catch (e){
         if(e.name === 'CastError'){
        return res.status(404).send('Invalid id')
    }
         res.status(500).send(e)
    }
})


//Deleting task by id
app.delete('/tasks/:id', async(req, res)=>{
    try{
        const task= await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)  
    } catch(e){
        res.status(500).send(e)
    }
})


app.listen(port, ()=>{
    console.log("Server is up on "+ port)
})