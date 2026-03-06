new Vue({
	el:'#app',
	data:{
		showModal:false,
		editIndex:null,
        editColumn: null,
		tasks:{
			planned:[],
			progress:[],
			testing:[],
			done:[]
		},
		newTask:{
			title:'',
			description:'',
			deadline:'',
			createdAt:'',
			updatedAt:''
		}
	},
	methods:{
		openModal(){
			this.showModal=true
		},
		closeModal(){
			this.showModal=false
			this.resetTask()
		},
		createTask(){
			if(!this.newTask.title) return
			const now=new Date().toLocaleString()
			if(this.editIndex===null){
				this.newTask.createdAt=now
				this.tasks.planned.push({...this.newTask})
			}else{
				this.newTask.updatedAt=now
				this.$set(this.tasks.planned,this.editIndex,{...this.newTask})
			}
			this.closeModal()
		},
		editTask(index) {
			let task = this.tasks.planned[index]
			this.newTask = { ...task }
			this.editIndex = index
			this.editColumn = 'planned'
			this.showModal = true
		},
        editProgressTask(index) {
			let task = this.tasks.progress[index]
			this.newTask = { ...task }
			this.editIndex = index
			this.editColumn = 'progress'
			this.showModal = true
		},
		editTestingTask(index) {
			let task = this.tasks.testing[index]
			this.newTask = { ...task }
			this.editIndex = index
			this.editColumn = 'testing'
			this.showModal = true
		},
		deleteTask(index){
			this.tasks.planned.splice(index,1)
		},
		resetTask(){
			this.editIndex=null
			this.newTask={
				title:'',
				description:'',
				deadline:'',
				createdAt:'',
				updatedAt:''
			}
		},
        saveTask(){
			let now=new Date().toLocaleString()
			if(this.editIndex!==null){
				this.tasks.planned[this.editIndex].title=this.newTask.title
				this.tasks.planned[this.editIndex].description=this.newTask.description
				this.tasks.planned[this.editIndex].deadline=this.newTask.deadline
				this.tasks.planned[this.editIndex].updatedAt=now
			}else{
				this.tasks.planned.push({
					title:this.newTask.title,
					description:this.newTask.description,
					deadline:this.newTask.deadline,
					createdAt:now,
					updatedAt:null
				})
			}
			this.newTask.title=''
			this.newTask.description=''
			this.newTask.deadline=''
			this.editIndex=null
			this.showModal=false
		},
        moveToProgress(index){
			let task=this.tasks.planned[index]
			this.tasks.progress.push(task)
			this.tasks.planned.splice(index,1)
		},
		moveToTesting(index){
			let task=this.tasks.progress[index]
			this.tasks.testing.push(task)
			this.tasks.progress.splice(index,1)
		},
		moveToDone(index){
			let task=this.tasks.testing[index]
			this.tasks.done.push(task)
			this.tasks.testing.splice(index,1)
		},
        checkOverdue(task) {
			if (!task.deadline) return false
			return new Date(task.deadline) < new Date()
		},
        returnToProgress(index) {
			let task = this.tasks.testing[index]
			let reason = prompt('Укажите причину возврата задачи в работу:')
			if (!reason) return
			task.returnReason = reason
			this.tasks.progress.push(task)
			this.tasks.testing.splice(index, 1) 
		},
	}
})

