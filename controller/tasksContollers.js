const catchAsync = require("../utils/catchAsync")
const Task = require("../models/tasksModel")
const AppError = require("../utils/AppError")
const  mongoose  = require("mongoose")


module.exports.getTasks = catchAsync(async(req, res,next) => {
    // if(req.params?.group) req.query.group = req.params.group 
    const features =new ApiFeatures(Task.find() , req.query).filter().sort()
    const tasks = await features.query
    res.status(201).json(tasks)
})


module.exports.addTask = catchAsync(async (req, res,next) => {
    const newTask = await Task.create(req.body)
    res.status(201).json(newTask)
})


module.exports.getOneTask = catchAsync( async (req, res,next) => {
    const {id} = req.params
    if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
    const task = await Task.findById(id)
    if(!task) return next(new AppError("No task by this ID", 404))
    res.status(201).json({status: "success",data :task})
})


module.exports.deleteTask = catchAsync( async (req, res,next) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
    const task = await Task.findByIdAndDelete(id)
    if (!task) return next(new AppError("NO SUCH TASK!!",404))
    res.status(201).send("Successfully Deleted!!")
})


module.exports.editTask = catchAsync(async (req, res,next) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
    const task = await Task.findByIdAndUpdate(id, req.body, { runValidators: true })
    if(!task) return next(new AppError("No Such Task", 404))
    res.status(201).json(task)
})