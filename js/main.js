Vue.component('task-card', {
	props: ['task','index','column','isDone'],
	template:`
		<div class="card" :style="{ backgroundImage: 'url(' + task.theme + ')' }">
			<h3>{{task.title}}</h3>
			<p>{{task.description}}</p>
			<div class="meta">
				<p>Создано: {{task.createdAt}}</p>
				<p v-if="task.updatedAt">Редактировано: {{task.updatedAt}}</p>
				<p>Deadline: {{task.deadline}}</p>
				<p v-if="task.returnReason">Причина возврата: {{task.returnReason}}</p>
			</div>
			<button v-if="!isDone" @click="$emit('edit', index)">Редактировать</button>
			<button v-if="column==='planned'" @click="$emit('move', index)">→ В работу</button>
			<button v-if="column==='progress'" @click="$emit('move', index)">→ Тестирование</button>
			<button v-if="column==='testing'" @click="$emit('move-to-done', index)">→ Выполнено</button>
			<button v-if="column==='testing'" @click="$emit('return-to-progress', index)">← Вернуть в работу</button>
			<button v-if="column==='planned'" @click="$emit('delete', index)">Удалить</button>
		</div>
	`
})

Vue.component('task-column',{
	props:['title','tasks','showAddBtn','isDone'],
	template:`
		<div class="column">
			<h2>{{title}}</h2>
			<button v-if="showAddBtn" class="add-btn" @click="$emit('open-modal')">+ Создать задачу</button>
			<task-card 
				v-for="(task,index) in tasks" 
				:key="index" 
				:task="task" 
				:index="index" 
				:column="columnName"
                :is-done="isDone"
				@edit="$emit('edit', $event)"
				@delete="$emit('delete', $event)"
				@move="$emit('move', $event)"
				@move-to-done="$emit('move-to-done', $event)"
				@return-to-progress="$emit('return-to-progress', $event)">
			</task-card>
		</div>
	`,
	computed:{
		columnName(){
			if(this.title==='Запланированные задачи') return 'planned'
			if(this.title==='Задачи в работе') return 'progress'
			if(this.title==='Тестирование') return 'testing'
			if(this.title==='Выполненные задачи') return 'done'
			return ''
		}
	}
})

Vue.component('task-modal', {
	props:['task'],
	template: `
		<div class="modal">
			<div class="modal-content">
				<h3>Создать/Редактировать задачу</h3>
				<input type="text" v-model="task.title" placeholder="Заголовок">
				<textarea v-model="task.description" placeholder="Описание"></textarea>
				<input type="date" v-model="task.deadline">
				<h4>Выбор фона</h4>
				<div class="theme-selector">
					<label v-for="theme in themes" :key="theme.file" style="margin-right:10px">
						<input type="radio" v-model="task.theme" :value="theme.file">
						<img :src="theme.file" :class="{ selected: task.theme === theme.file }" width="50">
					</label>
				</div>
				<div class="modal-buttons">
					<button @click="$emit('save')">Сохранить</button>
					<button @click="$emit('close')">Отмена</button>
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			themes: [
				{ name: 'Orange', file: 'assets/orange.jpg' },
				{ name: 'Blue', file: 'assets/blue.jpg' },
				{ name: 'Gold', file: 'assets/gold.jpg' }
			]
		}
	}
});

new Vue({
	el:'#app',
	data:{
		showModal:false,
		editIndex:null,
		editColumn:null,
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
			updatedAt:'',
			returnReason:''
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
		editTask(index){
			let task=this.tasks.planned[index]
			this.newTask={...task}
			this.editIndex=index
			this.editColumn='planned'
			this.showModal=true
		},
		editProgressTask(index){
			let task=this.tasks.progress[index]
			this.newTask={...task}
			this.editIndex=index
			this.editColumn='progress'
			this.showModal=true
		},
		editTestingTask(index){
			let task=this.tasks.testing[index]
			this.newTask={...task}
			this.editIndex=index
			this.editColumn='testing'
			this.showModal=true
		},
		deleteTask(index){
			this.tasks.planned.splice(index,1)
		},
		resetTask(){
			this.editIndex=null
			this.editColumn=null
			this.newTask={
				title:'',
				description:'',
				deadline:'',
				createdAt:'',
				updatedAt:'',
				returnReason:''
			}
		},
		saveTask(){
			let now=new Date().toLocaleString()
			if(this.editIndex!==null){
				this.tasks[this.editColumn][this.editIndex]={...this.newTask, updatedAt:now}
			}else{
				this.newTask.createdAt=now
				this.tasks.planned.push({...this.newTask})
			}
			this.resetTask()
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
            task.returnReason = '' 
			this.tasks.done.push(task)
			this.tasks.testing.splice(index,1)
		},
		returnToProgress(index){
			let task=this.tasks.testing[index]
			let reason=prompt('Укажите причину возврата задачи в работу:')
			if(!reason) return
			task.returnReason=reason
			this.tasks.progress.push(task)
			this.tasks.testing.splice(index,1)
		}
	}
});