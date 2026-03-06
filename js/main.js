new Vue({
	el:'#app',
	data:{
		showModal:false,
		editIndex:null,
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
		editTask(index){
			this.editIndex=index
			this.newTask={...this.tasks.planned[index]}
			this.showModal=true
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
		}
	}
})