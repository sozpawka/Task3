new Vue({
	el:'#app',
	data:{
		showModal:false,
		tasks:{
			planned:[],
			progress:[],
			testing:[],
			done:[]
		},

		newTask:{
			title:'',
			description:'',
			deadline:''
		}
	},
	methods:{
		openModal(){
			this.showModal=true
		},
		closeModal(){
			this.showModal=false
		}

	}
})